# 际联 SaaS 业务流程

可编辑版本：[FigJam 业务流程图](https://www.figma.com/board/1oi07jE1XXaDgxDqXJnHgS)

## 1. 学生首次咨询流程

```mermaid
flowchart LR
    visitor["访客浏览官网内容"] --> cta["点击免费评估"]
    cta --> profile["提交精简背景与隐私同意"]
    profile --> duplicate{"是否存在有效预约"}
    duplicate -->|"是"| manage["查看或改期现有预约"]
    duplicate -->|"否"| match["按服务类型匹配导师"]
    match --> calendar["读取导师可用时间"]
    calendar --> slot["学生选择时段"]
    slot --> reserve{"数据库占位是否成功"}
    reserve -->|"冲突"| calendar
    reserve -->|"成功"| account["创建待激活账号并发送激活邮件"]
    account --> meetingChoice{"会议链接方式"}
    meetingChoice -->|"自动"| meeting["创建腾讯会议"]
    meetingChoice -->|"手动"| manualMeeting["导师补充会议链接"]
    manualMeeting --> email["发送双方确认和提醒"]
    meeting --> email["发送双方确认和提醒"]
    email --> consult["进行 30 分钟初评（占用 45 分钟）"]
    consult --> qualify{"顾问资格评估"}
    qualify -->|"适合签约"| interest["学生表达签约兴趣"]
    interest --> contractPreview["解锁合同预览与 60 分钟答疑"]
    contractPreview --> proposal["进入服务方案流程"]
    qualify -->|"暂未成熟"| nurture["进入培育与跟进"]
    qualify -->|"不适合"| close["关闭线索并记录原因"]
```

## 2. 签约与付款流程

```mermaid
flowchart LR
    qualified["Qualified 线索"] --> activate["学生激活账号"]
    activate --> caseCreate["创建 Case / 申请季"]
    caseCreate --> assessment["顾问完善评估与服务范围"]
    assessment --> proposal["生成并发送服务方案"]
    proposal --> confirmation["生成服务确认单与价格快照"]
    confirmation --> accepted{"学生接受方案"}
    accepted -->|"否"| revise{"是否需要修改"}
    revise -->|"是"| assessment
    revise -->|"否"| close["培育或关闭"]
    accepted -->|"是"| contract["组合通用合同 PDF 与服务确认单"]
    contract --> signed{"上传签字合同 PDF"}
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
    docs --> review{"学生与导师审批"}
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

## 5. 关键状态责任

| 状态变化 | 发起角色 | 必填信息 |
|---|---|---|
| CONSULTED | 导师 | 咨询摘要、适配度、下一步 |
| QUALIFIED | 导师/管理员 | 推荐服务、预算/时间匹配 |
| PROPOSAL_SENT | 导师/销售 | 方案版本、价格、有效期 |
| CONTRACT_SIGNED | 学生与公司 | 合同快照、签署证据 |
| PAYMENT_VERIFIED | 财务/管理员 | 金额、时间、凭证、核验人 |
| ACTIVE | 系统 | 有效合同、满足付款条件、服务授权 |
| SUBMITTED | 导师/服务人员 | 递交时间、凭证、申请项 |
| COMPLETED | 管理员/负责人 | 交付检查、结果归档、满意度 |
