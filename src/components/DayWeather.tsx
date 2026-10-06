import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type { DayWeatherInfo } from "../utils/weather";

/** WMO 코드 → 아이콘 / 한글 설명 */
function describe(code: number): { Icon: LucideIcon; label: string } {
  if (code === 0) return { Icon: Sun, label: "맑음" };
  if (code <= 2) return { Icon: CloudSun, label: "구름 조금" };
  if (code === 3) return { Icon: Cloud, label: "흐림" };
  if (code === 45 || code === 48) return { Icon: CloudFog, label: "안개" };
  if (code >= 51 && code <= 57) return { Icon: CloudDrizzle, label: "이슬비" };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { Icon: CloudRain, label: "비" };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { Icon: CloudSnow, label: "눈" };
  if (code >= 95) return { Icon: CloudLightning, label: "뇌우" };
  return { Icon: Cloud, label: "흐림" };
}

const toF = (c: number) => Math.round((c * 9) / 5 + 32);

/** Day 카드 우측 끝: 아이콘 + "-1 ~ 6°C". 화씨는 길게 누르거나 마우스를 올리면 보임 */
export function DayWeather({ weather }: { weather: DayWeatherInfo }) {
  const { Icon, label } = describe(weather.code);
  const { min, max } = weather;
  const tooltip = `${label}${weather.normal ? " (평년)" : ""} · ${min} ~ ${max}°C (${toF(min)} ~ ${toF(max)}°F)`;
  return (
    <span
      title={tooltip}
      aria-label={tooltip}
      className="flex shrink-0 items-center gap-1.5 font-sans text-sm font-normal text-ink/70 tabular-nums"
    >
      <Icon className="size-[1.15em] text-brown/80" strokeWidth={2} />
      {min} ~ {max}°C
    </span>
  );
}
