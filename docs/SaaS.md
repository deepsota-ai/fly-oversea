# 留学咨询平台 — 产品需求文档

## 业务背景

面向中国学生的线上留学咨询服务平台，连接学生与专业留学顾问。目标是将传统微信一对一沟通模式升级为可规模化的在线服务体系。

## 前端框架：Shadboard

使用 **shadboard full-kit** 作为前端基础模板，技术栈为：
- **Next.js 15** + TypeScript + Tailwind CSS v4
- **Prisma** (数据库 ORM，PostgreSQL)
- **NextAuth v4**（身份认证）
- **FullCalendar**（日历与预约）
- **react-hook-form + zod**（表单与验证）
- **Recharts**（数据图表）
- **shadcn/ui** (Radix UI 组件库)
- 内置 i18n 多语言路由（`[lang]/`）

Shadboard 已提供的可复用页面/模块见各 Phase 说明。

---

## 用户角色

| 角色 | 描述 |
|------|------|
| **学生** | 有出国留学意向的申请者，需要咨询、材料、申请全流程服务 |
| **顾问/导师** | 提供咨询服务的专业人员，管理自己的学生和排期 |
| **管理员** | 平台运营方，管理订单、财务、人员配置 |

---

## 分阶段规划

### Phase 1 — 上线获客（当前目标）

**目标**：快速上线，建立品牌形象，自动化获客和预约流程

#### 1. 公司主页

**复用 shadboard**：`landing` 页面模板，已有以下区块，直接替换内容即可：
- `hero.tsx` → 品牌 Hero（Slogan + "预约免费咨询" CTA）
- `core-benefits.tsx` → 服务优势介绍
- `core-features.tsx` → 留学服务内容（选校/文书/申请）
- `faqs.tsx` → 常见问题
- `contact-us.tsx` + `contact-us-form.tsx` → 联系方式 + 简单联系表单
- `landing-header.tsx` / `landing-footer.tsx` → 导航和页脚

**需要新增的内容区块**（shadboard 无现成模板）：
- 导师介绍区块（照片、资历、擅长方向）
- 学生案例 / Testimonial 轮播（录取学校、学生评价）
- 微信二维码展示区

#### 2. 学生背景信息收集 + 预约入口

**新建页面**：点击主页 CTA 后进入，三步流程：

**Step 1 — 背景表单**（使用 shadboard 的 react-hook-form + zod 表单体系）
- 姓名、微信号、邮箱
- 当前学校、专业、GPA（及满分标准）
- 预计毕业年份
- 目标国家（多选：美国 / 英国 / 加拿大 / 澳大利亚 / 香港 / 新加坡 / 其他）
- 目标学位（本科 / 硕士 / 博士 / 语言学校）
- 标化考试情况（托福/雅思/GRE/GMAT，可选填）
- 备注

**Step 2 — 选择导师**
- 展示平台所有可预约导师卡片（照片、背景、擅长方向、可用时间提示）
- 学生选择一位导师后进入 Step 3

**Step 3 — 选择预约时间**（复用 shadboard `apps/calendar`，数据源为 Google Calendar）
- 拉取所选导师从 Google Calendar 同步的 available 时间段（接下来 14 天）
- 已被预约的时段自动屏蔽（平台侧去重，不依赖 Google Calendar）
- 学生选择时段并确认
- 预约确认后：
  - 系统发送确认邮件给学生和导师（含预约时间、导师信息）
  - 自动生成视频会议链接附在邮件中（见"视频会议集成"）
- 预约前 24 小时自动发送提醒邮件

> **设计原则**：预约系统的数据模型和 UI 在 Phase 1 就按多导师架构设计，Phase 3 顾问端直接复用，无需重构。

---

#### 视频会议集成 — Zoom（Phase 1 随预约一起实现）

预约确认后自动生成 Zoom 会议链接：
- 顾问通过 **Zoom OAuth**（个人账号，无需企业资质）授权绑定平台
- 学生确认预约时，后端调用 **Zoom Create Meeting API** 生成专属会议链接
- 会议链接附在发给双方的确认邮件中
- Zoom 会议参数：时长 20 分钟、仅限受邀者加入、到时自动结束

---

#### 顾问后台 — Google Calendar 绑定与可用时间管理

**Google Calendar 集成**（Phase 1 核心后端）：
- 顾问通过 **Google OAuth** 授权绑定自己的 Google Calendar（个人账号即可）
- 系统拉取顾问日历的忙碌时段（Free/Busy API），计算出空闲窗口
- 顾问可在平台内额外设置"可接受预约"的时间窗口（如仅工作日 10:00–18:00），与 Google Calendar 空闲状态取交集，得出最终 available 时段
- 顾问端日历视图显示：Google Calendar 已有事件（只读，灰显）+ 平台预约记录（带学生信息）

**数据同步策略**：
- Phase 1：单向同步（平台只读 Google Calendar，不写入），避免权限复杂度
- Phase 2+：升级为双向同步，预约确认后自动在 Google Calendar 创建事件

---

### Phase 2 — 签约成交

**目标**：线上完成注册、选购套餐、支付、签约

#### 3. 会员注册与账号管理

**直接复用 shadboard**：
- `sign-in` / `register` / `forgot-password` / `verify-email` → 认证页面完整可用
- `account/profile` → 用户资料页
- `account/settings` → 账号设置（安全、通知、套餐与账单）

**新增**：角色分配逻辑（学生 / 顾问 / 管理员），注册时默认学生角色，顾问由管理员后台创建。

#### 4. 服务套餐与定价

**直接复用 shadboard**：
- `pages/pricing` → 套餐定价展示页，直接替换套餐内容

**需新增**：
- 管理员后台配置套餐（名称、服务内容、价格、服务时长）

#### 5. 在线支付

**复用 shadboard**：
- `pages/payment` → 支付页面框架

**需新增/替换**：
- 集成支付宝 / 微信支付（替换 shadboard 默认的 Stripe 支付）
- `account/settings/plan-and-billing` → 付款记录与发票下载

#### 6. 自动生成合同 + 电子签

**全部新建**（shadboard 无相关模板）：
- 付款成功后根据模板自动生成咨询协议（PDF）
- 集成第三方电子签平台（法大大 / 签名宝）
- 合同归档，学生/顾问端可查看

#### 7. 第三方工具集成

**视频会议**（Zoom，Phase 2 完成集成，Phase 1 已完成个人账号 OAuth 集成）：
- 顾问绑定 Zoom 个人账号（OAuth），预约确认时自动生成会议链接

**飞书文档**：
- 签约后自动为学生创建专属飞书工作空间（材料协作用）

---

### Phase 3 — 服务交付

**目标**：为三个角色提供结构化工作门户

#### 8. 学生端门户

**复用 shadboard**：
- `apps/kanban` → 申请进度看板（各学校申请状态）
- `apps/calendar` → 查看历史/即将到来的咨询预约
- `extended-ui/file-dropzone` → 材料上传（成绩单、CV、文书、推荐信）
- `account/profile` → 个人背景信息管理

**新建**：
- 申请记录详情（每所学校：专业、截止日期、状态、结果）
- 截止日期提醒
- 合同与付款历史查看

#### 9. 顾问端门户

**复用 shadboard**：
- `dashboards/crm` → 学生 CRM 总览（活跃学生、跟进时间线、转化率）
- `apps/calendar` → 排课管理（所有预约日历视图）
- `apps/kanban` → 学生任务/行动项管理
- `extended-ui/editor` (TipTap) → 咨询记录富文本笔记

**新建**：
- 每个学生的详情页（背景、文件、咨询记录、申请进度）
- 批注/评论学生上传的材料

#### 10. 管理端门户

**复用 shadboard**：
- `dashboards/analytics` → 平台数据统计（线索量、转化率、营收趋势）
- `dashboards/ecommerce` → 订单管理（复用商品订单界面改造）
- `apps/email` → 系统邮件管理

**新建**：
- 顾问管理（添加/删除/分配学生）
- 财务汇总（应收/实收/退款）
- 录取结果统计

---

### Phase 4 — AI 赋能

**目标**：用 AI 工具提升效率和体验

| 功能 | 描述 | 前端复用 |
|------|------|----------|
| **文书初稿生成** | 根据背景和目标项目生成 SOP/PS 初稿 | TipTap 编辑器展示和编辑结果 |
| **CV 评分与建议** | 分析 CV，给出评分和改进建议 | 新建评分结果展示页 |
| **选校推荐** | 生成冲刺/匹配/保底学校列表 | Kanban 或 Table 展示 |
| **模拟面试** | AI 驱动面试模拟，提供反馈 | 新建对话式交互页面 |

---

## 全局要求

- 界面语言：简体中文为主（利用 shadboard 内置 i18n 体系添加 `zh` locale）
- 必须兼容微信内置浏览器（WeChat WebView）
- 学生个人信息处理符合《个人信息保护法》（PIPL）
- 所有支付流程符合中国金融合规要求

---

## 总结：Shadboard 复用 vs 新建

| 功能模块 | Shadboard 可直接复用 | 需新建/定制 |
|----------|---------------------|-------------|
| 公司主页 | landing 模板框架 | 导师介绍、Testimonial、微信二维码区块 |
| 认证流程 | sign-in / register / verify-email | 角色分配逻辑 |
| 预约日历 | apps/calendar (FullCalendar) | Google Calendar 同步、导师选择、防重复预约、邮件提醒 |
| 学生背景表单 | react-hook-form + zod 体系 | 表单页面本身（新建） |
| 套餐定价 | pricing 页面 | 管理员套餐配置后台 |
| 支付页面 | payment 页面框架 | 替换为支付宝/微信支付 |
| CRM | dashboards/crm | 学生详情页、材料批注 |
| 申请进度 | apps/kanban | 学校级别的申请记录 |
| 材料上传 | file-dropzone | 分类管理、与学生账号关联 |
| 数据统计 | dashboards/analytics | 留学业务专属指标 |
| 订单管理 | dashboards/ecommerce | 合同状态、退款流程 |
| 合同与电子签 | ❌ 无 | 全部新建（集成法大大等） |
| Zoom 视频会议 | ❌ 无 | 顾问个人账号 OAuth + Create Meeting API（Phase 1） |
| Google Calendar 同步 | ❌ 无 | 顾问 Google OAuth + Free/Busy API 拉取（Phase 1） |
| 飞书集成 | ❌ 无 | 全部新建 |
| AI 功能 | TipTap 展示层 | AI 服务接入、各工具页面 |

---

## 当前优先级（Phase 1 待实现）

1. **公司主页**：定制 `landing` 模板（内容替换 + 新增导师介绍、Testimonial、微信二维码区块）
2. **学生预约流**：三步页面（背景表单 → 选导师 → 选时间）
3. **Google Calendar 集成**：顾问 OAuth 绑定 + 空闲时段拉取 API + FullCalendar 展示
4. **后端 Prisma schema**：Lead、Consultant、TimeSlot、Appointment 数据模型（按多导师架构设计）
5. **预约防冲突逻辑** + **确认邮件发送**（含视频会议链接占位符）
6. **Zoom 集成**：顾问绑定个人 Zoom 账号（OAuth），预约确认时自动生成会议链接附入邮件
