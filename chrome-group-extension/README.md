# chrome-group-extension

一个轻量的 Chrome 扩展，帮助你快速整理标签页。

A lightweight Chrome extension to help you organize tabs efficiently.

---

## 功能 / Features

### 1. 按域名分组标签页 / Group Tabs by Domain

将当前窗口中所有标签页按完整域名（hostname）自动归组。相同域名下有 2 个及以上标签页时，将自动创建一个以域名命名的 Tab Group，并分配不同颜色加以区分。

Automatically groups all tabs in the current window by their full hostname. When 2 or more tabs share the same hostname, they are placed into a named Tab Group with a distinct color.

- 触发前会先解散已有分组，确保结果干净整洁
- Existing groups are dissolved before regrouping for a clean result
- 支持 9 种分组颜色循环分配：blue / red / yellow / green / pink / purple / cyan / orange / grey
- Supports 9 cycling group colors: blue / red / yellow / green / pink / purple / cyan / orange / grey

---

### 2. 关闭重复标签页（保留最新）/ Close Duplicate Tabs (Keep Latest)

检测当前窗口中 **完整 URL 完全相同** 的标签页，每组重复中仅保留最新打开的一个（依据 Tab ID，ID 越大表示打开越晚），其余自动关闭。

Detects tabs in the current window with **exactly the same full URL**. For each group of duplicates, only the most recently opened tab is kept (determined by Tab ID — a higher ID means it was opened later), and the rest are closed automatically.

- 仅完整 URL 一致才视为重复，路径或参数不同则不受影响
- Only tabs with identical full URLs are considered duplicates; different paths or query strings are unaffected

---

### 3. 解散所有分组 / Ungroup All Tabs

一键解散当前窗口内的所有 Tab Group，恢复为普通标签页，不会关闭任何标签页。

Dissolves all Tab Groups in the current window in one click, reverting tabs to ungrouped state without closing any of them.

---

## 安装 / Installation

本扩展未上架 Chrome Web Store，需手动加载。

This extension is not published on the Chrome Web Store and must be loaded manually.

1. 下载或克隆本仓库 / Download or clone this repository
2. 打开 Chrome，访问 `chrome://extensions/` / Open Chrome and navigate to `chrome://extensions/`
3. 开启右上角 **开发者模式** / Enable **Developer mode** in the top-right corner
4. 点击 **加载已解压的扩展程序** / Click **Load unpacked**
5. 选择本项目根目录 / Select the root directory of this project

---

## 权限说明 / Permissions

| 权限 / Permission | 用途 / Purpose |
|---|---|
| `tabs` | 读取、关闭标签页 / Read and close tabs |
| `tabGroups` | 创建、更新、解散分组 / Create, update, and dissolve tab groups |

---

## 文件结构 / File Structure

```
chrome-group-extension/
├── manifest.json      # 扩展配置 / Extension manifest
├── popup.html         # 弹出界面 / Popup UI
├── popup.js           # 核心逻辑 / Core logic
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 兼容性 / Compatibility

- 需要 Chrome 89+（Tab Groups API 最低版本要求）
- Requires Chrome 89+ (minimum version for the Tab Groups API)
- 不支持 Safari 或 Firefox
- Safari and Firefox are not supported
