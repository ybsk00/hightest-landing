'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Footer from '@/components/Footer';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (isSignUp) {
                // Sign up
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setSuccess('회원가입이 완료되었습니다! 이메일을 확인해주세요.');
            } else {
                // Sign in
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Redirect on success
                window.location.href = '/medical';
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : '오류가 발생했습니다.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0B1221] via-[#1a2744] to-[#0B1221] flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-6 md:px-10 py-4">
                <a href="/" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
                    <div className="size-8 flex items-center justify-center text-[#f27f0d]">
                        <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>health_and_safety</span>
                    </div>
                    <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">하이스트비뇨기과 의원</h2>
                </a>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Login Card */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-[#f27f0d] to-[#ff9a3c] p-8 text-center">
                            <div className="size-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-white" style={{ fontSize: '32px' }}>person</span>
                            </div>
                            <h1 className="text-white text-2xl font-bold mb-2">
                                {isSignUp ? '회원가입' : '로그인'}
                            </h1>
                            <p className="text-white/80 text-sm">
                                {isSignUp ? '새 계정을 만들어주세요' : '계정에 로그인해주세요'}
                            </p>
                        </div>

                        {/* Card Body */}
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email Input */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        이메일
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mail</span>
                                        </span>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="example@email.com"
                                            required
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f27f0d] focus:border-transparent outline-none transition-all bg-gray-50"
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        비밀번호
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>lock</span>
                                        </span>
                                        <input
                                            type="password"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f27f0d] focus:border-transparent outline-none transition-all bg-gray-50"
                                        />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                                        {error}
                                    </div>
                                )}

                                {/* Success Message */}
                                {success && (
                                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
                                        {success}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-[#f27f0d] hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            처리 중...
                                        </>
                                    ) : (
                                        <>
                                            {isSignUp ? '회원가입' : '로그인'}
                                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Toggle Sign Up / Sign In */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    {isSignUp ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}
                                    <button
                                        onClick={() => {
                                            setIsSignUp(!isSignUp);
                                            setError(null);
                                            setSuccess(null);
                                        }}
                                        className="ml-2 text-[#f27f0d] font-semibold hover:underline"
                                    >
                                        {isSignUp ? '로그인' : '회원가입'}
                                    </button>
                                </p>
                            </div>

                            {/* Security Notice */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
                                        암호화 처리
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified_user</span>
                                        ISMS 준수
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>shield</span>
                                        개인정보 보호
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <a
                            href="/"
                            className="text-white/60 hover:text-white text-sm flex items-center justify-center gap-1 transition-colors"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
                            홈으로 돌아가기
                        </a>
                    </div>
                </div>
            </main>
            <Footer brandName="하이스트비뇨기과 의원" />
        </div>
    );
}
