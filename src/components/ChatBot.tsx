
import React, { useState } from 'react';
import { toast } from 'sonner';
import { generateGeminiResponse } from '../utils/geminiAPI';
import { Message, getBasicResponse } from '../utils/chatUtils';
import ChatHeader from './chat/ChatHeader';
import ChatMessageList from './chat/ChatMessageList';
import ChatInput from './chat/ChatInput';
import LocationIndicator from './chat/LocationIndicator';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your medical assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('');
  
  // Initialize with Gemini API enabled by default
  const [useGemini, setUseGemini] = useState(true);

  const toggleGemini = () => {
    setUseGemini(!useGemini);
    toast(useGemini ? "Switched to basic responses" : "Switched to Gemini AI for enhanced responses");
  };

  const handleSendMessage = async (input: string) => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Check for location in user message
    if (input.toLowerCase().includes('location') || input.toLowerCase().includes('zip')) {
      const zipMatch = input.match(/\b\d{5}\b/);
      if (zipMatch) {
        setLocation(zipMatch[0]);
      }
    }

    try {
      if (useGemini) {
        // Use Gemini API for more complex responses
        console.log('Using Gemini API for response');
        const geminiResponse = await generateGeminiResponse(input);
        
        if (geminiResponse.error) {
          console.error('Gemini API error:', geminiResponse.error);
          toast.error(geminiResponse.error);
          
          // Fallback to basic response
          const basicResponse = getBasicResponse(input, location);

          // Add basic fallback response
          const fallbackMessage: Message = {
            content: basicResponse + "\n\n(Note: Gemini AI failed to respond, falling back to basic response)",
            sender: 'bot',
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, fallbackMessage]);
        } else {
          console.log('Gemini response received:', geminiResponse.text);
          // Add Gemini response
          const botMessage: Message = {
            content: geminiResponse.text,
            sender: 'bot',
            timestamp: new Date(),
            isGeminiResponse: true
          };
          
          setMessages(prev => [...prev, botMessage]);
        }
      } else {
        console.log('Using basic response logic');
        // Use basic response logic
        setTimeout(() => {
          const botResponse = getBasicResponse(input, location);

          const botMessage: Message = {
            content: botResponse,
            sender: 'bot',
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, botMessage]);
        }, 1000);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      toast.error("An error occurred while processing your message");
      
      // Add error message
      const errorMessage: Message = {
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-scale-in">
      <ChatHeader useGemini={useGemini} toggleGemini={toggleGemini} />
      <ChatMessageList messages={messages} isLoading={isLoading} useGemini={useGemini} />
      <LocationIndicator location={location} />
      <ChatInput isLoading={isLoading} useGemini={useGemini} onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatBot;
