/**
 * 화면 재현 위에 붙이는 번호 표시와, 그 번호의 설명 목록.
 * 화면 안에는 번호만 두고 설명은 화면 밖(MarkLegend)에 적습니다.
 * 우리 설명이 노션 화면의 일부처럼 보이지 않게 하려는 구분입니다.
 */
export function Mark({ n }: { n: number }) {
  return (
    <span className="ui-mark" aria-label={`${n}번`}>
      {n}
    </span>
  );
}

export function MarkLegend({ items }: { items: string[] }) {
  return (
    <ol className="mark-legend">
      {items.map((text, i) => (
        <li key={text}>
          <span className="ui-mark">{i + 1}</span>
          <span className="t-body text-bodytext">{text}</span>
        </li>
      ))}
    </ol>
  );
}
