import Link from "next/link";
import Lines from "./Lines";
import type { Level } from "@/data/levels";

/** 레벨 페이지 맨 위의 경로 표시와 머리 카드 */
export default function LevelHero({ level }: { level: Level }) {
  const ink = level.dark ? "text-white" : "text-ink";
  const fade = level.dark ? "op-86" : "op-76";

  return (
    <>
      <div className="crumb">
        <Link href="/">홈</Link>
        <span className="crumb-sep">/</span>
        <Link href="/#path">학습 경로</Link>
        <span className="crumb-sep">/</span>
        <span className="text-ink">레벨 {level.n}</span>
      </div>

      <div className={`lv-hero ${level.color} mt-6`}>
        <span className="pill bg-cream text-ink">LEVEL {level.n}</span>

        <h1 className={`t-h1 ${ink} mt-6`}>
          <Lines lines={level.title} />
        </h1>

        <p className={`t-body ${ink} ${fade} mt-6 lede-520`}>
          <Lines lines={level.lead} />
        </p>

        <div className="lv-hero-meta">
          <span className="pill bg-cream text-ink">{level.minutes}</span>
          <span className="pill bg-cream text-ink">{level.grade}</span>
          <span className="pill bg-cream text-ink">{level.prereq}</span>
        </div>

        <div className="prog">
          <div className={`prog-track ${level.dark ? "" : "prog-track-dark"}`}>
            <div
              className={`prog-fill ${level.dark ? "" : "prog-fill-dark"}`}
              style={{ width: `${level.n * 20}%` }}
            />
          </div>
          <span className={`t-cap ${ink} ${fade}`}>{level.n} / 5</span>
        </div>
      </div>
    </>
  );
}
