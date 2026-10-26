export function createDashboard(stats = { completedUnits: 0, totalUnits: 97 }) {
  const div = document.createElement('div');
  div.className = 'modular-home-dashboard';
  div.innerHTML = `
    <div class="card">
      <b>İlerleme Özeti:</b> ${stats.completedUnits} / ${stats.totalUnits} Ünite Tamamlandı
    </div>
  `;
  return div;
}
