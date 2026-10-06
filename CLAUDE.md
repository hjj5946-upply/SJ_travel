# Travel Diary (SJ_travel)

React 19 + Vite + Tailwind v4 여행 다이어리. GitHub Pages 배포 (`base: /SJ_travel/`).

## 데이터

- 모든 여행 데이터: `src/data/trips.data.json` (타입: `src/types/trip.ts`)
- 엑셀 계획 반영은 `/update-trip` 스킬 절차를 따른다. 원본 엑셀은 `plans/` (git 포함 — 여러 PC에서 작업)
- Day 를 다시 만들 때 엑셀에 없는 `image` / `rentalCar` 를 반드시 보존
- 날씨: `npm run weather` → `src/data/weather.json` (지난 날짜는 실측, 미래는 10년 평년)
- 수정 후 항상 `npm run check:data` + `npm run build`

## UI 규칙

- 아이콘은 `lucide-react` 선 아이콘 (`text-brown`, `strokeWidth={2}`, 배경 없음). 섹션 제목에 기본 이모지 쓰지 않음
  (여행별 `coverEmoji` 는 예외로 이모지 유지)
- 국기는 `components/CountryFlag` (SVG). 국기 이모지는 Windows 에서 글자로 보여서 쓰지 않음
- 페이지/헤더 폭은 `page-container` 유틸리티 하나로 통일 (`src/index.css`)
- 날짜는 `utils/date.ts` 의 포맷 함수만 사용: `2027.01.16 ~ 01.29`, Day 카드 `01.16 (토)`
- 통화 색: `currencyTextClass()` (KRW 파랑 / JPY·USD 빨강, 톤다운 토큰 `krw` / `foreign`)
- 보조 글씨는 `text-ink/70` 이상 (대비 확보). 숫자는 `tabular-nums`
- 폰트: Pretendard
