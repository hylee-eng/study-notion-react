import Shot from "@/components/Shot";

/**
 * 레벨 3 · 일반 표와 데이터베이스 표를 나란히 비교.
 *
 * 화면이 두 개라 해설도 두 개입니다. 그래서 이 컴포넌트만
 * 자기 안에서 Shot 을 직접 씁니다. 다른 화면은 바깥에서 감쌉니다.
 */
const ROWS = [
  { name: "촬영 일정 확정", status: "진행 중", tone: "bg-ochre" },
  { name: "예산안 검토", status: "완료", tone: "bg-peach" },
];

export default function TableCompare() {
  return (
    <div className="ui-two">
      <div>
        <div className="ui-label">일반 표</div>
        <Shot caption="칸을 채우는 것으로 끝납니다">
          <div className="ui">
            <div className="ui-body">
              <div className="ui-tb ui-grid">
                <div className="ui-tr ui-tr-2">
                  <div className="ui-th">업무</div>
                  <div className="ui-th">상태</div>
                </div>
                {ROWS.map((row) => (
                  <div key={row.name} className="ui-tr ui-tr-2">
                    <div className="ui-td">{row.name}</div>
                    <div className="ui-td">{row.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Shot>
      </div>

      <div>
        <div className="ui-label">데이터베이스 표</div>
        <Shot caption="보기 · 필터 · 정렬이 함께 붙습니다">
          <div className="ui">
            <div className="ui-body">
              <div className="ui-views">
                <span className="ui-view ui-view-on">표</span>
                <span className="ui-view">보드</span>
                <span className="ui-view">캘린더</span>
                <span className="ui-tool push-right">필터</span>
                <span className="ui-tool">정렬</span>
              </div>

              <div className="ui-tb mt-2.5">
                <div className="ui-tr ui-tr-2">
                  <div className="ui-th">
                    <span className="n-ico-title">Aa</span>업무
                  </div>
                  <div className="ui-th">
                    <span className="n-ico-status" />
                    상태
                  </div>
                </div>
                {ROWS.map((row) => (
                  <div key={row.name} className="ui-tr ui-tr-2">
                    <div className="ui-td">{row.name}</div>
                    <div className="ui-td">
                      <span className={`ui-tag ${row.tone}`}>{row.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Shot>
      </div>
    </div>
  );
}
