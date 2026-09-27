import Link from "next/link";
import type { Metadata } from "next";

import Section from "@/components/Section";
import VacancyCards from "@/components/VacancyCards";
import CopyButton from "@/components/CopyButton";
import Shot from "@/components/Shot";
import { MarkLegend } from "@/components/screens/office/Mark";
import CsvSlash from "@/components/screens/office/CsvSlash";
import CsvMapping from "@/components/screens/office/CsvMapping";
import CsvResult from "@/components/screens/office/CsvResult";
import ChartAddView from "@/components/screens/office/ChartAddView";
import ChartSetup from "@/components/screens/office/ChartSetup";
import AiEntry from "@/components/screens/office/AiEntry";
import AiAsk from "@/components/screens/office/AiAsk";
import { getVacancy, type VacancyData } from "@/lib/rone";

/* ══════════════════════════════════════════════════════════
   /samples/office-market - 서울 오피스 공실률 샘플.

   ① 라이브 데모: 서버에서 R-ONE 공실률을 받아 카드로 보여줍니다.
   ② 노션으로 직접 만들어보기: 같은 데이터를 노션 DB로 옮기는 순서입니다.
   ══════════════════════════════════════════════════════════ */

// 요청마다 화면을 새로 그립니다. R-ONE 호출은 lib/rone.ts 에서 하루 캐시되고,
// 한 번 실패해도 다음 방문 때 바로 다시 시도하도록 하기 위해서입니다.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "서울 오피스 공실률 대시보드",
  description:
    "도심·강남·여의도마포 권역의 최근 오피스 공실률을 한눈에 보고, 같은 데이터를 노션 DB와 차트로 만드는 방법을 따라 해봅니다.",
};

const PROMPTS = [
  "이 DB에서 최근 분기 공실률이 가장 높은 권역 3곳과 변화 추이를 요약해줘",
  "도심·강남·여의도마포 권역의 공실률을 분기별로 비교하고, 직전 분기보다 오른 권역만 골라 이유를 추정할 때 확인할 점을 알려줘",
  "이 DB를 바탕으로 팀 공유용 3줄 요약을 써줘. 숫자는 소수 첫째 자리까지, 증감은 %p로 표기해줘",
];

export default async function OfficeMarketPage() {
  let data: VacancyData | null = null;
  try {
    data = await getVacancy();
  } catch (e) {
    console.error("[samples/office-market]", (e as Error).message);
  }

  return (
    <>
      <Section>
        <div className="crumb">
          <Link href="/">홈</Link>
          <span className="crumb-sep">/</span>
          <Link href="/samples">샘플 갤러리</Link>
          <span className="crumb-sep">/</span>
          <span className="text-ink">서울 오피스 공실률</span>
        </div>

        <div className="lv-hero bg-lavender mt-6">
          <span className="pill bg-cream text-ink">SAMPLE</span>
          <h1 className="t-h1 text-ink mt-6">
            서울 오피스 <br className="hidden md:block" />
            공실률 대시보드
          </h1>
          <p className="t-body text-ink op-76 mt-6 lede-560">
            빌딩 영업과 매체 기획에서 자주 찾는 권역별 공실률입니다. <br className="hidden md:block" />
            완성본을 먼저 보고, 노션에서 같은 대시보드를 만들어 봅니다.
          </p>
          <div className="lv-hero-meta">
            <span className="pill bg-cream text-ink">따라 만들기 30분</span>
            <span className="pill bg-cream text-ink">데이터베이스 · 차트 보기 · 노션 AI</span>
            <span className="pill bg-cream text-ink">레벨 3을 마친 분</span>
          </div>
        </div>
      </Section>

      {/* ── ① 라이브 데모 ── */}
      <Section id="demo" pad={false}>
        <span className="step-n">01 · 라이브 데모</span>
        <h2 className="t-h2 mt-3">지금 서울 오피스는 얼마나 비어 있을까</h2>
        <p className="t-body text-muted mt-5 lede-560">
          한국부동산원 API에서 바로 받아온 값입니다. <br className="hidden md:block" />
          새 분기 통계가 나오면 이 화면도 저절로 바뀝니다.
        </p>

        <VacancyCards data={data} />

        <div className="tip mt-8">
          <div className="tip-mark">노션과 다른 점</div>
          <p className="t-body text-bodytext mt-3">
            노션에서는 데이터를 직접 가져와야 하고, 이 페이지의 라이브 데모는 API로 자동 갱신됩니다.
          </p>
        </div>
      </Section>

      {/* ── ② 노션으로 직접 만들어보기 ── */}
      <Section id="build">
        <span className="step-n">02 · 노션으로 직접 만들어보기</span>
        <h2 className="t-h2 mt-3">같은 대시보드를 노션에서</h2>
        <p className="t-body text-muted mt-5 lede-560">
          네 단계면 됩니다. <br className="hidden md:block" />
          마지막 단계에서는 노션 AI에게 요약을 맡겨 봅니다.
        </p>

        <div className="mt-12">
          <div className="step">
            <div className="step-n">STEP 1</div>
            <div>
              <h3 className="t-card-title text-ink">R-ONE에서 데이터를 CSV로 받습니다</h3>
              <p className="t-body text-bodytext mt-2.5">
                한국부동산원 부동산통계뷰어(R-ONE)에서 통계표를 검색해 내려받습니다.
              </p>
              <div className="demo">
                <div className="demo-line">
                  <span className="kbd">R-ONE 접속</span>
                  <span className="to">&rarr;</span>
                  <span className="kbd">&ldquo;지역별 공실률 오피스&rdquo; 검색</span>
                  <span className="to">&rarr;</span>
                  <span className="kbd kbd-wrap">임대동향 지역별 공실률(2024년3분기~)_오피스</span>
                </div>
                <div className="demo-line">
                  <span className="kbd kbd-wrap">지역: 서울 · 도심 · 강남 · 여의도마포</span>
                  <span className="to">&rarr;</span>
                  <span className="kbd kbd-solid">다운로드 (CSV)</span>
                </div>
              </div>
              <p className="t-body text-muted mt-4">
                R-ONE 원본은 분기가 가로로 늘어선 표라 노션에 넣기 전에 정리가 필요합니다.
                바로 가져갈 수 있게 한 줄에 한 분기씩 정리한 파일도 준비했습니다.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <a href="https://www.reb.or.kr/r-one/" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  R-ONE 열기
                </a>
                <a href="/api/vacancy?format=csv" className="btn btn-primary btn-sm" download>
                  정리된 CSV 받기
                </a>
              </div>
            </div>
          </div>

          <div className="step">
            <div className="step-n">STEP 2</div>
            <div>
              <h3 className="t-card-title text-ink">노션 DB로 가져옵니다</h3>
              <p className="t-body text-bodytext mt-2.5">
                빈 페이지에서 CSV 파일을 불러오면 표 형태의 데이터베이스가 만들어집니다.
                가져오는 창에서 열마다 속성 종류를 정해 두면 뒤에서 고칠 일이 없습니다.
              </p>

              <div className="ui-two">
                <div>
                  <Shot caption="사이드바의 설정 → 가져오기 → CSV로 들어가도 같은 창이 열립니다">
                    <CsvSlash />
                  </Shot>
                </div>
                <div>
                  <Shot caption="이름 열은 자동으로 제목이 됩니다. 나머지 열의 종류만 고릅니다">
                    <CsvMapping />
                  </Shot>
                </div>
              </div>

              <MarkLegend
                items={[
                  "빈 페이지에 /csv 를 입력합니다",
                  "CSV 를 고르고, STEP 1에서 받은 파일을 선택합니다",
                  "새 데이터베이스 만들기를 고릅니다",
                  "권역은 선택, 공실률과 증감은 숫자로 바꾼 뒤 가져오기를 누릅니다",
                ]}
              />

              <Shot caption="가져오기가 끝난 모습입니다. 권역이 선택 속성이라 색 태그로 보입니다">
                <CsvResult data={data} />
              </Shot>
            </div>
          </div>

          <div className="step">
            <div className="step-n">STEP 3</div>
            <div>
              <h3 className="t-card-title text-ink">차트 보기로 권역별 추이를 그립니다</h3>
              <p className="t-body text-bodytext mt-2.5">
                같은 데이터에 보기만 하나 더 붙이는 것이라 원래 표는 그대로 남습니다.
              </p>

              <div className="ui-two">
                <div>
                  <Shot caption="보기 이름은 나중에 '권역별 추이'처럼 바꿔 두면 찾기 쉽습니다">
                    <ChartAddView />
                  </Shot>
                </div>
                <div>
                  <MarkLegend
                    items={["보기 탭 옆의 + 를 누릅니다", "목록에서 차트를 고릅니다"]}
                  />
                </div>
              </div>

              <Shot caption="설정 패널에서 번호 순서대로 고르면 이 차트가 됩니다">
                <ChartSetup data={data} />
              </Shot>

              <MarkLegend
                items={[
                  "차트 유형에서 선을 고릅니다",
                  "X축의 표시할 항목을 분기로, 정렬을 오름차순으로 둡니다",
                  "Y축의 표시할 항목을 공실률로 고르고 계산 방식은 평균으로 둡니다",
                  "그룹화 기준을 권역으로 고르면 권역마다 선이 하나씩 생깁니다",
                ]}
              />
            </div>
          </div>

          <div className="step">
            <div className="step-n">STEP 4</div>
            <div>
              <h3 className="t-card-title text-ink">노션 AI에게 요약을 맡깁니다</h3>
              <p className="t-body text-bodytext mt-2.5">
                노션 AI는 두 곳에서 열 수 있습니다. 질문할 때 @ 로 데이터베이스를 지정하면
                그 데이터만 보고 답합니다.
              </p>

              <div className="ui-two">
                <div>
                  <Shot caption="맥 데스크톱 앱에서는 Cmd + Shift + J 로도 열립니다">
                    <AiEntry />
                  </Shot>
                </div>
                <div>
                  <Shot caption="답변 내용은 데이터와 질문에 따라 달라집니다">
                    <AiAsk />
                  </Shot>
                </div>
              </div>

              <MarkLegend
                items={[
                  "페이지 오른쪽 아래의 얼굴 모양 아이콘을 누릅니다",
                  "또는 왼쪽 사이드바의 Notion AI 를 누릅니다",
                  "입력창에 @ 를 치고 오피스 공실률 데이터베이스를 고릅니다",
                  "아래 질문을 붙여 넣고 보냅니다",
                ]}
              />

              <div className="prompt-box">
                <div className="prompt-head">
                  <span className="pill bg-cream text-ink">복사해서 쓰는 질문</span>
                  <span className="t-cap text-white op-78">노션 AI 입력창에 그대로 붙여 넣으세요</span>
                </div>
                {PROMPTS.map((prompt, i) => (
                  <div key={prompt} className="prompt-card">
                    <span className="prompt-n">질문 {i + 1}</span>
                    <p className="prompt-text">{prompt}</p>
                    <CopyButton text={prompt} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="pager">
          <Link href="/samples" className="pager-card">
            <div className="t-cap text-muted">&larr; 목록으로</div>
            <div className="t-card-title text-ink mt-2">샘플 갤러리</div>
          </Link>
          <Link href="/level/3" className="pager-card pager-r">
            <div className="t-cap text-muted">데이터베이스가 낯설다면 &rarr;</div>
            <div className="t-card-title text-ink mt-2">레벨 3 · 데이터베이스라는 발상</div>
          </Link>
        </div>
      </Section>
    </>
  );
}
