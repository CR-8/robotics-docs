"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, X, Info, Sparkles, Paperclip, Link, Code, Mic } from "lucide-react";
import { askGemini, searchDocumentation } from "@/lib/gemini";
import { sanitizeAIResponse } from "@/lib/sanitize-ai-response";
import { MessageContent } from "@/components/message-content";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function AISheet() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hello! I\'m your robotics assistant. Ask me anything about motors, sensors, navigation, combat robots, or any other robotics topic!',
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const maxChars = 2000;
    const chatRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages]);

    // Close chat when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
                const target = event.target as HTMLElement;
                if (!target.closest('.floating-ai-button')) {
                    setIsChatOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= maxChars) {
            setInput(value);
            setCharCount(value.length);
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setCharCount(0);
        setIsLoading(true);

        try {
            // Fetch full documentation context
            let fullContext = '';
            try {
                const contextResponse = await fetch('/llms-full.txt');
                if (contextResponse.ok) {
                    fullContext = await contextResponse.text();
                }
            } catch (error) {
                console.error('Failed to fetch documentation context:', error);
            }

            // Get current page URL context
            const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
            const pageContext = `User is currently on: ${pageUrl}\n\n`;
            
            // Search documentation for relevant context (fallback)
            const searchContext = await searchDocumentation(input);
            
            const context = fullContext || searchContext;

            // Get AI response with full context
            const response = await askGemini(input, pageContext + context);

            // Sanitize the response before displaying
            const sanitizedResponse = sanitizeAIResponse(response);

            const assistantMessage: Message = {
                role: 'assistant',
                content: sanitizedResponse,
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Floating 3D Glowing AI Logo */}
            <button 
                className={`floating-ai-button relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 transform`}
                onClick={() => setIsChatOpen(!isChatOpen)}
                style={{
                    background: 'hsl(var(--foreground))',
                    boxShadow: '0 0 20px hsl(var(--primary) / 0.3), 0 0 40px hsl(var(--primary) / 0.2)',
                    border: '2px solid hsl(var(--primary) / 0.5)',
                }}
            >
                {/* 3D effect */}
                <div className="absolute inset-0 rounded-full bg-linear-to-b from-white/10 to-transparent opacity-30"></div>
                
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
                
                {/* AI Icon */}
                <div className="relative z-10">
                    {isChatOpen ? <X className="w-8 h-8 text-primary" /> : <Bot className="w-8 h-8 text-primary" />}
                </div>
                
                {/* Glowing animation */}
                <div className="absolute inset-0 rounded-full animate-ping opacity-10 bg-primary"></div>
            </button>

            {/* Chat Interface */}
            {isChatOpen && (
                <div 
                    ref={chatRef}
                    className="absolute bottom-20 right-0 w-[700px] transition-all duration-300 origin-bottom-right"
                    style={{
                        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                    }}
                >
                    <div className="relative flex flex-col rounded-2xl bg-background border border-border shadow-2xl overflow-hidden max-h-[700px]">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-border shrink-0 bg-muted/30">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm font-semibold text-foreground">AI Robotics Assistant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-md border border-border">
                                    Gemini 1.5
                                </span>
                                <span className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-md">
                                    Full Context
                                </span>
                                <button 
                                    onClick={() => setIsChatOpen(false)}
                                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                                >
                                    <X className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0 bg-background" style={{ scrollbarWidth: 'thin' }}>
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                <Bot className="h-4 w-4 text-primary" />
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        className={`rounded-lg px-4 py-3 max-w-[80%] ${
                                            message.role === 'user'
                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                : 'bg-muted border border-border'
                                        }`}
                                    >
                                        {message.role === 'user' ? (
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                        ) : (
                                            <MessageContent content={message.content} />
                                        )}
                                    </div>
                                    {message.role === 'user' && (
                                        <div className="shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="shrink-0">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <Bot className="h-4 w-4 text-primary animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 bg-muted border border-border rounded-lg px-4 py-3">
                                        <div className="h-3 w-[220px] bg-border rounded animate-pulse"></div>
                                        <div className="h-3 w-[180px] bg-border rounded animate-pulse"></div>
                                        <div className="h-3 w-[200px] bg-border rounded animate-pulse"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Section */}
                        <div className="relative overflow-hidden shrink-0 border-t border-border bg-muted/30">
                            <textarea
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                rows={3}
                                className="w-full px-6 py-4 bg-transparent border-none outline-none resize-none text-sm font-normal leading-relaxed text-foreground placeholder-muted-foreground"
                                placeholder="Ask about motors, sensors, navigation, combat robots, or any robotics topic..."
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            />
                        </div>

                        {/* Controls Section */}
                        <div className="px-4 pb-4 shrink-0 bg-muted/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {/* Attachment Group */}
                                    <div className="flex items-center gap-1 p-1 bg-background rounded-lg border border-border">
                                        <button className="group relative p-2 bg-transparent border-none rounded-md cursor-pointer transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted">
                                            <Paperclip className="w-4 h-4" />
                                        </button>
                                        <button className="group relative p-2 bg-transparent border-none rounded-md cursor-pointer transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted">
                                            <Link className="w-4 h-4" />
                                        </button>
                                        <button className="group relative p-2 bg-transparent border-none rounded-md cursor-pointer transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted">
                                            <Code className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <button className="group relative p-2 bg-transparent border border-border rounded-md cursor-pointer transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted hover:border-primary/50">
                                        <Mic className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Character Counter */}
                                    <div className="text-xs font-medium text-muted-foreground">
                                        <span className="text-foreground">{charCount}</span>
                                        <span className="mx-0.5">/</span>
                                        <span>{maxChars}</span>
                                    </div>

                                    {/* Send Button */}
                                    <button 
                                        onClick={() => handleSubmit()}
                                        disabled={isLoading || !input.trim()}
                                        className="group relative px-4 py-2 bg-primary border-none rounded-md cursor-pointer transition-all duration-200 text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-95 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        <span className="text-sm font-medium">Send</span>
                                    </button>
                                </div>
                            </div>

                            {/* Footer Info */}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Info className="w-3.5 h-3.5" />
                                    <span>
                                        Press <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-foreground font-mono text-[10px]">Shift + Enter</kbd> for new line
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    <span>Connected • Full documentation context</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* CSS for animations */}
            <style jsx>{`
                @keyframes popIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.8) translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                
                .floating-ai-button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 30px hsl(var(--primary) / 0.4), 0 0 50px hsl(var(--primary) / 0.25);
                }
            `}</style>
        </div>
    );
}
