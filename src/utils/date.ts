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

// ---- 화면 표기용 날짜 포맷 (전체 화면 공통: "2027.01.16") ----

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

/** "2027-01-16" → "토" (타임존 영향 없이 날짜 문자열로만 계산) */
export function weekdayKo(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return WEEKDAY_KO[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

/** "2027-01-16" → "2027.01.16" */
export function formatDate(iso: string): string {
  return iso.replaceAll("-", ".");
}

/** "2027-01-16" → "01.16 (토)" — Day 카드처럼 연도가 이미 보이는 곳용 */
export function formatMonthDayWithWeekday(iso: string): string {
  return `${shortMonthDay(iso)} (${weekdayKo(iso)})`;
}

/** 같은 해면 끝 날짜의 연도를 생략: "2027.01.16 ~ 01.29"
 *  해를 넘기면 둘 다 표기: "2026.12.30 ~ 2027.01.02" */
export function formatDateRange(start: string, end: string): string {
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  return `${formatDate(start)} ~ ${sameYear ? shortMonthDay(end) : formatDate(end)}`;
}
