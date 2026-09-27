import Link from "next/link";
import type { Metadata } from "next";

import Section from "@/components/Section";
import { SAMPLES } from "@/data/samples";

/* ══════════════════════════════════════════════════════════
   /samples - 샘플 갤러리 목록.
   카드는 data/samples.ts 의 목록에서 그대로 만들어집니다.
   ══════════════════════════════════════════════════════════ */

export const metadata: Metadata = {
  title: "샘플 갤러리",
  description: "노션으로 이런 것까지 할 수 있습니다. 실제 업무 데이터로 만든 샘플을 보고 그대로 따라 만들어 보세요.",
};

export default function SamplesPage() {
  return (
    <>
      <Section>
        <div className="crumb">
          <Link href="/">홈</Link>
          <span className="crumb-sep">/</span>
          <span className="text-ink">샘플 갤러리</span>
        </div>

        <div className="lede-640 mt-6">
          <h1 className="t-h1">
            노션으로 <br className="hidden md:block" />
            이런 것까지 됩니다
          </h1>
          <p className="t-body text-muted mt-6 lede-560">
            실제 업무 데이터로 만든 샘플입니다. <br className="hidden md:block" />
            완성본을 먼저 보고, 노션에서 그대로 따라 만들어 보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {SAMPLES.map((sample) => (
            <Link
              key={sample.slug}
              href={`/samples/${sample.slug}`}
              className={`card-sat ${sample.color} h-full flex flex-col`}
            >
              <span className="pill bg-cream text-ink self-start">SAMPLE</span>
              <h2 className="t-card-title text-ink mt-5">{sample.title}</h2>
              <p className="t-body text-ink op-76 mt-2.5">{sample.desc}</p>

              <div className="flex flex-wrap gap-2 mt-6 mb-8">
                {sample.tags.map((tag) => (
                  <span key={tag} className="pill bg-cream text-ink">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-auto lv-meta sample-meta">
                <span className="t-cap text-ink op-76">따라 만들기 {sample.minutes}</span>
                <span className="text-ink lv-arrow">&rarr;</span>
              </div>
            </Link>
          ))}

          {/* 다음 샘플 자리. 샘플이 늘어나면 이 카드는 지워도 됩니다 */}
          <div className="card bg-soft h-full flex flex-col justify-center sample-soon">
            <span className="t-cap text-muted">다음 샘플 준비 중</span>
            <p className="t-body text-muted mt-2.5">
              업무에서 자주 찾는 데이터로 <br className="hidden md:block" />
              샘플을 계속 추가합니다.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
