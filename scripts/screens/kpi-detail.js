import { statusBarHtml } from '../components/shell.js';
import { Icon } from '../components/icons.js';
import { scoreBandHtml } from '../components/score-band.js';
import { asymmetryHtml } from '../components/asymmetry.js';
import { illustrationFor } from '../components/exercise-illustrations.js';
import { getKpi, compositeScore, deltaSinceBaseline, historyForKpi, recentForKpi, bandLabel } from '../data/kpis.js';
import { exercisesForKpi } from '../data/exercises.js';

export function renderKpiDetail(state, kpiId) {
  const k = getKpi(kpiId);
  if (!k) return `<div class="screen"><div class="empty"><h2>KPI not found</h2><a class="btn-link" href="#/progress">Back to progress</a></div></div>`;

  const score = compositeScore(kpiId, state.measurements);
  const recent = recentForKpi(kpiId, state.measurements);
  const left = recent.find(m => m.side === 'left');
  const right = recent.find(m => m.side === 'right');
  const delta = deltaSinceBaseline(kpiId, state.measurements);
  const hist = historyForKpi(kpiId, state.measurements);
  const band = score ? bandLabel(score) : '';
  const related = exercisesForKpi(kpiId).slice(0, 6);

  const html = `
    ${statusBarHtml('9:43')}
    <div class="screen scroll">
      <div class="screen-body scroll kpi-detail">
        <a class="breadcrumb" href="#/progress" style="text-decoration:none;">${Icon.chevL()}<span>Progress</span></a>
        <div class="kpi-title">${k.name}</div>
        <div class="kpi-desc">${k.plain}</div>

        <div class="score-hero">
          <div>
            <div class="lbl">Current score</div>
            <div class="score">${score != null ? score : '—'}<span class="denom">/5</span></div>
            ${band ? `<div class="band-text">${band}</div>` : ''}
          </div>
          <div style="text-align:right;">
            <div class="vs-start-lbl">vs. start</div>
            <div class="delta-val">${delta > 0 ? '↑ +' : delta < 0 ? '↓ ' : ''}${delta !== 0 ? delta : '—'}</div>
          </div>
        </div>

        ${score ? `<div style="margin-bottom:14px;">${scoreBandHtml(score)}</div>` : ''}

        <div class="history-card">
          <div class="hr"><div class="he">History</div><div class="period">90 days</div></div>
          ${historyChartSvg(hist)}
        </div>

        ${k.sided && left && right ? asymmetryHtml({ left: left.rawValue, right: right.rawValue, unit: k.unit }) : ''}

        ${related.length ? `
          <div class="exercises-card">
            <div class="card-label">Exercises that build this</div>
            ${related.map(e => `
              <div class="ex-row">
                <div class="thumb">${illustrationFor(e.id, 44)}</div>
                <div class="info">
                  <div class="nm">${e.name}</div>
                  ${e.oneLiner ? `<div class="ol">${e.oneLiner}</div>` : ''}
                </div>
                <div class="dur">${e.durationSec}s</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <a class="btn-primary" href="#/onboarding/measure-test?kpi=${kpiId}&mode=remeasure" style="text-decoration:none;display:block;text-align:center;margin-top:6px;">Re-measure now</a>
        <div style="height:18px;"></div>
      </div>
    </div>
  `;
  return { html };
}

function historyChartSvg(history) {
  const w = 280, h = 100;
  if (!history.length) {
    return `<svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}">
      <line x1="0" y1="${h/2}" x2="${w}" y2="${h/2}" stroke="var(--text-faint)" stroke-width="1" stroke-dasharray="3 4"/>
      <text x="${w/2}" y="${h/2 - 6}" text-anchor="middle" fill="var(--text-muted)" font-size="11" font-family="Outfit">No history yet</text>
    </svg>`;
  }
  const min = 1, max = 5;
  const t0 = new Date(history[0].timestamp).getTime();
  const tEnd = new Date(history[history.length - 1].timestamp).getTime();
  const span = Math.max(1, tEnd - t0);
  const pad = 20;
  const pts = history.map(m => {
    const x = pad + ((new Date(m.timestamp).getTime() - t0) / span) * (w - pad * 2);
    const y = h - ((m.score - min) / (max - min)) * (h - 10) - 5;
    return { x, y };
  });
  const polyline = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const dots = pts.map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="${i === pts.length - 1 ? 4 : 3}" fill="var(--accent)" ${i === pts.length - 1 ? 'stroke="var(--bg)" stroke-width="2"' : ''}/>`).join('');
  const gridY = [20, 40, 60, 80].map(y => `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>`).join('');
  return `<svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}">
    ${gridY}
    <rect x="0" y="35" width="${w}" height="20" fill="rgba(255,255,255,0.025)"/>
    <polyline points="${polyline}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
    <text x="0" y="14" fill="var(--text-faint)" font-size="8" font-family="Outfit">5</text>
    <text x="0" y="94" fill="var(--text-faint)" font-size="8" font-family="Outfit">1</text>
  </svg>`;
}
