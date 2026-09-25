import type { Trip } from "../types/trip";
import { flagOf, splitCountries } from "./countries";
import { tripStatus } from "./date";

export function tripDurationDays(trip: Trip): number {
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const diff = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  return diff + 1; // 시작일 포함
}

export interface DashboardStats {
  totalTrips: number;
  totalDays: number;
  totalCountries: number;
}

/** 통계는 "다녀온" 여행만 세는 게 맞아서, 예정 여행은 넣지 말고 호출하세요.
 *  (Dashboard에서 partitionTrips().past 를 넘겨줍니다) */
export function computeDashboardStats(trips: Trip[]): DashboardStats {
  return {
    totalTrips: trips.length,
    totalDays: trips.reduce((sum, t) => sum + tripDurationDays(t), 0),
    // "일본 · 미국" 처럼 두 나라를 간 여행은 각각 한 나라로 셈
    totalCountries: new Set(trips.flatMap((t) => splitCountries(t.country)))
      .size,
  };
}

export interface TripPartition {
  /** 아직 출발 안 한 여행 (가까운 순) */
  upcoming: Trip[];
  /** 지금 여행 중 */
  ongoing: Trip[];
  /** 다녀온 여행 (최신순) */
  past: Trip[];
}

export function partitionTrips(trips: Trip[]): TripPartition {
  const upcoming: Trip[] = [];
  const ongoing: Trip[] = [];
  const past: Trip[] = [];
  trips.forEach((trip) => {
    const status = tripStatus(trip);
    if (status === "upcoming") upcoming.push(trip);
    else if (status === "ongoing") ongoing.push(trip);
    else past.push(trip);
  });
  return {
    upcoming: upcoming.sort((a, b) => a.startDate.localeCompare(b.startDate)),
    ongoing: ongoing.sort((a, b) => a.startDate.localeCompare(b.startDate)),
    past: past.sort((a, b) => b.startDate.localeCompare(a.startDate)),
  };
}

export interface YearGroup {
  year: string;
  trips: Trip[];
}

/** 타임라인용: 연도별로 묶고 최신 연도 → 최신 여행 순으로 */
export function groupByYear(trips: Trip[]): YearGroup[] {
  const byYear = new Map<string, Trip[]>();
  trips.forEach((trip) => {
    const year = trip.startDate.slice(0, 4);
    const list = byYear.get(year) ?? [];
    list.push(trip);
    byYear.set(year, list);
  });

  return [...byYear.entries()]
    .map(([year, yearTrips]) => ({
      year,
      trips: [...yearTrips].sort((a, b) =>
        b.startDate.localeCompare(a.startDate),
      ),
    }))
    .sort((a, b) => b.year.localeCompare(a.year));
}

export interface CountryVisit {
  country: string;
  flag: string;
  /** 같은 국가를 여러 번 갔을 수 있으므로 여행 목록을 그대로 들고 있음 (최신순) */
  trips: Trip[];
  /** 방문한 도시 (같은 도시를 여러 번 가도 한 번만) */
  cities: string[];
  visitCount: number;
  totalDays: number;
}

/** 여행을 국가별로 묶음. 같은 국가/도시 재방문도 횟수로 합산됩니다.
 *  정렬: 많이 간 국가 → 오래 머문 국가 → 이름순 */
export function groupByCountry(trips: Trip[]): CountryVisit[] {
  const byCountry = new Map<string, { trips: Trip[]; cities: string[] }>();

  trips.forEach((trip) => {
    // "일본 · 미국" / "도쿄 · 호놀룰루" 처럼 나라와 도시가 같은 순서로 적혀 있으면
    // 짝을 맞춰 나라별 도시를 나눠 담고, 개수가 안 맞으면 도시를 전부 넣습니다.
    const countries = splitCountries(trip.country);
    // "도쿄 · 호놀룰루 · 도쿄"(일본 → 하와이 → 일본 경유) 처럼 같은 도시가 다시 나오면
    // 중복을 지워서 나라 개수와 짝이 맞게 만듭니다.
    const cities = [...new Set(splitCountries(trip.city))];
    countries.forEach((country, idx) => {
      const bucket = byCountry.get(country) ?? { trips: [], cities: [] };
      bucket.trips.push(trip);
      bucket.cities.push(
        ...(countries.length === cities.length ? [cities[idx]] : cities),
      );
      byCountry.set(country, bucket);
    });
  });

  return [...byCountry.entries()]
    .map(([country, bucket]) => {
      const sorted = [...bucket.trips].sort((a, b) =>
        b.startDate.localeCompare(a.startDate),
      );
      return {
        country,
        flag: flagOf(country),
        trips: sorted,
        cities: [...new Set(bucket.cities)],
        visitCount: sorted.length,
        totalDays: sorted.reduce((sum, t) => sum + tripDurationDays(t), 0),
      };
    })
    .sort(
      (a, b) =>
        b.visitCount - a.visitCount ||
        b.totalDays - a.totalDays ||
        a.country.localeCompare(b.country),
    );
}
