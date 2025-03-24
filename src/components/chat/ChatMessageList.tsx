
import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';
import { Message } from '../../utils/chatUtils';

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  useGemini: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isLoading, useGemini }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            content={message.content}
            sender={message.sender}
            timestamp={message.timestamp}
            isGeminiResponse={message.isGeminiResponse}
          />
        ))}
        
        {isLoading && <LoadingIndicator useGemini={useGemini} />}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessageList;
