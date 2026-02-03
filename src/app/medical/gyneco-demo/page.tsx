'use client';

import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { GynecoSpinner } from '@/components/GynecoSpinner';
import Footer from '@/components/Footer';

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (Client-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function GynecoDemoPage() {
    const { openChat, setArea } = useChatStore();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        setArea('medical');

        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setIsLoggedIn(!!session);
            } catch (error) {
                console.error('Session check failed', error);
            } finally {
                setIsChecking(false);
            }
        };

        checkSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
        });

        return () => subscription.unsubscribe();
    }, [setArea]);

    const handleLogin = () => {
        window.location.href = '/login?redirect=/medical/gyneco-demo';
    };

    if (isChecking) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8f7f5]">
                <div className="w-12 h-12 border-4 border-[#f27f0d] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f5]">
                <header className="w-full bg-white border-b border-[#f5f2f0]">
                    <div className="flex justify-center px-4 md:px-10 py-3">
                        <div className="flex items-center justify-between w-full max-w-[1200px]">
                            <div className="flex items-center gap-4">
                                <div className="size-8 text-[#f27f0d]">
                                    <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>health_and_safety</span>
                                </div>
                                <h2 className="text-[#181411] text-xl font-bold leading-tight tracking-[-0.015em]">하이스트비뇨기과 의원</h2>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex items-center justify-center px-4 py-20">
                    <div className="max-w-md w-full text-center">
                        <div className="glass-panel rounded-3xl p-10 shadow-2xl">
                            <div className="size-20 rounded-full bg-white shadow-lg flex items-center justify-center text-[#f27f0d] mx-auto mb-6">
                                <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>lock</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-[#181411] mb-4">
                                시각화 데모
                            </h1>
                            <p className="text-[#4a453e] text-base mb-8">
                                전면 이미지 데모는 로그인 후 이용 가능합니다.
                            </p>
                            <button
                                onClick={() => window.location.href = '/login'}
                                className="w-full py-4 px-6 bg-[#f27f0d] hover:bg-orange-600 text-white font-bold rounded-full transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                            >
                                <span>로그인 후 이용</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f5]">
            <header className="w-full bg-white border-b border-[#f5f2f0]">
                <div className="flex justify-center px-4 md:px-10 py-3">
                    <div className="flex items-center justify-between w-full max-w-[1200px]">
                        <div className="flex items-center gap-4">
                            <div className="size-8 text-[#f27f0d]">
                                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>health_and_safety</span>
                            </div>
                            <h2 className="text-[#181411] text-xl font-bold leading-tight tracking-[-0.015em]">하이스트비뇨기과 의원</h2>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <nav className="flex gap-6 items-center">
                                <a className="text-[#181411] text-sm font-medium hover:text-[#f27f0d] transition-colors" href="/">홈</a>
                                <a className="text-[#181411] text-sm font-medium hover:text-[#f27f0d] transition-colors" href="/medical">진료과목</a>
                            </nav>
                            <button className="bg-[#f27f0d] hover:bg-orange-600 text-white text-sm font-bold h-10 px-6 rounded-full transition-colors shadow-sm">
                                상담 예약
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex flex-col items-center py-8 px-4 md:px-10 grow">
                <div className="flex flex-col max-w-[960px] w-full flex-1 gap-6">
                    {/* Breadcrumb */}
                    <div className="flex flex-wrap gap-2 items-center text-sm md:text-base">
                        <a className="text-[#8a7560] font-medium hover:underline" href="/">홈</a>
                        <span className="text-[#8a7560]">/</span>
                        <a className="text-[#8a7560] font-medium hover:underline" href="/medical">진료과목</a>
                        <span className="text-[#8a7560]">/</span>
                        <span className="text-[#181411] font-bold">여유증/가슴살 분석</span>
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-4 mt-2">
                        <h1 className="text-[#181411] text-3xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                            고해상도 360° 분석 결과
                        </h1>
                        <p className="text-[#8a7560] text-lg font-normal max-w-2xl">
                            예상되는 변화를 확인해보세요.
                        </p>
                    </div>

                    {/* 360 Spinner Demo */}
                    <div className="w-full mt-6 flex flex-col gap-6">
                        <GynecoSpinner fps={9} switchAfterMs={2000} />

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
                            <button
                                onClick={() => openChat({ area: 'medical', intent: 'report' })}
                                className="flex flex-col items-center justify-center p-6 gap-3 rounded-xl bg-[#1e293b] text-white hover:bg-[#0f172a] hover:-translate-y-1 transition-all shadow-md group border border-[#334155]"
                            >
                                <span className="material-symbols-outlined text-4xl text-blue-100 group-hover:scale-110 transition-transform">analytics</span>
                                <span className="font-bold text-lg text-center leading-snug">시뮬레이션 정밀 분석<br />보고서 열람</span>
                            </button>

                            <button
                                onClick={() => openChat({ area: 'medical', intent: 'booking' })}
                                className="flex flex-col items-center justify-center p-6 gap-3 rounded-xl bg-[#f27f0d] text-white hover:bg-orange-600 hover:-translate-y-1 transition-all shadow-lg shadow-orange-500/20 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <span className="material-symbols-outlined text-4xl relative z-10 group-hover:scale-110 transition-transform">videocam</span>
                                <span className="font-bold text-lg text-center leading-snug relative z-10">의료진 1:1<br />화상 상담 예약</span>
                            </button>

                            <button
                                onClick={() => openChat({ area: 'medical', intent: 'general' })}
                                className="flex flex-col items-center justify-center p-6 gap-3 rounded-xl bg-[#0d9488] text-white hover:bg-[#0f766e] hover:-translate-y-1 transition-all shadow-md group border border-[#115e59]"
                            >
                                <span className="material-symbols-outlined text-4xl text-teal-100 group-hover:scale-110 transition-transform">medical_services</span>
                                <span className="font-bold text-lg text-center leading-snug">수술 프로세스 및<br />비용 안내</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer brandName="하이스트비뇨기과 의원" />
        </div>
    );
}
