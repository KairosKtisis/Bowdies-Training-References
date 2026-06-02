// engine/preview_avoid_reasoning.js (v2 — archetype-aware)
'use strict';

const fs = require('fs');
const vm = require('vm');
const path = require('path');
const taxonomy = require('./pairing_engine_taxonomy');
const { pickAvoidReasoning } = require('./avoid_reasoning_pool');
const { foodArchetypeFor } = require('./food_archetypes');

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

function simulateRewrite(note, drinkClass, foodEntity, pairKey) {
  const reasoning = pickAvoidReasoning(drinkClass, foodEntity, pairKey);
  if (!reasoning) return null;
  const rx = /^(.*?)overpowers (the .+?)\s*--\s*the plate deserves (.+)$/;
  const m = note.match(rx);
  if (!m) return null;
  const [, preface, foodFrame, rest] = m;
  return `${preface}${reasoning.verb} ${foodFrame.trim()} -- ${reasoning.why}. The plate deserves ${rest}`;
}

const SEEDED_CELLS = [
  ['BOURBON_BOLD', 'main'], ['BOURBON_BOLD', 'starter'], ['BOURBON_BOLD', 'side'],
  ['ELEGANT_RED', 'dessert'], ['ELEGANT_RED', 'main'],
  ['ELEGANT_RED', 'starter'], ['ELEGANT_RED', 'side'],
];

const TARGETED_KEYS = [
  "Angel's Envy Cask Strength|Asparagus",
  "Asparagus|Austin Hope Cabernet Sauvignon",
  "1881 Napa Valley|Seafood Tower",
  "Seafood Tower|Château de Rouillac",
  "1792 Small Batch|Chilean Seabass",
  "Venge Silencieux|Peanut Butter Brownie",
  "Domaine Tempier Bandol|Creme Brulee",
  "Woodinville Rye|Seafood Tower",
];

console.log("======= TARGETED VERIFICATION =======");
for (const key of TARGETED_KEYS) {
  if (!PAIRING_NOTES[key]) { console.log(`\n  [${key}]  NOT FOUND`); continue; }
  const [a, b] = key.split('|');
  const ea = ENTITY[a], eb = ENTITY[b];
  if (!ea || !eb) continue;
  const drink = DRINK_CATS.has(ea.category) ? ea : eb;
  const food  = FOOD_CATS.has(ea.category) ? ea : eb;
  const dc = taxonomy.drinkClassFor(drink);
  const arch = foodArchetypeFor(food) || `(DEFAULT for ${food.category})`;
  const before = PAIRING_NOTES[key];
  const after = simulateRewrite(before, dc, food, key);
  console.log(`\n  [${key}]`);
  console.log(`  food: ${food.name} -> archetype: ${arch}`);
  console.log(`  BEFORE: ${before}`);
  console.log(`  AFTER:  ${after || '(pattern not matched)'}`);
}

console.log("\n\n======= BROADER SAMPLE =======");
for (const [dc, fc] of SEEDED_CELLS) {
  const candidates = [];
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
    if (taxonomy.drinkClassFor(drink) !== dc) continue;
    if (food.category !== fc) continue;
    if (!PAIRING_NOTES[key].includes('overpowers')) continue;
    candidates.push(key);
  }
  console.log(`\n--- ${dc} x ${fc} (${candidates.length} notes) ---`);
  const picks = candidates.length <= 4 ? candidates :
    [0, Math.floor(candidates.length/3), Math.floor(candidates.length*2/3), candidates.length-1].map(i => candidates[i]);
  for (const key of picks) {
    const [a, b] = key.split('|');
    const ea = ENTITY[a], eb = ENTITY[b];
    const food = FOOD_CATS.has(ea.category) ? ea : eb;
    const arch = foodArchetypeFor(food) || 'DEFAULT';
    const before = PAIRING_NOTES[key];
    const after = simulateRewrite(before, dc, food, key);
    console.log(`\n  [${key}]  (${food.name} -> ${arch})`);
    console.log(`  BEFORE: ${before}`);
    console.log(`  AFTER:  ${after || '(pattern not matched)'}`);
  }
}
