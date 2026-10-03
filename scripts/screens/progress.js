import { chromeWrap } from '../components/shell.js';
import { Icon } from '../components/icons.js';
import { radarSvg } from '../components/radar.js';
import { sparklineSvg } from '../components/sparkline.js';
import { coreIndex, baselineCoreIndex, activeKpiIds } from '../engine/score.js';
import { getKpi, compositeScore, deltaSinceBaseline, historyForKpi } from '../data/kpis.js';
import { streakInfo, successCriteria, checkinHistory, signed } from '../engine/bookends.js';
import { flaggedMoves } from '../engine/safety.js';
import { restoreMove } from '../engine/bookends.js';

export function renderProgress(state) {
  const ids = activeKpiIds(state);
  const idx = coreIndex(state);
  const baseline = baselineCoreIndex(state);
  const delta = (idx != null && baseline != null) ? Math.round((idx - baseline) * 10) / 10 : null;
  const radarAxes = ids.slice(0, 6).map(id => {
    const k = getKpi(id);
    return { label: (k && k.shortName.split(' ').slice(0, 2).join(' ')) || id, value: compositeScore(id, state.measurements) || 0 };
  });

  const streak = streakInfo(state);
  const longest = Math.max(streak.longest, (state.streaks && state.streaks.practice && state.streaks.practice.longest) || 0);

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

        ${bookendsCard(state)}

        <div class="streaks">
          <div class="streak-card">
            <div class="ir" style="color:var(--accent-warm);">${Icon.flame()}<span class="lbl">Practice</span></div>
            <div class="val">${streak.current}<span class="unit"> day${streak.current === 1 ? '' : 's'}</span></div>
            <div class="sub">Longest: ${longest}</div>
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
      root.querySelectorAll('[data-restore]').forEach(b => b.addEventListener('click', () => {
        if (confirm('Bring this move back? Its tingle count restarts from zero.')) restoreMove(b.dataset.restore);
      }));
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

// Bookends 4-week scorecard (spec §6) + tingle flags + physio rule.
function bookendsCard(state) {
  const c = successCriteria(state);
  const flagged = flaggedMoves(state);
  const drive = checkinHistory(state, 'drive_stiffness').map(x => x.value);
  const morning = checkinHistory(state, 'morning_stiffness').slice(-28).map(x => x.value);
  const grid = c.last28.map(d => `<span class="g ${d.status || ''}" title="${d.key}">${d.status === 'hollow' ? '☆' : '★'}</span>`).join('');
  const review = c.reviewBy ? new Date(c.reviewBy + 'T00:00:00') : null;
  const pastReview = review && Date.now() >= review.getTime();
  const ok = (cond) => cond == null ? 'pend' : cond ? 'ok' : 'no';
  return `<div class="bookends-card">
    <div class="be-head"><div class="lbl">Bookends · last 4 weeks</div><a class="be-link" href="#/sunday-check">Sunday check →</a></div>
    <div class="be-grid">${grid}</div>
    <div class="crit">
      <div class="c ${ok(c.daysOnPace)}"><span class="k">Streak days</span><span class="v">${c.days}/28 <em>goal ≥ 24</em></span></div>
      <div class="c ${ok(c.driveDelta == null ? null : c.driveDelta <= -1)}"><span class="k">Driving stiffness</span><span class="v">${c.driveLatest ?? '–'}/5${c.driveDelta != null ? ` (${signed(c.driveDelta)})` : ''} <em>goal −1</em>${drive.length > 1 ? sparklineSvg(drive.map(v => 6 - v), 38, 14) : ''}</span></div>
      <div class="c ${ok(c.ffDelta == null ? null : c.ffDelta >= 5)}"><span class="k">Forward Fold</span><span class="v">${c.ffLatest != null ? signed(c.ffLatest) + ' cm' : '–'}${c.ffDelta != null ? ` (${signed(c.ffDelta)})` : ''} <em>goal +5 cm</em></span></div>
      <div class="c ${ok(c.tingles28 === 0)}"><span class="k">Tingles</span><span class="v">${c.tingles28} <em>goal 0</em></span></div>
      ${morning.length > 1 ? `<div class="c pend"><span class="k">Morning stiffness</span><span class="v">${morning[morning.length - 1]}/5 ${sparklineSvg(morning.map(v => 6 - v), 38, 14)}</span></div>` : ''}
    </div>
    ${flagged.length ? `<div class="flagged">
      <div class="lbl">Swapped out after 3 tingles</div>
      ${flagged.map(f => `<div class="f"><span>${f.name}${f.alternate ? ` → ${f.alternate}` : ' (removed)'}</span><button class="bare" data-restore="${f.id}">Restore</button></div>`).join('')}
    </div>` : ''}
    <div class="physio${pastReview ? ' due' : ''}">${pastReview ? 'Review date passed: if the numbers above haven\'t moved, book a physio.' : 'No change by ~1 Nov, or any symptoms below the knee → book a physio.'}</div>
  </div>`;
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
