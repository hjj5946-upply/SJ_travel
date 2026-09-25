import { Link } from "react-router-dom";
import { trips } from "../data/trips";
import { flagOf } from "../utils/countries";
import { groupByCountry, partitionTrips, tripDurationDays } from "../utils/stats";

export function Countries() {
  const { upcoming, ongoing, past } = partitionTrips(trips);
  const visited = [...ongoing, ...past];
  // 아직 안 간 나라는 "가본 나라"에 못 들어가니 예정 여행은 따로 아래에 보여줍니다.
  const countries = groupByCountry(visited);

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20">
      <Link to="/" className="text-sm text-brown/80">
        ← 대시보드
      </Link>
      <h1 className="font-display mt-2 text-3xl">🌏 가본 나라</h1>
      <p className="text-ink/70">
        {countries.length}개 국가 · {visited.length}번의 여행
      </p>

      <ul className="mt-8 space-y-3">
        {countries.map((c) => (
          <li
            key={c.country}
            className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl leading-none">{c.flag}</span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl">{c.country}</p>
                <p className="text-sm text-ink/60">{c.cities.join(" · ")}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display text-xl text-brown tabular-nums">
                  {c.visitCount}번
                </p>
                <p className="text-xs text-ink/50 tabular-nums">
                  총 {c.totalDays}일
                </p>
              </div>
            </div>

            {/* 같은 국가를 여러 번 갔을 수 있으니 그 국가의 여행을 최신순으로 */}
            <ul className="mt-3 space-y-1 border-t border-ink/10 pt-3">
              {c.trips.map((trip) => (
                <li key={trip.id}>
                  <Link
                    to={`/trips/${trip.id}`}
                    className="flex flex-wrap items-baseline justify-between gap-x-3 rounded-xl px-2 py-1 text-sm transition hover:bg-cream"
                  >
                    <span>
                      {trip.coverEmoji ?? "✈️"} {trip.title}
                      <span className="ml-2 text-ink/50">{trip.city}</span>
                    </span>
                    <span className="text-xs text-ink/50 tabular-nums">
                      {trip.startDate} ~ {trip.endDate} ·{" "}
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
          <h2 className="font-display mb-3 text-xl">✈️ 갈 예정</h2>
          <ul className="space-y-2">
            {upcoming.map((trip) => (
              <li key={trip.id}>
                <Link
                  to={`/trips/${trip.id}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-3 rounded-2xl border border-dashed border-ink/20 bg-white p-3 text-sm transition hover:bg-cream"
                >
                  <span>
                    <span className="mr-1 text-xl">{flagOf(trip.country)}</span>
                    {trip.country}
                    <span className="ml-2 text-ink/50">{trip.city}</span>
                  </span>
                  <span className="text-xs text-ink/50 tabular-nums">
                    {trip.startDate} ~ {trip.endDate}
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
