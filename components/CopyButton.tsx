"use client";

import { useState } from "react";

/**
 * 누르면 글을 클립보드에 복사하는 버튼.
 *
 * 클립보드는 브라우저에만 있으므로 이 부품은 브라우저에서 동작합니다("use client").
 * 복사가 끝나면 2초 동안 "복사됨"으로 바뀝니다.
 */
export default function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("done");
    } catch {
      setState("fail");
    }
    setTimeout(() => setState("idle"), 2000);
  }

  const label = state === "done" ? "복사됨" : state === "fail" ? "직접 선택해 복사" : "복사";

  return (
    <button type="button" onClick={copy} className="btn btn-secondary btn-sm copy-btn" aria-live="polite">
      {label}
    </button>
  );
}
