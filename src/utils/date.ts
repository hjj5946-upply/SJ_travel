import type { Trip } from "../types/trip";

/** 오늘 날짜를 로컬 기준 ISO(YYYY-MM-DD)로 */
export function todayISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** "2026-01-16" → "01.16" (타임라인 좌측 표기용) */
export function shortMonthDay(iso: string): string {
  const [, month, day] = iso.split("-");
  return `${month}.${day}`;
}

/** 타임존 영향을 안 받게 날짜 문자열끼리만 계산 */
function toDayNumber(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / 86_400_000;
}

/** 오늘로부터 며칠 뒤인지 (지난 날짜는 음수) */
export function daysUntil(iso: string, today = todayISO()): number {
  return toDayNumber(iso) - toDayNumber(today);
}

export type TripStatus = "upcoming" | "ongoing" | "past";

export function tripStatus(trip: Trip, today = todayISO()): TripStatus {
  if (trip.startDate > today) return "upcoming";
  if (trip.endDate < today) return "past";
  return "ongoing";
}
