import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Section from "@/components/Section";
import Lines from "@/components/Lines";
import LevelHero from "@/components/LevelHero";
import StepBody from "@/components/StepBody";
import RelationAnalogy from "@/components/RelationAnalogy";
import { LEVELS } from "@/data/levels";

/* ══════════════════════════════════════════════════════════
   레벨 다섯 페이지가 이 파일 하나입니다.

   정적 버전에서는 level-1.html ~ level-5.html 다섯 개가
   같은 구조를 되풀이했고, 구조를 고치려면 다섯 곳을 같이 고쳐야 했습니다.
   여기서는 주소의 숫자로 데이터를 찾아 같은 틀에 부어 넣습니다.
   ══════════════════════════════════════════════════════════ */

/** 미리 만들어 둘 주소. 다섯 페이지가 정적 HTML 로 생성됩니다. */
export function generateStaticParams() {
  return LEVELS.map((level) => ({ n: String(level.n) }));
}

function findLevel(n: string) {
  return LEVELS.find((level) => String(level.n) === n);
}

/** 페이지마다 다른 제목과 설명. 공유 미리보기가 여기서 나옵니다. */
export async function generateMetadata({
  params,
}: PageProps<"/level/[n]">): Promise<Metadata> {
  const { n } = await params;
  const level = findLevel(n);
  if (!level) return {};

  return {
    title: `레벨 ${level.n} · ${level.title.join(" ")}`,
    description: level.desc,
  };
}

export default async function LevelPage({ params }: PageProps<"/level/[n]">) {
  const { n } = await params;
  const level = findLevel(n);
  if (!level) notFound();

  const prev = LEVELS.find((l) => l.n === level.n - 1);
  const next = LEVELS.find((l) => l.n === level.n + 1);
  const isLast = level.n === LEVELS.length;

  return (
    <>
      <Section>
        <LevelHero level={level} />
      </Section>

      {level.concept && (
        <Section pad={false}>
          <div className="card-sat bg-cream">
            <span className="pill bg-ink text-canvas">{level.concept.badge}</span>
            <h2 className="t-h3 mt-5">
              <Lines lines={level.concept.title} />
            </h2>
            <p className="t-body text-bodytext mt-4 lede-640">{level.concept.body}</p>
            {level.concept.cta && (
              <div className="mt-7">
                <Link href={level.concept.cta.href} className="btn btn-secondary">
                  {level.concept.cta.label}
                </Link>
              </div>
            )}
          </div>
        </Section>
      )}

      {level.analogy && (
        <Section pad={false}>
          <RelationAnalogy />
        </Section>
      )}

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-8">
          <div className="md:col-span-5">
            <h2 className="t-h3">이 단계를 마치면</h2>
            <p className="t-body text-muted mt-3.5 lede-520">
              <Lines lines={level.goalsLead} />
            </p>
          </div>

          <div className="md:col-span-7">
            {level.goals.map((goal, i) => (
              <div key={goal} className="goal">
                <span className="goal-mark">{i + 1}</span>
                <p className="t-body text-bodytext">{goal}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="t-h2">따라 해봅니다</h2>
        <p className="t-body text-muted mt-5 lede-560">
          <Lines lines={level.stepsLead} />
        </p>

        <div className="mt-12">
          {level.steps.map((step, i) => (
            <StepBody key={step.title} step={step} index={i} />
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="t-h2">여기서 자주 막힙니다</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {level.pitfalls.map((item) => (
            <div key={item.title} className="tip">
              <div className="tip-mark">막히는 지점</div>
              <h3 className="t-card-title text-ink mt-3">{item.title}</h3>
              <p className="t-body text-bodytext mt-3">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-10">
          <div className="md:col-span-5">
            <h2 className="t-h3">다 했는지 확인하기</h2>
            <p className="t-body text-muted mt-3.5 lede-520">
              <Lines lines={level.checkLead} />
            </p>
          </div>

          <div className="md:col-span-7">
            {level.checks.map((check) => (
              <div key={check} className="done">
                <span className="done-box" />
                <p className="t-body text-bodytext">{check}</p>
              </div>
            ))}
          </div>
        </div>

        {isLast && (
          <div className="bg-soft text-center cta-band mt-16">
            <h3 className="t-h3">다섯 단계를 모두 마쳤습니다</h3>
            <p className="t-body text-muted mt-4">
              이제 남은 것은 기능이 아니라 한 주를 실제로 써보는 일입니다.{" "}
              <br className="hidden md:block" />
              막히는 단계가 있으면 그 단계만 다시 펴보세요.
            </p>
            <div className="mt-8">
              <Link href="/#path" className="btn btn-primary">
                전체 경로 다시 보기
              </Link>
            </div>
          </div>
        )}

        <div className={isLast ? "pager mt-10" : "pager mt-16"}>
          {prev ? (
            <Link href={`/level/${prev.n}`} className="pager-card">
              <div className="t-cap text-muted">이전 단계</div>
              <div className="t-card-title text-ink mt-1.5">
                레벨 {prev.n} · {prev.title.join(" ")}
              </div>
            </Link>
          ) : (
            <div className="pager-card pager-off">
              <div className="t-cap text-muted">이전 단계</div>
              <div className="t-card-title text-ink mt-1.5">첫 단계입니다</div>
            </div>
          )}

          {next ? (
            <Link href={`/level/${next.n}`} className="pager-card pager-r">
              <div className="t-cap text-muted">다음 단계</div>
              <div className="t-card-title text-ink mt-1.5">
                레벨 {next.n} · {next.title.join(" ")}
              </div>
            </Link>
          ) : (
            <div className="pager-card pager-off pager-r">
              <div className="t-cap text-muted">다음 단계</div>
              <div className="t-card-title text-ink mt-1.5">마지막 단계입니다</div>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
