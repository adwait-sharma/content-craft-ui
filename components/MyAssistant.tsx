'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { SendIcon, CopyIcon, ThumbsUpIcon, ThumbsDownIcon, XIcon, Volume2Icon, LinkIcon, SunIcon, MoonIcon } from 'lucide-react';

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
              <svg
                className="h-8 w-8 text-blue-600 dark:text-blue-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">Content Craft</span>
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
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <svg
                  className="h-24 w-24 text-blue-600 dark:text-blue-400 mb-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Content Craft</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                  Your AI-powered content assistant. Start typing below to craft amazing content together.
                </p>
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
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                          <div className="px-6 py-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Generated Content</h3>
                              <span className="text-xs text-gray-500 dark:text-gray-400">Document</span>
                            </div>
                            <div className="prose dark:prose-invert text-gray-900 dark:text-gray-100 max-h-32 overflow-hidden relative">
                              {message.content.length > 300 ? (
                                <>
                                  {message.content.slice(0, 300)}...
                                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
                                </>
                              ) : (
                                message.content
                              )}
                            </div>
                            <div className="mt-4 flex items-center gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                <CopyIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              </button>
                              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                <ThumbsUpIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              </button>
                              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                <ThumbsDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              </button>
                              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                <Volume2Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              </button>
                              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                <LinkIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start w-full">
                    <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                          ))}
                        </div>
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
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-600 dark:disabled:hover:bg-blue-500"
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
