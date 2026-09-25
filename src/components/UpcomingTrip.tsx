import { Link } from "react-router-dom";
import type { Trip } from "../types/trip";
import { flagOf } from "../utils/countries";
import { daysUntil, shortMonthDay } from "../utils/date";
import { tripDurationDays } from "../utils/stats";

const THEME_BG: Record<Trip["themeColor"], string> = {
  blush: "bg-blush",
  peach: "bg-peach",
  mint: "bg-mint",
  sky: "bg-sky",
  lavender: "bg-lavender",
};

/** 아직 안 다녀온 여행을 대시보드 맨 위에 크게 보여주는 카드 */
export function UpcomingTrip({ trip }: { trip: Trip }) {
  const dDay = daysUntil(trip.startDate);
  const packed = trip.checklist.filter((c) => c.checked).length;
  const totalChecks = trip.checklist.length;

  return (
    <Link
      to={`/trips/${trip.id}`}
      className={`block rounded-3xl p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${THEME_BG[trip.themeColor]}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="rounded-full bg-white/80 px-3 py-0.5 font-display text-xl text-brown tabular-nums">
          D-{dDay}
        </span>
        <span className="text-sm text-ink/60 tabular-nums">
          {trip.startDate} ~ {shortMonthDay(trip.endDate)} ·{" "}
          {tripDurationDays(trip)}일
        </span>
      </div>

      <p className="font-display mt-2 text-3xl">
        {trip.coverEmoji ?? "✈️"} {trip.title}
      </p>
      <p className="text-ink/70">
        {flagOf(trip.country)} {trip.city}, {trip.country}
      </p>

      {totalChecks > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-ink/60">준비물</span>
          <span
            className="h-2 flex-1 overflow-hidden rounded-full bg-white/60"
            role="presentation"
          >
            <span
              className="block h-full rounded-full bg-brown/60"
              style={{ width: `${Math.round((packed / totalChecks) * 100)}%` }}
            />
          </span>
          <span className="text-sm text-ink/60 tabular-nums">
            {packed}/{totalChecks}
          </span>
        </div>
      )}
    </Link>
  );
}
