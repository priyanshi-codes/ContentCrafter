import { Router } from 'express';
import { generateChatContent, generateContentWithContext } from '../controllers/ai.controller.js';

const router = Router();

// Basic content generation
router.post('/generate/chat', generateChatContent);

// Content generation with conversation context
router.post('/generate/context', generateContentWithContext);

// Health check for AI service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: "AI service is running",
    timestamp: new Date().toISOString()
  });
});

export default router;