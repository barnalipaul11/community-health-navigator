
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MapPin, User, Stethoscope, Sparkles, AlertTriangle } from 'lucide-react';
import { generateGeminiResponse, getGeminiApiKey, setGeminiApiKey } from '../utils/geminiAPI';
import { toast } from 'sonner';

interface Message {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isGeminiResponse?: boolean;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your medical assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const [showApiKeyInput, setShowApiKeyInput] = useState(!getGeminiApiKey());
  const [useGemini, setUseGemini] = useState(Boolean(getGeminiApiKey()));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample responses - in a real app, these would come from an AI service
  const sampleResponses = [
    { 
      trigger: 'headache', 
      response: "I understand you're experiencing a headache. For immediate relief, try: 1) Rest in a quiet, dark room, 2) Apply a cold pack to your forehead, 3) Take over-the-counter pain relievers like acetaminophen if appropriate for you. If your headache is severe, sudden, or accompanied by fever, confusion, stiff neck, or vision changes, please seek medical attention immediately."
    },
    { 
      trigger: 'fever', 
      response: "I notice you mentioned a fever. Here are some first aid tips: 1) Stay hydrated by drinking plenty of fluids, 2) Take appropriate fever reducers like acetaminophen if suitable for you, 3) Rest and dress lightly. If your fever is above 103°F (39.4°C), lasts more than 3 days, or is accompanied by severe symptoms, please seek medical care right away."
    },
    { 
      trigger: 'hospital', 
      response: "I can help find healthcare facilities near you. Please share your location or zip code so I can provide specific recommendations."
    },
    { 
      trigger: 'camps', 
      response: "I'd be happy to inform you about medical camps in your area. Please share your location so I can provide accurate information about upcoming health camps and vaccine drives."
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      setGeminiApiKey(apiKey.trim());
      setUseGemini(true);
      setShowApiKeyInput(false);
      toast.success("API key saved! Gemini AI is now active.");
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  const toggleApiKeyInput = () => {
    setShowApiKeyInput(!showApiKeyInput);
  };

  const toggleGemini = () => {
    if (!getGeminiApiKey() && !useGemini) {
      setShowApiKeyInput(true);
      return;
    }
    setUseGemini(!useGemini);
    toast(useGemini ? "Switched to basic responses" : "Switched to Gemini AI for enhanced responses");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Check for location in user message
    if (userMessage.content.includes('location') || userMessage.content.includes('zip')) {
      setLocation(userMessage.content.replace(/[^0-9]/g, ''));
    }

    try {
      if (useGemini && getGeminiApiKey()) {
        // Use Gemini API for more complex responses
        const geminiResponse = await generateGeminiResponse(userMessage.content);
        
        if (geminiResponse.error) {
          toast.error(geminiResponse.error);
          
          // Fallback to basic response
          let basicResponse = "I'm processing your request. Could you provide more details about your situation?";
          
          // Check for matches in sample responses as fallback
          for (const sample of sampleResponses) {
            if (userMessage.content.toLowerCase().includes(sample.trigger)) {
              basicResponse = sample.response;
              break;
            }
          }

          // Add basic fallback response
          const fallbackMessage: Message = {
            content: basicResponse + "\n\n(Note: Gemini AI failed to respond, falling back to basic response)",
            sender: 'bot',
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, fallbackMessage]);
        } else {
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
        // Use basic response logic
        setTimeout(() => {
          let botResponse = "I'm processing your request. Could you provide more details about your situation?";
          
          // Check for matches in sample responses
          for (const sample of sampleResponses) {
            if (userMessage.content.toLowerCase().includes(sample.trigger)) {
              botResponse = sample.response;
              break;
            }
          }

          // If location is set and message contains hospital or facility
          if (location && (userMessage.content.toLowerCase().includes('hospital') || userMessage.content.toLowerCase().includes('facility'))) {
            botResponse = `Based on your location, here are some nearby healthcare facilities:\n\n1. Community General Hospital\n• 5 miles away\n• Emergency services available\n• Accepts most insurance plans\n• Currently has 12 available beds\n\n2. Westside Medical Center\n• 7.2 miles away\n• Specialized in cardiology and neurology\n• Limited emergency services\n• Accepts Medicare/Medicaid`;
          }

          // If location is set and message contains camp or vaccine
          if (location && (userMessage.content.toLowerCase().includes('camp') || userMessage.content.toLowerCase().includes('vaccine'))) {
            botResponse = `Here are upcoming health camps and vaccine drives near you:\n\n1. Annual Flu Vaccine Drive\n• Date: October 15, 2023\n• Time: 9AM - 4PM\n• Location: Community Center\n• Free for seniors and children\n\n2. Diabetes Screening Camp\n• Date: November 5, 2023\n• Time: 10AM - 2PM\n• Location: Public Library\n• Free for all residents`;
          }

          const botMessage: Message = {
            content: botResponse,
            sender: 'bot',
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, botMessage]);
        }, 1500);
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
      {/* Chat header */}
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

      {/* API Key Input Dialog */}
      {showApiKeyInput && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col">
            <div className="flex items-start mb-2">
              <AlertTriangle size={16} className="text-yellow-500 mr-2 mt-1" />
              <p className="text-sm text-gray-700">
                Please enter your Gemini API key to enable advanced AI responses. 
                <a 
                  href="https://ai.google.dev/tutorials/setup" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-healthcare-blue hover:underline ml-1"
                >
                  Get an API key
                </a>
              </p>
            </div>
            <div className="flex">
              <input
                type="password"
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="Enter Gemini API key"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-healthcare-blue"
              />
              <button
                onClick={saveApiKey}
                className="px-4 py-2 bg-healthcare-blue text-white rounded-r hover:bg-healthcare-blue-dark"
              >
                Save
              </button>
            </div>
            <button 
              onClick={toggleApiKeyInput}
              className="text-xs text-gray-500 hover:text-gray-700 mt-2 self-end"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[80%] px-4 py-3 rounded-lg 
                ${message.sender === 'user' 
                  ? 'bg-healthcare-blue text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                }
              `}>
                <div className="flex items-center mb-1">
                  {message.sender === 'bot' ? (
                    <>
                      {message.isGeminiResponse ? (
                        <Sparkles size={14} className="mr-1 text-yellow-500" />
                      ) : (
                        <Stethoscope size={14} className="mr-1 text-healthcare-blue" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.isGeminiResponse ? 'Gemini AI' : 'Medical Assistant'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </>
                  ) : (
                    <>
                      <User size={14} className="mr-1" />
                      <span className="text-xs opacity-70">
                        You • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </>
                  )}
                </div>
                <p className="whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 px-4 py-3 rounded-lg shadow-sm border border-gray-100 rounded-tl-none">
                <div className="flex items-center">
                  <Loader2 size={16} className="animate-spin text-healthcare-blue mr-2" />
                  <span>{useGemini ? 'Gemini AI is thinking...' : 'Analyzing your query...'}</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Location indicator */}
      {location && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center">
          <MapPin size={16} className="text-healthcare-blue mr-1" />
          <span className="text-sm text-gray-600">Using location: {location}</span>
        </div>
      )}

      {/* Chat input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white">
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
    </div>
  );
};

export default ChatBot;
