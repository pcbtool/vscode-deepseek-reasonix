# 🐋 DeepSeek Reasonix

<p align="center">
  <img src="./logo.jpg" width="128" alt="DeepSeek Reasonix">
</p>

<div align="center">

一键启动 Reasonix 终端 · One-click launch Reasonix terminal

[![VS Code Marketplace](https://img.shields.io/badge/Marketplace-v1.3.0-blue?logo=visual-studio-code)](https://marketplace.visualstudio.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/pcbtool/vscode-deepseek-reasonix/blob/main/LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-pcbtool%2Fvscode--deepseek--reasonix-181717?logo=github)](https://github.com/pcbtool/vscode-deepseek-reasonix)

**🌐 语言切换 · Language:** <a href="#chinese">🇨🇳 中文</a> &nbsp;|&nbsp; <a href="#english">🇬🇧 English</a>

**作者其他工具 · Author's other tools:**

**PCB Tools Navigator** — [https://pcbtool.net](https://pcbtool.net)

**Free Online Gerber Viewer** — [https://online-gerber-viewer.com](https://online-gerber-viewer.com)

</div>

---

<h2 id="chinese">🇨🇳 中文</h2>

在 VS Code 中一键启动 **Reasonix**，免去手动输入命令的繁琐。

### 功能

- **🐋 活动栏一键启动** — 点击左侧 DeepSeek 鲸鱼图标，自动打开终端并运行 `npx reasonix code`
- **🪟 终端自动贴靠** — 终端窗口自动贴靠到编辑器右侧分组，不遮挡代码
- **📊 一键打开 Dashboard** — 侧边栏"打开 Dashboard"按钮，自动识别当前终端 URL，支持多终端切换
- **🔄 支持 Reasonix v1/v2** — 通过设置 `reasonix.mode` 在 `code` (v0.x TypeScript) 和 `chat` (v1.x Go) 模式间切换
- **⌨️ 命令面板** — `Ctrl+Shift+P` → `Reasonix: 启动终端` 同样可用

### 使用

| 方式 | 操作 |
|------|------|
| 活动栏 | 点击左侧 🐋 图标，终端自动启动 |
| 命令面板 | `Ctrl+Shift+P` → `Reasonix: 启动终端` |

启动后终端自动执行：

- **code 模式** (v0.x TS): `npx reasonix code --dashboard-port <port>`，附带 Dashboard 支持
- **chat 模式** (v1.x Go): `npx reasonix chat`，无 Dashboard

可通过 VS Code 设置 `reasonix.mode` 切换。终端工作目录自动设置为当前项目目录。

### 安装

**扩展市场安装** — 在 VS Code 扩展市场中搜索 **DeepSeek Reasonix** 即可安装。

**VSIX 手动安装**：

```bash
git clone https://github.com/pcbtool/vscode-deepseek-reasonix.git
cd vscode-deepseek-reasonix
npm run package
code --install-extension build/vscode-deepseek-reasonix-*.vsix
```

<p align="right"><a href="#readme">⬆ 返回顶部 · Back to top</a></p>

---

<h2 id="english">🇬🇧 English</h2>

Launch **Reasonix** in VS Code with one click — no need to type commands manually.

### Features

- **🐋 Activity Bar Launch** — Click the DeepSeek whale icon in the activity bar to automatically open a terminal and run `npx reasonix code`
- **🪟 Smart Terminal Placement** — Terminal opens in the editor's right group, keeping your code visible
- **📊 Open Dashboard** — "Open Dashboard" button in sidebar, auto-detects current terminal URL, supports multi-terminal switching
- **🔄 Reasonix v1/v2 Support** — Switch between `code` (v0.x TypeScript) and `chat` (v1.x Go) via `reasonix.mode` setting
- **⌨️ Command Palette** — `Ctrl+Shift+P` → `Reasonix: 启动终端` also works

### Usage

| Method | Action |
|--------|--------|
| Activity Bar | Click the 🐋 whale icon, terminal starts automatically |
| Command Palette | `Ctrl+Shift+P` → `Reasonix: 启动终端` |

The terminal will automatically run:

- **code mode** (v0.x TS): `npx reasonix code --dashboard-port <port>` with Dashboard support
- **chat mode** (v1.x Go): `npx reasonix chat`, no Dashboard

Switch via VS Code setting `reasonix.mode`. The terminal working directory is set to your project root.

### Installation

**Marketplace** — Search **DeepSeek Reasonix** in the VS Code extensions marketplace.

**VSIX Manual Install**:

```bash
git clone https://github.com/pcbtool/vscode-deepseek-reasonix.git
cd vscode-deepseek-reasonix
npm run package
code --install-extension build/vscode-deepseek-reasonix-*.vsix
```

---

## 🔧 Build from Source

```bash
# Clone
git clone git@github.com:pcbtool/vscode-deepseek-reasonix.git
cd vscode-deepseek-reasonix

# Package VSIX
npm run package

# Output: build/vscode-deepseek-reasonix-*.vsix
```

Build artifacts are output to `build/` and tracked in git. No compilation required — pure JavaScript.

## 🏗 Project Structure

```
vscode-deepseek-reasonix/
├── build/            # VSIX build artifacts
├── i18n/             # Translation files (en/zh)
├── extension.js      # Extension entry point
├── CHANGELOG.md      # Changelog
├── i18n.js           # Translation loader
├── package.json      # Extension manifest
├── icon.svg          # Activity bar icon (50×24)
├── logo.jpg          # Marketplace icon (128×128)
├── README.md         # This file
└── LICENSE           # MIT
```

## 📜 License

MIT — see [LICENSE](https://github.com/pcbtool/vscode-deepseek-reasonix/blob/main/LICENSE).
