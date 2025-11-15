import geminiService from '../services/geminiService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const generateChatContent = asyncHandler(async (req, res) => {
  try {
    const { prompt, contentType = 'general', tone = 'professional', audience = 'general' } = req.body;
    
    if (!prompt || prompt.trim().length === 0) {
      throw new ApiError(400, "Prompt is required and cannot be empty");
    }

    // Enhance the prompt with context
    const enhancedPrompt = `
Content Type: ${contentType}
Target Audience: ${audience}
Tone: ${tone}

User Request: ${prompt}

Please create high-quality, engaging content that matches the specified requirements. 
Make it actionable and valuable for the target audience. 
Format the response with proper structure and ensure it's ready to use.
    `;

    const result = await geminiService.generateContent(enhancedPrompt, { contentType });
    
    if (!result || !result.content) {
      throw new ApiError(500, "Failed to generate content");
    }

    return res.status(200).json(
      new ApiResponse(200, {
        content: result.content,
        prompt: prompt,
        metadata: {
          ...result.metadata,
          contentType,
          tone,
          audience,
        }
      }, result.metadata?.isFallback ? "Content generated (demo mode - quota limited)" : "Content generated successfully")
    );

  } catch (error) {
    console.error('Chat generation error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(500, `Failed to generate content: ${error.message}`);
  }
});

export const generateContentWithContext = asyncHandler(async (req, res) => {
  try {
    const { 
      prompt, 
      previousMessages = [], 
      contentType = 'general',
      maxLength,
      includeExamples = false
    } = req.body;
    
    if (!prompt) {
      throw new ApiError(400, "Prompt is required");
    }

    // Build context from previous messages
    let contextPrompt = '';
    if (previousMessages.length > 0) {
      contextPrompt = `Previous conversation context:\n${previousMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\n`;
    }

    // Create comprehensive prompt
    const fullPrompt = `${contextPrompt}Current request: ${prompt}

Please provide a ${contentType} response${maxLength ? ` in approximately ${maxLength} words` : ''}${includeExamples ? ' with relevant examples' : ''}.`;

    const generatedContent = await geminiService.generateContent(fullPrompt);
    
    return res.status(200).json(
      new ApiResponse(200, {
        content: generatedContent,
        context: {
          prompt,
          previousMessages: previousMessages.slice(-5), // Keep last 5 messages for context
          contentType,
          generatedAt: new Date().toISOString()
        }
      }, "Contextual content generated successfully")
    );

  } catch (error) {
    console.error('Contextual generation error:', error);
    throw new ApiError(500, `Failed to generate contextual content: ${error.message}`);
  }
});