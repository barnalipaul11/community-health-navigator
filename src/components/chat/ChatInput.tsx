
import React, { useState } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';

interface ChatInputProps {
  isLoading: boolean;
  useGemini: boolean;
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ isLoading, useGemini, onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    onSendMessage(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white">
      <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-healthcare-blue focus-within:border-healthcare-blue transition-all duration-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your symptoms or ask about healthcare services..."
          className="flex-grow px-4 py-2 focus:outline-none text-gray-700"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`px-4 flex items-center justify-center ${isLoading ? 'bg-gray-200' : 'bg-healthcare-blue hover:bg-healthcare-blue-dark'} transition-colors duration-200`}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin text-gray-500" />
          ) : (
            <Send size={18} className="text-white" />
          )}
        </button>
      </div>
      <div className="mt-2 text-xs text-center">
        {useGemini ? (
          <p className="text-gray-500">
            <Sparkles size={12} className="inline mr-1 text-yellow-500" />
            Powered by Gemini AI for enhanced medical information
          </p>
        ) : (
          <p className="text-gray-500">
            This is a demonstration. In a real application, responses would come from an AI service.
          </p>
        )}
      </div>
    </form>
  );
};

export default ChatInput;
