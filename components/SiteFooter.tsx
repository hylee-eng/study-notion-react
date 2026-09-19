import Link from "next/link";

/** 푸터의 네 열. 목록만 고치면 화면이 따라옵니다. */
const COLUMNS = [
  {
    title: "학습",
    links: [
      { href: "/#path", label: "전체 학습 경로" },
      { href: "/level/1", label: "기초 블록 다루기" },
      { href: "/level/3", label: "데이터베이스 입문" },
      { href: "/level/4", label: "협업과 권한 설정" },
    ],
  },
  {
    title: "자료실",
    links: [
      { href: "/level/5", label: "업무 구조 설계하기" },
      { href: "/level/1#shortcut", label: "단축 입력 정리표" },
      { href: "/#how", label: "학습 방식 안내" },
      { href: "/#faq", label: "자주 묻는 질문" },
    ],
  },
  {
    title: "단계별로 보기",
    links: [
      { href: "/level/1", label: "레벨 1 · 손이 먼저 익숙해지기" },
      { href: "/level/2", label: "레벨 2 · 백지에서 시작하지 않기" },
      { href: "/level/3", label: "레벨 3 · 데이터베이스라는 발상" },
      { href: "/level/5", label: "레벨 5 · 내 업무에 맞게 설계하기" },
    ],
  },
  {
    title: "스터디 노션",
    links: [
      { href: "/#who", label: "이런 분께 맞습니다" },
      { href: "/#why", label: "왜 어려울까" },
      { href: "/#try", label: "데이터베이스 체험" },
      { href: "/#faq", label: "노션 계정 만들기 안내" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="bg-soft">
      <div className="shell py-20">
        <Link href="/" className="text-ink wordmark">
          Study Notion
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="t-cap text-muted">{col.title}</div>
              <ul className="f-list">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="t-body text-bodytext">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="t-cap text-muted f-copy">
          © 2026 스터디 노션. 이 사이트는 노션 학습을 돕는 비공식 교육 자료입니다.
          노션(Notion)은 Notion Labs, Inc.의 상표입니다.
        </div>
      </div>
    </footer>
  );
}
