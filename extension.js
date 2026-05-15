const vscode = require('vscode');

/**
 * Reasonix VS Code 扩展
 * — 活动栏鲸鱼图标入口
 * — 命令面板启动 (Ctrl+Shift+P → "Reasonix: 启动终端")
 * — 终端自动在编辑器右侧贴靠
 * — 侧边栏会话面板 (终端状态实时展示)
 */
function activate(context) {
  console.log('[Reasonix] 扩展已激活');

  // ── 注册启动命令 ────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('reasonix.launch', launchReasonix)
  );

  // ── 注册侧边栏会话面板 ──────────────────────────────────────
  const provider = new ReasonixSidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('reasonix.sidebar', provider, {
      webviewOptions: { retainContextWhenHidden: true },
    })
  );

  // ── 监听终端变化，自动刷新侧边栏状态 ──────────────────────
  context.subscriptions.push(
    vscode.window.onDidOpenTerminal(() => provider.refresh()),
    vscode.window.onDidCloseTerminal(() => provider.refresh())
  );
}

/**
 * 启动 Reasonix 终端：
 * 1. 在编辑器区域创建终端
 * 2. cd 到当前工作区目录
 * 3. 运行 npx reasonix code
 * 4. 终端贴靠到窗口右侧
 */
function launchReasonix() {
  const folder = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;

  // 复用同名终端，避免堆积
  let terminal = vscode.window.terminals.find((t) => t.name === 'Reasonix');
  if (!terminal) {
    terminal = vscode.window.createTerminal({
      name: 'Reasonix',
      location: vscode.TerminalLocation.Editor,
    });
  }

  terminal.show();

  // 切换到当前项目目录，然后启动 reasonix
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
 * 侧边栏会话管理面板
 * 实时显示 Reasonix 终端运行状态，无启动按钮。
 */
class ReasonixSidebarProvider {
  constructor(extensionUri) {
    this._extensionUri = extensionUri;
    this._view = undefined;
  }

  resolveWebviewView(webviewView) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: false,
      localResourceRoots: [this._extensionUri],
    };
    webviewView.webview.html = this._buildHtml();
  }

  /** 外部调用刷新面板（终端开/关事件触发） */
  refresh() {
    if (this._view) {
      this._view.webview.html = this._buildHtml();
    }
  }

  _buildHtml() {
    const terminalRunning = vscode.window.terminals.some(
      (t) => t.name === 'Reasonix'
    );

    const statusHtml = terminalRunning
      ? `
    <div class="session-card">
      <div class="status-row">
        <span class="dot running"></span>
        <span class="status-text">Reasonix 终端运行中</span>
      </div>
      <div class="hint">终端已在编辑器右侧打开</div>
    </div>`
      : `
    <div class="session-card">
      <div class="status-row">
        <span class="dot stopped"></span>
        <span class="status-text">Reasonix 未启动</span>
      </div>
      <div class="hint">按 Ctrl+Shift+P → 输入 "Reasonix" 启动</div>
    </div>`;

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8"/>
  <style>
    :root {
      --bg: var(--vscode-sideBar-background, #1e1e1e);
      --fg: var(--vscode-sideBar-foreground, #cccccc);
      --border: var(--vscode-editorWidget-border, #333);
    }
    body {
      background: var(--bg);
      color: var(--fg);
      font-family: var(--vscode-font-family, -apple-system, system-ui, sans-serif);
      padding: 16px;
      margin: 0;
      user-select: none;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }
    .logo-wrap {
      width: 52px;
      height: 52px;
      margin-top: 12px;
    }
    .title {
      font-size: 15px;
      font-weight: 600;
      margin: 0;
      letter-spacing: 0.3px;
    }
    .session-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 14px 16px;
      width: 100%;
      box-sizing: border-box;
    }
    .status-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .dot.running {
      background: #4ec9b0;
      box-shadow: 0 0 8px rgba(78,201,176,0.7);
    }
    .dot.stopped {
      background: #6e6e6e;
    }
    .status-text {
      font-size: 13px;
      font-weight: 500;
    }
    .hint {
      font-size: 11px;
      opacity: 0.5;
      margin-top: 8px;
      text-align: center;
      line-height: 1.5;
    }
    .version {
      font-size: 10px;
      opacity: 0.25;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <svg class="logo-wrap" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="4" x2="24" y2="20" gradientUnits="userSpaceOnUse">
          <stop stop-color="#4F46E5"/>
          <stop offset="1" stop-color="#06B6D4"/>
        </linearGradient>
      </defs>
      <path d="M20 14 C20 9 14 7 8 10 C5 11 3 13 2 15" stroke="url(#g)" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <path d="M2 15 L0 11" stroke="url(#g)" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M2 15 L0 19" stroke="url(#g)" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M17 9 C16.5 7 17 5.5 18 4" stroke="#06B6D4" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.8"/>
      <circle cx="18.5" cy="3" r="1.2" fill="#4F46E5" opacity="0.6"/>
      <circle cx="20" cy="2.2" r="0.7" fill="#06B6D4" opacity="0.5"/>
    </svg>

    <h3 class="title">Reasonix 会话</h3>

    ${statusHtml}

    <div class="version">reasonix-vscode v0.1.0</div>
  </div>
</body>
</html>`;
  }
}

function deactivate() {}

module.exports = { activate, deactivate };
