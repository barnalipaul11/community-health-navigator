
import React from 'react';
import { Sparkles, Stethoscope, User } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isGeminiResponse?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, sender, timestamp, isGeminiResponse }) => {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        max-w-[80%] px-4 py-3 rounded-lg 
        ${sender === 'user' 
          ? 'bg-healthcare-blue text-white rounded-tr-none' 
          : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
        }
      `}>
        <div className="flex items-center mb-1">
          {sender === 'bot' ? (
            <>
              {isGeminiResponse ? (
                <Sparkles size={14} className="mr-1 text-yellow-500" />
              ) : (
                <Stethoscope size={14} className="mr-1 text-healthcare-blue" />
              )}
              <span className="text-xs opacity-70">
                {isGeminiResponse ? 'Gemini AI' : 'Medical Assistant'} • {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </>
          ) : (
            <>
              <User size={14} className="mr-1" />
              <span className="text-xs opacity-70">
                You • {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </>
          )}
        </div>
        <p className="whitespace-pre-line">{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
