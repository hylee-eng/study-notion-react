import type { ReactNode } from "react";

/** 화면 재현에 공통으로 쓰이는 창 모양 틀 (점 세 개 + 경로 + 본문) */
export default function UiFrame({
  path,
  children,
}: {
  path?: string;
  children: ReactNode;
}) {
  return (
    <div className="ui">
      <div className="ui-bar">
        <span className="ui-dot" />
        <span className="ui-dot" />
        <span className="ui-dot" />
        {path && <span className="ui-path">{path}</span>}
      </div>
      <div className="ui-body">{children}</div>
    </div>
  );
}
