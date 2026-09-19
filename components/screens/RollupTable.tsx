import UiFrame from "./UiFrame";

/** 레벨 5 · 롤업으로 건수와 완료율이 계산된 프로젝트 표 */
const PROJECTS = [
  { name: "3월 캠페인", count: "5건", done: 60, due: "3월 20일" },
  { name: "상반기 결산", count: "3건", done: 33, due: "3월 26일" },
  { name: "신규 제안", count: "2건", done: 0, due: "4월 3일" },
];

export default function RollupTable() {
  return (
    <UiFrame path="프로젝트">
      <div className="ui-tb">
        <div className="ui-tr ui-tr-4">
          <div className="ui-th">
            <span className="n-ico-title">Aa</span>프로젝트
          </div>
          <div className="ui-th">
            <span className="ui-rollup">롤업</span>
          </div>
          <div className="ui-th">
            <span className="ui-rollup">롤업</span>
          </div>
          <div className="ui-th">기간</div>
        </div>

        {PROJECTS.map((p) => (
          <div key={p.name} className="ui-tr ui-tr-4">
            <div className="ui-td">{p.name}</div>
            <div className="ui-td ui-num">{p.count}</div>
            <div className="ui-td">
              <span className="ui-meter">
                <i style={{ width: `${p.done}%` }} />
              </span>
              <span className="ui-num">{p.done}%</span>
            </div>
            <div className="ui-td ui-num">{p.due}</div>
          </div>
        ))}
      </div>
    </UiFrame>
  );
}
