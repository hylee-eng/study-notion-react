import { unstable_cache } from "next/cache";

/* ══════════════════════════════════════════════════════════
   한국부동산원 R-ONE Open API 조회.

   서버에서만 실행됩니다. API 키(REB_API_KEY)를 읽는 곳이 여기 하나뿐이고,
   화면과 /api/vacancy 는 이 파일이 정리해 준 결과만 받아 씁니다.

   R-ONE 은 CORS(다른 사이트의 브라우저에서 직접 부르는 것)를 막아 두었고,
   키를 브라우저에 보내면 누구나 볼 수 있으므로 서버에서 대신 불러옵니다.
   ══════════════════════════════════════════════════════════ */

const BASE_URL = "https://www.reb.or.kr/r-one/openapi/SttsApiTblData.do";

/** 임대동향 지역별 공실률(2024년3분기~)_오피스 */
const STATBL_ID = "TT244763134428698";
/** 분기 */
const DTACYCLE_CD = "QY";
/** 공실률(%) - 이 통계표의 유일한 항목 */
const ITM_ID = "100001";

/** 카드로 보여줄 권역. R-ONE 권역 코드(CLS_ID)와 업계 약칭을 짝지어 둡니다. */
export const REGIONS = [
  { id: "500002", name: "서울 전체", alias: "SEOUL" },
  { id: "510003", name: "도심", alias: "CBD" },
  { id: "510004", name: "강남", alias: "GBD" },
  { id: "510005", name: "여의도마포", alias: "YBD" },
] as const;

export const SOURCE = "한국부동산원 상업용부동산 임대동향조사";

/** 분기 통계라 하루에 한 번만 새로 받아도 충분합니다 */
const CACHE_SECONDS = 86400;

export type QuarterValue = {
  /** R-ONE 시점 코드. 예: 202602 = 2026년 2분기 */
  period: string;
  /** 예: 2026년 2분기 */
  label: string;
  /** 공실률(%) */
  value: number;
  /** 직전 분기 대비 증감(%p). 첫 분기는 null */
  change: number | null;
};

export type RegionVacancy = {
  id: string;
  name: string;
  alias: string;
  latest: QuarterValue;
  previous: QuarterValue | null;
  /** 직전 분기 대비 증감(%p). 직전 분기가 없으면 null */
  change: number | null;
  /** 오래된 분기부터 최근 분기 순 */
  history: QuarterValue[];
};

export type VacancyData = {
  regions: RegionVacancy[];
  /** 가장 최근 기준 분기. 예: 2026년 2분기 */
  asOf: string;
  source: string;
  fetchedAt: string;
};

type RoneRow = {
  WRTTIME_IDTFR_ID: string;
  WRTTIME_DESC: string;
  DTA_VAL: number | null;
};

type RoneResult = { CODE: string; MESSAGE: string };

/** 에러 메시지에 키가 섞여 나가지 않도록 가립니다 */
function hideKey(text: string, key: string) {
  return key ? text.split(key).join("***") : text;
}

/** 소수 둘째 자리까지. 증감 계산에서 생기는 0.30000000004 같은 값을 정리합니다 */
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

async function fetchRegion(
  region: (typeof REGIONS)[number],
  key: string,
  startPeriod: string,
): Promise<RegionVacancy> {
  const params = new URLSearchParams({
    KEY: key,
    Type: "json",
    pSize: "100",
    STATBL_ID,
    DTACYCLE_CD,
    CLS_ID: region.id,
    ITM_ID,
    START_WRTTIME: startPeriod,
  });

  let body: {
    RESULT?: RoneResult;
    SttsApiTblData?: [{ head: [unknown, { RESULT: RoneResult }] }, { row: RoneRow[] }];
  };
  try {
    // 캐시는 바깥의 unstable_cache 가 맡습니다. 여기서까지 캐시하면
    // 실패 응답이 하루 동안 남을 수 있어 매번 새로 받게 둡니다.
    const res = await fetch(`${BASE_URL}?${params}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`R-ONE 응답 코드 ${res.status}`);
    body = await res.json();
  } catch (e) {
    throw new Error(hideKey(`R-ONE 연결 실패: ${(e as Error).message}`, key));
  }

  // R-ONE 은 키가 틀려도 200 으로 답하고, 본문의 RESULT 에 에러를 적습니다
  if (body.RESULT) {
    throw new Error(`R-ONE 오류 ${body.RESULT.CODE}: ${body.RESULT.MESSAGE}`);
  }

  const rows = (body.SttsApiTblData?.[1]?.row ?? []).filter(
    (r): r is RoneRow & { DTA_VAL: number } => typeof r.DTA_VAL === "number",
  );
  if (rows.length === 0) throw new Error(`${region.name} 권역 데이터가 비어 있습니다`);

  // 증감은 반올림 전 원본 값으로 계산합니다. 반올림한 값끼리 빼면 0.01 씩 어긋납니다
  const raw = [...rows].sort((a, b) => a.WRTTIME_IDTFR_ID.localeCompare(b.WRTTIME_IDTFR_ID));
  const history = raw.map((r, i) => ({
    period: r.WRTTIME_IDTFR_ID,
    label: r.WRTTIME_DESC,
    value: round2(r.DTA_VAL),
    change: i > 0 ? round2(r.DTA_VAL - raw[i - 1].DTA_VAL) : null,
  }));

  const latest = history[history.length - 1];
  const previous = history.length > 1 ? history[history.length - 2] : null;

  return {
    id: region.id,
    name: region.name,
    alias: region.alias,
    latest,
    previous,
    change: latest.change,
    history,
  };
}

async function fetchVacancyUncached(): Promise<VacancyData> {
  const key = process.env.REB_API_KEY?.trim() ?? "";
  if (!key) throw new Error("REB_API_KEY 환경변수가 설정되지 않았습니다");

  // 최근 3년치만 받습니다. 통계표가 쌓여도 응답 크기가 일정하게 유지됩니다.
  const startPeriod = `${new Date().getFullYear() - 3}01`;

  const regions = await Promise.all(REGIONS.map((r) => fetchRegion(r, key, startPeriod)));

  const newest = regions.reduce((a, b) => (a.latest.period >= b.latest.period ? a : b));

  return {
    regions,
    asOf: newest.latest.label,
    source: SOURCE,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * 하루 동안 결과를 기억해 두는 조회 함수.
 * 실패하면 에러를 던지는데, 던진 에러는 기억되지 않으므로
 * 다음 요청에서 바로 다시 시도합니다.
 */
export const getVacancy = unstable_cache(fetchVacancyUncached, ["rone-office-vacancy"], {
  revalidate: CACHE_SECONDS,
});

/**
 * 노션으로 가져가기 좋은 세로형 CSV. 한 줄 = 권역 하나의 분기 하나.
 * 노션은 CSV 첫 열을 페이지 제목으로 쓰므로 맨 앞에 "이름"을 둡니다.
 */
export function toCsv(data: VacancyData) {
  const lines = ["이름,권역,분기,공실률,증감"];
  for (const r of data.regions) {
    for (const q of r.history) {
      const diff = q.change === null ? "" : q.change.toFixed(2);
      lines.push([`${r.name} ${q.label}`, r.name, q.label, q.value.toFixed(2), diff].join(","));
    }
  }
  // 엑셀에서 열어도 한글이 깨지지 않도록 BOM 을 붙입니다
  return "﻿" + lines.join("\n");
}
