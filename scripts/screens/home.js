import { chromeWrap } from '../components/shell.js';
import { Icon } from '../components/icons.js';
import { coreIndex, staleKpis } from '../engine/score.js';
import { FLEX_LEVELS, newFlexSeed } from '../engine/flex.js';
import { streakInfo, recentDays, todaySummary, logBeach, undoBeachToday, setCheckin, shareLine, getBookendRoutine } from '../engine/bookends.js';
import { openBodyMap, focusLabel, focusCount } from '../components/body-map.js';
import { getState, setState } from '../store.js';

// Today: one screen, no scrolling. Greeting + body-map button, the week's
// stars, the three bookends, Core Flex, then the two quick taps.
export function renderHome(state) {
  const name = state.profile.displayName || 'friend';
  const idx = coreIndex(state);
  const stale = staleKpis(state);
  const today = todaySummary(state);
  const post = getBookendRoutine('r_post_sea7', state);
  const postMin = Math.max(1, Math.round(post.durationSec / 60));
  const beachGuide = state.preferences.beachGuide === true;
  const focusN = focusCount(state);

  const html = chromeWrap({
    activeTab: 'home',
    klass: 'home-screen',
    body: `
      <div class="home">
        <div class="home-head">
          <div class="greeting">
            <div class="hi">Good ${greeting()}, ${escape(name)}</div>
            <div class="sub">
              <a href="#/progress">CORE ${idx != null ? idx.toFixed(1) : '—'}</a>
              ${stale.length ? ` · <a href="#/onboarding/measure-intro?mode=remeasure" class="warm">${stale.length} to re-measure</a>` : ''}
            </div>
          </div>
          <button class="body-btn bare" data-action="body" aria-label="Focus areas: ${escape(focusLabel(state))}">
            ${bodyGlyph()}
            <span class="badge">${focusN || '·'}</span>
          </button>
        </div>

        ${streakGauge(state)}

        <div class="bookends" role="group" aria-label="Daily bookends">
          <a class="bookend${today.postSea === 'full' ? ' done' : today.postSea ? ' part' : ''}" href="#/player/r_post_sea7">
            <div class="be-main">
              <div class="be-title">Post-Sea 7</div>
              <div class="be-when">After the sea · ${postMin} min · ${post.exercises.length} steps</div>
            </div>
            <div class="be-state">${today.postSea === 'full' ? '★' : today.postSea ? '☆' : Icon.play()}</div>
          </a>
          <div class="bookend beach${today.beach ? ' done' : ''}">
            <button class="be-main bare" data-action="beach">
              <div class="be-title">Beach 3 ${today.beach ? '✓' : ''}</div>
              <div class="be-when">${beachGuide ? 'Guided: plays the 3 moves' : today.beach ? 'Logged today · tap to undo' : 'Done on the sand? Tap to log'}</div>
            </button>
            <label class="be-guide" title="Guide me through the 3 moves until they're memorised">
              <input type="checkbox" data-action="beach-guide" ${beachGuide ? 'checked' : ''}>
              <span>Guide</span>
            </label>
          </div>
          <a class="bookend${today.car ? ' done' : ''}" href="#/player/r_car60">
            <div class="be-main">
              <div class="be-title">Car Reset 60</div>
              <div class="be-when">After a 45+ min drive, or hourly at the desk</div>
            </div>
            <div class="be-state">${today.car ? `×${today.car}` : Icon.play()}</div>
          </a>
        </div>

        <div class="flex-row">
          <div class="flex-lbl"><div class="flex-title">CORE FLEX</div><div class="flex-sub">Random mix · your areas</div></div>
          <div class="flex-levels" role="group" aria-label="Flex difficulty">
            ${Object.entries(FLEX_LEVELS).map(([key, l]) => `<button class="flex-lvl bare${key === 'medium' ? ' active' : ''}" data-lvl="${key}">${l.label}</button>`).join('')}
          </div>
          <button class="flex-go bare" data-action="start-flex" aria-label="Start Core Flex">${Icon.play()}</button>
        </div>

        <div class="quick-row">
          <div class="stiff">
            <div class="stiff-label">Stiff AM</div>
            <div class="stiff-picks" role="group" aria-label="Morning stiffness 1 to 5">
              ${[1, 2, 3, 4, 5].map(v => `<button class="stiff-pick bare${today.morningStiff === v ? ' active' : ''}" data-stiff="${v}">${v}</button>`).join('')}
            </div>
          </div>
          <button class="share-day bare" data-action="share">Share day</button>
        </div>
      </div>
    `,
  });

  return {
    html,
    onMount(root) {
      root.querySelector('[data-action="body"]').addEventListener('click', () => {
        openBodyMap(root, state, areas => setState(s => ({ ...s, selectedAreas: areas })));
      });
      root.querySelector('[data-action="beach"]').addEventListener('click', () => {
        if (beachGuide) { location.hash = '#/player/r_beach3'; return; }
        if (today.beach) {
          if (confirm("Undo today's Beach 3 log?")) undoBeachToday();
          return;
        }
        logBeach();
        window.toast?.('Beach 3 logged · day saved');
      });
      root.querySelector('[data-action="beach-guide"]').addEventListener('change', e => {
        setState(s => ({ ...s, preferences: { ...s.preferences, beachGuide: e.target.checked } }));
      });
      root.querySelectorAll('[data-stiff]').forEach(b => b.addEventListener('click', () => {
        setCheckin('morning_stiffness', Number(b.dataset.stiff));
      }));
      root.querySelector('[data-action="share"]').addEventListener('click', () => shareDay(root, shareLine(getState())));

      let flexLevel = 'medium';
      root.querySelectorAll('.flex-lvl').forEach(btn => btn.addEventListener('click', () => {
        flexLevel = btn.dataset.lvl;
        root.querySelectorAll('.flex-lvl').forEach(b => b.classList.toggle('active', b === btn));
      }));
      root.querySelector('[data-action="start-flex"]').addEventListener('click', () => {
        location.hash = `#/player/r_flex_${flexLevel}_${newFlexSeed()}`;
      });
    },
  };
}

function bodyGlyph() {
  return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="4" r="2.2"/><path d="M6 8.5h12M12 8v6.5M12 14.5l-3.2 7M12 14.5l3.2 7M8 8.5l-2 5.5M16 8.5l2 5.5"/></svg>`;
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
