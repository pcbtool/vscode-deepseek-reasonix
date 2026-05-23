const vscode = require('vscode');
const { t, get } = require('./i18n');

/**
 * Reasonix VS Code 扩展
 * — 活动栏鲸鱼图标入口，点击直接启动终端
 * — 命令面板启动 (Ctrl+Shift+P → "Reasonix: 启动终端")
 * — 侧边栏面板内含启动按钮，随时可再次打开
 * — 终端自动在编辑器右侧贴靠
 */
function activate(context) {
  console.log(t('log.activated'));

  // ── 注册启动命令 ────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('reasonix.launch', launchReasonix)
  );

  // ── 注册侧边栏面板（含启动按钮） ──────────────────────────
  const provider = new ReasonixSidebarProvider();
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('reasonix.sidebar', provider, {
      webviewOptions: { retainContextWhenHidden: true },
    })
  );

  // ── 激活后自动启动第一个终端 ────────────────────────────────
  launchReasonix();
}

/**
 * 启动一个新的 Reasonix 终端：
 * 1. 在编辑器区域创建终端
 * 2. cd 到当前工作区目录
 * 3. 运行 npx reasonix code
 * 4. 终端贴靠到窗口右侧
 * 每次调用都创建新终端，不复用。
 */
function launchReasonix() {
  const folder = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;

  const terminal = vscode.window.createTerminal({
    name: 'Reasonix',
    location: vscode.TerminalLocation.Editor,
  });
  terminal.show();

  if (folder) {
    terminal.sendText(`cd "${folder}"`);
  }
  terminal.sendText('npx reasonix code');

  // 将终端编辑器贴靠到右侧分组
  setTimeout(() => {
    vscode.commands
      .executeCommand('workbench.action.moveEditorToRightGroup')
      .then(
        () => {},
        (err) => console.error(t('log.moveFailed'), err)
      );
  }, 150);
}

/**
 * 生成侧边栏底部的链接列表 HTML
 */
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

/**
 * 侧边栏面板
 * 根据 VS Code 语言自动切换中/英文，点击按钮可再次启动终端。
 */
class ReasonixSidebarProvider {
  resolveWebviewView(webviewView) {
    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = this._buildHtml();

    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.command === 'launch') {
        launchReasonix();
      } else if (message.command === 'openUrl') {
        vscode.env.openExternal(vscode.Uri.parse(message.url));
      }
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
    .launch-btn {
      display: inline-block;
      margin-top: 16px;
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
    .launch-btn:hover {
      opacity: 0.85;
    }
    .launch-btn:active {
      opacity: 0.7;
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
  <button class="launch-btn" id="launchBtn">${t('sidebar.button.launch')}</button>
  <div class="hint">${t('sidebar.hint.retry')}</div>
  <div class="links">
    ${renderLinks()}
  </div>
  <script>
    (function() {
      const vscode = acquireVsCodeApi();
      document.getElementById('launchBtn').addEventListener('click', function() {
        vscode.postMessage({ command: 'launch' });
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