import UiFrame from "./UiFrame";

/** 레벨 4 · 공유 권한 등급 드롭다운 */
const PEOPLE = [
  { initial: "김", name: "김하늘", avatar: "av-1", role: "편집 허용", open: true },
  { initial: "이", name: "이도윤", avatar: "av-2", role: "댓글 허용" },
];

const ROLES = [
  { name: "전체 허용", desc: "수정 + 초대" },
  { name: "편집 허용", desc: "수정만", on: true },
  { name: "댓글 허용", desc: "읽기 + 의견" },
  { name: "읽기 허용", desc: "보기만" },
];

export default function SharePermissions() {
  return (
    <UiFrame path="공유">
      {PEOPLE.map((p) => (
        <div key={p.name} className="ui-person">
          <span className={`av ${p.avatar}`}>{p.initial}</span>
          <span className="t-cap text-ink">{p.name}</span>
          <span className={p.open ? "ui-role ui-role-open" : "ui-role"}>
            {p.role} <span className="ui-chev">▾</span>
          </span>
        </div>
      ))}

      <div className="ui-menu">
        {ROLES.map((r) => (
          <div key={r.name} className={r.on ? "ui-item ui-item-on" : "ui-item"}>
            <span className="ui-item-name">{r.name}</span>
            <span className="ui-item-desc">{r.desc}</span>
          </div>
        ))}
      </div>
    </UiFrame>
  );
}
