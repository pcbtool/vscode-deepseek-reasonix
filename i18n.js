const vscode = require('vscode');
const zh = require('./i18n/zh.json');
const en = require('./i18n/en.json');

/**
 * 语言包加载器
 * 根据 VS Code 当前界面语言自动选择翻译文件。
 * 中文变体（zh-CN / zh-TW / zh-Hans / zh-Hant）使用中文包，
 * 其余语言统一 fallback 到英文。
 */
const bundles = { zh, en };

const lang = vscode.env.language;
const isZh = lang.startsWith('zh');
const bundle = isZh ? bundles.zh : bundles.en;

/**
 * 根据点号路径获取翻译字符串
 * @param {string} key - 如 "sidebar.button.launch"
 * @returns {string}
 */
function t(key) {
  const keys = key.split('.');
  let value = bundle;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`[i18n] Missing translation key: "${key}"`);
      return key;
    }
  }
  if (typeof value !== 'string') {
    console.warn(`[i18n] Translation for "${key}" is not a string`);
    return key;
  }
  return value;
}

/**
 * 获取翻译数据中任意路径的值（字符串 / 对象 / 数组）
 * @param {string} key - 如 "sidebar.links"
 * @returns {*}
 */
function get(key) {
  const keys = key.split('.');
  let value = bundle;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`[i18n] Missing key: "${key}"`);
      return null;
    }
  }
  return value;
}

module.exports = { t, get };
