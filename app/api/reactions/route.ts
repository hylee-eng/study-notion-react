import { REACTION_PAGES, NotConfiguredError, countReactions, addReaction } from "@/lib/reactions";

/* ══════════════════════════════════════════════════════════
   /api/reactions - "도움이 됐어요" 버튼의 백엔드 주소.

   - GET  /api/reactions?page=level-3      → { page, count }
   - POST /api/reactions  { "page": "level-3" } → 한 줄 추가 후 { page, count }

   브라우저는 Supabase 에 직접 가지 않고 항상 이 주소를 거칩니다(키 보호).
   실제 읽기·쓰기는 lib/reactions.ts 가 맡습니다.
   ══════════════════════════════════════════════════════════ */

// 누를 때마다 숫자가 바뀌어야 하므로 캐시하지 않습니다
export const dynamic = "force-dynamic";

function fail(e: unknown) {
  if (e instanceof NotConfiguredError) {
    return Response.json({ error: "데이터베이스가 연결되지 않았습니다" }, { status: 503 });
  }
  console.error("[api/reactions]", (e as Error).message);
  return Response.json({ error: "반응을 처리하지 못했습니다" }, { status: 502 });
}

function badPage() {
  return Response.json({ error: "알 수 없는 페이지입니다" }, { status: 400 });
}

export async function GET(request: Request) {
  const page = new URL(request.url).searchParams.get("page") ?? "";
  if (!REACTION_PAGES.has(page)) return badPage();

  try {
    return Response.json({ page, count: await countReactions(page) });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { page?: unknown } | null;
  const page = typeof body?.page === "string" ? body.page : "";
  if (!REACTION_PAGES.has(page)) return badPage();

  try {
    return Response.json({ page, count: await addReaction(page) });
  } catch (e) {
    return fail(e);
  }
}
