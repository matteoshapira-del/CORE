import { loadState, getState, subscribe } from './store.js';
import { renderHome } from './screens/home.js';
import { renderRoutines } from './screens/routines.js';
import { renderProgress } from './screens/progress.js';
import { renderProfile } from './screens/profile.js';
import { renderPlayer } from './screens/player.js';
import { renderComplete } from './screens/complete.js';
import { renderKpiDetail } from './screens/kpi-detail.js';
import { renderOnboarding } from './screens/onboarding/index.js';
import { renderSundayCheck } from './screens/sunday-check.js';
import { installUnlock } from './engine/voice.js';

const mount = document.getElementById('app');

// Simple hash-based router. Each route returns innerHTML and optionally an onMount fn.
const routes = [
  { match: /^#\/home$/, render: renderHome },
  { match: /^#\/routines$/, render: renderRoutines },
  { match: /^#\/progress$/, render: renderProgress },
  { match: /^#\/profile$/, render: renderProfile },
  { match: /^#\/player\/(.+)$/, render: (state, m) => renderPlayer(state, m[1]) },
  { match: /^#\/complete\/(.+)$/, render: (state, m) => renderComplete(state, m[1]) },
  { match: /^#\/sunday-check$/, render: renderSundayCheck },
  { match: /^#\/kpi\/(.+)$/, render: (state, m) => renderKpiDetail(state, m[1]) },
  { match: /^#\/onboarding\/?(.*)$/, render: (state, m) => renderOnboarding(state, m[1]) },
];

let currentCleanup = null;

function navigate() {
  const state = getState();
  let hash = location.hash || '';
  if (!state.onboarded && !hash.startsWith('#/onboarding')) {
    location.hash = '#/onboarding';
    return; // re-fires hashchange
  }
  if (state.onboarded && (!hash || hash === '#/' || hash === '#')) {
    location.hash = '#/home';
    return;
  }
  const route = routes.find(r => r.match.test(hash));
  if (!route) {
    location.hash = '#/home';
    return;
  }
  const m = hash.match(route.match);
  const result = route.render(state, m);
  if (currentCleanup) { try { currentCleanup(); } catch {} currentCleanup = null; }
  if (typeof result === 'string') {
    mount.innerHTML = `<div class="fade-in" style="display:flex;flex-direction:column;flex:1;height:100%;">${result}</div>`;
  } else if (result && result.html) {
    mount.innerHTML = `<div class="fade-in" style="display:flex;flex-direction:column;flex:1;height:100%;">${result.html}</div>`;
    if (result.onMount) currentCleanup = result.onMount(mount) || null;
  }
  // Scroll to top inside any inner scroll container
  const body = mount.querySelector('.screen-body.scroll');
  if (body) body.scrollTop = 0;
}

// Boot
(async () => {
  await loadState();
  installUnlock();
  // Re-render on state changes
  subscribe(() => navigate());
  window.addEventListener('hashchange', navigate);
  navigate();
  // Try to register service worker (only useful when served over http)
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();

// Tiny toast helper exposed globally
window.toast = function (msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2800);
};
