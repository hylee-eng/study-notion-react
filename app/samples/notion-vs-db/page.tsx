import Link from "next/link";
import type { Metadata } from "next";

import Section from "@/components/Section";
import ReactionButton from "@/components/ReactionButton";
import UiFrame from "@/components/screens/UiFrame";
import { getNotionDbData, shortDate, type DbTask, type NotionDbData } from "@/lib/notionDb";

/* ══════════════════════════════════════════════════════════
   /samples/notion-vs-db - 노션 DB를 진짜 DB로 옮기면.

   ① 라이브 데모: Supabase 에 넣어 둔 레벨 5 예시 데이터를
      노션식 표와 실제 DB 표로 나란히 보여줍니다.
   ② 노션 말과 DB 말 대응표
   ③ 내 노션에서 확인해 보기
   ④ 언제 노션으로 충분하고, 언제 DB가 필요한가
   ══════════════════════════════════════════════════════════ */

// 요청마다 화면을 새로 그립니다. Supabase 조회는 lib/notionDb.ts 에서 한 시간 캐시되고,
// 한 번 실패해도 다음 방문 때 바로 다시 시도하도록 하기 위해서입니다.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "노션 DB를 진짜 DB로 옮기면",
  description:
    "레벨 5의 프로젝트·업무 데이터베이스를 실제 데이터베이스와 나란히 놓고, 관계형과 롤업이 어떻게 저장되고 계산되는지 봅니다.",
};

const STATUS_TAG: Record<DbTask["status"], string> = {
  "할 일": "ui-tag-gray",
  "진행 중": "ui-tag-ochre",
  완료: "ui-tag-teal",
};

/** 노션 말 ↔ DB 말. "이 샘플에서" 칸은 위 라이브 데모에서 찾을 수 있는 예입니다 */
const GLOSSARY = [
  { notion: "데이터베이스", db: "테이블", here: "프로젝트 → projects, 업무 → tasks" },
  { notion: "속성", db: "열(컬럼)", here: "담당자 → owner, 마감일 → due" },
  { notion: "관계형", db: "연결 번호 열 (외래 키)", here: "업무의 \"프로젝트\" → tasks.project_id" },
  { notion: "롤업", db: "집계 보기 (뷰)", here: "개수 · 완료 비율 → project_summary" },
  { notion: "롤업이 비어 있음", db: "연결 번호가 빈 행", here: "성과 리뷰 미팅 → project_id 비어 있음" },
];

const ROLLUP_SQL = `select
  p.name as 프로젝트,
  count(t.id) as 업무_개수,
  완료인_업무 / 전체_업무 * 100 as 완료_비율,
  max(t.due) as 가장_늦은_마감일
from projects p
-- 관계형: 번호가 같은 것끼리 잇기
left join tasks t on t.project_id = p.id
-- 롤업: 프로젝트마다 묶어서 세기
group by p.name`;

export default async function NotionVsDbPage() {
  let data: NotionDbData | null = null;
  try {
    data = await getNotionDbData();
  } catch (e) {
    console.error("[samples/notion-vs-db]", (e as Error).message);
  }

  return (
    <>
      <Section>
        <div className="crumb">
          <Link href="/">홈</Link>
          <span className="crumb-sep">/</span>
          <Link href="/samples">샘플 갤러리</Link>
          <span className="crumb-sep">/</span>
          <span className="text-ink">노션 DB와 진짜 DB</span>
        </div>

        <div className="lv-hero bg-ochre mt-6">
          <span className="pill bg-cream text-ink">SAMPLE</span>
          <h1 className="t-h1 text-ink mt-6">
            노션 DB를 <br className="hidden md:block" />
            진짜 DB로 옮기면
          </h1>
          <p className="t-body text-ink op-76 mt-6 lede-560">
            레벨 5에서 만든 프로젝트와 업무를 실제 데이터베이스에 옮겼습니다. <br className="hidden md:block" />
            관계형과 롤업이 속에서는 어떻게 생겼는지 나란히 놓고 봅니다.
          </p>
          <div className="lv-hero-meta">
            <span className="pill bg-cream text-ink">따라 만들기 10분</span>
            <span className="pill bg-cream text-ink">관계형 · 롤업 · 데이터베이스 구조</span>
            <span className="pill bg-cream text-ink">레벨 5를 마친 분</span>
          </div>
        </div>
      </Section>

      {/* ── ① 라이브 데모 ── */}
      <Section id="demo" pad={false}>
        <span className="step-n">01 · 라이브 데모</span>
        <h2 className="t-h2 mt-3">같은 데이터, 두 가지 모습</h2>
        <p className="t-body text-muted mt-5 lede-560">
          왼쪽은 노션에서 보이는 모습, 오른쪽은 데이터베이스에 실제로 저장된 모습입니다. <br className="hidden md:block" />
          오른쪽 표는 Supabase에서 바로 읽어 온 값입니다.
        </p>

        {data ? <Demo data={data} /> : <NotConnected />}
      </Section>

      {/* ── ② 대응표 ── */}
      <Section id="glossary">
        <span className="step-n">02 · 말 바꿔 읽기</span>
        <h2 className="t-h2 mt-3">노션 말을 DB 말로</h2>
        <p className="t-body text-muted mt-5 lede-560">
          이름만 다를 뿐 같은 일을 합니다. <br className="hidden md:block" />
          개발자와 이야기할 때 이 표 한 장이면 대부분 통합니다.
        </p>

        <div className="ndb-gloss mt-10">
          <div className="ndb-gloss-row ndb-gloss-head">
            <span>노션</span>
            <span>데이터베이스</span>
            <span>이 샘플에서</span>
          </div>
          {GLOSSARY.map((g) => (
            <div key={g.notion} className="ndb-gloss-row">
              <span className="text-ink font-medium">{g.notion}</span>
              <span className="text-ink">{g.db}</span>
              <span className="text-muted">{g.here}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6">
          <div className="md:col-span-5">
            <h3 className="t-h3">롤업 설정은 이 몇 줄입니다</h3>
            <p className="t-body text-muted mt-3.5">
              노션에서 롤업 속성을 만들며 고르는 세 가지(어느 관계형으로, 무엇을, 어떻게 계산할지)가
              오른쪽 글에 그대로 들어 있습니다. 읽을 줄 몰라도 괜찮습니다. 노션이 이 일을 대신 해 준다는 것만 보면 됩니다. 완료 비율 줄은 읽기 쉽게 줄여 쓴 것이고, 실제로 실행하는 글은 저장소의 supabase/schema.sql 에 있습니다.
            </p>
          </div>
          <pre className="md:col-span-7 ndb-code">{ROLLUP_SQL}</pre>
        </div>
      </Section>

      {/* ── ③ 내 노션에서 확인하기 ── */}
      <Section id="build">
        <span className="step-n">03 · 내 노션에서 확인해 보기</span>
        <h2 className="t-h2 mt-3">레벨 5에서 만든 것을 다시 열어봅니다</h2>

        <div className="mt-10">
          <div className="step">
            <div className="step-n">STEP 1</div>
            <div>
              <h3 className="t-card-title text-ink">관계형이 양쪽에 보이는지 확인합니다</h3>
              <p className="t-body text-bodytext mt-2.5">
                업무 데이터베이스에서 프로젝트 속성을 열고, 프로젝트 데이터베이스에도 같은 관계가 보이는지 봅니다.
                DB로 치면 tasks 쪽에만 번호가 저장되고, 프로젝트 쪽 목록은 그 번호를 거꾸로 찾아 보여주는 것입니다.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-n">STEP 2</div>
            <div>
              <h3 className="t-card-title text-ink">연결 안 된 업무를 하나 찾습니다</h3>
              <p className="t-body text-bodytext mt-2.5">
                업무 표에 필터를 추가해 프로젝트가 비어 있는 줄만 봅니다. 이 줄들은 어느 롤업에도 세어지지 않습니다.
                위 데모의 성과 리뷰 미팅과 같은 상태입니다.
              </p>
              <div className="demo">
                <div className="demo-line">
                  <span className="kbd">필터</span>
                  <span className="to">&rarr;</span>
                  <span className="kbd">프로젝트</span>
                  <span className="to">&rarr;</span>
                  <span className="kbd kbd-solid">비어 있음</span>
                </div>
              </div>
            </div>
          </div>
          <div className="step">
            <div className="step-n">STEP 3</div>
            <div>
              <h3 className="t-card-title text-ink">연결하고 롤업 숫자가 바뀌는지 봅니다</h3>
              <p className="t-body text-bodytext mt-2.5">
                찾은 업무에 프로젝트를 지정하면, 프로젝트 쪽 개수와 완료 비율이 바로 바뀝니다.
                롤업은 저장된 숫자가 아니라 열 때마다 다시 세는 값이기 때문입니다. 위 SQL도 똑같이 동작합니다.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── ④ 언제 무엇을 ── */}
      <Section>
        <span className="step-n">04 · 언제 무엇을</span>
        <h2 className="t-h2 mt-3">대부분의 업무는 노션으로 충분합니다</h2>
        <p className="t-body text-muted mt-5 lede-560">
          진짜 DB가 더 좋은 도구라는 뜻이 아닙니다. <br className="hidden md:block" />
          쓰는 사람과 쓰는 방식이 다를 뿐입니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="tip">
            <div className="tip-mark">노션으로 충분할 때</div>
            <ul className="ndb-list mt-3">
              <li>사람이 직접 보고 고치는 목록 (업무, 회의록, 콘텐츠 기획)</li>
              <li>보기를 자주 바꿔 가며 쓰는 자료 (표 · 보드 · 캘린더)</li>
              <li>행이 수천 개 이하이고 팀 안에서만 쓰는 자료</li>
            </ul>
          </div>
          <div className="tip">
            <div className="tip-mark">진짜 DB를 고려할 때</div>
            <ul className="ndb-list mt-3">
              <li>다른 프로그램이 자동으로 읽고 써야 할 때 (웹사이트, 앱, 자동화)</li>
              <li>행이 수만 개 이상으로 늘어 노션이 느려질 때</li>
              <li>같은 표 안에서도 사람마다 볼 수 있는 행을 나눠야 할 때</li>
            </ul>
          </div>
        </div>
        <p className="t-cap text-muted mt-5">
          노션이 느려지는 행 수는 속성 수와 롤업·수식 개수에 따라 달라서 정해진 기준이 없습니다. 위 숫자는 대략적인 감입니다.
        </p>

        <div className="mt-12">
          <ReactionButton page="sample-notion-vs-db" />
        </div>

        <div className="mt-6">
          <Link href="/samples" className="btn btn-secondary">
            샘플 갤러리로 돌아가기
          </Link>
        </div>
      </Section>
    </>
  );
}

/** 노션 표 ↔ DB 표를 두 쌍으로 나란히 */
function Demo({ data }: { data: NotionDbData }) {
  const projectName = new Map(data.projects.map((p) => [p.id, p.name]));

  return (
    <div className="mt-10 flex flex-col gap-10">
      {/* 쌍 1 · 관계형 */}
      <div>
        <h3 className="t-card-title text-ink">관계형 · 업무마다 어느 프로젝트인지</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <div>
            <div className="t-cap text-muted mb-2">노션에서 보이는 모습</div>
            <UiFrame path="업무">
              <div className="ui-tb">
                <div className="ui-tr ndb-tr-task">
                  <div className="ui-th">업무</div>
                  <div className="ui-th">
                    <span className="ui-rollup">관계형</span>프로젝트
                  </div>
                  <div className="ui-th">상태</div>
                </div>
                {data.tasks.map((t) => (
                  <div key={t.id} className="ui-tr ndb-tr-task">
                    <div className="ui-td">{t.title}</div>
                    <div className="ui-td">
                      {t.project_id ? (
                        <span className="ndb-rel">{projectName.get(t.project_id)}</span>
                      ) : (
                        <span className="ndb-empty">비어 있음</span>
                      )}
                    </div>
                    <div className="ui-td">
                      <span className={`ui-tag ${STATUS_TAG[t.status]}`}>{t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </UiFrame>
          </div>

          <div>
            <div className="t-cap text-muted mb-2">DB에 저장된 모습 · tasks 테이블</div>
            <DbTable
              cols={["id", "title", "status", "project_id"]}
              rows={data.tasks.map((t) => [t.id, t.title, t.status, t.project_id])}
              highlight={3}
            />
            <div className="t-cap text-muted mt-5 mb-2">projects 테이블</div>
            <DbTable
              cols={["id", "name", "state"]}
              rows={data.projects.map((p) => [p.id, p.name, p.state])}
              highlight={0}
            />
            <p className="t-cap text-muted mt-3">
              노션의 프로젝트 이름 대신, DB에는 projects 의 id 번호만 적혀 있습니다. 번호가 같은 것끼리 이어 보면 왼쪽 표가 됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 쌍 2 · 롤업 */}
      <div>
        <h3 className="t-card-title text-ink">롤업 · 프로젝트마다 세어 보기</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <div>
            <div className="t-cap text-muted mb-2">노션에서 보이는 모습</div>
            <UiFrame path="프로젝트">
              <div className="ui-tb">
                <div className="ui-tr ui-tr-4">
                  <div className="ui-th">프로젝트</div>
                  <div className="ui-th">
                    <span className="ui-rollup">롤업</span>개수
                  </div>
                  <div className="ui-th">
                    <span className="ui-rollup">롤업</span>완료
                  </div>
                  <div className="ui-th">마감</div>
                </div>
                {data.summary.map((s) => (
                  <div key={s.id} className="ui-tr ui-tr-4">
                    <div className="ui-td">{s.name}</div>
                    <div className="ui-td ui-num">{s.task_count}건</div>
                    <div className="ui-td">
                      {s.done_rate === null ? (
                        <span className="ndb-empty">비어 있음</span>
                      ) : (
                        <>
                          <span className="ui-meter">
                            <i style={{ width: `${s.done_rate}%` }} />
                          </span>
                          <span className="ui-num">{s.done_rate}%</span>
                        </>
                      )}
                    </div>
                    <div className="ui-td ui-num">{shortDate(s.last_due)}</div>
                  </div>
                ))}
              </div>
            </UiFrame>
          </div>

          <div>
            <div className="t-cap text-muted mb-2">DB에서 계산한 모습 · project_summary 보기</div>
            <DbTable
              cols={["name", "task_count", "done_rate", "last_due"]}
              rows={data.summary.map((s) => [s.name, s.task_count, s.done_rate, s.last_due])}
            />
            <p className="t-cap text-muted mt-3">
              이 표는 저장된 것이 아니라 열 때마다 tasks 를 보고 다시 셉니다. 업무가 없는 신규 빌딩 오픈은 0건이고,
              프로젝트가 비어 있는 성과 리뷰 미팅은 어느 줄에도 세어지지 않았습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 실제 DB 표처럼 보이는 표. highlight 번째 열(연결 번호)을 강조합니다 */
function DbTable({
  cols,
  rows,
  highlight,
}: {
  cols: string[];
  rows: (string | number | null)[][];
  highlight?: number;
}) {
  return (
    <div className="ndb-table-wrap">
      <table className="ndb-table">
        <thead>
          <tr>
            {cols.map((c, i) => (
              <th key={c} className={i === highlight ? "ndb-hit" : undefined}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((v, i) => (
                <td key={i} className={i === highlight ? "ndb-hit" : undefined}>
                  {v === null ? <span className="ndb-null">NULL</span> : v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NotConnected() {
  return (
    <div className="vac-empty bg-soft mt-8" role="status">
      <p className="t-card-title text-ink">데이터베이스에 연결하지 못했습니다</p>
      <p className="t-body text-muted mt-2">
        Supabase 연결 정보가 없거나 잠시 응답하지 않습니다. 설정 방법은 README 의 &ldquo;Supabase&rdquo; 항목을 참고하세요.
      </p>
    </div>
  );
}
