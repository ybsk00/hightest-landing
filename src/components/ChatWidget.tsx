'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatStore, ChatMessage } from '@/store/chatStore';

export default function ChatWidget() {
    const {
        isOpen,
        area,
        messages,
        isLoading,
        openChat,
        closeChat,
        addMessage,
        setLoading,
        incrementTurn,
        turnCount,
    } = useChatStore();

    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Send initial greeting when chat opens
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting = area === 'healthcare'
                ? '안녕하세요! 💪 하이스트헬스케어 상담실장이에요. 어떤 고민이 있으신가요? 편하게 말씀해주세요~'
                : '안녕하세요. 하이스트비뇨기과 의원 전문 상담실장입니다. 어떤 부분이 궁금하신가요?';

            addMessage({
                role: 'assistant',
                content: greeting,
                agentUsed: area === 'healthcare' ? 'h-closer' : 'm-router',
            });
        }
    }, [isOpen, area, messages.length, addMessage]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue('');

        addMessage({
            role: 'user',
            content: userMessage,
        });

        setLoading(true);

        try {
            // Build conversation history for context
            const conversationHistory = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    area,
                    message: userMessage,
                    turnCount: turnCount + 1,
                    conversationHistory,
                    isLoggedIn: false, // TODO: Connect to auth state
                }),
            });


            const data = await response.json();

            addMessage({
                role: 'assistant',
                content: data.reply,
                agentUsed: data.agentUsed,
                cta: data.cta,
            });

            incrementTurn();
        } catch (error) {
            console.error('Chat error:', error);
            addMessage({
                role: 'assistant',
                content: '죄송합니다. 일시적인 오류가 발생했어요. 다시 시도해주세요!',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleCtaClick = (cta: ChatMessage['cta']) => {
        if (!cta) return;

        switch (cta.type) {
            case 'login':
                window.location.href = '/login';
                break;
            case 'booking':
                // TODO: Open booking modal or redirect
                addMessage({
                    role: 'assistant',
                    content: '예약 기능은 곧 준비됩니다. 잠시만 기다려주세요!',
                });
                break;
            case 'open_demo':
                window.location.href = '/medical/gyneco-demo';
                break;
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => openChat()}
                className={`fixed bottom-8 right-8 z-50 flex items-center gap-4 bg-[#181411] text-white pl-6 pr-8 py-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:scale-105 hover:shadow-[0_8px_40px_rgb(0,0,0,0.4)] transition-all duration-300 border-2 border-white/10 ${isOpen ? 'hidden' : ''}`}
            >
                <div className="relative">
                    <span className="material-symbols-outlined text-[32px]">smart_toy</span>
                    <span className="absolute -top-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-[#181411] animate-pulse-green"></span>
                </div>
                <div className="flex flex-col items-start text-left">
                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Online</span>
                    <span className="font-bold text-lg leading-none">전담 상담실장 AI 연결</span>
                </div>
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed inset-0 md:inset-auto md:right-6 md:bottom-6 md:w-[400px] md:h-[600px] z-50 flex flex-col bg-white md:rounded-2xl shadow-2xl overflow-hidden chat-panel-enter">
                    {/* Header */}
                    <div className="bg-[#181411] text-white px-5 py-4 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <span className="material-symbols-outlined text-2xl">smart_toy</span>
                                <span className="absolute -top-0.5 -right-0.5 size-2.5 bg-green-500 rounded-full border border-[#181411] animate-pulse-green"></span>
                            </div>
                            <div>
                                <div className="text-xs text-green-400 font-medium uppercase tracking-wide">Online</div>
                                <div className="font-bold">전담 상담실장 AI</div>
                            </div>
                        </div>
                        <button
                            onClick={closeChat}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar bg-gray-50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] px-4 py-3 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-[#f27f0d] text-white rounded-br-md'
                                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                                    {/* CTA Button */}
                                    {msg.cta && (
                                        <button
                                            onClick={() => handleCtaClick(msg.cta)}
                                            className="mt-3 w-full py-2.5 px-4 bg-[#f27f0d] hover:bg-orange-600 text-white font-bold rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                                        >
                                            {msg.cta.type === 'login' && <span className="material-symbols-outlined text-lg">login</span>}
                                            {msg.cta.type === 'booking' && <span className="material-symbols-outlined text-lg">calendar_month</span>}
                                            {msg.cta.label}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 rounded-bl-md">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="메시지를 입력하세요..."
                                className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#f27f0d]/50 transition-all"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                className="p-3 bg-[#f27f0d] hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-full transition-colors"
                            >
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
