import { unstable_cache } from "next/cache";

import { readClient } from "@/lib/supabase";

/* ══════════════════════════════════════════════════════════
   샘플 "노션 DB를 진짜 DB로 옮기면" 의 데이터 조회. 서버에서만 실행됩니다.

   Supabase 의 표 두 개(projects · tasks)와 롤업에 해당하는 보기(project_summary)를
   그대로 읽어 옵니다. 표 구조와 예시 데이터는 supabase/schema.sql 에 있습니다.
   ══════════════════════════════════════════════════════════ */

export type DbProject = { id: number; name: string; state: string };

export type DbTask = {
  id: number;
  title: string;
  owner: string;
  /** 예: 2026-03-13 */
  due: string;
  status: "할 일" | "진행 중" | "완료";
  /** 노션의 관계형. 연결하지 않았으면 null */
  project_id: number | null;
};

export type DbSummary = {
  id: number;
  name: string;
  task_count: number;
  /** 연결된 업무가 없으면 null */
  done_rate: number | null;
  last_due: string | null;
};

export type NotionDbData = {
  projects: DbProject[];
  tasks: DbTask[];
  summary: DbSummary[];
};

/** 예시 데이터라 자주 바뀌지 않습니다. 한 시간에 한 번만 새로 읽습니다 */
const CACHE_SECONDS = 3600;

async function fetchUncached(): Promise<NotionDbData> {
  const db = readClient();
  if (!db) throw new Error("SUPABASE_URL · SUPABASE_PUBLISHABLE_KEY 환경변수가 설정되지 않았습니다");

  const [p, t, s] = await Promise.all([
    db.from("projects").select("id, name, state").order("id"),
    db.from("tasks").select("id, title, owner, due, status, project_id").order("id"),
    db.from("project_summary").select("id, name, task_count, done_rate, last_due").order("id"),
  ]);
  const error = p.error ?? t.error ?? s.error;
  if (error) throw new Error(error.message);

  return {
    projects: p.data as DbProject[],
    tasks: t.data as DbTask[],
    summary: s.data as DbSummary[],
  };
}

/** 실패하면 기억하지 않고 다음 요청에서 다시 시도합니다 */
export const getNotionDbData = unstable_cache(fetchUncached, ["notion-vs-db"], {
  revalidate: CACHE_SECONDS,
});

/** 2026-03-13 → 3월 13일 */
export function shortDate(iso: string | null) {
  if (!iso) return "";
  const [, m, d] = iso.split("-").map(Number);
  return `${m}월 ${d}일`;
}
