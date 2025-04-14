'use client';

import {
  useExternalStoreRuntime,
  ThreadMessageLike,
  AppendMessage,
  AssistantRuntimeProvider,
} from '@assistant-ui/react';
import { MastraClient } from '@mastra/client-js';
import { useState, ReactNode, createContext, useContext } from 'react';

const mastra = new MastraClient({
  baseUrl: process.env.NEXT_PUBLIC_MASTRA_API_URL || 'http://localhost:4111',
});

export interface Artifact {
  content: string;
  title: string;
  timestamp: Date;
}

interface ArtifactContextType {
  artifacts: Artifact[];
  addArtifact: (content: string) => void;
}

const ArtifactContext = createContext<ArtifactContextType | null>(null);

export const useArtifacts = () => {
  const context = useContext(ArtifactContext);
  if (!context) throw new Error('useArtifacts must be used within MastraRuntimeProvider');
  return context;
};

const convertMessage = (message: ThreadMessageLike): ThreadMessageLike => {
  return message;
};

export function MastraRuntimeProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<ThreadMessageLike[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);

  const addArtifact = (content: string) => {
    const newArtifact: Artifact = {
      content,
      title: `Generated Content ${artifacts.length + 1}`,
      timestamp: new Date(),
    };
    setArtifacts(prev => [...prev, newArtifact]);
  };

  const onNew = async (message: AppendMessage) => {
    if (message.content[0]?.type !== 'text') throw new Error('Only text messages are supported');

    const input = message.content[0].text;
    setMessages(currentConversation => [...currentConversation, { role: 'user', content: input }]);
    setIsRunning(true);

    try {
      const workflow = mastra.getWorkflow('webpageContentWorkflow');
      const result = await workflow.execute({
        input: {
          messages: [
            {
              role: 'user',
              content: input,
            },
          ],
        },
      });

      const responseText = typeof result === 'string' 
        ? result 
        : JSON.stringify(result, null, 2);
      
      // Add the response as an artifact
      addArtifact(responseText);

      setMessages(currentConversation => {
        const message: ThreadMessageLike = {
          role: 'assistant',
          content: [{ type: 'text', text: responseText }],
        };
        return [...currentConversation, message];
      });
      
      setIsRunning(false);
    } catch (error) {
      console.error('Error in onNew:', error);
      setMessages(currentConversation => [
        ...currentConversation,
        {
          role: 'assistant',
          content: [{ type: 'text', text: 'Sorry, I encountered an error processing your request.' }],
          isError: true,
        },
      ]);
      setIsRunning(false);
    }
  };

  const runtime = useExternalStoreRuntime({
    isRunning,
    messages,
    convertMessage,
    onNew,
  });

  return (
    <ArtifactContext.Provider value={{ artifacts, addArtifact }}>
      <AssistantRuntimeProvider runtime={runtime}>
        {children}
      </AssistantRuntimeProvider>
    </ArtifactContext.Provider>
  );
}
