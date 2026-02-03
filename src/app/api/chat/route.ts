import { NextRequest, NextResponse } from 'next/server';
import {
    generateHealthcareResponse,
    generateMedicalResponse,
    routeMedicalAgent,
} from '@/lib/agents/gemini';

// Fallback responses when API key is not configured
const FALLBACK_HEALTHCARE_RESPONSES = [
    {
        reply: `오케이, 딱 10초만요 🙂 지금 말씀해주신 내용으로 상담 질문 제가 깔끔하게 정리해드릴게요!\n\n한 가지만! 지금 제일 신경 쓰이는 건 '불편함' 쪽이에요, '모양/라인' 쪽이에요?`,
    },
    {
        reply: `아하~ 그렇군요! 충분히 이해해요 💪\n\n비슷한 고민 가지신 분들 정말 많거든요. 저희 상담실장님께서 딱 맞는 방향 잡아드릴 수 있어요.\n\n혹시 이 증상이 언제부터 시작됐어요?`,
    },
    {
        reply: `좋아요, 정리가 잘 되고 있어요! ✨\n\n여기서 **로그인**하시면 지금까지 정리한 내용 저장되고, 바로 전문 상담실장 연결까지 한 번에 가요. (진짜 편해요!)`,
        cta: { type: 'login', label: '로그인하고 이어서 상담받기' }
    },
    {
        reply: `거의 다 왔어요! 🎯\n\n지금까지 정리한 내용 보면, 충분히 상담받아볼 만한 케이스예요. 로그인하시면 개인 맞춤 안내도 바로 확인 가능해요!`,
        cta: { type: 'login', label: '로그인 후 맞춤 안내 받기' }
    },
    {
        reply: `자, 이제 마지막이에요! 🚀\n\n지금 로그인하시면:\n✅ 정리된 상담 내용 저장\n✅ 전문 상담실장 바로 연결\n✅ 개인 맞춤 진료 안내\n\n여기서 끊기면 너무 아깝잖아요~`,
        cta: { type: 'login', label: '지금 바로 로그인하기' }
    }
];

function getFallbackHealthcareResponse(turnCount: number) {
    const idx = Math.min(turnCount, FALLBACK_HEALTHCARE_RESPONSES.length - 1);
    return FALLBACK_HEALTHCARE_RESPONSES[idx];
}

function getFallbackMedicalResponse(turnCount: number, agent: string) {
    const baseResponses: Record<string, string[]> = {
        'm-gyneco': [
            '여유증 관련 문의 감사합니다.\n\n여유증은 남성 유방 조직이 비정상적으로 발달한 상태를 말합니다. 호르몬 변화, 약물, 체중 증가 등 다양한 원인이 있습니다.\n\n현재 증상이 언제부터 나타났는지 말씀해주시겠어요?',
            '말씀하신 상황이라면, 정확한 진단을 위해 전문의 상담이 필요해 보입니다.\n\n저희 시각화 데모를 통해 예상 결과를 미리 확인해보실 수도 있어요.',
            '정리하자면, 현재 상태에서 전문의 상담을 통해 정확한 원인 파악과 맞춤 치료 방향을 확인하시는 것이 좋겠습니다.',
        ],
        'm-penile': [
            '음경 미용/수술 관련 문의 감사합니다.\n\n해당 시술은 개인의 상태와 목표에 따라 다양한 방법이 있습니다. 길이/둘레 확대, 필러, 귀두 확대 등 여러 옵션이 있어요.\n\n어떤 부분이 가장 궁금하신가요?',
            '말씀하신 부분에 대해 더 정확한 안내를 드리려면 전문의 상담이 필요합니다.\n\n비밀 보장은 철저히 하고 있으니 안심하셔도 됩니다.',
            '지금까지 말씀하신 내용을 바탕으로, 1:1 상담을 통해 개인 맞춤 시술 계획을 세워보시는 것을 권장드립니다.',
        ],
        'm-general': [
            '문의해주셔서 감사합니다.\n\n비뇨의학과에서는 남성 건강, 배뇨 문제, 전립선 관리 등 다양한 진료를 제공하고 있습니다.\n\n구체적으로 어떤 부분이 궁금하신가요?',
            '네, 이해했습니다.\n\n해당 증상에 대해 정확한 진단과 안내를 위해서는 전문의 상담이 필요합니다.',
            '지금까지 정리된 내용을 바탕으로, 빠른 시간 내 전문 상담을 받아보시길 권장드립니다.',
        ]
    };

    const responses = baseResponses[agent] || baseResponses['m-general'];
    const idx = Math.min(turnCount, responses.length - 1);

    return {
        reply: responses[idx],
        agentUsed: agent,
        cta: turnCount >= 3 ? {
            type: 'booking',
            label: turnCount >= 5 ? '지금 예약하기' : '상담 예약하기'
        } : undefined
    };
}

// Agent routing keywords for fallback
const GYNECO_KEYWORDS = ['여유증', '남성가슴', '유두', '가슴살', '지방', '유선', '가슴'];
const PENILE_KEYWORDS = ['길이', '둘레', '확대', '필러', '귀두', '음경', '포경', '미용수술'];

function detectAgentFallback(message: string): 'm-gyneco' | 'm-penile' | 'm-general' {
    const lowerMessage = message.toLowerCase();

    if (GYNECO_KEYWORDS.some(kw => lowerMessage.includes(kw))) {
        return 'm-gyneco';
    }
    if (PENILE_KEYWORDS.some(kw => lowerMessage.includes(kw))) {
        return 'm-penile';
    }
    return 'm-general';
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            area,
            message,
            turnCount = 0,
            conversationHistory = []
        } = body;

        const hasApiKey = !!process.env.GOOGLE_AI_API_KEY;

        let response;

        if (area === 'healthcare') {
            if (hasApiKey) {
                // Use Gemini
                const result = await generateHealthcareResponse(
                    message,
                    conversationHistory,
                    turnCount
                );
                response = {
                    reply: result.reply,
                    agentUsed: 'h-closer',
                    requireLogin: result.requireLogin,
                    cta: result.cta,
                };
            } else {
                // Fallback
                const fallback = getFallbackHealthcareResponse(turnCount);
                response = {
                    reply: fallback.reply,
                    agentUsed: 'h-closer',
                    requireLogin: turnCount >= 3,
                    cta: fallback.cta,
                };
            }
        } else {
            // Medical area
            let agent: 'gyneco' | 'penile' | 'general';

            if (hasApiKey) {
                agent = await routeMedicalAgent(message);
                const result = await generateMedicalResponse(
                    message,
                    agent,
                    conversationHistory,
                    turnCount
                );
                response = {
                    reply: result.reply,
                    agentUsed: result.agentUsed,
                    requireLogin: false,
                    cta: result.cta,
                };
            } else {
                // Fallback
                const agentKey = detectAgentFallback(message);
                const fallback = getFallbackMedicalResponse(turnCount, agentKey);
                response = {
                    reply: fallback.reply,
                    agentUsed: fallback.agentUsed,
                    requireLogin: false,
                    cta: fallback.cta,
                };
            }
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            {
                reply: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.',
                agentUsed: 'error',
                error: 'Internal server error'
            },
            { status: 500 }
        );
    }
}
