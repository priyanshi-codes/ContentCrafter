// Agent platform constants (replaces TypeScript enum)
export const AgentPlatform = {
  GEMINI: 'gemini',
  WRITING_ASSISTANT: 'writing_assistant',
};

// AIAgent interface (JSDoc definition - runtime validation)
/**
 * @typedef {Object} AIAgent
 * @property {Object} [user] - Optional user object
 * @property {Object} channel - Stream Chat channel
 * @property {Object} StreamChat - Stream Chat client
 * @property {Function} getLastInteraction - Returns last interaction timestamp
 * @property {Function} init - Initialize the agent
 * @property {Function} dispose - Cleanup agent resources
 */
export const AIAgent = {};

// WritingMessage interface (JSDoc definition)
/**
 * @typedef {Object} WritingMessage
 * @property {Object} [custom] - Custom message metadata
 * @property {string[]} [custom.suggestions] - Writing suggestions
 * @property {string} [custom.writingTask] - Current writing task
 * @property {string} [custom.messageType] - Type of message
 */
export const WritingMessage = {};

export default {
  AgentPlatform,
};
