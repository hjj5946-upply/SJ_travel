import { trips } from "../data/trips";
import { computeDashboardStats, partitionTrips } from "../utils/stats";
import { StatCard } from "../components/StatCard";
import { TripTimeline } from "../components/TripTimeline";
import { UpcomingTrip } from "../components/UpcomingTrip";

export function Dashboard() {
  const { upcoming, ongoing, past } = partitionTrips(trips);
  // 통계는 다녀온 여행만 집계 (여행 중인 건은 이미 출발했으니 포함)
  const stats = computeDashboardStats([...ongoing, ...past]);
  const done = [...ongoing, ...past];

  return (
    <div className="mx-auto max-w-5xl px-6 pb-20">
      {upcoming.length > 0 && (
        <section className="mb-10 max-w-3xl">
          <h2 className="font-display mb-3 text-xl">✨ 다가오는 여행</h2>
          <div className="space-y-3">
            {upcoming.map((trip) => (
              <UpcomingTrip key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-10 grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard emoji="✈️" label="다녀온 여행" value={stats.totalTrips} />
        <StatCard emoji="📅" label="여행 일수" value={stats.totalDays} />
        <StatCard
          emoji="🌏"
          label="가본 나라"
          value={stats.totalCountries}
          to="/countries"
        />
      </section>

      <section className="max-w-3xl">
        <h2 className="font-display mb-4 text-xl">🗓️ 여행 타임라인</h2>
        <TripTimeline trips={done} />
      </section>
    </div>
  );
}
