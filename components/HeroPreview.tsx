/** Hero 오른쪽의 노션풍 데이터베이스 미리보기 (움직이지 않는 장식) */
const ROWS = [
  { title: "주간 회의록", owner: "김", name: "김하늘", av: "bg-pink text-white", status: "진행 중", tone: "bg-ochre text-ink" },
  { title: "콘텐츠 기획안", owner: "이", name: "이도윤", av: "bg-teal text-white", status: "할 일", tone: "bg-cream text-ink" },
  { title: "제작 일정 정리", owner: "박", name: "박서연", av: "bg-peach text-ink", status: "완료", tone: "bg-peach text-ink" },
  { title: "피드백 취합", owner: "최", name: "최민준", av: "bg-lavender text-ink", status: "진행 중", tone: "bg-ochre text-ink" },
];

export default function HeroPreview() {
  return (
    <div className="card-sat bg-lavender text-ink h-full">
      <div className="bg-canvas n-page">
        <div className="flex items-center gap-2 n-pad">
          <span className="n-doc" />
          <span className="text-ink n-title">팀 업무 관리</span>
        </div>

        <div className="flex items-center justify-between n-bar">
          <div className="flex items-center gap-1">
            <span className="pill bg-cream text-ink">표</span>
            <span className="pill text-muted">보드</span>
            <span className="pill text-muted">캘린더</span>
            <span className="t-cap text-muted n-pad">+</span>
          </div>
          <div className="flex items-center gap-3 t-cap text-muted">
            <span>필터</span>
            <span>정렬</span>
            <span className="n-dots">···</span>
          </div>
        </div>

        <div className="mt-2.5">
          <div className="n-r">
            <div className="n-head n-vr">
              <span className="n-ico-title">Aa</span>
              <span className="t-cap text-muted">제목</span>
            </div>
            <div className="n-head n-vr">
              <span className="n-ico-person" />
              <span className="t-cap text-muted">담당자</span>
            </div>
            <div className="n-head">
              <span className="n-ico-status" />
              <span className="t-cap text-muted">상태</span>
            </div>
          </div>

          {ROWS.map((row) => (
            <div key={row.title} className="n-row n-r">
              <div className="n-cell n-vr">
                <span className="n-check" />
                <span className="n-doc" />
                <span className="t-cap text-ink">{row.title}</span>
              </div>
              <div className="n-cell n-vr">
                <span className={`n-ava ${row.av}`}>{row.owner}</span>
                <span className="t-cap text-bodytext">{row.name}</span>
              </div>
              <div className="n-cell">
                <span className={`pill ${row.tone}`}>{row.status}</span>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between n-foot">
            <span className="t-cap text-muted">+ 새로 만들기</span>
            <span className="t-cap text-muted">개수 {ROWS.length}</span>
          </div>
        </div>
      </div>

      <p className="t-cap text-ink mt-4 op-72">
        같은 데이터를 표 · 보드 · 캘린더로 바꿔 봅니다
      </p>
    </div>
  );
}
