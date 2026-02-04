import { create } from 'zustand';

export type ChatArea = 'healthcare' | 'medical';
export type ChatIntent =
    | 'start_check'
    | 'demo_try'
    | 'quick_consult'
    | 'login'
    | 'gyneco_demo'
    | 'gyneco_consult'
    | 'penile_consult'
    | 'booking'
    | 'report'
    | 'general';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    agentUsed?: string;
    cta?: {
        type: 'login' | 'booking' | 'open_demo';
        label: string;
    };
    timestamp: Date;
}

interface ChatState {
    isOpen: boolean;
    area: ChatArea;
    intent: ChatIntent | null;
    messages: ChatMessage[];
    sessionId: string | null;
    isLoading: boolean;
    turnCount: number;

    // Actions
    openChat: (options?: { area?: ChatArea; intent?: ChatIntent }) => void;
    closeChat: () => void;
    toggleChat: () => void;
    setArea: (area: ChatArea) => void;
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
    setLoading: (loading: boolean) => void;
    incrementTurn: () => void;
    resetChat: () => void;
    setSessionId: (id: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    isOpen: false,
    area: 'healthcare',
    intent: null,
    messages: [],
    sessionId: null,
    isLoading: false,
    turnCount: 0,

    openChat: (options) => {
        set({
            isOpen: true,
            ...(options?.area && { area: options.area }),
            ...(options?.intent && { intent: options.intent }),
        });
    },

    closeChat: () => set({ isOpen: false }),

    toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

    setArea: (area) => set({ area }),

    addMessage: (message) => {
        const newMessage: ChatMessage = {
            ...message,
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
        };
        set((state) => ({
            messages: [...state.messages, newMessage],
        }));
    },

    setLoading: (loading) => set({ isLoading: loading }),

    incrementTurn: () => set((state) => ({ turnCount: state.turnCount + 1 })),

    resetChat: () =>
        set({
            messages: [],
            sessionId: null,
            turnCount: 0,
            intent: null,
        }),

    setSessionId: (id) => set({ sessionId: id }),
}));
