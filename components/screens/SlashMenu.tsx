import UiFrame from "./UiFrame";

/** 레벨 1 · 슬래시를 눌렀을 때 열리는 명령 목록 */
const ITEMS = [
  { ico: "Aa", name: "텍스트", desc: "일반 문단", on: true },
  { ico: "H1", name: "제목 1", desc: "가장 큰 제목" },
  { ico: "✓", name: "할 일 목록", desc: "체크박스" },
  { ico: "표", name: "표", desc: "데이터베이스" },
];

export default function SlashMenu() {
  return (
    <UiFrame path="내 업무 홈 / 연습장">
      <div className="ui-title">연습장</div>

      <div className="ui-line">
        <span className="ui-slash">/</span>
        <span className="ui-caret" />
      </div>

      <div className="ui-menu">
        <div className="ui-menu-cap">기본 블록</div>
        {ITEMS.map((item) => (
          <div key={item.name} className={item.on ? "ui-item ui-item-on" : "ui-item"}>
            <span className="ui-ico">{item.ico}</span>
            <span className="ui-item-name">{item.name}</span>
            <span className="ui-item-desc">{item.desc}</span>
          </div>
        ))}
      </div>
    </UiFrame>
  );
}
