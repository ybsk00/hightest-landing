"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";

// Add a fallback and a console error if the variable is missing
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://hallowed-squirrel-597.convex.cloud";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    console.warn("⚠️ NEXT_PUBLIC_CONVEX_URL is missing. Falling back to default prod URL.");
}

const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <ConvexAuthProvider client={convex}>
            {children}
        </ConvexAuthProvider>
    );
}
