'use client';

import { useState, useCallback } from 'react';
import { ChatWindow, type Message } from '@/components/ChatWindow';
import { ChatInput } from '@/components/ChatInput';
import { generateId } from '@/lib/utils';
import { Zap } from 'lucide-react';

export default function TechnicalAnalysisPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: generateId(),
            content: "Welcome to the Technical Analysis center! I can explain complex F1 engineering concepts like aerodynamics, ground effect, hybrid power units, and tire strategies. What would you like to explore?",
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => 'session-tech-' + Math.random().toString(36).substring(7));

    const handleSendMessage = useCallback(async (content: string) => {
        const userMessage: Message = { id: generateId(), content, isUser: true, timestamp: new Date() };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: content, session_id: sessionId }),
            });

            if (!response.ok) throw new Error('Failed to get response');
            const data = await response.json();

            const aiMessage: Message = {
                id: generateId(),
                content: data.response || 'I apologize, but I could not generate a response.',
                isUser: false,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prev) => [...prev, {
                id: generateId(),
                content: 'Sorry, I encountered an error. Please try again.',
                isUser: false,
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [sessionId]);

    return (
        <>
            <div className="border-b border-border bg-card px-6 py-4 flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Zap className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-foreground">Technical Analysis</h1>
                    <p className="text-sm text-muted-foreground">Deep dive into F1 engineering, aerodynamics, and car design</p>
                </div>
            </div>

            <ChatWindow messages={messages} isLoading={isLoading} />
            <div className="px-4 py-2 bg-muted/30 border-t border-border flex gap-2 overflow-x-auto whitespace-nowrap">
                <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center pr-2">Topics:</span>
                <button onClick={() => handleSendMessage("Explain Ground Effect in recent F1 cars")} className="text-xs bg-card border border-border px-3 py-1.5 rounded-full hover:border-primary transition-colors">Ground Effect</button>
                <button onClick={() => handleSendMessage("How does the DRS (Drag Reduction System) work?")} className="text-xs bg-card border border-border px-3 py-1.5 rounded-full hover:border-primary transition-colors">DRS</button>
                <button onClick={() => handleSendMessage("Break down the V6 Turbo Hybrid Power Unit components")} className="text-xs bg-card border border-border px-3 py-1.5 rounded-full hover:border-primary transition-colors">Hybrid PU</button>
                <button onClick={() => handleSendMessage("What impact do tire compounds have on race strategy?")} className="text-xs bg-card border border-border px-3 py-1.5 rounded-full hover:border-primary transition-colors">Tire Strategy</button>
            </div>
            <ChatInput onSubmit={handleSendMessage} isLoading={isLoading} />
        </>
    );
}
