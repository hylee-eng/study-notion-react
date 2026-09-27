import UiFrame from "../UiFrame";
import type { VacancyData } from "@/lib/rone";
import { REGION_TAG, FALLBACK_ROWS } from "./regionStyle";

/**
 * STEP 2-③ · 가져오기가 끝난 데이터베이스 표.
 * 라이브 데모와 같은 데이터로 그려, 받은 CSV 를 가져오면 실제로 이렇게 보인다는 것을 보여줍니다.
 */
export default function CsvResult({ data }: { data: VacancyData | null }) {
  const rows = data
    ? data.regions.map((r) => ({
        region: r.name,
        q: r.latest.label,
        v: r.latest.value.toFixed(2),
        d: r.change === null ? "" : r.change.toFixed(2),
      }))
    : FALLBACK_ROWS;

  return (
    <UiFrame path="내 업무 홈 / 오피스 공실률">
      <div className="ui-title">오피스 공실률</div>
      <div className="ui-views mt-3">
        <span className="ui-view ui-view-on">표</span>
        <span className="ui-view">＋</span>
      </div>

      <div className="tb-scroll">
        <div className="ui-tb ui-grid ui-csv">
          <div className="ui-tr ui-tr-csv">
            <div className="ui-th">Aa 이름</div>
            <div className="ui-th">권역</div>
            <div className="ui-th">분기</div>
            <div className="ui-th ui-right">공실률</div>
            <div className="ui-th ui-right">증감</div>
          </div>
          {rows.map((r) => (
            <div key={r.region} className="ui-tr ui-tr-csv">
              <div className="ui-td">
                {r.region} {r.q}
              </div>
              <div className="ui-td">
                <span className={`ui-tag ${REGION_TAG[r.region] ?? ""}`}>{r.region}</span>
              </div>
              <div className="ui-td">{r.q}</div>
              <div className="ui-td ui-num ui-right">{r.v}</div>
              <div className="ui-td ui-num ui-right">{r.d}</div>
            </div>
          ))}
        </div>
      </div>
    </UiFrame>
  );
}
