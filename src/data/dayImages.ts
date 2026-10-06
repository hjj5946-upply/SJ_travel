import hawaii2 from "../assets/hawaii_2.webp";
import tokyo1 from "../assets/tokyo_1.webp";
import tokyo3 from "../assets/tokyo_3.webp";

/**
 * Day 카드 맨 위에 깔리는 배너 이미지.
 * trips.data.json 의 day.image 값이 아래 키와 같아야 보입니다.
 * 새 이미지는 src/assets 에 넣고 여기에 한 줄만 추가하면 됩니다.
 */
export const DAY_IMAGES: Record<string, string> = {
  tokyo_1: tokyo1,
  hawaii_2: hawaii2,
  tokyo_3: tokyo3,
};
