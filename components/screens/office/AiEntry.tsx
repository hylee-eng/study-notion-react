import UiFrame from "../UiFrame";
import { Mark } from "./Mark";

/** STEP 4-① · 노션 AI 를 여는 두 곳. 페이지 오른쪽 아래 얼굴 아이콘과 왼쪽 사이드바 */
export default function AiEntry({ title = "오피스 공실률" }: { title?: string }) {
  return (
    <UiFrame path={`내 업무 홈 / ${title}`}>
      <div className="ui-ai-shell">
        <div className="ui-side">
          <div className="ui-tree-item">검색</div>
          <div className="ui-tree-item ui-tree-on">
            <span className="ui-ai-face ui-ai-face-sm" aria-hidden="true" />
            Notion AI
            <Mark n={2} />
          </div>
          <div className="ui-tree-item">홈</div>
          <div className="ui-tree-item">받은 편지함</div>
        </div>

        <div className="ui-ai-page">
          <div className="ui-title">{title}</div>
          <div className="ui-skel mt-3" />
          <div className="ui-skel ui-skel-80" />
          <div className="ui-skel ui-skel-60" />

          <div className="ui-ai-fab">
            <Mark n={1} />
            <span className="ui-ai-face" aria-label="Notion AI 아이콘" />
          </div>
        </div>
      </div>
    </UiFrame>
  );
}
