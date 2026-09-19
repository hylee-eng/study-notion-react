import Shot from "./Shot";
import { SCREENS } from "./screens";
import type { Step } from "@/data/levels";

/**
 * 실습 한 단계를 그립니다.
 *
 * 데이터에 무엇이 들어 있느냐에 따라 화면·예시 줄·표·한 줄 메모가
 * 순서대로 붙습니다. 없는 항목은 그냥 건너뜁니다.
 */
export default function StepBody({ step, index }: { step: Step; index: number }) {
  const Screen = step.screen ? SCREENS[step.screen] : null;

  return (
    <div className="step" id={step.id}>
      <div className="step-n">STEP {String(index + 1).padStart(2, "0")}</div>

      <div>
        <h3 className="t-card-title text-ink">{step.title}</h3>
        <p className="t-body text-bodytext mt-3 lede-640">{step.body}</p>

        {/* 화면이 둘인 경우(caption 없음)는 그 컴포넌트가 해설까지 맡습니다 */}
        {Screen &&
          (step.caption ? (
            <Shot caption={step.caption}>
              <Screen />
            </Shot>
          ) : (
            <Screen />
          ))}

        {step.demo && (
          <div className="demo">
            {step.demo.map((line, i) => (
              <div key={i} className="demo-line">
                <span className={line.solid ? "kbd kbd-solid" : "kbd"}>{line.key}</span>
                {line.arrow && <span className="to">{line.arrow}</span>}
                <span className={`t-cap ${line.dim ? "text-muted" : "text-bodytext"}`}>
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {step.rows && (
          <div className="mt-6">
            {step.rows.map((row) => (
              <div key={row.k} className="sk-r">
                <span className="kbd">{row.k}</span>
                <span className="t-body text-bodytext">{row.v}</span>
              </div>
            ))}
          </div>
        )}

        {step.note && <p className="t-cap text-muted mt-4">{step.note}</p>}
      </div>
    </div>
  );
}
