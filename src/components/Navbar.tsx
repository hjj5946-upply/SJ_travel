import { ChevronLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  // 앱 안에서 들어온 경우엔 직전 화면으로, 주소로 바로 들어온 경우(이전 기록 없음)엔 메인으로
  const goBack = () => {
    if (location.key === "default") navigate("/");
    else navigate(-1);
  };

  return (
    <header className="sticky top-0 z-50 mb-6 border-b border-brown/15 bg-paper/90 backdrop-blur">
      {/* 좌측 뒤로가기 / 가운데 제목 / 우측 빈 칸 — 양옆 칸 너비를 같게 해 제목이 항상 정중앙 */}
      <div className="page-container grid h-16 grid-cols-[1fr_auto_1fr] items-center">
        <div>
          {!isHome && (
            <button
              type="button"
              onClick={goBack}
              aria-label="뒤로가기"
              className="-ml-3 flex size-11 items-center justify-center rounded-full text-brown transition hover:bg-cream"
            >
              <ChevronLeft className="size-6" strokeWidth={2} />
            </button>
          )}
        </div>
        <Link to="/" className="font-display text-2xl text-brown">
          Travel Diary
        </Link>
        {/* TODO: 국가별 / 항목별 / 날짜별 필터 메뉴는 UI 확정 단계에서 추가 (우측 칸) */}
        <div />
      </div>
    </header>
  );
}
