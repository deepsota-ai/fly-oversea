# 际联 SaaS 技术开发规格

## 1. 推荐架构

- Web：Next.js App Router + TypeScript；
- UI：Tailwind CSS + Radix/shadcn 组件；
- API：Next.js Route Handlers；复杂异步任务后续拆 Worker；
- 主数据库：Turso/libSQL；开发环境使用本地 SQLite；
- ORM：Prisma（上线 Turso 前锁定与 adapter 兼容的版本）；
- 鉴权：Auth.js/NextAuth，邮箱 Magic Link；员工可增加 MFA；
- 文件：S3 兼容私有对象存储；
- 邮件：Resend；
- 日历：平台排班为主，iCalendar 导入/导出；CalDAV 双向同步作为增强能力；
- 会议：腾讯会议开放平台；同时支持导师手动填写会议链接；
- 任务队列：Phase 1 可使用托管 Cron + 数据库 Outbox，Phase 3 引入队列；
- 可观测性：结构化日志、错误追踪和产品事件。

## 2. 模块边界

| 模块 | 职责 | 不负责 |
|---|---|---|
| Identity | 用户、角色、会话、激活 | Case 分配 |
| CRM | Lead、来源、跟进、转化 | 合同执行 |
| Scheduling | 导师规则、Busy、预约、提醒 | 顾问服务内容 |
| Case Management | Case、分配、状态 | 文件二进制 |
| Commerce | 方案、合同、付款、授权 | 在线支付清算（由供应商） |
| Delivery | 模板、里程碑、任务、交付物 | 内容营销 |
| Content | 页面、文章、案例、导师公开资料 | 私有学生资料 |
| Integrations | iCalendar、CalDAV、腾讯会议、邮件等适配器 | 核心业务状态 |
| Audit/Analytics | 审计、漏斗、指标 | 业务写入主逻辑 |

## 3. 状态枚举

```text
LeadStatus:
NEW | PROFILE_SUBMITTED | BOOKED | CONSULTED | QUALIFIED | NURTURE | CLOSED

CaseType:
STUDY_ABROAD | STUDENT_VISA | TOURIST_VISA

CaseStatus:
DRAFT | SALES | ONBOARDING | PLANNING | IN_PROGRESS |
SUBMITTED | RESULT_RECEIVED | COMPLETED | SUSPENDED | TERMINATED

AppointmentStatus:
PENDING | CONFIRMED | CANCELLED_BY_CLIENT | CANCELLED_BY_STAFF |
COMPLETED | NO_SHOW

ProposalStatus:
DRAFT | SENT | ACCEPTED | REJECTED | EXPIRED

ContractStatus:
DRAFT | SENT | PARTIALLY_SIGNED | SIGNED | VOID | TERMINATED

PaymentStatus:
PENDING | UNDER_REVIEW | PAID | FAILED | REFUNDED | PARTIALLY_REFUNDED

TaskStatus:
TODO | IN_PROGRESS | BLOCKED | IN_REVIEW | DONE | CANCELLED
```

## 4. 核心表

### Identity

- `users(id, email, email_verified_at, status, created_at)`
- `roles(id, code, name)`
- `user_roles(user_id, role_id, granted_by, granted_at)`
- `student_profiles(user_id, legal_name, preferred_name, phone, wechat, timezone, ...)`
- `staff_profiles(user_id, staff_type, bio, languages, active, ...)`

### CRM 与预约

- `leads(id, email, phone, wechat, source, utm_json, status, owner_id, ...)`
- `lead_profiles(lead_id, service_type, education_json, targets_json, concerns, consent_id)`
- `availability_rules(id, consultant_id, timezone, days_json, start_time, end_time, buffer_min)`
- `calendar_sources(id, consultant_id, source_type, ical_url_encrypted, caldav_config_encrypted, sync_status, synced_at)`
- `calendar_busy_blocks(id, source_id, external_uid, start_at, end_at, etag, refreshed_at)`
- `oauth_connections(id, user_id, provider, encrypted_tokens, expires_at, status)`
- `appointments(id, lead_id, case_id, consultant_id, start_at, end_at, status, meeting_provider, meeting_url, meeting_external_id, idempotency_key)`
- 唯一约束：`(consultant_id, start_at)`；`idempotency_key` 唯一。

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
- `payment_plans(id, contract_id, due_at, amount, unlocks_service)`
- `payments(id, payment_plan_id, amount, method, status, payer_name, proof_url, verified_by, verified_at)`
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

### 横切能力

- `notifications(id, recipient_id, channel, template, payload_json, status, scheduled_at, sent_at)`
- `outbox_events(id, event_type, aggregate_id, payload_json, status, attempts, next_attempt_at)`
- `consents(id, subject_type, subject_id, policy_version, purpose, accepted_at, evidence_json)`
- `audit_logs(id, actor_id, action, object_type, object_id, before_json, after_json, created_at)`

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
POST   /api/payments/:planId/proof
GET    /api/cases/:id/tasks
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
```

### API 规则

- 写操作接受 `Idempotency-Key`；
- 时间使用 ISO 8601 UTC，显示层转换时区；
- 错误结构：`{ code, message, fieldErrors?, requestId }`；
- 列表统一 cursor pagination；
- 资源授权同时检查角色和 Case assignment；
- webhook 先验签、落库、幂等，再异步处理。

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

| 资源 | 学生 | 分配导师 | 服务人员 | 管理员 |
|---|---|---|---|---|
| 自己的 Case | 读 | 读写 | 按分配读写 | 全部 |
| 咨询记录 | 读摘要 | 读写 | 按需读 | 全部 |
| 合同/付款 | 自己读/签/上传 | 读 | 无或只读 | 读写/核验 |
| 交付物 | 自己读写 | 读写 | 读写 | 全部 |
| 角色与分配 | 无 | 无 | 无 | 读写 |
| OAuth Token | 无 | 仅连接/断开自己的 | 无 | 只看状态 |
| 审计日志 | 无 | 无 | 无 | 只读 |

## 8. 集成降级

| 集成 | 正常路径 | 失败路径 |
|---|---|---|
| iCalendar/CalDAV | 导入 Busy 或双向同步事件 | 继续使用平台排班；显示同步时间和失败提示 |
| 腾讯会议 | 自动建会、取消会议并发送链接 | 预约保留，创建补偿任务，邮件说明链接稍后补充 |
| 手动会议链接 | 导师粘贴腾讯会议或其他会议 URL | 保存前校验 URL；未补充时持续提醒导师和管理员 |
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
