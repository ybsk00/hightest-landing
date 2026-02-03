'use client';

interface FooterProps {
    brandName?: string;
}

export default function Footer({ brandName = '하이스트 헬스케어' }: FooterProps) {
    return (
        <footer className="w-full bg-[#181411] text-white py-12 px-6 md:px-10 mt-auto border-t border-white/10">
            <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold tracking-tight">{brandName}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-gray-400">
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold text-gray-300">위치</p>
                            <p>서울특별시 강남구 선릉로 655, 14,15층(논현동 242-51)</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold text-gray-300">대표자</p>
                            <p>구진모, 황인성</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold text-gray-300">전화번호</p>
                            <p>+82 02-514-1415</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold text-gray-300">사업자등록번호</p>
                            <p>864-14-02753</p>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© 2024 {brandName}. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">이용약관</a>
                        <a href="#" className="hover:text-white transition-colors font-bold text-gray-400">개인정보처리방침</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
