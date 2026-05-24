import { statusBarHtml } from '../../components/shell.js';

export function renderWelcome(state) {
  const html = `
    ${statusBarHtml('9:38')}
    <div class="screen">
      <div class="onb-welcome">
        <div class="brand">
          <div class="wordmark">CORE</div>
          <div class="tagline">Measure what you move.</div>
        </div>
        <div class="ctas">
          <a class="btn-primary" href="#/onboarding/info" style="text-decoration:none;display:block;text-align:center;">Get Started</a>
          <a class="btn-link" href="#/onboarding/areas" style="text-decoration:none;display:block;text-align:center;">I already have an account</a>
        </div>
      </div>
    </div>
  `;
  return { html };
}
