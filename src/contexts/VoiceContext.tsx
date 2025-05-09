import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAI } from './AIContext';

// Add types for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  readonly NONE: number;
  readonly CAPTURING: number;
  readonly ERROR: number;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionError {
  error: string;
  message: string;
}

// Add the missing interface between SpeechRecognitionError and SpeechRecognition
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
}

interface VoiceContextType {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  messages: Message[];
  isProcessing: boolean;
  clearTranscript: () => void;
  stopSpeaking: () => void;
  assistantName: string;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

// Assistant name constant
const ASSISTANT_NAME = "Jarvis";

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: `Hello! I'm ${ASSISTANT_NAME}, your voice assistant. You can ask me questions or give me commands. Try saying 'What should I learn today?'` 
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const navigate = useNavigate();
  const { sendMessage } = useAI();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Function to stop speaking
  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      // Set language to English
      if (recognitionRef.current.lang) {
        recognitionRef.current.lang = 'en-US';
      }

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        setTranscript(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          // Restart if it ended unexpectedly while still supposed to be listening
          recognitionRef.current?.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      // Cancel any ongoing speech if component unmounts
      stopSpeaking();
    };
  }, [isListening]);

  // Process transcript when user stops speaking (after a pause)
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef('');

  useEffect(() => {
    // Only process if we have a new transcript that's different and not empty
    if (transcript && transcript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = transcript;
      
      // Clear any previous timeout
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      
      // Set a timeout to process after a pause in speaking
      processingTimeoutRef.current = setTimeout(async () => {
        if (transcript.trim()) {
          // Check if transcript includes the assistant name (Jarvis)
          const lowerTranscript = transcript.toLowerCase();
          const hasAssistantName = lowerTranscript.includes(ASSISTANT_NAME.toLowerCase()) || 
                                  lowerTranscript.includes('jarvis') || 
                                  lowerTranscript.includes('hey jarvis') || 
                                  lowerTranscript.includes('ok jarvis');
          
          // Check for navigation commands first
          if (!handleNavigationCommand(lowerTranscript)) {
            // If transcript has assistant name or we're already in a conversation, process with AI
            if (hasAssistantName || messages.length > 1) {
              // Stop any current speech before processing new request
              stopSpeaking();
              await processTranscript(transcript);
            }
          }
        }
      }, 1500); // 1.5 second pause
    }
    
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, [transcript, messages.length]);

  const processTranscript = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message to the history
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    
    // Set processing to true to show loading state
    setIsProcessing(true);
    
    try {
      // Send the message to AI service
      const response = await sendMessage(text);
      
      // Add the AI response to messages
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      
      // Speak the response with a female voice
      const utterance = new SpeechSynthesisUtterance(response);
      
      // Store the utterance for possible cancellation
      currentUtteranceRef.current = utterance;
      
      // Get available voices and select a female voice
      const voices = window.speechSynthesis.getVoices();
      // Try to find a female voice
      const femaleVoice = voices.find(voice => 
        voice.name.includes('female') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Siri') ||
        voice.name.includes('Victoria') ||
        voice.name.includes('Karen') ||
        voice.name.includes('Moira') ||
        voice.name.includes('Tessa') ||
        voice.name.includes('Fiona')  
      );
      
      // Use the female voice if found, otherwise use the first available voice
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      } else if (voices.length > 0) {
        // If no explicitly female voice is found, use the first voice with an even index
        // (often female voices have even indices)
        for (let i = 0; i < voices.length; i++) {
          if (i % 2 === 0) {
            utterance.voice = voices[i];
            break;
          }
        }
      }
      
      // Set pitch slightly higher for a more feminine sound if no female voice is available
      utterance.pitch = 1.2;
      utterance.rate = 1.0;
      
      // Add event for when speech ends
      utterance.onend = () => {
        currentUtteranceRef.current = null;
      };
      
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error processing voice input:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I couldn't process that request." }]);
    } finally {
      setIsProcessing(false);
      // Clear the transcript after processing
      setTranscript('');
    }
  };

  const handleNavigationCommand = (command: string): boolean => {
    if (command.includes('go to dashboard') || command.includes('show dashboard')) {
      navigate('/');
      setMessages(prev => [...prev, 
        { role: 'user', content: command },
        { role: 'assistant', content: "Navigating to Dashboard." }
      ]);
      return true;
    } else if (command.includes('open timer') || command.includes('show timer')) {
      navigate('/pomodoro');
      setMessages(prev => [...prev, 
        { role: 'user', content: command },
        { role: 'assistant', content: "Opening Pomodoro Timer." }
      ]);
      return true;
    } else if (command.includes('show learning') || command.includes('open learning')) {
      navigate('/learning');
      setMessages(prev => [...prev, 
        { role: 'user', content: command },
        { role: 'assistant', content: "Opening Learning Tracker." }
      ]);
      return true;
    } else if (command.includes('show jobs') || command.includes('open jobs')) {
      navigate('/jobs');
      setMessages(prev => [...prev, 
        { role: 'user', content: command },
        { role: 'assistant', content: "Opening Job Tracker." }
      ]);
      return true;
    } else if (command.includes('show challenges') || command.includes('open challenges')) {
      navigate('/challenges');
      setMessages(prev => [...prev, 
        { role: 'user', content: command },
        { role: 'assistant', content: "Opening Coding Challenges." }
      ]);
      return true;
    } else if (command.includes('open settings') || command.includes('show settings')) {
      navigate('/settings');
      setMessages(prev => [...prev, 
        { role: 'user', content: command },
        { role: 'assistant', content: "Opening Settings." }
      ]);
      return true;
    }
    return false;
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      
      // Process any final transcript after stopping
      if (transcript.trim()) {
        lastTranscriptRef.current = transcript;
        if (!handleNavigationCommand(transcript.toLowerCase())) {
          processTranscript(transcript);
        }
      }
    }
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  const handleIconClick = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <VoiceContext.Provider 
      value={{ 
        isListening, 
        startListening, 
        stopListening, 
        transcript, 
        messages, 
        isProcessing, 
        clearTranscript, 
        stopSpeaking, 
        assistantName: ASSISTANT_NAME 
      }}
    >
      {children}
      <div>
        {/* Chat Icon */}
        <button onClick={handleIconClick}>
          {/* Replace with your icon */}
          <span role="img" aria-label="chat">💬</span>
        </button>

        {/* Chat Window */}
        {isChatOpen && (
          <div className="chat-window">
            {/* Your chat UI goes here */}
            <p>This is the chat window!</p>
          </div>
        )}
      </div>
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
}