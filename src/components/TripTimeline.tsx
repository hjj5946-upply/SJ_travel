import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Trip } from "../types/trip";
import { CountryFlag } from "./CountryFlag";
import { daysUntil, shortMonthDay, tripStatus } from "../utils/date";
import { groupByYear, tripDurationDays } from "../utils/stats";

/** 타임라인 점 색은 여행의 테마색을 그대로 씀 */
const DOT: Record<Trip["themeColor"], string> = {
  blush: "bg-blush",
  peach: "bg-peach",
  mint: "bg-mint",
  sky: "bg-sky",
  lavender: "bg-lavender",
};

export function TripTimeline({ trips }: { trips: Trip[] }) {
  const years = groupByYear(trips);

  if (years.length === 0) {
    return (
      <p className="rounded-2xl border border-ink/10 bg-white p-6 text-center text-ink/70 shadow-sm">
        아직 기록된 여행이 없어요.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {years.map((group, idx) => (
        // 연도별로 접고 펼치기 — 가장 최근 연도(맨 위)만 펼친 채로 시작
        <details key={group.year} open={idx === 0} className="group">
          <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
            <ChevronRight
              className="size-5 shrink-0 text-brown/70 transition-transform group-open:rotate-90"
              strokeWidth={2}
            />
            <h3 className="font-display text-2xl text-brown">{group.year}</h3>
            <span className="whitespace-nowrap text-sm text-ink/70">
              여행 {group.trips.length}회
            </span>
            <span className="h-px flex-1 bg-ink/10" />
          </summary>

          <ol className="relative mt-3 border-l-2 border-ink/10 pl-6">
            {group.trips.map((trip) => {
              const status = tripStatus(trip);
              return (
                <li key={trip.id} className="relative pb-3 last:pb-0">
                  {/* 세로선 위에 올라탄 점 (ring-4로 선을 덮어 끊어 보이게) */}
                  <span
                    className={`absolute -left-[33px] top-4 size-4 rounded-full ring-4 ring-white ${DOT[trip.themeColor]}`}
                  />
                  <Link
                    to={`/trips/${trip.id}`}
                    className="block rounded-2xl border border-ink/10 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="text-sm tabular-nums text-brown/80">
                        {shortMonthDay(trip.startDate)} ~{" "}
                        {shortMonthDay(trip.endDate)}
                      </span>
                      {status === "upcoming" && (
                        <span className="rounded-full bg-cream px-2 text-xs font-semibold text-brown tabular-nums">
                          D-{daysUntil(trip.startDate)}
                        </span>
                      )}
                      {status === "ongoing" && (
                        <span className="rounded-full bg-mint px-2 text-xs font-semibold">
                          여행 중
                        </span>
                      )}
                      <span className="ml-auto text-xs text-ink/70 tabular-nums">
                        {tripDurationDays(trip)}일
                      </span>
                    </div>
                    <p className="font-display text-xl">
                      {trip.coverEmoji ?? "✈️"} {trip.title}
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-ink/70">
                      <CountryFlag country={trip.country} />
                      {trip.city}, {trip.country}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ol>
        </details>
      ))}
    </div>
  );
}
