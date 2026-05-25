import { chromeWrap } from '../components/shell.js';
import { Icon } from '../components/icons.js';
import { heroIllustration } from '../components/exercise-illustrations.js';
import { sparklineSvg } from '../components/sparkline.js';
import { coreIndex, activeKpiIds, staleKpis } from '../engine/score.js';
import { pickTodayRoutine } from '../engine/routine.js';
import { getKpi, compositeScore, historyForKpi } from '../data/kpis.js';

export function renderHome(state) {
  const name = state.profile.displayName || 'friend';
  const dayN = practiceDay(state);
  const routine = pickTodayRoutine(state);
  const idx = coreIndex(state);
  const kpiIds = activeKpiIds(state).slice(0, 8);
  const stale = staleKpis(state);
  const bannerHidden = state.bannerDismissedUntil && Date.now() < new Date(state.bannerDismissedUntil).getTime();
  const showBanner = stale.length > 0 && !bannerHidden;

  const html = chromeWrap({
    activeTab: 'home',
    body: `
      <div class="home" style="display:flex;flex-direction:column;min-height:0;flex:1;">
        <div class="greeting">
          <div class="hi">Good ${greeting()}, ${escape(name)}</div>
          <div class="sub">Day ${dayN} of practice</div>
        </div>

        <a class="hero" href="#/player/${routine.id}" style="background: linear-gradient(160deg, ${routine.pastel} 0%, color-mix(in srgb, ${routine.pastel} 70%, #2a3a30) 100%); text-decoration:none;">
          <div class="ribbon"><span class="dot"></span>Today's pick</div>
          <div class="ill">${heroIllustration(routine.areas[0], 180)}</div>
          <div>
            <div class="title">${escape(routine.title)}</div>
            <div class="meta">${Math.round(routine.durationSec/60)} min · ${routine.exercises.length} stretches</div>
          </div>
          <div class="btn-dark"><span>Start</span>${Icon.play()}</div>
        </a>

        <div class="progress-strip">
          <div class="row">
            <a href="#/progress" class="core-index-mini" style="text-decoration:none;color:inherit;display:block;">
              <div class="label">CORE</div>
              <div class="value">${idx != null ? idx.toFixed(1) : '—'}<span class="denom">/5</span></div>
            </a>
            <div class="kpi-chip-row">
              ${kpiIds.length ? kpiIds.map(id => renderKpiChip(id, state)).join('') : `<div class="kpi-chip"><div class="name">No data</div><div class="row2"><div class="score muted">—</div></div></div>`}
            </div>
          </div>
        </div>

        <a class="alt-link" href="#/routines"><span>Try something else →</span></a>

        ${showBanner ? `
          <button class="remeasure-banner" data-action="goto-progress" style="background:var(--surface);border:1px solid var(--surface-3);text-align:left;width:100%;">
            <div class="pulse-dot"></div>
            <div class="text">${stale.length} KPI${stale.length>1?'s':''} ready to re-measure <span class="mu">· about ${Math.max(2, stale.length * 2)} min</span></div>
            <div class="cta">Check →</div>
          </button>
        ` : ''}

        <div class="spacer"></div>
      </div>
    `,
  });

  return {
    html,
    onMount(root) {
      root.querySelector('[data-action="goto-progress"]')?.addEventListener('click', () => { location.hash = '#/progress'; });
    },
  };
}

function renderKpiChip(id, state) {
  const k = getKpi(id);
  if (!k) return '';
  const score = compositeScore(id, state.measurements);
  const hist = historyForKpi(id, state.measurements).map(m => m.score);
  return `<a href="#/kpi/${id}" class="kpi-chip" style="text-decoration:none;color:inherit;display:block;">
    <div class="name">${escape(k.shortName.toUpperCase())}</div>
    <div class="row2">
      <div class="score">${score != null ? score : '—'}</div>
      ${sparklineSvg(hist, 38, 14)}
    </div>
  </a>`;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}
function practiceDay(state) {
  const sessions = state.sessions || [];
  const days = new Set(sessions.map(s => (s.timestamp || '').slice(0, 10)));
  return Math.max(1, days.size + 1);
}
function escape(s) { return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
