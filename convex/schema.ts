import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    ...authTables,
    // 1. 리드 수집 테이블
    leads: defineTable({
        email: v.string(),
        phone: v.optional(v.string()),
        name: v.optional(v.string()),
        concern_type: v.optional(v.string()), // 'condition', 'urination', 'prostate', 'health'
        source: v.optional(v.string()), // 'healthcare' or 'medical'
    }).index("by_email", ["email"]),

    // 2. 채팅 세션 테이블
    chat_sessions: defineTable({
        user_id: v.id("users"), // Reference to auth users table
        area: v.string(), // 'healthcare' or 'medical'
        agent_type: v.optional(v.string()), // 'h-closer', 'm-gyneco', 'm-penile', 'm-general'
        turn_count: v.optional(v.number()),
        status: v.optional(v.string()), // 'active', 'completed', 'converted'
    }).index("by_user_id", ["user_id"]),

    // 3. 채팅 메시지 테이블
    chat_messages: defineTable({
        session_id: v.id("chat_sessions"),
        role: v.string(), // 'user' or 'assistant'
        content: v.string(),
        agent_used: v.optional(v.string()),
        cta_type: v.optional(v.string()), // 'login', 'booking', 'demo'
    }).index("by_session_id", ["session_id"]),

    // 4. 예약 요청 테이블
    booking_requests: defineTable({
        user_id: v.id("users"),
        session_id: v.optional(v.id("chat_sessions")),
        concern_type: v.optional(v.string()),
        preferred_date: v.optional(v.string()), // DATE string
        preferred_time: v.optional(v.string()),
        contact_phone: v.optional(v.string()),
        notes: v.optional(v.string()),
        status: v.optional(v.string()), // 'pending', 'confirmed', 'cancelled'
    }).index("by_user_id", ["user_id"]).index("by_status", ["status"]),

    // 5. 사용자 프로필 부분 확장 (NextAuth의 기능을 Convex에서 쓰려면 users 테이블을 확장하거나 별도 프로필 사용)
    // Convex Auth는 users 테이블을 자동으로 제공합니다. 그 외 필요한 필드가 있다면 users 대신 별도의 테이블 추가.
    user_profiles: defineTable({
        user_id: v.id("users"), // Reference to users table
        display_name: v.optional(v.string()),
        phone: v.optional(v.string()),
        birth_year: v.optional(v.number()),
        gender: v.optional(v.string()),
        marketing_consent: v.optional(v.boolean()),
    }).index("by_user_id", ["user_id"]),
});
