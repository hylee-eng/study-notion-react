import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: "Study Notion - 알고 보면 너무 쉬운 노션",
    template: "%s - Study Notion",
  },
  description:
    "노션을 처음 열었을 때 막히는 지점만 모았습니다. 한 번에 15분, 다섯 단계로 블록부터 데이터베이스·협업·업무 설계까지 따라 하는 무료 학습 경로.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <head>
        {/* 한글 글리프 포함 폰트 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
      </head>
      <body className="bg-canvas">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
