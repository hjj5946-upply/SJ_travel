import { Link, useParams } from "react-router-dom";
import { trips } from "../data/trips";
import { currencyTotals, formatCurrency, totalInKRW } from "../utils/currency";
import { splitTimeRange } from "../utils/time";

export function TripDetail() {
  const { tripId } = useParams();
  const trip = trips.find((t) => t.id === tripId);

  if (!trip) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
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

  const rowCols = hasTime
    ? hasItemCost
      ? "grid-cols-[76px_1fr] sm:grid-cols-[104px_1fr_auto]"
      : "grid-cols-[76px_1fr]"
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
    <div className="mx-auto max-w-3xl px-6 pb-20">
      <Link to="/" className="text-sm text-brown/80">
        ← 목록으로
      </Link>
      <h1 className="font-display mt-2 text-3xl">
        {trip.coverEmoji} {trip.title}
      </h1>
      <p className="text-ink/70">
        {trip.city}, {trip.country} · {trip.startDate} ~ {trip.endDate}
      </p>

      {/* 0. 총 여행금액 (통화별) — 일정보다 위 */}
      <section className="mt-8 rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-xl">💵 총 여행금액</h2>
          <span className="text-xs text-ink/50">{totalsCaption}</span>
        </div>

        {totals.length === 0 ? (
          <p className="mt-3 text-sm text-ink/50">아직 입력된 금액이 없어요.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {totals.map((t) => (
              <div
                key={t.currency}
                className="min-w-[110px] flex-1 rounded-xl bg-cream px-3 py-2"
              >
                <p className="text-xs font-semibold tracking-wide text-brown/70">
                  {t.currency}
                </p>
                <p className="font-display text-lg tabular-nums">
                  {t.amount.toLocaleString()}
                </p>
                {t.currency !== "KRW" && (
                  <p className="text-xs tabular-nums text-ink/50">
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
            <div className="flex justify-between text-xs text-ink/60">
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
        <h2 className="font-display mb-3 text-xl">📅 일정</h2>
        <div className="space-y-4">
          {trip.days.map((day) => (
            <details
              key={day.day}
              open
              className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm"
            >
              <summary className="font-display cursor-pointer text-lg">
                Day {day.day} ({day.weekday}) {day.date}
              </summary>
              <ul className="mt-3">
                {day.items.map((item) => {
                  const { start, end } = splitTimeRange(item.time);
                  return (
                    <li
                      key={item.id}
                      className={`grid gap-x-3 gap-y-1 border-t border-ink/10 py-2 text-sm ${rowCols}`}
                    >
                      {/* 좌측: 시간대 (09:00 ~ 10:00) — 시간이 하나도 없는 여행이면 칼럼 자체를 생략 */}
                      {hasTime && (
                        <div className="text-xs leading-tight tabular-nums text-brown/80">
                          {start || end ? (
                            <>
                              {start && (
                                <span className="block font-semibold">
                                  {start}
                                </span>
                              )}
                              {/* "22:30 ~"(끝 미정), "~ 08:30"(시작 미정) 표기도 그대로 살림 */}
                              {end && (
                                <span
                                  className={
                                    start
                                      ? "block text-ink/45"
                                      : "block font-semibold"
                                  }
                                >
                                  ~ {end}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-ink/30">–:–</span>
                          )}
                        </div>
                      )}

                      {/* 가운데: 항목(지역) / 내용 / 참고 */}
                      <div className="min-w-0">
                        <p className="font-semibold">{item.title}</p>
                        {item.content && (
                          <p className="text-ink/70">{item.content}</p>
                        )}
                        {item.note && (
                          <p className="text-xs text-ink/50">{item.note}</p>
                        )}
                      </div>

                      {/* 우측(좁은 화면에서는 아래): 금액 + 통화 단위.
                          항목별 금액이 아예 없는 여행이면 이 칼럼도 생략 */}
                      {hasItemCost && (
                        <div
                          className={`${costCellCols} sm:self-start sm:text-right`}
                        >
                          {item.cost ? (
                            <span className="inline-flex items-baseline gap-1 rounded-full bg-cream px-2 py-0.5">
                              <span className="font-semibold tabular-nums">
                                {item.cost.amount.toLocaleString()}
                              </span>
                              <span className="text-xs font-semibold text-brown/70">
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
          ))}
        </div>
      </section>

      {/* 2. 지출/가계부 */}
      <section className="mt-10">
        <h2 className="font-display mb-3 text-xl">💰 지출</h2>
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          {hasFixedExpense ? (
            <>
              <h3 className="mb-2 text-sm font-semibold text-ink/70">
                {hasItemCost ? "기타 고정비" : "기록된 경비"}
              </h3>
              <ul className="space-y-1 text-sm">
                {trip.fixedExpenses.map((fx) => (
                  <li key={fx.id} className="flex justify-between gap-2">
                    <span>
                      {fx.category}
                      {fx.content ? ` — ${fx.content}` : ""}
                    </span>
                    <span className="shrink-0 tabular-nums">
                      {formatCurrency(fx.cost)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-ink/50">
              {hasItemCost
                ? "따로 기록한 고정비는 없어요. 금액은 일정에 들어 있습니다."
                : "이 여행은 기록된 금액이 없어요."}
            </p>
          )}

          {totals.length > 0 && (
            <p
              className={`text-xs text-ink/50 ${hasFixedExpense ? "mt-3 border-t border-ink/10 pt-2" : "mt-2"}`}
            >
              통화별 소계와 총합은 맨 위 「총 여행금액」에 모아뒀어요.
            </p>
          )}
        </div>
      </section>

      {/* 3. 준비물 체크리스트 — 항목이 없으면 섹션째로 생략 */}
      {trip.checklist.length > 0 && (
      <section className="mt-10">
        <h2 className="font-display mb-3 text-xl">🎒 준비물 체크리스트</h2>
        <ul className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          {trip.checklist.map((c) => (
            <li key={c.id} className="flex items-center gap-2 py-1 text-sm">
              <input
                type="checkbox"
                defaultChecked={c.checked}
                readOnly
                className="size-5 accent-brown"
              />
              <span className="text-ink/50">[{c.category}]</span>
              <span>{c.label}</span>
            </li>
          ))}
        </ul>
      </section>
      )}

      {/* 4. 맛집·가볼 곳 후보 — 후보가 없는 여행(대부분의 옛 여행)은 섹션째로 생략 */}
      {trip.places.length > 0 && (
      <section className="mt-10">
        <h2 className="font-display mb-3 text-xl">🍽️ 맛집 · 가볼 곳 후보</h2>
        <ul className="space-y-2">
          {trip.places.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-3 text-sm shadow-sm"
            >
              <div>
                <span className="font-semibold">{p.name}</span>
                <span className="ml-2 text-ink/60">{p.category}</span>
                {p.hours && (
                  <p className="text-xs text-ink/50">
                    영업 {p.hours}
                    {p.breakTime ? ` (브레이크 ${p.breakTime})` : ""}
                  </p>
                )}
              </div>
              <div className="text-right">
                {p.rating && <p>⭐ {p.rating}</p>}
                <p className={p.confirmed ? "text-green-600" : "text-ink/40"}>
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
