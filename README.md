# 🐋 DeepSeek Reasonix

<p align="center">
  <img src="./logo.jpg" width="128" alt="DeepSeek Reasonix">
</p>

<div align="center">

一键启动 Reasonix 终端 · One-click launch Reasonix terminal

[![VS Code Marketplace](https://img.shields.io/badge/Marketplace-v0.2.0-blue?logo=visual-studio-code)](https://marketplace.visualstudio.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/pcbtool/vscode-deepseek-reasonix/blob/main/LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-pcbtool%2Fvscode--deepseek--reasonix-181717?logo=github)](https://github.com/pcbtool/vscode-deepseek-reasonix)

</div>

---

## 🇨🇳 中文

在 VS Code 中一键启动 **Reasonix**，免去手动输入命令的繁琐。

### 功能

- **🐋 活动栏一键启动** — 点击左侧 DeepSeek 鲸鱼图标，自动打开终端并运行 `npx reasonix code`
- **📂 自动 `cd` 到项目目录** — 自动切换到当前工作区根目录
- **🪟 终端自动贴靠** — 终端窗口自动贴靠到编辑器右侧分组，不遮挡代码
- **⌨️ 命令面板** — `Ctrl+Shift+P` → `Reasonix: 启动终端` 同样可用

### 使用

| 方式 | 操作 |
|------|------|
| 活动栏 | 点击左侧 🐋 图标，终端自动启动 |
| 命令面板 | `Ctrl+Shift+P` → `Reasonix: 启动终端` |

启动后终端自动执行：

```bash
cd <当前项目目录>
npx reasonix code
```

### 安装

**扩展市场安装** — 在 VS Code 扩展市场中搜索 **DeepSeek Reasonix** 即可安装。

**VSIX 手动安装**：

```bash
git clone https://github.com/pcbtool/vscode-deepseek-reasonix.git
cd vscode-deepseek-reasonix
npx @vscode/vsce package
code --install-extension deepseek-reasonix-*.vsix
```

---

## 🇬🇧 English

Launch **Reasonix** in VS Code with one click — no need to type commands manually.

### Features

- **🐋 Activity Bar Launch** — Click the DeepSeek whale icon in the activity bar to automatically open a terminal and run `npx reasonix code`
- **📂 Auto `cd` to Project** — Automatically switches to your current workspace root directory
- **🪟 Smart Terminal Placement** — Terminal opens in the editor's right group, keeping your code visible
- **⌨️ Command Palette** — `Ctrl+Shift+P` → `Reasonix: 启动终端` also works

### Usage

| Method | Action |
|--------|--------|
| Activity Bar | Click the 🐋 whale icon, terminal starts automatically |
| Command Palette | `Ctrl+Shift+P` → `Reasonix: 启动终端` |

The terminal will automatically run:

```bash
cd <your project directory>
npx reasonix code
```

### Installation

**Marketplace** — Search **DeepSeek Reasonix** in the VS Code extensions marketplace.

**VSIX Manual Install**:

```bash
git clone https://github.com/pcbtool/vscode-deepseek-reasonix.git
cd vscode-deepseek-reasonix
npx @vscode/vsce package
code --install-extension deepseek-reasonix-*.vsix
```

---

## 🔧 Build from Source

```bash
# Clone
git clone git@github.com:pcbtool/vscode-deepseek-reasonix.git
cd vscode-deepseek-reasonix

# Package VSIX
npx @vscode/vsce package

# Output: deepseek-reasonix-*.vsix
```

No compilation required — pure JavaScript.

## 🏗 Project Structure

```
vscode-deepseek-reasonix/
├── extension.js      # Extension entry point
├── package.json      # Extension manifest
├── icon.svg          # Activity bar icon (50×24)
├── logo.jpg          # Marketplace icon (128×128)
├── logo.svg          # Vector brand logo (500×500)
├── README.md         # This file
└── LICENSE           # MIT
```

## 📜 License

MIT — see [LICENSE](https://github.com/pcbtool/vscode-deepseek-reasonix/blob/main/LICENSE).
