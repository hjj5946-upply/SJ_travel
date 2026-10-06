import { Link } from "react-router-dom";
import type { Trip } from "../types/trip";
import { CountryFlag } from "./CountryFlag";
import { daysUntil, formatDateRange } from "../utils/date";
import { tripDurationDays } from "../utils/stats";

const THEME_BG: Record<Trip["themeColor"], string> = {
  blush: "bg-blush",
  peach: "bg-peach",
  mint: "bg-mint",
  sky: "bg-sky",
  lavender: "bg-lavender",
};

/** 아직 안 다녀온 여행을 대시보드에 보여주는 카드 */
export function UpcomingTrip({ trip }: { trip: Trip }) {
  const dDay = daysUntil(trip.startDate);

  return (
    <Link
      to={`/trips/${trip.id}`}
      className={`block rounded-3xl p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${THEME_BG[trip.themeColor]}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="rounded-full bg-white/80 px-3 py-0.5 font-display text-xl text-brown tabular-nums">
          D-{dDay}
        </span>
        <span className="text-sm text-ink/70 tabular-nums">
          {formatDateRange(trip.startDate, trip.endDate)} ·{" "}
          {tripDurationDays(trip)}일
        </span>
      </div>

      <p className="font-display mt-3 text-xl">
        {trip.coverEmoji ?? "✈️"} {trip.title}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/70">
        <CountryFlag country={trip.country} />
        {trip.city}, {trip.country}
      </p>
    </Link>
  );
}
