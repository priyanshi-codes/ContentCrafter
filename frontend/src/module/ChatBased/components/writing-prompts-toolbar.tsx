import React from "react";

export const WritingPromptsToolbar: React.FC<{ onPromptSelect?: (prompt: string) => void }> = ({ 
  onPromptSelect 
}) => {
  const prompts = [
    "Write a blog post about...",
    "Create a social media post about...",
    "Draft an email for...",
    "Write a product description for...",
  ];

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b">
      {prompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onPromptSelect?.(prompt)}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};