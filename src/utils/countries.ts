/** 국가 이름 → ISO 국가 코드 (국기 아이콘용, components/CountryFlag.tsx).
 *  데이터의 country 값을 그대로 키로 씁니다. 새 국가를 여행하면 여기에 한 줄 추가
 *  (CountryFlag.tsx 의 FLAGS 에도 같은 코드를 추가). */
export const COUNTRY_CODE: Record<string, string> = {
  한국: "KR",
  일본: "JP",
  미국: "US",
  대만: "TW",
  중국: "CN",
  홍콩: "HK",
  마카오: "MO",
  베트남: "VN",
  태국: "TH",
  필리핀: "PH",
  싱가포르: "SG",
  말레이시아: "MY",
  인도네시아: "ID",
  호주: "AU",
  뉴질랜드: "NZ",
  프랑스: "FR",
  이탈리아: "IT",
  스페인: "ES",
  영국: "GB",
  독일: "DE",
  스위스: "CH",
  체코: "CZ",
  캐나다: "CA",
  괌: "GU",
  사이판: "MP",
};

/** "일본 · 미국" 처럼 두 나라를 함께 간 여행도 있어서 나눠서 다룹니다. */
export function splitCountries(country: string): string[] {
  return country
    .split(/[·,&/]/)
    .map((c) => c.trim())
    .filter(Boolean);
}
