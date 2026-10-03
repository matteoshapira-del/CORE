import { statusBarHtml } from '../components/shell.js';
import { Icon } from '../components/icons.js';
import { resolveRoutine } from '../engine/resolve.js';
import { isSunday, sundayCheckDone, shareLine, streakInfo } from '../engine/bookends.js';
import { getKpi, compositeScore } from '../data/kpis.js';
import { getState } from '../store.js';
import { shareDay } from './home.js';

export function renderComplete(state, routineId) {
  const routine = resolveRoutine(state, routineId);
  const last = state.sessions[state.sessions.length - 1];
  const mins = ((last && last.durationSec) || routine.durationSec) / 60;
  const areas = routine.areas.length;
  const isBookend = !!routine.kind;
  const full = !!(last && last.routineId === routine.id && last.full);
  const streak = streakInfo(state).current;
  const showSunday = routine.kind === 'post_sea' && isSunday() && !sundayCheckDone(state);
  const nudged = (routine.kpisTargeted || []).slice(0, 4);
  const wisdomQuote = pickQuote(nudged, state);

  const html = `
    ${statusBarHtml('9:49')}
    <div class="screen">
      <div class="complete">
        <div class="check">${isBookend ? `<span class="big-star${full ? '' : ' hollow'}">${full ? '★' : '☆'}</span>` : Icon.checkLg()}</div>
        <h1>${isBookend ? (full ? 'Solid star.' : 'Day saved.') : 'Nice.'}</h1>
        <div class="sub-message">${isBookend ? `${routine.title} · ${streak}-day streak` : pickSubMsg(routine.areas)}</div>
        ${showSunday ? `
          <a class="sunday-cta" href="#/sunday-check">
            <div><div class="t">Sunday check · ~3 min</div><div class="s">Forward Fold · Thomas test · driving stiffness</div></div>
            <div class="go">Start →</div>
          </a>` : ''}
        <div class="session-stats">
          <div class="card-label">Session</div>
          <div class="stats-row">
            <div class="stat"><div class="num">${last && last.routineId === routine.id && last.movesDone != null ? last.movesDone : routine.exercises.length}</div><div class="lbl">${isBookend ? 'moves' : 'stretches'}</div></div>
            <div class="stat"><div class="num">${formatMin(mins)}</div><div class="lbl">minutes</div></div>
            <div class="stat"><div class="num">${areas}</div><div class="lbl">area${areas>1?'s':''}</div></div>
          </div>
        </div>
        ${nudged.length ? `
          <div class="nudged-card">
            <div class="card-label">What you just moved</div>
            ${nudged.map(id => renderNudge(id, state)).join('')}
            ${wisdomQuote ? `<div class="quote">"${wisdomQuote}"</div>` : ''}
          </div>
        ` : ''}
        <div class="actions">
          <a class="btn-primary" href="#/home" style="text-decoration:none;display:block;">Done</a>
          ${isBookend ? `<button class="btn-link" data-action="share">Share day → coach</button>` : ''}
          ${nudged.length ? `<a class="btn-link" href="#/kpi/${nudged[0]}" style="text-decoration:none;display:block;">Re-measure one of these?</a>` : ''}
        </div>
      </div>
    </div>
  `;
  return {
    html,
    onMount(root) {
      root.querySelector('[data-action="share"]')?.addEventListener('click', () => shareDay(root, shareLine(getState())));
    },
  };
}

function renderNudge(kpiId, state) {
  const k = getKpi(kpiId);
  if (!k) return '';
  const score = compositeScore(kpiId, state.measurements);
  return `<a href="#/kpi/${kpiId}" class="nudge" style="text-decoration:none;color:inherit;">
    <div class="score-mini">${score != null ? score : '—'}</div>
    <div class="name">${k.name}</div>
    <div class="delta">${Icon.arrowUp()}<span>nudged</span></div>
  </a>`;
}

function pickSubMsg(areas) {
  const map = {
    hips: 'Your hips will thank you tomorrow.',
    hamstrings: 'Your hamstrings will thank you tomorrow.',
    shoulders: 'Your shoulders just opened up.',
    neck: 'A little less tension to carry around.',
    lower_back: 'Your lower back will thank you tomorrow.',
    ankles_calves: 'Your ankles just got a little freer.',
    core_anterior: 'A stronger middle.',
    core_lateral: 'Sides feel solid.',
    core_posterior: 'Backside is online.',
    balance: 'A little steadier today.',
    full_body: 'A full-body reset.',
  };
  for (const a of areas) if (map[a]) return map[a];
  return 'Small things, every day.';
}
function pickQuote(kpiIds, state) {
  const k = kpiIds.map(id => state.measurements.filter(m => m.kpiId === id).length).reduce((a, b) => a + b, 0);
  if (!kpiIds.length) return null;
  if (k < 2) return "You're building something. Keep coming back.";
  return 'Small movements, day after day. That\'s how this works.';
}
function formatMin(m) {
  const total = Math.round(m * 60);
  return `${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`;
}
