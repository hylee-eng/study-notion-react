/** 레벨 5 · 관계형과 롤업을 상자와 물건으로 설명하는 그림 */
const TASKS = [
  { name: "촬영 일정 확정", box: "3월 캠페인" },
  { name: "예산안 검토", box: "3월 캠페인" },
  { name: "최종 보고서 작성", box: "상반기 결산" },
];

const SUMMARY = ["업무 5건", "완료 60%", "마감 3월 20일"];

export default function RelationAnalogy() {
  return (
    <div className="card-sat bg-cream">
      <span className="pill bg-ink text-canvas">먼저 그림으로</span>

      <h2 className="t-h3 mt-5">
        관계형과 롤업은 <br className="hidden md:block" />
        상자와 물건으로 생각하면 쉽습니다
      </h2>

      <p className="t-body text-bodytext mt-4 lede-640">
        프로젝트는 상자, 업무는 그 안에 들어가는 물건입니다. 관계형은 물건마다 어느 상자에
        속하는지 이름표를 붙이는 일이고, 롤업은 상자를 열어보지 않아도 겉면에 개수와 진행률이
        저절로 적히는 일입니다.
      </p>

      <div className="anal">
        <div>
          <div className="anal-cap">관계형 · 물건에 이름표를 붙입니다</div>
          {TASKS.map((task) => (
            <div key={task.name} className="anal-card">
              {task.name}
              <span className="anal-tag">{task.box}</span>
            </div>
          ))}
        </div>

        <div className="anal-arrow">
          <span className="anal-ar-v">↓</span>
          <span className="anal-ar-h">→</span>
        </div>

        <div>
          <div className="anal-cap">롤업 · 상자 겉면에 저절로 적힙니다</div>
          <div className="anal-box">
            <div className="anal-box-name">3월 캠페인</div>
            <div className="anal-sum">
              {SUMMARY.map((item) => (
                <span key={item} className="anal-sum-item">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <p className="anal-note">이름표가 바뀌면 겉면 숫자도 따라 바뀝니다</p>
        </div>
      </div>

      <p className="t-body text-bodytext mt-10 lede-640">
        이름이 비슷해 헷갈리지만 하는 일이 다릅니다. 관계형은 잇는 일이고, 롤업은 이어진 것을
        세는 일입니다. 순서도 정해져 있습니다. 먼저 잇고, 그다음에 셉니다.
      </p>
    </div>
  );
}
