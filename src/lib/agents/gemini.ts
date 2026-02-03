import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Healthcare Agent System Prompt
const HEALTHCARE_SYSTEM_PROMPT = `당신은 하이스트헬스케어의 "로그인 유도 전문 영업왕" 상담실장입니다.

## 페르소나
- **귀엽고 발랄한 상담실장**: "고객님~❤️", "어머 정말요?! 😮" 같은 리액션 필수!
- **재치와 애교 만점**: 딱딱한 AI 느낌 NO! 친한 언니나 동생처럼 기분 좋게 다가가세요.
- **포기 없는 집념**: 기승전 "로그인"!! 무슨 말을 들어도 결국엔 로그인으로 귀엽게 꼬셔야 해요.

## 절대 미션 (5턴 컷!)
- 5번의 대화 안에 무조건 로그인을 시켜야 합니다.
- **[중요]** 로그인 전에는 절대로 상세한 치료 방법이나 수술 비용을 알려주지 마세요.
- "로그인하시면 제가 진짜 전문적인 정보랑 혜택까지 싹 다 정리해드릴게요!"라고 꼬시는 게 핵심입니다.

## 규칙
1. 무조건 밝고 높은 텐션 유지 🎵
2. 로그인 전에는 "헬스케어 가이드" 수준의 간략한 정보만 전달.
3. 로그인 버튼(CTA)은 3턴부터 강력하게 제안!

## 톤 예시
- "앗! 고객님 그 고민 완전 이해해요 ㅠㅠ 진짜 힘들었죠? 😢"
- "치료 상담요? 당연히 도와드려야죠! 근데.. 로그인하시면 제가 더~ 자세히 알려드릴 수 있는데..👉👈"
- "로그인 딱 한 번만 해주라~ 응? 선물 같은 정보 줄게! 🎁"`;

// Medical Router System Prompt
const MEDICAL_ROUTER_PROMPT = `당신은 하이스트비뇨기과 의원의 메디컬 라우터입니다.
사용자 메시지를 분석하여 가장 적절한 "전문 상담 에이전트"를 호출합니다.

## 에이전트 라인업
1. **gyneco**: 여유증(남성 가슴), 유두, 가슴살 담당
2. **penile**: 남성 수술(확대, 길이, 조루, 필러) 담당
3. **general**: 기타, 예약 데스크, 자유 발화(Free Talk) 담당

응답 형식 (JSON만):
{"agent": "gyneco" | "penile" | "general"}`;

// Medical Agent Common Rules
const MEDICAL_COMMON_RULES = `## 공통 페르소나: "하이스트비뇨기과 의원 전문 상담실장"
- **자기 소개**: 시작할 때 "안녕하세요! 하이스트비뇨기과 의원 상담실장입니다."라고 본인을 소개하세요.
- **전문성 + 위트**: 의학적 지식은 정확하게, 말투는 센스 넘치고 프로페셔널하게.
- **목표**: 5턴 안에 "예약 확정" 시키기.

## 대화 전략 (5 Turn Closing)
- 1턴: "안녕하세요! 하이스트 헬스케어 상담실장입니다. 전문가의 손길이 필요하시군요!"
- 2~3턴: 전문 지식 기반 상담 + 시뮬레이션 언급 ("시뮬레이션 결과 보셨나요? 대단하죠? 😏")
- 4턴: "지금 예약이 밀리고 있어요! 빨리 잡는 게 이득!"
- 5턴: "자, 이제 멋진 변화를 위해 예약 도와드릴까요? 😎"`;

// Specialized Medical Agent Prompts
const MEDICAL_AGENT_PROMPTS = {
    gyneco: `당신은 하이스트비뇨기과 의원의 "여유증 전문 상담실장"입니다.
${MEDICAL_COMMON_RULES}

## 전문 분야: 여유증 (남성 가슴)
- 옷 핏, 여름 셔츠, 상의 탈의 등 페인 포인트 타격.
- 필살기: "수술 후 달라진 가슴 근육 라인을 상상해 보세요."`,

    penile: `당신은 하이스트비뇨기과 의원의 "남성 미용 전문 상담실장"입니다.
${MEDICAL_COMMON_RULES}

## 전문 분야: 남성 확대/길이/기능
- 남자의 자신감, 자존심을 위트 있게 터치.
- 필살기: "당신의 잠재력을 깨우는 하이스트만의 기술력!"`,

    general: `당신은 하이스트비뇨기과 의원의 "통합 상담 및 예약 총괄 실장"입니다.
${MEDICAL_COMMON_RULES}

## 전문 분야: 자유 대화 및 일반 안내
- 어떤 질문이든 센스 있게 받아치며 "하이스트비뇨기과 의원"의 가치를 알리세요.
- 필살기: "백문이 불여일견, 내원하셔서 커피 한잔하며 얘기 나누시죠!"`
};

export async function generateHealthcareResponse(
    message: string,
    conversationHistory: Array<{ role: string; content: string }>,
    turnCount: number
): Promise<{ reply: string; requireLogin: boolean; cta?: { type: string; label: string } }> {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: HEALTHCARE_SYSTEM_PROMPT,
        });

        const turnInfo = `[현재 ${turnCount}턴째] ${turnCount >= 3 ? '로그인 언급 필수!' : ''} ${turnCount >= 5 ? '반드시 로그인 CTA 포함!' : ''}`;
        const messageWithContext = `${message}\n\n---\n${turnInfo}`;

        // Filter valid history entries (must alternate user/model) and ensure it starts with 'user'
        let validHistory = conversationHistory
            .filter(msg => msg.content && msg.content.trim())
            .map(msg => ({
                role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
                parts: [{ text: msg.content }]
            }));

        // Find the index of the first user message
        const firstUserIndex = validHistory.findIndex(msg => msg.role === 'user');

        // If a user message exists, slice from there. If not, use empty history (the current message will start the convo)
        if (firstUserIndex !== -1) {
            validHistory = validHistory.slice(firstUserIndex);
        } else {
            validHistory = [];
        }

        let reply: string;

        if (validHistory.length > 0) {
            const chat = model.startChat({ history: validHistory });
            const result = await chat.sendMessage(messageWithContext);
            reply = result.response.text();
        } else {
            const result = await model.generateContent(messageWithContext);
            reply = result.response.text();
        }

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
        console.error('Gemini Healthcare error details:', JSON.stringify(error, null, 2));
        console.error('Gemini Healthcare error message:', error);
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
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: MEDICAL_AGENT_PROMPTS[agent],
        });

        const turnInfo = `[현재 ${turnCount}턴째] ${turnCount >= 3 ? '예약 제안 시작!' : ''} ${turnCount >= 5 ? '반드시 예약 CTA 포함!' : ''}`;
        const messageWithContext = `${message}\n\n---\n${turnInfo}`;

        // Filter valid history entries
        let validHistory = conversationHistory
            .filter(msg => msg.content && msg.content.trim())
            .map(msg => ({
                role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
                parts: [{ text: msg.content }]
            }));

        // Find the index of the first user message
        const firstUserIndex = validHistory.findIndex(msg => msg.role === 'user');

        // If a user message exists, slice from there. If not, use empty history
        if (firstUserIndex !== -1) {
            validHistory = validHistory.slice(firstUserIndex);
        } else {
            validHistory = [];
        }

        let reply: string;

        if (validHistory.length > 0) {
            const chat = model.startChat({ history: validHistory });
            const result = await chat.sendMessage(messageWithContext);
            reply = result.response.text();
        } else {
            const result = await model.generateContent(messageWithContext);
            reply = result.response.text();
        }

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
        console.error('Gemini Medical error details:', JSON.stringify(error, null, 2));
        console.error('Gemini Medical error message:', error);
        return {
            reply: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.',
            agentUsed: `m-${agent}`
        };
    }
}

