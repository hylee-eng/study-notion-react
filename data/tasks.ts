/* ══════════════════════════════════════════════════════════
   랜딩의 데이터베이스 체험 위젯이 쓰는 업무 목록.

   이 위젯이 말하려는 것은 "데이터는 하나, 보는 방식만 여럿"입니다.
   그래서 아래 배열은 어떤 보기를 골라도 절대 바뀌지 않습니다.
   바뀌는 것은 이 배열을 어떻게 그릴 것인가뿐입니다.
   ══════════════════════════════════════════════════════════ */

export type Status = "할 일" | "진행 중" | "완료";

export type Task = {
  title: string;
  owner: string;
  due: string;
  /** 마감일의 날짜 숫자. 캘린더 보기에서 몇 일 칸에 놓을지 정합니다 */
  day: number;
  status: Status;
};

export const TASKS: Task[] = [
  { title: "주간 회의록 정리", owner: "김하늘", due: "3월 9일", day: 9, status: "완료" },
  { title: "콘텐츠 기획안 초안", owner: "이도윤", due: "3월 11일", day: 11, status: "진행 중" },
  { title: "촬영 일정 확정", owner: "박서연", due: "3월 13일", day: 13, status: "진행 중" },
  { title: "예산안 검토", owner: "최민준", due: "3월 17일", day: 17, status: "완료" },
  { title: "디자인 시안 공유", owner: "김하늘", due: "3월 19일", day: 19, status: "진행 중" },
  { title: "고객사 피드백 취합", owner: "이도윤", due: "3월 20일", day: 20, status: "할 일" },
  { title: "최종 보고서 작성", owner: "박서연", due: "3월 24일", day: 24, status: "할 일" },
  { title: "성과 리뷰 미팅", owner: "최민준", due: "3월 26일", day: 26, status: "할 일" },
];

/* 아래는 데이터가 아니라 보여주는 규칙입니다 */

export const STATUSES: Status[] = ["할 일", "진행 중", "완료"];

export const STATUS_CLASS: Record<Status, string> = {
  "할 일": "st-todo",
  "진행 중": "st-doing",
  완료: "st-done",
};

export const AVATAR_CLASS: Record<string, string> = {
  김하늘: "av-1",
  이도윤: "av-2",
  박서연: "av-3",
  최민준: "av-4",
};

/** 캘린더 보기가 그리는 달. 업무 마감일이 모두 이 달 안에 있습니다 */
export const CALENDAR_MONTH = { year: 2026, month: 3 } as const;
