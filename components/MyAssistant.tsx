'use client';

import { Thread, makeMarkdownText } from '@assistant-ui/react-ui';

const MarkdownText = makeMarkdownText();

export function MyAssistant() {
  return (
    <Thread
      strings={{ welcome: { message: 'How can I help you today?' } }}
      assistantMessage={{ components: { Text: MarkdownText } }}
    />
  );
}
