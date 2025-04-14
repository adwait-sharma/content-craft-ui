'use client';

import {
  useExternalStoreRuntime,
  ThreadMessageLike,
  AppendMessage,
  AssistantRuntimeProvider,
} from '@assistant-ui/react';
import { MastraClient } from '@mastra/client-js';
import { useState, ReactNode } from 'react';

const mastra = new MastraClient({
  baseUrl: process.env.NEXT_PUBLIC_MASTRA_API_URL || 'http://localhost:4111',
});

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

  const onNew = async (message: AppendMessage) => {
    if (message.content[0]?.type !== 'text') throw new Error('Only text messages are supported');

    const input = message.content[0].text;
    setMessages(currentConversation => [...currentConversation, { role: 'user', content: input }]);
    setIsRunning(true);

    try {
      const workflow = mastra.getWorkflow('webpageContentWorkflow'); // Replace with your actual workflow ID
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

      // Process the workflow result - using a simple approach
      const responseText = typeof result === 'string' 
        ? result 
        : JSON.stringify(result) || 'No response from workflow';
      
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

  return <AssistantRuntimeProvider runtime={runtime}>{children}</AssistantRuntimeProvider>;
}
