import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
      <Link to="/" className="font-display text-2xl text-brown">
        🧳 쏭쭌여행 다이어리
      </Link>
      {/* TODO: 국가별 / 항목별 / 날짜별 필터 메뉴는 UI 확정 단계에서 추가 */}
    </header>
  );
}
