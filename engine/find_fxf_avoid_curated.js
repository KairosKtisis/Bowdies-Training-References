// engine/find_fxf_avoid_curated.js
//
// Locate the 16 hand-curated FxF AVOID notes mentioned in ENGINE_SPEC.md §2.
// These are the sommelier-grade benchmark we mirror in Phase 2.
//
// Heuristic: FxF (food × food) pairs where tier = avoid, word count >= 60.
// The hand-curated ones average 76-87 words; templated FxF AVOIDs average ~30.
//
// Read-only. Outputs the matched notes + a summary count.

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

const fxfAvoids = [];
for (const key of Object.keys(PAIRING_NOTES)) {
  const [a, b] = key.split('|');
  const ea = ENTITY[a], eb = ENTITY[b];
  if (!ea || !eb) continue;
  if (!(FOOD_CATS.has(ea.category) && FOOD_CATS.has(eb.category))) continue;
  if (tierForKey(key) !== 'avoid') continue;
  const note = PAIRING_NOTES[key];
  const wc = note.split(/\s+/).length;
  fxfAvoids.push({ key, note, wc, catA: ea.category, catB: eb.category });
}

fxfAvoids.sort((a, b) => b.wc - a.wc);

console.log(`Total FxF AVOIDs: ${fxfAvoids.length}`);
console.log(`Average word count: ${(fxfAvoids.reduce((s, x) => s + x.wc, 0) / fxfAvoids.length).toFixed(1)}`);
console.log('');
console.log('--- TOP 30 BY WORD COUNT (the hand-curated benchmark) ---');
for (const { key, wc, catA, catB, note } of fxfAvoids.slice(0, 30)) {
  console.log(`\n[${key}]  (${catA} × ${catB})  wc=${wc}`);
  console.log(`  ${note}`);
}

// Save to disk for use in next script
fs.writeFileSync(
  path.join(__dirname, 'fxf_avoid_curated.json'),
  JSON.stringify(fxfAvoids.filter(x => x.wc >= 60), null, 2)
);
console.log(`\n→ engine/fxf_avoid_curated.json (${fxfAvoids.filter(x => x.wc >= 60).length} entries with wc>=60)`);
