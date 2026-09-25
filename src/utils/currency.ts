import type { Cost, Currency, DayPlan, FixedExpense } from "../types/trip";

// 더미 환율 (KRW 기준). 실제 서비스에서는 필요 시 최신 값으로 교체하거나
// 여행 시점 환율을 데이터에 같이 박아두는 방식으로 바꿀 수 있음.
export const EXCHANGE_RATE_TO_KRW: Record<Currency, number> = {
  KRW: 1,
  JPY: 9.2,
  USD: 1380,
  EUR: 1500,
  TWD: 43,
  VND: 0.056,
  THB: 38,
  PHP: 24.5,
};

/** 통화별 기호 (금액 옆에 크게 쓰는 용도) */
export const CURRENCY_SYMBOL: Record<Currency, string> = {
  KRW: "₩",
  JPY: "¥",
  USD: "$",
  EUR: "€",
  TWD: "NT$",
  VND: "₫",
  THB: "฿",
  PHP: "₱",
};

export function toKRW(cost: Cost): number {
  return Math.round(cost.amount * EXCHANGE_RATE_TO_KRW[cost.currency]);
}

export function formatCurrency(cost: Cost): string {
  return `${cost.amount.toLocaleString()} ${cost.currency}`;
}

/** 여행 전체 지출을 통화별로 집계 */
export function summarizeByCurrency(
  days: DayPlan[],
  fixedExpenses: FixedExpense[],
): Record<string, number> {
  const totals: Record<string, number> = {};
  const add = (cost?: Cost) => {
    if (!cost) return;
    totals[cost.currency] = (totals[cost.currency] ?? 0) + cost.amount;
  };
  days.forEach((d) => d.items.forEach((i) => add(i.cost)));
  fixedExpenses.forEach((f) => add(f.cost));
  return totals;
}

export interface CurrencyTotal {
  currency: Currency;
  amount: number;
  krw: number;
}

/** 통화별 합계 + 원화 환산값을, 큰 금액(원화 기준)부터 정렬해서 반환 */
export function currencyTotals(
  days: DayPlan[],
  fixedExpenses: FixedExpense[],
): CurrencyTotal[] {
  return Object.entries(summarizeByCurrency(days, fixedExpenses))
    .map(([currency, amount]) => ({
      currency: currency as Currency,
      amount,
      krw: toKRW({ amount, currency: currency as Currency }),
    }))
    .sort((a, b) => b.krw - a.krw);
}

export function totalInKRW(
  days: DayPlan[],
  fixedExpenses: FixedExpense[],
): number {
  return currencyTotals(days, fixedExpenses).reduce((sum, t) => sum + t.krw, 0);
}
