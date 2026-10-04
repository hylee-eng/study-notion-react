import Link from "next/link";
import type { Metadata } from "next";

import Section from "@/components/Section";
import ReactionButton from "@/components/ReactionButton";
import Shot from "@/components/Shot";
import CopyButton from "@/components/CopyButton";
import SharedOfficeExplorer from "@/components/SharedOfficeExplorer";
import { MarkLegend } from "@/components/screens/office/Mark";
import CsvSlash from "@/components/screens/office/CsvSlash";
import CsvMapping from "@/components/screens/office/CsvMapping";
import PlaceProperty from "@/components/screens/office/PlaceProperty";
import MapViewScreen from "@/components/screens/office/MapViewScreen";
import FilterScreen from "@/components/screens/office/FilterScreen";
import AiEntry from "@/components/screens/office/AiEntry";
import AiAsk from "@/components/screens/office/AiAsk";
import { getSharedOffices, filterOffices, type SharedOfficeData } from "@/lib/sharedOffice";
import { formatSnapshotDate } from "@/lib/snapshot";

/* ══════════════════════════════════════════════════════════
   /samples/shared-office - 전국 공유 오피스 지도 샘플.

   ① 라이브 데모: 서버에서 공유 오피스 목록을 받아 지도와 주소 목록으로 보여줍니다.
   ② 노션으로 직접 만들어보기: 같은 목록을 노션 DB → 지도 보기 → 필터로 옮기는 순서입니다.
   ══════════════════════════════════════════════════════════ */

// 요청마다 화면을 새로 그립니다. 조회는 lib/sharedOffice.ts 에서 하루 캐시되고,
// 실패해도 다음 방문 때 바로 다시 시도합니다.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "전국 공유 오피스 지도",
  description:
    "전국 공유 오피스가 어디에 있고 어떤 편의시설을 갖췄는지 지도와 목록으로 보고, 같은 목록을 노션 지도 보기로 만드는 방법을 따라 해봅니다.",
};

const PROMPTS = [
  "이 DB에서 주차와 샤워실이 모두 있는 곳을 골라, 월 요금이 낮은 순서로 3곳 추천해줘",
  "시군구별로 공유 오피스가 몇 곳인지 세고, 가장 많은 곳 3군데를 표로 정리해줘",
  "24시 운영하는 곳만 골라 이름, 주소, 요금을 표로 만들어줘. 요금 단위가 다른 곳은 따로 표시해줘",
];

/** 노션 화면 재현에 쓸 강남구 예시. 편의시설 필터(주차·샤워실)에 맞는 곳을 우선 고릅니다 */
function sampleRows(data: SharedOfficeData | null) {
  if (!data) return { points: [], rows: [] };
  const gangnam = filterOffices(data.places, { sido: "서울특별시", sigungu: "강남구" });
  const matched = filterOffices(gangnam, { amenities: ["주차", "샤워실"] });
  return {
    points: gangnam.slice(0, 60).map(({ lat, lng }) => ({ lat, lng })),
    rows: matched.slice(0, 3).map((o) => ({
      name: o.name,
      sigungu: o.sigungu,
      amenities: ["주차", "샤워실", ...o.amenities.filter((a) => a !== "주차" && a !== "샤워실").slice(0, 2)],
    })),
  };
}

export default async function SharedOfficePage() {
  let data: SharedOfficeData | null = null;
  try {
    data = await getSharedOffices();
  } catch (e) {
    console.error("[samples/shared-office]", (e as Error).message);
  }
  const sample = sampleRows(data);
  const writtenAt = data?.writtenAt.replace(/^(\d{4})-(\d{2}).*$/, "$1년 $2월") ?? "2022년 11월";

  return (
    <>
      <Section>
        <div className="crumb">
          <Link href="/">홈</Link>
          <span className="crumb-sep">/</span>
          <Link href="/samples">샘플 갤러리</Link>
          <span className="crumb-sep">/</span>
          <span className="text-ink">전국 공유 오피스</span>
        </div>

        <div className="lv-hero bg-peach mt-6">
          <span className="pill bg-cream text-ink">SAMPLE</span>
          <h1 className="t-h1 text-ink mt-6">
            전국 공유 오피스 <br className="hidden md:block" />
            지도
          </h1>
          <p className="t-body text-ink op-76 mt-6 lede-560">
            공유 오피스가 어디에 있고 어떤 편의시설을 갖췄는지 한눈에 봅니다. <br className="hidden md:block" />
            같은 목록을 노션 지도 보기로 만드는 방법까지 따라 해봅니다.
          </p>
          <div className="lv-hero-meta">
            <span className="pill bg-cream text-ink">따라 만들기 30분</span>
            <span className="pill bg-cream text-ink">다중 선택 · 지도 보기 · 필터 · 노션 AI</span>
            <span className="pill bg-cream text-ink">레벨 3을 마친 분</span>
          </div>
        </div>
      </Section>

      {/* ── ① 라이브 데모 ── */}
      <Section id="demo" pad={false}>
        <span className="step-n">01 · 라이브 데모</span>
        <h2 className="t-h2 mt-3">우리 동네 공유 오피스는 어디에 있을까</h2>
        <p className="t-body text-muted mt-5 lede-560">
          공공데이터포털 API에서 받아온 목록입니다. <br className="hidden md:block" />
          지역을 바꾸거나 편의시설로 걸러 보세요.
        </p>

        {data ? (
          <>
            <SharedOfficeExplorer offices={data.places} />
            <p className="t-cap text-muted mt-5">
              출처: {data.source} · {writtenAt} 작성 자료 · 같은 주소의 상품 {data.offices.length}건을 {data.places.length}곳으로 묶어 보여줍니다 · 지금은 운영하지 않는 곳이 있을 수 있습니다
              {data.snapshotAt && (
                <> · 지금 원본 API가 응답하지 않아 {formatSnapshotDate(data.snapshotAt)}에 저장해 둔 목록을 보여줍니다</>
              )}
            </p>
          </>
        ) : (
          <div className="vac-empty bg-soft mt-8" role="status">
            <p className="t-card-title text-ink">데이터를 불러오지 못했습니다</p>
            <p className="t-body text-muted mt-2">공공데이터포털 서버에 연결하지 못했습니다. 잠시 뒤 새로고침해 주세요.</p>
          </div>
        )}

        <div className="tip mt-8">
          <div className="tip-mark">노션과 다른 점</div>
          <p className="t-body text-bodytext mt-3">
            노션에서는 데이터를 직접 가져와야 하고, 이 페이지의 라이브 데모는 API로 자동 갱신됩니다.
            노션 지도 보기는 한 번에 100곳까지 보여주므로 구 단위로 나눠 가져가는 것이 좋습니다.
          </p>
        </div>
      </Section>

      {/* ── ② 노션으로 직접 만들어보기 ── */}
      <Section id="build">
        <span className="step-n">02 · 노션으로 직접 만들어보기</span>
        <h2 className="t-h2 mt-3">같은 지도를 노션에서</h2>
        <p className="t-body text-muted mt-5 lede-560">
          네 단계면 됩니다. <br className="hidden md:block" />
          주소가 있는 데이터라면 무엇이든 같은 방법으로 지도에 올릴 수 있습니다.
        </p>

        <div className="mt-12">
          <div className="step">
            <div className="step-n">STEP 1</div>
            <div>
              <h3 className="t-card-title text-ink">원하는 지역의 목록을 CSV로 받습니다</h3>
              <p className="t-body text-bodytext mt-2.5">
                위 라이브 데모에서 지역과 편의시설을 고른 뒤 <strong>이 목록 CSV 받기</strong>를 누르면,
                고른 조건 그대로 노션에 넣기 좋은 파일이 내려받아집니다. 한 줄이 공유 오피스 한 곳이고,
                노션 지도 보기는 100곳까지 보여주므로 구 단위로 받는 것을 권합니다.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <a href="#demo" className="btn btn-primary btn-sm">
                  라이브 데모로 가기
                </a>
                <a
                  href="https://www.data.go.kr/data/15111411/fileData.do"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  원본 데이터 보기
                </a>
              </div>
            </div>
          </div>

          <div className="step">
            <div className="step-n">STEP 2</div>
            <div>
              <h3 className="t-card-title text-ink">노션 DB로 가져옵니다</h3>
              <p className="t-body text-bodytext mt-2.5">
                공실률 샘플과 같은 방법입니다. 이번에는 편의시설을 <strong>다중 선택</strong>으로 가져오는 것이 핵심입니다.
                쉼표로 이어 둔 편의시설이 태그 여러 개로 나뉩니다.
              </p>

              <div className="ui-two">
                <div>
                  <Shot caption="사이드바의 설정 → 가져오기 → CSV로 들어가도 같은 창이 열립니다">
                    <CsvSlash title="강남 공유오피스" />
                  </Shot>
                </div>
                <div>
                  <Shot caption="주소는 일단 텍스트로 가져오고 STEP 3에서 장소로 바꿉니다">
                    <CsvMapping
                      file="shared-offices-서울특별시-강남구.csv"
                      markCol="편의시설"
                      columns={[
                        { col: "이름", type: "제목", fixed: true },
                        { col: "시군구", type: "선택" },
                        { col: "주소", type: "텍스트" },
                        { col: "요금", type: "숫자" },
                        { col: "편의시설", type: "다중 선택" },
                      ]}
                    />
                  </Shot>
                </div>
              </div>

              <MarkLegend
                items={[
                  "빈 페이지에 /csv 를 입력합니다",
                  "CSV 를 고르고, STEP 1에서 받은 파일을 선택합니다",
                  "새 데이터베이스 만들기를 고릅니다",
                  "편의시설은 다중 선택, 요금은 숫자로 바꾼 뒤 가져오기를 누릅니다",
                ]}
              />
            </div>
          </div>

          <div className="step">
            <div className="step-n">STEP 3</div>
            <div>
              <h3 className="t-card-title text-ink">주소를 장소로 바꾸고 지도 보기를 붙입니다</h3>
              <p className="t-body text-bodytext mt-2.5">
                노션 지도는 장소 속성에 든 주소로 핀을 찍습니다. 주소 열의 종류만 바꾸면 준비가 끝납니다.
              </p>

              <div className="ui-two">
                <div>
                  <Shot caption="핀이 안 보이는 곳은 주소가 정확한지 확인해 보세요">
                    <PlaceProperty />
                  </Shot>
                </div>
                <div>
                  <Shot caption="보기 탭 옆 + → 지도로 추가하거나, 페이지에 /map 을 입력해도 됩니다">
                    <MapViewScreen points={sample.points} />
                  </Shot>
                </div>
              </div>

              <MarkLegend
                items={[
                  "표에서 주소 열의 머리글을 누르고 속성 편집으로 들어갑니다",
                  "유형을 장소로 바꿉니다",
                  "보기 탭 옆 + 에서 지도를 추가합니다. 장소 속성이 여러 개면 레이아웃에서 지도 기준을 주소로 고릅니다",
                ]}
              />
            </div>
          </div>

          <div className="step">
            <div className="step-n">STEP 4</div>
            <div>
              <h3 className="t-card-title text-ink">필터와 노션 AI로 조건에 맞는 곳을 찾습니다</h3>
              <p className="t-body text-bodytext mt-2.5">
                다중 선택으로 가져온 편의시설 덕분에 &ldquo;주차도 되고 샤워실도 있는 곳&rdquo;처럼 조건을 겹쳐 걸 수
                있습니다. 필터는 표와 지도 보기 모두에 걸 수 있습니다.
              </p>

              <Shot caption="필터를 건 보기는 저장되므로 팀원도 같은 조건으로 볼 수 있습니다">
                <FilterScreen rows={sample.rows} />
              </Shot>

              <div className="ui-two">
                <div>
                  <Shot caption="맥 데스크톱 앱에서는 Cmd + Shift + J 로도 열립니다">
                    <AiEntry title="강남 공유오피스" />
                  </Shot>
                </div>
                <div>
                  <Shot caption="답변 내용은 데이터와 질문에 따라 달라집니다">
                    <AiAsk mention="강남 공유오피스" question={PROMPTS[0]} />
                  </Shot>
                </div>
              </div>

              <MarkLegend
                items={[
                  "보기 오른쪽 위의 필터를 누릅니다",
                  "편의시설 → 포함 → 주차를 고르고, 같은 방법으로 샤워실을 하나 더 추가합니다",
                  "노션 AI를 열고 @ 로 강남 공유오피스 데이터베이스를 지정한 뒤 아래 질문을 붙여 넣습니다",
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
        <ReactionButton page="sample-shared-office" />

        <div className="pager mt-6">
          <Link href="/samples" className="pager-card">
            <div className="t-cap text-muted">&larr; 목록으로</div>
            <div className="t-card-title text-ink mt-2">샘플 갤러리</div>
          </Link>
          <Link href="/samples/office-market" className="pager-card pager-r">
            <div className="t-cap text-muted">다른 샘플 &rarr;</div>
            <div className="t-card-title text-ink mt-2">서울 오피스 공실률 대시보드</div>
          </Link>
        </div>
      </Section>
    </>
  );
}
