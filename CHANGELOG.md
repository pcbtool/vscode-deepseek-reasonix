# Changelog

## 1.2.0

- 废弃 PTY Pseudoterminal 终端方案，回到 `createTerminal` + `sendText` 可靠方式
- Dashboard URL 通过 `REASONIX_DASHBOARD_TOKEN` + `--dashboard-port` 预知，不再拦截终端输出
- 多终端支持：每个终端独立 URL，按钮按当前活跃终端切换
- Dashboard 按钮样式与启动按钮统一
- 移除 `child_process.spawn` 依赖
- 添加 `.gitignore` 排除 `.vsix`

## 1.0.0

- 首次发布
- 活动栏鲸鱼图标入口，点击直接启动终端
- 终端自动贴靠编辑器右侧
- 侧边栏面板含启动按钮
- i18n 中英文支持
