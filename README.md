# Fastify App Template

一个基于 Fastify 和 React 的全栈应用模板，提供完整的前后端开发环境和基础功能实现。

## 功能特性

- 🚀 基于 Fastify 的高性能后端服务
- ⚛️ 基于 React 的现代化前端界面
- 🔐 内置用户认证和权限管理
- 📁 文件管理系统
- 🎨 可定制的UI主题
- 📱 响应式设计
- 🔧 完整的开发工具链

## 技术栈

### 后端
- Fastify - 高性能的 Node.js Web 框架
- @fastify/env - 环境变量管理
- @fastify/static - 静态文件服务
- @kne/fastify-sequelize - 数据库 ORM
- @kne/fastify-account - 用户账户管理
- @kne/fastify-file-manager - 文件管理
- @kne/fastify-namespace - API 命名空间管理

### 前端
- React - 用户界面库
- React Router - 路由管理
- @kne/remote-loader - 远程组件加载
- SCSS - 样式预处理器
- Craco - Create React App 配置层

## 项目结构

```
template/
├── server/                # 后端服务器代码
│   ├── index.js          # 服务器入口
│   ├── server.js         # 服务器配置
│   ├── libs/             # 工具库
│   └── package.json      # 后端依赖
├── src/                  # 前端源代码
│   ├── App.js           # 应用入口
│   ├── pages/           # 页面组件
│   ├── components/      # 通用组件
│   └── index.js         # 前端入口
├── public/              # 静态资源
├── Dockerfile           # Docker 配置
└── package.json         # 项目依赖
```

## 快速开始

### 环境要求

- Node.js >= 14
- npm >= 6

### 安装

1. 创建新项目：

```bash
npx @kne/npm-tools init my-app --template @kne-template/fastify-app
```

2. 安装依赖：

```bash
cd my-app
npm install
```

### 开发

1. 启动开发服务器：

```bash
npm run dev
```

这将同时启动前端开发服务器（默认端口3000）和后端服务器（默认端口3001）。

2. 访问应用：
- 前端页面：http://localhost:3000
- API接口：http://localhost:3001

## 环境配置

项目使用 .env 文件进行环境配置，支持以下环境变量：

```env
# 服务器配置
PORT=3001                 # 后端服务器端口
NODE_ENV=development     # 环境模式

# 数据库配置
DB_TYPE=sqlite           # 数据库类型：sqlite, mysql, postgresql
DB_HOST=localhost       # 数据库主机
DB_PORT=3306           # 数据库端口
DB_NAME=fastify_app    # 数据库名称
DB_USER=root          # 数据库用户名
DB_PASSWORD=password  # 数据库密码

# JWT配置
JWT_SECRET=your-secret-key  # JWT密钥
```

## 开发指南

### 后端开发

1. API路由定义在 `server/libs/controllers` 目录下
2. 数据模型定义在 `server/libs/models` 目录下
3. 业务逻辑服务定义在 `server/libs/services` 目录下

### 前端开发

1. 新页面组件添加到 `src/pages` 目录
2. 通用组件添加到 `src/components` 目录
3. 路由配置在 `src/App.js` 中定义

## 部署

### Docker部署

项目包含 Dockerfile，可以直接构建 Docker 镜像：

```bash
# 构建镜像
docker build -t fastify-app .

# 运行容器
docker run -p 3001:3001 fastify-app
```

### 传统部署

1. 构建前端：

```bash
npm run build
```

2. 启动生产服务器：

```bash
npm run start
```

## 许可证

MIT

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。
