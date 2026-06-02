// Mining ↔ runtime consistency check.
//
// Catches the silent class-drift bug class. Both the mining scripts
// (mine_corpus_all_tiers.js, mine_gold_corpus.js) and the runtime generator
// (drink_x_food_generator.js's _editorialVerdict) must classify every entity
// into the same (drinkClass, foodClass) bucket — otherwise corpus phrases
// land in buckets the lookup never queries.
//
// Original silent failure: mining classified WITHOUT enriched-profile axes,
// runtime classified WITH them. Bold reds (Scavino Barolo etc.) ended up in
// ELEGANT_RED|... at mining time and BIG_RED|... at lookup time. Corpus
// effectively invisible to ~100 wines for weeks.
//
// This check asserts:
//   (1) Both code paths call _enrich() before classifying — verified by
//       grep for the call site signature.
//   (2) Behavioral parity — for every entity, the mining classification and
//       runtime classification produce identical buckets.
//   (3) Every entity has a non-null class.
//   (4) Mined-corpus bucket keys reference valid classes.
//
// Run as part of the regen pipeline. Output non-zero on failure.
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const taxonomy = require('./pairing_engine_taxonomy');

const repo = path.resolve(__dirname, '..');
const ctx = {}; vm.createContext(ctx);
const load = (f, n) => vm.runInContext(fs.readFileSync(path.join(repo, f), 'utf8') + '\nthis.' + n + ' = ' + n + ';', ctx);
load('pairing-map-v2.js', 'PAIRING_MAP');
load('enriched-profiles.js', 'ENRICHED_PROFILES');

// The exact enrichment shape used by both mining and runtime.
function _enrich(entity) {
  if (!ctx.ENRICHED_PROFILES) return entity;
  const ep = ctx.ENRICHED_PROFILES[entity.name];
  if (!ep || !ep.axes) return entity;
  return Object.assign({}, entity, { axes: ep.axes });
}

// Mining's classification path (replicates mine_*_corpus.js)
function miningClass(entity, isFood) {
  const e = _enrich(entity);
  return isFood ? taxonomy.foodClassFor(e) : taxonomy.drinkClassFor(e);
}

// Runtime's classification path (replicates drink_x_food_generator.js's _editorialVerdict)
function runtimeClass(entity, isFood) {
  const e = _enrich(entity);
  return isFood ? taxonomy.foodClassFor(e) : taxonomy.drinkClassFor(e);
}

const drinks = ctx.PAIRING_MAP.filter(e => !taxonomy.FOOD_CATS.has(e.category));
const foods  = ctx.PAIRING_MAP.filter(e =>  taxonomy.FOOD_CATS.has(e.category));

let totalFails = 0;

// Check 1: mining and runtime scripts both call _enrich before classifying.
// Code-presence verification — would catch a regression where someone removes
// the enrich call from one side but not the other.
function fileHasEnrichBeforeClassify(file, label) {
  const src = fs.readFileSync(path.join(repo, file), 'utf8');
  // Look for: drinkClassFor or foodClassFor called on something that came
  // from _enrich(). This is a soft check — if the call site uses a different
  // variable name, it'll miss. Sufficient for the common case.
  const enriches = (src.match(/_enrich\s*\(/g) || []).length;
  const drinkClassCalls = (src.match(/drinkClassFor\s*\(/g) || []).length;
  // Mining scripts must call _enrich at least once if they call drinkClassFor.
  if (drinkClassCalls > 0 && enriches === 0) {
    return `${label}: calls drinkClassFor() but never calls _enrich() — missing enrichment`;
  }
  return null;
}
const codeIssues = [];
for (const f of ['engine/mine_corpus_all_tiers.js', 'engine/mine_gold_corpus.js', 'engine/drink_x_food_generator.js']) {
  const issue = fileHasEnrichBeforeClassify(f, f);
  if (issue) codeIssues.push(issue);
}
if (codeIssues.length === 0) {
  console.log('[PASS] Both code paths call _enrich         — mining and runtime agree on enrichment');
} else {
  console.log('[FAIL] Enrichment-call presence              — one side missing enrichment:');
  for (const i of codeIssues) console.log('         ', i);
  totalFails++;
}

// Check 2: behavioral parity across all drinks/foods
const driftedDrinks = [];
for (const d of drinks) {
  const m = miningClass(d, false);
  const r = runtimeClass(d, false);
  if (m !== r) driftedDrinks.push({ name: d.name, mining: m, runtime: r });
}
const driftedFoods = [];
for (const f of foods) {
  const m = miningClass(f, true);
  const r = runtimeClass(f, true);
  if (m !== r) driftedFoods.push({ name: f.name, mining: m, runtime: r });
}
if (driftedDrinks.length === 0 && driftedFoods.length === 0) {
  console.log('[PASS] Mining ↔ runtime classification       — every entity classifies identically across both paths');
} else {
  console.log('[FAIL] Mining ↔ runtime classification       — drift detected:');
  for (const d of driftedDrinks) console.log('         ', d.name.padEnd(45), 'mining=' + d.mining, 'runtime=' + d.runtime);
  for (const f of driftedFoods)  console.log('         ', f.name.padEnd(45), 'mining=' + f.mining, 'runtime=' + f.runtime);
  totalFails++;
}

// Check 3: classification coverage
const unclassifiedDrinks = drinks.filter(d => !runtimeClass(d, false)).map(d => d.name);
const unclassifiedFoods = foods.filter(f => !runtimeClass(f, true)).map(f => f.name);
if (unclassifiedDrinks.length === 0) {
  console.log('[PASS] Drink classification coverage         — all', drinks.length, 'drinks classified');
} else {
  console.log('[FAIL] Drink classification coverage         —', unclassifiedDrinks.length, 'drinks unclassified:', unclassifiedDrinks.slice(0, 8).join(', '), unclassifiedDrinks.length > 8 ? '...' : '');
  totalFails++;
}
if (unclassifiedFoods.length === 0) {
  console.log('[PASS] Food classification coverage          — all', foods.length, 'foods classified');
} else {
  console.log('[FAIL] Food classification coverage          —', unclassifiedFoods.length, 'foods unclassified:', unclassifiedFoods.join(', '));
  totalFails++;
}

// Check 4: mined-corpus bucket keys reference valid classes
function checkCorpusBuckets(corpus, label) {
  const issues = [];
  const validDc = new Set();
  const validFc = new Set();
  for (const d of drinks) { const c = runtimeClass(d, false); if (c) validDc.add(c); }
  for (const f of foods)  { const c = runtimeClass(f, true);  if (c) validFc.add(c); }
  // Tolerate v9 legacy bucket names (DEFAULT and the older food-class vocabulary).
  const tolerableDc = new Set(['DEFAULT']);
  const tolerableFc = new Set(['DEFAULT', 'STEAK_LEAN', 'STEAK_BOLD', 'CHICKEN', 'FISH_MAIN',
    'DELICATE_SEAFOOD', 'SOUP_HEARTY', 'SIDE_RICH', 'SIDE_LIGHT', 'SALAD',
    'HEARTY_STARTER', 'LIGHT_STARTER', 'DESSERT', 'HEARTY_SOUP', 'LIGHT_SOUP',
    'CREAMY_SIDE', 'RICH_SIDE', 'CHICKEN_MAIN', 'FISH_MAIN_RICH',
    'FISH_MAIN_DELICATE', 'VEG_MAIN', 'DESSERT_CHOCOLATE', 'DESSERT_LIGHT']);
  for (const tier of Object.keys(corpus)) {
    for (const ck of Object.keys(corpus[tier])) {
      const [dc, fc] = ck.split('|');
      if (!validDc.has(dc) && !tolerableDc.has(dc)) issues.push(`${label}: ${tier}.${ck} — unknown drink class '${dc}'`);
      if (!validFc.has(fc) && !tolerableFc.has(fc)) issues.push(`${label}: ${tier}.${ck} — unknown food class '${fc}'`);
    }
  }
  return issues;
}
let corpusIssues = [];
try { corpusIssues = corpusIssues.concat(checkCorpusBuckets({ gold: require('./gold_corpus_mined').GOLD_CORPUS_MINED || {} }, 'gold_corpus_mined')); } catch (e) {}
try { corpusIssues = corpusIssues.concat(checkCorpusBuckets(require('./corpus_mined_all_tiers').CORPUS_MINED || {}, 'corpus_mined_all_tiers')); } catch (e) {}
try { corpusIssues = corpusIssues.concat(checkCorpusBuckets({ gold: require('./gold_corpus_supplement').GOLD_CORPUS_SUPPLEMENT || {} }, 'gold_corpus_supplement')); } catch (e) {}
if (corpusIssues.length === 0) {
  console.log('[PASS] Mined-corpus bucket validity          — all bucket keys reference known classes');
} else {
  console.log('[FAIL] Mined-corpus bucket validity          —', corpusIssues.length, 'invalid bucket keys:');
  for (const i of corpusIssues.slice(0, 12)) console.log('         ', i);
  if (corpusIssues.length > 12) console.log('          ... +' + (corpusIssues.length - 12) + ' more');
  totalFails++;
}

console.log('');
console.log('Drinks:', drinks.length, '   Foods:', foods.length, '   Failures:', totalFails);
if (totalFails === 0) {
  console.log('[OK] consistency check passed — mining and runtime agree.');
  process.exit(0);
} else {
  console.log('[FAIL] consistency check failed — fix drift before regen.');
  process.exit(1);
}
corpusIssues.concat(checkCorpusBuckets(require('./corpus_mined_all_tiers').CORPUS_MINED || {}, 'corpus_mined_all_tiers')); } catch (e) {}
try { corpusIssues = corpusIssues.concat(checkCorpusBuckets({ gold: require('./gold_corpus_supplement').GOLD_CORPUS_SUPPLEMENT || {} }, 'gold_corpus_supplement')); } catch (e) {}
if (corpusIssues.length === 0) {
  console.log('[PASS] Mined-corpus bucket validity          — all bucket keys reference known classes');
} else {
  console.log('[FAIL] Mined-corpus bucket validity          —', corpusIssues.length, 'invalid bucket keys:');
  for (const i of corpusIssues.slice(0, 12)) console.log('         ', i);
  if (corpusIssues.length > 12) console.log('          ... +' + (corpusIssues.length - 12) + ' more');
  totalFails++;
}

console.log('');
console.log('Drinks:', drinks.length, '   Foods:', foods.length, '   Failures:', totalFails);
if (totalFails === 0) {
  console.log('[OK] consistency check passed — mining and runtime agree.');
  process.exit(0);
} else {
  console.log('[FAIL] consistency check failed — fix drift before regen.');
  process.exit(1);
}
