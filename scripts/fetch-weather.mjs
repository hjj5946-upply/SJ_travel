// 여행 Day별 날씨를 Open-Meteo(무료, 키 불필요)에서 받아 src/data/weather.json 으로 저장합니다.
//  - 다녀온 날짜: 실제 관측값 (archive API)
//  - 아직 안 온 날짜: 최근 10년 같은 날짜의 평균 = "평년" 값 (normal: true)
// 사용법: npm run weather   (여행을 추가/수정했을 때 한 번 다시 돌리면 됨)
import { readFileSync, writeFileSync } from "node:fs";

const TRIPS_PATH = new URL("../src/data/trips.data.json", import.meta.url);
const OUT_PATH = new URL("../src/data/weather.json", import.meta.url);

/** 도시 좌표. 새 도시를 여행하면 여기에 한 줄 추가 */
const CITY_COORDS = {
  도쿄: [35.68, 139.69],
  나고야: [35.18, 136.91],
  오사카: [34.69, 135.5],
  후쿠오카: [33.59, 130.4],
  타이베이: [25.03, 121.57],
  세부: [10.32, 123.89],
  호놀룰루: [21.31, -157.86],
  가와구치코: [35.5, 138.76], // 후지산 아래 해발 약 830m라 도쿄보다 훨씬 추움
};

/** 여러 도시를 도는 여행은 Day별 도시를 지정 (지정 없는 Day는 첫 도시) */
const DAY_CITY_OVERRIDES = {
  "honeymoon-2027-01": { 2: "가와구치코", 5: "호놀룰루", 6: "호놀룰루", 7: "호놀룰루", 8: "호놀룰루", 9: "호놀룰루", 10: "호놀룰루" },
};

const NORMAL_YEARS = 10;
// archive API는 최근 며칠치가 늦게 들어오므로 일주일 전까지만 실측으로 취급
const archiveCutoff = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10);

const cache = new Map();
async function fetchDaily(city, start, end) {
  const key = `${city}|${start}|${end}`;
  if (cache.has(key)) return cache.get(key);
  const [lat, lon] = CITY_COORDS[city];
  const url =
    `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}` +
    `&start_date=${start}&end_date=${end}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${city} ${start}~${end}: HTTP ${res.status}`);
  const { daily } = await res.json();
  const byDate = new Map(
    daily.time.map((t, i) => [
      t,
      { code: daily.weather_code[i], max: daily.temperature_2m_max[i], min: daily.temperature_2m_min[i] },
    ]),
  );
  cache.set(key, byDate);
  return byDate;
}

/** 최근 N년 같은 월-일의 평균 기온 + 가장 많았던 날씨 */
async function normalFor(city, iso) {
  const lastYear = Number(archiveCutoff.slice(0, 4)) - 1;
  const all = await fetchDaily(city, `${lastYear - NORMAL_YEARS + 1}-01-01`, `${lastYear}-12-31`);
  const md = iso.slice(5);
  const samples = [...all.entries()].filter(([t, v]) => t.slice(5) === md && v.max != null).map(([, v]) => v);
  const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const counts = {};
  samples.forEach((s) => (counts[s.code] = (counts[s.code] ?? 0) + 1));
  const code = Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
  return { code, max: avg(samples.map((s) => s.max)), min: avg(samples.map((s) => s.min)), normal: true };
}

const trips = JSON.parse(readFileSync(TRIPS_PATH, "utf8"));
const out = {};
const missing = new Set();

for (const trip of trips) {
  const firstCity = trip.city.split(/[·,&/]/)[0].trim();
  for (const day of trip.days) {
    const city = DAY_CITY_OVERRIDES[trip.id]?.[day.day] ?? firstCity;
    if (!CITY_COORDS[city]) {
      missing.add(city);
      continue;
    }
    let w;
    if (day.date <= archiveCutoff) {
      w = (await fetchDaily(city, trip.startDate, trip.endDate)).get(day.date);
    } else {
      w = await normalFor(city, day.date);
    }
    if (!w || w.max == null) continue;
    (out[trip.id] ??= {})[day.day] = {
      min: Math.round(w.min),
      max: Math.round(w.max),
      code: w.code,
      ...(w.normal ? { normal: true } : {}),
    };
  }
}

writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n");
const dayCount = Object.values(out).reduce((n, t) => n + Object.keys(t).length, 0);
console.log(`✓ ${Object.keys(out).length}개 여행, ${dayCount}일치 날씨 저장 → src/data/weather.json`);
if (missing.size) console.log(`⚠ 좌표가 없어 건너뛴 도시: ${[...missing].join(", ")} (CITY_COORDS 에 추가하세요)`);
