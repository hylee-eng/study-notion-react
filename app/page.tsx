import Link from "next/link";

import Section from "@/components/Section";
import HeroPreview from "@/components/HeroPreview";
import DbViewer from "@/components/DbViewer";
import { LEVELS } from "@/data/levels";
import { PROBLEMS, HOW_ITEMS, AUDIENCE_FIT, AUDIENCE_UNFIT, FAQ } from "@/data/landing";

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-12 items-center">
          <div className="md:col-span-7">
            <h1 className="t-h1">
              알고 보면 너무 쉬운 <br className="hidden md:block" />
              노션, 여기서 시작하세요
            </h1>

            <p className="t-body text-muted mt-6 lede-520">
              처음 노션을 열었을 때 막히는 지점만 모았습니다.{" "}
              <br className="hidden md:block" />
              한 번에 15분, 다섯 단계면 충분합니다.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link href="#path" className="btn btn-primary">
                학습 경로 보기
              </Link>
              <Link href="#try" className="btn btn-secondary">
                데이터베이스 체험하기
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            <HeroPreview />
          </div>
        </div>
      </Section>

      {/* ── 왜 어려울까 ── */}
      <Section id="why">
        <div className="lede-640">
          <h2 className="t-h2">
            왜 노션은 <br className="hidden md:block" />
            유독 어렵게 느껴질까요
          </h2>
          <p className="t-body text-muted mt-5 lede-560">
            어려운 것은 기능이 아니라 순서입니다.{" "}
            <br className="hidden md:block" />
            처음 멈추게 되는 세 지점을 먼저 짚습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {PROBLEMS.map((item) => (
            <article key={item.title} className={`card-sat ${item.bg} h-full flex flex-col`}>
              <span className="pill bg-cream text-ink">{item.tag}</span>
              <h3 className={`t-card-title ${item.dark ? "text-white" : "text-ink"} mt-5`}>
                {item.title}
              </h3>
              <p
                className={`t-body ${item.dark ? "text-white op-86" : "text-ink op-76"} mt-3`}
              >
                {item.body[0]} <br className="hidden md:block" />
                {item.body[1]}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* ── 학습 방식 ── */}
      <Section id="how">
        <div className="lede-640">
          <h2 className="t-h2">
            읽는 자료가 아니라 <br className="hidden md:block" />
            따라 하는 순서입니다
          </h2>
          <p className="t-body text-muted mt-5 lede-560">
            노션을 열어둔 채로 보세요. <br className="hidden md:block" />
            각 단계는 끝났을 때 남는 결과물이 정해져 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {HOW_ITEMS.map((item) => (
            <div key={item.n} className="how-item">
              <div className="how-n">{item.n}</div>
              <h3 className="t-card-title text-ink mt-3">{item.title}</h3>
              <p className="t-body text-bodytext mt-2.5">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 학습 경로 ── */}
      <Section id="path">
        <div>
          <h2 className="t-h2">
            무엇부터 배워야 할지 <br className="hidden md:block" />
            정해 드립니다
          </h2>
          <p className="t-body text-muted mt-5 lede-560">
            다섯 단계는 순서대로 이어집니다. <br className="hidden md:block" />
            앞 단계에서 만든 것을 다음 단계에서 그대로 씁니다.
          </p>
        </div>

        {/* 카드 다섯 장이 레벨 데이터에서 그대로 만들어집니다 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {LEVELS.map((level) => (
            <Link
              key={level.n}
              href={`/level/${level.n}`}
              className="card bg-cream h-full flex flex-col"
            >
              <span className="pill bg-ink text-canvas">LEVEL {level.n}</span>
              <h3 className="t-card-title text-ink mt-5">{level.title.join(" ")}</h3>
              <p className="t-body text-bodytext mt-2.5">{level.cardDesc}</p>

              <div className="flex items-center gap-2 mt-auto lv-meta">
                <span className="t-cap text-muted">{level.minutes}</span>
                <span
                  className={`pill ${level.grade === "입문" ? "bg-peach" : "bg-lavender"} text-ink`}
                >
                  {level.grade}
                </span>
                <span className="text-ink lv-arrow">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ── 데이터베이스 체험 ── */}
      <Section id="try">
        <div className="card-sat bg-ochre text-ink">
          <span className="pill bg-cream text-ink">직접 해보기</span>

          <h3 className="t-h3 mt-5">
            같은 데이터입니다. <br className="hidden md:block" />
            보는 방식만 바꿨습니다.
          </h3>

          <p className="t-body text-ink mt-3.5 op-78">
            버튼을 눌러 보세요. 아래 데이터는 하나도 바뀌지 않습니다.
          </p>

          <DbViewer />
        </div>
      </Section>

      {/* ── 이런 분께 맞습니다 ── */}
      <Section id="who">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-10">
          <div className="md:col-span-5">
            <h2 className="t-h2">
              이런 분께 <br className="hidden md:block" />
              맞습니다
            </h2>
            <p className="t-body text-muted mt-5 lede-520">
              맞지 않는 경우도 같이 적었습니다. <br className="hidden md:block" />
              시작하기 전에 확인하세요.
            </p>
          </div>

          <div className="md:col-span-7">
            <div className="t-cap text-muted">맞습니다</div>
            <div className="mt-4">
              {AUDIENCE_FIT.map((item) => (
                <div key={item} className="aud">
                  <span className="aud-mark bg-peach text-ink">✓</span>
                  <p className="t-body text-bodytext">{item}</p>
                </div>
              ))}
            </div>

            <div className="t-cap text-muted mt-10">맞지 않습니다</div>
            <div className="mt-4">
              {AUDIENCE_UNFIT.map((item) => (
                <div key={item} className="aud">
                  <span className="aud-mark bg-cream text-muted">—</span>
                  <p className="t-body text-muted">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── 자주 묻는 질문 ── */}
      <Section id="faq">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-10">
          <div className="md:col-span-4">
            <h2 className="t-h2">
              자주 묻는 <br className="hidden md:block" />
              질문
            </h2>
          </div>

          <div className="md:col-span-8">
            {FAQ.map((item) => (
              <details key={item.q} className="faq">
                <summary>
                  <span className="t-card-title text-ink">{item.q}</span>
                  <span className="faq-sign" />
                </summary>
                <p className="t-body text-bodytext faq-a">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 마지막 권유 ── */}
      <Section>
        <div className="bg-soft text-center cta-band">
          <h3 className="t-h3">노션, 이번엔 끝까지 가봅시다</h3>
          <p className="t-body text-muted mt-4">
            첫 단계는 15분이면 끝납니다. <br className="hidden md:block" />
            오늘 만든 페이지를 그대로 내일 씁니다.
          </p>
          <div className="mt-8">
            <Link href="/level/1" className="btn btn-primary">
              레벨 1부터 시작하기
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
