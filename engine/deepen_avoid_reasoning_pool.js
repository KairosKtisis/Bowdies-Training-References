// engine/deepen_avoid_reasoning_pool.js
//
// Phase 10 / Session 28 — deepens avoid_reasoning_pool from avg 1.2 to ~4 entries
// per cell across 284 cells. Adds 3 NEW {verb, why} pairs per cell, each accurate
// to the specific drink-class × food-archetype combination.
//
// Strategy: per-class descriptor table + per-archetype reasoning templates. Each
// new entry composes a class-appropriate verb with an archetype-appropriate why
// fragment that references the class's actual character.

'use strict';

const fs = require('fs');
const path = require('path');

const POOL_FILE = '/sessions/adoring-serene-dijkstra/mnt/Bowdies-Training-References/engine/avoid_reasoning_pool.js';
const OUT_FILE  = '/sessions/adoring-serene-dijkstra/mnt/outputs/avoid_reasoning_pool.deepened.js';

const { AVOID_REASONING_POOL } = require(POOL_FILE);

// ============================================================
// CLASS DESCRIPTORS — per-class language for {classNoun} / {classChar}
// ============================================================
const CLASS_DESC = {
  BIG_RED:          { noun: 'big red',         alt: 'structured Cab',     char: 'the Cab structure',                weightFamily: 'heavy' },
  ELEGANT_RED:      { noun: 'medium-bodied red', alt: 'elegant red',       char: 'the elegant tannin',               weightFamily: 'medium' },
  BOURBON_BOLD:     { noun: 'whiskey',         alt: 'brown spirit',        char: 'the whiskey weight',               weightFamily: 'heavy' },
  TEQUILA_BOLD:     { noun: 'aged tequila',    alt: 'añejo',                char: 'the aged-agave weight',            weightFamily: 'heavy' },
  MEZCAL:           { noun: 'mezcal',          alt: 'smoky agave',         char: 'the mezcal smoke',                 weightFamily: 'heavy' },
  COGNAC:           { noun: 'cognac',          alt: 'brandy',              char: 'the cognac depth',                 weightFamily: 'heavy' },
  COGNAC_LUXURY:    { noun: 'icon cognac',     alt: 'luxury cognac',       char: 'the prestige-cognac weight',       weightFamily: 'heavy' },
  SPARKLING:        { noun: 'sparkling',       alt: 'Champagne',            char: 'the sparkling lift',               weightFamily: 'light' },
  WHITE_WINE:       { noun: 'white wine',      alt: 'crisp white',         char: 'the white-wine acid',              weightFamily: 'light' },
  GIN:              { noun: 'gin',             alt: 'botanical',           char: 'the gin botanicals',               weightFamily: 'light' },
  VODKA:            { noun: 'vodka',           alt: 'neutral spirit',      char: 'the vodka neutrality',             weightFamily: 'light' },
  LIGHT_SPIRIT:     { noun: 'light spirit',    alt: 'silver spirit',       char: 'the light-spirit body',            weightFamily: 'light' },
  RUM_LIGHT:        { noun: 'light rum',       alt: 'clean rum',            char: 'the rum lift',                     weightFamily: 'light' },
  TEQUILA_BLANCO:   { noun: 'blanco tequila',  alt: 'silver agave',         char: 'the blanco-agave lift',            weightFamily: 'light' },
  HEAVY_SPIRIT:     { noun: 'heavy spirit',    alt: 'high-proof spirit',    char: 'the heavy-spirit weight',          weightFamily: 'heavy' },
  COCKTAIL_BOLD:    { noun: 'spirit-forward cocktail', alt: 'bold cocktail', char: 'the cocktail spirit-weight',     weightFamily: 'heavy' },
  COCKTAIL_LIGHT:   { noun: 'light cocktail',  alt: 'citrus cocktail',     char: 'the cocktail citrus',              weightFamily: 'light' },
  SWEET_LIQUEUR:    { noun: 'sweet liqueur',   alt: 'digestif',             char: 'the liqueur sweetness',            weightFamily: 'sweet' },
  APERITIVO_BITTER: { noun: 'aperitivo',       alt: 'amaro',                char: 'the bitter-aperitivo edge',        weightFamily: 'bitter' },
  SWEET_WINE:       { noun: 'sweet wine',      alt: 'dessert wine',         char: 'the sweet-wine sugar',             weightFamily: 'sweet' },
};

// ============================================================
// VERB POOLS — chosen by class weightFamily × archetype conflict-type
// ============================================================
const VERBS = {
  // Heavy class against delicate/light food
  'heavy-vs-light': ['overwhelms', 'smothers', 'buries', 'flattens', 'crushes', 'crowds out', 'swallows', 'rolls over'],
  // Heavy class against heavy food but wrong direction
  'heavy-vs-heavy-wrong': ['fights', 'clashes with', 'jars against', 'compounds', 'doubles down on'],
  // Light class against heavy food
  'light-vs-heavy': ['underclubs', 'falls short of', 'reads light against', "doesn't anchor", "can't carry", 'mis-pairs with'],
  // Light class against light food but wrong angle
  'light-vs-light-wrong': ['clashes with', 'mis-pairs with', 'jars against', 'reads off against'],
  // Bitter class against any (usually wrong angle)
  'bitter': ['clashes with', 'fights', 'jars against', 'scorches', 'cuts wrong against'],
  // Sweet class against savory
  'sweet-vs-savory': ['doubles down on', 'compounds the savory of', 'muddies', 'jars against', 'smothers'],
  // Sweet class against bitter or salt
  'sweet-vs-bitter': ['clashes with', 'jars against', 'fights', 'mis-pairs with'],
  // Generic dessert conflict (dry classes facing dessert)
  'dry-vs-dessert': ['clashes with', 'fights', 'jars against', 'mis-pairs with', 'reads bitter against'],
};

// Map class weightFamily + archetype kind to a verb pool key
function verbsFor(classDesc, archetype) {
  const wf = classDesc.weightFamily;
  const isDelicate = /delicate|shellfish|herb|greens|broth|vegetable|fish-delicate|custard|pastry|cake-spice|chocolate|main-poultry/.test(archetype);
  const isHeavy    = /steak|fish-rich|fish-crusted|earthy|glazed|cream|dairy|starch|meat|chocolate/.test(archetype);
  const isDessert  = /dessert|chocolate|custard|pastry|cake-spice/.test(archetype);

  if (wf === 'heavy' && isDelicate) return VERBS['heavy-vs-light'];
  if (wf === 'heavy' && isHeavy)    return VERBS['heavy-vs-heavy-wrong'];
  if (wf === 'light' && isHeavy)    return VERBS['light-vs-heavy'];
  if (wf === 'light' && isDelicate) return VERBS['light-vs-light-wrong'];
  if (wf === 'bitter')               return VERBS['bitter'];
  if (wf === 'sweet' && !isDessert) return VERBS['sweet-vs-savory'];
  if (wf === 'sweet' && isDessert)  return VERBS['sweet-vs-bitter'];
  if (isDessert)                     return VERBS['dry-vs-dessert'];
  return VERBS['heavy-vs-light'];
}

// ============================================================
// ARCHETYPE WHY TEMPLATES — 3-4 per archetype, with {classNoun} / {classChar} slots
// Each template is a complete reasoning clause (no leading or trailing).
// ============================================================
const ARCHETYPE_WHY = {
  // ── MAIN ──────────────────────────────────────────
  'main-fish-delicate': [
    '{classChar} buries the delicate flesh without lifting it',
    '{classNoun} weight has no bridge into the gentle fish profile',
    'the protein is too gentle for the {classNoun} register — needs a crisp white',
    '{classChar} flattens the clean flesh instead of carrying it',
  ],
  'main-fish-rich': [
    '{classNoun} weight and oily fish meet without integration — density on density',
    '{classChar} doubles the natural richness without contrast',
    'no acid to cut the rich flesh — the spirit just compounds the weight',
    '{classNoun} reads heavy on the oily protein — needs structural lift',
  ],
  'main-fish-crusted': [
    '{classChar} flattens the seared crust without complement',
    'the {classNoun} register clashes with the rare flesh\'s mineral edge',
    '{classNoun} has no foil against the protein\'s signature finish',
    'spirit depth crowds the crust\'s sharp profile',
  ],
  'main-poultry': [
    '{classChar} crowds the chicken\'s mild frame without complement',
    'the {classNoun} weight overshadows the herbed crisp skin',
    '{classChar} buries the bird\'s gentle savory register',
    'needs a softer call — the {classNoun} register is wrong direction for poultry',
  ],
  'main': [
    '{classChar} reads wrong against the main course\'s register',
    'the {classNoun} weight is misaligned with the protein\'s profile',
    'spirit and main course refuse each other without bridge',
  ],

  // ── STARTER ──────────────────────────────────────
  'starter-shellfish': [
    '{classChar} crowds the brine without acid to bridge',
    'the {classNoun} register flattens the briny opener instead of lifting it',
    'wrong-course energy — shellfish needs crisp acidity, not {classNoun} weight',
    '{classChar} buries the clean shellfish profile without complement',
  ],
  'starter-dairy': [
    '{classChar} curdles against fresh dairy without structural acid',
    'the {classNoun} weight buries the milky cheese plate\'s delicate frame',
    '{classNoun} has no foil against fresh cream — needs structural cut',
    'spirit warmth and fresh dairy refuse each other texturally',
  ],
  'starter-meat': [
    'this expression doesn\'t carry the meat opener — a bigger pour earns it',
    '{classChar} reads thin against the iron richness — needs more weight',
    'the {classNoun} is capable but the rich meat starter deserves a more decisive call',
    'spirit weight crowds the iron-savory starter without integration',
  ],
  'starter-herb': [
    '{classChar} rolls over the herb-bright opener',
    'the {classNoun} weight buries the dish\'s garlic-herb lift',
    'spirit register overshadows the herbal complexity — no contrast',
    '{classChar} clashes with the bright herbal profile without bridge',
  ],
  'starter': [
    '{classChar} reads wrong-course for the table\'s opener',
    'the {classNoun} weight is misaligned with the starter\'s lighter register',
    '{classNoun} crowds the opening course instead of lifting it',
  ],

  // ── SOUP / SALAD ──────────────────────────────────
  'soup-salad-cream': [
    '{classChar} meets the dairy cream with no contrast — both register heavy',
    'the {classNoun} weight doubles the soup\'s density instead of lifting',
    'spirit warmth and cream pull the same direction without bridge',
    '{classChar} compounds the cream\'s richness without acid to clean',
  ],
  'soup-salad-broth': [
    '{classNoun} has no acid to balance the broth\'s savory base',
    '{classChar} and the salt-and-spice broth refuse each other',
    'needs structural cut — {classNoun} weight flattens the broth\'s lift',
    'spirit register crowds the clean broth without integration',
  ],
  'soup-salad-greens': [
    '{classChar} crowds the greens\' bright edge without bridge',
    '{classNoun} has no acid foil against the salad\'s clean profile',
    'wrong direction — greens need bright acid, not {classNoun} weight',
    '{classChar} reads heavy against the salad\'s light frame',
  ],
  'soup-salad': [
    '{classChar} flattens the soup-or-salad course register',
    'the {classNoun} weight is wrong moment for the course',
    '{classNoun} crowds the opening course without complement',
  ],

  // ── SIDE ──────────────────────────────────────────
  'side-cream': [
    '{classChar} meets dairy richness with no contrast',
    'the {classNoun} weight and the side\'s cream pull the same direction',
    'spirit warmth on dairy reads heavy on heavy — no lift',
    '{classChar} compounds the cream side without structural cut',
  ],
  'side-vegetable': [
    '{classChar} overshadows the green-vegetal edge',
    'the {classNoun} register is wrong for a clean vegetable side — needs crisp white',
    'no bridge into the side\'s clean profile — spirit weight crowds',
    '{classChar} clashes with the vegetable\'s bright vegetal lift',
  ],
  'side-glazed': [
    '{classChar} doubles the glaze\'s sweetness without contrast',
    'the {classNoun} oak and the side\'s sugar register compound — no lift',
    'spirit warmth on glaze reads cloying — needs acidity',
    '{classChar} reads heavy on the glazed side without complement',
  ],
  'side-earthy': [
    '{classChar} fights the earthy umami without bridge',
    'the {classNoun} register has nothing to meet the side\'s depth',
    'spirit and earthy plate refuse each other — no integration',
    '{classChar} crowds the mushroom register instead of carrying it',
  ],
  'side-starch': [
    'the {classNoun} needs the cut, not the supporting starch plate',
    '{classChar} overshadows the side\'s neutral frame',
    'this is a bottle for the headline, not a starch alongside',
    '{classNoun} register reads heavy against the side\'s mild profile',
  ],
  'side': [
    '{classChar} reads wrong for the side course',
    'the {classNoun} weight is misaligned with the side\'s lighter register',
    '{classNoun} crowds the supporting course without lift',
  ],

  // ── DESSERT ────────────────────────────────────────
  'dessert-chocolate': [
    'the {classNoun} heat dulls the chocolate\'s lift instead of carrying it',
    '{classChar} doubles the cocoa weight without lift',
    'no bridge into the chocolate sweetness — {classNoun} jars instead',
    '{classNoun} register clashes with chocolate\'s rich finish — needs Port or amaro',
  ],
  'dessert-custard': [
    '{classChar} doubles the custard\'s sweetness without contrast',
    'the {classNoun} spice register pulls against the custard\'s tang',
    'spirit heat scorches the delicate vanilla-custard frame',
    '{classNoun} weight and the custard\'s silk refuse each other',
  ],
  'dessert-cake-spice': [
    'the {classNoun} cask weight buries the spice cake\'s delicate cinnamon',
    '{classChar} clashes with the cream-cheese-and-cinnamon register',
    'spirit warmth on cake spice reads heavy — needs sweet wine pair',
    '{classChar} overshadows the cake\'s warm-spice profile',
  ],
  'dessert-pastry': [
    'the {classNoun} weight has no foil against warm pastry\'s sugar-and-fry',
    '{classChar} and the dessert\'s lightness refuse each other',
    'spirit overshadows the warm-pastry delicacy — needs sweet liqueur',
    '{classNoun} register is wrong direction for the warm-sugared dessert',
  ],
  'dessert': [
    '{classChar} is wrong-course energy for the dessert close',
    'the {classNoun} weight has no bridge into dessert sweetness',
    '{classNoun} register clashes with the dessert\'s sugar-and-spice register',
  ],

  // ── STEAK ──────────────────────────────────────────
  'steak-big': [
    'the {classNoun} register is right but this bottle reads short of the long-bone cut',
    'this expression doesn\'t carry the 26+ ounce cut — a bigger pour earns it',
    'needs more weight — the cut overshadows the {classNoun}\'s frame',
    '{classChar} underclubs the headline-cut weight',
  ],
  'steak-medium': [
    '{classChar} fights the strip-and-bone register',
    'the bottle\'s character is wrong direction for the mid-cut weight',
    'needs a Cab or whiskey at full register for this cut',
    '{classChar} reads off against the marbled mid-cut',
  ],
  'steak-lean': [
    '{classChar} crowds the filet\'s lean buttery frame — needs softer call',
    'the {classNoun} register buries the cut\'s gentle tenderness',
    'spirit weight overshadows the lean cut\'s subtle profile',
    '{classChar} clashes with the tenderloin\'s delicate finish',
  ],
  'steak': [
    '{classChar} reads wrong for the steak course',
    'the {classNoun} character is misaligned with the protein\'s weight',
    '{classNoun} register clashes with the cut\'s headline frame',
  ],
};

// Map DEFAULT archetype to the food-category's base set
function archetypeKey(fc, arch) {
  if (arch !== 'DEFAULT') return arch;
  return fc; // 'main' / 'starter' / 'soup-salad' / 'side' / 'dessert' / 'steak'
}

// Hash-based pick (deterministic across runs)
function pick(arr, seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return arr[Math.abs(h) % arr.length];
}

// ============================================================
// MAIN: walk every cell, generate 3 new entries that don't duplicate existing
// ============================================================
const pool = AVOID_REASONING_POOL;
let cellsTouched = 0, entriesAdded = 0;

for (const dc of Object.keys(pool)) {
  const desc = CLASS_DESC[dc];
  if (!desc) { console.log('NO DESC for ' + dc); continue; }
  for (const fc of Object.keys(pool[dc])) {
    for (const arch of Object.keys(pool[dc][fc])) {
      const archKey = archetypeKey(fc, arch);
      const templates = ARCHETYPE_WHY[archKey];
      if (!templates) { continue; }
      const verbPool = verbsFor(desc, archKey);
      const cell = pool[dc][fc][arch];
      const existing = Array.isArray(cell) ? cell : [cell];
      const existingWhys = new Set(existing.map(e => e.why));
      const existingVerbs = new Set(existing.map(e => e.verb));

      // Generate 3 new entries — try 6 candidates, take first 3 unique
      const candidates = [];
      for (let i = 0; i < templates.length; i++) {
        for (let j = 0; j < verbPool.length; j++) {
          const why = templates[i].replace(/\{classNoun\}/g, desc.noun).replace(/\{classChar\}/g, desc.char);
          const verb = verbPool[j];
          if (existingWhys.has(why) || existingVerbs.has(verb)) continue;
          candidates.push({ verb, why });
        }
      }
      // Pick 3 deterministically by hash so distribution is varied across cells
      const picks = [];
      const seedBase = dc + '|' + fc + '|' + arch + '|';
      for (let i = 0; i < 3 && candidates.length > 0; i++) {
        const idx = pick(candidates.map((_,n) => n), seedBase + i);
        picks.push(candidates[idx]);
        candidates.splice(idx, 1);
      }
      if (picks.length === 0) continue;
      pool[dc][fc][arch] = existing.concat(picks);
      cellsTouched++;
      entriesAdded += picks.length;
    }
  }
}

console.log('Cells touched:', cellsTouched);
console.log('New entries added:', entriesAdded);

// Serialize back
const lines = ["'use strict';", '', 'const AVOID_REASONING_POOL = {'];
for (const dc of Object.keys(pool).sort()) {
  lines.push('  ' + JSON.stringify(dc) + ': {');
  for (const fc of Object.keys(pool[dc]).sort()) {
    lines.push('    ' + JSON.stringify(fc) + ': {');
    for (const arch of Object.keys(pool[dc][fc])) {
      lines.push('      ' + JSON.stringify(arch) + ': [');
      const entries = Array.isArray(pool[dc][fc][arch]) ? pool[dc][fc][arch] : [pool[dc][fc][arch]];
      for (const e of entries) {
        lines.push('        { verb: ' + JSON.stringify(e.verb) + ', why: ' + JSON.stringify(e.why) + ' },');
      }
      lines.push('      ],');
    }
    lines.push('    },');
  }
  lines.push('  },');
}
lines.push('};', '');
// Re-import pickAvoidReasoning function from original
const origSrc = fs.readFileSync(POOL_FILE, 'utf8');
const pickerStart = origSrc.indexOf('function pickAvoidReasoning');
const moduleEnd = origSrc.indexOf('module.exports');
const picker = origSrc.slice(pickerStart, moduleEnd);
const exportLine = origSrc.slice(moduleEnd);
lines.push(picker);
lines.push(exportLine);

fs.writeFileSync(OUT_FILE, lines.join('\n'));
console.log('Wrote ' + OUT_FILE);
