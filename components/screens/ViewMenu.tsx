import UiFrame from "./UiFrame";

/** 레벨 3 · 보기 추가 메뉴 */
const VIEWS = [
  { ico: "표", name: "표" },
  { ico: "보드", name: "보드", desc: "상태로 묶기", on: true },
  { ico: "달력", name: "캘린더", desc: "마감일 기준", on: true },
  { ico: "목록", name: "리스트" },
  { ico: "갤러리", name: "갤러리" },
];

export default function ViewMenu() {
  return (
    <UiFrame path="팀 업무 관리">
      <div className="ui-views">
        <span className="ui-view ui-view-on">표</span>
        <span className="ui-view">＋</span>
      </div>

      <div className="ui-menu">
        <div className="ui-menu-cap">보기 추가</div>
        {VIEWS.map((v) => (
          <div key={v.name} className={v.on ? "ui-item ui-item-on" : "ui-item"}>
            <span className="ui-ico">{v.ico}</span>
            <span className="ui-item-name">{v.name}</span>
            {v.desc && <span className="ui-item-desc">{v.desc}</span>}
          </div>
        ))}
      </div>
    </UiFrame>
  );
}
