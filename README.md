# 杨建新 · 产品运营个人作品集

个人作品集网站，展示职业经历、能力图谱、项目案例与活动返图。

线上地址：https://yjx-product-portfolio.vercel.app

## 技术栈

- **框架**：React 19 + Vite 8
- **语言**：JavaScript（JSX）
- **样式**：原生 CSS（CSS 变量）
- **图标**：lucide-react
- **字体**：Space Grotesk（@fontsource 自托管）+ 系统中文字体栈
- **部署**：Vercel

## 本地开发

```bash
# 安装依赖（需先安装 pnpm）
pnpm install

# 启动开发服务器（默认 http://localhost:5173）
pnpm dev

# 生产构建（输出到 dist/）
pnpm build

# 本地预览构建产物
pnpm preview
```

## 项目结构

```
.
├── public/                 # 静态资源（简历、活动返图、项目配图）
│   ├── resume.pdf          # 个人简历
│   ├── activity-return.pdf # 活动返图（高清版，下载用）
│   └── ...
├── src/
│   ├── main.jsx            # 应用入口与组件
│   ├── content.js          # 网站内容配置（改文字/链接只改这里）
│   └── styles.css          # 全局样式
├── index.html
├── vite.config.js
└── package.json
```

## 内容维护

网站所有文字、数字、图片地址、链接都集中在 [src/content.js](src/content.js) 里，更新内容只需修改这一个文件，无需改动组件代码。

## 部署说明

项目已配置 Vercel 部署，推送到主分支后可自动触发构建。

- 构建命令：`pnpm build`
- 输出目录：`dist`
- 安装命令：`pnpm install`（已在 `package.json` 中声明 `packageManager`）

## 下载功能说明

- **个人简历**：点击"个人简历"按钮，通过浏览器 `showSaveFilePicker` API 弹出系统"另存为"对话框保存 `resume.pdf`
- **活动返图**：点击"点此下载活动返图"，下载 `activity-return.pdf`（高清版）

> 注：`showSaveFilePicker` 需在用户点击的瞬时激活窗口内调用，因此在代码中先弹窗再拉取文件，避免激活过期导致静默失败。

## 忽略规则

以下目录不会进入版本库与部署：

- `node_modules/` 依赖
- `dist/` 构建产物
- `resource/` 原始素材（含大体积源文件）
- `tmp/` 临时文件
