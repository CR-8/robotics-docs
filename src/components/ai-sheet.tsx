"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Info, Paperclip, Code, Mic, Sparkles } from "lucide-react";
import { askGemini, searchDocumentation } from "@/lib/gemini";
import { sanitizeAIResponse } from "@/lib/sanitize-ai-response";
import { MessageContent } from "@/components/message-content";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function AISheet() {
    const [open, setOpen] = useState(false);
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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages]);

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
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon"
                    className="relative group"
                >
                    <Sparkles className="h-5 w-5 text-primary transition-all group-hover:text-primary/80" />
                    <span className="sr-only">AI Assistant</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[540px] p-0 flex flex-col min-w-[35vw]">
                <SheetHeader className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <SheetTitle className="text-base">AI Robotics Assistant</SheetTitle>
                                <SheetDescription className="text-xs flex items-center gap-2 mt-0.5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    Connected • Full Context
                                </SheetDescription>
                            </div>
                        </div>
                    </div>
                </SheetHeader>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" style={{ scrollbarWidth: 'thin' }}>
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
                <div className="border-t">
                    <div className="px-4 py-3 bg-muted/30">
                        <textarea
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            rows={3}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none resize-none text-sm leading-relaxed text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20"
                            placeholder="Ask about motors, sensors, navigation, combat robots..."
                            style={{ scrollbarWidth: 'thin' }}
                        />
                        
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                    <Paperclip className="h-4 w-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                    <Code className="h-4 w-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                    <Mic className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-xs font-medium text-muted-foreground">
                                    <span className="text-foreground">{charCount}</span>
                                    <span className="mx-0.5">/</span>
                                    <span>{maxChars}</span>
                                </div>

                                <Button 
                                    onClick={() => handleSubmit()}
                                    disabled={isLoading || !input.trim()}
                                    size="sm"
                                    className="gap-2"
                                >
                                    <Send className="h-4 w-4" />
                                    Send
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Info className="h-3.5 w-3.5" />
                            <span>
                                Press <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-foreground font-mono text-[10px]">Shift + Enter</kbd> for new line
                            </span>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
