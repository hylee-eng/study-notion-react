import UiFrame from "../UiFrame";
import { Mark } from "./Mark";

/** 공유 오피스 STEP 4-① · 편의시설 필터를 건 표. 태그 칸에서 조건에 맞는 것만 남은 모습 */
export default function FilterScreen({
  rows,
}: {
  rows: { name: string; sigungu: string; amenities: string[] }[];
}) {
  return (
    <UiFrame path="내 업무 홈 / 강남 공유오피스">
      <div className="ui-views">
        <span className="ui-view ui-view-on">표</span>
        <span className="ui-view">지도</span>
        <span className="ui-tool push-right">
          필터 <Mark n={1} />
        </span>
      </div>

      <div className="ui-filters">
        <span className="ui-filter">
          편의시설: 주차 포함 <span className="ui-chev">▼</span>
        </span>
        <span className="ui-filter">
          편의시설: 샤워실 포함 <span className="ui-chev">▼</span>
        </span>
        <Mark n={2} />
      </div>

      <div className="tb-scroll">
        <div className="ui-tb ui-grid ui-csv">
          <div className="ui-tr ui-tr-filter">
            <div className="ui-th">Aa 이름</div>
            <div className="ui-th">시군구</div>
            <div className="ui-th">편의시설</div>
          </div>
          {rows.map((r) => (
            <div key={r.name} className="ui-tr ui-tr-filter">
              <div className="ui-td">{r.name}</div>
              <div className="ui-td">
                <span className="ui-tag ui-tag-gray">{r.sigungu}</span>
              </div>
              <div className="ui-td ui-tags">
                {r.amenities.map((a) => (
                  <span key={a} className={a === "주차" || a === "샤워실" ? "ui-tag ui-tag-pink" : "ui-tag ui-tag-gray"}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </UiFrame>
  );
}
