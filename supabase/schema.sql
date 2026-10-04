-- ══════════════════════════════════════════════════════════
-- Supabase 에 만드는 표와 접근 권한.
--
-- Supabase 대시보드 → SQL Editor 에 이 파일 전체를 붙여넣고 한 번 실행합니다.
-- 다시 실행해도 안전합니다(예시 데이터는 지우고 다시 넣습니다).
--
-- ① projects · tasks · project_summary : 샘플 "노션 DB를 진짜 DB로 옮기면" (/samples/notion-vs-db)
-- ② api_snapshots                       : 공공 API 가 멈췄을 때 보여줄 마지막 정상 데이터
-- ══════════════════════════════════════════════════════════

-- ── ① 샘플: 레벨 5 의 프로젝트 · 업무 ──────────────────────

-- 노션의 "프로젝트" 데이터베이스
create table if not exists public.projects (
  id    int primary key,
  name  text not null,
  state text not null
);

-- 노션의 "업무" 데이터베이스.
-- project_id 가 노션의 관계형 속성입니다. 어느 프로젝트에 속하는지 번호로 적어 둡니다.
create table if not exists public.tasks (
  id         int primary key,
  title      text not null,
  owner      text not null,
  due        date not null,
  status     text not null check (status in ('할 일', '진행 중', '완료')),
  project_id int references public.projects (id)
);

-- 노션의 롤업. 프로젝트마다 업무 개수 · 완료 비율 · 가장 늦은 마감일을 계산해 둔 "보기"입니다.
-- 표에 저장된 값이 아니라, 열 때마다 tasks 를 보고 다시 셉니다(노션 롤업과 같습니다).
create or replace view public.project_summary with (security_invoker = true) as
select
  p.id,
  p.name,
  count(t.id)                                                                  as task_count,
  round(100.0 * count(t.id) filter (where t.status = '완료') / nullif(count(t.id), 0)) as done_rate,
  max(t.due)                                                                   as last_due
from public.projects p
left join public.tasks t on t.project_id = p.id
group by p.id, p.name;

-- 예시 데이터 (레벨 5 · 관계형 비유 그림과 같은 내용)
delete from public.tasks;
delete from public.projects;

insert into public.projects (id, name, state) values
  (1, '3월 캠페인',   '진행 중'),
  (2, '상반기 결산',  '진행 중'),
  (3, '신규 빌딩 오픈', '준비');

insert into public.tasks (id, title, owner, due, status, project_id) values
  (1, '콘텐츠 기획안 초안', '이도윤', '2026-03-11', '진행 중', 1),
  (2, '촬영 일정 확정',     '박서연', '2026-03-13', '진행 중', 1),
  (3, '예산안 검토',        '최민준', '2026-03-17', '완료',    1),
  (4, '디자인 시안 공유',   '김하늘', '2026-03-19', '완료',    1),
  (5, '주간 회의록 정리',   '김하늘', '2026-03-09', '완료',    2),
  (6, '고객사 피드백 취합', '이도윤', '2026-03-20', '할 일',   2),
  (7, '최종 보고서 작성',   '박서연', '2026-03-24', '할 일',   2),
  -- 일부러 어느 프로젝트에도 연결하지 않은 업무. "롤업이 비어 있어요"를 보여주는 예시입니다
  (8, '성과 리뷰 미팅',     '최민준', '2026-03-26', '할 일',   null);

-- 방문자는 읽기만 합니다
alter table public.projects enable row level security;
alter table public.tasks    enable row level security;

drop policy if exists "누구나 읽기" on public.projects;
create policy "누구나 읽기" on public.projects for select to anon, authenticated using (true);

drop policy if exists "누구나 읽기" on public.tasks;
create policy "누구나 읽기" on public.tasks for select to anon, authenticated using (true);

-- ── ② 공공 API 백업 ────────────────────────────────────────

-- key 하나에 마지막 정상 응답 하나. 예: rone-office-vacancy, shared-offices
create table if not exists public.api_snapshots (
  key      text primary key,
  data     jsonb not null,
  saved_at timestamptz not null default now()
);

-- 정책을 만들지 않으므로 공개 키로는 읽지도 쓰지도 못합니다.
-- 서버가 비밀 키(SUPABASE_SECRET_KEY)로만 읽고 씁니다.
alter table public.api_snapshots enable row level security;

-- ── ③ "도움이 됐어요" 반응 ─────────────────────────────────

-- 버튼을 한 번 누를 때마다 한 줄. 페이지별 개수는 줄 수를 세서 구합니다.
-- 숫자 하나를 +1 하는 방식이 아니라서, 여러 사람이 동시에 눌러도 숫자가 꼬이지 않습니다.
-- 누가 눌렀는지는 저장하지 않습니다.
create table if not exists public.reactions (
  id         bigint generated always as identity primary key,
  page_key   text not null,          -- 예: level-3, sample-office-market
  created_at timestamptz not null default now()
);

create index if not exists reactions_page_key_idx on public.reactions (page_key);

-- api_snapshots 와 같이 정책을 만들지 않습니다. 서버가 비밀 키로만 읽고 씁니다.
alter table public.reactions enable row level security;
