import UiFrame from "../UiFrame";
import { Mark } from "./Mark";

/** STEP 2-② · CSV 를 고른 뒤 열마다 속성 종류를 정하는 가져오기 창 */
type Column = { col: string; type: string; fixed?: boolean };

const OFFICE_COLUMNS: Column[] = [
  { col: "이름", type: "제목", fixed: true },
  { col: "권역", type: "선택" },
  { col: "분기", type: "텍스트" },
  { col: "공실률", type: "숫자" },
  { col: "증감", type: "숫자" },
];

/** columns 에서 markCol 로 지정한 열 옆에 4번 표시를 붙입니다 */
export default function CsvMapping({
  file = "seoul-office-vacancy.csv",
  columns = OFFICE_COLUMNS,
  markCol = "권역",
}: {
  file?: string;
  columns?: Column[];
  markCol?: string;
}) {
  return (
    <UiFrame path="CSV 가져오기">
      <div className="ui-dialog">
        <div className="ui-file">
          <span className="ui-ico">CSV</span>
          <span className="ui-item-name">{file}</span>
        </div>

        <div className="ui-choice">
          <span className="ui-radio ui-radio-on" />
          <span className="ui-item-name">새 데이터베이스 만들기</span>
          <Mark n={3} />
        </div>
        <div className="ui-choice ui-choice-off">
          <span className="ui-radio" />
          <span className="ui-item-name">기존 데이터베이스에 추가</span>
        </div>

        <div className="ui-menu-cap mt-3">열 → 속성</div>
        {columns.map((c) => (
          <div key={c.col} className="ui-map">
            <span className="ui-map-col">{c.col}</span>
            <span className="to">&rarr;</span>
            <span className={c.fixed ? "ui-select ui-select-fixed" : "ui-select"}>
              {c.type}
              {!c.fixed && <span className="ui-chev">▼</span>}
            </span>
            {c.col === markCol && <Mark n={4} />}
          </div>
        ))}

        <div className="ui-dialog-foot">
          <span className="ui-btn-solid">가져오기</span>
        </div>
      </div>
    </UiFrame>
  );
}
