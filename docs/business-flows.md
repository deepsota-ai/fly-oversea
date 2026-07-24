# 际联 SaaS 业务流程

可编辑版本：[FigJam 业务流程图](https://www.figma.com/board/1oi07jE1XXaDgxDqXJnHgS)

## 1. 学生首次咨询流程

```mermaid
flowchart LR
    visitor["访客浏览官网内容"] --> cta["点击免费评估"]
    cta --> profile["提交精简背景与隐私同意"]
    profile --> duplicate{"是否存在有效预约"}
    duplicate -->|"是"| manage["查看或改期现有预约"]
    duplicate -->|"否"| match["按服务类型匹配导师或签证顾问"]
    match --> calendar["读取服务人员可用时间"]
    calendar --> slot["学生选择时段"]
    slot --> reserve{"数据库占位是否成功"}
    reserve -->|"冲突"| calendar
    reserve -->|"成功"| account["创建待激活账号并发送激活邮件"]
    account --> meetingChoice{"会议链接方式"}
    meetingChoice -->|"自动"| meeting["创建腾讯会议"]
    meetingChoice -->|"手动"| manualMeeting["负责咨询的服务人员补充会议链接"]
    manualMeeting --> email["发送双方确认和提醒"]
    meeting --> email["发送双方确认和提醒"]
    email --> consult["进行 20 分钟免费初评（占用 45 分钟）"]
    consult --> qualify{"主导师或签证顾问资格评估"}
    qualify -->|"适合签约"| interest["学生表达签约兴趣"]
    interest --> contractPreview["解锁合同预览与 60 分钟答疑"]
    contractPreview --> proposal["进入服务方案流程"]
    qualify -->|"暂未成熟"| nurture["进入培育与跟进"]
    qualify -->|"不适合"| close["关闭线索并记录原因"]
```

预约规则：免费首次评估对外展示 20 分钟并占用 45 分钟时段；默认在会议开始前 24 小时提醒；学生可在会议开始前 12 小时通过邮件签名链接自助取消或改期。学生也可通过官网微信客服入口发起人工咨询，客服补录 Lead 和来源渠道。

## 2. 签约与付款流程

```mermaid
flowchart LR
    qualified["Qualified 线索"] --> activate["学生激活账号"]
    activate --> caseCreate["创建 Case / 申请季"]
    caseCreate --> assessment["主导师或签证顾问完善评估与服务范围"]
    assessment --> proposal["生成并发送服务方案"]
    proposal --> confirmation["生成服务确认单与价格快照"]
    confirmation --> accepted{"学生接受方案"}
    accepted -->|"否"| revise{"是否需要修改"}
    revise -->|"是"| assessment
    revise -->|"否"| close["培育或关闭"]
    accepted -->|"是"| contract["组合通用合同条款与本次服务确认单"]
    contract --> signed{"上传签署后的合同包 PDF"}
    signed -->|"否"| contract
    signed -->|"是"| payment["生成一次性付款记录"]
    payment --> proof["上传付款凭证"]
    proof --> verified{"付款是否核验"}
    verified -->|"否"| correction["补充凭证或人工处理"]
    correction --> proof
    verified -->|"是"| entitlement["按 Service Item 创建授权"]
    entitlement --> onboarding["Case 进入 Onboarding"]
```

## 3. 留学服务交付流程

```mermaid
flowchart LR
    onboarding["Onboarding"] --> template["按套餐生成里程碑、任务与交付物"]
    template --> profile["补全背景与材料"]
    profile --> strategy["定位与选校策略"]
    strategy --> plan["确认申请清单与截止日期"]
    plan --> docs["CV/PS/Essay 等文档协作"]
    docs --> review{"学生与主导师审批"}
    review -->|"修改"| docs
    review -->|"通过"| submitReady["申请材料就绪"]
    submitReady --> submit["递交申请"]
    submit --> track["跟踪补件、面试和结果"]
    track --> result{"收到结果"}
    result -->|"待定/补件"| track
    result -->|"录取"| decision["选 Offer 与后续签证"]
    result -->|"未录取"| adjust["复盘并调整剩余申请"]
    adjust --> track
    decision --> archive["完成、满意度与归档"]
```

## 4. 签证服务交付流程

```mermaid
flowchart LR
    onboarding["Onboarding"] --> checklist["按国家与签证类型生成材料清单"]
    checklist --> collect["学生上传材料"]
    collect --> review["顾问审阅完整性与一致性"]
    review --> ready{"材料是否就绪"}
    ready -->|"否"| collect
    ready -->|"是"| booking["准备或预约生物信息/面谈"]
    booking --> submit["学生确认后递交"]
    submit --> supplement{"是否要求补件"}
    supplement -->|"是"| collect
    supplement -->|"否"| decision["等待签证决定"]
    decision --> result{"结果"}
    result -->|"通过"| complete["交付结果、行前提示与归档"]
    result -->|"拒签"| reviewCase["解释结果并评估重申/申诉边界"]
```

## 5. 求职与语言指导交付流程

```mermaid
flowchart LR
    active["服务授权生效"] --> type{"服务类型"}
    type -->|"求职指导"| careerAssess["职业目标与能力诊断"]
    careerAssess --> careerPlan["生成岗位、简历、面试与行动计划"]
    careerPlan --> careerTasks["执行任务与导师反馈"]
    careerTasks --> careerReview{"阶段复盘"}
    careerReview -->|"继续迭代"| careerTasks
    careerReview -->|"目标完成"| complete["结果记录与归档"]
    type -->|"语言指导"| languageAssess["目标与当前水平诊断"]
    languageAssess --> languagePlan["生成学习与阶段测评计划"]
    languagePlan --> languageTasks["练习任务、批改与反馈"]
    languageTasks --> languageReview{"阶段测评"}
    languageReview -->|"未达目标"| languagePlan
    languageReview -->|"达到目标"| complete
```

## 6. 申请进度跟进与外部集成流程

```mermaid
flowchart LR
    source["院校/签证外部来源"] --> adapter["进度适配器抓取或导入"]
    adapter --> raw["保存原始状态、来源与同步时间"]
    raw --> mapping["映射为平台标准状态"]
    mapping --> conflict{"是否与人工确认状态冲突"}
    conflict -->|"是"| review["标记待核对并通知负责人"]
    review --> confirm["服务人员确认最终状态"]
    conflict -->|"否"| confirm
    confirm --> publish["发布给学生并记录审计日志"]
    adapter -->|"失败"| manual["保留平台人工更新，不中断服务"]
```

## 7. 关键状态责任

| 状态变化 | 发起角色 | 必填信息 |
|---|---|---|
| CONSULTED | 负责咨询的服务人员 | 咨询摘要、适配度、下一步 |
| QUALIFIED | 导师/管理员 | 推荐服务、预算/时间匹配 |
| PROPOSAL_SENT | 主导师/管理员 | 方案版本、价格、有效期 |
| CONTRACT_SIGNED | 学生与公司 | 合同快照、签署证据 |
| PAYMENT_VERIFIED | 财务/管理员 | 金额、时间、凭证、核验人 |
| ACTIVE | 系统 | 有效合同、满足付款条件、服务授权 |
| SUBMITTED | 主导师/签证顾问 | 递交时间、凭证、申请项 |
| COMPLETED | 管理员/负责人 | 交付检查、结果归档、满意度 |
