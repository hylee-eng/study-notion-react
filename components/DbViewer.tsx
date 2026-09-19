"use client";

import { useState } from "react";
import {
  TASKS,
  STATUSES,
  STATUS_CLASS,
  AVATAR_CLASS,
  WEEKS,
  type Task,
  type Status,
} from "@/data/tasks";

/* ══════════════════════════════════════════════════════════
   데이터베이스 체험 위젯.

   이 파일 맨 위의 "use client" 는 이 컴포넌트만 브라우저에서
   움직인다는 표시입니다. 나머지 페이지는 미리 만들어진 HTML 로
   전달되고, 버튼을 눌러야 하는 이 부분만 자바스크립트로 동작합니다.

   정적 버전에서는 탭을 누를 때마다 HTML 문자열을 새로 만들어
   화면에 밀어 넣었습니다. 여기서는 고른 보기를 기억해 두면
   화면이 알아서 따라옵니다.
   ══════════════════════════════════════════════════════════ */

type View = "table" | "board" | "calendar";

const TABS: { key: View; label: string }[] = [
  { key: "table", label: "표" },
  { key: "board", label: "보드" },
  { key: "calendar", label: "캘린더" },
];

function Badge({ status }: { status: Status }) {
  return <span className={`st ${STATUS_CLASS[status]}`}>{status}</span>;
}

function Avatar({ owner }: { owner: string }) {
  return <span className={`av ${AVATAR_CLASS[owner]}`}>{owner.charAt(0)}</span>;
}

function MiniCard({ task, showStatus }: { task: Task; showStatus?: boolean }) {
  return (
    <div className="mini">
      <div className="t-card-title text-ink">{task.title}</div>
      <div className="flex items-center gap-2 mini-row">
        <Avatar owner={task.owner} />
        <span className="t-cap text-bodytext">{task.owner}</span>
        <span className="t-cap text-muted push-right">{task.due}</span>
      </div>
      {showStatus && (
        <div className="mini-row">
          <Badge status={task.status} />
        </div>
      )}
    </div>
  );
}

function TableView() {
  return (
    <div className="tb-scroll">
      <div>
        <div className="tb-r">
          <div className="tb-h t-cap text-muted">제목</div>
          <div className="tb-h t-cap text-muted">담당자</div>
          <div className="tb-h t-cap text-muted">마감일</div>
          <div className="tb-h t-cap text-muted">상태</div>
        </div>

        {TASKS.map((task) => (
          <div key={task.title} className="tb-r">
            <div className="tb-c t-body text-ink">{task.title}</div>
            <div className="tb-c">
              <Avatar owner={task.owner} />
              <span className="t-body text-bodytext">{task.owner}</span>
            </div>
            <div className="tb-c t-body text-bodytext">{task.due}</div>
            <div className="tb-c">
              <Badge status={task.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BoardView() {
  return (
    <div className="col-grid">
      {STATUSES.map((status) => {
        const group = TASKS.filter((task) => task.status === status);
        return (
          <div key={status}>
            <div className="col-head">
              <Badge status={status} />
              <span className="t-cap text-muted">{group.length}</span>
            </div>
            <div className="col-body">
              {group.map((task) => (
                <MiniCard key={task.title} task={task} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CalendarView() {
  return (
    <div className="col-grid">
      {WEEKS.map((week) => {
        const group = TASKS.filter((task) => task.week === week.key);
        return (
          <div key={week.key}>
            <div className="col-head">
              <span className="t-card-title text-ink">{week.label}</span>
              <span className="t-cap text-muted push-right">{week.range}</span>
            </div>
            <div className="col-body">
              {group.map((task) => (
                <MiniCard key={task.title} task={task} showStatus />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const VIEWS: Record<View, () => React.JSX.Element> = {
  table: TableView,
  board: BoardView,
  calendar: CalendarView,
};

export default function DbViewer() {
  const [view, setView] = useState<View>("table");
  const Current = VIEWS[view];

  return (
    <div className="bg-canvas exp-data">
      <div role="tablist" className="flex items-center gap-1 exp-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            className="tab"
            aria-selected={view === tab.key}
            onClick={() => setView(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="exp-body">
        <Current />
      </div>
    </div>
  );
}
