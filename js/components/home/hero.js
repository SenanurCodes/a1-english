import { esc } from '../../utils/format.js';

export function createHero(user = { name: 'Öğrenci', xp: 0 }) {
  const section = document.createElement('section');
  section.className = 'modular-home-hero';
  section.innerHTML = `
    <h2>Merhaba, ${esc(user.name)}! 👋</h2>
    <p>Bugün İngilizce pratiğine kaldığın yerden devam et (${Number(user.xp) || 0} XP).</p>
    <button type="button" class="btn btn-primary" id="startLesson">🚀 Derse Başla</button>
  `;
  return section;
}
