import { getVacancy, toCsv } from "@/lib/rone";

/* ══════════════════════════════════════════════════════════
   /api/vacancy - 서울 오피스 권역별 공실률을 돌려주는 백엔드 주소.

   화면이 아니라 데이터만 돌려줍니다.
   - /api/vacancy            → JSON (다른 프로그램이 읽기 좋은 형식)
   - /api/vacancy?format=csv → CSV 파일 (노션·엑셀로 가져가기 좋은 형식)

   실제 조회와 하루 캐시는 lib/rone.ts 가 맡습니다.
   ══════════════════════════════════════════════════════════ */

// 주소 뒤의 ?format=csv 를 읽어야 하므로 요청마다 실행합니다.
// R-ONE 호출 자체는 lib/rone.ts 에서 하루 캐시되므로 부담이 없습니다.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const format = new URL(request.url).searchParams.get("format");

  try {
    const data = await getVacancy();

    if (format === "csv") {
      return new Response(toCsv(data), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="seoul-office-vacancy.csv"`,
        },
      });
    }

    return Response.json(data);
  } catch (e) {
    // detail 은 배포 후 원인을 찾기 위한 설명입니다. 키는 lib/rone.ts 에서 가려진 상태입니다
    console.error("[api/vacancy]", (e as Error).message);
    return Response.json(
      { error: "공실률 데이터를 불러오지 못했습니다", detail: (e as Error).message },
      { status: 502 },
    );
  }
}
