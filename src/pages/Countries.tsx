import { Earth, PlaneTakeoff } from "lucide-react";
import { Link } from "react-router-dom";
import { trips } from "../data/trips";
import { CountryFlag } from "../components/CountryFlag";
import { formatDateRange } from "../utils/date";
import { groupByCountry, partitionTrips, tripDurationDays } from "../utils/stats";

export function Countries() {
  const { upcoming, ongoing, past } = partitionTrips(trips);
  const visited = [...ongoing, ...past];
  // 아직 안 간 나라는 "가본 나라"에 못 들어가니 예정 여행은 따로 아래에 보여줍니다.
  const countries = groupByCountry(visited);

  return (
    <div className="page-container pt-2 pb-20">
      <h1 className="font-display flex items-center gap-2 text-2xl sm:text-3xl">
        <Earth className="size-6 text-brown sm:size-7" strokeWidth={2} />
        가본 나라
      </h1>
      <p className="mt-2 text-ink/70">
        {countries.length}개국 · 여행 {visited.length}회
      </p>

      <ul className="mt-8 space-y-3">
        {countries.map((c) => (
          <li
            key={c.country}
            className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <CountryFlag country={c.country} className="h-7" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl">{c.country}</p>
                <p className="text-sm text-ink/70">{c.cities.join(" · ")}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display text-xl text-brown tabular-nums">
                  {c.visitCount}회
                </p>
                <p className="text-xs text-ink/70 tabular-nums">
                  총 {c.totalDays}일
                </p>
              </div>
            </div>

            {/* 같은 국가를 여러 번 갔을 수 있으니 그 국가의 여행을 최신순으로 */}
            <ul className="mt-4 divide-y divide-ink/5 border-t border-ink/10 pt-2">
              {c.trips.map((trip) => (
                <li key={trip.id}>
                  {/* 제목 아래에 여행지 · 날짜, 일수는 우측 끝 */}
                  <Link
                    to={`/trips/${trip.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition hover:bg-cream"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">
                        {trip.coverEmoji ?? "✈️"} {trip.title}
                      </p>
                      <p className="mt-0.5 text-xs text-ink/70 tabular-nums">
                        {trip.city} · {formatDateRange(trip.startDate, trip.endDate)}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm text-brown tabular-nums">
                      {tripDurationDays(trip)}일
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {upcoming.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display mb-3 flex items-center gap-2 text-xl">
            <PlaneTakeoff className="size-5 text-brown" strokeWidth={2} />
            갈 예정
          </h2>
          <ul className="space-y-2">
            {upcoming.map((trip) => (
              <li key={trip.id}>
                <Link
                  to={`/trips/${trip.id}`}
                  className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-2xl border border-dashed border-ink/20 bg-white p-3 text-sm transition hover:bg-cream"
                >
                  <span className="flex items-center gap-1.5">
                    <CountryFlag country={trip.country} />
                    {trip.country}
                    <span className="ml-1 text-ink/70">{trip.city}</span>
                  </span>
                  <span className="text-xs text-ink/70 tabular-nums">
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
