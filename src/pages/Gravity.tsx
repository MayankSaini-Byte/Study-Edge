import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { MenuToggle } from '../components/layout/MenuToggle';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const Gravity = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate AI response (replace with actual API call later)
        setTimeout(() => {
            const aiMessage: Message = {
                role: 'assistant',
                content: `I'm Gravity AI, your study assistant! You asked: "${input}". I can help you with summarizing PDFs, solving problems, or finding mess menu details. (Note: Full AI integration coming soon!)`
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsLoading(false);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex items-center gap-2 mb-4">
                <MenuToggle />
                <Sparkles className="text-primary" />
                <h1 className="text-2xl font-bold">Ask Gravity</h1>
            </div>

            {messages.length === 0 ? (
                <div className="flex-1 bg-white/5 rounded-2xl p-4 mb-4 overflow-y-auto border border-white/10 flex flex-col items-center justify-center text-center">
                    {/* Animated Gravity Icon with Blue Aura */}
                    <motion.div
                        className="relative w-20 h-20 mb-4"
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {/* Purple & Navy aura glow */}
                        <div className="absolute inset-0 bg-purple-600/30 rounded-full blur-xl animate-pulse" />
                        <div className="absolute inset-0 bg-indigo-800/30 rounded-full blur-lg" />

                        {/* Icon container */}
                        <div className="relative w-full h-full bg-gradient-to-br from-purple-600/40 via-indigo-700/40 to-indigo-900/40 rounded-full flex items-center justify-center ring-1 ring-purple-500/50 shadow-[0_0_30px_rgba(139,92,246,0.6)]">
                            <Sparkles className="text-purple-300 w-10 h-10" />
                        </div>
                    </motion.div>

                    <h3 className="text-lg font-medium text-white">How can I help you today?</h3>
                    <p className="text-gray-400 text-sm max-w-xs mt-2">
                        I can help you summarize PDF notes, solve problems, or find mess menu details.
                    </p>
                </div>
            ) : (
                <div className="flex-1 bg-white/5 rounded-2xl p-4 mb-4 overflow-y-auto border border-white/10 space-y-4">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-primary text-white'
                                    : 'bg-white/10 text-white border border-white/10'
                                    }`}
                            >
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            )}

            <div className="flex gap-2">
                <Input
                    placeholder="Ask anything..."
                    className="flex-1"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="!w-12 !h-12 bg-primary rounded-xl flex items-center justify-center p-0 disabled:opacity-50"
                >
                    <Send size={20} className="text-white ml-0.5" />
                </Button>
            </div>
        </div>
    );
};
