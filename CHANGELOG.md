# Changelog

## 1.2.0

- 废弃 PTY Pseudoterminal 终端方案，回到 `createTerminal` + `sendText` 可靠方式 / Replace PTY Pseudoterminal with reliable `createTerminal` + `sendText`
- Dashboard URL 通过 `REASONIX_DASHBOARD_TOKEN` + `--dashboard-port` 预知，不再拦截终端输出 / Pre-determine Dashboard URL via `REASONIX_DASHBOARD_TOKEN` + `--dashboard-port`, no longer intercept terminal output
- 多终端支持：每个终端独立 URL，按钮按当前活跃终端切换 / Multi-terminal support: each terminal has its own URL, button switches by active terminal
- Dashboard 按钮样式与启动按钮统一 / Unify Dashboard button style with launch button
- 终端关闭后 Dashboard 按钮自动置灰 / Dashboard button auto-disables when terminal closes
- 移除 `child_process.spawn` 依赖 / Remove `child_process.spawn` dependency
- 添加 `.gitignore` 排除 `.vsix` / Add `.gitignore` to exclude `.vsix`

## 1.0.0

- 首次发布 / Initial release
- 活动栏鲸鱼图标入口，点击直接启动终端 / Whale icon in activity bar, click to launch terminal
- 终端自动贴靠编辑器右侧 / Terminal auto-docks to the right editor group
- 侧边栏面板含启动按钮 / Sidebar panel with launch button
- i18n 中英文支持 / i18n Chinese & English support
