
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  useGemini: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ useGemini }) => {
  return (
    <div className="flex justify-start">
      <div className="bg-white text-gray-800 px-4 py-3 rounded-lg shadow-sm border border-gray-100 rounded-tl-none">
        <div className="flex items-center">
          <Loader2 size={16} className="animate-spin text-healthcare-blue mr-2" />
          <span>{useGemini ? 'Gemini AI is processing your query...' : 'Analyzing your request...'}</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
