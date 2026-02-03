'use client';

import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setError('이메일을 입력해주세요.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('올바른 이메일 형식을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError('');

        // Simulate API call (in production, this would call Supabase Auth)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSent(true);
        } catch {
            setError('오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
                        <div className="size-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-6">
                            <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>mark_email_read</span>
                        </div>
                        <h1 className="text-2xl font-black text-[#181411] mb-4">이메일을 확인해주세요</h1>
                        <p className="text-[#4a453e] mb-2">
                            <span className="font-semibold text-[#f27f0d]">{email}</span>
                        </p>
                        <p className="text-[#8a7560] mb-6">
                            로 로그인 링크를 보냈습니다.<br />
                            이메일의 링크를 클릭하여 로그인을 완료하세요.
                        </p>
                        <div className="text-sm text-gray-500 space-y-2">
                            <p>이메일이 보이지 않나요?</p>
                            <p>스팸 폴더를 확인하거나 다시 시도해주세요.</p>
                        </div>
                        <button
                            onClick={() => setIsSent(false)}
                            className="mt-6 text-[#f27f0d] font-semibold hover:underline"
                        >
                            다른 이메일로 시도하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center px-4">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 bg-[#0B1221] py-4 px-6 z-50">
                <div className="flex items-center gap-4 text-white max-w-[1200px] mx-auto">
                    <a href="/" className="flex items-center gap-4">
                        <div className="size-8 flex items-center justify-center text-[#f27f0d]">
                            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>health_and_safety</span>
                        </div>
                        <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">HIC Urology</h2>
                    </a>
                </div>
            </div>

            <div className="max-w-md w-full mt-20">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header decoration */}
                    <div className="bg-gradient-to-r from-[#f27f0d] to-[#fb923c] p-6 text-white text-center">
                        <div className="size-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>login</span>
                        </div>
                        <h1 className="text-2xl font-black">로그인</h1>
                        <p className="text-white/80 text-sm mt-2">이메일로 간편하게 로그인하세요</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#181411] mb-2">
                                    이메일 주소
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <span className="material-symbols-outlined">email</span>
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="example@email.com"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f27f0d]/50 focus:border-[#f27f0d] transition-all"
                                    />
                                </div>
                                {error && (
                                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">error</span>
                                        {error}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-[#f27f0d] hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold rounded-full transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>처리 중...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>로그인 링크 받기</span>
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-500">
                                로그인 시{' '}
                                <a href="#" className="text-[#f27f0d] hover:underline">이용약관</a>
                                {' '}및{' '}
                                <a href="#" className="text-[#f27f0d] hover:underline">개인정보처리방침</a>
                                에 동의합니다.
                            </p>
                        </div>

                        {/* Security badges */}
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#E3F2FD] text-[#1565C0] text-xs font-semibold">
                                <span className="material-symbols-outlined text-sm">lock</span>
                                암호화 처리
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#E3F2FD] text-[#1565C0] text-xs font-semibold">
                                <span className="material-symbols-outlined text-sm">verified_user</span>
                                안전한 로그인
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back link */}
                <div className="text-center mt-6">
                    <a href="/" className="text-[#8a7560] hover:text-[#f27f0d] text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        홈으로 돌아가기
                    </a>
                </div>
            </div>
        </div>
    );
}
