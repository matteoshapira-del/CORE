import { chromeWrap } from '../components/shell.js';
import { Icon } from '../components/icons.js';
import { exportJson, importJson, resetAll, setState, APP_VERSION } from '../store.js';

export function renderProfile(state) {
  const initial = (state.profile.displayName || 'Y').charAt(0).toUpperCase();
  const lastBackup = state.preferences.lastBackupAt;
  const ageSex = `${state.profile.age || '—'}${state.profile.sex ? ' · ' + cap(state.profile.sex) : ''}`;
  const hw = `${state.profile.heightCm ? state.profile.heightCm + ' cm' : ''}${state.profile.weightKg ? ' · ' + state.profile.weightKg + ' kg' : ''}` || '—';
  const activity = state.profile.activityLevel ? cap(state.profile.activityLevel) : '—';
  const since = state.profile.createdAt ? `Since ${monthYear(state.profile.createdAt)}` : '';

  const html = chromeWrap({
    activeTab: 'profile',
    scroll: true,
    body: `
      <div class="profile" style="display:flex;flex-direction:column;">
        <div class="title">Profile</div>

        <div class="profile-card">
          <div class="avatar">${initial}</div>
          <div class="who">
            <div class="nm">${escape(state.profile.displayName || 'You')}</div>
            <div class="since">${since}</div>
          </div>
        </div>

        <div class="pref-section">
          <div class="card-label">Your CORE info</div>
          <button class="pref-row bare" data-edit="age_sex">
            <div class="icon-box">${Icon.user()}</div>
            <div class="text"><div class="title">Age & sex</div><div class="sub">${ageSex}</div></div>
            <div class="chev">${Icon.chevR()}</div>
          </button>
          <button class="pref-row bare" data-edit="hw">
            <div class="icon-box">${Icon.ruler()}</div>
            <div class="text"><div class="title">Height & weight</div><div class="sub">${hw}</div></div>
            <div class="chev">${Icon.chevR()}</div>
          </button>
          <button class="pref-row bare" data-edit="activity">
            <div class="icon-box">${Icon.bodyPerson()}</div>
            <div class="text"><div class="title">Activity</div><div class="sub">${activity}</div></div>
            <div class="chev">${Icon.chevR()}</div>
          </button>
        </div>

        <div class="pref-section">
          <div class="card-label">Safety</div>
          <button class="pref-row bare" data-edit="sciatica">
            <div class="icon-box">${Icon.bodyPerson()}</div>
            <div class="text"><div class="title">Sciatica-safe mode</div><div class="sub">${state.profile.sciaticaSafe ? 'On · no straight-leg folds or slumps · Tingle button' : 'Off'}</div></div>
            <div class="chev">${Icon.chevR()}</div>
          </button>
        </div>

        <div class="pref-section">
          <div class="card-label">Areas & KPIs</div>
          <button class="pref-row bare" data-action="reselect-areas">
            <div class="icon-box">${Icon.list()}</div>
            <div class="text"><div class="title">Selected areas</div><div class="sub">${state.selectedAreas.length} chosen</div></div>
            <div class="chev">${Icon.chevR()}</div>
          </button>
        </div>

        <div class="pref-section highlight">
          <div class="card-label" style="color:var(--accent);">Data & Backup</div>
          <button class="pref-row accent bare" data-action="export">
            <div class="icon-box">${Icon.download()}</div>
            <div class="text"><div class="title">Download my data</div><div class="sub">JSON · ${state.measurements.length} measurements</div></div>
            <div class="chev">${Icon.chevR()}</div>
          </button>
          <button class="pref-row accent bare" data-action="import">
            <div class="icon-box">${Icon.upload()}</div>
            <div class="text"><div class="title">Restore from backup</div><div class="sub">${lastBackup ? 'Last backup: ' + relativeTime(lastBackup) : 'No backups yet'}</div></div>
            <div class="chev">${Icon.chevR()}</div>
          </button>
        </div>

        <div class="pref-section">
          <div class="card-label">Preferences</div>
          <button class="pref-row bare" data-edit="reminder">
            <div class="icon-box">${Icon.clock()}</div>
            <div class="text"><div class="title">Daily reminder</div><div class="sub">${state.preferences.remindersEnabled ? state.preferences.reminderTime : 'Off'}</div></div>
            <div class="chev">${Icon.chevR()}</div>
          </button>
          <button class="pref-row bare" data-edit="units">
            <div class="icon-box">${Icon.ruler()}</div>
            <div class="text"><div class="title">Units</div><div class="sub">${state.profile.units === 'metric' ? 'Metric (cm, kg)' : 'Imperial (in, lb)'}</div></div>
            <div class="chev">${Icon.chevR()}</div>
          </button>
          <button class="pref-row bare" data-edit="sounds">
            <div class="icon-box">${Icon.bell()}</div>
            <div class="text"><div class="title">Transition sounds</div><div class="sub">${state.preferences.transitionSounds ? 'On' : 'Off'}</div></div>
            <div class="chev">${Icon.chevR()}</div>
          </button>
        </div>

        <div class="pref-section">
          <div class="card-label">Danger zone</div>
          <button class="pref-row bare" data-action="reset" style="color:var(--accent-warm);">
            <div class="icon-box">${Icon.refresh()}</div>
            <div class="text"><div class="title">Reset everything</div><div class="sub">Restart onboarding from scratch</div></div>
            <div class="chev">${Icon.chevR()}</div>
          </button>
        </div>

        <div class="footer-text">CORE v${APP_VERSION} · Privacy · Support</div>
        <input type="file" id="import-input" accept="application/json,.json" style="display:none;">
      </div>
    `,
  });

  return {
    html,
    onMount(root) {
      root.querySelector('[data-action="export"]').addEventListener('click', doExport);
      root.querySelector('[data-action="import"]').addEventListener('click', () => root.querySelector('#import-input').click());
      root.querySelector('#import-input').addEventListener('change', e => doImport(e.target.files[0]));
      root.querySelector('[data-action="reset"]').addEventListener('click', confirmReset);
      root.querySelector('[data-action="reselect-areas"]').addEventListener('click', () => { location.hash = '#/onboarding/areas?return=profile'; });

      root.querySelector('[data-edit="age_sex"]').addEventListener('click', () => openEditSheet('age_sex', state, root));
      root.querySelector('[data-edit="hw"]').addEventListener('click', () => openEditSheet('hw', state, root));
      root.querySelector('[data-edit="activity"]').addEventListener('click', () => openEditSheet('activity', state, root));
      root.querySelector('[data-edit="reminder"]').addEventListener('click', () => openEditSheet('reminder', state, root));
      root.querySelector('[data-edit="units"]').addEventListener('click', () => openEditSheet('units', state, root));
      root.querySelector('[data-edit="sounds"]').addEventListener('click', () => openEditSheet('sounds', state, root));
      root.querySelector('[data-edit="sciatica"]').addEventListener('click', () => openEditSheet('sciatica', state, root));
    },
  };
}

function doExport() {
  const json = exportJson();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.href = url;
  a.download = `core-backup-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  setState(s => ({ ...s, preferences: { ...s.preferences, lastBackupAt: new Date().toISOString() } }));
  window.toast?.('Backup downloaded');
}

async function doImport(file) {
  if (!file) return;
  const text = await file.text();
  try {
    await importJson(text);
    window.toast?.('Backup restored');
  } catch (e) {
    window.toast?.('Import failed: ' + e.message);
  }
}

function confirmReset() {
  if (!confirm('Reset all CORE data on this device? This cannot be undone.')) return;
  resetAll().then(() => { location.hash = '#/onboarding'; });
}

function openEditSheet(kind, state, root) {
  const sheet = document.createElement('div');
  sheet.className = 'sheet-backdrop';
  let body = '';
  if (kind === 'age_sex') {
    body = `
      <h3>Age & sex</h3>
      <div class="field"><label>Age</label><input type="number" id="ed-age" value="${state.profile.age || ''}" min="10" max="120"></div>
      <div class="field"><label>Sex</label>
        <div class="seg-control">
          ${['male','female','other'].map(s => `<button data-sex="${s}" class="${state.profile.sex === s ? 'active' : ''}">${cap(s)}</button>`).join('')}
        </div>
      </div>
      <button class="btn-primary" data-save>Save</button>
    `;
  } else if (kind === 'hw') {
    body = `
      <h3>Height & weight</h3>
      <div class="field"><label>Height (cm)</label><input type="number" id="ed-h" value="${state.profile.heightCm || ''}"></div>
      <div class="field"><label>Weight (kg)</label><input type="number" id="ed-w" value="${state.profile.weightKg || ''}"></div>
      <button class="btn-primary" data-save>Save</button>
    `;
  } else if (kind === 'activity') {
    body = `
      <h3>Activity level</h3>
      <div class="field"><div class="seg-control" style="flex-wrap:wrap;">
        ${['sedentary','light','moderate','active','athlete'].map(a => `<button data-act="${a}" class="${state.profile.activityLevel === a ? 'active' : ''}">${cap(a)}</button>`).join('')}
      </div></div>
      <button class="btn-primary" data-save>Save</button>
    `;
  } else if (kind === 'reminder') {
    body = `
      <h3>Daily reminder</h3>
      <p>In-app only — the app reminds you when you open it after this hour.</p>
      <div class="field"><label>Time</label><input type="text" id="ed-time" value="${state.preferences.reminderTime}" placeholder="HH:MM"></div>
      <div class="field"><div class="seg-control">
        <button data-r="1" class="${state.preferences.remindersEnabled ? 'active' : ''}">On</button>
        <button data-r="0" class="${!state.preferences.remindersEnabled ? 'active' : ''}">Off</button>
      </div></div>
      <button class="btn-primary" data-save>Save</button>
    `;
  } else if (kind === 'units') {
    body = `
      <h3>Units</h3>
      <div class="field"><div class="seg-control">
        <button data-u="metric" class="${state.profile.units === 'metric' ? 'active' : ''}">Metric (cm, kg)</button>
        <button data-u="imperial" class="${state.profile.units === 'imperial' ? 'active' : ''}">Imperial (in, lb)</button>
      </div></div>
      <button class="btn-primary" data-save>Save</button>
    `;
  } else if (kind === 'sounds') {
    body = `
      <h3>Transition sounds</h3>
      <div class="field"><div class="seg-control">
        <button data-s="1" class="${state.preferences.transitionSounds ? 'active' : ''}">On</button>
        <button data-s="0" class="${!state.preferences.transitionSounds ? 'active' : ''}">Off</button>
      </div></div>
      <button class="btn-primary" data-save>Save</button>
    `;
  } else if (kind === 'sciatica') {
    body = `
      <h3>Sciatica-safe mode</h3>
      <p>Swaps Seated Forward Fold for a nerve slider + bent-knee hamstring, and keeps standing toe-touch holds, long straight-leg folds and slump positions out of FLEX and Today's pick. Adds a <b>Tingle</b> button to the player: it skips the move and logs it; three tingles on the same move swap it for a gentler variant.</p>
      <div class="field"><div class="seg-control">
        <button data-sc="1" class="${state.profile.sciaticaSafe ? 'active' : ''}">On</button>
        <button data-sc="0" class="${!state.profile.sciaticaSafe ? 'active' : ''}">Off</button>
      </div></div>
      <button class="btn-primary" data-save>Save</button>
    `;
  }
  sheet.innerHTML = `<div class="sheet" onclick="event.stopPropagation()"><div class="handle"></div>${body}</div>`;
  root.appendChild(sheet);
  sheet.addEventListener('click', () => sheet.remove());

  // local "pending" selections
  let pendingSex = state.profile.sex;
  let pendingAct = state.profile.activityLevel;
  let pendingReminder = state.preferences.remindersEnabled;
  let pendingUnits = state.profile.units;
  let pendingSounds = state.preferences.transitionSounds;
  let pendingSciatica = !!state.profile.sciaticaSafe;
  sheet.querySelectorAll('[data-sc]').forEach(b => b.addEventListener('click', () => {
    pendingSciatica = b.dataset.sc === '1';
    sheet.querySelectorAll('[data-sc]').forEach(x => x.classList.toggle('active', x === b));
  }));

  sheet.querySelectorAll('[data-sex]').forEach(b => b.addEventListener('click', () => {
    pendingSex = b.dataset.sex;
    sheet.querySelectorAll('[data-sex]').forEach(x => x.classList.toggle('active', x === b));
  }));
  sheet.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => {
    pendingAct = b.dataset.act;
    sheet.querySelectorAll('[data-act]').forEach(x => x.classList.toggle('active', x === b));
  }));
  sheet.querySelectorAll('[data-r]').forEach(b => b.addEventListener('click', () => {
    pendingReminder = b.dataset.r === '1';
    sheet.querySelectorAll('[data-r]').forEach(x => x.classList.toggle('active', x === b));
  }));
  sheet.querySelectorAll('[data-u]').forEach(b => b.addEventListener('click', () => {
    pendingUnits = b.dataset.u;
    sheet.querySelectorAll('[data-u]').forEach(x => x.classList.toggle('active', x === b));
  }));
  sheet.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => {
    pendingSounds = b.dataset.s === '1';
    sheet.querySelectorAll('[data-s]').forEach(x => x.classList.toggle('active', x === b));
  }));

  sheet.querySelector('[data-save]').addEventListener('click', () => {
    const updates = {};
    if (kind === 'age_sex') {
      const age = Number(sheet.querySelector('#ed-age').value) || null;
      updates.profile = { ...state.profile, age, sex: pendingSex };
    } else if (kind === 'hw') {
      const heightCm = Number(sheet.querySelector('#ed-h').value) || null;
      const weightKg = Number(sheet.querySelector('#ed-w').value) || null;
      updates.profile = { ...state.profile, heightCm, weightKg };
    } else if (kind === 'activity') {
      updates.profile = { ...state.profile, activityLevel: pendingAct };
    } else if (kind === 'reminder') {
      const reminderTime = sheet.querySelector('#ed-time').value;
      updates.preferences = { ...state.preferences, reminderTime, remindersEnabled: pendingReminder };
    } else if (kind === 'units') {
      updates.profile = { ...state.profile, units: pendingUnits };
    } else if (kind === 'sciatica') {
      updates.profile = { ...state.profile, sciaticaSafe: pendingSciatica };
    } else if (kind === 'sounds') {
      updates.preferences = { ...state.preferences, transitionSounds: pendingSounds };
    }
    setState(s => ({ ...s, ...updates }));
    sheet.remove();
  });
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
function monthYear(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en', { month: 'short', year: 'numeric' });
}
function relativeTime(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / 86400000);
  if (days < 1) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString();
}
function escape(s) { return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
