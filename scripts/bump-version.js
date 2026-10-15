#!/usr/bin/env node
/* ============================================================
   Sürüm yükseltici (kütüphanesiz)
   Kullanım:  node scripts/bump-version.js 2.7.1
   - sw.js içindeki APP_VERSION ve önbellek listesindeki ?v= değerlerini
   - index.html içindeki css/js ?v= değerlerini
   aynı sürüme çeker. Her yayından önce çalıştır.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ver = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(ver || '')) {
  console.error('Kullanım: node scripts/bump-version.js X.Y.Z');
  process.exit(1);
}

const root = path.join(__dirname, '..');

function update(file, fn) {
  const p = path.join(root, file);
  const before = fs.readFileSync(p, 'utf8');
  const after = fn(before);
  fs.writeFileSync(p, after);
  console.log(`${file}: ${before === after ? 'değişiklik yok' : 'güncellendi'}`);
}

// css/... ve js/... dosyalarının ?v= parametresi (yoksa eklenir)
const assetRe = /((?:css|js)\/[\w.-]+\.(?:css|js))(\?v=[\d.]+)?(?=["'])/g;

update('sw.js', s => s
  .replace(/const APP_VERSION = '[\d.]+';/, `const APP_VERSION = '${ver}';`)
  .replace(assetRe, `$1?v=${ver}`));

update('index.html', s => s.replace(assetRe, `$1?v=${ver}`));

console.log(`Sürüm ${ver} olarak ayarlandı.`);
