'use client';

import { Zap } from 'lucide-react';

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
}

export function MessageBubble({ content, isUser }: MessageBubbleProps) {
  const parseContent = (text: string) => {
    const parts: React.ReactNode[] = [];
    const lines = text.split('\n');

    lines.forEach((line, lineIdx) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        // Bold header
        parts.push(
          <p key={`${lineIdx}-bold`} className="font-bold text-secondary mb-2">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      } else if (line.startsWith('- ')) {
        // List item
        parts.push(
          <div key={`${lineIdx}-li`} className="ml-4 mb-1">
            {'• '}{parseLine(line.slice(2))}
          </div>
        );
      } else if (line.startsWith('1. ') || line.match(/^\d+\. /)) {
        // Numbered list
        const match = line.match(/^(\d+)\. (.+)/);
        if (match) {
          parts.push(
            <div key={`${lineIdx}-ol`} className="ml-4 mb-1">
              {match[1]}. {parseLine(match[2])}
            </div>
          );
        }
      } else if (line.trim()) {
        // Regular paragraph
        parts.push(
          <p key={`${lineIdx}-p`} className="mb-2">
            {parseLine(line)}
          </p>
        );
      } else if (line === '') {
        // Empty line for spacing
        parts.push(<div key={`${lineIdx}-space`} className="mb-2" />);
      }
    });

    return parts;
  };

  const parseLine = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;

    // Match bold (**text**) and italic (_text_)
    const regex = /\*\*(.*?)\*\*|_(.*?)_/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push(text.slice(currentIndex, match.index));
      }

      if (match[1] !== undefined) {
        // Bold text
        parts.push(
          <strong key={parts.length} className="font-bold text-secondary">
            {match[1]}
          </strong>
        );
      } else if (match[2] !== undefined) {
        // Italic text
        parts.push(
          <em key={parts.length} className="italic">
            {match[2]}
          </em>
        );
      }

      currentIndex = regex.lastIndex;
    }

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(text.slice(currentIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      <div
        className={`max-w-2xl rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-card text-card-foreground border border-border rounded-bl-none'
        }`}
      >
        <div className="text-sm break-words leading-relaxed">
          {parseContent(content)}
        </div>
      </div>
    </div>
  );
}
