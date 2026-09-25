import { Link } from "react-router-dom";
import type { Trip } from "../types/trip";
import { tripDurationDays } from "../utils/stats";

const THEME_BG: Record<Trip["themeColor"], string> = {
  blush: "bg-blush",
  peach: "bg-peach",
  mint: "bg-mint",
  sky: "bg-sky",
  lavender: "bg-lavender",
};

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link
      to={`/trips/${trip.id}`}
      className={`block rounded-3xl p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${THEME_BG[trip.themeColor]}`}
    >
      <div className="text-4xl">{trip.coverEmoji ?? "✈️"}</div>
      <h3 className="font-display mt-2 text-xl">{trip.title}</h3>
      <p className="text-sm text-ink/70">
        {trip.city}, {trip.country}
      </p>
      <p className="mt-2 text-xs text-ink/60">
        {trip.startDate} ~ {trip.endDate} · {tripDurationDays(trip)}일
      </p>
    </Link>
  );
}
