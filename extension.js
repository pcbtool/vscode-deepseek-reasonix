const vscode = require('vscode');

/**
 * Reasonix VS Code 扩展
 * — 活动栏鲸鱼图标入口，点击直接启动终端
 * — 命令面板启动 (Ctrl+Shift+P → "Reasonix: 启动终端")
 * — 侧边栏面板内含启动按钮，随时可再次打开
 * — 终端自动在编辑器右侧贴靠
 */
function activate(context) {
  console.log('[Reasonix] 扩展已激活');

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
        (err) => console.error('[Reasonix] 贴靠失败:', err)
      );
  }, 150);
}

/**
 * 侧边栏面板
 * 点击"打开 DeepSeek-Reasonix"按钮可再次启动终端。
 */
class ReasonixSidebarProvider {
  resolveWebviewView(webviewView) {
    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = this._buildHtml();

    // 监听来自 webview 的消息
    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.command === 'launch') {
        launchReasonix();
      }
    });
  }

  _buildHtml() {
    return `<!DOCTYPE html>
<html lang="zh-CN">
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
  </style>
</head>
<body>
  <div class="title">🐋 Reasonix</div>
  <button class="launch-btn" id="launchBtn">打开 DeepSeek-Reasonix</button>
  <div class="hint">关闭终端后可再次点击打开</div>
  <script>
    (function() {
      const vscode = acquireVsCodeApi();
      document.getElementById('launchBtn').addEventListener('click', function() {
        vscode.postMessage({ command: 'launch' });
      });
    })();
  </script>
</body>
</html>`;
  }
}

function deactivate() {}

module.exports = { activate, deactivate };