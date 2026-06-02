// engine/map_avoid_cells.js
//
// Counts the AVOID notes per (drinkClass × foodCategory) cell so we know
// which cells in avoid_reasoning_pool.js to prioritize.

'use strict';

const fs = require('fs');
const vm = require('vm');
const path = require('path');
const taxonomy = require('./pairing_engine_taxonomy');

const repoRoot = path.resolve(__dirname, '..');
function loadRepoData() {
  const ctx = { console };
  vm.createContext(ctx);
  const load = (file, name) => {
    const src = fs.readFileSync(path.join(repoRoot, file), 'utf8');
    vm.runInContext(src + '\nthis.' + name + ' = ' + name + ';', ctx);
  };
  load('pairing-map-v2.js', 'PAIRING_MAP');
  load('pairing-notes.js',  'PAIRING_NOTES');
  return ctx;
}
const data = loadRepoData();
const PAIRING_MAP = data.PAIRING_MAP, PAIRING_NOTES = data.PAIRING_NOTES;

const ENTITY = Object.create(null);
for (const e of PAIRING_MAP) ENTITY[e.name] = e;

function tierForKey(key) {
  const [a, b] = key.split('|');
  const ea = ENTITY[a], eb = ENTITY[b];
  if (!ea || !eb) return null;
  for (const tier of ['gold', 'excellent', 'strong', 'works', 'avoid']) {
    if ((ea[tier] || []).includes(b)) return tier;
    if ((eb[tier] || []).includes(a)) return tier;
  }
  return null;
}

const FOOD_CATS = taxonomy.FOOD_CATS;
const DRINK_CATS = taxonomy.DRINK_CATS;

const cells = Object.create(null);
for (const key of Object.keys(PAIRING_NOTES)) {
  const [a, b] = key.split('|');
  const ea = ENTITY[a], eb = ENTITY[b];
  if (!ea || !eb) continue;
  if (tierForKey(key) !== 'avoid') continue;
  const ad = DRINK_CATS.has(ea.category), bd = DRINK_CATS.has(eb.category);
  const af = FOOD_CATS.has(ea.category), bf = FOOD_CATS.has(eb.category);
  if (!((ad && bf) || (af && bd))) continue;
  const drink = ad ? ea : eb;
  const food  = af ? ea : eb;
  const dc = taxonomy.drinkClassFor(drink) || 'UNCLASSIFIED';
  const k = `${dc}|${food.category}`;
  cells[k] = (cells[k] || 0) + 1;
}

const rows = Object.entries(cells).map(([k, n]) => {
  const [dc, fc] = k.split('|');
  return { dc, fc, n };
});
rows.sort((a, b) => b.n - a.n);

console.log('--- AVOID cells by volume (drinkClass × foodCategory) ---');
let cum = 0;
const total = rows.reduce((s, r) => s + r.n, 0);
console.log(`Total AVOID notes: ${total}\n`);
for (const r of rows) {
  cum += r.n;
  const cumPct = (cum / total * 100).toFixed(1);
  console.log(`  ${r.dc.padEnd(22)}  ${r.fc.padEnd(12)}  n=${String(r.n).padStart(5)}  cum=${cumPct.padStart(5)}%`);
}

console.log('');
console.log('--- Cells by class (rollup) ---');
const byClass = Object.create(null);
for (const r of rows) {
  if (!byClass[r.dc]) byClass[r.dc] = { count: 0, cells: 0 };
  byClass[r.dc].count += r.n;
  byClass[r.dc].cells += 1;
}
const classRows = Object.entries(byClass).map(([dc, m]) => ({ dc, ...m }));
classRows.sort((a, b) => b.count - a.count);
for (const r of classRows) {
  console.log(`  ${r.dc.padEnd(22)}  n=${String(r.count).padStart(5)}  cells=${r.cells}`);
}
