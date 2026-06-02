// engine/diagnose_quality_distribution.js
//
// Quality-stratification diagnostic for GAMEPLAN_v1.
//
// Reads pairing-notes.js + pairing-map-v2.js + the taxonomy, and produces a
// per-bucket quality report. The goal is to surface WHY some pair-notes are
// strong and others weak — by measuring the structural signals that drive
// note quality: corpus density, templated/editorial ratio, average length,
// recycled-phrase frequency, slot-fill mismatch incidence.
//
// Buckets:
//   - DxF (drink × food): drinkClass × foodCategory × tier
//   - FxF (food × food):  archetype × tier
//
// Output: console table + JSON report at engine/quality_distribution_report.json.
//
// Read-only. Touches no source files.

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
  load('pairing-map-v2.js',    'PAIRING_MAP');
  load('pairing-notes.js',     'PAIRING_NOTES');
  return ctx;
}

const data = loadRepoData();
const PAIRING_MAP   = data.PAIRING_MAP;
const PAIRING_NOTES = data.PAIRING_NOTES;

// Build name → entity index
const ENTITY = Object.create(null);
for (const e of PAIRING_MAP) ENTITY[e.name] = e;

const FOOD_CATS = taxonomy.FOOD_CATS;
const DRINK_CATS = taxonomy.DRINK_CATS;

// ── TIER LOOKUP ────────────────────────────────────────────────────────────
// Map "A|B" key → tier by checking each tier list on either side.
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

// ── RECYCLED PHRASE PROBES ─────────────────────────────────────────────────
// Top 20 phrases flagged in AUDIT_v7. Track residual occurrences.
const RECYCLED_PROBES = [
  'bourbon depth settles on the plate',
  'the cream works the bourbon',
  'reads alongside',
  'sits alongside',
  'leans against',
  'plays cleanly against',
  'sits beside',
  'stays alongside',
  'holds with',
  'finds neutral with',
  'pairing reads as a quiet alongside',
  'pairing sits at neutral register without clash',
  'call lands as a measured alongside',
  'call holds neither soars nor fights',
  'vanilla layers into the cream',
  'belongs on the steak course',
  'reliable across the meal',
  'capable alongside without driving',
  'the call holds at full register',
  'a measured alongside',
];

// ── SLOT-FILL MISMATCH HEURISTIC (v2 — CALIBRATED 2026-05-30) ──────────────
//
// What we're trying to catch (the real bug, per AUDIT_500):
//   - "the digestif-on-dessert pairing" appearing on a Caesar (salad) pair
//   - "the light-spirit-on-dessert call" appearing on a Filet (steak) pair
//   - "safe añejo-on-hearty-soup alongside" appearing on a trout (main) pair
//   - "Peak Southern-French for the bird" appearing on a mushrooms (side) pair
//   - "slightly over-specified for the dessert" appearing on a spinach (side) pair
//
// What we're NOT trying to catch (false positives in v1):
//   - "Save the {drink} for the steak course" — intended engine redirect
//   - "Pour the {drink} on the steak course instead" — intended engine redirect
//   - "Reserve the {drink} for the steak course" — intended engine redirect
//   - "Hold the {drink} for the steak course" — intended engine redirect
//   - "{drink} belongs on the steak course" — intended engine redirect
//   - "Save the {drink} for another course" — intended (when food IS steak)
//
// Per ARCHITECTURE.md the trailing save-clause is the engine's *correct*
// behavior: redirect the drink to its proper course. Strip it first, then
// scan the remaining prose.
//
// Calibration approach:
//   1. Strip the trailing save-clause sentence (engine-intended redirect)
//   2. In the remaining prose, look for compound label constructs:
//        - "{X}-on-{Y}" where Y is a food-class word that mismatches the food
//        - "for (the) {Y}" inside a closer where Y mismatches the food
//        - "{X}-on-{Y}-{Z}" multi-hyphen variants (light-spirit-on-fish-main)
//   3. Verify the food's own category label isn't ALSO present (allow
//      cases like "the side-on-main call" on a side×main pair).

const CATEGORY_TOKENS = {
  'steak':      ['steak', 'cut'],
  'main':       ['fish-main', 'main', 'entree', 'entrée', 'bird', 'fish'],
  'starter':    ['starter'],
  'soup-salad': ['soup', 'salad', 'bisque', 'chowder', 'hearty-soup'],
  'side':       ['side'],
  'dessert':    ['dessert'],
};

// Save-clause patterns to strip. Order matters — bottle-name variants first,
// then generic. The pattern set covers the closer variants in the avoid
// template (see ARCHITECTURE.md § Avoid template).
const SAVE_CLAUSE_PATTERNS = [
  /\s*(?:Save|Hold|Reserve|Pour)\s+the\s+[^.]+?\s+(?:for|on)\s+(?:the\s+steak\s+course|another\s+course)(?:\s+instead)?\.\s*$/i,
  /\s*[^.]+?\s+belongs\s+on\s+(?:the\s+steak\s+course|another\s+course)\.\s*$/i,
];

function stripSaveClause(note) {
  let n = note;
  // Loop in case multiple save-clauses are appended (rare, but defensive)
  for (let i = 0; i < 3; i++) {
    const before = n;
    for (const rx of SAVE_CLAUSE_PATTERNS) {
      n = n.replace(rx, '');
    }
    if (n === before) break;
  }
  return n.trim();
}

// Detect the real slot-fill bug: a category-label compound in closer prose
// that doesn't match the actual food's category.
//
// Compound forms we look for:
//   - "{adj}-on-{foodLabel}"
//   - "{adj}-on-{foodLabel}-{...}"  (e.g. "light-spirit-on-fish-main")
//   - "for (the) {foodLabel}" inside a closer construct ("over-specified for the dessert")
//   - "Peak {X} for the {foodLabel}" ("Peak Southern-French for the bird")
function hasSlotFillMismatch(key, note, foodCategory) {
  const body = stripSaveClause(note);
  const lower = body.toLowerCase();

  const ownTokens = CATEGORY_TOKENS[foodCategory] || [];
  const ownPresent = ownTokens.some(t => new RegExp(`\\b${t}\\b`, 'i').test(body));

  for (const [cat, tokens] of Object.entries(CATEGORY_TOKENS)) {
    if (cat === foodCategory) continue;
    for (const t of tokens) {
      const escaped = t.replace(/[-]/g, '\\-');

      // Compound: "X-on-T" or "X-on-T-..."
      const compoundRx = new RegExp(`-on-${escaped}(?:[-\\s]|$)`, 'i');
      if (compoundRx.test(body) && !ownPresent) return true;

      // Closer: "for the T" in proximity to closer verbs (over-specified, handles, composed, etc.)
      const forTheRx = new RegExp(`\\b(?:over-specified|over-specifies|handles|composes|composed|carries|holds|sits|reads)\\s+(?:[a-z]+\\s+)?(?:for|with|against)\\s+(?:the\\s+)?${escaped}\\b`, 'i');
      if (forTheRx.test(body) && !ownPresent) return true;

      // "Peak X for the T" / "Peak X for T"
      const peakRx = new RegExp(`\\bpeak\\s+[a-zA-Z-]+\\s+for\\s+(?:the\\s+)?${escaped}\\b`, 'i');
      if (peakRx.test(body) && !ownPresent) return true;

      // "safe X-on-T alongside" / "X-on-T pairing|call"
      const compoundCloserRx = new RegExp(`-on-${escaped}(?:[-\\w]*)?\\s+(?:pairing|call|alongside|composed|partner|companion|carry)\\b`, 'i');
      if (compoundCloserRx.test(body) && !ownPresent) return true;
    }
  }
  return false;
}

// ── TEMPLATED DETECTION ────────────────────────────────────────────────────
// Use the canonical templated_detection module if available; else fallback.
let isTemplated;
try {
  const td = require('./templated_detection');
  isTemplated = td.isTemplatedNote || td.isTemplated || td.default;
} catch (e) {}
if (!isTemplated) {
  const TEMPLATED_SIGS = [
    /runs straight into [^.]+ — the/i,
    /Gold standard; the [A-Z_]+ lock that sells itself/i,
    /\bAvoid; Reach for\b/i,
    /the plate deserves [^.]+, not (a|an) /i,
    /bourbon depth settles on the plate/i,
    /the cream works the bourbon/i,
    /pairing reads as a quiet alongside/i,
    /pairing sits at neutral register without clash/i,
    /call lands as a measured alongside/i,
    /call holds neither soars nor fights/i,
  ];
  isTemplated = (s) => TEMPLATED_SIGS.some(r => r.test(s));
}

// ── BUCKETING ──────────────────────────────────────────────────────────────
const dxfBuckets = Object.create(null);  // key: `${dc}|${fcat}|${tier}` → metrics
const fxfBuckets = Object.create(null);  // key: `${fcat1}|${fcat2}|${tier}` → metrics

function blankMetrics() {
  return {
    count: 0,
    templatedCount: 0,
    editorialCount: 0,
    totalWords: 0,
    avgWords: 0,
    recycledHits: 0,
    slotFillMismatches: 0,
    avoidHasSubstitutionRec: 0,
    sampleKeys: [],
  };
}

function ingest(bucket, key, note, isAvoid, foodCategory) {
  if (!bucket) return;
  bucket.count++;
  const t = isTemplated(note);
  if (t) bucket.templatedCount++; else bucket.editorialCount++;
  const wc = note.split(/\s+/).length;
  bucket.totalWords += wc;
  for (const probe of RECYCLED_PROBES) {
    if (note.toLowerCase().includes(probe.toLowerCase())) bucket.recycledHits++;
  }
  if (foodCategory && hasSlotFillMismatch(key, note, foodCategory)) {
    bucket.slotFillMismatches++;
  }
  if (isAvoid && /\b(pair|reach for|the alts|alternatives?)\b/i.test(note)) {
    bucket.avoidHasSubstitutionRec++;
  }
  if (bucket.sampleKeys.length < 3) bucket.sampleKeys.push(key);
}

// ── PASS ───────────────────────────────────────────────────────────────────
const allKeys = Object.keys(PAIRING_NOTES);
let totalProcessed = 0;
let totalSkipped = 0;

for (const key of allKeys) {
  const [a, b] = key.split('|');
  const ea = ENTITY[a], eb = ENTITY[b];
  if (!ea || !eb) { totalSkipped++; continue; }
  const note = PAIRING_NOTES[key];
  const tier = tierForKey(key);
  if (!tier) { totalSkipped++; continue; }

  const aIsDrink = DRINK_CATS.has(ea.category);
  const bIsDrink = DRINK_CATS.has(eb.category);
  const aIsFood  = FOOD_CATS.has(ea.category);
  const bIsFood  = FOOD_CATS.has(eb.category);

  if ((aIsDrink && bIsFood) || (aIsFood && bIsDrink)) {
    // DxF
    const drink = aIsDrink ? ea : eb;
    const food  = aIsFood  ? ea : eb;
    const dc = taxonomy.drinkClassFor(drink) || 'UNCLASSIFIED';
    const bkey = `${dc}|${food.category}|${tier}`;
    if (!dxfBuckets[bkey]) dxfBuckets[bkey] = blankMetrics();
    ingest(dxfBuckets[bkey], key, note, tier === 'avoid', food.category);
  } else if (aIsFood && bIsFood) {
    // FxF (notes file contains drink-food only per its header, but defensive)
    const cats = [ea.category, eb.category].sort();
    const bkey = `${cats[0]}|${cats[1]}|${tier}`;
    if (!fxfBuckets[bkey]) fxfBuckets[bkey] = blankMetrics();
    ingest(fxfBuckets[bkey], key, note, tier === 'avoid', ea.category);
  }
  totalProcessed++;
}

// Finalize averages
function finalize(buckets) {
  const out = [];
  for (const [k, m] of Object.entries(buckets)) {
    m.avgWords = m.count ? +(m.totalWords / m.count).toFixed(1) : 0;
    m.editorialRatio = m.count ? +(m.editorialCount / m.count).toFixed(3) : 0;
    m.recycledRate = m.count ? +(m.recycledHits / m.count).toFixed(3) : 0;
    m.slotFillRate = m.count ? +(m.slotFillMismatches / m.count).toFixed(3) : 0;
    out.push({ bucket: k, ...m });
  }
  return out;
}

const dxfList = finalize(dxfBuckets);
const fxfList = finalize(fxfBuckets);

// ── QUALITY SCORE ──────────────────────────────────────────────────────────
// Composite signal. Higher = healthier.
//   + editorialRatio  (more hand-written = better voice)
//   + avgWords/40     (capped at 1.0; longer = richer)
//   - recycledRate    (recycled phrasing = generic)
//   - slotFillRate    (label mismatch = bug)
// Buckets with count < 20 are flagged "thin" — sample size warning.
function scoreOf(m) {
  const lenScore = Math.min(1, (m.avgWords || 0) / 40);
  const ed = m.editorialRatio;
  const rec = m.recycledRate;
  const slot = m.slotFillRate;
  return +(ed * 0.5 + lenScore * 0.3 - rec * 0.3 - slot * 0.5).toFixed(3);
}

for (const r of dxfList) r.qualityScore = scoreOf(r);
for (const r of fxfList) r.qualityScore = scoreOf(r);

// ── REPORT ─────────────────────────────────────────────────────────────────
function rankBy(list, key, dir) {
  return list.slice().sort((a, b) => (dir === 'desc' ? b[key] - a[key] : a[key] - b[key]));
}

function fmtBucket(r) {
  return `${r.bucket.padEnd(50)}  n=${String(r.count).padStart(5)}  ed=${(r.editorialRatio*100).toFixed(0).padStart(3)}%  wc=${String(r.avgWords).padStart(4)}  rec=${(r.recycledRate*100).toFixed(0).padStart(3)}%  slot=${(r.slotFillRate*100).toFixed(0).padStart(3)}%  q=${r.qualityScore.toFixed(2)}`;
}

console.log('=== QUALITY DISTRIBUTION DIAGNOSTIC ===');
console.log(`Processed: ${totalProcessed} / Skipped: ${totalSkipped}`);
console.log('');
console.log(`DxF buckets: ${dxfList.length}`);
console.log(`FxF buckets: ${fxfList.length}`);
console.log('');

// Filter to meaningful sample sizes
const dxfMeaty = dxfList.filter(r => r.count >= 20);
const dxfThin  = dxfList.filter(r => r.count < 20);

console.log('--- DxF: WEAKEST 15 (qualityScore asc, n≥20) ---');
for (const r of rankBy(dxfMeaty, 'qualityScore', 'asc').slice(0, 15)) console.log(fmtBucket(r));
console.log('');
console.log('--- DxF: STRONGEST 15 (qualityScore desc, n≥20) ---');
for (const r of rankBy(dxfMeaty, 'qualityScore', 'desc').slice(0, 15)) console.log(fmtBucket(r));
console.log('');
console.log('--- DxF: HIGHEST RECYCLED RATE 10 ---');
for (const r of rankBy(dxfMeaty, 'recycledRate', 'desc').slice(0, 10)) console.log(fmtBucket(r));
console.log('');
console.log('--- DxF: HIGHEST SLOT-FILL MISMATCH 10 ---');
for (const r of rankBy(dxfMeaty.filter(r => r.slotFillMismatches > 0), 'slotFillMismatches', 'desc').slice(0, 10)) console.log(fmtBucket(r));
console.log('');
console.log('--- DxF: LOWEST EDITORIAL RATIO 10 (n≥40) ---');
for (const r of rankBy(dxfMeaty.filter(r => r.count >= 40), 'editorialRatio', 'asc').slice(0, 10)) console.log(fmtBucket(r));
console.log('');
console.log('--- DxF: THIN BUCKETS (n<20) — count by class ---');
const thinByClass = Object.create(null);
for (const r of dxfThin) {
  const dc = r.bucket.split('|')[0];
  thinByClass[dc] = (thinByClass[dc] || 0) + r.count;
}
for (const [dc, n] of Object.entries(thinByClass).sort((a,b)=>b[1]-a[1])) {
  console.log(`  ${dc.padEnd(25)}  ${n} pairs across thin buckets`);
}
console.log('');

console.log('--- FxF: WEAKEST 10 (qualityScore asc) ---');
for (const r of rankBy(fxfList.filter(r => r.count >= 5), 'qualityScore', 'asc').slice(0, 10)) console.log(fmtBucket(r));
console.log('');
console.log('--- FxF: STRONGEST 10 (qualityScore desc) ---');
for (const r of rankBy(fxfList.filter(r => r.count >= 5), 'qualityScore', 'desc').slice(0, 10)) console.log(fmtBucket(r));
console.log('');

// Class-level rollups
console.log('--- DxF: PER-CLASS ROLLUP (across all tiers, n>=50) ---');
const byClass = Object.create(null);
for (const r of dxfList) {
  const dc = r.bucket.split('|')[0];
  if (!byClass[dc]) byClass[dc] = { count: 0, ed: 0, wc: 0, rec: 0, slot: 0, n: 0 };
  byClass[dc].count += r.count;
  byClass[dc].ed += r.editorialCount;
  byClass[dc].wc += r.totalWords;
  byClass[dc].rec += r.recycledHits;
  byClass[dc].slot += r.slotFillMismatches;
  byClass[dc].n += 1;
}
const classRows = Object.entries(byClass).map(([dc, m]) => ({
  dc,
  count: m.count,
  edRatio: +(m.ed / m.count).toFixed(3),
  avgWords: +(m.wc / m.count).toFixed(1),
  recRate: +(m.rec / m.count).toFixed(3),
  slotRate: +(m.slot / m.count).toFixed(3),
}));
classRows.sort((a,b) => a.edRatio - b.edRatio);
for (const r of classRows) {
  if (r.count < 50) continue;
  console.log(`  ${r.dc.padEnd(22)}  n=${String(r.count).padStart(5)}  ed=${(r.edRatio*100).toFixed(0).padStart(3)}%  wc=${String(r.avgWords).padStart(4)}  rec=${(r.recRate*100).toFixed(0).padStart(3)}%  slot=${(r.slotRate*100).toFixed(0).padStart(3)}%`);
}

// ── PER-CLASS SLOT-FILL RANKING (real bugs, post-calibration) ──────────────
console.log('');
console.log('--- DxF: PER-CLASS SLOT-FILL MISMATCH (post-calibration) ---');
const slotByClass = Object.create(null);
for (const r of dxfList) {
  const dc = r.bucket.split('|')[0];
  if (!slotByClass[dc]) slotByClass[dc] = { count: 0, mismatches: 0 };
  slotByClass[dc].count += r.count;
  slotByClass[dc].mismatches += r.slotFillMismatches;
}
const slotRows = Object.entries(slotByClass).map(([dc, m]) => ({
  dc, count: m.count, mismatches: m.mismatches,
  rate: m.count ? +(m.mismatches / m.count).toFixed(3) : 0,
}));
slotRows.sort((a, b) => b.rate - a.rate);
for (const r of slotRows) {
  if (r.count < 50) continue;
  const tag = r.mismatches > 0 ? '** ' : '   ';
  console.log(`  ${tag}${r.dc.padEnd(22)}  n=${String(r.count).padStart(5)}  mismatches=${String(r.mismatches).padStart(5)}  rate=${(r.rate*100).toFixed(1).padStart(5)}%`);
}

// ── CALIBRATION SELF-TEST ──────────────────────────────────────────────────
// Verify the calibration didn't break: a known-good save-clause note should
// NOT flag, a synthetic mismatch SHOULD flag.
console.log('');
console.log('--- CALIBRATION SELF-TEST ---');
const selfTests = [
  // Should NOT flag (legitimate save-clause):
  { note: "Vin Santo's Tuscan sweetness overpowers the wedge — Avoid; the alts above are the call. Vin Santo belongs on the steak course.",
    food: 'soup-salad', expected: false, label: 'legit save-clause (belongs on steak)' },
  { note: "Save the Caymus for the steak course.",
    food: 'dessert', expected: false, label: 'legit save-clause (save for steak)' },
  { note: "Hold the Larceny for another course.",
    food: 'steak', expected: false, label: 'legit save-clause (steak food, another course)' },
  // SHOULD flag (real label-mismatch bug per AUDIT_500):
  { note: "Mount Gay's cane lift sits with the Caesar — Works; the digestif-on-dessert pairing reads cleanly.",
    food: 'soup-salad', expected: true, label: 'AUDIT_500 case: digestif-on-dessert on a salad' },
  { note: "Doctor Bird's heavy rum body composes with the filet — Strong; the light-spirit-on-dessert call works.",
    food: 'steak', expected: true, label: 'AUDIT_500 case: light-spirit-on-dessert on a steak' },
  { note: "Cristom's silky lift complements — Peak Southern-French for the bird.",
    food: 'side', expected: true, label: 'AUDIT_500 case: Peak X for the bird on a side' },
];
let passes = 0, fails = 0;
for (const t of selfTests) {
  const got = hasSlotFillMismatch('test', t.note, t.food);
  const ok = got === t.expected;
  console.log(`  ${ok ? '[PASS]' : '[FAIL]'} ${t.label} — expected=${t.expected} got=${got}`);
  if (ok) passes++; else fails++;
}
console.log(`  ${passes}/${selfTests.length} self-tests pass`);
if (fails > 0) {
  console.error('CALIBRATION SELF-TEST FAILED — diagnostic numbers are NOT trustworthy until self-tests pass.');
}

// JSON output
const report = {
  generatedAt: new Date().toISOString(),
  calibration: 'v2-2026-05-30 (save-clause excluded)',
  selfTest: { passes, fails, total: selfTests.length },
  totals: { processed: totalProcessed, skipped: totalSkipped },
  dxf: dxfList,
  fxf: fxfList,
  classRollup: classRows,
  slotFillByClass: slotRows,
};
fs.writeFileSync(path.join(__dirname, 'quality_distribution_report.json'), JSON.stringify(report, null, 2));
console.log('');
console.log('JSON report → engine/quality_distribution_report.json');
