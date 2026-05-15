# 🐋 DeepSeek Reasonix

一键在 VS Code 右侧终端中启动 **Reasonix**，免去手动输入的繁琐。

## 功能

- **活动栏入口** — 左侧出现 DeepSeek 鲸鱼图标，点击展示会话面板
- **终端贴靠** — 自动在编辑器右侧打开终端，不影响左侧代码编辑
- **自动切换目录** — 自动 `cd` 到当前项目根目录
- **会话管理** — 侧边栏实时显示 Reasonix 终端运行状态

## 安装

### 从 VSIX 安装

```bash
git clone git@github.com:pcbtool/vscode-deepseek-reasonix.git
cd vscode-deepseek-reasonix
npx @vscode/vsce package
code --install-extension deepseek-reasonix-*.vsix
```

### 开发模式

1. `git clone` 后，VS Code 打开项目目录
2. 按 `F5` 启动 Extension Development Host

## 使用

| 方式 | 操作 |
|------|------|
| **活动栏** | 点击左侧 🐋 图标 → 面板显示会话状态 |
| **命令面板** | `Ctrl+Shift+P` → `Reasonix: 启动终端` |
| **启动后** | 终端自动在编辑器右侧打开，运行 `npx reasonix code` |

## 项目结构

```
vscode-deepseek-reasonix/
├── .gitignore        # Git 忽略规则
├── .vscodeignore     # 打包忽略规则
├── LICENSE           # MIT 许可证
├── README.md         # 本文件
├── package.json      # 扩展清单
├── extension.js      # 扩展主逻辑
├── icon.svg          # 活动栏图标 (50→24)
└── logo.svg          # 大尺寸品牌徽标 (500×500)
```

## 构建

纯 JavaScript，无需编译：

```bash
npm install -g @vscode/vsce
vsce package
```

输出 `deepseek-reasonix-*.vsix` 即可分发。

## 许可

MIT
