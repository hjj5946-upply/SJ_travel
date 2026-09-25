# SJ Travel 다이어리 🧳

깜자와 여자친구의 해외여행 기록을 위한 웹 다이어리.
React + Vite + TypeScript + Tailwind CSS + GSAP.

## 1. 설치 및 실행

```bash
npm install
npm run dev
```

실행 후 터미널에 뜨는 주소(보통 http://localhost:5173)로 접속하면 됩니다.

## 2. 폴더 구조

```
src/
  types/trip.ts      # 여행 데이터 타입 정의 (Trip, DayPlan, ScheduleItem 등)
  data/trips.ts       # 여행 데이터 (지금은 더미 데이터 3개)
  utils/
    currency.ts        # 다중 통화 계산 (통화별 소계, 원화 환산, 1인당)
    stats.ts            # 대시보드 통계 (총 여행 일수/횟수/국가 수)
  components/
    Navbar.tsx
    StatCard.tsx
    TripCard.tsx
  pages/
    Dashboard.tsx       # 메인 대시보드 (통계 + 여행 목록)
    TripDetail.tsx       # 여행 상세 (일정/지출/체크리스트/맛집 4섹션)
  App.tsx               # 라우팅
  main.tsx              # 진입점 (HashRouter 사용 — GitHub Pages 대응)
```

## 3. 데이터 넣는 법 (지금 단계)

`src/data/trips.ts` 안의 `trips` 배열에 `Trip` 객체를 추가/수정하면
대시보드와 상세 페이지에 자동 반영됩니다. 지금은 더미 데이터 3개
(도쿄/하와이/나고야)가 들어있어요.

## 4. 배포 (나중에 진행)

`.github/workflows/deploy.yml`에 GitHub Actions → GitHub Pages 자동 배포
워크플로우를 미리 준비해뒀습니다. GitHub 저장소를 만들고 연결한 뒤:

1. `vite.config.ts`의 `base: '/SJ_travel/'` 값을 실제 저장소 이름에 맞게 수정
2. 저장소 Settings → Pages → Source를 "GitHub Actions"로 설정
3. `main` 브랜치에 push하면 자동 빌드/배포

## 5. 작업 흐름

- 이 프로젝트는 Claude(cowork)가 구조/디자인 방향을 잡고,
  실제 코드 작업은 Claude Code가 진행합니다.
- 지금 단계는 **더미 데이터로 UI/UX를 확정**하는 단계입니다.
- UI가 확정되면 `src/data/trips.ts`를 실제 여행 데이터로 교체합니다.
