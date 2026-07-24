# Geni Links 前端 Demo

Geni Links（际联教育）产品前端 Demo，基于 Si Educational 模板重新设计。当前版本用于确认科技蓝主题、页面结构、业务流程和响应式体验。

所有内容均为 Mock 数据，暂不包含数据库、真实认证、邮件、会议、支付或申请进度同步。

## 本地预览

```bash
cd geni-edtech
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。如果端口被占用，Next.js 会自动选择 3001 等其他端口。

Windows PowerShell 如果提示禁止运行 `npm.ps1`：

```powershell
npm.cmd run dev
```

## Demo 页面

| 页面 | 地址 |
| --- | --- |
| 公司官网 | `/` |
| 服务中心 | `/services` |
| 导师与顾问 | `/consultants` |
| 学生案例 | `/cases` |
| 三步预约 | `/book` |
| 预约成功与账号激活 | `/booking-success` |
| 合同与服务确认单 | `/contract` |
| 学生 Portal | `/portal` |
| 申请进度 | `/portal/progress` |
| 求职指导 | `/portal/career` |
| 语言指导 | `/portal/language` |
| 员工工作台 | `/staff` |
| 管理后台 | `/admin` |

预约页面支持步骤切换；服务与导师页面支持选项切换。其他按钮用于展示未来交互位置，目前不会写入数据。

## 视觉规范

- Primary：`#4D6BFE`
- Primary dark：`#314BD6`
- Brand deep：`#14245F`
- Surface：`#EEF3FF`
- Accent：`#38BDF8`
- Success：`#129C8B`
- Production domain：`https://geni-links.com`

界面以“全球成长路径/服务里程碑”为统一视觉语言，并支持桌面、平板和移动端布局。

## 构建检查

```bash
npm run build
```

当前版本已通过 Next.js 生产构建及 TypeScript 类型检查。

## 技术栈

- Next.js `15.2.4`
- React `19`
- Tailwind CSS `4`
- TypeScript `5`

模板来源：[Si Educational / ThemeWagon](https://themewagon.com/themes/si-education/)，遵循原模板许可。
