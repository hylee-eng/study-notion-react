import UiFrame from "../UiFrame";
import { Mark } from "./Mark";

/** STEP 3-① · 데이터베이스 보기 탭 옆 + 를 눌러 차트를 고르는 메뉴 */
const VIEWS = [
  { ico: "표", name: "표" },
  { ico: "보드", name: "보드" },
  { ico: "차트", name: "차트", on: true },
  { ico: "달력", name: "캘린더" },
  { ico: "목록", name: "리스트" },
];

export default function ChartAddView() {
  return (
    <UiFrame path="내 업무 홈 / 오피스 공실률">
      <div className="ui-title">오피스 공실률</div>
      <div className="ui-views mt-3">
        <span className="ui-view ui-view-on">표</span>
        <span className="ui-view ui-view-hit">＋</span>
        <Mark n={1} />
      </div>

      <div className="ui-menu">
        <div className="ui-menu-cap">보기 추가</div>
        {VIEWS.map((v) => (
          <div key={v.name} className={v.on ? "ui-item ui-item-on" : "ui-item"}>
            <span className="ui-ico">{v.ico}</span>
            <span className="ui-item-name">{v.name}</span>
            {v.on && <Mark n={2} />}
          </div>
        ))}
      </div>
    </UiFrame>
  );
}
