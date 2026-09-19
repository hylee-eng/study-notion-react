import UiFrame from "./UiFrame";

/** 레벨 2 · 페이지 안에 페이지가 들어간 사이드바 */
const SUB = ["회의록", "진행 중 업무", "자료함"];

export default function SidebarTree() {
  return (
    <UiFrame path="사이드바">
      <div className="ui-tree-item ui-tree-on">
        <span className="ui-tw">▾</span>
        <span className="n-doc" />
        내 업무 홈
      </div>

      {SUB.map((name) => (
        <div key={name} className="ui-tree-item ui-tree-sub">
          <span className="n-doc" />
          {name}
        </div>
      ))}

      <div className="ui-tree-item">
        <span className="ui-tw">+</span>새 페이지
      </div>
    </UiFrame>
  );
}
