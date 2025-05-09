import React, { createContext, useContext, useState } from 'react';
import { HfInference } from '@huggingface/inference';

interface AIContextType {
  isProcessing: boolean;
  sendMessage: (message: string) => Promise<string>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

// Validate API key is present
if (!HUGGINGFACE_API_KEY) {
  console.error('Missing Hugging Face API key. Please check your .env file.');
}

const hf = new HfInference(HUGGINGFACE_API_KEY);

// Store conversation history
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      role: 'system',
      content: `You are DevAssist, a personalized AI learning mentor and productivity assistant. 
      Your goal is to help the user improve their skills, manage their time effectively, and make progress on their learning journey.
      
      When asked for guidance:
      1. Suggest specific learning paths or resources that match the user's interests
      2. Recommend when to take breaks or practice pomodoro sessions for better focus
      3. Help prioritize learning topics and projects based on importance and urgency
      4. Provide motivational support and accountability check-ins
      5. Recommend skill-building activities that match the user's current goals
      
      Always be specific, action-oriented, and supportive. Don't just repeat the user's questions.
      Provide actionable advice they can implement immediately.`
    }
  ]);

  const sendMessage = async (message: string): Promise<string> => {
    setIsProcessing(true);
    try {
      if (!HUGGINGFACE_API_KEY) {
        throw new Error('Invalid Hugging Face API key configuration');
      }

      // Add user message to history
      const userMessage: Message = { role: 'user', content: message };
      const updatedHistory = [...conversationHistory, userMessage];
      setConversationHistory(updatedHistory);

      // Format conversation for the model
      const formattedPrompt = updatedHistory.map(msg => {
        if (msg.role === 'system') return `<|system|>\n${msg.content}\n`;
        if (msg.role === 'user') return `<|user|>\n${msg.content}\n`;
        return `<|assistant|>\n${msg.content}\n`;
      }).join('') + '<|assistant|>\n';

      // Use a more powerful model
      const response = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          },
          body: JSON.stringify({ 
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
${message}
<|assistant|>`,
            parameters: {
              max_new_tokens: 250,
              temperature: 0.7,
              top_p: 0.9,
              do_sample: true
            }
          }),
        }
      );
      
      if (!response.ok) {
        // Fallback to another open model 
        const fallbackResponse = await fetch(
          "https://api-inference.huggingface.co/models/google/flan-t5-large",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            },
            body: JSON.stringify({ 
              inputs: `You are a learning mentor and productivity assistant. Provide specific, actionable advice for this question: ${message}`,
              parameters: {
                max_new_tokens: 150,
                temperature: 0.7
              }
            }),
          }
        );
        
        if (!fallbackResponse.ok) {
          // Final fallback to a very small but reliable model
          const lastResortResponse = await fetch(
            "https://api-inference.huggingface.co/models/google/flan-t5-small",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
              },
              body: JSON.stringify({ 
                inputs: `You are a learning assistant. Give a brief helpful answer to: ${message}`,
              }),
            }
          );
          
          if (!lastResortResponse.ok) {
            throw new Error(`API Error: ${lastResortResponse.status} ${lastResortResponse.statusText}`);
          }
          
          const lastResortResult = await lastResortResponse.json();
          const lastResortText = Array.isArray(lastResortResult) ? lastResortResult[0].generated_text : lastResortResult.generated_text;
          
          // Add assistant response to history
          const assistantMessage: Message = { role: 'assistant', content: lastResortText.trim() };
          setConversationHistory([...updatedHistory, assistantMessage]);
          
          return lastResortText.trim();
        }
        
        const fallbackResult = await fallbackResponse.json();
        const fallbackText = typeof fallbackResult === 'string' 
          ? fallbackResult 
          : (Array.isArray(fallbackResult) ? fallbackResult[0].generated_text : fallbackResult.generated_text);
        
        // Add assistant response to history
        const assistantMessage: Message = { role: 'assistant', content: fallbackText.trim() };
        setConversationHistory([...updatedHistory, assistantMessage]);
        
        return fallbackText.trim();
      }
      
      const result = await response.json();
      let aiResponse = '';
      
      // Parse different response formats
      if (typeof result === 'string') {
        aiResponse = result;
      } else if (Array.isArray(result)) {
        aiResponse = result[0].generated_text || '';
      } else {
        aiResponse = result.generated_text || '';
      }
      
      // Extract only the assistant's response
      const assistantPart = aiResponse.split('<|assistant|>').pop() || '';
      
      // Clean up any trailing system/user markers
      const cleanedResponse = assistantPart
        .split('<|system|>')[0]
        .split('<|user|>')[0]
        .trim();
      
      // Add assistant response to history
      const assistantMessage: Message = { role: 'assistant', content: cleanedResponse };
      setConversationHistory([...updatedHistory, assistantMessage]);
      
      return cleanedResponse;
    } catch (error) {
      console.error('Error with text generation:', error);
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          return 'Authentication error: Please check your Hugging Face API key configuration.';
        }
        return `Error: ${error.message}`;
      }
      return 'I apologize, but I encountered an error processing your request.';
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AIContext.Provider value={{ isProcessing, sendMessage }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}