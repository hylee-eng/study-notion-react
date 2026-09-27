/* ══════════════════════════════════════════════════════════
   공유 오피스 데이터의 모양과 거르기 규칙.

   서버(lib/sharedOffice.ts)와 브라우저(SharedOfficeExplorer) 양쪽에서 씁니다.
   그래서 이 파일에는 캐시나 인증키처럼 서버에서만 되는 것을 넣지 않습니다.
   ══════════════════════════════════════════════════════════ */

/** 원본 열 이름 → 화면에 쓰는 짧은 이름. 순서가 화면에 보이는 순서입니다 */
export const AMENITIES = [
  ["인터넷_와이파이", "와이파이"],
  ["24시 운영", "24시 운영"],
  ["주차", "주차"],
  ["공용라운지", "공용 라운지"],
  ["복사_인쇄기", "복사·인쇄"],
  ["티비_프로젝터", "TV·프로젝터"],
  ["화이트보드", "화이트보드"],
  ["택배발송서비스", "택배 발송"],
  ["샤워시설", "샤워실"],
  ["개인락커", "개인 락커"],
  ["공용주방", "공용 주방"],
  ["카페_레스토랑", "카페·식당"],
  ["간단한 다과_음료", "다과·음료"],
  ["정수기", "정수기"],
  ["테라스_루프탑", "테라스·루프탑"],
  ["연중무휴", "연중무휴"],
  ["도어락", "도어락"],
  ["콘센트", "콘센트"],
  ["팩스", "팩스"],
  ["에어컨", "에어컨"],
  ["난방기", "난방기"],
  ["창고", "창고"],
] as const;

export type AmenityLabel = (typeof AMENITIES)[number][1];

export type SharedOffice = {
  id: string;
  name: string;
  sido: string;
  sigungu: string;
  address: string;
  lat: number;
  lng: number;
  /** 원 단위. 원본에 값이 없으면 null */
  fee: number | null;
  /** 월 · 일 */
  feeUnit: string;
  capacity: string;
  /** 요일별 운영시간을 한 줄로 줄인 것. 예: 매일 00:00 ~ 24:00 */
  hours: string;
  amenities: AmenityLabel[];
};

/**
 * 공유 오피스 한 곳. 원본은 1인실·2인실처럼 상품마다 한 줄이라,
 * 같은 주소의 상품을 묶어 "장소" 하나로 만듭니다. (전국 905건 → 약 345곳)
 */
export type OfficePlace = {
  id: string;
  name: string;
  sido: string;
  sigungu: string;
  address: string;
  lat: number;
  lng: number;
  /** 대표 요금. 월 요금이 있으면 월 최저, 없으면 일 최저 */
  feeFrom: { fee: number; unit: string } | null;
  hours: string;
  /** 상품 중 하나라도 갖춘 편의시설 */
  amenities: AmenityLabel[];
  listings: { name: string; fee: number | null; feeUnit: string; capacity: string }[];
};

type Located = { sido?: string; sigungu?: string; amenities: readonly string[] };
export type OfficeFilter = { sido?: string; sigungu?: string; amenities?: string[] };

export function filterOffices<T extends Located>(items: T[], f: OfficeFilter) {
  return items.filter(
    (o) =>
      (!f.sido || o.sido === f.sido) &&
      (!f.sigungu || o.sigungu === f.sigungu) &&
      (f.amenities ?? []).every((a) => o.amenities.includes(a)),
  );
}

/** "[1인실] 선릉 공유오피스 더공간A" → "선릉 공유오피스 더공간A" */
function cleanName(name: string) {
  return name.replace(/\[[^\]]*\]/g, "").replace(/\s+/g, " ").trim() || name;
}

/** 상품 이름들의 공통 앞부분을 장소 이름으로 씁니다. 너무 짧으면 가장 짧은 이름을 씁니다 */
function placeName(names: string[]) {
  const cleaned = names.map(cleanName);
  let prefix = cleaned[0];
  for (const n of cleaned.slice(1)) {
    let i = 0;
    while (i < prefix.length && i < n.length && prefix[i] === n[i]) i++;
    prefix = prefix.slice(0, i);
  }
  prefix = prefix.replace(/[\s\-_(]+$/, "").trim();
  return prefix.length >= 4 ? prefix : cleaned.reduce((a, b) => (b.length < a.length ? b : a));
}

export function groupPlaces(offices: SharedOffice[]): OfficePlace[] {
  const byAddress = new Map<string, SharedOffice[]>();
  for (const o of offices) {
    const k = o.address || `${o.lat},${o.lng}`;
    byAddress.set(k, [...(byAddress.get(k) ?? []), o]);
  }

  return [...byAddress.values()].map((group) => {
    const first = group[0];
    const cheapest = (unit: string) =>
      group
        .filter((o) => o.feeUnit === unit && o.fee !== null)
        .reduce<number | null>((min, o) => (min === null || o.fee! < min ? o.fee : min), null);
    const month = cheapest("월");
    const day = cheapest("일");
    const has = new Set(group.flatMap((o) => o.amenities));

    return {
      id: first.id,
      name: placeName(group.map((o) => o.name)),
      sido: first.sido,
      sigungu: first.sigungu,
      address: first.address,
      lat: first.lat,
      lng: first.lng,
      feeFrom: month !== null ? { fee: month, unit: "월" } : day !== null ? { fee: day, unit: "일" } : null,
      hours: first.hours,
      amenities: AMENITIES.map(([, label]) => label).filter((l) => has.has(l)),
      listings: group.map((o) => ({ name: o.name, fee: o.fee, feeUnit: o.feeUnit, capacity: o.capacity })),
    };
  });
}
