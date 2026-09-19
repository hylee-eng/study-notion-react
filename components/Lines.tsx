import { Fragment } from "react";

/**
 * 넓은 화면에서만 지정한 자리에서 줄을 바꿉니다.
 * 좁은 화면에서는 한 문단으로 이어져 읽힙니다.
 */
export default function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <>
              {" "}
              <br className="hidden md:block" />
            </>
          )}
          {line}
        </Fragment>
      ))}
    </>
  );
}
