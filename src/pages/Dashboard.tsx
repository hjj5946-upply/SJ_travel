import { BookHeart, CalendarDays, Earth, Plane, PlaneTakeoff } from "lucide-react";
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
    // 영역마다 구분선(divide-y)을 두고 위아래 여백으로 간격을 맞춤
    <div className="page-container divide-y divide-ink/10 pb-20 [&>section]:py-8 [&>section:first-child]:pt-2">
      <section>
        <h2 className="font-display mb-4 flex items-center gap-2 text-xl">
          <BookHeart className="size-5 text-brown" strokeWidth={2} />
          여행 기록
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <StatCard icon={Plane} iconBg="bg-sky" label="다녀온 여행" value={stats.totalTrips} unit="회" />
          <StatCard icon={CalendarDays} iconBg="bg-peach" label="여행 일수" value={stats.totalDays} unit="일" />
          <StatCard
            icon={Earth}
            iconBg="bg-mint"
            label="가본 나라"
            value={stats.totalCountries}
            unit="개국"
            to="/countries"
          />
        </div>
      </section>

      {upcoming.length > 0 && (
        <section>
          <h2 className="font-display mb-4 flex items-center gap-2 text-xl">
            <PlaneTakeoff className="size-5 text-brown" strokeWidth={2} />
            다가오는 여행
          </h2>
          <div className="space-y-3">
            {upcoming.map((trip) => (
              <UpcomingTrip key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display mb-4 flex items-center gap-2 text-xl">
          <CalendarDays className="size-5 text-brown" strokeWidth={2} />
          여행 타임라인
        </h2>
        <TripTimeline trips={done} />
      </section>
    </div>
  );
}
