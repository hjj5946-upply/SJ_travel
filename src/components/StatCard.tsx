import { Link } from "react-router-dom";

interface StatCardProps {
  emoji: string;
  label: string;
  value: string | number;
  /** 값이 주어지면 카드 전체가 링크가 됨 (예: 방문 국가 → 국가 목록) */
  to?: string;
}

export function StatCard({ emoji, label, value, to }: StatCardProps) {
  // 글자를 키운 뒤 라벨이 두 줄로 밀리던 문제 때문에
  // 좁은 화면에서는 패딩을 줄이고 라벨은 줄바꿈을 막았습니다.
  const card = (
    <div
      className={`flex h-full flex-col items-center gap-1 rounded-3xl border border-ink/10 bg-white px-3 py-4 shadow-sm sm:px-6 sm:py-5 ${
        to ? "transition hover:-translate-y-0.5 hover:shadow-md" : ""
      }`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="font-display text-2xl text-brown">{value}</span>
      <span className="whitespace-nowrap text-sm text-ink/70">{label}</span>
      {to && <span className="text-xs text-brown/60">자세히 →</span>}
    </div>
  );

  return to ? (
    <Link to={to} className="block">
      {card}
    </Link>
  ) : (
    card
  );
}
