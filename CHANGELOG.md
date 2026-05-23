# Changelog

## 1.2.0 (2025-06-17)

### Fixed
- **彻底解决终端卡死问题** — 废弃 PTY Pseudoterminal 方式，回到 `createTerminal` + `sendText` 可靠方案
- **Dashboard URL 捕获不再依赖终端输出拦截** — 通过 `REASONIX_DASHBOARD_TOKEN` 环境变量 + `--dashboard-port` 参数在启动前预知 URL，消除所有终端输出解析带来的兼容性问题
- **多终端支持** — 每个终端独立记录 Dashboard URL，按钮按当前活跃终端自动切换
- **终端排版正常** — 不再注入额外文本，不干扰 Reasonix 自身格式输出
- **按钮样式统一** — Dashboard 按钮与启动按钮使用相同样式

### Added
- `CHANGELOG.md` — 项目变更日志
- `.gitignore` — 排除 `.vsix` 构建产物

### Changed
- `extension.js` — 完全重写：移除 `child_process.spawn` 依赖，改用 `net` + `crypto` 预生成 URL
- `package.json` — 版本升级至 1.2.0

## 1.1.0 (2025-06-16)

### Added
- 侧边栏面板新增 Dashboard 按钮
- 侧边栏新增作者工具链接（GitHub、官网、Discord）
- PTY Pseudoterminal 实现 Dashboard URL 实时捕获

### Changed
- `extension.js` — 从普通终端改为 Pseudoterminal 方案以获取 stdout

## 1.0.0 (2025-06-15)

### Added
- 首次发布
- 活动栏鲸鱼图标入口
- 终端在编辑器右侧贴靠
- 侧边栏启动按钮
- i18n 中英文支持
