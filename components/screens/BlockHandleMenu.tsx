import UiFrame from "./UiFrame";

/** 레벨 1 · 블록 손잡이를 눌렀을 때 열리는 메뉴 */
const MENU = [
  { name: "삭제", desc: "Del", on: true },
  { name: "복제", desc: "Ctrl + D" },
  { name: "다른 블록으로 전환", desc: "제목 · 목록 등" },
  { name: "위로 옮기기", desc: "Ctrl + Shift + 위" },
];

export default function BlockHandleMenu() {
  return (
    <UiFrame path="내 업무 홈 / 연습장">
      <div className="ui-title">연습장</div>

      <div className="mt-4">
        <div className="ui-blk">
          <span className="ui-bul" />
          오늘 정리할 것
        </div>
        <div className="ui-blk ui-blk-on">
          <span className="ui-handle">
            <i /><i /><i /><i /><i /><i />
          </span>
          주간 회의 안건
        </div>
        <div className="ui-blk">
          <span className="ui-bul" />
          다음 주 일정
        </div>
      </div>

      <div className="ui-menu">
        {MENU.map((item) => (
          <div key={item.name} className={item.on ? "ui-item ui-item-on" : "ui-item"}>
            <span className="ui-item-name">{item.name}</span>
            <span className="ui-item-desc">{item.desc}</span>
          </div>
        ))}
      </div>
    </UiFrame>
  );
}
