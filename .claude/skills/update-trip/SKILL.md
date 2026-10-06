---
name: update-trip
description: 엑셀(.xlsx)로 짠 여행 계획·일정을 src/data/trips.data.json 에 반영한다. 새 여행 추가, 기존 여행의 일정/지출/준비물/맛집 수정·추가·삭제 요청에 사용. 사용자가 "/update-trip", "엑셀 반영", "일정 수정해줘", "계획 바뀌었어" 등을 말하면 실행.
argument-hint: "[여행 이름 또는 id] [엑셀 경로] [바뀐 내용 메모]"
---

# 여행 계획 반영 (엑셀 → trips.data.json)

사용자 입력: $ARGUMENTS

## 0. 입력 파악

- **어떤 여행인가**: 여행 이름("신혼여행"), id("honeymoon-2027-01"), 또는 "새 여행".
  `src/data/trips.data.json` 의 `id` / `title` 과 대조해 하나로 특정한다. 애매하면 후보를 보여주고 묻는다.
- **원본**: 보통 `plans/` 폴더의 엑셀 파일. 경로가 없으면 `plans/` 에서 가장 최근 수정된 `.xlsx` 를 후보로 제시하고 확인받는다.
  엑셀 없이 대화로 "Day 3 14:00 일정 빼줘"처럼 말하면 그 내용만 반영한다.
- **범위**: 엑셀 전체 교체인지, 특정 Day/항목만인지. 말이 없으면 "엑셀에 있는 Day 들만 교체, 엑셀에 없는 Day 는 유지"로 한다.

## 1. 엑셀 읽기

`python -I` + openpyxl 로 읽는다 (`data_only=True` — 수식 말고 값). 시트가 여러 개면 시트 이름과 머리글을 먼저 보여주고 어떤 시트인지 확인.
스크립트는 스크래치패드에 두고 엑셀 경로는 인자로 넘긴다.

열 → 데이터 매핑 (`src/types/trip.ts` 기준, 머리글 이름이 조금 달라도 의미로 맞춘다):

| 엑셀 열 | 필드 | 규칙 |
|---|---|---|
| Day | `day` | 병합 셀이면 위 값을 이어받음 |
| 날짜 | `date` | `YYYY-MM-DD`. 없으면 여행 시작일 + (Day-1). 단, 하와이처럼 날짜변경선을 넘으면 같은 날짜가 두 Day 에 나올 수 있으니 기존 데이터의 date 를 우선 |
| 시간 | `time` | `"09:00 ~ 10:30"`, `"~ 08:30"`, `"22:30 ~"`. 엑셀 시간 타입이면 `HH:MM` 으로. 세미콜론 오타(`10;30`)는 콜론으로 고침 |
| 항목 | `title` | 필수. 비어 있는 행은 건너뜀 |
| 내용 | `content` | 줄바꿈은 그대로 유지 |
| 비용 | `cost.amount` | 숫자만 (쉼표·통화기호 제거). 0 이나 빈칸이면 `cost` 자체를 넣지 않음 |
| 단위 | `cost.currency` | KRW/JPY/USD/EUR/TWD/VND/THB/PHP. "원"→KRW, "엔"→JPY, "달러"/"$"→USD |
| 참고 | `note` | |

빈 문자열 필드는 아예 넣지 않는다 (`"note": ""` 금지).

## 2. 반드시 지킬 것 — 엑셀에 없는 값은 보존

엑셀에는 없고 웹에서만 쓰는 값들이 있다. **Day 를 통째로 다시 만들 때 이것들이 빠지기 쉽다** (예전에 Day 배너 이미지가 이렇게 사라진 적 있음).
교체 전에 기존 값을 기록해 두고, 같은 Day 번호에 그대로 다시 넣는다.

- Day: `image`(배너 사진), `rentalCar`(렌터카 아이콘), `weekday`
- 여행: `id`, `coverEmoji`, `themeColor`, `people`, `title`, `country`, `city` — 사용자가 바꾸라고 하지 않는 한 유지
- `fixedExpenses` / `checklist` / `places` — 엑셀에 해당 시트가 없으면 손대지 않음
- 항목 `id`: 기존 항목과 같은 위치·제목이면 기존 id 유지, 새 항목은 그 여행 안에서 안 겹치게 `i<다음번호>`

Day 수가 줄거나 Day 번호가 바뀌어 `image` / `rentalCar` 를 어디에 둘지 애매하면 **묻는다**.

## 3. 새 여행일 때

- `id`: `<도시영문>-<YYYY>-<MM>` (예: `osaka-2027-03`). 겹치면 접미사.
- `themeColor`: 최근 여행과 다른 색. `coverEmoji`: 도시 분위기에 맞게 하나 제안.
- 국가가 `src/utils/countries.ts` 의 `COUNTRY_CODE` 에 없으면 추가하고, `src/components/CountryFlag.tsx` 의 import·`FLAGS` 에도 같은 코드 추가.
- 도시가 `scripts/fetch-weather.mjs` 의 `CITY_COORDS` 에 없으면 좌표 추가.

## 4. 날씨

- 날짜·도시가 바뀌었거나 새 여행이면 `npm run weather` 실행.
- 숙소 도시와 기후가 크게 다른 당일치기(산·고원·분지 — 예: 가와구치코)가 새로 생기면
  `fetch-weather.mjs` 의 `DAY_CITY_OVERRIDES` 에 Day 별 도시를 추가한 뒤 실행.
- 여러 도시를 도는 여행은 Day 별 도시를 `DAY_CITY_OVERRIDES` 에 지정.

## 5. 검증

```
npm run check:data   # 구조 검사 (에러 0 이어야 함, 경고는 내용 보고)
npm run build
```

## 6. 보고

변경 요약을 Day 별로 짧게:
- 추가 / 삭제 / 수정된 항목 (수정은 "전 → 후")
- 보존한 값 (image, rentalCar 등)과 위치
- 날씨 다시 받았는지, 경고가 있었는지
- 커밋은 사용자가 요청할 때만 한다.
