"use client";

import { useId, useState } from "react";

/**
 * 자주 묻는 질문 목록.
 *
 * 브라우저 기본 펼침(details)은 높이가 한 번에 바뀌어 딱딱하게 보입니다.
 * 여기서는 답변 칸의 높이를 0에서 내용 높이까지 부드럽게 늘리고,
 * 글자는 살짝 아래로 내려오며 나타나게 합니다.
 * 여러 질문을 동시에 열어 둘 수 있는 것은 이전과 같습니다.
 */
export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const baseId = useId();

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const qId = `${baseId}-q${i}`;
        const aId = `${baseId}-a${i}`;
        return (
          <div key={item.q} className={isOpen ? "faq faq-open" : "faq"}>
            <h3>
              <button
                type="button"
                id={qId}
                className="faq-q"
                aria-expanded={isOpen}
                aria-controls={aId}
                onClick={() => toggle(i)}
              >
                <span className="t-card-title text-ink">{item.q}</span>
                <span className="faq-sign" aria-hidden="true" />
              </button>
            </h3>
            <div id={aId} role="region" aria-labelledby={qId} className="faq-panel" inert={!isOpen}>
              <div className="faq-inner">
                <p className="t-body text-bodytext faq-a">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
