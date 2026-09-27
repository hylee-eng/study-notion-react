/* ══════════════════════════════════════════════════════════
   샘플 갤러리의 목록.

   "노션으로 이런 것까지 할 수 있다"를 보여주는 샘플을 모아 둡니다.
   새 샘플을 추가할 때는 이 배열에 한 덩어리를 더하고,
   app/samples/<slug>/page.tsx 를 만들면 목록에 자동으로 나타납니다.
   ══════════════════════════════════════════════════════════ */

export type Sample = {
  /** 주소 뒷부분. /samples/<slug> */
  slug: string;
  title: string;
  desc: string;
  /** 카드 배경색 클래스 (globals.css 토큰) */
  color: string;
  tags: string[];
  /** 노션에서 따라 만드는 데 걸리는 시간 */
  minutes: string;
};

export const SAMPLES: Sample[] = [
  {
    slug: "office-market",
    title: "서울 오피스 공실률 대시보드",
    desc: "도심·강남·여의도 권역의 분기별 공실률을 노션 DB와 차트로 정리합니다. 공공 데이터를 가져와 AI로 요약하는 흐름까지 따라 해봅니다.",
    color: "bg-lavender",
    tags: ["데이터베이스", "차트 보기", "노션 AI"],
    minutes: "30분",
  },
  {
    slug: "shared-office",
    title: "전국 공유 오피스 지도",
    desc: "전국 공유 오피스 340여 곳의 주소와 편의시설을 지도와 목록으로 봅니다. 같은 목록을 노션 지도 보기와 필터로 옮겨 조건에 맞는 곳을 찾아봅니다.",
    color: "bg-peach",
    tags: ["다중 선택", "지도 보기", "필터"],
    minutes: "30분",
  },
];
