// src/data/trips.data.json 구조 검사. JSON은 타입 검사가 안 되므로 이걸로 대신 확인합니다.
// 실행: npm run check:data
import { readFileSync } from "node:fs";

const CURRENCIES = ["KRW", "JPY", "USD", "EUR", "TWD", "VND", "THB", "PHP"];
const THEMES = ["blush", "peach", "mint", "sky", "lavender"];
const CHECKLIST_CATEGORIES = ["서류", "짐", "기타"];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
// "09:00", "09:00 ~ 10:30", "22:30 ~"(끝 미정), "~ 08:30"(시작 미정) 모두 정상으로 봅니다.
// 자정을 넘긴 일정을 "24:10" 처럼 적는 습관이 있어 시는 29까지 허용.
const TIME = /^(?:[0-2]?\d:[0-5]\d\s*(?:~\s*(?:[0-2]?\d:[0-5]\d)?)?|~\s*[0-2]?\d:[0-5]\d)$/;

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const raw = readFileSync(new URL("../src/data/trips.data.json", import.meta.url), "utf8");
let trips;
try {
  trips = JSON.parse(raw);
} catch (e) {
  console.error(`✗ trips.data.json 이 올바른 JSON이 아닙니다:\n  ${e.message}`);
  process.exit(1);
}
if (!Array.isArray(trips)) {
  console.error("✗ trips.data.json 의 최상위는 [ ] 배열이어야 합니다.");
  process.exit(1);
}

const seenTripIds = new Set();
let dayCount = 0;
let itemCount = 0;
let costCount = 0;

const checkCost = (cost, where) => {
  if (cost === undefined) return;
  costCount++;
  if (typeof cost.amount !== "number" || Number.isNaN(cost.amount))
    err(where, `cost.amount 가 숫자가 아닙니다 (${JSON.stringify(cost.amount)})`);
  if (!CURRENCIES.includes(cost.currency))
    err(where, `모르는 통화 "${cost.currency}" — src/types/trip.ts 와 src/utils/currency.ts 에 추가하세요`);
};

trips.forEach((trip, ti) => {
  const where = `trips[${ti}] (${trip.id ?? "id 없음"})`;

  for (const key of ["id", "title", "country", "city", "startDate", "endDate", "themeColor"]) {
    if (typeof trip[key] !== "string" || !trip[key]) err(where, `${key} 가 비어 있습니다`);
  }
  if (seenTripIds.has(trip.id)) err(where, `id "${trip.id}" 가 중복입니다 (URL이 겹칩니다)`);
  seenTripIds.add(trip.id);

  if (!THEMES.includes(trip.themeColor))
    err(where, `themeColor "${trip.themeColor}" — ${THEMES.join(" / ")} 중 하나여야 합니다`);
  if (typeof trip.people !== "number" || trip.people < 1)
    err(where, `people 이 1 이상의 숫자가 아닙니다 (${JSON.stringify(trip.people)})`);

  for (const key of ["startDate", "endDate"]) {
    if (!DATE.test(trip[key] ?? "")) err(where, `${key} 는 YYYY-MM-DD 형식이어야 합니다 (${trip[key]})`);
  }
  if (DATE.test(trip.startDate ?? "") && DATE.test(trip.endDate ?? "") && trip.endDate < trip.startDate)
    err(where, `endDate(${trip.endDate})가 startDate(${trip.startDate})보다 빠릅니다`);

  for (const key of ["days", "fixedExpenses", "checklist", "places"]) {
    if (!Array.isArray(trip[key])) err(where, `${key} 가 배열이 아닙니다`);
  }

  const seenDayNumbers = new Set();
  (trip.days ?? []).forEach((day, di) => {
    dayCount++;
    const dw = `${where} › days[${di}] (Day ${day.day})`;
    if (typeof day.day !== "number") err(dw, "day 가 숫자가 아닙니다");
    if (seenDayNumbers.has(day.day)) err(dw, `Day ${day.day} 가 중복입니다`);
    seenDayNumbers.add(day.day);
    if (!DATE.test(day.date ?? "")) err(dw, `date 는 YYYY-MM-DD 형식이어야 합니다 (${day.date})`);
    else if (DATE.test(trip.startDate ?? "") && (day.date < trip.startDate || day.date > trip.endDate))
      warn(dw, `date ${day.date} 가 여행 기간(${trip.startDate} ~ ${trip.endDate}) 밖입니다`);
    if (!Array.isArray(day.items)) return err(dw, "items 가 배열이 아닙니다");

    const seenItemIds = new Set();
    day.items.forEach((item, ii) => {
      itemCount++;
      const iw = `${dw} › items[${ii}] (${item.title ?? "제목 없음"})`;
      if (typeof item.id !== "string" || !item.id) err(iw, "id 가 비어 있습니다");
      else if (seenItemIds.has(item.id)) err(iw, `같은 Day 안에서 id "${item.id}" 가 중복입니다`);
      seenItemIds.add(item.id);
      if (typeof item.title !== "string" || !item.title) err(iw, "title 이 비어 있습니다");
      if (item.time !== undefined && !TIME.test(item.time))
        warn(iw, `time "${item.time}" — "09:00 ~ 10:30" 형식이 아니면 좌측 시간칸이 이상하게 보입니다`);
      checkCost(item.cost, iw);
    });
  });

  (trip.fixedExpenses ?? []).forEach((fx, fi) => {
    const fw = `${where} › fixedExpenses[${fi}] (${fx.category ?? "분류 없음"})`;
    if (typeof fx.category !== "string" || !fx.category) err(fw, "category 가 비어 있습니다");
    if (fx.cost === undefined) err(fw, "cost 는 필수입니다");
    checkCost(fx.cost, fw);
  });

  (trip.checklist ?? []).forEach((c, ci) => {
    const cw = `${where} › checklist[${ci}] (${c.label ?? "항목 없음"})`;
    if (!CHECKLIST_CATEGORIES.includes(c.category))
      err(cw, `category "${c.category}" — ${CHECKLIST_CATEGORIES.join(" / ")} 중 하나여야 합니다`);
    if (typeof c.label !== "string" || !c.label) err(cw, "label 이 비어 있습니다");
    if (typeof c.checked !== "boolean") err(cw, `checked 는 true/false 여야 합니다 (${JSON.stringify(c.checked)})`);
  });

  (trip.places ?? []).forEach((p, pi) => {
    const pw = `${where} › places[${pi}] (${p.name ?? "이름 없음"})`;
    if (typeof p.name !== "string" || !p.name) err(pw, "name 이 비어 있습니다");
    if (typeof p.confirmed !== "boolean") err(pw, `confirmed 는 true/false 여야 합니다 (${JSON.stringify(p.confirmed)})`);
    if (p.rating !== undefined && (typeof p.rating !== "number" || p.rating < 0 || p.rating > 5))
      err(pw, `rating 은 0~5 사이 숫자여야 합니다 (${JSON.stringify(p.rating)})`);
  });
});

console.log(`여행 ${trips.length}개 · Day ${dayCount}개 · 일정 ${itemCount}개 · 금액 ${costCount}건 검사`);
if (warnings.length) {
  console.log(`\n⚠ 확인해보세요 (${warnings.length}건)`);
  warnings.forEach((w) => console.log(`  - ${w}`));
}
if (errors.length) {
  console.log(`\n✗ 고쳐야 합니다 (${errors.length}건)`);
  errors.forEach((e) => console.log(`  - ${e}`));
  process.exit(1);
}
console.log("\n✓ 구조 이상 없습니다.");
