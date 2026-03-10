'use client';

import { Send, Mic } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSubmit, isLoading = false }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <div className="bg-card border-t border-border p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about F1 drivers, teams, races, or strategy..."
            className="flex-1 bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            <Mic className="w-5 h-5" />
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            size="icon"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Example Prompts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <ExamplePrompt
            text="Why was 2009 Brawn GP so dominant?"
            onClick={() => {
              setInput('Why was the 2009 Brawn GP car so dominant?');
            }}
          />
          <ExamplePrompt
            text="Explain ground effect simply"
            onClick={() => {
              setInput('Explain ground effect in simple terms');
            }}
          />
          <ExamplePrompt
            text="Best F1 driver statistically?"
            onClick={() => {
              setInput('Who is statistically the best F1 driver ever?');
            }}
          />
          <ExamplePrompt
            text="Why do F1 cars spark?"
            onClick={() => {
              setInput('Why do F1 cars spark at night races?');
            }}
          />
        </div>
      </form>
    </div>
  );
}

interface ExamplePromptProps {
  text: string;
  onClick: () => void;
}

function ExamplePrompt({ text, onClick }: ExamplePromptProps) {
  return (
    <button
      onClick={onClick}
      className="text-left text-xs p-2 rounded-lg border border-border hover:border-primary hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
    >
      <span className="text-primary">→</span> {text}
    </button>
  );
}
