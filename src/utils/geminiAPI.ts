
// A placeholder for the Gemini API key
// In a production app, this should be handled securely via environment variables or Supabase Secrets
let geminiApiKey = 'AIzaSyCmgxi0ZIv_2n4ax-umI2i7wPhvZ5hYG1g';

export const setGeminiApiKey = (apiKey: string) => {
  geminiApiKey = apiKey;
};

export const getGeminiApiKey = () => {
  return geminiApiKey;
};

interface GeminiResponse {
  text: string;
  error?: string;
}

export const generateGeminiResponse = async (prompt: string): Promise<GeminiResponse> => {
  if (!geminiApiKey) {
    return {
      text: '',
      error: 'API key not set. Please provide a valid Gemini API key.'
    };
  }

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a medical assistant providing healthcare information. 
                       Answer this question with detailed information, recommendations 
                       and precautions where applicable: ${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        text: '',
        error: `API Error: ${errorData.error?.message || 'Unknown error'}`
      };
    }

    const data = await response.json();
    
    // Extract the response text from the Gemini API response
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                         'Sorry, I was unable to generate a response.';
    
    return { text: responseText };
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    return {
      text: '',
      error: `Failed to generate response: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
