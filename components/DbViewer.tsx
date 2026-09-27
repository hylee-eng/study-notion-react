"use client";

import { useState } from "react";
import {
  TASKS,
  STATUSES,
  STATUS_CLASS,
  AVATAR_CLASS,
  CALENDAR_MONTH,
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

function MiniCard({ task }: { task: Task }) {
  return (
    <div className="mini">
      <div className="t-card-title text-ink">{task.title}</div>
      <div className="flex items-center gap-2 mini-row">
        <Avatar owner={task.owner} />
        <span className="t-cap text-bodytext">{task.owner}</span>
        <span className="t-cap text-muted push-right">{task.due}</span>
      </div>
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

/**
 * 노션의 캘린더 보기처럼 한 달을 일~토 7칸 달력으로 그리고,
 * 업무를 마감일 칸에 카드로 올려 둡니다.
 * 앞뒤 달의 날짜로 첫 주와 마지막 주의 빈칸을 채우는 것도 노션과 같습니다.
 */
function CalendarView() {
  const { year, month } = CALENDAR_MONTH;
  const first = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevMonthDays = new Date(year, month - 1, 0).getDate();
  const lead = first.getDay(); // 1일 앞에 비는 칸 수 (일요일 시작)
  const total = Math.ceil((lead + daysInMonth) / 7) * 7;

  const cells = Array.from({ length: total }, (_, i) => {
    const day = i - lead + 1;
    if (day < 1) return { key: `p${i}`, label: prevMonthDays + day, inMonth: false, day: 0 };
    if (day > daysInMonth) return { key: `n${i}`, label: day - daysInMonth, inMonth: false, day: 0 };
    return { key: `d${day}`, label: day, inMonth: true, day };
  });

  return (
    <div>
      <div className="cal-top">
        <span className="t-card-title text-ink">
          {year}년 {month}월
        </span>
        <span className="cal-nav" aria-hidden="true">
          <span className="cal-nav-btn">&lsaquo;</span>
          <span className="cal-today">오늘</span>
          <span className="cal-nav-btn">&rsaquo;</span>
        </span>
      </div>

      <div className="tb-scroll">
        <div className="cal">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <div key={d} className="cal-wd">
              {d}
            </div>
          ))}

          {cells.map((cell, i) => {
            const tasks = cell.inMonth ? TASKS.filter((t) => t.day === cell.day) : [];
            const weekend = i % 7 === 0 || i % 7 === 6;
            return (
              <div
                key={cell.key}
                className={`cal-cell ${weekend ? "cal-weekend" : ""} ${cell.inMonth ? "" : "cal-out"}`}
              >
                <span className="cal-num">{cell.label === 1 && cell.inMonth ? `${month}월 1일` : cell.label}</span>
                {tasks.map((task) => (
                  <div key={task.title} className="cal-card">
                    <div className="cal-card-title">{task.title}</div>
                    <div className="cal-card-row">
                      <Avatar owner={task.owner} />
                      <Badge status={task.status} />
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
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
