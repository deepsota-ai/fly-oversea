"use client"

import Link from "next/link"
import { useState } from "react"

const serviceData = [
  ["留学申请", "主导师统筹", "选校、文书、网申、录取跟进"],
  ["签证服务", "签证顾问负责", "材料审核、递交、补件与面签"],
  ["求职指导", "服务 Owner 跟进", "职业定位、简历、模拟面试"],
  ["语言指导", "服务 Owner 跟进", "诊断、课程计划与阶段复盘"],
]
const people = [
  ["张明", "主导师", "美国研究生 · 计算机 · 商科", "8 年经验"],
  ["林悦", "专项导师", "CV · PS · 面试", "前招生官"],
  ["陈嘉", "签证顾问", "美国 · 加拿大签证", "500+ Cases"],
  ["周言", "求职顾问", "科技行业 · 数据岗位", "硅谷招聘"],
]

export function ServicesPage() {
  const [active, setActive] = useState(0)
  return <main className="page-main"><PageHero eyebrow="服务中心" title="按目标组合专业服务" text="服务与价格由管理员动态配置；签约采用通用合同条款与本次服务确认单。" />
    <section className="section shell">
      <div className="tab-row">{serviceData.map((x,i)=><button className={active===i?"tab active":"tab"} onClick={()=>setActive(i)} key={x[0]}>{x[0]}</button>)}</div>
      <div className="detail-grid"><div className="detail-copy"><span className="eyebrow">{serviceData[active][1]}</span><h2>{serviceData[active][0]}</h2><p>{serviceData[active][2]}，每个环节均有负责人、截止时间和交付物。</p><ul>{["首次需求诊断与服务规划","明确负责人和协作成员","任务、文件与沟通记录统一管理","阶段复盘与下一步建议"].map(x=><li key={x}>✓ {x}</li>)}</ul><Link className="button" href="/contract">表达签约兴趣</Link></div><div className="plan-card"><small>示例服务方案</small><h3>{serviceData[active][0]} · 标准版</h3><div className="metric"><b>待定</b><span>具体价格和折扣由管理员配置</span></div><hr/><p>通用合同条款 PDF</p><p>＋ 本次服务确认单</p><p>＋ 签署后的完整文件包</p></div></div>
    </section></main>
}

export function StudyAbroadPage() {
  const regions = [
    ["北美板块", "美国 · 加拿大", "多元院校体系，强调长期规划、活动与学术背景的整体呈现。"],
    ["欧陆板块", "德国 · 法国 · 荷兰 · 瑞士", "专业匹配与课程先修要求清晰，兼顾英文授课项目与就业路径。"],
    ["英伦板块", "英国 · 爱尔兰", "申请周期紧凑，重视学术匹配、个人陈述与院校梯度。"],
    ["亚太板块", "新加坡 · 香港 · 澳洲 · 日本", "选择灵活、离家更近，覆盖研究型与就业导向项目。"],
  ]
  return <main className="page-main"><PageHero eyebrow="留学申请" title="找到适合你的地区与申请路径" text="根据学术背景、职业目标、预算和时间线选择地区，再由主导师统筹完整申请。" />
    <section className="section shell"><div className="region-grid">{regions.map((x,i)=><article className="region-card" key={x[0]}><span>0{i+1}</span><small>{x[1]}</small><h2>{x[0]}</h2><p>{x[2]}</p><div><b>本科</b><b>硕士</b><b>博士</b></div><Link href="/book">预约地区咨询 →</Link></article>)}</div></section>
    <section className="section surface-section"><div className="shell detail-grid"><div><span className="eyebrow">服务方式</span><h2>主导师负责结果，专项导师解决专业问题。</h2><p>从背景评估、国家与院校选择，到文书、网申和录取跟进，所有节点统一进入学生 Portal。</p></div><div className="plan-card"><h3>20 分钟免费背景评估</h3><p>日历预留 30 分钟，预约成功后发送确认及账号激活邮件。</p><Link className="button button-white" href="/book">选择导师与时间</Link></div></div></section></main>
}

export function VisaPage() {
  return <main className="page-main"><PageHero eyebrow="签证服务" title="材料有据，节点可查，沟通透明" text="签证 Case 由顾问独立负责，不与留学申请 Case 混用。" />
    <section className="section shell"><div className="detail-grid"><article className="visa-card"><span className="eyebrow">Student Visa</span><h2>学生签证代办</h2><p>适用于已获得录取、需要办理学签或续签的学生。</p>{["材料清单与风险评估","申请表及证明材料审核","递交、补件和结果跟进","复杂情况人工沟通"].map(x=><b key={x}>✓ {x}</b>)}<Link className="button" href="/book">评估学生签证</Link></article><article className="visa-card"><span className="eyebrow">Visitor Visa</span><h2>旅游签证</h2><p>根据出行目的、资金和旅行历史制定材料策略。</p>{["个人情况初步评估","行程和资金材料建议","表格及 supporting documents","递交后的进度跟踪"].map(x=><b key={x}>✓ {x}</b>)}<Link className="button" href="/book">评估旅游签证</Link></article></div></section></main>
}

export function ContactPage() {
  return <main className="page-main"><PageHero eyebrow="联系我们" title="把你的问题，直接告诉我们" text="可通过微信或邮件联系客服，也可以提交表单预约回访。" />
    <section className="section shell contact-grid"><div className="contact-dark"><span className="eyebrow light">WeChat</span><h2>微信客服</h2><div className="qr-placeholder">微信二维码<br/><small>运营后上传</small></div><b>微信号：GeniLinks</b><p>工作时间：周一至周六 10:00–20:00（北京时间）</p></div><div className="booking-panel"><h2>发送咨询</h2><div className="form-grid"><label>姓名<input placeholder="如何称呼你" /></label><label>邮箱<input placeholder="name@example.com" /></label><label className="wide">咨询方向<select><option>留学申请</option><option>学生签证</option><option>旅游签证</option><option>求职指导</option><option>语言指导</option></select></label><label className="wide">问题<textarea placeholder="请简单描述你的背景和希望了解的问题" /></label></div><button className="button">发送咨询</button></div></section></main>
}

export function ConsultantsPage() {
  const [selected,setSelected]=useState(0)
  return <main className="page-main"><PageHero eyebrow="专业团队" title="一个 Case，多位专家协作" text="每位学生有且仅有一位主导师；其他导师和顾问按任务加入。" />
    <section className="section shell"><div className="people-grid">{people.map((p,i)=><button className={selected===i?"person-card selected":"person-card"} onClick={()=>setSelected(i)} key={p[0]}><span className="avatar">{p[0][0]}</span><small>{p[1]}</small><h3>{p[0]}</h3><p>{p[2]}</p><b>{p[3]}</b></button>)}</div>
    <div className="profile-panel"><div><span className="eyebrow">{people[selected][1]}</span><h2>{people[selected][0]}</h2><p>{people[selected][2]}。擅长把复杂目标拆成清晰的行动节点，并与学生保持直接、透明的沟通。</p></div><div><b>未来 14 天</b><strong>18</strong><span>个可预约时段</span><Link href="/book" className="button">查看可用时间</Link></div></div></section></main>
}

export function CasesPage() {
  return <main className="page-main"><PageHero eyebrow="学生案例" title="看见路径，而不只是结果" text="案例均去敏展示；文书与材料节选以 Sample PDF 形式提供。" />
    <section className="section shell">
      <div className="section-heading"><div><span className="eyebrow">Section 01 · Sample 文书</span><h2>从真实交付物，了解我们的工作方式。</h2></div></div>
      <div className="case-grid">{[["理工科 Sample","CV + PS","计算机 / 数据 / 工程"],["商科 Sample","CV + PS","金融 / 管理 / 市场"],["建筑 Sample","CV + PS","建筑 / 景观 / 城市设计"]].map(x=><article className="case-card sample-card" key={x[0]}><span>{x[2]}</span><div className="pdf-badge">PDF</div><h3>{x[0]}</h3><p>{x[1]} · 已去敏节选</p><button>预览 Sample →</button></article>)}</div>
      <div className="section-heading case-second-heading"><div><span className="eyebrow">Section 02 · 学生光荣榜</span><h2>每一份录取背后，都有一条清晰路径。</h2></div></div>
      <div className="case-grid">{[["2026 Fall · 王同学","双非商科 → UCL 数据科学","英国 · 硕士"],["2026 Fall · 李同学","GPA 3.1 → USC 录取","美国 · 硕士"],["2025 Fall · 陈同学","建筑学 → AA School","英国 · 硕士"]].map(x=><article className="case-card" key={x[0]}><span>{x[2]}</span><h3>{x[0]}</h3><p>{x[1]}</p><div className="case-path"><i/>背景诊断<i/>策略重构<i/>录取</div><button>查看录取路径 →</button></article>)}</div>
    </section></main>
}

export function BookPage() {
  const [step,setStep]=useState(1)
  const [done,setDone]=useState(false)
  if(done) return <SuccessPage/>
  return <main className="page-main"><PageHero eyebrow="免费咨询" title="预约 20 分钟背景评估" text="会议日历预留 30 分钟，以便导师完成会前准备和会后记录。" />
    <section className="booking-shell shell"><div className="stepper">{["填写背景","选择导师","选择时间"].map((x,i)=><span className={step>=i+1?"active":""} key={x}><b>{i+1}</b>{x}</span>)}</div>
    <div className="booking-panel">{step===1&&<div className="form-grid">{["姓名 *","邮箱 *","微信号","当前院校","当前专业","目标国家 / 学位","GPA / 满分","语言成绩"].map(x=><label key={x}>{x}<input placeholder={"请输入"+x.replace(" *","")} /></label>)}<label className="wide">希望讨论的问题<textarea placeholder="例如：跨专业申请、选校定位、签证风险…" /></label></div>}
    {step===2&&<div className="people-grid compact">{people.slice(0,3).map((p,i)=><button className={i===0?"person-card selected":"person-card"} key={p[0]}><span className="avatar">{p[0][0]}</span><small>{p[1]}</small><h3>{p[0]}</h3><p>{p[2]}</p></button>)}</div>}
    {step===3&&<div className="calendar-demo"><div><b>2026 年 7 月</b>{["一","二","三","四","五","六","日"].map(x=><small key={x}>{x}</small>)}{Array.from({length:28},(_,i)=><button className={i===16?"selected":""} key={i}>{i+1}</button>)}</div><aside><h3>7 月 17 日</h3>{["10:00","11:00","14:20","16:00"].map((x,i)=><button className={i===1?"selected":""} key={x}>{x}</button>)}<small>北京时间 · 20 分钟咨询</small></aside></div>}
    <div className="form-actions">{step>1&&<button className="button secondary" onClick={()=>setStep(step-1)}>上一步</button>}<button className="button" onClick={()=>step<3?setStep(step+1):setDone(true)}>{step<3?"下一步":"确认预约"}</button></div></div>
    <p className="form-note">邮箱为必填项。预约后将同时发送确认邮件和账号激活邮件；激活后才可登录。</p></section></main>
}

export function SuccessPage(){return <main className="page-main"><section className="success-wrap shell"><span className="success-icon">✓</span><span className="eyebrow">预约成功</span><h1>时间已为你保留。</h1><p>确认邮件和账号激活邮件已发送至你的邮箱。</p><div className="appointment-card"><b>7 月 31 日（周五）10:00</b><span>张明 · 20 分钟免费咨询（预留 30 分钟）</span><span>腾讯会议 · 激活后可在 Portal 查看</span></div><div><Link className="button" href="/portal">查看学生 Portal</Link><Link className="button secondary" href="/">返回首页</Link></div><small>需要调整？可通过邮件取消，或微信联系 GeniLinks。</small></section></main>}

export function ContractPage(){return <main className="page-main"><PageHero eyebrow="签约中心" title="确认服务，再签署合同" text="先预览通用合同条款，再确认本次购买的服务、价格与折扣。" /><section className="section shell contract-grid"><div className="document"><div className="doc-head"><span>PDF</span><div><b>Geni Links 通用服务合同</b><small>版本 2026.07 · 12 页</small></div><button>预览</button></div>{["服务双方与基本定义","服务协作及交付规范","退款、暂停与终止条款","隐私和知识产权"].map((x,i)=><p key={x}><b>0{i+1}</b>{x}</p>)}</div><div className="confirmation"><span className="eyebrow">本次服务确认单</span><h2>美国研究生申请 · 标准版</h2><dl><div><dt>购买服务</dt><dd>留学申请全程服务</dd></div><div><dt>服务价格</dt><dd>待管理员配置</dd></div><div><dt>优惠折扣</dt><dd>待管理员配置</dd></div><div><dt>主导师</dt><dd>签约后分配</dd></div></dl><button className="button">预约 1 小时合同答疑</button><button className="button secondary">提交签字合同与付款凭证</button></div></section></main>}

function PageHero({eyebrow,title,text}:{eyebrow:string,title:string,text:string}){return <section className="page-hero"><div className="shell"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div></section>}

export type PortalKind="overview"|"progress"|"career"|"language"|"staff"|"admin"
export function PortalPage({kind}:{kind:PortalKind}){
 const config={
 overview:["学生首页","下午好，嘉伟","你的申请目前处于「文书准备」阶段。"],
 progress:["申请进度","6 个项目正在跟进","所有来源在学生可见前均经过人工复核。"],
 career:["求职指导","数据分析求职计划","从岗位定位到面试复盘，按任务推进。"],
 language:["语言指导","雅思冲刺计划","目标 7.0 · 下一次模考 8 月 3 日。"],
 staff:["员工工作台","今日需要关注 8 个节点","主导师、专项导师和顾问看到与职责匹配的任务。"],
 admin:["管理后台","服务与运营配置","配置服务、价格、人员分配和集成审核。"],
 }[kind]
 const nav=kind==="staff"?["工作台","学生 Cases","AI 初评","预约"]:kind==="admin"?["运营概览","服务与价格","人员分配","同步审核"]:["概览","申请进度","任务与文件","求职指导","语言指导","合同与付款"]
 return <main className="portal-page"><aside className="portal-side"><Link className="brand inverse" href="/"><span className="brand-mark">G</span><span>Geni Links<small>际联教育</small></span></Link><nav>{nav.map((x,i)=><Link className={i===0?"active":""} href={kind==="overview"&&i===1?"/portal/progress":"#"} key={x}><span>0{i+1}</span>{x}</Link>)}</nav><div className="side-help"><b>需要帮助？</b><span>微信联系 GeniLinks</span></div></aside><section className="portal-content"><header><div><small>{config[0]}</small><h1>{config[1]}</h1><p>{config[2]}</p></div><div className="user-chip">JW</div></header><DashboardContent kind={kind}/></section></main>
}

function DashboardContent({kind}:{kind:PortalKind}){
 if(kind==="progress")return <><div className="status-row">{[["6","申请项目"],["2","待确认节点"],["今天","最近同步"],["1","人工复核中"]].map(x=><div key={x[1]}><b>{x[0]}</b><span>{x[1]}</span></div>)}</div><div className="dash-grid"><div className="dash-card wide-card"><h3>申请项目</h3>{[["UCL","Data Science","文书准备","官网 API · 今天 09:20"],["USC","Computer Science","材料审核","手动更新 · 昨天"],["NYU","Information Systems","待提交","邮件解析 · 复核中"]].map(x=><div className="application-row" key={x[0]}><b>{x[0]}</b><span>{x[1]}</span><i>{x[2]}</i><small>{x[3]}</small></div>)}</div><div className="dash-card"><h3>进度来源</h3><p>API / Webhook</p><p>CSV 批量导入</p><p>邮件解析</p><p>人工更新兜底</p></div></div></>
 if(kind==="career"||kind==="language")return <><div className="status-row">{[["68%","计划进度"],["3","本周任务"],["1","待反馈"],["周五","下次会议"]].map(x=><div key={x[1]}><b>{x[0]}</b><span>{x[1]}</span></div>)}</div><div className="dash-grid"><div className="dash-card wide-card"><h3>{kind==="career"?"求职行动板":"学习计划"}</h3>{(kind==="career"?["完成岗位画像","重写数据分析简历","SQL 模拟面试","投递首批 10 个岗位"]:["完成阅读诊断","精听练习 3 组","写作 Task 2 批改","全真模考"]).map((x,i)=><div className="task-row" key={x}><span className={i<2?"check done":"check"}>✓</span><b>{x}</b><small>{i<2?"已完成":"本周"}</small></div>)}</div><div className="dash-card"><h3>服务负责人</h3><span className="avatar">{kind==="career"?"周":"许"}</span><b>{kind==="career"?"周言 · 求职顾问":"许宁 · 语言顾问"}</b><p>下一次 1:1 会议<br/>周五 16:00</p><button className="button">进入会议</button></div></div></>
 if(kind==="staff")return <><div className="status-row">{[["5","今日会议"],["8","待处理任务"],["3","AI 报告待审"],["2","风险 Case"]].map(x=><div key={x[1]}><b>{x[0]}</b><span>{x[1]}</span></div>)}</div><div className="dash-grid"><div className="dash-card wide-card"><h3>学生 Cases</h3>{["王同学 · 主申请","李同学 · CV 专项","陈同学 · 签证 Case"].map((x,i)=><div className="application-row" key={x}><b>{x}</b><span>{i===0?"主导师":"任务负责人"}</span><i>{i===2?"高优先级":"进行中"}</i><button>查看</button></div>)}</div><div className="dash-card"><h3>AI 初评报告</h3><b>生成后仅导师可见</b><p>导师微调后，可选择是否分享给学生。</p><button className="button">审核 3 份报告</button></div></div></>
 if(kind==="admin")return <><div className="status-row">{[["12","在服 Cases"],["4","服务产品"],["7","员工"],["3","同步待审核"]].map(x=><div key={x[1]}><b>{x[0]}</b><span>{x[1]}</span></div>)}</div><div className="dash-grid"><div className="dash-card wide-card"><h3>服务与价格配置</h3>{serviceData.map(x=><div className="application-row" key={x[0]}><b>{x[0]}</b><span>{x[1]}</span><i>价格待配置</i><button>编辑</button></div>)}</div><div className="dash-card"><h3>Case 人员分配</h3><p>主导师：唯一</p><p>专项导师：可多选</p><p>顾问 / 服务 Owner：按任务</p><button className="button">管理分配</button></div></div></>
 return <><div className="status-row">{[["42%","申请总体进度"],["3","本周任务"],["2","待确认文件"],["7/31","下次会议"]].map(x=><div key={x[1]}><b>{x[0]}</b><span>{x[1]}</span></div>)}</div><div className="dash-grid"><div className="dash-card wide-card"><h3>当前阶段 · 文书准备</h3><div className="progress-line"><i/><i/><i className="muted"/><i className="muted"/></div><div className="stage-labels"><span>方案确认</span><span>材料准备</span><span>网申提交</span><span>结果跟进</span></div><h3>接下来</h3>{["确认第一版 CV","补充项目经历素材","查看 UCL 选校说明"].map((x,i)=><div className="task-row" key={x}><span className="check">{i+1}</span><b>{x}</b><small>{i===0?"今天":"本周"}</small></div>)}</div><div className="dash-card"><h3>我的团队</h3><b>张明 · 主导师</b><p>申请策略与整体交付负责</p><b>林悦 · 专项导师</b><p>CV / PS 文书任务</p><button className="button">发送消息</button></div></div></>
}
