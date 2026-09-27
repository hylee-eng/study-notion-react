import UiFrame from "../UiFrame";
import { Mark } from "./Mark";

/** 공유 오피스 STEP 3-① · 주소 열의 속성 종류를 텍스트에서 장소로 바꾸는 메뉴 */
const TYPES = ["텍스트", "숫자", "선택", "다중 선택", "날짜", "장소"];

export default function PlaceProperty() {
  return (
    <UiFrame path="내 업무 홈 / 강남 공유오피스">
      <div className="ui-title">강남 공유오피스</div>
      <div className="ui-tb mt-3">
        <div className="ui-tr ui-tr-2">
          <div className="ui-th">Aa 이름</div>
          <div className="ui-th ui-th-hit">
            주소 <Mark n={1} />
          </div>
        </div>
      </div>

      <div className="ui-menu ui-menu-right">
        <div className="ui-menu-cap">속성 편집 · 유형</div>
        {TYPES.map((t) => (
          <div key={t} className={t === "장소" ? "ui-item ui-item-on" : "ui-item"}>
            <span className="ui-item-name">{t}</span>
            {t === "텍스트" && <span className="ui-item-desc">지금</span>}
            {t === "장소" && <Mark n={2} />}
          </div>
        ))}
      </div>
    </UiFrame>
  );
}
