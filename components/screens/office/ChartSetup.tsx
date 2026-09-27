import UiFrame from "../UiFrame";
import { Mark } from "./Mark";
import type { VacancyData } from "@/lib/rone";
import { REGION_COLOR, FALLBACK_SERIES, FALLBACK_PERIODS } from "./regionStyle";

/**
 * STEP 3-② · 선 차트와 오른쪽 설정 패널.
 * 차트는 라이브 데모와 같은 데이터로 그립니다. 설정을 마치면 노션에서도 이 모양이 됩니다.
 */

/** "2026년 2분기" → "26년 2Q". 가로축 글자가 겹치지 않도록 줄입니다 */
function shortLabel(label: string) {
  const m = label.match(/(\d{4})년\s*(\d)분기/);
  return m ? `${m[1].slice(2)}년 ${m[2]}Q` : label;
}

function getSeries(data: VacancyData | null) {
  if (!data) return { periods: FALLBACK_PERIODS, series: FALLBACK_SERIES };
  const periods = data.regions[0].history.map((q) => shortLabel(q.label));
  const series = data.regions.map((r) => ({ name: r.name, values: r.history.map((q) => q.value) }));
  return { periods, series };
}

function LineChart({ data }: { data: VacancyData | null }) {
  const { periods, series } = getSeries(data);

  // 글자 크기가 화면 폭에 따라 너무 커지거나 작아지지 않도록 실제 표시 폭과 비슷한 크기로 그립니다.
  // 좁은 화면에서는 차트만 가로로 밀어 볼 수 있게 둡니다(ui-chart-scroll).
  const W = 640;
  const H = 280;
  const pad = { l: 34, r: 30, t: 12, b: 30 };
  const all = series.flatMap((s) => s.values);
  const min = Math.floor(Math.min(...all)) - 1;
  const max = Math.ceil(Math.max(...all)) + 1;
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / Math.max(periods.length - 1, 1);
  const y = (v: number) => pad.t + ((max - v) * (H - pad.t - pad.b)) / (max - min);
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i).filter((t) => (t - min) % 2 === 0);

  return (
    <div>
      <div className="ui-chart-scroll">
        <svg viewBox={`0 0 ${W} ${H}`} className="ui-chart" role="img" aria-label="권역별 공실률 추이 선 차트">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="ui-chart-grid" />
              <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="ui-chart-tick">
                {t}
              </text>
            </g>
          ))}
          {periods.map((p, i) => (
            <text key={p} x={x(i)} y={H - 8} textAnchor="middle" className="ui-chart-tick">
              {p}
            </text>
          ))}
          {series.map((s) => (
            <polyline
              key={s.name}
              points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
              fill="none"
              stroke={REGION_COLOR[s.name]}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>
      <div className="ui-legend">
        {series.map((s) => (
          <span key={s.name} className="ui-legend-item">
            <i style={{ background: REGION_COLOR[s.name] }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function SetRow({ label, value, mark }: { label: string; value: string; mark?: number }) {
  return (
    <div className="ui-set-row">
      <span className="ui-set-label">{label}</span>
      <span className="ui-set-value">
        {value}
        <span className="ui-chev">▼</span>
      </span>
      {mark && <Mark n={mark} />}
    </div>
  );
}

export default function ChartSetup({ data }: { data: VacancyData | null }) {
  return (
    <UiFrame path="내 업무 홈 / 오피스 공실률">
      <div className="ui-views">
        <span className="ui-view">표</span>
        <span className="ui-view ui-view-on">권역별 추이</span>
        <span className="ui-view">＋</span>
      </div>

      <div className="ui-chart-shell">
        <LineChart data={data} />

        <div className="ui-panel">
          <div className="ui-menu-cap">차트 유형</div>
          <div className="ui-types">
            <span className="ui-type">막대</span>
            <span className="ui-type">가로 막대</span>
            <span className="ui-type ui-type-on">선</span>
            <span className="ui-type">도넛</span>
            <Mark n={1} />
          </div>

          <div className="ui-menu-cap mt-3">X축</div>
          <SetRow label="표시할 항목" value="분기" mark={2} />
          <SetRow label="정렬" value="오름차순" />

          <div className="ui-menu-cap mt-3">Y축</div>
          <SetRow label="표시할 항목" value="공실률 · 평균" mark={3} />
          <SetRow label="그룹화 기준" value="권역" mark={4} />
        </div>
      </div>
    </UiFrame>
  );
}
