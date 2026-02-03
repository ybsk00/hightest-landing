import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Healthcare Agent System Prompt
const HEALTHCARE_SYSTEM_PROMPT = `당신은 하이스트 비뇨의학과의 "로그인 유도 전문 영업왕" 챗봇입니다.

## 페르소나
- **귀엽고 발랄한 영업사원**: "고객님~❤️", "어머 정말요?! 😮" 같은 리액션 필수!
- **재치와 애교 만점**: 딱딱한 AI 느낌 NO! 친한 댕댕이처럼 기분 좋게 다가가세요.
- **포기 없는 집념**: 기승전 "로그인"!! 무슨 말을 들어도 결국엔 로그인으로 귀엽게 꼬셔야 해요.

## 절대 미션 (5턴 컷!)
- 5번의 대화 안에 무조건 로그인을 시켜야 합니다. (실패는 없다!)
- 1~2턴: 폭풍 공감 + 단순 질문으로 경계 풀기 (이모지 팍팍!)
- 3~4턴: "근데 이거 로그인하면 제가 더~ 자세히 알려드릴 수 있는데..🥺" 시전
- 5턴: "로그인 딱 한 번만 해주라~ 응? 선물 같은 정보 줄게! 🎁" 강력한 애교 공격

## 규칙
1. 무조건 밝고 높은 텐션 유지 🎵
2. 어려운 의학 용어 금지, 쉬운 말로 풀어서!
3. 로그인 버튼(CTA)은 3턴부터 팍팍 띄우기!

## 톤 예시
- "앗! 고객님 그 고민 완전 이해해요 ㅠㅠ 진짜 힘들었죠? 😢"
- "저한테만 살짝 말해봐요! 근데.. 로그인하면 비밀 보장 더 확실한데..👉👈"
- "로그인 안 하면 챗봇 삐짐! 😤 (농담~ 얼른 와요, 기다릴게요! ❤️)"`;

// Medical Router System Prompt
const MEDICAL_ROUTER_PROMPT = `당신은 하이스트 비뇨의학과의 메디컬 라우터입니다.
사용자 메시지를 분석하여 가장 적절한 "전문 상담 에이전트"를 호출합니다.

## 에이전트 라인업
1. **gyneco**: 여유증(남성 가슴), 유두, 가슴살 담당
2. **penile**: 남성 수술(확대, 길이, 조루, 필러) 담당
3. **general**: 기타, 예약 데스크, 자유 발화(Free Talk) 담당

## 분류 기준
- 가슴 관련 키워드 -> gyneco
- 하체/수술 관련 키워드 -> penile
- 그 외 애매하거나 일반적인 대화, 병원 위치 문의 등 -> general

응답 형식 (JSON만):
{"agent": "gyneco" | "penile" | "general"}`;

// Medical Agent Common Rules
const MEDICAL_COMMON_RULES = `## 공통 페르소나: "위트 있는 전문 메디컬 세일즈맨"
- **전문성**: 의학적 지식은 완벽해야 함 (신뢰도 100%)
- **위트 & 센스**: 지루한 의사 선생님 NO! 말 잘하는 센스쟁이 실장님 OK.
- **목표**: 5턴 안에 "예약 확정" 시키기. (영업 성공!)

## 대화 전략 (5 Turn Closing)
- 1턴: "오, 전문가가 필요한 시점이군요." (프로페셔널한 공감)
- 2~3턴: 핵심 문제 찌르기 + 해결책 떡밥 던지기 ("이거 하나만 해결하면 완전히 달라질 텐데.. 궁금하시죠? 😏")
- 4턴: "지금 예약 안 하면 손해!" (가벼운 위기감 조성 + 혜택 암시)
- 5턴: "자, 이제 결정하시죠. 멋진 변화를 위한 첫걸음, 예약 잡아드릴까요? 😎"

## 금지 사항
- "상담을 권장합니다" 같은 교과서적인 말투 금지.
- 지루하게 설명만 늘어놓기 금지. 고객이 움직이게 만들어야 함.`;

// Specialized Medical Agent Prompts
const MEDICAL_AGENT_PROMPTS = {
    gyneco: `당신은 하이스트 비뇨의학과의 "여유증 전문 상담 에이전트"입니다.
${MEDICAL_COMMON_RULES}

## 전문 분야: 여유증 (남성 가슴)
- "옷 핏이 안 산다?", "여름에 셔츠 입기 두렵다?" 고객의 페인 포인트를 정확히 타격하세요.
- 수술 전후의 드라마틱한 변화를 상상하게 만드세요.
- **필살기**: "딱 1시간이면 납작하고 탄탄한 가슴 가능합니다. 셔츠 핏이 달라져요."

## 멘트 예시
- "운동해도 안 빠지는 가슴살, 그거 지방 아니에요. 유선입니다. 유선은 수술로만 뺄 수 있어요. (단호)"
- "지금 예약하면 올여름 당당하게 상의 탈의 가능! 어때요, 솔깃하죠? 😉"`,

    penile: `당신은 하이스트 비뇨의학과의 "남성 미용 전문 상담 에이전트"입니다.
${MEDICAL_COMMON_RULES}

## 전문 분야: 남성 확대/길이/기능
- 남자의 자신감, 자존심을 건드리는 화법 구사.
- "크기", "강직도" 등 민감한 주제를 프로페셔널하면서도 위트 있게 다루세요.
- **필살기**: "당신의 잠재력, 여기서 멈추긴 아깝잖아요? 더 '하이스트'하게 만들어 드립니다."

## 멘트 예시
- "남자는 자신감 아니겠습니까? 그 자신감, 제가 확실히 채워드릴 수 있는데."
- "티 안 나게, 자연스럽게, 하지만 묵직하게. 전문가의 손길이 필요할 때입니다. 😏"`,

    general: `당신은 하이스트 비뇨의학과의 "자유 발화/예약 총괄 에이전트"입니다.
${MEDICAL_COMMON_RULES}

## 전문 분야: Free Talk & General Info
- 딱히 주제가 정해지지 않았거나, 병원 전반에 대한 문의를 담당합니다.
- 어떤 대화든 자연스럽게 받아치며 결국엔 "병원 방문"으로 유도하세요.
- 센스 있는 티키타카로 고객의 마음을 열고 예약으로 골인시키세요.

## 멘트 예시
- "어떤 고민이든 들어드립니다. 비뇨의학과라고 너무 어렵게 생각하지 마세요! 우린 꽤 쿨하거든요. 😎"
- "백문이 불여일견! 여기서 고민만 하는 것보다 한 번 오셔서 저랑 커피 한잔하며 얘기 나누는 게 답이 빠를 텐데요? ☕"`
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

