"use client";

import { useEffect, useState } from "react";

/**
 * "도움이 됐어요" 버튼.
 *
 * 처음 열리면 /api/reactions 에서 지금까지의 개수를 받아 오고,
 * 누르면 한 줄을 더한 뒤 새 개수로 바꿉니다. 숫자는 Supabase 에 저장되어 모든 방문자가 같이 봅니다.
 *
 * 같은 브라우저에서 여러 번 누르지 않도록 이 브라우저에만 "눌렀음"을 기억합니다.
 * 서버에는 누가 눌렀는지 보내지 않습니다.
 */
export default function ReactionButton({ page }: { page: string }) {
  const storeKey = `reacted:${page}`;
  const [count, setCount] = useState<number | null>(null);
  const [reacted, setReacted] = useState(false);
  const [state, setState] = useState<"loading" | "ready" | "sending" | "off">("loading");

  useEffect(() => {
    try {
      setReacted(localStorage.getItem(storeKey) === "1");
    } catch {
      // 비공개 창 등에서는 기억하지 못해도 버튼은 동작합니다
    }

    fetch(`/api/reactions?page=${encodeURIComponent(page)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { count: number }) => {
        setCount(d.count);
        setState("ready");
      })
      .catch(() => setState("off"));
  }, [page, storeKey]);

  async function react() {
    setState("sending");
    try {
      const r = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page }),
      });
      if (!r.ok) throw new Error();
      const d = (await r.json()) as { count: number };
      setCount(d.count);
      setReacted(true);
      try {
        localStorage.setItem(storeKey, "1");
      } catch {}
      setState("ready");
    } catch {
      setState("off");
    }
  }

  // 데이터베이스가 연결되지 않았으면 버튼 자체를 숨깁니다
  if (state === "off") return null;

  return (
    <div className="react-box">
      <p className="t-body text-bodytext">이 페이지가 도움이 됐나요?</p>
      <button
        type="button"
        onClick={react}
        disabled={reacted || state !== "ready"}
        className={reacted ? "btn btn-primary btn-sm react-btn" : "btn btn-secondary btn-sm react-btn"}
        aria-live="polite"
      >
        {reacted ? "고마워요" : "도움이 됐어요"}
        <span className="react-n">{count ?? "·"}</span>
      </button>
    </div>
  );
}
