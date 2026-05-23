# Changelog

## 1.2.0

- 废弃 PTY Pseudoterminal 终端方案，回到 `createTerminal` + `sendText` 可靠方式
- Dashboard URL 通过 `REASONIX_DASHBOARD_TOKEN` + `--dashboard-port` 预知，不再拦截终端输出
- 多终端支持：每个终端独立 URL，按钮按当前活跃终端切换
- Dashboard 按钮样式与启动按钮统一
- 移除 `child_process.spawn` 依赖
- 添加 `.gitignore` 排除 `.vsix`
