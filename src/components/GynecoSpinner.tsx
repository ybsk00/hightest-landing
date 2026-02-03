'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { preloadImages } from '@/lib/utils/preload';
import { buildFrameUrls } from '@/lib/utils/frames';

export function GynecoSpinner({
    fps = 9,
}: {
    fps?: number;
    switchAfterMs?: number; // Deprecated but kept for compatibility
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
                console.warn('Preload warning:', e);
                if (mounted) setReady(true);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [beforeUrls, afterUrls]);

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

    if (!ready) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <div className="w-8 h-8 border-2 border-[#f27f0d] border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-gray-500 text-xs font-medium animate-pulse">고해상도 분석 중...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 w-full max-w-[800px] mx-auto">
            {/* Before View */}
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-gray-900 border border-gray-800">
                <img
                    src={beforeUrls[idx]}
                    alt={`Before frame ${idx}`}
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/10">
                    수술 전
                </span>
            </div>

            {/* After View */}
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-gray-900 border border-gray-800">
                <img
                    src={afterUrls[idx]}
                    alt={`After frame ${idx}`}
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                />
                <span className="absolute top-3 right-3 bg-[#f27f0d] text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    결과 시뮬레이션
                </span>
            </div>
        </div>
    );
}
