import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader, BookOpen, Brain, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAI } from '../contexts/AIContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatAssistantProps {
  open: boolean;
  onClose: () => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hi there! I'm your learning and productivity assistant. I can help you with:\n\n• Planning your study schedule\n• Recommending focus techniques\n• Suggesting learning resources\n• Prioritizing your tasks\n\nHow can I help with your learning journey today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isProcessing, sendMessage } = useAI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Show "AI is thinking..." message
    setMessages(prev => [...prev, { role: 'assistant', content: '...' }]);

    const response = await sendMessage(userMessage);
    
    // Replace the "thinking" message with the actual response
    setMessages(prev => {
      const newMessages = [...prev];
      newMessages[newMessages.length - 1] = { role: 'assistant', content: response };
      return newMessages;
    });
  };

  // Quick prompts for common learning questions
  const quickPrompts = [
    { label: "Study Plan", text: "Can you help me create a study plan for today?", icon: BookOpen },
    { label: "Focus Tips", text: "How can I improve my focus and concentration?", icon: Brain },
    { label: "Break Time", text: "Should I take a break now? I've been studying for 2 hours.", icon: Clock },
  ];

  const handleQuickPrompt = (text: string) => {
    setInput(text);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 right-8 z-50 w-96 rounded-lg bg-white shadow-xl dark:bg-gray-800"
        >
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Learning Assistant</h3>
              {isProcessing && (
                <div className="ml-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Loader className="mr-1 h-3 w-3 animate-spin" />
                  Processing...
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    }`}
                  >
                    {message.content === '...' ? (
                      <div className="flex items-center">
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        <p className="text-sm">AI is thinking...</p>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick prompts */}
          <div className="border-t border-gray-200 p-2 grid grid-cols-3 gap-2 dark:border-gray-700">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt.text)}
                className="flex flex-col items-center justify-center p-2 text-xs text-gray-600 hover:bg-gray-100 rounded dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <prompt.icon className="h-4 w-4 mb-1" />
                {prompt.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your learning goals..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="flex items-center rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50 dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                {isProcessing ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatAssistant;