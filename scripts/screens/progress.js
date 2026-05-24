import { chromeWrap } from '../components/shell.js';
import { Icon } from '../components/icons.js';
import { radarSvg } from '../components/radar.js';
import { sparklineSvg } from '../components/sparkline.js';
import { coreIndex, baselineCoreIndex, activeKpiIds } from '../engine/score.js';
import { getKpi, compositeScore, deltaSinceBaseline, historyForKpi } from '../data/kpis.js';

export function renderProgress(state) {
  const ids = activeKpiIds(state);
  const idx = coreIndex(state);
  const baseline = baselineCoreIndex(state);
  const delta = (idx != null && baseline != null) ? Math.round((idx - baseline) * 10) / 10 : null;
  const radarAxes = ids.slice(0, 6).map(id => {
    const k = getKpi(id);
    return { label: (k && k.shortName.split(' ').slice(0, 2).join(' ')) || id, value: compositeScore(id, state.measurements) || 0 };
  });

  const html = chromeWrap({
    activeTab: 'progress',
    scroll: true,
    body: `
      <div class="progress" style="display:flex;flex-direction:column;">
        <div class="title">Progress</div>

        <div class="core-index-card">
          <div class="lbl">CORE Index</div>
          <div class="val">${idx != null ? idx.toFixed(1) : '—'}<span class="denom">/5</span></div>
          ${delta != null ? `<div class="delta">${delta > 0 ? '↑' : delta < 0 ? '↓' : '→'} ${Math.abs(delta).toFixed(1)} ${delta > 0 ? 'since you started' : delta < 0 ? 'since you started' : 'no change yet'}</div>` : `<div class="delta muted">Take measurements to build your baseline</div>`}
          <div class="radar-mini">${radarAxes.length >= 3 ? radarSvg({ axes: radarAxes, size: 110 }) : ''}</div>
        </div>

        <div class="streaks">
          <div class="streak-card">
            <div class="ir" style="color:var(--accent-warm);">${Icon.flame()}<span class="lbl">Practice</span></div>
            <div class="val">${state.streaks.practice.current}<span class="unit"> day${state.streaks.practice.current === 1 ? '' : 's'}</span></div>
            <div class="sub">Longest: ${state.streaks.practice.longest}</div>
          </div>
          <div class="streak-card improvement">
            <div class="ir" style="color:var(--accent);">${Icon.trendUp()}<span class="lbl">Improvement</span></div>
            <div class="val">${countImprovement(state)}<span class="unit"> check${countImprovement(state) === 1 ? '' : 's'}</span></div>
            <div class="sub">${countImprovement(state) > 0 ? 'All going up' : 'Re-measure to track'}</div>
          </div>
        </div>

        <div class="filter-row">
          <div class="he">Your KPIs</div>
          <div class="chips">
            <button class="chip active" data-filter="all">All</button>
            <button class="chip" data-filter="mobility">Mobility</button>
            <button class="chip" data-filter="core">Core</button>
          </div>
        </div>

        <div id="kpi-list">
          ${ids.length ? ids.map(id => renderKpiRow(id, state)).join('') : `<div class="card"><div class="muted" style="font-size:13px;">Take Measure Tests to populate your KPIs.</div></div>`}
        </div>

        <div style="height:12px;"></div>
        <a class="btn-primary" href="#/onboarding/measure-intro?mode=remeasure" style="text-decoration:none;display:block;text-align:center;">Re-measure</a>
        <div style="height:18px;"></div>
      </div>
    `,
  });

  return {
    html,
    onMount(root) {
      const chips = root.querySelectorAll('.chip');
      chips.forEach(c => c.addEventListener('click', () => {
        chips.forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        const f = c.dataset.filter;
        const list = root.querySelector('#kpi-list');
        list.innerHTML = ids.filter(id => filterMatch(id, f)).map(id => renderKpiRow(id, state)).join('');
      }));
    },
  };
}

function filterMatch(id, f) {
  if (f === 'all') return true;
  if (f === 'core') return id.startsWith('c');
  if (f === 'mobility') return id.startsWith('f') || id.startsWith('b');
  return true;
}
function countImprovement(state) {
  const ids = activeKpiIds(state);
  let n = 0;
  for (const id of ids) if (deltaSinceBaseline(id, state.measurements) > 0) n++;
  return n;
}
function renderKpiRow(id, state) {
  const k = getKpi(id);
  if (!k) return '';
  const score = compositeScore(id, state.measurements);
  const hist = historyForKpi(id, state.measurements).map(m => m.score);
  const d = deltaSinceBaseline(id, state.measurements);
  const trendClass = d > 0 ? '' : d < 0 ? 'down' : 'flat';
  const trendChar = d > 0 ? '↑' : d < 0 ? '↓' : '→';
  const areaLabel = (k.areas[0] || '').replace(/_/g, ' ');
  return `<a class="kpi-row" href="#/kpi/${id}" style="text-decoration:none;color:inherit;">
    <div class="name">${k.name}<div class="area-label">${areaLabel}</div></div>
    ${sparklineSvg(hist, 38, 14)}
    <div class="trend ${trendClass}">${trendChar}</div>
    <div class="score-badge ${score >= 3 ? 'good' : ''}">${score != null ? score : '—'}</div>
  </a>`;
}
