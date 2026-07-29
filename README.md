<p align="center">
  <img src="./public/hero.svg" width="100%" alt="盘小子：一站式网盘资源搜索引擎，支持夸克、百度、阿里云盘">
</p>

<p align="center">
  <a href="https://github.com/towelong/panxiaozi"><img src="https://img.shields.io/github/stars/towelong/panxiaozi?style=flat-square&color=3B82F6" alt="GitHub stars"></a>
  <a href="https://github.com/towelong/panxiaozi/blob/main/LICENSE"><img src="https://img.shields.io/github/license/towelong/panxiaozi?style=flat-square&color=3B82F6" alt="License"></a>
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 15">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 18">
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
</p>

## 项目简介

**盘小子** 是一站式网盘资源搜索引擎，聚合 **夸克网盘**、**百度网盘**、**阿里云盘** 三大平台，输入关键词即可快速定位资源，一键直达。

🔗 在线体验：https://pan.xiaozi.cc

## 界面预览

<p align="center">
  <img src="./screenshot/home.png" width="100%" alt="盘小子首页：搜索框、分类导航、资源卡片">
</p>

## 主要特性

- 🔍 **多平台聚合**：一次搜索覆盖夸克、百度、阿里云盘
- ⚡ **快速精准**：基于现代搜索架构，秒级返回结果
- 🎨 **清爽界面**：Tailwind CSS + Radix UI，响应式适配桌面与移动端
- 🔒 **完整认证**：基于 JWT 的用户登录与权限体系
- 🗃️ **数据可控**：Drizzle ORM + MySQL/PlanetScale，结构清晰易维护
- 🚀 **现代栈**：Next.js 15 App Router、React 18、TypeScript

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端框架 | Next.js 15, React 18 |
| UI 组件 | Radix UI, Tailwind CSS |
| 状态与表单 | React Hooks / Context, React Hook Form, Zod |
| API 路由 | Hono |
| 认证 | JWT |
| 数据库 | MySQL / PlanetScale, Drizzle ORM |
| 开发语言 | TypeScript |

## 快速开始

<details>
<summary>点击展开本地运行步骤</summary>

### 前提条件

- Node.js 18+
- MySQL 数据库（或 PlanetScale）

### 1. 克隆仓库

```bash
git clone https://github.com/towelong/panxiaozi.git
cd panxiaozi
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

在项目根目录创建 `.env.local`，填入你的数据库信息：

```bash
DATABASE_HOST=your-database-host
DATABASE_PORT=3306
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
DATABASE_NAME=your-database-name
JWT_SECRET=your-jwt-secret
```

### 4. 初始化数据库

```bash
pnpm db:generate
pnpm db:push
```

### 5. 启动开发服务器

```bash
pnpm dev
```

打开浏览器访问 http://localhost:3000

</details>

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm start` | 启动生产服务器 |
| `pnpm lint` | 运行代码检查 |
| `pnpm db:generate` | 生成数据库迁移文件 |
| `pnpm db:push` | 应用数据库迁移 |
| `pnpm db:studio` | 启动 Drizzle 数据库管理界面 |

## 部署

项目可部署在任何支持 Node.js 的平台上：

|           Deploy with Vercel           |            Deploy with Zeabur            |           Deploy with Netlify           |
| :------------------------------------: | :--------------------------------------: | :-------------------------------------: |
| [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/towelong/panxiaozi) | [![Deploy with Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/referral?referralCode=towelong&utm_source=towelong&utm_campaign=oss) | [![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/towelong/panxiaozi) |

## 技能

在支持智能体的 AI 助手（如 OpenClaw / Clawdbot / WorkBuddy）中安装此技能，即可用自然语言搜索盘小子的网盘资源：

> 盘小子（pan.xiaozi.cc）网盘资源搜索。当用户需要搜索网盘资源（影视、软件、文档等）时触发本 Skill。

**一键安装：**

```bash
openclaw skills install @talefou/pan-xiaozi-search
```

了解更多：https://clawhub.ai/talefou/skills/pan-xiaozi-search

## 赞助

[![Powered by DartNode](https://dartnode.com/branding/DN-Open-Source-sm.png)](https://dartnode.com "Powered by DartNode - Free VPS for Open Source")

## 许可证

[MIT](LICENSE) © 2026 PanXiaozi & Contributors
