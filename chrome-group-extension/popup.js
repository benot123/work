// Tab Group 颜色列表（Chrome 支持的 9 种）
const GROUP_COLORS = [
  'blue', 'red', 'yellow', 'green', 'pink',
  'purple', 'cyan', 'orange', 'grey'
];

function setStatus(msg) {
  document.getElementById('status').textContent = msg;
}

/**
 * 按完整 hostname 分组，e.g. dataset-management.evad.mioffice.cn
 */
async function groupTabsByDomain() {
  setStatus('处理中...');

  const tabs = await chrome.tabs.query({ currentWindow: true });

  // 解散已有 group
  const validIds = tabs.map(t => t.id).filter(Boolean);
  if (validIds.length) {
    await chrome.tabs.ungroup(validIds).catch(() => {});
  }

  // 按完整 hostname 归类
  const hostnameMap = new Map();
  for (const tab of tabs) {
    let hostname;
    try { hostname = new URL(tab.url).hostname; } catch { continue; }
    if (!hostname) continue;
    if (!hostnameMap.has(hostname)) hostnameMap.set(hostname, []);
    hostnameMap.get(hostname).push(tab.id);
  }

  // 有 2 个及以上 tab 的 hostname 建 group
  let colorIndex = 0;
  let groupCount = 0;

  for (const [hostname, tabIds] of hostnameMap) {
    if (tabIds.length < 2) continue;
    const groupId = await chrome.tabs.group({ tabIds });
    await chrome.tabGroups.update(groupId, {
      title: hostname,
      color: GROUP_COLORS[colorIndex % GROUP_COLORS.length],
      collapsed: false
    });
    colorIndex++;
    groupCount++;
  }

  setStatus(groupCount > 0
    ? `完成：已创建 ${groupCount} 个分组`
    : '无域名重复的标签页，未创建分组'
  );
}

/**
 * 关闭重复域名的标签页，每个域名仅保留最新打开的一个（tab.id 最大）
 */
async function closeTabsByDomain() {
  setStatus('处理中...');

  const tabs = await chrome.tabs.query({ currentWindow: true });

  // 按完整 URL 归类
  const urlMap = new Map();
  for (const tab of tabs) {
    if (!tab.url) continue;
    if (!urlMap.has(tab.url)) urlMap.set(tab.url, []);
    urlMap.get(tab.url).push(tab);
  }

  // 收集需要关闭的 tab id（每个完整 URL 保留 id 最大的那个）
  const toClose = [];
  for (const [, tabList] of urlMap) {
    if (tabList.length < 2) continue;
    // id 最大 = 最新打开
    const newest = tabList.reduce((a, b) => (a.id > b.id ? a : b));
    for (const tab of tabList) {
      if (tab.id !== newest.id) toClose.push(tab.id);
    }
  }

  if (toClose.length === 0) {
    setStatus('无重复域名的标签页');
    return;
  }

  await chrome.tabs.remove(toClose);
  setStatus(`已关闭 ${toClose.length} 个重复标签页`);
}

/**
 * 解散当前窗口所有 group
 */
async function ungroupAll() {
  setStatus('解散中...');
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const validIds = tabs.map(t => t.id).filter(Boolean);
  if (validIds.length) {
    await chrome.tabs.ungroup(validIds).catch(() => {});
  }
  setStatus('已解散所有分组');
}

document.getElementById('groupBtn').addEventListener('click', groupTabsByDomain);
document.getElementById('dedupeBtn').addEventListener('click', closeTabsByDomain);
document.getElementById('ungroupBtn').addEventListener('click', ungroupAll);
