const vscode = require('vscode');

/**
 * Reasonix VS Code 扩展
 * — 活动栏鲸鱼图标入口，点击直接启动终端
 * — 命令面板启动 (Ctrl+Shift+P → "Reasonix: 启动终端")
 * — 终端自动在编辑器右侧贴靠
 */
function activate(context) {
  console.log('[Reasonix] 扩展已激活');

  // ── 注册启动命令 ────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('reasonix.launch', launchReasonix)
  );

  // ── 注册侧边栏占位视图（活动栏图标需要） ──────────────────
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('reasonix.sidebar', new ReasonixSidebarProvider())
  );

  // ── 激活后自动启动终端 ──────────────────────────────────────
  launchReasonix();
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
 * 极简侧边栏占位（点击活动栏图标时展示）
 * 无会话状态追踪，仅显示品牌标识。
 */
class ReasonixSidebarProvider {
  resolveWebviewView(webviewView) {
    webviewView.webview.html = `<!DOCTYPE html>
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
    .title { font-size: 15px; font-weight: 600; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="title">🐋 Reasonix</div>
  <p style="font-size:12px;opacity:0.5;">终端已在右侧打开</p>
</body>
</html>`;
  }
}

function deactivate() {}

module.exports = { activate, deactivate };
