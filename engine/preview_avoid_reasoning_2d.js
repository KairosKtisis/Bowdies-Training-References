'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const taxonomy = require('./pairing_engine_taxonomy');
const { pickAvoidReasoning } = require('./avoid_reasoning_pool');
const { foodArchetypeFor } = require('./food_archetypes');

const repoRoot = path.resolve(__dirname, '..');
const ctx = { console };
vm.createContext(ctx);
['pairing-map-v2.js', 'pairing-notes.js'].forEach(f => {
  const n = f === 'pairing-map-v2.js' ? 'PAIRING_MAP' : 'PAIRING_NOTES';
  vm.runInContext(fs.readFileSync(path.join(repoRoot, f), 'utf8') + '\nthis.' + n + ' = ' + n + ';', ctx);
});
const PAIRING_MAP = ctx.PAIRING_MAP, PAIRING_NOTES = ctx.PAIRING_NOTES;
const ENTITY = Object.create(null);
for (const e of PAIRING_MAP) ENTITY[e.name] = e;

function tierForKey(key) {
  const [a, b] = key.split('|');
  const ea = ENTITY[a], eb = ENTITY[b];
  if (!ea || !eb) return null;
  for (const t of ['gold','excellent','strong','works','avoid']) {
    if ((ea[t]||[]).includes(b)) return t;
    if ((eb[t]||[]).includes(a)) return t;
  }
  return null;
}
const FC = taxonomy.FOOD_CATS, DC = taxonomy.DRINK_CATS;

function rewrite(note, dc, food, key) {
  const r = pickAvoidReasoning(dc, food, key);
  if (!r) return null;
  const m = note.match(/^(.*?)overpowers (the .+?)\s*--\s*the plate deserves (.+)$/);
  if (!m) return null;
  return `${m[1]}${r.verb} ${m[2].trim()} -- ${r.why}. The plate deserves ${m[3]}`;
}

const CELLS = [
  ['COCKTAIL_BOLD', 'main'], ['COCKTAIL_BOLD', 'starter'],
  ['TEQUILA_BOLD', 'starter'], ['TEQUILA_BOLD', 'main'],
  ['LIGHT_SPIRIT', 'dessert'], ['LIGHT_SPIRIT', 'steak'],
  ['COCKTAIL_LIGHT', 'dessert'], ['COCKTAIL_LIGHT', 'steak'],
  ['WHITE_WINE', 'dessert'], ['WHITE_WINE', 'steak'],
  ['SPARKLING', 'dessert'], ['SPARKLING', 'steak'],
  ['VODKA', 'dessert'], ['VODKA', 'steak'],
  ['COGNAC', 'main'], ['COGNAC', 'starter'],
  ['MEZCAL', 'soup-salad'], ['MEZCAL', 'main'],
  ['HEAVY_SPIRIT', 'main'],
  ['COGNAC_LUXURY', 'soup-salad'], ['COGNAC_LUXURY', 'main'],
];

for (const [dc, fc] of CELLS) {
  const cands = [];
  for (const key of Object.keys(PAIRING_NOTES)) {
    const [a, b] = key.split('|');
    const ea = ENTITY[a], eb = ENTITY[b];
    if (!ea || !eb) continue;
    if (tierForKey(key) !== 'avoid') continue;
    const ad = DC.has(ea.category), bd = DC.has(eb.category);
    const af = FC.has(ea.category), bf = FC.has(eb.category);
    if (!((ad && bf) || (af && bd))) continue;
    const drink = ad ? ea : eb;
    const food = af ? ea : eb;
    if (taxonomy.drinkClassFor(drink) !== dc) continue;
    if (food.category !== fc) continue;
    if (!PAIRING_NOTES[key].includes('overpowers')) continue;
    cands.push(key);
  }
  console.log(`\n=== ${dc} x ${fc} (${cands.length} notes) ===`);
  const picks = cands.length <= 3 ? cands :
    [0, Math.floor(cands.length/2), cands.length-1].map(i => cands[i]);
  for (const key of picks) {
    const [a, b] = key.split('|');
    const ea = ENTITY[a], eb = ENTITY[b];
    const food = FC.has(ea.category) ? ea : eb;
    const arch = foodArchetypeFor(food) || 'DEFAULT';
    const after = rewrite(PAIRING_NOTES[key], dc, food, key);
    console.log(`\n  [${key}]  (${food.name} -> ${arch})`);
    console.log(`  AFTER: ${after || '(no match)'}`);
  }
}
