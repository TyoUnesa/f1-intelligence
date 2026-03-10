'use client';

import { useState, useCallback } from 'react';
import { ChatWindow, type Message } from '@/components/ChatWindow';
import { ChatInput } from '@/components/ChatInput';
import { generateId } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => 'session-chat-' + Math.random().toString(36).substring(7));

    const handleSendMessage = useCallback(async (content: string) => {
        // Add user message
        const userMessage: Message = {
            id: generateId(),
            content,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Call the API endpoint
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: content,
                    session_id: sessionId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            // Add AI response
            const aiMessage: Message = {
                id: generateId(),
                content: data.response || 'I apologize, but I could not generate a response.',
                isUser: false,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);

            // Add error message
            const errorMessage: Message = {
                id: generateId(),
                content: 'Sorry, I encountered an error. Please try again.',
                isUser: false,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [sessionId]);

    return (
        <>
            <div className="border-b border-border bg-card px-6 py-4 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-foreground">Ask F1 AI</h1>
                    <p className="text-sm text-muted-foreground">Chat directly with the F1 Intelligence assistant</p>
                </div>
            </div>

            <ChatWindow messages={messages} isLoading={isLoading} />
            <ChatInput onSubmit={handleSendMessage} isLoading={isLoading} />
        </>
    );
}
