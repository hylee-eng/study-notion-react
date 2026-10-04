import { secretClient } from "@/lib/supabase";

/* ══════════════════════════════════════════════════════════
   공공 API 백업 - 마지막 정상 응답을 Supabase 에 저장해 두고,
   원본 API 가 멈추면 그것을 대신 돌려줍니다.

   저장은 하루 캐시가 비었을 때(하루 한 번)만 일어나므로 부담이 없습니다.
   Supabase 설정이 없거나 Supabase 자체가 실패해도 원래 동작을 막지 않습니다.
   ══════════════════════════════════════════════════════════ */

/** 정상 응답을 저장합니다. 실패해도 에러를 던지지 않습니다 */
export async function saveSnapshot(key: string, data: unknown) {
  const db = secretClient();
  if (!db) return;
  const { error } = await db
    .from("api_snapshots")
    .upsert({ key, data, saved_at: new Date().toISOString() });
  if (error) console.error(`[snapshot] ${key} 저장 실패:`, error.message);
}

/** 저장해 둔 응답과 저장 시각. 없으면 null */
export async function loadSnapshot<T>(key: string): Promise<{ data: T; savedAt: string } | null> {
  const db = secretClient();
  if (!db) return null;
  const { data, error } = await db
    .from("api_snapshots")
    .select("data, saved_at")
    .eq("key", key)
    .maybeSingle();
  if (error) console.error(`[snapshot] ${key} 불러오기 실패:`, error.message);
  return data ? { data: data.data as T, savedAt: data.saved_at as string } : null;
}

/**
 * 하루 캐시된 조회 함수를 감싸, 실패하면 저장본으로 대신합니다.
 * 저장본도 없으면 원래 에러를 그대로 던집니다(지금까지와 같은 오류 화면).
 * 저장본을 쓴 경우 snapshotAt 에 저장 시각이 붙습니다.
 */
export function withSnapshot<T extends object>(key: string, fetcher: () => Promise<T>) {
  return async (): Promise<T & { snapshotAt?: string }> => {
    try {
      return await fetcher();
    } catch (e) {
      const saved = await loadSnapshot<T>(key);
      if (!saved) throw e;
      console.error(`[snapshot] ${key} 원본 실패, 저장본 사용:`, (e as Error).message);
      return { ...saved.data, snapshotAt: saved.savedAt };
    }
  };
}

/** 저장 시각을 화면용으로. 예: 2026년 9월 29일 */
export function formatSnapshotDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "long", timeZone: "Asia/Seoul" }).format(d);
}
