import OpenAI from 'openai';

/**
 * Handles streaming responses from OpenAI Assistant API
 * Manages message updates, tool execution, and error handling
 */
export class OpenAIResponseHandler {
  constructor(
    openai,
    openaiThread,
    assistantStream,
    chatClient,
    channel,
    message,
    onDispose
  ) {
    this.openai = openai;
    this.openaiThread = openaiThread;
    this.assistantStream = assistantStream;
    this.chatClient = chatClient;
    this.channel = channel;
    this.message = message;
    this.onDispose = onDispose;

    // Internal state
    this.messageText = '';
    this.chunkCounter = 0;
    this.runId = '';
    this.isDone = false;
    this.lastUpdateTime = 0;

    // Bind event handlers to preserve context
    this.handleStopGenerating = this.handleStopGenerating.bind(this);
    this.handleStreamEvent = this.handleStreamEvent.bind(this);

    // Listen for stop events from client
    this.chatClient.on('ai_indicator.stop', this.handleStopGenerating);
  }

  /**
   * Main run loop for streaming assistant responses
   */
  async run() {
    const { cid, id: messageId } = this.message;
    let isCompleted = false;
    let toolOutputs = [];
    let currentStream = this.assistantStream;

    try {
      while (!isCompleted) {
        // Process events from current stream
        for await (const event of currentStream) {
          await this.handleStreamEvent(event);

          // Check if assistant needs tool outputs
          if (
            event.event === 'thread.run.requires_action' &&
            event.data.required_action?.type === 'submit_tool_outputs'
          ) {
            this.runId = event.data.id;
            await this.channel.sendEvent({
              type: 'ai_indicator.update',
              ai_state: 'AI_STATE_EXTERNAL_SOURCES',
              cid,
              message_id: messageId,
            });

            const toolCalls =
              event.data.required_action.submit_tool_outputs.tool_calls;
            toolOutputs = [];

            // Execute each tool call
            for (const toolCall of toolCalls) {
              if (toolCall.function.name === 'web_search') {
                try {
                  const args = JSON.parse(toolCall.function.arguments);
                  const searchResult = await this.performWebSearch(args.query);
                  toolOutputs.push({
                    tool_call_id: toolCall.id,
                    output: searchResult,
                  });
                } catch (e) {
                  console.error(
                    'Error parsing tool arguments or performing web search',
                    e
                  );
                  toolOutputs.push({
                    tool_call_id: toolCall.id,
                    output: JSON.stringify({ error: 'failed to call tool' }),
                  });
                }
              }
            }
            // Exit inner loop to submit tool outputs
            break;
          }

          // Check completion
          if (event.event === 'thread.run.completed') {
            isCompleted = true;
            break;
          }

          // Check for run failures
          if (event.event === 'thread.run.failed') {
            isCompleted = true;
            await this.handleError(
              new Error(event.data.last_error?.message ?? 'Run failed')
            );
            break;
          }
        }

        if (isCompleted) {
          break;
        }

        // Submit tool outputs if any
        if (toolOutputs.length > 0) {
          currentStream = this.openai.beta.threads.runs.submitToolOutputsStream(
            this.runId,
            {
              tool_outputs: toolOutputs,
              thread_id: this.openaiThread.id,
            }
          );
          toolOutputs = [];
        }
      }
    } catch (error) {
      console.error('An error occurred during the run:', error);
      await this.handleError(error);
    } finally {
      await this.dispose();
    }
  }

  /**
   * Cleanup resources and event listeners
   */
  async dispose() {
    if (this.isDone) {
      return;
    }
    this.isDone = true;
    this.chatClient.off('ai_indicator.stop', this.handleStopGenerating);
    this.onDispose();
  }

  /**
   * Handle stop generation request from client
   */
  async handleStopGenerating(event) {
    if (this.isDone || event.message_id !== this.message.id) {
      return;
    }
    console.log(`Stopping generation for message ${this.message.id}`);
    if (!this.openai || !this.openaiThread || !this.runId) {
      return;
    }

    try {
      // Cancel the thread run
      await this.openai.beta.threads.runs.cancel(this.runId, {
        thread_id: this.openaiThread.id,
      });
    } catch (error) {
      console.error('Error cancelling the OpenAI thread run', error);
    }

    await this.channel.sendEvent({
      type: 'ai_indicator.clear',
      cid: this.message.cid,
      message_id: this.message.id,
    });
    await this.dispose();
  }

  /**
   * Process individual stream events from OpenAI
   */
  async handleStreamEvent(event) {
    const { cid, id } = this.message;

    if (event.event === 'thread.run.created') {
      this.runId = event.data.id;
    } else if (event.event === 'thread.message.delta') {
      // Accumulate message text deltas
      const textDelta = event.data.delta.content?.[0];
      if (textDelta?.type === 'text' && textDelta.text) {
        this.messageText += textDelta.text.value || '';
        const now = Date.now();
        // Update message every 1 second to avoid excessive updates
        if (now - this.lastUpdateTime > 1000) {
          await this.chatClient.partialUpdateMessage(id, {
            set: { text: this.messageText },
          });
          this.lastUpdateTime = now;
        }
        this.chunkCounter += 1;
      }
    } else if (event.event === 'thread.message.completed') {
      // Final message received
      const finalText =
        event.data.content[0]?.type === 'text'
          ? event.data.content[0].text.value
          : this.messageText;
      await this.chatClient.partialUpdateMessage(id, {
        set: { text: finalText },
      });
      await this.channel.sendEvent({
        type: 'ai_indicator.clear',
        cid,
        message_id: id,
      });
    } else if (event.event === 'thread.run.step.created') {
      // Step created (tool call or message generation)
      if (event.data.step_details.type === 'message_creation') {
        await this.channel.sendEvent({
          type: 'ai_indicator.update',
          ai_state: 'AI_STATE_GENERATING',
          cid,
          message_id: id,
        });
      }
    }
  }

  /**
   * Handle errors during streaming
   */
  async handleError(error) {
    if (this.isDone) {
      return;
    }

    await this.channel.sendEvent({
      type: 'ai_indicator.update',
      ai_state: 'AI_STATE_ERROR',
      cid: this.message.cid,
      message_id: this.message.id,
    });
    await this.chatClient.partialUpdateMessage(this.message.id, {
      set: {
        text: error.message ?? 'Error generating the message',
        message: error.toString(),
      },
    });
    await this.dispose();
  }

  /**
   * Perform web search using Tavily API
   * @param {string} query - Search query
   * @returns {Promise<string>} JSON stringified search results
   */
  async performWebSearch(query) {
    const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
    if (!TAVILY_API_KEY) {
      return JSON.stringify({
        error: 'Web search is not available, API key not configured',
      });
    }

    console.log(`Performing a web search for query: ${query}`);
    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TAVILY_API_KEY}`,
        },
        body: JSON.stringify({
          query,
          search_depth: 'advanced',
          max_results: 5,
          include_answer: true,
          include_raw_content: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log(
          `Tavily search failed for query: ${query} with status ${response.status} and message ${errorText}`
        );
        return JSON.stringify({
          error: `Web search failed with status ${response.status}`,
        });
      }

      const data = await response.json();
      console.log(`Tavily search successful for query: ${query}`);
      return JSON.stringify(data);
    } catch (error) {
      console.error(
        `Error occurred during Tavily search for query: ${query}`,
        error
      );
      return JSON.stringify({
        error: 'An error occurred while performing the web search',
      });
    }
  }
}
