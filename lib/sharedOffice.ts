import { unstable_cache } from "next/cache";

import { AMENITIES, groupPlaces, type OfficePlace, type SharedOffice } from "./sharedOfficeModel";

export { filterOffices, type OfficePlace, type SharedOffice } from "./sharedOfficeModel";

/* ══════════════════════════════════════════════════════════
   한국문화정보원 전국 공유 오피스 시설 데이터 (공공데이터포털 오픈API) 조회.

   서버에서만 실행됩니다. 인증키(DATA_GO_KR_KEY)를 읽는 곳이 여기 하나뿐이고,
   화면과 /api/shared-offices 는 이 파일이 정리해 준 결과만 받아 씁니다.

   원본은 파일데이터를 자동으로 API 로 바꿔 준 것이라, 한 번에 전체(905곳)를
   받아 두고 지역·편의시설 거르기는 이쪽에서 합니다.
   ══════════════════════════════════════════════════════════ */

const BASE_URL = "https://api.odcloud.kr/api/15111411/v1/uddi:d93c5174-47eb-4eb2-830a-b98e595fa163";

export const SOURCE = "한국문화정보원 전국 공유 오피스 시설 데이터 (공공데이터포털)";

/** 원본이 한 번 만들어진 뒤 갱신되지 않는 자료라 하루 한 번이면 충분합니다 */
const CACHE_SECONDS = 86400;

export type SharedOfficeData = {
  /** 원본 그대로의 상품 목록 (905건) */
  offices: SharedOffice[];
  /** 같은 주소를 묶은 장소 목록 (약 345곳). 화면과 노션용 CSV 는 이것을 씁니다 */
  places: OfficePlace[];
  /** 원본의 최종작성일. 예: 2022-11-16 */
  writtenAt: string;
  source: string;
  fetchedAt: string;
};

type RawRow = Record<string, string | number | null>;

function hideKey(text: string, key: string) {
  return key ? text.split(key).join("***").split(encodeURIComponent(key)).join("***") : text;
}

function str(v: RawRow[string]) {
  return v === null || v === undefined ? "" : String(v).trim();
}

const DAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;

/** 요일 7개를 "매일 …" 이나 "평일 … · 주말 …" 처럼 한 줄로 줄입니다 */
function summarizeHours(row: RawRow) {
  const byDay = DAYS.map((d) => str(row[`운영시간(${d})`]));
  if (byDay.every((h) => h === byDay[0])) return byDay[0] ? `매일 ${byDay[0]}` : "";
  const weekday = byDay.slice(0, 5);
  const weekend = byDay.slice(5);
  if (weekday.every((h) => h === weekday[0]) && weekend.every((h) => h === weekend[0])) {
    return `평일 ${weekday[0] || "휴무"} · 주말 ${weekend[0] || "휴무"}`;
  }
  return DAYS.map((d, i) => `${d} ${byDay[i] || "휴무"}`).join(" · ");
}

function normalize(row: RawRow, i: number): SharedOffice | null {
  const lat = Number(row["위도"]);
  const lng = Number(row["경도"]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat === 0) return null;

  const feeNum = Number(str(row["요금"]).replace(/[^\d]/g, ""));

  return {
    id: String(i),
    name: str(row["시설명"]),
    sido: str(row["시도 명칭"]),
    sigungu: str(row["시군구 명칭"]),
    address: str(row["도로명주소"]) || str(row["지번주소"]),
    lat,
    lng,
    fee: str(row["요금"]) && Number.isFinite(feeNum) ? feeNum : null,
    feeUnit: str(row["이용요금단위"]),
    capacity: str(row["수용인원"]),
    hours: summarizeHours(row),
    amenities: AMENITIES.filter(([col]) => str(row[col]).toUpperCase() === "Y").map(([, label]) => label),
  };
}

async function fetchPage(key: string, page: number, perPage: number) {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
    returnType: "JSON",
    serviceKey: key,
  });

  let body: { data?: RawRow[]; totalCount?: number; code?: number; msg?: string };
  try {
    // 캐시는 바깥의 unstable_cache 가 맡습니다. 실패 응답이 남지 않도록 매번 새로 받습니다
    const res = await fetch(`${BASE_URL}?${params}`, { cache: "no-store" });
    const text = await res.text();
    try {
      body = JSON.parse(text);
    } catch {
      // 인증키 오류 등은 JSON 이 아닌 글자로 오기도 합니다
      throw new Error(`공공데이터포털 응답을 읽지 못했습니다 (${res.status}): ${text.slice(0, 120)}`);
    }
    if (!res.ok || body.code) {
      throw new Error(`공공데이터포털 오류 ${body.code ?? res.status}: ${body.msg ?? "응답 코드 " + res.status}`);
    }
  } catch (e) {
    throw new Error(hideKey((e as Error).message, key));
  }
  return { rows: body.data ?? [], total: body.totalCount ?? 0 };
}

async function fetchSharedOfficesUncached(): Promise<SharedOfficeData> {
  const key = process.env.DATA_GO_KR_KEY?.trim() ?? "";
  if (!key) throw new Error("DATA_GO_KR_KEY 환경변수가 설정되지 않았습니다");

  // 전체가 1,000곳을 넘으면 다음 쪽을 이어서 받습니다
  const perPage = 1000;
  const first = await fetchPage(key, 1, perPage);
  const rows = [...first.rows];
  for (let page = 2; rows.length < first.total && page <= 10; page++) {
    rows.push(...(await fetchPage(key, page, perPage)).rows);
  }
  if (rows.length === 0) throw new Error("공유 오피스 데이터가 비어 있습니다");

  const offices = rows.map(normalize).filter((o): o is SharedOffice => o !== null);
  const writtenAt = rows.map((r) => str(r["최종작성일"])).sort().pop() ?? "";

  return { offices, places: groupPlaces(offices), writtenAt, source: SOURCE, fetchedAt: new Date().toISOString() };
}

/** 하루 동안 결과를 기억해 두는 조회 함수. 실패하면 기억하지 않고 다음 요청에서 다시 시도합니다 */
export const getSharedOffices = unstable_cache(fetchSharedOfficesUncached, ["shared-offices"], {
  revalidate: CACHE_SECONDS,
});

/** CSV 한 칸. 쉼표나 따옴표가 든 값은 따옴표로 감쌉니다 */
function cell(v: string | number | null) {
  const s = v === null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * 노션으로 가져가기 좋은 CSV. 한 줄 = 공유 오피스 한 곳.
 * 편의시설은 쉼표로 이어 한 칸에 넣습니다. 노션에서 다중 선택 속성으로 가져오면 태그로 나뉩니다.
 */
export function toCsv(places: OfficePlace[]) {
  const lines = ["이름,시도,시군구,주소,최저 요금,요금 단위,상품 수,운영시간,편의시설"];
  for (const p of places) {
    lines.push(
      [
        p.name,
        p.sido,
        p.sigungu,
        p.address,
        p.feeFrom?.fee ?? null,
        p.feeFrom?.unit ?? "",
        p.listings.length,
        p.hours,
        p.amenities.join(", "),
      ]
        .map(cell)
        .join(","),
    );
  }
  return "\uFEFF" + lines.join("\n");
}
