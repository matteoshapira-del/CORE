import { statusBarHtml } from '../../components/shell.js';
import { radarSvg } from '../../components/radar.js';
import { coreIndex, activeKpiIds, weakestKpi } from '../../engine/score.js';
import { getKpi, compositeScore } from '../../data/kpis.js';
import { getArea } from '../../data/areas.js';
import { setState } from '../../store.js';

export function renderBaselineReveal(state) {
  const ids = activeKpiIds(state).slice(0, 6);
  const idx = coreIndex(state);
  const axes = ids.map(id => {
    const k = getKpi(id);
    return { label: k ? k.shortName.toUpperCase().slice(0, 9) : '', value: compositeScore(id, state.measurements) || 0 };
  });
  const weak = weakestKpi(state);
  const weakKpi = weak ? getKpi(weak) : null;
  const weakAreaId = weakKpi ? weakKpi.areas[0] : (state.selectedAreas[0] || 'hips');
  const weakAreaName = (getArea(weakAreaId) || { name: 'these areas' }).name;

  const html = `
    ${statusBarHtml('9:54')}
    <div class="screen">
      <div class="baseline-reveal">
        <div class="eyebrow">Baseline complete</div>
        <h1>Here's where you are.</h1>
        <div class="lead">You've measured ${ids.length} KPI${ids.length===1?'':'s'} across ${state.selectedAreas.length} area${state.selectedAreas.length===1?'':'s'}. This is your starting point.</div>
        <div class="radar-wrap">
          ${axes.length >= 3 ? radarSvg({ axes, size: 240, labels: true, animate: true }) : '<div class="muted">Not enough KPIs for radar yet.</div>'}
          ${idx != null ? `<div class="radar-center"><div class="num score-pop" style="animation-delay:1.1s;">${idx.toFixed(1)}</div><div class="denom">/ 5</div></div>` : ''}
        </div>
        ${weakKpi ? `<div class="weakest">
          <div class="ic"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="4" stroke="#7a4a30" stroke-width="1.5"/><path d="M9 1v3M9 14v3M1 9h3M14 9h3" stroke="#7a4a30" stroke-width="1.5"/></svg></div>
          <div class="tx">Your weakest link is <strong>${weakKpi.name}</strong>. Let's start there.</div>
        </div>` : ''}
        <div class="ctas">
          <button class="btn-primary" id="build-routine">Build my first routine</button>
        </div>
      </div>
    </div>
  `;
  return {
    html,
    onMount(root) {
      root.querySelector('#build-routine').addEventListener('click', () => {
        setState(s => ({ ...s, onboarded: true }));
        location.hash = '#/home';
      });
    },
  };
}
