// engine/sample_bucket_prose.js
//
// Read-only sampler. Given a list of (drinkClass × foodCategory × tier)
// buckets — or FxF (foodCategory × foodCategory × tier) — pull 5 actual
// notes from each and print them. Used to verify the quality-distribution
// diagnostic with the prose itself.

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

// Buckets to sample — both DxF and FxF formats supported
const DXF_BUCKETS = [
  ['SWEET_WINE', 'soup-salad', 'avoid'],
  ['SWEET_LIQUEUR', 'soup-salad', 'avoid'],
  ['BOURBON_BOLD', 'main', 'avoid'],
  ['ELEGANT_RED', 'dessert', 'avoid'],
  ['GIN', 'soup-salad', 'works'],
  ['LIGHT_SPIRIT', 'side', 'works'],
  ['TEQUILA_BOLD', 'dessert', 'avoid'],
  ['LIGHT_SPIRIT', 'dessert', 'avoid'],
  ['COGNAC_LUXURY', 'soup-salad', 'avoid'],
  ['MEZCAL', 'side', 'avoid'],
];
const FXF_BUCKETS = [
  ['side', 'steak', 'gold'],
  ['starter', 'steak', 'strong'],
  ['main', 'soup-salad', 'strong'],
  ['side', 'steak', 'strong'],
];

function bucketKeyDxf(dc, fcat, tier) {
  const out = [];
  for (const key of Object.keys(PAIRING_NOTES)) {
    const [a, b] = key.split('|');
    const ea = ENTITY[a], eb = ENTITY[b];
    if (!ea || !eb) continue;
    const ad = DRINK_CATS.has(ea.category), bd = DRINK_CATS.has(eb.category);
    const af = FOOD_CATS.has(ea.category),  bf = FOOD_CATS.has(eb.category);
    if (!((ad && bf) || (af && bd))) continue;
    const drink = ad ? ea : eb;
    const food  = af ? ea : eb;
    if (taxonomy.drinkClassFor(drink) !== dc) continue;
    if (food.category !== fcat) continue;
    if (tierForKey(key) !== tier) continue;
    out.push(key);
  }
  return out;
}

function bucketKeyFxf(c1, c2, tier) {
  const out = [];
  for (const key of Object.keys(PAIRING_NOTES)) {
    const [a, b] = key.split('|');
    const ea = ENTITY[a], eb = ENTITY[b];
    if (!ea || !eb) continue;
    if (!(FOOD_CATS.has(ea.category) && FOOD_CATS.has(eb.category))) continue;
    const cats = [ea.category, eb.category].sort();
    if (!(cats[0] === c1 && cats[1] === c2)) continue;
    if (tierForKey(key) !== tier) continue;
    out.push(key);
  }
  return out;
}

function rand(n) { return Math.floor(Math.random() * n); }
function sample(arr, n) {
  const out = [], used = new Set();
  while (out.length < n && used.size < arr.length) {
    const i = rand(arr.length);
    if (used.has(i)) continue;
    used.add(i);
    out.push(arr[i]);
  }
  return out;
}

// Seed RNG-ish by date so output is stable within a session
let seed = 20260530;
Math.random = (() => () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; })();

console.log('=== DxF BUCKET SAMPLES ===\n');
for (const [dc, fcat, tier] of DXF_BUCKETS) {
  const keys = bucketKeyDxf(dc, fcat, tier);
  console.log(`--- ${dc} × ${fcat} × ${tier} (n=${keys.length}) ---`);
  const picks = sample(keys, 4);
  for (const k of picks) {
    console.log(`  [${k}]`);
    console.log(`  ${PAIRING_NOTES[k]}`);
    console.log('');
  }
}

console.log('\n=== FxF BUCKET SAMPLES ===\n');
for (const [c1, c2, tier] of FXF_BUCKETS) {
  const keys = bucketKeyFxf(c1, c2, tier);
  console.log(`--- ${c1} × ${c2} × ${tier} (n=${keys.length}) ---`);
  const picks = sample(keys, 4);
  for (const k of picks) {
    console.log(`  [${k}]`);
    console.log(`  ${PAIRING_NOTES[k]}`);
    console.log('');
  }
}
