import { getBookendRoutine, focusAreas, DEFAULT_FOCUS } from '../engine/bookends.js';

// Body map: front + back figure with tappable checkmarks. Selection is the
// user's focus areas (state.selectedAreas) — Post-Sea and Core Flex are
// built from it.
// Each spot: x/y in the 120x250 figure viewBox, label side (l/r).
const FRONT = [
  { key: 'neck', areas: ['neck'], label: 'Neck', x: 60, y: 39, side: 'r' },
  { key: 'shoulders', areas: ['shoulders'], label: 'Shoulders', x: 30, y: 54, side: 'l' },
  { key: 'chest', areas: ['chest'], label: 'Chest', x: 70, y: 66, side: 'r' },
  { key: 'core', areas: ['core_anterior', 'core_lateral', 'core_posterior'], label: 'Core', x: 60, y: 102, side: 'r' },
  { key: 'hips', areas: ['hips'], label: 'Hip flexors', x: 47, y: 130, side: 'l' },
  { key: 'quads', areas: ['quads'], label: 'Quads', x: 72, y: 168, side: 'r' },
];
const BACK = [
  { key: 'upper_back', areas: ['upper_back'], label: 'Upper back', x: 60, y: 70, side: 'r' },
  { key: 'lower_back', areas: ['lower_back'], label: 'Lower back', x: 60, y: 110, side: 'r' },
  { key: 'glutes', areas: ['glutes'], label: 'Glutes', x: 48, y: 136, side: 'l' },
  { key: 'hamstrings', areas: ['hamstrings'], label: 'Hamstrings', x: 72, y: 176, side: 'r' },
  { key: 'calves', areas: ['ankles_calves'], label: 'Calves', x: 48, y: 214, side: 'l' },
];
const EXTRA = [
  { key: 'full_body', areas: ['full_body'], label: 'Full body' },
  { key: 'balance', areas: ['balance'], label: 'Balance' },
];
const ALL = [...FRONT, ...BACK, ...EXTRA];

function figure(spots, title, sel) {
  const on = s => s.areas.every(a => sel.has(a));
  return `<svg class="bm-fig" viewBox="-46 0 212 252" role="group" aria-label="${title}">
    <g class="bm-body">
      <circle cx="60" cy="18" r="14"/>
      <rect x="54" y="30" width="12" height="12" rx="4"/>
      <path d="M32 46 Q60 40 88 46 L86 122 Q60 132 34 122 Z"/>
      <line x1="34" y1="50" x2="20" y2="132"/><line x1="86" y1="50" x2="100" y2="132"/>
      <line x1="48" y1="124" x2="46" y2="238"/><line x1="72" y1="124" x2="74" y2="238"/>
    </g>
    <text class="bm-cap" x="60" y="250" text-anchor="middle">${title}</text>
    ${spots.map(s => `
      <g class="bm-spot${on(s) ? ' on' : ''}" data-key="${s.key}" role="checkbox" aria-checked="${on(s)}" tabindex="0">
        <circle class="hit" cx="${s.x}" cy="${s.y}" r="17"/>
        <circle class="dot" cx="${s.x}" cy="${s.y}" r="9.5"/>
        <path class="tick" d="M${s.x - 4.5} ${s.y} l3 3.2 l6 -6.4"/>
        <line class="lead" x1="${s.side === 'l' ? s.x - 10 : s.x + 10}" y1="${s.y}" x2="${s.side === 'l' ? 12 : 108}" y2="${s.y}"/>
        <text x="${s.side === 'l' ? 9 : 111}" y="${s.y + 3.5}" text-anchor="${s.side === 'l' ? 'end' : 'start'}">${s.label}</text>
      </g>`).join('')}
  </svg>`;
}

export function openBodyMap(root, state, onSave) {
  const sel = new Set(state.selectedAreas || []);
  const sheet = document.createElement('div');
  sheet.className = 'sheet-backdrop';
  sheet.innerHTML = `
    <div class="sheet body-map" onclick="event.stopPropagation()">
      <div class="handle"></div>
      <div class="bm-head">
        <h3>Focus areas</h3>
        <div class="bm-summary" id="bm-summary"></div>
      </div>
      <p class="bm-lead">Tap to check. Post-Sea and Core Flex are built from these.</p>
      <div class="bm-figs">${figure(FRONT, 'Front', sel)}${figure(BACK, 'Back', sel)}</div>
      <div class="bm-extra">
        ${EXTRA.map(s => `<button class="bm-chip bare${s.areas.every(a => sel.has(a)) ? ' on' : ''}" data-key="${s.key}">${s.label}</button>`).join('')}
        <button class="bm-chip bare reset" data-action="reset">Reset to default</button>
      </div>
      <button class="btn-primary" data-action="save">Done</button>
    </div>`;
  root.appendChild(sheet);

  const summary = () => {
    const r = getBookendRoutine('r_post_sea7', { ...state, selectedAreas: [...sel] });
    const mins = Math.round(r.durationSec / 60);
    sheet.querySelector('#bm-summary').textContent = sel.size
      ? `Post-Sea: ${mins} min · ${r.exercises.length} steps`
      : `None checked: default (${mins} min)`;
  };
  const toggle = key => {
    const spot = ALL.find(s => s.key === key);
    const isOn = spot.areas.every(a => sel.has(a));
    spot.areas.forEach(a => (isOn ? sel.delete(a) : sel.add(a)));
    sheet.querySelectorAll(`[data-key="${key}"]`).forEach(el => {
      el.classList.toggle('on', !isOn);
      if (el.hasAttribute('aria-checked')) el.setAttribute('aria-checked', String(!isOn));
    });
    summary();
  };
  sheet.querySelectorAll('[data-key]').forEach(el => {
    el.addEventListener('click', () => toggle(el.dataset.key));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(el.dataset.key); } });
  });
  sheet.querySelector('[data-action="reset"]').addEventListener('click', () => {
    sel.clear(); DEFAULT_FOCUS.forEach(a => sel.add(a));
    sheet.querySelectorAll('[data-key]').forEach(el => {
      const s = ALL.find(x => x.key === el.dataset.key);
      const on = s.areas.every(a => sel.has(a));
      el.classList.toggle('on', on);
      if (el.hasAttribute('aria-checked')) el.setAttribute('aria-checked', String(on));
    });
    summary();
  });
  const close = save => {
    sheet.remove();
    if (save) onSave([...sel]);
  };
  sheet.addEventListener('click', () => close(true));
  sheet.querySelector('[data-action="save"]').addEventListener('click', () => close(true));
  summary();
}

// Number of checked spots (Core counts once, not as its three sub-areas).
export function focusCount(state) {
  const sel = new Set(state.selectedAreas || []);
  return ALL.filter(s => s.areas.every(a => sel.has(a))).length;
}

export function focusLabel(state) {
  const sel = new Set(focusAreas(state));
  const names = ALL.filter(s => s.areas.every(a => sel.has(a))).map(s => s.label);
  return names.length ? names.join(' · ') : '';
}
