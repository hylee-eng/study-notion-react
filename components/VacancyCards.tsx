import type { VacancyData } from "@/lib/rone";

/**
 * 권역별 공실률 카드 묶음.
 *
 * 서버에서 받아 둔 데이터를 그리기만 합니다. R-ONE 을 직접 부르지 않으므로
 * 이 부품이 브라우저로 가도 API 키는 따라가지 않습니다.
 * data 가 null 이면 불러오기에 실패했다는 뜻이고, 안내 문구를 대신 보여줍니다.
 */
export default function VacancyCards({ data }: { data: VacancyData | null }) {
  if (!data) {
    return (
      <div className="vac-empty bg-soft mt-8" role="status">
        <p className="t-card-title text-ink">데이터를 불러오지 못했습니다</p>
        <p className="t-body text-muted mt-2">
          한국부동산원 서버에 연결하지 못했습니다. 잠시 뒤 새로고침해 주세요.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {data.regions.map((r) => (
          <article key={r.id} className="vac-card">
            <div className="flex items-center justify-between gap-2">
              <h3 className="t-card-title text-ink">{r.name}</h3>
              <span className="pill bg-cream text-ink">{r.alias}</span>
            </div>

            <div className="vac-body">
              <p className="vac-value text-ink mt-5">
                {r.latest.value.toFixed(2)}
                <span className="vac-unit">%</span>
              </p>
              <Change value={r.change} />
            </div>

            <p className="t-cap text-muted vac-foot">{r.latest.label} 기준</p>
          </article>
        ))}
      </div>

      <p className="t-cap text-muted mt-5">
        출처: {data.source} · 기준 분기 {data.asOf} · 증감은 직전 분기 대비
      </p>
    </>
  );
}

/** 공실률이 오르면 빈 사무실이 늘었다는 뜻이라 주의색, 내리면 차분한 색으로 표시합니다 */
function Change({ value }: { value: number | null }) {
  if (value === null) {
    return <p className="t-cap text-muted mt-2">직전 분기 자료 없음</p>;
  }
  if (value === 0) {
    return <p className="t-cap text-muted mt-2">직전 분기와 같음</p>;
  }

  const up = value > 0;
  return (
    <p className={`t-cap mt-2 ${up ? "vac-up" : "vac-down"}`}>
      {up ? "▲" : "▼"} {Math.abs(value).toFixed(2)}%p
      <span className="sr-only">{up ? " 상승" : " 하락"}</span>
    </p>
  );
}
