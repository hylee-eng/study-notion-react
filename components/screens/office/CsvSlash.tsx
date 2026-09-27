import UiFrame from "../UiFrame";
import { Mark } from "./Mark";

/** STEP 2-① · 빈 페이지에 /csv 를 입력하면 뜨는 메뉴 */
export default function CsvSlash({ title = "오피스 공실률" }: { title?: string }) {
  return (
    <UiFrame path={`내 업무 홈 / ${title}`}>
      <div className="ui-title">{title}</div>

      <div className="ui-line">
        <span className="ui-slash">/csv</span>
        <span className="ui-caret" />
        <Mark n={1} />
      </div>

      <div className="ui-menu">
        <div className="ui-menu-cap">가져오기</div>
        <div className="ui-item ui-item-on">
          <span className="ui-ico">CSV</span>
          <span className="ui-item-name">CSV</span>
          <span className="ui-item-desc">파일 가져오기</span>
          <Mark n={2} />
        </div>
      </div>
    </UiFrame>
  );
}
