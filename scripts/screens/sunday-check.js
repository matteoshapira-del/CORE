import { statusBarHtml } from '../components/shell.js';
import { Icon } from '../components/icons.js';
import { illustrationFor } from '../components/exercise-illustrations.js';
import { imgHtmlForKpiTest } from '../components/exercise-icons.js';
import { getKpi, scoreFor } from '../data/kpis.js';
import { recordMeasurement } from '../store.js';
import { setCheckin, checkinFor } from '../engine/bookends.js';

// Weekly check (spec §4), prompted after Post-Sea 7 on Sundays. Forward Fold
// is a gentle test — stop at the first nerve sensation, never a hold.
export function renderSundayCheck(state) {
  const thomas = getKpi('f3_hip_flexor');
  const drivePrev = (state.checkins || []).filter(c => c.kind === 'drive_stiffness').pop();

  const html = `
    ${statusBarHtml('9:50')}
    <div class="screen">
      <div class="screen-body scroll kpi-detail sunday-check">
        <a class="breadcrumb" href="#/home" style="text-decoration:none;">${Icon.chevL()}<span>Today</span></a>
        <div class="kpi-title">Sunday check</div>
        <div class="kpi-desc">Three numbers, once a week. Gentle: this is a test, not a stretch.</div>

        <div class="sc-card">
          <div class="sc-head">
            <div class="sc-ill">${imgHtmlForKpiTest('f1_forward_fold', 64) || illustrationFor('seated_forward_fold', 64)}</div>
            <div><div class="sc-t">Forward Fold</div><div class="sc-s">cm past the toes (negative if short)</div></div>
          </div>
          <div class="sc-warn">Reach slowly and stop at the <b>first nerve sensation</b>. Read the number, come straight back up.</div>
          <div class="field"><input type="number" inputmode="decimal" step="0.5" id="sc-ff" placeholder="e.g. -4"></div>
        </div>

        <div class="sc-card">
          <div class="sc-head">
            <div class="sc-ill">${imgHtmlForKpiTest('f3_hip_flexor', 64) || ''}</div>
            <div><div class="sc-t">Thomas test (hip flexor)</div><div class="sc-s">Edge of bed, hug one knee, let the other leg hang</div></div>
          </div>
          ${['left', 'right'].map(side => `
            <div class="sc-side">${side === 'left' ? 'Left' : 'Right'} leg hanging</div>
            <div class="seg-control sc-scale" data-thomas="${side}">
              ${thomas.qualitativeOptions.map(o => `<button data-v="${o.v}">${o.v}</button>`).join('')}
            </div>`).join('')}
          <div class="sc-legend">${thomas.qualitativeOptions.map(o => `<div><b>${o.v}</b> ${o.label}</div>`).join('')}</div>
          <div class="sc-s" style="margin-top:6px;">3 or more = pass ✓</div>
        </div>

        <div class="sc-card">
          <div class="sc-head">
            <div><div class="sc-t">Stiffness after driving</div><div class="sc-s">This week, typical. 1 = loose · 5 = locked up${drivePrev ? ` · last: ${drivePrev.value}` : ''}</div></div>
          </div>
          <div class="seg-control sc-scale" data-drive>
            ${[1, 2, 3, 4, 5].map(v => `<button data-v="${v}" class="${checkinFor(state, 'drive_stiffness') === v ? 'active' : ''}">${v}</button>`).join('')}
          </div>
        </div>

        <button class="btn-primary" data-action="save" style="margin:8px 0 6px;">Save check</button>
        <a class="btn-link" href="#/home">Skip this week</a>
        <div class="sc-physio">No change by ~1 Nov, or any symptoms below the knee → book a physio.</div>
      </div>
    </div>
  `;

  return {
    html,
    onMount(root) {
      const picks = { left: null, right: null, drive: checkinFor(state, 'drive_stiffness') };
      root.querySelectorAll('[data-thomas]').forEach(group => {
        group.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
          picks[group.dataset.thomas] = Number(b.dataset.v);
          group.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
        }));
      });
      const drive = root.querySelector('[data-drive]');
      drive.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
        picks.drive = Number(b.dataset.v);
        drive.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
      }));

      root.querySelector('[data-action="save"]').addEventListener('click', () => {
        const ffRaw = root.querySelector('#sc-ff').value.trim();
        const ff = ffRaw === '' ? null : Number(ffRaw);
        if (ff == null && !picks.left && !picks.right && !picks.drive) {
          window.toast?.('Nothing entered yet');
          return;
        }
        if (ff != null && Number.isFinite(ff)) {
          recordMeasurement({ kpiId: 'f1_forward_fold', rawValue: ff, rawUnit: 'cm', score: scoreFor('f1_forward_fold', ff), side: null, notes: 'sunday-check' });
        }
        for (const side of ['left', 'right']) {
          if (picks[side]) recordMeasurement({ kpiId: 'f3_hip_flexor', rawValue: picks[side], rawUnit: 'qualitative', score: scoreFor('f3_hip_flexor', picks[side]), side, notes: 'sunday-check' });
        }
        if (picks.drive) setCheckin('drive_stiffness', picks.drive);
        window.toast?.('Sunday check saved');
        location.hash = '#/home';
      });
    },
  };
}
