import { secretClient } from "@/lib/supabase";
import { LEVELS } from "@/data/levels";
import { SAMPLES } from "@/data/samples";

/* ══════════════════════════════════════════════════════════
   "도움이 됐어요" 반응. 서버에서만 실행됩니다.

   버튼을 누를 때마다 reactions 표에 한 줄을 더하고, 페이지별 줄 수를 세어 돌려줍니다.
   누가 눌렀는지는 저장하지 않습니다. 표 구조는 supabase/schema.sql ③ 에 있습니다.
   ══════════════════════════════════════════════════════════ */

/** 반응을 받을 수 있는 페이지. 이 목록에 없는 이름은 저장하지 않습니다 */
export const REACTION_PAGES = new Set([
  ...LEVELS.map((l) => `level-${l.n}`),
  ...SAMPLES.map((s) => `sample-${s.slug}`),
]);

export class NotConfiguredError extends Error {}

function client() {
  const db = secretClient();
  if (!db) throw new NotConfiguredError("SUPABASE_URL · SUPABASE_SECRET_KEY 환경변수가 설정되지 않았습니다");
  return db;
}

/** 페이지의 반응 개수 */
export async function countReactions(pageKey: string) {
  // head: true 는 줄 내용은 받지 않고 개수만 받는다는 뜻입니다
  const { count, error } = await client()
    .from("reactions")
    .select("id", { count: "exact", head: true })
    .eq("page_key", pageKey);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

/** 반응 한 줄을 더하고 새 개수를 돌려줍니다 */
export async function addReaction(pageKey: string) {
  const { error } = await client().from("reactions").insert({ page_key: pageKey });
  if (error) throw new Error(error.message);
  return countReactions(pageKey);
}
