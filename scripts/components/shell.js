import { Icon } from './icons.js';

export function statusBarHtml(time = '9:41') {
  return `<div class="status-bar" aria-hidden="true">
    <span>${time}</span>
    <span class="right">
      <span>5G</span>
      <svg width="14" height="9" viewBox="0 0 14 9" fill="currentColor"><rect x="0" y="6" width="2" height="3" rx="0.5"/><rect x="3" y="4" width="2" height="5" rx="0.5"/><rect x="6" y="2" width="2" height="7" rx="0.5"/><rect x="9" y="0" width="2" height="9" rx="0.5"/></svg>
      <svg width="22" height="10" viewBox="0 0 22 10"><rect x="0.5" y="0.5" width="19" height="9" rx="2" fill="none" stroke="currentColor"/><rect x="20" y="3" width="1.5" height="4" rx="0.5" fill="currentColor"/><rect x="2" y="2" width="15" height="6" rx="1" fill="currentColor"/></svg>
    </span>
  </div>`;
}

export function tabBarHtml(activeTab) {
  const tabs = [
    { key: 'home', label: 'Today', route: '#/home', icon: Icon.home },
    { key: 'routines', label: 'Routines', route: '#/routines', icon: Icon.list },
    { key: 'progress', label: 'Progress', route: '#/progress', icon: Icon.chart },
    { key: 'profile', label: 'Profile', route: '#/profile', icon: Icon.user },
  ];
  return `<nav class="tab-bar">
    ${tabs.map(t => `
      <a class="tab ${activeTab === t.key ? 'active' : ''}" href="${t.route}">
        ${t.icon()}
        <span>${t.label}</span>
      </a>
    `).join('')}
  </nav>`;
}

export function chromeWrap({ activeTab, body, scroll = false, showStatus = true, showTabs = true, klass = '' }) {
  return `
    ${showStatus ? statusBarHtml() : ''}
    <div class="screen ${klass}">
      <div class="screen-body ${scroll ? 'scroll' : ''}">${body}</div>
    </div>
    ${showTabs ? tabBarHtml(activeTab) : ''}
  `;
}
