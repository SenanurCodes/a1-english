import { esc } from '../../utils/format.js';

export function createQuestionView(question = { prompt: '', options: [] }) {
  const wrap = document.createElement('div');
  wrap.className = 'modular-question';
  wrap.innerHTML = `
    <h3 class="q-prompt">${esc(question.prompt)}</h3>
    <div class="options">
      ${(question.options || []).map(opt => `<button type="button" class="option" data-ans="${esc(opt)}">${esc(opt)}</button>`).join('')}
    </div>
  `;
  return wrap;
}
