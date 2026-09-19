import Link from "next/link";

/**
 * 상단 네비.
 *
 * 정적 버전에서는 이 덩어리가 HTML 파일 여섯 곳에 똑같이 복사되어 있었고,
 * 메뉴 하나를 고치려면 여섯 곳을 같이 고쳐야 했습니다.
 * 여기서는 이 파일 하나가 모든 페이지의 네비입니다.
 */
const MENU = [
  { href: "/#why", label: "왜 어려울까" },
  { href: "/#path", label: "학습 경로" },
  { href: "/#try", label: "직접 해보기" },
  { href: "/#faq", label: "자주 묻는 질문" },
];

export default function SiteHeader() {
  return (
    <header className="bg-canvas border-b border-hairline">
      <div className="shell">
        <nav className="h-16 flex items-center justify-between">
          <Link href="/" className="text-ink wordmark">
            Study Notion
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {MENU.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/#path" className="btn btn-primary btn-sm">
            학습 경로 보기
          </Link>
        </nav>
      </div>
    </header>
  );
}
