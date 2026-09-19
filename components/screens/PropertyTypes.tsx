import UiFrame from "./UiFrame";

/** 레벨 3 · 속성 유형 고르는 목록 */
export default function PropertyTypes() {
  return (
    <UiFrame path="속성 추가">
      <div className="ui-menu">
        <div className="ui-menu-cap">속성 유형</div>

        <div className="ui-item">
          <span className="ui-ico">Aa</span>
          <span className="ui-item-name">텍스트</span>
        </div>
        <div className="ui-item ui-item-on">
          <span className="ui-ico">
            <span className="n-ico-person" />
          </span>
          <span className="ui-item-name">사람</span>
          <span className="ui-item-desc">담당자</span>
        </div>
        <div className="ui-item ui-item-on">
          <span className="ui-ico">날짜</span>
          <span className="ui-item-name">날짜</span>
          <span className="ui-item-desc">마감일</span>
        </div>
        <div className="ui-item ui-item-on">
          <span className="ui-ico">
            <span className="n-ico-status" />
          </span>
          <span className="ui-item-name">선택</span>
          <span className="ui-item-desc">상태</span>
        </div>
        <div className="ui-item">
          <span className="ui-ico">＃</span>
          <span className="ui-item-name">숫자</span>
        </div>
        <div className="ui-item">
          <span className="ui-ico">✓</span>
          <span className="ui-item-name">체크박스</span>
        </div>
      </div>
    </UiFrame>
  );
}
