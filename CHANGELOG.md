# Changelog

## 1.4.0

- 支持 Reasonix v2 (Go)：新增 `reasonix.mode` 配置（auto/code/chat） / Support Reasonix v2 (Go): add `reasonix.mode` config (auto/code/chat)
- 侧边栏增加启动模式下拉框，即时切换 / Add mode selector dropdown in sidebar
- `chat` 模式使用 `npx reasonix@latest chat`，`code` 模式保留 Dashboard / `chat` mode uses `npx reasonix@latest chat`, `code` mode keeps Dashboard
- 启动按钮文字跟随当前模式 / Launch button text follows current mode
- 切换非 code 模式时自动置灰 Dashboard 按钮 / Auto-disable Dashboard button when switching to non-code mode

## 1.3.0

- 终端工作目录通过 `cwd` 参数设置，无需 `cd` / Set terminal working directory via `cwd` option, no `cd` needed

## 1.2.0

- 新增"打开 Dashboard"按钮 / Add "Open Dashboard" button
- Dashboard URL 通过 `REASONIX_DASHBOARD_TOKEN` + `--dashboard-port` 预知 / Pre-determine Dashboard URL via `REASONIX_DASHBOARD_TOKEN` + `--dashboard-port`
- 多终端独立 URL，按钮按活跃终端切换 / Per-terminal URLs, button switches by active terminal
- Dashboard 按钮样式统一、关闭后自动置灰 / Unified Dashboard button style, auto-disable on close

## 1.0.0

- 首次发布 / Initial release
- 活动栏鲸鱼图标入口 / Whale icon in activity bar
- 终端编辑器右侧贴靠 / Terminal docks to right editor group
- 侧边栏启动按钮 / Sidebar launch button
- i18n 中英文支持 / i18n Chinese & English support
