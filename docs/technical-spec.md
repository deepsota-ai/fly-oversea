# 际联 SaaS 技术开发规格

## 1. 推荐架构

- Web：Next.js App Router + TypeScript；
- 官网 UI：以仓库内 `geni-edtech/`（基于 Si Educational，Next.js 15.2.4 + Tailwind CSS v4）作为视觉和营销组件基线；
- Portal UI：复用其设计 Token，并按业务需要引入 Radix/shadcn 交互组件；
- API：Next.js Route Handlers；复杂异步任务后续拆 Worker；
- 主数据库：Turso/libSQL；开发环境使用本地 SQLite；
- ORM：Prisma（上线 Turso 前锁定与 adapter 兼容的版本）；
- 鉴权：Auth.js/NextAuth，邮箱 Magic Link；员工可增加 MFA；
- 文件：S3 兼容私有对象存储；
- 邮件：Resend；
- 日历：平台排班为主，iCalendar 导入/导出；CalDAV 双向同步作为增强能力；
- 会议：腾讯会议开放平台；同时支持负责咨询的服务人员手动填写会议链接；
- 任务队列：Phase 1 可使用托管 Cron + 数据库 Outbox，Phase 3 引入队列；
- 可观测性：结构化日志、错误追踪和产品事件。

## 2. 模块边界

| 模块 | 职责 | 不负责 |
|---|---|---|
| Identity | 用户、角色、会话、激活 | Case 分配 |
| CRM | Lead、来源、跟进、转化 | 合同执行 |
| Scheduling | 服务人员规则、Busy、预约、提醒 | 咨询与服务交付内容 |
| Case Management | Case、分配、状态 | 文件二进制 |
| Commerce | 方案、合同、付款、授权 | 在线支付清算（由供应商） |
| Delivery | 模板、里程碑、任务、交付物 | 内容营销 |
| Content | 页面、文章、案例、导师公开资料 | 私有学生资料 |
| Integrations | iCalendar、CalDAV、腾讯会议、邮件、申请进度等适配器 | 核心业务状态 |
| Audit/Analytics | 审计、漏斗、指标 | 业务写入主逻辑 |

## 3. 状态枚举

```text
LeadStatus:
NEW | PROFILE_SUBMITTED | BOOKED | CONSULTED | QUALIFIED | NURTURE | CLOSED

CaseType:
STUDY_ABROAD | STUDENT_VISA | TOURIST_VISA | CAREER_COACHING | LANGUAGE_COACHING

CaseStatus:
DRAFT | SALES | ONBOARDING | PLANNING | IN_PROGRESS |
SUBMITTED | RESULT_RECEIVED | COMPLETED | SUSPENDED | TERMINATED

AppointmentStatus:
PENDING | CONFIRMED | CANCELLED_BY_CLIENT | CANCELLED_BY_STAFF |
COMPLETED | NO_SHOW

ProposalStatus:
DRAFT | SENT | ACCEPTED | REJECTED | EXPIRED

ContractStatus:
DRAFT | READY_TO_SIGN | SIGNED | VOID | TERMINATED

PaymentStatus:
PENDING | UNDER_REVIEW | PAID | FAILED | REFUNDED | PARTIALLY_REFUNDED

TaskStatus:
TODO | IN_PROGRESS | BLOCKED | IN_REVIEW | DONE | CANCELLED

ProgressReviewStatus:
PENDING_REVIEW | CONFIRMED | REJECTED | CONFLICT
```

## 4. 核心表

### Identity

- `users(id, email, email_verified_at, status, created_at)`
- `roles(id, code, name)`
- `user_roles(user_id, role_id, granted_by, granted_at)`
- `student_profiles(user_id, legal_name, preferred_name, phone, wechat, timezone, ...)`
- `staff_profiles(user_id, staff_type, bio, languages, capability_tags_json, active, ...)`

### CRM 与预约

- `leads(id, email, phone, wechat, preferred_contact_channel, source, utm_json, status, owner_id, ...)`
- `lead_profiles(lead_id, service_type, education_json, targets_json, concerns, consent_id)`
- `availability_rules(id, staff_id, timezone, days_json, start_time, end_time, buffer_min)`
- `calendar_sources(id, staff_id, source_type, ical_url_encrypted, caldav_config_encrypted, sync_status, synced_at)`
- `calendar_busy_blocks(id, source_id, external_uid, start_at, end_at, etag, refreshed_at)`
- `oauth_connections(id, user_id, provider, encrypted_tokens, expires_at, status)`
- `appointments(id, lead_id, case_id, staff_id, start_at, end_at, status, meeting_provider, meeting_url, meeting_external_id, idempotency_key)`
- 唯一约束：`(staff_id, start_at)`；`idempotency_key` 唯一。

### 商务

- `cases(id, student_id, case_type, intake, status, owner_id, ...)`
- `case_assignments(case_id, user_id, assignment_role, active)`
- `proposals(id, case_id, version, status, valid_until, currency, total_amount, snapshot_json)`
- `proposal_items(id, proposal_id, product_id, quantity, amount, scope_json)`
- `service_confirmations(id, case_id, proposal_id, version, status, currency, subtotal, discount_type, discount_value, final_amount, snapshot_json, valid_until)`
- `service_confirmation_items(id, confirmation_id, product_id, product_name, service_code, scope_json, list_price, discount_amount, final_price)`
- `contract_templates(id, name, version, document_url, active, effective_at)`
- `contracts(id, case_id, proposal_id, confirmation_id, template_id, status, signed_document_url, signer_name, snapshot_hash, ...)`
- `contract_signatures(id, contract_id, signer_id, signed_at, evidence_json)`
- `payment_requests(id, contract_id, due_at, amount, unlocks_service)`；MVP 每份合同仅创建一条一次性付款请求
- `payments(id, payment_request_id, amount, method, status, payer_name, proof_url, verified_by, verified_at)`
- `entitlements(id, case_id, service_code, starts_at, ends_at, status)`

### 交付

- `service_templates(id, case_type, product_code, version, active)`
- `milestone_templates` / `task_templates` / `deliverable_templates`
- `milestones(id, case_id, title, due_at, status, template_version)`
- `tasks(id, case_id, milestone_id, assignee_id, title, due_at, status, dependency_json)`
- `deliverables(id, case_id, task_id, type, status, current_version_id)`
- `document_versions(id, deliverable_id, storage_key, version, uploaded_by, checksum, created_at)`
- `comments(id, object_type, object_id, author_id, body, visibility, created_at)`
- `application_items(id, case_id, institution, program, round, deadline, status, result)`
- `visa_applications(id, case_id, country, visa_type, status, submitted_at, decision)`
- `career_plans(id, case_id, target_roles_json, status, current_resume_version_id, outcome_json)`
- `language_plans(id, case_id, language, exam_type, target_score, current_level, status, outcome_json)`
- `integration_connections(id, provider, connection_type, sync_mode, encrypted_config, status, last_synced_at)`；`sync_mode` 支持 `API | WEBHOOK | CSV_IMPORT | EMAIL_PARSE`
- `progress_sync_records(id, application_item_id, visa_application_id, connection_id, external_id, raw_status, mapped_status, review_status, synced_at, error_json)`

### 横切能力

- `notifications(id, recipient_id, channel, template, payload_json, status, scheduled_at, sent_at)`
- `outbox_events(id, event_type, aggregate_id, payload_json, status, attempts, next_attempt_at)`
- `consents(id, subject_type, subject_id, policy_version, purpose, accepted_at, evidence_json)`
- `audit_logs(id, actor_id, action, object_type, object_id, before_json, after_json, created_at)`

合同签署约束：

- MVP 将“通用合同条款 + 本次服务确认单”组合为同一个合同包；
- 学生上传一份签署后的合同包 PDF，作为两部分共同的签署证据；
- 合同包必须保存模板版本、服务确认单价格快照和文件校验值，后续商品改价不得影响历史合同。

## 5. API 约定

### 公开 API

```text
POST   /api/public/leads
GET    /api/public/consultants?serviceType=&country=
GET    /api/public/consultants/:id/availability?from=&to=&timezone=
POST   /api/public/appointments
GET    /api/public/appointments/:token
PATCH  /api/public/appointments/:token
POST   /api/auth/activate
POST   /api/public/contact-events
```

### 学生 API

```text
GET    /api/me
GET    /api/me/cases
POST   /api/me/cases
GET    /api/cases/:id
GET    /api/cases/:id/plan
GET    /api/cases/:id/proposal
POST   /api/proposals/:id/accept
GET    /api/cases/:id/service-confirmation
GET    /api/cases/:id/contract
POST   /api/contracts/:id/sign
POST   /api/payments/:requestId/proof
GET    /api/cases/:id/tasks
GET    /api/cases/:id/progress
POST   /api/deliverables/:id/versions
POST   /api/deliverables/:id/comments
```

### 员工/管理员 API

```text
GET    /api/staff/appointments
PATCH  /api/staff/appointments/:id
GET    /api/staff/cases
PATCH  /api/staff/cases/:id/status
POST   /api/staff/cases/:id/assignments
POST   /api/staff/cases/:id/proposals
POST   /api/staff/proposals/:id/service-confirmations
POST   /api/admin/contracts/:id/verify
POST   /api/admin/payments/:id/verify
POST   /api/admin/templates
PATCH  /api/admin/users/:id/roles
POST   /api/staff/progress/:id/confirm
POST   /api/admin/integrations/progress-connections
POST   /api/integrations/progress/:provider/sync
```

### API 规则

- 写操作接受 `Idempotency-Key`；
- 时间使用 ISO 8601 UTC，显示层转换时区；
- 错误结构：`{ code, message, fieldErrors?, requestId }`；
- 列表统一 cursor pagination；
- 资源授权同时检查角色和 Case assignment；
- webhook 先验签、落库、幂等，再异步处理。

### 预约业务常量

- 免费首次背景评估对外展示时长：20 分钟；
- 首次背景评估实际占用时段：45 分钟；
- 初评通过且学生表达签约兴趣后，合同及其他问题答疑会议：60 分钟；
- 学生通过邮件签名链接自助取消或改期的截止时间：会议开始前 12 小时；
- 默认预约提醒：会议开始前 24 小时；
- 所有时长与截止规则由服务端校验，前端只负责展示，不得仅依赖客户端限制。

## 6. 领域事件

```text
lead.profile_submitted
appointment.confirmed
appointment.cancelled
consultation.completed
lead.qualified
proposal.sent
proposal.accepted
contract.signed
payment.verified
case.activated
task.overdue
deliverable.approved
application.submitted
case.completed
```

事件通过 Outbox 写入，消费者负责邮件、提醒、统计和第三方同步，避免主事务成功但通知丢失。

## 7. 权限矩阵

`staff_type` 使用 `MENTOR | CONSULTANT`。能力层级为 `MENTOR` 包含 `CONSULTANT` 的基础任务能力。

`assignment_role` 使用 `PRIMARY_MENTOR | SPECIALIST_MENTOR | VISA_OWNER | SERVICE_OWNER | TASK_CONTRIBUTOR`。

约束：

- `STUDY_ABROAD` Case 必须且只能有一个 `PRIMARY_MENTOR`；
- `STUDY_ABROAD` Case 可以有多个 `SPECIALIST_MENTOR`；
- `MENTOR` 可以成为 `PRIMARY_MENTOR`、`SPECIALIST_MENTOR` 或 `TASK_CONTRIBUTOR`；
- `CONSULTANT` 不能成为 `STUDY_ABROAD.owner_id`；
- `CONSULTANT` 可以成为签证 Case 的 `VISA_OWNER`；
- 具有对应 `capability_tags` 的 `MENTOR` 或 `CONSULTANT` 可以成为求职/语言 Case 的 `SERVICE_OWNER`；
- 留学 Case 中的专项导师权限来自 Case assignment，具体写权限仍受职责范围和 Task assignment 限制；
- 留学 Case 中的顾问权限来自 Task assignment，不因参与一个 Task 自动获得完整 Case 权限；
- 管理员可同时具有 `MENTOR` 或 `CONSULTANT` staff type。

| 资源 | 学生 | 主导师 | 专项导师 | 顾问 | 管理员 |
|---|---|---|---|---|---|
| 自己的留学 Case | 读 | 负责的 Case 读写 | 被分配 Case 只读，职责范围内写 | 仅按 Task 最小范围访问 | 全部 |
| 自己的签证 Case | 读 | 按分配访问 | 按分配访问 | 作为 VISA_OWNER 时读写 | 全部 |
| 自己的求职/语言 Case | 读 | 作为 SERVICE_OWNER 或按 Task 分配访问 | 按 Task 分配访问 | 作为 SERVICE_OWNER 或按 Task 分配访问 | 全部 |
| 咨询记录 | 读摘要 | 负责的咨询读写 | 按分配读写 | 负责的咨询读写 | 全部 |
| AI 初评报告 | 分享后可读 | 负责首次咨询时读写并决定分享 | 被分配且任务需要时可读写 | 负责签证首次咨询时读写并决定分享 | 全部 |
| 合同/付款 | 自己读/签/上传 | 读 | 只读 | 无或只读 | 读写/核验 |
| 交付物 | 自己读写 | 负责的 Case 读写 | 被分配的 Task/文件读写 | 被分配的 Task/文件读写 | 全部 |
| 角色与分配 | 无 | 无 | 无 | 无 | 读写 |
| OAuth Token | 无 | 仅连接/断开自己的 | 仅连接/断开自己的 | 仅连接/断开自己的 | 只看状态 |
| 审计日志 | 无 | 无 | 无 | 无 | 只读 |

## 8. 集成降级

| 集成 | 正常路径 | 失败路径 |
|---|---|---|
| iCalendar/CalDAV | 导入 Busy 或双向同步事件 | 继续使用平台排班；显示同步时间和失败提示 |
| 腾讯会议 | 自动建会、取消会议并发送链接 | 预约保留，创建补偿任务，邮件说明链接稍后补充 |
| 手动会议链接 | 负责咨询的服务人员粘贴腾讯会议或其他会议 URL | 保存前校验 URL；未补充时持续提醒负责人和管理员 |
| 申请进度适配器 | 导入外部申请状态，映射后由服务人员确认发布 | 保留原始同步记录并回退到平台人工维护；不得阻塞 Case |
| Resend | 异步发送 | Outbox 重试，后台显示失败并允许重发 |
| 对象存储 | 上传并校验 | 不创建 DocumentVersion，返回可重试错误 |
| LLM | 生成草稿 | 不影响业务状态，允许人工完成 |

## 9. 测试策略

- 单元测试：Slot 算法、状态机、权限、价格与授权；
- 集成测试：iCalendar/CalDAV、腾讯会议和邮件适配器使用 Mock Server；
- API 测试：幂等、并发双订、越权、分页、Webhook 重放；
- E2E：访客预约、学生激活签约、付款核验、交付物审批；
- 安全测试：IDOR、Token 泄漏、文件类型、速率限制；
- 响应式测试：360、768、1024、1440 宽度；
- 可访问性：键盘、焦点、表单错误、对比度、语义标题。

## 10. Definition of Done

- 需求有状态、角色、异常分支和验收标准；
- API 有鉴权、校验、幂等、错误码和审计；
- 数据库迁移可回滚且有索引；
- 关键流程有自动化测试；
- 第三方失败不造成核心状态不一致；
- 日志、指标和告警可定位问题；
- 中文移动端和桌面端通过设计验收；
- 隐私、授权和内容发布检查完成。
