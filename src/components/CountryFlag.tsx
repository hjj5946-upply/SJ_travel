import { Flag } from "lucide-react";
import {
  AU, CA, CH, CN, CZ, DE, ES, FR, GB, GU, HK, ID, IT, JP, KR, MO, MP, MY, NZ, PH, SG, TH, TW, US, VN,
} from "country-flag-icons/react/3x2";
import { COUNTRY_CODE, splitCountries } from "../utils/countries";

// 국기 이모지는 Windows에서 "JP" 같은 글자로 보여서 SVG 국기를 씁니다.
// 쓰는 국기만 import 해야 번들에 전체 국기가 안 딸려옵니다.
const FLAGS: Record<string, typeof JP> = {
  AU, CA, CH, CN, CZ, DE, ES, FR, GB, GU, HK, ID, IT, JP, KR, MO, MP, MY, NZ, PH, SG, TH, TW, US, VN,
};

/** "일본 · 미국" 처럼 여러 나라면 국기를 나란히. 목록에 없는 나라는 깃발 아이콘으로 대체 */
export function CountryFlag({
  country,
  className = "h-3.5",
}: {
  country: string;
  /** 높이만 지정하면 3:2 비율로 맞춰짐 */
  className?: string;
}) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 align-middle">
      {splitCountries(country).map((name) => {
        const Svg = FLAGS[COUNTRY_CODE[name]];
        return Svg ? (
          <Svg
            key={name}
            title={name}
            className={`${className} w-auto rounded-[2px] ring-1 ring-ink/10`}
          />
        ) : (
          <Flag key={name} className={`${className} w-auto text-ink/70`} aria-label={name} />
        );
      })}
    </span>
  );
}
