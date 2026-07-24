import Link from "next/link"

const services = [
  ["留学申请", "唯一主导师统筹，多位专项导师协作完成选校、文书与网申。", "01"],
  ["签证服务", "顾问独立负责签证 Case，材料、节点和沟通记录全程可追踪。", "02"],
  ["求职指导", "从职业定位到简历、面试与求职策略，按目标灵活组合。", "03"],
  ["语言指导", "诊断薄弱项，匹配老师并制定阶段性学习与考试计划。", "04"],
]

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">留学 · 签证 · 求职 · 语言</span>
            <h1>连接全球机会，<br /><em>让每一步更确定。</em></h1>
            <p>从第一次背景评估，到申请、签证与海外成长。专业团队协同服务，所有进度清晰可见。</p>
            <div className="hero-actions">
              <Link className="button" href="/book">预约 20 分钟免费咨询</Link>
              <Link className="text-link" href="/cases">查看学生路径 →</Link>
            </div>
            <div className="trust-row"><b>4.9/5</b><span>学生评价</span><b>92%</b><span>目标院校录取率</span></div>
          </div>
          <div className="route-map">
            <div className="map-head"><span>你的全球成长路径</span><small>LIVE PLAN</small></div>
            {["背景评估", "方案与签约", "申请与签证", "求职与语言"].map((item, i) => (
              <div className={i === 0 ? "route-step active" : "route-step"} key={item}>
                <span>0{i + 1}</span><b>{item}</b><small>{i === 0 ? "下一步：选择咨询时间" : "待解锁"}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading"><span className="eyebrow">服务矩阵</span><h2>不只拿到录取，<br />更为下一段成长做准备。</h2></div>
        <div className="service-grid">
          {services.map(([title, desc, no]) => <Link href="/services" className="service-card" key={title}><span>{no}</span><h3>{title}</h3><p>{desc}</p><b>了解服务 →</b></Link>)}
        </div>
      </section>

      <section className="section blue-section">
        <div className="shell split">
          <div><span className="eyebrow light">协作方式</span><h2>一个 Case，<br />一位主导师，多位专家。</h2><p>主导师对最终申请结果负责；专项导师处理 CV、PS、面试等专业任务；顾问负责签证或独立服务事项。</p><Link className="button button-white" href="/consultants">认识我们的团队</Link></div>
          <div className="team-stack">{["主导师 · 申请总负责", "专项导师 · CV / PS", "签证顾问 · Visa Case", "服务顾问 · 求职 / 语言"].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,"0")}</span><b>{x}</b><small>{i===0?"唯一负责人":"按任务加入"}</small></div>)}</div>
        </div>
      </section>

      <section className="section shell cta"><span className="eyebrow">从这里开始</span><h2>先用 20 分钟，理清下一步。</h2><p>填写基础背景，选择适合的导师与时间。预约后将收到确认和账号激活邮件。</p><Link className="button" href="/book">开始免费咨询</Link><small>需要帮助？微信联系 GeniLinks</small></section>
    </main>
  )
}
