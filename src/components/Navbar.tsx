import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 mb-6 border-b border-brown/15 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link to="/" className="font-display text-2xl text-brown">
          Travel Diary
        </Link>
        {/* TODO: 국가별 / 항목별 / 날짜별 필터 메뉴는 UI 확정 단계에서 추가 */}
      </div>
    </header>
  );
}
