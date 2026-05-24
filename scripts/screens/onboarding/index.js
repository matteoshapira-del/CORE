import { renderWelcome } from './welcome.js';
import { renderInfo } from './info.js';
import { renderAreas } from './areas.js';
import { renderMeasureIntro } from './measure-intro.js';
import { renderMeasureTest } from './measure-test.js';
import { renderBaselineReveal } from './baseline-reveal.js';

export function renderOnboarding(state, path) {
  // Parse "stepname?key=val&..."
  const [stepRaw, queryStr] = (path || '').split('?');
  const step = stepRaw || 'welcome';
  const params = new URLSearchParams(queryStr || '');
  switch (step) {
    case 'welcome': return renderWelcome(state, params);
    case 'info': return renderInfo(state, params);
    case 'areas': return renderAreas(state, params);
    case 'measure-intro': return renderMeasureIntro(state, params);
    case 'measure-test': return renderMeasureTest(state, params);
    case 'baseline-reveal': return renderBaselineReveal(state, params);
    default:
      location.hash = '#/onboarding/welcome';
      return '';
  }
}
