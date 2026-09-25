/** 국가 이름 → 국기 이모지.
 *  데이터의 country 값을 그대로 키로 씁니다. 새 국가를 여행하면 여기에 한 줄 추가. */
export const COUNTRY_FLAG: Record<string, string> = {
  한국: "🇰🇷",
  일본: "🇯🇵",
  미국: "🇺🇸",
  대만: "🇹🇼",
  중국: "🇨🇳",
  홍콩: "🇭🇰",
  마카오: "🇲🇴",
  베트남: "🇻🇳",
  태국: "🇹🇭",
  필리핀: "🇵🇭",
  싱가포르: "🇸🇬",
  말레이시아: "🇲🇾",
  인도네시아: "🇮🇩",
  호주: "🇦🇺",
  뉴질랜드: "🇳🇿",
  프랑스: "🇫🇷",
  이탈리아: "🇮🇹",
  스페인: "🇪🇸",
  영국: "🇬🇧",
  독일: "🇩🇪",
  스위스: "🇨🇭",
  체코: "🇨🇿",
  캐나다: "🇨🇦",
  괌: "🇬🇺",
  사이판: "🇲🇵",
};

/** "일본 · 미국" 처럼 두 나라를 함께 간 여행도 있어서 나눠서 다룹니다. */
export function splitCountries(country: string): string[] {
  return country
    .split(/[·,&/]/)
    .map((c) => c.trim())
    .filter(Boolean);
}

/** 목록에 없는 국가는 흰 깃발로 대체 (데이터는 그대로 보여줌).
 *  "일본 · 미국" 이면 "🇯🇵🇺🇸" 처럼 붙여서 돌려줍니다. */
export function flagOf(country: string): string {
  const parts = splitCountries(country);
  if (parts.length === 0) return "🏳️";
  return parts.map((c) => COUNTRY_FLAG[c] ?? "🏳️").join("");
}
