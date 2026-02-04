'use client';

import { useChatStore } from '@/store/chatStore';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';

// Initialize Supabase (Client-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function MedicalPage() {
    const { openChat, setArea } = useChatStore();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setArea('medical');

        // Check session
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoggedIn(!!session);
        };
        checkSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
        });

        return () => subscription.unsubscribe();
    }, [setArea]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsLoggedIn(false);
        window.location.href = '/';
    };

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
                            <h2 className="text-[#181411] text-xl font-bold leading-tight tracking-[-0.015em]">하이스트비뇨기과 의원</h2>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <nav className="flex gap-6 items-center">
                                <a className="text-[#181411] text-sm font-medium hover:text-[#f27f0d] transition-colors" href="/">홈</a>
                                <a className="text-[#f27f0d] text-sm font-bold" href="/medical">진료과목</a>
                            </nav>
                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold h-10 px-6 rounded-full transition-colors shadow-sm"
                                >
                                    로그아웃
                                </button>
                            ) : (
                                <button
                                    onClick={() => window.location.href = '/login'}
                                    className="bg-[#f27f0d] hover:bg-orange-600 text-white text-sm font-bold h-10 px-6 rounded-full transition-colors shadow-sm"
                                >
                                    로그인
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-col items-center py-8 px-4 md:px-10 grow">
                <div className="flex flex-col max-w-[1200px] w-full flex-1 gap-6">

                    {/* Hero Section - Only visible when logged in */}
                    {isLoggedIn && (
                        <section className="w-full mb-8">
                            {/* Section Title */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-gray-400 text-sm">수술 전</span>
                                <span className="text-gray-300">|</span>
                                <span className="text-gray-400 text-sm">수술 후 시뮬레이션</span>
                            </div>

                            {/* Hero Image Cards */}
                            <div className="relative flex flex-col md:flex-row gap-4 mb-6">
                                {/* Before Image */}
                                <div className="flex-1 relative rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="/nano-banana-1770178749754.png"
                                        alt="수술 전후 비교 이미지"
                                        className="w-full h-auto object-cover rounded-2xl"
                                    />
                                    {/* Center Compare Icon */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                        <div className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
                                            <span className="material-symbols-outlined text-gray-400">compare</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* 시뮬레이션 정밀 분석 보고서 */}
                                <div
                                    onClick={() => openChat({ area: 'medical', intent: 'report' })}
                                    className="cursor-pointer bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white p-5 rounded-2xl flex items-center gap-4 transition-all duration-300 group shadow-lg"
                                >
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-2xl">analytics</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-base">시뮬레이션 정밀 분석</span>
                                        <span className="text-sm text-gray-300">보고서 정합</span>
                                    </div>
                                </div>

                                {/* 의료진 1:1 화상 상담 예약 */}
                                <div
                                    onClick={() => openChat({ area: 'medical', intent: 'booking' })}
                                    className="cursor-pointer bg-[#f59e0b] hover:bg-[#d97706] text-white p-5 rounded-2xl flex items-center gap-4 transition-all duration-300 group shadow-lg"
                                >
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-2xl">video_camera_front</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-base">의료진 1:1</span>
                                        <span className="text-sm text-yellow-100">화상 상담 예약</span>
                                    </div>
                                </div>

                                {/* 수술 프로세스 및 비용 안내 */}
                                <div
                                    onClick={() => openChat({ area: 'medical', intent: 'general' })}
                                    className="cursor-pointer bg-[#f8b4b4] hover:bg-[#fca5a5] text-[#7c2d12] p-5 rounded-2xl flex items-center gap-4 transition-all duration-300 group shadow-lg"
                                >
                                    <div className="w-12 h-12 bg-white/40 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-2xl">paid</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-base">수술 프로세스 및</span>
                                        <span className="text-sm text-[#9a3412]">비용 안내</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Breadcrumb - shown when not logged in */}
                    {!isLoggedIn && (
                        <div className="flex flex-wrap gap-2 items-center text-sm md:text-base">
                            <a className="text-[#8a7560] font-medium hover:underline" href="/">홈</a>
                            <span className="text-[#8a7560]">/</span>
                            <a className="text-[#8a7560] font-medium hover:underline" href="/medical">진료과목</a>
                            <span className="text-[#8a7560]">/</span>
                            <span className="text-[#181411] font-bold">여유증 시뮬레이션</span>
                        </div>
                    )}

                    {/* Title */}
                    <div className="flex flex-col gap-4 mt-2">
                        <h1 className="text-[#181411] text-3xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                            전문 진료과목 안내
                        </h1>
                        <p className="text-[#8a7560] text-lg font-normal max-w-2xl">
                            하이스트비뇨기과 의원에서는 남성 건강을 위한 다양한 전문 진료를 제공합니다.
                        </p>
                    </div>

                    {/* Service Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        {/* Gynecomastia Demo */}
                        <div
                            onClick={() => window.location.href = '/medical/gyneco-demo'}
                            className="group cursor-pointer bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all"
                        >
                            <div className="aspect-video bg-gradient-to-br from-[#1e293b] to-[#334155] rounded-xl mb-4 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-5xl">view_in_ar</span>
                            </div>
                            <h3 className="font-bold text-lg text-[#181411] mb-2">여유증 시각화 데모</h3>
                            <p className="text-sm text-gray-500 mb-4">AI 기반 시뮬레이션으로 예상 결과를 미리 확인해보세요.</p>
                            <div className="flex items-center gap-2 text-[#f27f0d] font-semibold text-sm">
                                <span>데모 체험하기</span>
                                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </div>

                        {/* Penile Surgery */}
                        <div
                            onClick={() => openChat({ area: 'medical', intent: 'penile_consult' })}
                            className="group cursor-pointer bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all"
                        >
                            <div className="aspect-video bg-gradient-to-br from-[#0d9488] to-[#14b8a6] rounded-xl mb-4 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-5xl">medical_services</span>
                            </div>
                            <h3 className="font-bold text-lg text-[#181411] mb-2">남성 미용수술</h3>
                            <p className="text-sm text-gray-500 mb-4">개인 맞춤 상담을 통해 최적의 시술 방법을 안내받으세요.</p>
                            <div className="flex items-center gap-2 text-[#f27f0d] font-semibold text-sm">
                                <span>상담 시작하기</span>
                                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </div>

                        {/* General Consultation */}
                        <div
                            onClick={() => openChat({ area: 'medical', intent: 'general' })}
                            className="group cursor-pointer bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all"
                        >
                            <div className="aspect-video bg-gradient-to-br from-[#f27f0d] to-[#fb923c] rounded-xl mb-4 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-5xl">chat</span>
                            </div>
                            <h3 className="font-bold text-lg text-[#181411] mb-2">일반 상담</h3>
                            <p className="text-sm text-gray-500 mb-4">배뇨 문제, 전립선 건강 등 다양한 고민을 상담받으세요.</p>
                            <div className="flex items-center gap-2 text-[#f27f0d] font-semibold text-sm">
                                <span>상담 시작하기</span>
                                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8 pt-8 border-t border-gray-200">
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
            </main>

            <Footer brandName="하이스트비뇨기과 의원" />
        </div>
    );
}
