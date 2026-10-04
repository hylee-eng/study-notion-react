import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* ══════════════════════════════════════════════════════════
   Supabase 연결. 서버에서만 실행됩니다.

   키를 읽는 곳이 여기 하나뿐이고, 키는 브라우저로 보내지 않습니다
   (lib/rone.ts 의 REB_API_KEY 와 같은 방식).
   - SUPABASE_PUBLISHABLE_KEY : 샘플 데이터 읽기용. 표마다 정한 권한(RLS) 안에서만 읽힙니다
   - SUPABASE_SECRET_KEY      : 공공 API 백업을 쓰고 읽는 용도. 권한 규칙을 건너뛰므로 서버 밖으로 내보내지 않습니다

   .env.local 에 값이 없으면 null 을 돌려주고, 쓰는 쪽은 기능만 끕니다.
   ══════════════════════════════════════════════════════════ */

const URL = process.env.SUPABASE_URL?.trim() ?? "";

function make(key: string | undefined): SupabaseClient | null {
  const k = key?.trim();
  if (!URL || !k) return null;
  // 서버에서 한 번 쓰고 버리는 연결이라 로그인 세션을 저장하지 않습니다
  return createClient(URL, k, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** 샘플 데이터 읽기용 연결. 설정이 없으면 null */
export function readClient() {
  return make(process.env.SUPABASE_PUBLISHABLE_KEY);
}

/** 공공 API 백업용 연결. 설정이 없으면 null */
export function secretClient() {
  return make(process.env.SUPABASE_SECRET_KEY);
}
