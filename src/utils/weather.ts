import weatherData from "../data/weather.json";

export interface DayWeatherInfo {
  min: number;
  max: number;
  /** WMO 날씨 코드 (Open-Meteo) */
  code: number;
  /** true면 실측이 아닌 평년값 (아직 안 온 날짜) */
  normal?: boolean;
}

/** scripts/fetch-weather.mjs 가 만든 { 여행id: { day: 날씨 } } */
const WEATHER = weatherData as Record<string, Record<string, DayWeatherInfo>>;

export function weatherOf(tripId: string, day: number): DayWeatherInfo | undefined {
  return WEATHER[tripId]?.[day];
}
