'use client';

import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';

export default function GynecoDemoPage() {
    const { openChat, setArea } = useChatStore();
    const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: Connect to auth state
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isAfter, setIsAfter] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const TOTAL_FRAMES = 36;
    const FRAME_RATE = 100; // ms per frame (10fps)
    const BEFORE_DURATION = 2000; // 2 seconds before transition

    useEffect(() => {
        setArea('medical');

        // For demo purposes, auto-login after component mount
        // In production, this would check actual auth state
        const timer = setTimeout(() => {
            setIsLoggedIn(true);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [setArea]);

    // Frame animation
    useEffect(() => {
        if (!isLoggedIn || isLoading) return;

        // Start frame rotation
        frameIntervalRef.current = setInterval(() => {
            setCurrentFrame((prev) => (prev + 1) % TOTAL_FRAMES);
        }, FRAME_RATE);

        // Transition to "after" after 2 seconds
        transitionTimeoutRef.current = setTimeout(() => {
            setIsAfter(true);
        }, BEFORE_DURATION);

        return () => {
            if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
            if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
        };
    }, [isLoggedIn, isLoading]);

    const handleLogin = () => {
        window.location.href = '/login?redirect=/medical/gyneco-demo';
    };

    // Locked screen for non-logged in users
    if (!isLoggedIn) {
        return (
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f5]">
                {/* Header */}
                <header className="w-full bg-white border-b border-[#f5f2f0]">
                    <div className="flex justify-center px-4 md:px-10 py-3">
                        <div className="flex items-center justify-between w-full max-w-[1200px]">
                            <div className="flex items-center gap-4">
                                <div className="size-8 text-[#f27f0d]">
                                    <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>health_and_safety</span>
                                </div>
                                <h2 className="text-[#181411] text-xl font-bold leading-tight tracking-[-0.015em]">HIC Urology</h2>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Locked Content */}
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
                                전면 이미지는 로그인 이후 이용 가능합니다.
                            </p>
                            <button
                                onClick={handleLogin}
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
            {/* Header */}
            <header className="w-full bg-white border-b border-[#f5f2f0]">
                <div className="flex justify-center px-4 md:px-10 py-3">
                    <div className="flex items-center justify-between w-full max-w-[1200px]">
                        <div className="flex items-center gap-4">
                            <div className="size-8 text-[#f27f0d]">
                                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>health_and_safety</span>
                            </div>
                            <h2 className="text-[#181411] text-xl font-bold leading-tight tracking-[-0.015em]">HIC Urology</h2>
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

            {/* Main Content */}
            <main className="flex flex-col items-center py-8 px-4 md:px-10 grow">
                <div className="flex flex-col max-w-[960px] w-full flex-1 gap-6">
                    {/* Breadcrumb */}
                    <div className="flex flex-wrap gap-2 items-center text-sm md:text-base">
                        <a className="text-[#8a7560] font-medium hover:underline" href="/">홈</a>
                        <span className="text-[#8a7560]">/</span>
                        <a className="text-[#8a7560] font-medium hover:underline" href="/medical">진료과목</a>
                        <span className="text-[#8a7560]">/</span>
                        <span className="text-[#181411] font-bold">여유증 시뮬레이션</span>
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-4 mt-2">
                        <h1 className="text-[#181411] text-3xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                            고해상도 분석 결과
                        </h1>
                        <p className="text-[#8a7560] text-lg font-normal max-w-2xl">
                            예상되는 변화를 확인해보세요. 아래 영상은 시각화 예시입니다.
                        </p>
                    </div>

                    {/* 360 Viewer */}
                    <div className="w-full mt-6 flex flex-col gap-6">
                        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-200 to-gray-300 ring-1 ring-black/5">
                            {/* Before/After Viewer (Simulated with gradient backgrounds) */}
                            <div className="absolute inset-0 flex">
                                {/* Before Side */}
                                <div className={`w-1/2 h-full relative transition-all duration-500 ${isAfter ? 'opacity-30' : 'opacity-100'}`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#d4a574] to-[#c4956a] flex items-center justify-center">
                                        <div className="text-center text-white/80">
                                            <span className="material-symbols-outlined text-6xl mb-2">person</span>
                                            <p className="text-sm font-medium">수술 전</p>
                                            <p className="text-xs mt-1">Frame: {currentFrame.toString().padStart(3, '0')}</p>
                                        </div>
                                    </div>
                                    <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        수술 전
                                    </span>
                                </div>

                                {/* After Side */}
                                <div className={`w-1/2 h-full relative transition-all duration-500 ${isAfter ? 'opacity-100' : 'opacity-50'}`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#e8c9a8] to-[#dab896] flex items-center justify-center">
                                        <div className="text-center text-white/80">
                                            <span className="material-symbols-outlined text-6xl mb-2">person</span>
                                            <p className="text-sm font-medium">결과 (예시)</p>
                                            <p className="text-xs mt-1">Frame: {currentFrame.toString().padStart(3, '0')}</p>
                                        </div>
                                    </div>
                                    <span className="absolute top-4 right-4 bg-[#f27f0d]/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-20 shadow-lg">
                                        결과 (예시)
                                    </span>
                                </div>

                                {/* Divider */}
                                <div className="absolute inset-y-0 left-1/2 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] z-30">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 bg-white rounded-full flex items-center justify-center shadow-xl text-[#f27f0d] border-4 border-white ring-1 ring-black/5">
                                        <span className="material-symbols-outlined">compare_arrows</span>
                                    </div>
                                </div>
                            </div>

                            {/* Loading overlay */}
                            {isLoading && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-40">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-[#f27f0d] border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-[#181411] font-medium">시뮬레이션 로딩 중...</p>
                                    </div>
                                </div>
                            )}

                            {/* Transition indicator */}
                            {!isLoading && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full z-30">
                                    <p className="text-white text-xs font-medium">
                                        {isAfter ? '✨ 결과 시뮬레이션 표시 중' : '⏳ 2초 후 결과로 전환됩니다...'}
                                    </p>
                                </div>
                            )}
                        </div>

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

                        {/* Additional Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-6 pt-8 border-t border-gray-200">
                            <div
                                onClick={() => openChat({ area: 'medical' })}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer group flex flex-col gap-4"
                            >
                                <div className="size-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-3xl">chat</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-bold text-lg text-[#181411]">AI 챗봇에게 증상 문의하기</h3>
                                    <p className="text-sm text-gray-500">24시간 언제든 궁금한 점을 물어보세요</p>
                                </div>
                            </div>

                            <div
                                onClick={() => openChat({ area: 'medical', intent: 'report' })}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer group flex flex-col gap-4"
                            >
                                <div className="size-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-3xl">folder_special</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-bold text-lg text-[#181411]">나의 시뮬레이션 기록 관리</h3>
                                    <p className="text-sm text-gray-500">저장된 분석 결과와 변화를 한눈에</p>
                                </div>
                            </div>

                            <div
                                onClick={() => openChat({ area: 'medical', intent: 'booking' })}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer group flex flex-col gap-4"
                            >
                                <div className="size-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-3xl">calendar_month</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-bold text-lg text-[#181411]">프라이빗 예약 현황 확인</h3>
                                    <p className="text-sm text-gray-500">진료 및 상담 일정을 관리하세요</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-8 text-center text-gray-400 text-sm mt-8 border-t border-gray-200">
                <p>© 2024 하이스트 비뇨의학과. All rights reserved.</p>
            </footer>
        </div>
    );
}
