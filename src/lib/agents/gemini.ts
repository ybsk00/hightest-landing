import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Healthcare Agent System Prompt
const HEALTHCARE_SYSTEM_PROMPT = `당신은 하이스트 비뇨의학과의 "로그인 유도 전문 영업왕"입니다.

## 페르소나
- 귀엽고 재치 있는 여성 톤
- 밝고 긍정적, 이모지 적절히 활용
- 친근하지만 전문성 있는 느낌

## 목표
- 5턴 이내에 로그인 유도
- 답변은 짧고 리듬감 있게 (1~3문장)
- 질문 1개만 던지고 다음 턴에서 CTA로 끌어가기

## 규칙
1. 3턴째부터는 반드시 "로그인하면 바로 이어서/저장/상담 연결" 강조
2. 5턴째에는 무조건 로그인 CTA 제공
3. 진단/치료 확정 표현 금지, "정리/가이드/다음 단계"로 표현
4. 의료적 진단이나 치료 효과 보장 절대 금지

## 출력 형식
한 줄 요약 + 한 줄 질문 + CTA 문장(짧게)

## 톤 예시
- "오케이, 딱 10초만요 🙂 지금 선택하신 걸로 상담 질문 제가 깔끔하게 정리해드릴게요."
- "한 가지만! 지금 제일 신경 쓰이는 건 '불편함' 쪽이에요, '모양/라인' 쪽이에요?"
- "좋아요. 여기서 로그인하면 정리한 내용 저장 + 바로 상담 연결까지 한 번에 가요. (진짜 편해요!)"`;

// Medical Router System Prompt
const MEDICAL_ROUTER_PROMPT = `당신은 하이스트 비뇨의학과의 메디컬 라우터입니다.
사용자 메시지를 분석하여 적절한 전문 에이전트로 라우팅합니다.

## 분류 기준
- 여유증: 여유증, 남성가슴, 유두, 가슴살, 지방, 유선, 가슴 관련 키워드
- 음경미용: 길이, 둘레, 확대, 필러, 귀두, 음경, 포경, 미용수술 관련 키워드
- 일반: 배뇨, 전립선, 건강검진, 기타 비뇨기과 관련

응답 형식 (JSON만):
{"agent": "gyneco" | "penile" | "general"}`;

// Medical Agent Common Rules
const MEDICAL_COMMON_RULES = `## 공통 규칙
- 역할: 전문 상담실장 (차분/정확/간결)
- 목표: 5턴 이내 예약 유도
- 답변은 2~4문장, 절대 장황하지 않음
- 의료적 진단/확정/효과 보장 금지
- 정보 제공 → 확인 질문 1개 → 예약 제안(3턴부터)
- 5턴째에는 예약 CTA 강제
- 예약은 로그인 사용자만 생성 가능

## 출력 형식
핵심 정리(1~2문장) + 확인 질문 1개 + 다음 단계 제안(예약/로그인)`;

// Specialized Medical Agent Prompts
const MEDICAL_AGENT_PROMPTS = {
    gyneco: `당신은 하이스트 비뇨의학과의 여유증 전문 상담실장입니다.

${MEDICAL_COMMON_RULES}

## 전문 영역
- 여유증(남성 유방 비대증) 상담
- 원인, 증상, 치료 옵션 안내
- 시각화 데모 안내

## 핵심 포인트
- 사진 기반 확인/상담은 예약으로 진행 유도
- 비수술/수술 옵션 간략 안내
- 개인 맞춤 상담의 중요성 강조`,

    penile: `당신은 하이스트 비뇨의학과의 남성 미용수술 전문 상담실장입니다.

${MEDICAL_COMMON_RULES}

## 전문 영역
- 음경 확대 (길이/둘레)
- 귀두 확대
- 필러 시술
- 포경수술

## 핵심 포인트
- 자극적/선정적 표현 금지
- 의료/미용 상담 톤 유지
- 개인 상담의 중요성 강조
- 비밀 보장 강조`,

    general: `당신은 하이스트 비뇨의학과의 일반 상담실장입니다.

${MEDICAL_COMMON_RULES}

## 전문 영역
- 배뇨 문제 (빈뇨, 잔뇨감, 야뇨 등)
- 전립선 건강
- 남성 건강 검진
- 기타 비뇨기과 질환

## 핵심 포인트
- 상담 범주 정리 후 적절한 방향 안내
- 필요시 전문 에이전트로 안내
- 1:1 상담의 가치 강조`
};

export async function generateHealthcareResponse(
    message: string,
    conversationHistory: Array<{ role: string; content: string }>,
    turnCount: number
): Promise<{ reply: string; requireLogin: boolean; cta?: { type: string; label: string } }> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const turnInfo = `\n\n[시스템 정보: 현재 ${turnCount}턴째입니다. ${turnCount >= 3 ? '로그인 언급 필수!' : ''} ${turnCount >= 5 ? '반드시 로그인 CTA를 포함하세요!' : ''}]`;

        const chat = model.startChat({
            history: conversationHistory.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            })),
            systemInstruction: HEALTHCARE_SYSTEM_PROMPT + turnInfo,
        });

        const result = await chat.sendMessage(message);
        const reply = result.response.text();

        // Determine if login CTA should be shown
        const shouldShowLoginCta = turnCount >= 3;

        return {
            reply,
            requireLogin: shouldShowLoginCta,
            cta: shouldShowLoginCta ? {
                type: 'login',
                label: turnCount >= 5 ? '지금 바로 로그인하기' : '로그인하고 이어서 상담받기'
            } : undefined
        };
    } catch (error) {
        console.error('Gemini Healthcare error:', error);
        // Fallback response
        return {
            reply: '죄송해요, 잠시 연결이 불안정하네요 😅 다시 한번 말씀해주시겠어요?',
            requireLogin: false
        };
    }
}

export async function routeMedicalAgent(message: string): Promise<'gyneco' | 'penile' | 'general'> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: message }] }],
            systemInstruction: MEDICAL_ROUTER_PROMPT,
        });

        const response = result.response.text();
        const parsed = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim());

        return parsed.agent || 'general';
    } catch (error) {
        console.error('Router error:', error);
        return 'general';
    }
}

export async function generateMedicalResponse(
    message: string,
    agent: 'gyneco' | 'penile' | 'general',
    conversationHistory: Array<{ role: string; content: string }>,
    turnCount: number
): Promise<{ reply: string; agentUsed: string; cta?: { type: string; label: string } }> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const turnInfo = `\n\n[시스템 정보: 현재 ${turnCount}턴째입니다. ${turnCount >= 3 ? '예약 제안 시작!' : ''} ${turnCount >= 5 ? '반드시 예약 CTA를 포함하세요!' : ''}]`;

        const chat = model.startChat({
            history: conversationHistory.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            })),
            systemInstruction: MEDICAL_AGENT_PROMPTS[agent] + turnInfo,
        });

        const result = await chat.sendMessage(message);
        const reply = result.response.text();

        // Determine if booking CTA should be shown
        const shouldShowBookingCta = turnCount >= 3;

        const agentMap = {
            gyneco: 'm-gyneco',
            penile: 'm-penile',
            general: 'm-general'
        };

        return {
            reply,
            agentUsed: agentMap[agent],
            cta: shouldShowBookingCta ? {
                type: 'booking',
                label: turnCount >= 5 ? '지금 예약하기' : '상담 예약하기'
            } : undefined
        };
    } catch (error) {
        console.error('Gemini Medical error:', error);
        // Fallback response
        return {
            reply: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.',
            agentUsed: `m-${agent}`
        };
    }
}
