// SJ Travel 다이어리 — 데이터 타입 정의
// 실제 여행 데이터를 넣을 때도 이 구조를 그대로 따릅니다.

export type Currency =
  | "KRW"
  | "JPY"
  | "USD"
  | "EUR"
  | "TWD"
  | "VND"
  | "THB"
  | "PHP";

export interface Cost {
  amount: number;
  currency: Currency;
}

/** 하루 일정 안의 한 줄 (엑셀의 Day/시간/항목/내용/비용/단위/참고 열에 대응) */
export interface ScheduleItem {
  id: string;
  time?: string; // 예: "09:45 ~ 11:20"
  title: string; // 항목 (예: "숙소 체크인", "[v]시부야")
  content?: string; // 내용 (예: "짐맡기고 놀러출발")
  cost?: Cost;
  note?: string; // 참고 & 기타사항
}

export interface DayPlan {
  day: number; // Day 1, Day 2 ...
  date: string; // ISO date "2026-05-23"
  weekday?: string; // "SAT" 같은 표기용 (없으면 date로 계산)
  items: ScheduleItem[];
}

/** Day에 안 묶이는 고정비 (유심, 교통패스, 비상금 등) */
export interface FixedExpense {
  id: string;
  category: string; // 유심 / 교통비 / 비상금 등
  content?: string;
  cost: Cost;
}

export interface ChecklistItem {
  id: string;
  category: "서류" | "짐" | "기타";
  label: string;
  checked: boolean;
}

export interface PlaceCandidate {
  id: string;
  name: string;
  category: string; // 음식 종류 / 장소 유형
  hours?: string; // 영업시간
  breakTime?: string;
  rating?: number; // 구글평점 (5점 만점)
  confirmed: boolean; // 확정 여부
}

export interface Trip {
  id: string;
  title: string; // 예: "나고야 여행"
  country: string;
  city: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  coverEmoji?: string;
  themeColor: "blush" | "peach" | "mint" | "sky" | "lavender";
  people: number; // 함께 간 인원 (1인당 비용 계산용, 기본 2)
  days: DayPlan[];
  fixedExpenses: FixedExpense[];
  checklist: ChecklistItem[];
  places: PlaceCandidate[];
}
