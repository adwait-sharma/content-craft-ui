'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { SendIcon, CopyIcon, ThumbsUpIcon, ThumbsDownIcon, XIcon, Volume2Icon, LinkIcon, SunIcon, MoonIcon } from 'lucide-react';
import { Logo } from '@/app/components/Logo';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

export function MyAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { 
      role: 'user', 
      content: input,
      id: Math.random().toString(36).substring(7)
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.response,
        id: Math.random().toString(36).substring(7)
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request.',
        id: Math.random().toString(36).substring(7)
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-200 ${selectedMessage ? 'w-1/2' : 'w-full'}`}>
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Logo className="h-8 w-8" />
              <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">Contentstack AI Studio</span>
            </div>
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            )}
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              // Welcome Screen
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-8">
                <Logo className="h-16 w-16 mb-8" />
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-2xl font-medium text-gray-900 dark:text-white tracking-tight">
                    Contentstack AI Studio
                  </h2>
                </div>
                <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mb-8 font-light">
                  Your AI-powered content assistant. Start typing below to craft amazing content together.
                </p>
                
                {/* Pre-written Prompts */}
                <div className="w-full max-w-4xl flex justify-center space-x-3">
                  <button 
                    onClick={() => setInput("Help me create a product description for an eco-friendly water bottle")}
                    className="flex items-center px-4 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm">Product description</span>
                    <span className="ml-2 text-gray-400">→</span>
                  </button>
                  <button 
                    onClick={() => setInput("Generate a social media campaign for a new coffee shop")}
                    className="flex items-center px-4 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm">Social media</span>
                    <span className="ml-2 text-gray-400">→</span>
                  </button>
                  <button 
                    onClick={() => setInput("Write a blog post about AI in content management")}
                    className="flex items-center px-4 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm">Blog post</span>
                    <span className="ml-2 text-gray-400">→</span>
                  </button>
                  <button 
                    onClick={() => setInput("Create an email newsletter about upcoming tech trends")}
                    className="flex items-center px-4 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm">Newsletter</span>
                    <span className="ml-2 text-gray-400">→</span>
                  </button>
                  <button 
                    onClick={() => setInput("Generate SEO-optimized website content for a fitness studio")}
                    className="flex items-center px-4 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm">SEO content</span>
                    <span className="ml-2 text-gray-400">→</span>
                  </button>
                </div>
              </div>
            ) : (
              // Chat Interface
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start w-full'}`}
                  >
                    {message.role === 'user' ? (
                      <div className="max-w-[85%] rounded-2xl px-4 py-2 bg-gray-100 dark:bg-gray-800 text-right">
                        <div className="prose dark:prose-invert text-gray-900 dark:text-gray-100">
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setSelectedMessage(message)}
                        className="w-full cursor-pointer"
                      >
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors relative overflow-hidden group">
                          <div className="absolute inset-0">
                            <svg className="w-full h-full opacity-[0.02] dark:opacity-[0.04]" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                              <defs>
                                <pattern id="smallGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                                  <path d="M 20 15 L 25 10 L 30 15" stroke="currentColor" strokeWidth="0.5" fill="none"/>
                                  <path d="M 40 45 L 45 50 L 50 45" stroke="currentColor" strokeWidth="0.5" fill="none"/>
                                </pattern>
                              </defs>
                              <rect width="100%" height="100%" fill="url(#smallGrid)"/>
                            </svg>
                          </div>
                          <div className="relative flex items-center justify-between">
                            <div className="flex flex-col items-start">
                              <div className="flex items-center gap-2.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-purple-500">
                                  <path fillRule="evenodd" d="M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zm-9.44 0a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 11-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z" clipRule="evenodd" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Website Content</h3>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">Code artifact</p>
                            </div>
                            <div className="w-8 h-8 flex items-center justify-center bg-orange-500 rounded-full shadow-sm group-hover:bg-orange-600 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                                <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start w-full">
                    <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </div>
                          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-900">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:focus:ring-purple-400 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 disabled:opacity-50 transition-all duration-200 ease-in-out"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel */}
      {selectedMessage && (
        <div className="w-1/2 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Generated Content</h2>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              >
                <XIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="prose dark:prose-invert max-w-none">
                {selectedMessage.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
