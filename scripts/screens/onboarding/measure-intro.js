import { statusBarHtml } from '../../components/shell.js';
import { Icon } from '../../components/icons.js';
import { activeKpiIds, staleKpis } from '../../engine/score.js';
import { setState } from '../../store.js';

export function renderMeasureIntro(state, params) {
  const isRemeasure = params && params.get('mode') === 'remeasure';
  const targets = isRemeasure ? staleKpis(state) : activeKpiIds(state);
  const count = targets.length;
  const html = `
    ${statusBarHtml('9:43')}
    <div class="screen">
      <div class="measure-intro">
        <div>
          <h1>${isRemeasure ? "Let's see what's changed." : "Let's see where you are."}</h1>
          <p>${count} short test${count===1?'':'s'}, about ${Math.max(2, count * 1.5).toFixed(0)} minutes. You'll do them once, then again every ~2 weeks.</p>
          <div class="icon-row">
            <div class="ig">${Icon.tape()}</div>
            <div class="ig">${Icon.watch()}</div>
            <div class="ig">${Icon.silhouette()}</div>
          </div>
        </div>
        <div class="ctas">
          <button class="btn-primary" id="start-tests">${isRemeasure ? 'Start re-measure' : 'Start tests'}</button>
          ${isRemeasure ? '' : '<button class="btn-link" id="skip-tests">Skip for now</button>'}
        </div>
      </div>
    </div>
  `;
  return {
    html,
    onMount(root) {
      root.querySelector('#start-tests').addEventListener('click', () => {
        const first = targets[0];
        if (!first) return finishMeasureFlow(state, isRemeasure);
        location.hash = `#/onboarding/measure-test?kpi=${first}&i=0${isRemeasure ? '&mode=remeasure' : ''}`;
      });
      root.querySelector('#skip-tests')?.addEventListener('click', () => {
        finishMeasureFlow(state, false);
      });
    },
  };
}

function finishMeasureFlow(state, isRemeasure) {
  if (isRemeasure) {
    location.hash = '#/progress';
  } else {
    setState(s => ({ ...s, onboarded: true }));
    location.hash = '#/home';
  }
}
