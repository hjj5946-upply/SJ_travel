/** "09:00 ~ 10:00" 형태의 문자열을 시작/종료로 분리 (한쪽만 있어도 동작) */
export function splitTimeRange(time?: string): {
  start?: string;
  end?: string;
} {
  if (!time) return {};
  const [start, end] = time.split("~").map((part) => part.trim());
  return { start: start || undefined, end: end || undefined };
}
