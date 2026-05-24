import { chromeWrap } from '../components/shell.js';
import { Icon } from '../components/icons.js';
import { listRoutineOptions, pickTodayRoutine } from '../engine/routine.js';

export function renderRoutines(state) {
  const today = pickTodayRoutine(state);
  const options = listRoutineOptions(state).filter(r => r.id !== today.id);
  const html = chromeWrap({
    activeTab: 'routines',
    scroll: true,
    body: `
      <div style="padding-top:8px;">
        <h1 class="serif" style="font-size:32px;font-weight:400;letter-spacing:-0.02em;margin-bottom:16px;">Routines</h1>
        <p class="muted" style="font-size:13px;margin-bottom:18px;">Today's pick is up top. Below are alternates tuned to your selected areas.</p>

        ${routineCard(today, true)}

        <div style="margin:20px 0 10px;font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Other options</div>

        ${options.length ? options.map(r => routineCard(r, false)).join('') : `<div class="card"><div class="muted" style="font-size:13px;">Pick more areas in Profile to unlock alternates.</div></div>`}
      </div>
    `,
  });
  return { html };
}

function routineCard(r, isToday) {
  return `<a href="#/player/${r.id}" class="card" style="display:flex;gap:12px;align-items:center;text-decoration:none;color:inherit;margin-bottom:8px;${isToday ? 'border:1px solid rgba(91,192,167,0.3);background:linear-gradient(160deg,rgba(91,192,167,0.08) 0%,var(--surface) 100%);' : ''}">
    <div style="width:54px;height:54px;border-radius:14px;flex-shrink:0;background: linear-gradient(160deg, ${r.pastel} 0%, color-mix(in srgb, ${r.pastel} 70%, #1a2620) 100%);"></div>
    <div style="flex:1;min-width:0;">
      <div style="font-family:var(--serif);font-size:16px;font-weight:500;">${escape(r.title)}</div>
      <div class="muted" style="font-size:11px;margin-top:2px;">${Math.round(r.durationSec/60)} min · ${r.exercises.length} stretches</div>
    </div>
    <div style="color:var(--accent);">${Icon.play()}</div>
  </a>`;
}

function escape(s) { return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
