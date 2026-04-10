export const WritingPromptsToolbar = ({ onPromptSelect = () => {} }) => {
  const prompts = [
    "Write a blog post about...",
    "Create a social media post about...",
    "Draft an email for...",
    "Write a product description for...",
  ];

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-gray-700 bg-gray-800/50">
      {prompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onPromptSelect(prompt)}
          className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-teal-300 rounded-md border border-gray-600 hover:border-teal-400 transition-colors"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};
