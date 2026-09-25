import type { Trip } from "../types/trip";
import tripsJson from "./trips.data.json";

/**
 * 실제 여행 데이터는 옆의 trips.data.json 에 들어 있습니다.
 * 여행을 추가/수정할 때는 trips.data.json 만 고치면 되고, 이 파일은 손댈 필요 없습니다.
 * (JSON은 타입 검사가 안 되니 `npm run check:data` 로 구조를 확인하세요.)
 */
export const trips: Trip[] = tripsJson as Trip[];
