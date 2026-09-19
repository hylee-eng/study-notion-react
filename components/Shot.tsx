import type { ReactNode } from "react";

/**
 * 화면 재현과 해설을 묶는 틀.
 *
 * 해설(caption)은 화면 박스 바깥에 놓입니다.
 * 학습자가 우리 설명을 노션 화면의 일부로 오해하지 않게 하려는 구분이고,
 * caption 이 필수 항목이라 빠뜨릴 수 없습니다.
 */
export default function Shot({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure className="shot">
      {children}
      <figcaption className="shot-cap">{caption}</figcaption>
    </figure>
  );
}
