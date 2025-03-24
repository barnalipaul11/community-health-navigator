
import React from 'react';
import { Stethoscope, Sparkles } from 'lucide-react';

interface ChatHeaderProps {
  useGemini: boolean;
  toggleGemini: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ useGemini, toggleGemini }) => {
  return (
    <div className="bg-healthcare-blue text-white p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Stethoscope className="mr-2" />
        <div>
          <h2 className="font-semibold">Medical Assistant</h2>
          <p className="text-xs opacity-80">Available 24/7 for your health concerns</p>
        </div>
      </div>
      <button 
        onClick={toggleGemini}
        className={`flex items-center px-3 py-1 rounded text-xs ${useGemini ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
      >
        <Sparkles size={14} className="mr-1" />
        {useGemini ? 'Using Gemini AI' : 'Basic Mode'}
      </button>
    </div>
  );
};

export default ChatHeader;
