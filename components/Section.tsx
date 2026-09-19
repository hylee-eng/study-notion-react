import type { ReactNode } from "react";

/**
 * 모든 섹션의 공통 껍데기.
 *
 * 정적 버전에서는 섹션마다 sec 클래스를 직접 붙였는데,
 * 여백 없는 섹션 두 개가 나란히 오면 간격이 0이 되는 함정이 있었습니다.
 * 여기서는 여백이 기본값이라, 일부러 pad={false} 를 적지 않는 한
 * 그 실수가 일어나지 않습니다.
 */
export default function Section({
  id,
  pad = true,
  children,
}: {
  id?: string;
  pad?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={pad ? "bg-canvas sec" : "bg-canvas"}>
      <div className="shell">{children}</div>
    </section>
  );
}
