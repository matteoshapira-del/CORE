import { statusBarHtml } from '../../components/shell.js';
import { Icon, AreaIcon } from '../../components/icons.js';
import { AREAS } from '../../data/areas.js';
import { KPIS } from '../../data/kpis.js';
import { setState } from '../../store.js';

export function renderAreas(state, params) {
  const fromProfile = params && params.get('return') === 'profile';
  const html = `
    ${statusBarHtml('9:41')}
    <div class="screen">
      <div class="screen-body">
        <div class="onb-screen" style="display:flex;flex-direction:column;flex:1;min-height:0;">
          ${!fromProfile ? `<div class="onb-progress">
            <div class="seg done"></div>
            <div class="seg done"></div>
            <div class="seg active"></div>
            <div class="seg"></div>
            <div class="seg"></div>
            <div class="seg"></div>
          </div>
          <div class="step-lbl">Step 3 of 6</div>` : ''}
          <h2>What do you want<br>to work on?</h2>
          <div class="lead">Pick one or a few. You can change this anytime.</div>

          <div class="areas-grid" id="areas-grid">
            ${AREAS.map(a => renderAreaCard(a, state.selectedAreas.includes(a.id))).join('')}
          </div>

          <div class="onb-footer">
            <div class="count"><strong id="count-n">${state.selectedAreas.length}</strong> areas selected · recommended 3–5</div>
            <button class="btn-primary" id="continue-btn" ${state.selectedAreas.length === 0 ? 'disabled' : ''}>${fromProfile ? 'Save' : 'Continue'}</button>
          </div>
        </div>
      </div>
    </div>
  `;
  return {
    html,
    onMount(root) {
      const sel = new Set(state.selectedAreas);
      const grid = root.querySelector('#areas-grid');
      const countEl = root.querySelector('#count-n');
      const btn = root.querySelector('#continue-btn');

      grid.addEventListener('click', e => {
        const card = e.target.closest('[data-area]');
        if (!card) return;
        const id = card.dataset.area;
        if (sel.has(id)) sel.delete(id); else sel.add(id);
        card.classList.toggle('selected', sel.has(id));
        card.querySelector('.check')?.remove();
        if (sel.has(id)) {
          const c = document.createElement('div');
          c.className = 'check';
          c.innerHTML = Icon.check();
          card.appendChild(c);
        }
        countEl.textContent = sel.size;
        btn.toggleAttribute('disabled', sel.size === 0);
      });

      btn.addEventListener('click', () => {
        if (sel.size === 0) return;
        // Compute active KPIs from selected areas
        const selectedAreas = [...sel];
        const activeKpis = [];
        const seen = new Set();
        for (const k of KPIS) {
          if (k.areas.some(a => selectedAreas.includes(a))) {
            if (!seen.has(k.id)) { seen.add(k.id); activeKpis.push(k.id); }
          }
        }
        setState(s => ({ ...s, selectedAreas, activeKpis }));
        if (fromProfile) {
          location.hash = '#/profile';
        } else {
          location.hash = '#/onboarding/measure-intro';
        }
      });
    },
  };
}

function renderAreaCard(a, selected) {
  const iconFn = AreaIcon[a.id] || (() => '');
  return `<button class="area-card bare ${selected ? 'selected' : ''}" data-area="${a.id}">
    ${selected ? `<div class="check">${Icon.check()}</div>` : ''}
    <div class="ico">${iconFn()}</div>
    <div class="nm">${a.name}</div>
    <div class="kl">${a.blurb}</div>
  </button>`;
}
