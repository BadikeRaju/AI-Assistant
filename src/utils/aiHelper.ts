import axios from 'axios';

// Primary model - same as ChatAssistant
const PRIMARY_MODEL = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct";
const FALLBACK_MODEL = "https://api-inference.huggingface.co/models/google/flan-t5-large";
const LAST_RESORT_MODEL = "https://api-inference.huggingface.co/models/google/flan-t5-small";

// Add retry logic and better error handling
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateAIResponse = async (userInput: string): Promise<string> => {
  let lastError: any = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Check if input is empty
      if (!userInput.trim()) {
        return "I didn't catch that. Could you please speak again?";
      }

      // Try primary model first
      try {
        const response = await axios.post(
          PRIMARY_MODEL,
          {
            inputs: `<|system|>
You are DevAssist, a personalized AI learning mentor and productivity assistant. Your goal is to help the user improve their skills, manage their time effectively, and make progress on their learning journey.

When asked for guidance, you will:
1. Suggest specific learning paths and resources
2. Recommend pomodoro sessions and break timing
3. Help prioritize learning topics based on importance
4. Provide motivational support
5. Recommend skill-building activities

Be specific, practical, and supportive.
<|user|>
${userInput}
<|assistant|>`,
            parameters: {
              max_new_tokens: 250,
              temperature: 0.7,
              top_p: 0.9,
              do_sample: true
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            timeout: 15000, // 15 second timeout
          }
        );

        if (response.data) {
          let aiResponse = '';
          
          // Parse different response formats
          if (typeof response.data === 'string') {
            aiResponse = response.data;
          } else if (Array.isArray(response.data)) {
            aiResponse = response.data[0].generated_text || '';
          } else {
            aiResponse = response.data.generated_text || '';
          }
          
          // Extract only the assistant's response
          const assistantPart = aiResponse.split('<|assistant|>').pop() || '';
          
          // Clean up any trailing system/user markers
          const cleanedResponse = assistantPart
            .split('<|system|>')[0]
            .split('<|user|>')[0]
            .trim();
          
          return cleanedResponse;
        }
      } catch (primaryError) {
        console.log('Primary model failed, trying fallback...');
        
        // Try fallback model
        try {
          const fallbackResponse = await axios.post(
            FALLBACK_MODEL,
            {
              inputs: `You are a learning mentor and productivity assistant. Provide specific, actionable advice for this question: ${userInput}`,
              parameters: {
                max_new_tokens: 150,
                temperature: 0.7
              }
            },
            {
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json',
              },
              timeout: 15000,
            }
          );

          if (fallbackResponse.data) {
            const fallbackText = typeof fallbackResponse.data === 'string' 
              ? fallbackResponse.data 
              : (Array.isArray(fallbackResponse.data) ? fallbackResponse.data[0].generated_text : fallbackResponse.data.generated_text);
            
            return fallbackText.trim();
          }
        } catch (fallbackError) {
          console.log('Fallback model failed, trying last resort...');
          
          // Try last resort model
          const lastResortResponse = await axios.post(
            LAST_RESORT_MODEL,
            {
              inputs: `You are a learning assistant. Give a brief helpful answer to: ${userInput}`,
            },
            {
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json',
              },
              timeout: 15000,
            }
          );

          if (lastResortResponse.data) {
            const lastResortText = Array.isArray(lastResortResponse.data) 
              ? lastResortResponse.data[0].generated_text 
              : lastResortResponse.data.generated_text;
            
            return lastResortText.trim();
          }
        }
      }

      return "I understand, but I'm not sure how to respond to that.";

    } catch (error: any) {
      lastError = error;
      
      // Check if it's a model loading error
      if (error.response?.status === 503) {
        const isModelLoading = error.response?.data?.error?.includes('Loading');
        if (isModelLoading && attempt < MAX_RETRIES - 1) {
          await sleep(RETRY_DELAY);
          continue;
        }
      }

      // Check for specific error types
      if (error.response?.status === 401) {
        console.error('Authentication error: Invalid API key');
        return "I'm having trouble authenticating with my AI service. Please check the API key configuration.";
      }

      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout');
        return "I'm taking too long to think. Please try again.";
      }

      if (!navigator.onLine) {
        return "I can't connect to the internet. Please check your connection.";
      }

      // If we've tried all attempts, throw the error
      if (attempt === MAX_RETRIES - 1) {
        console.error('Error generating AI response:', error);
        throw error;
      }

      // Wait before retrying
      await sleep(RETRY_DELAY);
    }
  }

  // If we get here, all retries failed
  console.error('All retries failed:', lastError);
  return "I'm having trouble thinking right now. Please try again in a moment.";
}; 