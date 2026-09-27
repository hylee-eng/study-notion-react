import UiFrame from "../UiFrame";
import { Mark } from "./Mark";

/** STEP 4-② · 노션 AI 창에 @ 로 데이터베이스를 지정하고 질문을 붙여 넣은 모습 */
export default function AiAsk({
  mention = "오피스 공실률",
  question = "이 DB에서 최근 분기 공실률이 가장 높은 권역 3곳과 변화 추이를 요약해줘",
}: {
  mention?: string;
  question?: string;
}) {
  return (
    <UiFrame path="Notion AI">
      <div className="ui-ai-panel">
        <div className="ui-ai-head">
          <span className="ui-ai-face ui-ai-face-sm" aria-hidden="true" />
          <span className="ui-item-name">Notion AI</span>
        </div>

        <div className="ui-ai-answer" aria-hidden="true">
          <div className="ui-skel" />
          <div className="ui-skel ui-skel-80" />
          <div className="ui-skel ui-skel-60" />
        </div>

        <div className="ui-ai-input">
          <span className="ui-mention">@{mention}</span>
          <Mark n={3} />
          <span className="ui-ai-text">{question}</span>
          <span className="ui-ai-send">&uarr;</span>
          <Mark n={4} />
        </div>
      </div>
    </UiFrame>
  );
}
