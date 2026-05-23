# REASONIX.md — Working Knowledge

## Stack

- **Language** — JavaScript (ES5+), no TypeScript, no compilation step
- **Runtime** — VS Code extension API (`vscode` module, WebviewView)
- **i18n** — Hand-rolled loader (`i18n.js`): loads `zh.json` or `en.json` based on VS Code UI language (any `zh*` → Chinese, else English)
- **Packaging** — `@vscode/vsce` for `.vsix` production; no bundler/minifier

## Layout

- `extension.js` — Entry point: registers sidebar provider, activity-bar command, spawns `npx reasonix code` in a pseudoterminal
- `i18n.js` — Translation loader: exports `t(key)` for strings and `get(key)` for arrays/objects, both using dot-path lookup
- `i18n/zh.json`, `i18n/en.json` — Translation bundles; sidebar links, buttons, and log messages
- `package.json` — Activation gated on `onView:reasonix.sidebar`; contributes a view container + webview view + one command
- `icon.svg` — Activity bar icon (50×24)

## Commands

- `npm run package` — `npx @vscode/vsce package` (builds `.vsix`)
- `npm run publish` — `npx @vscode/vsce publish` (publishes to marketplace)

No test, lint, format, or typecheck scripts exist.

## Conventions

- **i18n dot-path keys** — All user-facing strings go through `t('sidebar.xxx')` or `get('sidebar.links')`; keys mirror the JSON nesting
- **Webview ↔ extension IPC** — Webview uses `acquireVsCodeApi().postMessage({command, ...})`; extension handles via `webviewView.webview.onDidReceiveMessage` with a `switch` on `message.command`
- **Dashboard URL capture** — The pseudo-terminal's stdout+stderr are both parsed for the regex `https?://127\.0\.0\.1:\d+/\?token=[a-f0-9]+`; the last matched URL is stored in `lastDashboardUrl` and pushed to the sidebar via `postMessage({command:'dashboardUrl', url})`
- **Sidebar state** — Only the most recently resolved webview (`latestWebview` singleton) receives URL updates; on dispose it clears itself

## Watch out for

- **No build step** — `extension.js` runs directly (`"main": "./extension.js"`). Any syntax error ships to users.
- **Webview has no direct VS Code API access** — Every interaction (open URL, launch terminal, open dashboard) goes through `postMessage` → extension handler. If a new interaction is needed, add a new `case` in the message switch AND a `vscode.postMessage` call in the webview script.
- **Terminal URL push is one-shot** — If the webview hasn't resolved yet when the URL is captured, the `latestWebview` reference is still `null` and the URL is silently dropped. The resolved webview receives `postMessage` with the current `lastDashboardUrl` (which may be null) on resolve.
- **`launchReasonix()` always starts a new terminal** — No guard against duplicate terminals. Each call creates a fresh `Pseudoterminal` + spawns `npx reasonix code`.
