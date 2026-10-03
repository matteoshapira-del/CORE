import { chromeWrap } from '../components/shell.js';
import { Icon } from '../components/icons.js';
import { heroIllustration } from '../components/exercise-illustrations.js';
import { sparklineSvg } from '../components/sparkline.js';
import { coreIndex, activeKpiIds, staleKpis } from '../engine/score.js';
import { pickTodayRoutine } from '../engine/routine.js';
import { FLEX_LEVELS, newFlexSeed } from '../engine/flex.js';
import { getKpi, compositeScore, historyForKpi } from '../data/kpis.js';
import { BEACH_3, streakInfo, recentDays, todaySummary, logBeach, undoBeachToday, setCheckin, shareLine } from '../engine/bookends.js';
import { getExercise } from '../data/exercises.js';
import { getState } from '../store.js';
import { illustrationFor } from '../components/exercise-illustrations.js';

export function renderHome(state) {
  const name = state.profile.displayName || 'friend';
  const dayN = practiceDay(state);
  const routine = pickTodayRoutine(state);
  const idx = coreIndex(state);
  const kpiIds = activeKpiIds(state).slice(0, 8);
  const stale = staleKpis(state);
  const bannerHidden = state.bannerDismissedUntil && Date.now() < new Date(state.bannerDismissedUntil).getTime();
  const showBanner = stale.length > 0 && !bannerHidden;

  const today = todaySummary(state);

  const html = chromeWrap({
    activeTab: 'home',
    scroll: true,
    body: `
      <div class="home" style="display:flex;flex-direction:column;min-height:0;flex:1;">
        <div class="greeting">
          <div class="hi">Good ${greeting()}, ${escape(name)}</div>
          <div class="sub">Day ${dayN} of practice</div>
        </div>

        ${streakGauge(state)}

        <div class="bookends" role="group" aria-label="Daily bookends">
          <a class="bookend${today.postSea === 'full' ? ' done' : today.postSea ? ' part' : ''}" href="#/player/r_post_sea7">
            <div class="be-main">
              <div class="be-title">Post-Sea 7</div>
              <div class="be-when">After the sea, before the shower · ~7 min</div>
            </div>
            <div class="be-state">${today.postSea === 'full' ? '★' : today.postSea ? '☆' : Icon.play()}</div>
          </a>
          <div class="bookend beach${today.beach ? ' done' : ''}">
            <button class="be-main bare" data-action="beach">
              <div class="be-title">Beach 3 ${today.beach ? '✓' : ''}</div>
              <div class="be-when">${today.beach ? 'Logged today · tap to undo' : 'Done on the sand? One tap to log'}</div>
            </button>
            <button class="be-card bare" data-action="beach-card" aria-label="Show the Beach 3 moves">3 moves</button>
          </div>
          <a class="bookend${today.car ? ' done' : ''}" href="#/player/r_car60">
            <div class="be-main">
              <div class="be-title">Car Reset 60</div>
              <div class="be-when">After a 45+ min drive, or hourly at the desk</div>
            </div>
            <div class="be-state">${today.car ? `×${today.car}` : Icon.play()}</div>
          </a>
        </div>

        <div class="stiff-row">
          <div class="stiff-label">Morning stiffness</div>
          <div class="stiff-picks" role="group" aria-label="Morning stiffness 1 to 5">
            ${[1, 2, 3, 4, 5].map(v => `<button class="stiff-pick bare${today.morningStiff === v ? ' active' : ''}" data-stiff="${v}">${v}</button>`).join('')}
          </div>
        </div>

        <button class="share-day bare" data-action="share">Share day <span>→ coach</span></button>

        <div class="bonus-label">Bonus · after the core</div>

        <a class="hero" href="#/player/${routine.id}" style="background: linear-gradient(160deg, ${routine.pastel} 0%, color-mix(in srgb, ${routine.pastel} 70%, #2a3a30) 100%); text-decoration:none;">
          <div class="ribbon"><span class="dot"></span>Today's pick</div>
          <div class="ill">${heroIllustration(routine.areas[0], 180)}</div>
          <div>
            <div class="title">${escape(routine.title)}</div>
            <div class="meta">${Math.round(routine.durationSec/60)} min · ${routine.exercises.length} stretches</div>
          </div>
          <div class="btn-dark"><span>Start</span>${Icon.play()}</div>
        </a>

        <div class="flex-card">
          <div class="flex-head">
            <div class="flex-title">CORE FLEX</div>
            <div class="flex-sub">Bonus: a fresh random mix${state.profile.sciaticaSafe ? ' · sciatica-safe' : ''}</div>
          </div>
          <div class="flex-levels" role="group" aria-label="Flex difficulty">
            ${Object.entries(FLEX_LEVELS).map(([key, l]) => `
              <button class="flex-lvl${key === 'medium' ? ' active' : ''}" data-lvl="${key}">
                <span class="lvl-name">${l.label}</span>
                <span class="lvl-count">${l.min}–${l.max}</span>
              </button>
            `).join('')}
          </div>
          <button class="btn-dark flex-start" data-action="start-flex"><span>Flex</span>${Icon.play()}</button>
        </div>

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

      root.querySelector('[data-action="beach"]').addEventListener('click', () => {
        if (today.beach) {
          if (confirm("Undo today's Beach 3 log?")) undoBeachToday();
          return;
        }
        logBeach();
        window.toast?.('Beach 3 logged · day saved');
      });
      root.querySelector('[data-action="beach-card"]').addEventListener('click', () => showBeachCard(root));
      root.querySelectorAll('[data-stiff]').forEach(b => b.addEventListener('click', () => {
        setCheckin('morning_stiffness', Number(b.dataset.stiff));
      }));
      root.querySelector('[data-action="share"]').addEventListener('click', () => shareDay(root, shareLine(getState())));

      let flexLevel = 'medium';
      root.querySelectorAll('.flex-lvl').forEach(btn => {
        btn.addEventListener('click', () => {
          flexLevel = btn.dataset.lvl;
          root.querySelectorAll('.flex-lvl').forEach(b => b.classList.toggle('active', b === btn));
        });
      });
      root.querySelector('[data-action="start-flex"]')?.addEventListener('click', () => {
        location.hash = `#/player/r_flex_${flexLevel}_${newFlexSeed()}`;
      });
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

// Last 7 days as stars: solid = full Post-Sea 7, hollow = any bookend
// (even one move — the floor rule), grey = nothing. Today stays open until
// midnight, so it doesn't break the streak count.
function streakGauge(state) {
  const info = streakInfo(state);
  const days = recentDays(state, 7, info.map);
  const letters = 'SMTWTFS';
  const stars = days.map((d, i) => {
    const today = i === days.length - 1;
    const cls = d.status === 'solid' ? ' filled' : d.status === 'hollow' ? ' hollow' : '';
    return `<span class="day${today ? ' today' : ''}"><span class="star${cls}">${d.status === 'hollow' ? '☆' : '★'}</span><span class="dl">${letters[d.date.getDay()]}</span></span>`;
  }).join('');
  const streak = info.current;
  const label = streak > 0
    ? `${streak}-day streak${streak >= 7 ? ' 🔥' : ''}${info.todayDone ? '' : ' · today open'}`
    : 'One move saves the day';
  return `<div class="streak-gauge" aria-label="Practice streak: ${streak} days">
    <div class="stars">${stars}</div>
    <div class="streak-label${streak > 0 ? '' : ' muted'}">${label}</div>
  </div>`;
}

function showBeachCard(root) {
  const sheet = document.createElement('div');
  sheet.className = 'sheet-backdrop';
  sheet.innerHTML = `
    <div class="sheet" onclick="event.stopPropagation()">
      <div class="handle"></div>
      <h3>Beach 3</h3>
      <p>On the sand before surf or foil · ~3 min. No phone needed: memorise these, log with one tap when you're home.</p>
      <div class="beach-card">
        ${BEACH_3.map((m, i) => `
          <div class="beach-move">
            <div class="thumb">${illustrationFor(m.id, 56)}</div>
            <div class="info"><div class="nm">${i + 1}. ${escape(m.label)}</div><div class="dose">${escape(m.dose)}</div>
            <div class="ol">${escape((getExercise(m.id) || {}).oneLiner || '')}</div></div>
          </div>`).join('')}
      </div>
      <button class="btn-primary" data-dismiss>Got it</button>
    </div>`;
  root.appendChild(sheet);
  sheet.addEventListener('click', () => sheet.remove());
  sheet.querySelector('[data-dismiss]').addEventListener('click', () => sheet.remove());
}

// Copy the one-line day summary for the LONGEVITY coach chat. Clipboard
// needs a secure context + user gesture; fall back to a selectable sheet.
export async function shareDay(root, line) {
  try {
    await navigator.clipboard.writeText(line);
    window.toast?.('Copied · paste into the coach chat');
    return;
  } catch {}
  const sheet = document.createElement('div');
  sheet.className = 'sheet-backdrop';
  sheet.innerHTML = `<div class="sheet" onclick="event.stopPropagation()"><div class="handle"></div>
    <h3>Share day</h3><p>Copy this line into the coach chat:</p>
    <textarea class="share-text" readonly rows="3">${escape(line)}</textarea>
    <button class="btn-primary" data-dismiss>Done</button></div>`;
  root.appendChild(sheet);
  const ta = sheet.querySelector('textarea');
  ta.focus(); ta.select();
  sheet.addEventListener('click', () => sheet.remove());
  sheet.querySelector('[data-dismiss]').addEventListener('click', () => sheet.remove());
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
