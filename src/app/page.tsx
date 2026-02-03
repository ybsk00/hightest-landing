'use client';

import { useState } from 'react';
import { useChatStore } from '@/store/chatStore';

type ConcernType = 'condition' | 'urination' | 'prostate' | 'health';

const CONCERNS = [
  { id: 'condition' as ConcernType, icon: 'favorite', title: '남성 컨디션', desc: '상담 전 질문을 정리합니다' },
  { id: 'urination' as ConcernType, icon: 'water_drop', title: '배뇨 불편', desc: '간단 체크로 방향을 잡습니다' },
  { id: 'prostate' as ConcernType, icon: 'monitor_heart', title: '전립선 관리', desc: '조기 검진 및 관리' },
  { id: 'health' as ConcernType, icon: 'vital_signs', title: '남성 건강 체크', desc: '건강 검진 및 예방' },
];

export default function Home() {
  const { openChat } = useChatStore();
  const [selectedConcern, setSelectedConcern] = useState<ConcernType | null>(null);

  const handleConcernClick = (concernId: ConcernType) => {
    setSelectedConcern(selectedConcern === concernId ? null : concernId);
  };

  const getSelectedTitle = () => {
    if (!selectedConcern) return '선택 없음';
    const concern = CONCERNS.find(c => c.id === selectedConcern);
    return concern ? concern.title : '선택 없음';
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f5]">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap bg-[#0B1221] px-6 md:px-10 py-4 shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-4 text-white">
          <div className="size-8 flex items-center justify-center text-[#f27f0d]">
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>health_and_safety</span>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">HIC Urology</h2>
        </div>
        <div className="flex flex-1 justify-end gap-4 items-center">
          <button
            onClick={() => window.location.href = '/login'}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-[#f27f0d] hover:bg-orange-600 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">로그인</span>
          </button>
        </div>
      </header>

      <div className="layout-container flex h-full grow flex-col">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-[#f8f7f5] border-b border-[#e6e0db]">
          {/* Background Video */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent"></div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#f27f0d]/5 via-transparent to-transparent pointer-events-none z-[1]"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#0B1221]/5 via-transparent to-transparent pointer-events-none z-[1]"></div>

          <div className="relative z-10 md:px-10 lg:px-40 flex justify-center py-20 md:py-28">
            <div className="flex flex-col max-w-[960px] flex-1 gap-10 px-4">
              <div className="flex flex-col gap-6 max-w-3xl">
                <h1 className="text-[#0B1221] text-4xl md:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight">
                  민감한 고민, <br className="hidden sm:block" />
                  <span className="text-[#f27f0d] relative inline-block">
                    온라인에서 먼저
                    <span className="absolute bottom-2 left-0 w-full h-3 bg-[#f27f0d]/10 -z-10 skew-x-12"></span>
                  </span>{' '}
                  정리하세요
                </h1>
                <p className="text-[#4a453e] text-lg md:text-xl font-normal leading-relaxed text-balance">
                  간단한 체크와 AI 시뮬레이션으로 변화를 미리 확인하고,<br className="hidden md:block" />
                  전문적인 상담으로 이어가세요.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() => window.location.href = '/login'}
                  className="flex items-center justify-center gap-2 rounded-full h-14 px-8 bg-[#f27f0d] hover:bg-orange-600 text-white text-lg font-bold transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transform hover:-translate-y-0.5"
                >
                  로그인하고 상담 받기
                </button>
                <button
                  onClick={() => openChat({ intent: 'demo_try' })}
                  className="flex items-center justify-center gap-2 rounded-full h-14 px-8 border-2 border-[#0B1221] text-[#0B1221] hover:bg-[#0B1221] hover:text-white text-lg font-bold transition-all bg-white/50 backdrop-blur-sm"
                >
                  데모 체험하기
                </button>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#E3F2FD] text-[#1565C0] text-sm font-semibold border border-blue-100">
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  ISMS 인증 기준 준수
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#E3F2FD] text-[#1565C0] text-sm font-semibold border border-blue-100">
                  <span className="material-symbols-outlined text-base">lock</span>
                  데이터 암호화 처리
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#E3F2FD] text-[#1565C0] text-sm font-semibold border border-blue-100">
                  <span className="material-symbols-outlined text-base">face_retouching_off</span>
                  얼굴 제외 비식별화
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Concern Selection Section */}
        <div className="md:px-10 lg:px-40 flex flex-1 justify-center py-10">
          <div className="flex flex-col max-w-[960px] flex-1 gap-8">
            <div className="flex flex-col gap-2 px-4">
              <h2 className="text-[#181411] text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">고민을 선택해 주세요</h2>
              <p className="text-[#8a7560] text-lg font-normal leading-normal">선택한 항목을 기준으로 안내가 정리됩니다</p>
            </div>

            {/* Concern Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4">
              {CONCERNS.map((concern) => {
                const isSelected = selectedConcern === concern.id;
                return (
                  <div
                    key={concern.id}
                    onClick={() => handleConcernClick(concern.id)}
                    className={`group cursor-pointer flex flex-col gap-4 p-5 rounded-xl transition-all relative overflow-hidden
                      ${isSelected
                        ? 'border-2 border-[#f27f0d] bg-white shadow-lg'
                        : 'border border-transparent bg-white/50 hover:bg-white hover:shadow-md'
                      }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 p-2 text-[#f27f0d]">
                        <span className="material-symbols-outlined">check_circle</span>
                      </div>
                    )}
                    <div className={`size-12 rounded-full flex items-center justify-center transition-colors
                      ${isSelected
                        ? 'bg-[#f27f0d]/10 text-[#f27f0d]'
                        : 'bg-gray-100 text-gray-400 group-hover:bg-[#f27f0d]/10 group-hover:text-[#f27f0d]'
                      }`}>
                      <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>{concern.icon}</span>
                    </div>
                    <div>
                      <p className={`text-base leading-normal ${isSelected ? 'text-[#181411] font-bold' : 'text-[#181411] font-medium'}`}>
                        {concern.title}
                      </p>
                      <p className={`text-sm font-normal leading-normal ${isSelected ? 'text-[#8a7560]' : 'text-gray-500'}`}>
                        {concern.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selection Summary */}
            <div className="px-4">
              <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 rounded-2xl bg-white p-6 shadow-sm border border-[#e6e0db]">
                <div className="flex flex-col justify-center gap-4 flex-[2]">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">선택 요약</span>
                    </div>
                    <h3 className="text-[#181411] text-xl font-bold leading-tight">선택: {getSelectedTitle()}</h3>
                    <p className="text-[#8a7560] text-base font-normal leading-relaxed">
                      선택한 항목을 기준으로 상담 질문을 정리했습니다. 다음 단계는 로그인 후 확인할 수 있습니다.
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedConcern(null)}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#f27f0d] text-sm font-medium transition-colors w-fit"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                    선택 초기화
                  </button>
                </div>
                <div
                  className="w-full md:w-1/3 min-h-[160px] bg-center bg-no-repeat bg-cover rounded-xl"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop')" }}
                ></div>
              </div>
            </div>

            {/* Locked Section */}
            <div className="px-4 py-6">
              <div className="relative rounded-3xl overflow-hidden border border-white/40 shadow-xl">
                <div className="absolute inset-0 bg-[#F3F4F6] p-8 opacity-40">
                  <div className="flex flex-col gap-8">
                    <div className="h-8 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-40 bg-gray-200 rounded-lg"></div>
                      <div className="h-40 bg-gray-200 rounded-lg"></div>
                      <div className="h-40 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="h-4 w-full bg-gray-300 rounded mt-4"></div>
                    <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
                  </div>
                </div>

                <div className="glass-panel relative z-10 p-8 md:p-12 flex flex-col items-center text-center gap-8">
                  <div className="flex flex-col items-center gap-4 max-w-2xl">
                    <div className="size-16 rounded-full bg-white shadow-md flex items-center justify-center text-[#f27f0d] mb-2">
                      <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>lock</span>
                    </div>
                    <h1 className="text-[#181411] text-3xl md:text-4xl font-black leading-tight tracking-tight">
                      로그인 후 열람할 수 있습니다
                    </h1>
                    <p className="text-[#4a453e] text-lg font-medium leading-relaxed">
                      개인정보 보호를 위해 로그인 후 진행됩니다
                    </p>
                  </div>

                  <button
                    onClick={() => window.location.href = '/login'}
                    className="flex min-w-[200px] cursor-pointer items-center justify-center gap-2 rounded-full h-14 px-8 bg-[#f27f0d] hover:bg-orange-600 transition-all transform hover:scale-105 shadow-lg shadow-orange-500/30 text-white text-base font-bold leading-normal tracking-[0.015em]"
                  >
                    <span>로그인 후 확인</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-6 opacity-70 pointer-events-none select-none">
                    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white/80 p-5 shadow-sm">
                      <div className="text-gray-400 flex justify-between items-center">
                        <span className="material-symbols-outlined">clinical_notes</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lock</span>
                      </div>
                      <div>
                        <h2 className="text-gray-800 text-base font-bold">진료 안내</h2>
                        <div className="h-2 w-full bg-gray-200 rounded mt-2"></div>
                        <div className="h-2 w-2/3 bg-gray-200 rounded mt-2"></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white/80 p-5 shadow-sm">
                      <div className="text-gray-400 flex justify-between items-center">
                        <span className="material-symbols-outlined">prescriptions</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lock</span>
                      </div>
                      <div>
                        <h2 className="text-gray-800 text-base font-bold">관리 계획</h2>
                        <div className="h-2 w-full bg-gray-200 rounded mt-2"></div>
                        <div className="h-2 w-2/3 bg-gray-200 rounded mt-2"></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white/80 p-5 shadow-sm">
                      <div className="text-gray-400 flex justify-between items-center">
                        <span className="material-symbols-outlined">monitoring</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lock</span>
                      </div>
                      <div>
                        <h2 className="text-gray-800 text-base font-bold">사후 안내</h2>
                        <div className="h-2 w-full bg-gray-200 rounded mt-2"></div>
                        <div className="h-2 w-2/3 bg-gray-200 rounded mt-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="px-4">
              <div className="bg-[#E3F2FD] rounded-lg p-4 flex flex-col md:flex-row items-center justify-center gap-3 text-center md:text-left border border-blue-100">
                <div className="text-[#1565C0] shrink-0">
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>verified_user</span>
                </div>
                <p className="text-[#1565C0] text-sm font-medium">
                  입력 정보는 암호화되어 처리됩니다. | [암호화 처리] [24시간 자동 삭제]
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
