import {
  CalendarDays,
  CarFront,
  ChevronRight,
  ListChecks,
  MapPin,
  Receipt,
  Star,
  TrainFront,
  Utensils,
  Wallet,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { DayWeather } from "../components/DayWeather";
import { DAY_IMAGES } from "../data/dayImages";
import { trips } from "../data/trips";
import {
  currencyTextClass,
  currencyTotals,
  formatCurrency,
  totalInKRW,
} from "../utils/currency";
import { formatDateRange, formatMonthDayWithWeekday } from "../utils/date";
import { splitTimeRange } from "../utils/time";
import { weatherOf } from "../utils/weather";

export function TripDetail() {
  const { tripId } = useParams();
  const trip = trips.find((t) => t.id === tripId);

  if (!trip) {
    return (
      <div className="page-container py-20 text-center">
        <p>여행을 찾을 수 없어요.</p>
        <Link to="/" className="text-brown underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const totals = currencyTotals(trip.days, trip.fixedExpenses);
  const grandTotalKRW = totalInKRW(trip.days, trip.fixedExpenses);

  // 기억으로 복원한 옛 여행은 시간도 금액도 없이 제목만 있는 경우가 있습니다.
  // 그런 여행에서 "–:–"와 "금액 미정"이 줄마다 반복되지 않도록 아예 칼럼을 접습니다.
  const allItems = trip.days.flatMap((d) => d.items);
  const hasTime = allItems.some((i) => i.time);
  const hasItemCost = allItems.some((i) => i.cost);
  const hasFixedExpense = trip.fixedExpenses.length > 0;
  const hasNormalWeather = trip.days.some((d) => weatherOf(trip.id, d.day)?.normal);

  const rowCols = hasTime
    ? hasItemCost
      ? "grid-cols-[80px_1fr] sm:grid-cols-[104px_1fr_auto]"
      : "grid-cols-[80px_1fr]"
    : hasItemCost
      ? "grid-cols-1 sm:grid-cols-[1fr_auto]"
      : "grid-cols-1";
  const costCellCols = hasTime
    ? "col-start-2 sm:col-start-3 sm:row-start-1"
    : "sm:col-start-2 sm:row-start-1";

  const totalsCaption = hasItemCost
    ? hasFixedExpense
      ? "일정 + 고정비 합산"
      : "일정 금액 합산"
    : hasFixedExpense
      ? "기록된 고정비 합산"
      : "기록된 금액 없음";

  return (
    <div className="page-container pt-2 pb-20">
      <h1 className="font-display text-2xl sm:text-3xl">
        {trip.coverEmoji} {trip.title}
      </h1>
      {/* 장소가 긴 여행(예: 신혼여행)도 어색하게 줄바꿈되지 않도록 장소 / 날짜를 항상 두 줄로 */}
      <div className="mt-3 space-y-1 text-ink/70">
        <p className="flex items-center gap-1.5">
          <MapPin className="size-4 shrink-0 text-brown/80" strokeWidth={2} />
          {trip.city}, {trip.country}
        </p>
        <p className="flex items-center gap-1.5 tabular-nums">
          <CalendarDays className="size-4 shrink-0 text-brown/80" strokeWidth={2} />
          {formatDateRange(trip.startDate, trip.endDate)}
        </p>
      </div>

      {/* 0. 총 여행금액 (통화별) — 일정보다 위 */}
      <section className="mt-8 rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display flex items-center gap-2 text-xl">
            <Wallet className="size-5 text-brown" strokeWidth={2} />
            총 여행금액
          </h2>
          <span className="text-xs text-ink/70">{totalsCaption}</span>
        </div>

        {totals.length === 0 ? (
          <p className="mt-3 text-sm text-ink/70">아직 입력된 금액이 없어요.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {totals.map((t) => (
              <div
                key={t.currency}
                className="min-w-[110px] flex-1 rounded-xl bg-cream px-3 py-2"
              >
                <p className={`text-xs font-semibold tracking-wide ${currencyTextClass(t.currency)}`}>
                  {t.currency}
                </p>
                <p className={`font-display text-lg tabular-nums ${currencyTextClass(t.currency)}`}>
                  {t.amount.toLocaleString()}
                </p>
                {t.currency !== "KRW" && (
                  <p className="text-xs tabular-nums text-ink/70">
                    ≈ ₩{t.krw.toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 금액이 하나도 없으면 "합계 ₩0"을 보여주지 않음 */}
        {totals.length > 0 && (
          <>
            <div className="mt-3 flex items-baseline justify-between border-t border-ink/10 pt-2">
              <span className="font-semibold">합계 (원화 환산)</span>
              <span className="font-display text-xl tabular-nums">
                ₩{grandTotalKRW.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-xs text-ink/70">
              <span>1인당 ({trip.people}명)</span>
              <span className="tabular-nums">
                ₩{Math.round(grandTotalKRW / trip.people).toLocaleString()}
              </span>
            </div>
          </>
        )}
      </section>

      {/* 1. 일정/스케줄 */}
      <section className="mt-10">
        <h2 className="font-display mb-3 flex items-center gap-2 text-xl">
          <CalendarDays className="size-5 text-brown" strokeWidth={2} />
          일정
        </h2>
        {hasNormalWeather && (
          <p className="-mt-1 mb-3 text-xs text-ink/70">
            날씨는 다녀온 날은 실제 기록, 아직 안 간 날은 최근 10년 평균(평년)이에요.
          </p>
        )}
        <div className="space-y-4">
          {trip.days.map((day) => {
            const dayImage = day.image ? DAY_IMAGES[day.image] : undefined;
            const weather = weatherOf(trip.id, day.day);
            return (
              <div
                key={day.day}
                className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm"
              >
                {/* 구간이 바뀌는 Day에만 배너 이미지가 붙습니다 (dayImages.ts 참고).
                    배너 비율(약 11:2)로 높이를 고정해 다른 크기 사진이 와도 카드 높이가 튀지 않게 함 */}
                {dayImage && (
                  <img
                    src={dayImage}
                    alt={`Day ${day.day} 사진`}
                    loading="lazy"
                    className="block aspect-[11/2] w-full object-cover"
                  />
                )}
                <details className="group p-4">
                  <summary className="font-display flex cursor-pointer list-none items-center gap-2 text-lg [&::-webkit-details-marker]:hidden">
                    <ChevronRight
                      className="size-5 shrink-0 text-brown/80 transition-transform group-open:rotate-90"
                      strokeWidth={2}
                    />
                    Day {day.day}
                    <span className="text-base font-normal text-ink/70 tabular-nums">
                      {formatMonthDayWithWeekday(day.date)}
                    </span>
                    {/* 우측 끝: (렌터카 쓰는 날이면 차 아이콘) + 그날 날씨 */}
                    <span className="ml-auto flex shrink-0 items-center gap-2.5">
                      {day.rentalCar && (
                        <CarFront
                          className="size-5 text-brown/80"
                          strokeWidth={2}
                          aria-label="렌터카"
                        >
                          <title>렌터카</title>
                        </CarFront>
                      )}
                      {weather && <DayWeather weather={weather} />}
                    </span>
                  </summary>
                  <ul className="mt-3">
                    {day.items.map((item) => {
                      const { start, end } = splitTimeRange(item.time);
                      return (
                        <li
                          key={item.id}
                          className={`grid gap-x-3 gap-y-1 border-t border-ink/10 py-2.5 text-[15px] leading-snug ${rowCols}`}
                        >
                          {/* 좌측: 시간대 (09:00 ~ 10:00) — 시간이 하나도 없는 여행이면 칼럼 자체를 생략 */}
                          {hasTime && (
                            // 물결(~)을 왼쪽 좁은 칸에 따로 둬서 시작·종료 시각의 숫자가 세로로 딱 맞게 정렬
                            <div className="grid grid-cols-[0.75rem_auto] content-start justify-start text-[13px] leading-snug tabular-nums text-brown/80">
                              {start || end ? (
                                <>
                                  {start && (
                                    <>
                                      <span />
                                      <span className="font-semibold">{start}</span>
                                    </>
                                  )}
                                  {/* "22:30 ~"(끝 미정), "~ 08:30"(시작 미정) 표기도 그대로 살림 */}
                                  {end && (
                                    <>
                                      <span className="text-ink/50">~</span>
                                      <span className={start ? "text-ink/70" : "font-semibold"}>
                                        {end}
                                      </span>
                                    </>
                                  )}
                                </>
                              ) : (
                                <span className="col-span-2 text-ink/30">–:–</span>
                              )}
                            </div>
                          )}

                          {/* 가운데: 항목(지역) / 내용 / 참고 */}
                          <div className="min-w-0">
                            {/* "이동" 항목은 제목 우측 끝에 이동수단 아이콘 (글자 크기와 같게) */}
                            <p className="flex items-center justify-between gap-2 font-semibold">
                              {item.title}
                              {item.title === "이동" && (
                                <TrainFront
                                  className="size-[1em] shrink-0 text-brown/80"
                                  strokeWidth={2}
                                  aria-label="이동"
                                />
                              )}
                            </p>
                            {item.content && (
                              <p className="text-ink/70">{item.content}</p>
                            )}
                            {item.note && (
                              <p className="text-[13px] text-ink/70">{item.note}</p>
                            )}
                          </div>

                          {/* 우측(좁은 화면에서는 아래): 금액 + 통화 단위.
                              항목별 금액이 아예 없는 여행이면 이 칼럼도 생략 */}
                          {hasItemCost && (
                            <div
                              className={`${costCellCols} sm:self-start sm:text-right`}
                            >
                              {item.cost ? (
                                <span
                                  className={`inline-flex items-baseline gap-1 rounded-full bg-cream px-2 py-0.5 ${currencyTextClass(item.cost.currency)}`}
                                >
                                  <span className="font-semibold tabular-nums">
                                    {item.cost.amount.toLocaleString()}
                                  </span>
                                  <span className="text-xs font-semibold">
                                    {item.cost.currency}
                                  </span>
                                </span>
                              ) : (
                                // 다른 줄에는 금액이 있으니 칸은 유지하고 옅은 줄표만
                                <span className="text-xs text-ink/25">–</span>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </details>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. 지출/가계부 */}
      <section className="mt-10">
        <h2 className="font-display mb-3 flex items-center gap-2 text-xl">
          <Receipt className="size-5 text-brown" strokeWidth={2} />
          지출
        </h2>
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          {hasFixedExpense ? (
            <>
              <h3 className="mb-2 text-sm font-semibold text-ink/70">
                {hasItemCost ? "기타 고정비" : "기록된 경비"}
              </h3>
              {/* 내용이 길어 여러 줄이 되는 항목이 많아서 항목마다 위아래 여백 + 옅은 구분선 */}
              <ul className="divide-y divide-ink/5 text-sm">
                {trip.fixedExpenses.map((fx) => (
                  <li key={fx.id} className="flex justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                    <span>
                      {fx.category}
                      {fx.content ? ` — ${fx.content}` : ""}
                    </span>
                    <span className={`shrink-0 tabular-nums ${currencyTextClass(fx.cost.currency)}`}>
                      {formatCurrency(fx.cost)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-ink/70">
              {hasItemCost
                ? "따로 기록한 고정비는 없어요. 금액은 일정에 들어 있습니다."
                : "이 여행은 기록된 금액이 없어요."}
            </p>
          )}

          {totals.length > 0 && (
            <p
              className={`text-xs text-ink/70 ${hasFixedExpense ? "mt-3 border-t border-ink/10 pt-2" : "mt-2"}`}
            >
              통화별 소계와 총합은 맨 위 「총 여행금액」에 모아뒀어요.
            </p>
          )}
        </div>
      </section>

      {/* 3. 준비물 체크리스트 — 항목이 없으면 섹션째로 생략 */}
      {trip.checklist.length > 0 && (
      <section className="mt-10">
        <h2 className="font-display mb-3 flex items-center gap-2 text-xl">
          <ListChecks className="size-5 text-brown" strokeWidth={2} />
          준비물 체크리스트
        </h2>
        {/* 보면서 참고하는 목록이라 체크박스 없이 분류 + 항목만 */}
        <ul className="divide-y divide-ink/5 rounded-2xl border border-ink/10 bg-white px-4 py-2 shadow-sm">
          {trip.checklist.map((c) => (
            <li key={c.id} className="flex items-baseline gap-3 py-2 text-sm">
              <span className="w-16 shrink-0 text-xs text-ink/70">{c.category}</span>
              <span>{c.label}</span>
            </li>
          ))}
        </ul>
      </section>
      )}

      {/* 4. 맛집·가볼 곳 후보 — 후보가 없는 여행(대부분의 옛 여행)은 섹션째로 생략 */}
      {trip.places.length > 0 && (
      <section className="mt-10">
        <h2 className="font-display mb-3 flex items-center gap-2 text-xl">
          <Utensils className="size-5 text-brown" strokeWidth={2} />
          맛집 · 가볼 곳 후보
        </h2>
        <ul className="space-y-2">
          {trip.places.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-3 text-sm shadow-sm"
            >
              <div>
                <span className="font-semibold">{p.name}</span>
                <span className="ml-2 text-ink/70">{p.category}</span>
                {p.hours && (
                  <p className="text-xs text-ink/70">
                    영업 {p.hours}
                    {p.breakTime ? ` (브레이크 ${p.breakTime})` : ""}
                  </p>
                )}
              </div>
              <div className="text-right">
                {p.rating && (
                  <p className="flex items-center justify-end gap-1 tabular-nums">
                    <Star className="size-3.5 fill-current text-brown/80" strokeWidth={2} />
                    {p.rating}
                  </p>
                )}
                <p className={p.confirmed ? "text-green-600" : "text-ink/70"}>
                  {p.confirmed ? "확정" : "후보"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      )}
    </div>
  );
}
