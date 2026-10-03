import { statusBarHtml } from '../../components/shell.js';
import { Icon } from '../../components/icons.js';
import { testIllustrationFor } from '../../components/exercise-illustrations.js';
import { getKpi, scoreFor } from '../../data/kpis.js';
import { activeKpiIds, staleKpis } from '../../engine/score.js';
import { recordMeasurement, setState } from '../../store.js';

export function renderMeasureTest(state, params) {
  const isRemeasure = params && params.get('mode') === 'remeasure';
  const targets = isRemeasure ? staleKpis(state) : activeKpiIds(state);
  let kpiId = params && params.get('kpi');
  const i = Number(params?.get('i') || 0);
  if (!kpiId && targets[i]) kpiId = targets[i];
  const k = getKpi(kpiId);
  if (!k) return `<div class="screen"><div class="empty"><h2>Test not found</h2><a class="btn-link" href="#/home">Back</a></div></div>`;

  const total = targets.length;
  const useSegments = total > 0;

  // Sub-step for sided tests
  const side = params.get('side') || (k.sided ? 'left' : null);

  let inputUI;
  if (k.kind === 'qualitative') {
    inputUI = renderQualitative(k);
  } else if (k.kind === 'time') {
    inputUI = renderTimer(k);
  } else {
    inputUI = renderNumeric(k);
  }

  const html = `
    ${statusBarHtml('9:48')}
    <div class="screen">
      <div class="screen-body">
        <div class="measure-test">
          ${useSegments ? `<div class="onb-progress">${Array.from({length: total}).map((_, idx) => `<div class="seg ${idx < i ? 'done' : idx === i ? 'active' : ''}"></div>`).join('')}</div>` : ''}
          <div class="step-lbl">${useSegments ? `Test ${i+1} of ${total}` : 'Re-measure'}${k.sided ? ` · ${side === 'left' ? 'Left side' : 'Right side'}` : ''}</div>
          <div style="font-family:var(--serif);font-size:26px;font-weight:400;letter-spacing:-0.01em;margin-bottom:6px;">${k.name}</div>
          <div class="muted" style="font-size:13px;margin-bottom:14px;">${k.plain}</div>

          <div class="video">
            <div style="opacity:0.9;">${testIllustrationFor(k.id, 150)}</div>
            <button class="play bare" title="Demo">${Icon.play()}</button>
          </div>

          ${state.profile && state.profile.sciaticaSafe && ['f1_forward_fold', 'f2_slr', 'f11_aslr'].includes(k.id) ? `<div class="sc-warn" style="margin-bottom:10px;">Sciatica-safe: move slowly and stop at the <b>first nerve sensation</b>. Take the reading there; this is a test, not a hold.</div>` : ''}
          <div class="checklist" id="check-list">
            ${k.setup.map((s, idx) => `<button class="check-item bare" data-idx="${idx}"><div class="bx">${Icon.check()}</div><div class="tx">${s}</div></button>`).join('')}
          </div>

          ${inputUI}

          <div class="actions">
            <button class="btn-primary" id="record-btn" disabled>Record Score</button>
          </div>
        </div>
      </div>
    </div>
  `;
  return {
    html,
    onMount(root) {
      // Checklist toggle (visual only)
      root.querySelectorAll('.check-item').forEach(item => {
        item.addEventListener('click', () => item.classList.toggle('checked'));
      });

      let rawValue = null;
      let qualValue = null;
      let timerS = 0, timerStart = null, timerHandle = null;

      const recordBtn = root.querySelector('#record-btn');
      function enable() { recordBtn.toggleAttribute('disabled', false); }

      if (k.kind === 'qualitative') {
        root.querySelectorAll('[data-q]').forEach(b => b.addEventListener('click', () => {
          qualValue = Number(b.dataset.q);
          root.querySelectorAll('[data-q]').forEach(x => x.classList.toggle('active', x === b));
          enable();
        }));
      } else if (k.kind === 'time') {
        const tEl = root.querySelector('#timer-display');
        root.querySelector('#timer-start').addEventListener('click', () => {
          if (timerHandle) {
            clearInterval(timerHandle); timerHandle = null;
            root.querySelector('#timer-start').textContent = 'Resume';
            rawValue = timerS; enable();
          } else {
            timerStart = Date.now() - timerS * 1000;
            timerHandle = setInterval(() => {
              timerS = Math.floor((Date.now() - timerStart) / 1000);
              tEl.textContent = fmtTime(timerS);
            }, 250);
            root.querySelector('#timer-start').textContent = 'Stop';
          }
        });
        root.querySelector('#timer-reset').addEventListener('click', () => {
          clearInterval(timerHandle); timerHandle = null;
          timerS = 0; tEl.textContent = fmtTime(0);
          root.querySelector('#timer-start').textContent = 'Start';
        });
      } else {
        // numeric input
        const inp = root.querySelector('#num-input');
        inp.addEventListener('input', () => {
          const v = parseFloat(inp.value);
          if (!isNaN(v)) { rawValue = v; enable(); } else { recordBtn.toggleAttribute('disabled', true); }
        });
        // Unit toggle (display only — store stays metric)
        root.querySelectorAll('[data-unit]').forEach(b => b.addEventListener('click', () => {
          root.querySelectorAll('[data-unit]').forEach(x => x.classList.toggle('active', x === b));
        }));
      }

      recordBtn.addEventListener('click', () => {
        const value = k.kind === 'qualitative' ? qualValue : rawValue;
        if (value == null) return;
        const score = scoreFor(k.id, value);
        recordMeasurement({
          kpiId: k.id, method: 'manual',
          rawValue: value, rawUnit: k.unit,
          score, side,
        });
        proceed();
      });

      function proceed() {
        // If sided and just did left, do right next on same KPI
        if (k.sided && side === 'left') {
          location.hash = `#/onboarding/measure-test?kpi=${k.id}&i=${i}&side=right${isRemeasure ? '&mode=remeasure' : ''}`;
          return;
        }
        const nextI = i + 1;
        const next = targets[nextI];
        if (next) {
          location.hash = `#/onboarding/measure-test?kpi=${next}&i=${nextI}${isRemeasure ? '&mode=remeasure' : ''}`;
        } else {
          // Done — go to baseline reveal (first time) or back to progress (re-measure)
          if (isRemeasure) {
            location.hash = '#/progress';
          } else {
            setState(s => ({ ...s, onboarded: true }));
            location.hash = '#/onboarding/baseline-reveal';
          }
        }
      }
    },
  };
}

function renderNumeric(k) {
  // Default value placeholders by KPI kind
  const ph = k.kind === 'angle' ? '60' : '0';
  const altUnit = k.unit === 'cm' ? 'in' : 'cm';
  return `
    <div class="measure-input">
      <div class="lbl">${k.unit === 'cm' ? 'Distance' : 'Angle'} ${k.inverted ? '(smaller = better)' : ''}</div>
      <div class="input-row">
        <input type="number" id="num-input" inputmode="decimal" placeholder="${ph}" step="0.1">
        ${k.unit === 'cm' ? `<div class="unit-toggle seg-control">
          <button data-unit="cm" class="active">cm</button>
          <button data-unit="${altUnit}">${altUnit}</button>
        </div>` : `<div class="muted" style="font-size:13px;">${k.unit}</div>`}
      </div>
      <div class="hint">Tip: ${k.protocol}</div>
    </div>
  `;
}

function renderTimer(k) {
  return `
    <div class="measure-input">
      <div class="lbl">Hold to failure</div>
      <div style="text-align:center;margin:14px 0;">
        <div id="timer-display" style="font-family:var(--serif);font-size:54px;font-weight:300;color:var(--text);letter-spacing:-0.02em;line-height:1;">0:00</div>
      </div>
      <div style="display:flex;gap:10px;">
        <button class="btn-primary" id="timer-start" style="flex:1;">Start</button>
        <button class="btn-secondary" id="timer-reset" style="flex:0 0 80px;">Reset</button>
      </div>
      <div class="hint">Tip: ${k.protocol}</div>
    </div>
  `;
}

function renderQualitative(k) {
  return `
    <div class="measure-input">
      <div class="lbl">Pick the best match</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:6px;">
        ${k.qualitativeOptions.map(o => `<button class="bare" data-q="${o.v}" style="text-align:left;background:var(--surface-2);padding:10px 12px;border-radius:10px;border:1.5px solid transparent;color:var(--text);display:flex;align-items:center;gap:10px;font-size:12px;line-height:1.4;">
          <div style="font-family:var(--serif);font-size:18px;font-weight:500;width:24px;text-align:center;">${o.v}</div>
          <div style="flex:1;">${o.label}</div>
        </button>`).join('')}
      </div>
      <style>[data-q].active { border-color: var(--accent) !important; background: var(--accent-soft) !important; }</style>
    </div>
  `;
}

function fmtTime(s) {
  s = Math.max(0, s);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}
