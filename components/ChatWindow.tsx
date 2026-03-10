'use client';

import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-6 space-y-4 bg-background"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
              <span className="text-2xl">🏎️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to F1 Intelligence</h2>
              <p className="text-muted-foreground">
                Your ultimate Formula 1 AI assistant. Ask me anything about drivers,
                <br />
                teams, races, technology, or strategy!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              isUser={message.isUser}
            />
          ))}
          {isLoading && <TypingIndicator />}
        </>
      )}
    </div>
  );
}
