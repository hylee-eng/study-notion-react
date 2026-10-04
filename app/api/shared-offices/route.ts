import { getSharedOffices, filterOffices, toCsv } from "@/lib/sharedOffice";

/* ══════════════════════════════════════════════════════════
   /api/shared-offices - 전국 공유 오피스 목록을 돌려주는 백엔드 주소.

   - /api/shared-offices                              → 전국 JSON (같은 주소의 상품은 한 곳으로 묶음)
   - /api/shared-offices?sido=서울특별시&sigungu=강남구 → 지역만 골라서
   - &amenity=주차&amenity=샤워실                      → 편의시설이 모두 있는 곳만
   - &format=csv                                      → 노션용 CSV 파일

   실제 조회와 하루 캐시는 lib/sharedOffice.ts 가 맡습니다.
   ══════════════════════════════════════════════════════════ */

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  const filter = {
    sido: q.get("sido") ?? undefined,
    sigungu: q.get("sigungu") ?? undefined,
    amenities: q.getAll("amenity"),
  };

  try {
    const data = await getSharedOffices();
    const places = filterOffices(data.places, filter);

    if (q.get("format") === "csv") {
      const name = ["shared-offices", filter.sido, filter.sigungu].filter(Boolean).join("-");
      return new Response(toCsv(places), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          // 한글 파일 이름은 filename* 으로 따로 알려야 깨지지 않습니다
          "Content-Disposition": `attachment; filename="shared-offices.csv"; filename*=UTF-8''${encodeURIComponent(name)}.csv`,
        },
      });
    }

    return Response.json({
      count: places.length,
      listingCount: places.reduce((n, p) => n + p.listings.length, 0),
      writtenAt: data.writtenAt,
      source: data.source,
      // 원본 API 가 멈춰 저장본을 돌려줄 때만 들어갑니다
      snapshotAt: data.snapshotAt,
      places,
    });
  } catch (e) {
    // detail 은 배포 후 원인을 찾기 위한 설명입니다. 키는 lib/sharedOffice.ts 에서 가려진 상태입니다
    console.error("[api/shared-offices]", (e as Error).message);
    return Response.json(
      { error: "공유 오피스 데이터를 불러오지 못했습니다", detail: (e as Error).message },
      { status: 502 },
    );
  }
}
