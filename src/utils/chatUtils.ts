
interface Message {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isGeminiResponse?: boolean;
}

// Define our sample responses for basic mode
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

export const getBasicResponse = (userMessage: string, location?: string): string => {
  let botResponse = "I'm processing your request. Could you provide more details about your situation?";
  
  // Check for matches in sample responses
  for (const sample of sampleResponses) {
    if (userMessage.toLowerCase().includes(sample.trigger)) {
      botResponse = sample.response;
      break;
    }
  }

  // If location is set and message contains hospital or facility
  if (location && (userMessage.toLowerCase().includes('hospital') || userMessage.toLowerCase().includes('facility'))) {
    botResponse = `Based on your location, here are some nearby healthcare facilities:\n\n1. Community General Hospital\n• 5 miles away\n• Emergency services available\n• Accepts most insurance plans\n• Currently has 12 available beds\n\n2. Westside Medical Center\n• 7.2 miles away\n• Specialized in cardiology and neurology\n• Limited emergency services\n• Accepts Medicare/Medicaid`;
  }

  // If location is set and message contains camp or vaccine
  if (location && (userMessage.toLowerCase().includes('camp') || userMessage.toLowerCase().includes('vaccine'))) {
    botResponse = `Here are upcoming health camps and vaccine drives near you:\n\n1. Annual Flu Vaccine Drive\n• Date: October 15, 2023\n• Time: 9AM - 4PM\n• Location: Community Center\n• Free for seniors and children\n\n2. Diabetes Screening Camp\n• Date: November 5, 2023\n• Time: 10AM - 2PM\n• Location: Public Library\n• Free for all residents`;
  }

  return botResponse;
};

export { type Message, sampleResponses };
