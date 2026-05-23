const vscode = require('vscode');
const { spawn } = require('child_process');
const { t, get } = require('./i18n');

// ── 全局状态 ───────────────────────────────────────────────────
let lastDashboardUrl = null;
let latestWebview = null;           // 用于推送 URL 到 webview

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

  launchReasonix();
}

/**
 * 用伪终端 (Pseudoterminal) 启动 npx reasonix code，
 * 捕获 stdout 中的 Dashboard URL。
 */
function launchReasonix() {
  const folder = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;
  const isWin = process.platform === 'win32';
  const npxCmd = isWin ? 'npx.cmd' : 'npx';

  let proc = null;
  const writeEmitter = new vscode.EventEmitter();

  const terminal = vscode.window.createTerminal({
    name: 'Reasonix',
    pty: {
      onDidWrite: writeEmitter.event,
      open: () => {
        proc = spawn(npxCmd, ['reasonix', 'code'], {
          cwd: folder || undefined,
          env: { ...process.env },
        });

        const handleData = (data) => {
          const text = data.toString();
          writeEmitter.fire(text);

          // 解析 Dashboard URL: http://127.0.0.1:<port>/?token=<hash>
          const match = text.match(
            /https?:\/\/127\.0\.0\.1:\d+\/\?token=[a-f0-9]+/
          );
          if (match) {
            lastDashboardUrl = match[0];
            console.log('[Reasonix] Dashboard URL:', lastDashboardUrl);
            // 通知 webview 更新按钮状态
            if (latestWebview) {
              latestWebview.webview.postMessage({
                command: 'dashboardUrl',
                url: lastDashboardUrl,
              });
            }
          }
        };

        proc.stdout.on('data', handleData);
        proc.stderr.on('data', handleData);
        proc.on('error', (err) => {
          writeEmitter.fire(`\r\n[Error] ${err.message}\r\n`);
        });
        proc.on('exit', (code) => {
          writeEmitter.fire(`\r\n[Process exited with code ${code}]\r\n`);
          proc = null;
        });
      },
      close: () => {
        if (proc) {
          proc.kill();
          proc = null;
        }
      },
    },
    location: vscode.TerminalLocation.Editor,
  });

  terminal.show();

  setTimeout(() => {
    vscode.commands
      .executeCommand('workbench.action.moveEditorToRightGroup')
      .then(() => {}, (err) => console.error(t('log.moveFailed'), err));
  }, 150);
}

// ── 侧边栏链接渲染 ────────────────────────────────────────────

function renderLinks() {
  const links = get('sidebar.links');
  if (!links || !Array.isArray(links)) return '';
  return links
    .map(
      (link) =>
        `<span class="link-item" data-url="${link.url}">${link.text}: ${link.url}</span>`
    )
    .join('\n    ');
}

// ── 侧边栏面板 ────────────────────────────────────────────────

class ReasonixSidebarProvider {
  resolveWebviewView(webviewView) {
    latestWebview = webviewView;

    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this._buildHtml();

    // 推送当前已知的 URL（可能为 null）
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
        case 'openDashboard':
          if (lastDashboardUrl) {
            vscode.env.openExternal(vscode.Uri.parse(lastDashboardUrl));
          }
          break;
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
    .btn.secondary {
      background: rgba(255,255,255,0.06);
      color: var(--vscode-sideBar-foreground, #ccc);
      border: 1px solid rgba(255,255,255,0.1);
      opacity: 0.7;
    }
    .btn.secondary:hover { opacity: 1; }
    .btn.secondary:disabled {
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
  </style>
</head>
<body>
  <div class="title">${t('sidebar.title')}</div>

  <button class="btn" id="launchBtn">${t('sidebar.button.launch')}</button>
  <button class="btn secondary" id="dashboardBtn" disabled>
    ${t('sidebar.button.dashboard')}
  </button>

  <div class="hint">${t('sidebar.hint.retry')}</div>

  <div class="links">${renderLinks()}</div>

  <script>
    (function() {
      const vscode = acquireVsCodeApi();
      const dashboardBtn = document.getElementById('dashboardBtn');

      // 从扩展宿主接收消息
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