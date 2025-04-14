import { MastraClient } from '@mastra/client-js';
import { NextResponse } from 'next/server';

const mastra = new MastraClient({
  baseUrl: process.env.NEXT_PUBLIC_MASTRA_API_URL || 'http://localhost:4111',
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'User prompt is required to generate content structure' },
        { status: 400 }
      );
    }

    const workflow = mastra.getWorkflow('webpageContentWorkflow');
    const result = await workflow.execute({
        userPrompt: message,
    });

    const response = typeof result === 'string' ? result : JSON.stringify(result, null, 2);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
}
