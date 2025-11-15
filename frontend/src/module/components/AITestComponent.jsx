import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { aiService } from '../services/api';
import { toast } from 'sonner';
import { Loader2, Bot, CheckCircle, AlertCircle } from 'lucide-react';

const AITestComponent = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);

  const testPrompts = [
    "Write a blog post about the benefits of AI in content creation",
    "Create a professional email introducing our new product",
    "Write social media captions for a tech startup launch",
    "Draft a marketing copy for an eco-friendly product"
  ];

  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    try {
      const result = await aiService.generateChatContent(prompt, {
        contentType: 'blog',
        tone: 'professional',
        audience: 'general'
      });

      if (result.success && result.data) {
        setResponse(result.data.content);
        toast.success('Content generated successfully!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error(error.message || 'Failed to generate content');
      setResponse('');
    } finally {
      setIsLoading(false);
    }
  };

  const checkAIHealth = async () => {
    try {
      const result = await aiService.checkHealth();
      setHealthStatus(result);
      
      if (result.success) {
        toast.success('AI service is healthy');
      } else {
        toast.error('AI service is not responding');
      }
    } catch (error) {
      setHealthStatus({ success: false, error: error.message });
      toast.error('Failed to check AI service health');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Backend Integration Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Health Check */}
          <div className="flex items-center gap-4">
            <Button onClick={checkAIHealth} variant="outline" size="sm">
              Check AI Health
            </Button>
            {healthStatus && (
              <Badge variant={healthStatus.success ? "default" : "destructive"}>
                {healthStatus.success ? (
                  <><CheckCircle className="h-3 w-3 mr-1" /> Healthy</>
                ) : (
                  <><AlertCircle className="h-3 w-3 mr-1" /> Error</>
                )}
              </Badge>
            )}
          </div>

          {/* Quick Test Prompts */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Test Prompts:</label>
            <div className="flex flex-wrap gap-2">
              {testPrompts.map((testPrompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(testPrompt)}
                  className="text-xs"
                >
                  Test {index + 1}
                </Button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Enter your prompt:</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your content generation prompt here..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerateContent} 
            disabled={isLoading || !prompt.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Content...
              </>
            ) : (
              'Generate Content'
            )}
          </Button>

          {/* Response Display */}
          {response && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Generated Content:</label>
              <Card>
                <CardContent className="p-4">
                  <div className="whitespace-pre-wrap text-sm">
                    {response}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AITestComponent;