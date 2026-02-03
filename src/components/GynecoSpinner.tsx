'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { preloadImages } from '@/lib/utils/preload';
import { buildFrameUrls } from '@/lib/utils/frames';

type Mode = 'before' | 'after';

export function GynecoSpinner({
    fps = 9,
    switchAfterMs = 2000,
}: {
    fps?: number;
    switchAfterMs?: number;
}) {
    const beforeUrls = useMemo(
        () => buildFrameUrls('/before', 10),
        []
    );
    const afterUrls = useMemo(
        () => buildFrameUrls('/after', 10),
        []
    );

    const [ready, setReady] = useState(false);
    const [mode, setMode] = useState<Mode>('before');
    const [idx, setIdx] = useState(0);
    const dirRef = useRef<1 | -1>(1);

    // Preload images
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                await preloadImages([...beforeUrls, ...afterUrls]);
                if (mounted) setReady(true);
            } catch (e) {
                // Fallback: Proceed even if preload fails partially
                console.warn('Preload warning:', e);
                if (mounted) setReady(true);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [beforeUrls, afterUrls]);

    // Transition to "after" 2 seconds after ready
    useEffect(() => {
        if (!ready) return;
        const t = setTimeout(() => setMode('after'), switchAfterMs);
        return () => clearTimeout(t);
    }, [ready, switchAfterMs]);

    // Ping-Pong Animation Logic
    useEffect(() => {
        if (!ready) return;
        const intervalMs = Math.round(1000 / fps);

        const timer = setInterval(() => {
            setIdx((prev) => {
                const last = 9;
                let next = prev + dirRef.current;

                if (next >= last) {
                    next = last;
                    dirRef.current = -1;
                } else if (next <= 0) {
                    next = 0;
                    dirRef.current = 1;
                }
                return next;
            });
        }, intervalMs);

        return () => clearInterval(timer);
    }, [ready, fps]);

    return (
        <div className="relative w-full aspect-[4/5] max-w-[480px] mx-auto rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-gray-800">
            {/* Loading State */}
            {!ready && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-20">
                    <div className="w-8 h-8 border-2 border-[#f27f0d] border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-gray-500 text-xs font-medium animate-pulse">고해상도 분석 중...</p>
                </div>
            )}

            {/* Frame Viewer with Cross-fade */}
            <div className="relative w-full h-full">
                {/* Before Layer */}
                <div
                    className={`absolute inset-0 transition-opacity duration-100 ease-in-out ${mode === 'before' ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img
                        src={beforeUrls[idx]}
                        alt={`Before frame ${idx}`}
                        className="w-full h-full object-cover select-none"
                        draggable={false}
                    />
                    <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        수술 전
                    </span>
                </div>

                {/* After Layer */}
                <div
                    className={`absolute inset-0 transition-opacity duration-100 ease-in-out ${mode === 'after' ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img
                        src={afterUrls[idx]}
                        alt={`After frame ${idx}`}
                        className="w-full h-full object-cover select-none"
                        draggable={false}
                    />
                    <span className="absolute top-4 right-4 bg-[#f27f0d]/90 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">
                        결과 시뮬레이션
                    </span>
                </div>
            </div>

            {/* Debug/Info Overlay */}
            {/* <div className="absolute bottom-2 right-2 text-[10px] text-white/50 bg-black/20 px-1 rounded">
        {mode} · {idx}
      </div> */}
        </div>
    );
}
