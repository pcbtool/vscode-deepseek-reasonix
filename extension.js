const vscode = require('vscode');
const { exec } = require('child_process');
const net = require('net');
const crypto = require('crypto');
const { t, get } = require('./i18n');

// ── 全局状态 ───────────────────────────────────────────────────
let lastDashboardUrl = null;
const terminalUrls = new Map();     // Terminal → URL 映射
let latestWebview = null;           // 用于推送 URL 到 webview
let reasonixVersion = null;         // 'code' (v0.x TS) 或 'chat' (v1.x Go)

// 模块加载时立即检测 Reasonix 版本（无需等 activate）
(() => {
  exec('npx --yes reasonix --version 2>&1', { timeout: 8000 }, (err, stdout) => {
    if (err) { reasonixVersion = 'code'; return; }
    reasonixVersion = stdout.trim().startsWith('1.') ? 'chat' : 'code';
    console.log('[Reasonix] Detected version:', reasonixVersion);
  });
  // 8 秒超时，超时后默认为 code 模式
  setTimeout(() => { if (!reasonixVersion) reasonixVersion = 'code'; }, 8000);
})();

/**
 * 找到一个可用的本地端口
 */
function findFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

/**
 * 生成一个安全的 dashboard token（32 位 hex）
 */
function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Reasonix VS Code 扩展
 * — 活动栏鲸鱼图标入口，点击直接启动终端
 * — 命令面板启动 (Ctrl+Shift+P → "Reasonix: 启动终端")
 * — 侧边栏面板：启动终端 / 打开 Dashboard
 * — 终端自动在编辑器右侧贴靠
 */
function activate(context) {
  console.log(t('log.activated'));

  context.subscriptions.push(
    vscode.commands.registerCommand('reasonix.launch', launchReasonix)
  );

  const provider = new ReasonixSidebarProvider();
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('reasonix.sidebar', provider, {
      webviewOptions: { retainContextWhenHidden: true },
    })
  );

  // 终端关闭时清理
  context.subscriptions.push(
    vscode.window.onDidCloseTerminal((t) => {
      if (terminalUrls.has(t)) {
        terminalUrls.delete(t);
        // 没有 Reasonix 终端存活时，清理 URL 并置灰按钮
        if (terminalUrls.size === 0) {
          lastDashboardUrl = null;
          if (latestWebview) {
            try {
              latestWebview.webview.postMessage({
                command: 'dashboardUrl',
                url: null,
              });
            } catch (_) {}
          }
        }
      }
    })
  );

  launchReasonix();
}

/**
 * 启动 Reasonix 终端。
 * 使用预知的端口和 token，URL 在启动前就已确定。
 */
async function launchReasonix() {
  const folder = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;

  // 优先使用用户手动设置，未设置时走自动检测
  const userMode = vscode.workspace
    .getConfiguration('reasonix')
    .get('mode', 'auto');
  const isChat = userMode === 'chat' || (userMode === 'auto' && reasonixVersion === 'chat');
  const terminal = vscode.window.createTerminal({
    name: 'Reasonix',
    location: vscode.TerminalLocation.Editor,
    cwd: folder || undefined,
    env: isChat ? undefined : { REASONIX_DASHBOARD_TOKEN: generateToken() },
  });

  terminal.show();

  if (isChat) {
    // v2 (Go): no dashboard, uses `reasonix chat`
    terminal.sendText('npx reasonix chat');
  } else {
    // v0.x (TS): dashboard supported, uses `reasonix code --dashboard-port`
    const token = generateToken();
    let port;
    try {
      port = await findFreePort();
    } catch {
      port = 18080;
    }
    const dashboardUrl = `http://127.0.0.1:${port}/?token=${token}`;
    lastDashboardUrl = dashboardUrl;
    terminalUrls.set(terminal, dashboardUrl);
    if (latestWebview) {
      try {
        latestWebview.webview.postMessage({
          command: 'dashboardUrl',
          url: dashboardUrl,
        });
      } catch (_) {}
    }
    console.log('[Reasonix] Dashboard URL (pre-known):', dashboardUrl);
    terminal.sendText(`npx reasonix code --dashboard-port ${port}`);
  }

  // 将终端贴靠到右侧分组
  setTimeout(() => {
    vscode.commands
      .executeCommand('workbench.action.moveEditorToRightGroup')
      .then(() => {}, (err) => console.error(t('log.moveFailed'), err));
  }, 150);
}

/**
 * 获取当前应该打开的 Dashboard URL：
 * 优先使用当前活跃的 Reasonix 终端的 URL，
 * 若无活跃终端则使用最近捕获到的 URL。
 */
function getDashboardUrl() {
  const active = vscode.window.activeTerminal;
  if (active && terminalUrls.has(active)) {
    return terminalUrls.get(active);
  }
  return lastDashboardUrl;
}

// ── 侧边栏链接渲染 ────────────────────────────────────────────

function renderLinks() {
  const links = get('sidebar.links');
  if (!links || !Array.isArray(links)) return '';
  return links
    .map(
      (link) =>
        `<span class="link-item" data-url="${link.url}">${link.text}</span>`
    )
    .join('\n    ');
}

// ── 侧边栏面板 ────────────────────────────────────────────────

class ReasonixSidebarProvider {
  resolveWebviewView(webviewView) {
    latestWebview = webviewView;

    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this._buildHtml();

    webviewView.webview.postMessage({
      command: 'dashboardUrl',
      url: lastDashboardUrl,
    });

    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'launch':
          launchReasonix();
          break;
        case 'openUrl':
          vscode.env.openExternal(vscode.Uri.parse(message.url));
          break;
        case 'openDashboard': {
          const url = getDashboardUrl();
          if (url) {
            vscode.env.openExternal(vscode.Uri.parse(url));
          }
          break;
        }
      }
    });

    webviewView.onDidDispose(() => {
      if (latestWebview === webviewView) latestWebview = null;
    });
  }

  _buildHtml() {
    return `<!DOCTYPE html>
<html lang="${t('sidebar.lang')}">
<head>
  <meta charset="UTF-8"/>
  <style>
    body {
      background: var(--vscode-sideBar-background, #1e1e1e);
      color: var(--vscode-sideBar-foreground, #cccccc);
      font-family: var(--vscode-font-family, sans-serif);
      padding: 20px;
      margin: 0;
      text-align: center;
    }
    .title {
      font-size: 15px;
      font-weight: 600;
      margin-top: 20px;
    }
    .btn {
      display: inline-block;
      width: 100%;
      box-sizing: border-box;
      margin-top: 12px;
      padding: 8px 20px;
      font-size: 13px;
      font-weight: 500;
      color: #fff;
      background: linear-gradient(135deg, #4F46E5, #06B6D4);
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn:hover { opacity: 0.85; }
    .btn:active { opacity: 0.7; }
    .btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .hint {
      font-size: 11px;
      opacity: 0.4;
      margin-top: 10px;
    }
    .links {
      margin-top: 18px;
      padding-top: 12px;
      border-top: 1px solid rgba(255,255,255,0.08);
    }
    .links .link-item {
      display: block;
      font-size: 11px;
      color: var(--vscode-textLink-foreground, #3794ff);
      text-decoration: none;
      cursor: pointer;
      margin-bottom: 6px;
      line-height: 1.5;
      transition: opacity 0.15s;
    }
    .links .link-item:hover {
      opacity: 0.75;
      text-decoration: underline;
    }
    .section-title {
      font-size: 11px;
      font-weight: 600;
      opacity: 0.6;
      margin-bottom: 8px;
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="title">${t('sidebar.title')}</div>

  <button class="btn" id="launchBtn">${t('sidebar.button.launch')}</button>
  <button class="btn" id="dashboardBtn" disabled>
    ${t('sidebar.button.dashboard')}
  </button>

  <div class="hint">${t('sidebar.hint.retry')}</div>

  <div class="links">
    <div class="section-title">${t('sidebar.authorToolsTitle')}</div>
    ${renderLinks()}
  </div>

  <script>
    (function() {
      const vscode = acquireVsCodeApi();
      const dashboardBtn = document.getElementById('dashboardBtn');

      window.addEventListener('message', function(event) {
        const msg = event.data;
        if (msg.command === 'dashboardUrl') {
          if (msg.url) {
            dashboardBtn.disabled = false;
            dashboardBtn.dataset.url = msg.url;
          } else {
            dashboardBtn.disabled = true;
            delete dashboardBtn.dataset.url;
          }
        }
      });

      document.getElementById('launchBtn').addEventListener('click', function() {
        vscode.postMessage({ command: 'launch' });
      });

      dashboardBtn.addEventListener('click', function() {
        vscode.postMessage({ command: 'openDashboard' });
      });

      document.querySelectorAll('.link-item').forEach(function(el) {
        el.addEventListener('click', function() {
          vscode.postMessage({ command: 'openUrl', url: this.dataset.url });
        });
      });
    })();
  </script>
</body>
</html>`;
  }
}

function deactivate() {}

module.exports = { activate, deactivate };