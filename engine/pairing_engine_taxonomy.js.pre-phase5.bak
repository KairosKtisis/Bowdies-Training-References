// engine/pairing_engine_taxonomy.js
//
// SINGLE SOURCE OF TRUTH for the Bowdie's pairing engine.
//
// This module is the foundation that every other engine script imports from.
// Generator, miner, rules, audit, regen, snapshot tests — they all read class /
// tier / category definitions from here. Do NOT duplicate these tables in
// other files. If a new bottle or dish is added, classify it here once and
// every downstream script picks it up.
//
// Exports:
//   FOOD_CATS          — set of pairing-map-v2 categories that count as food
//   DRINK_CATS         — set of pairing-map-v2 categories that count as drink
//   TIERS              — ordered tier list, strongest → weakest, plus 'avoid'
//   CLASS_DRINKS       — the 19 drink classes used for templated phrasing
//   FOOD_CLASSES       — derived food classes used for templated phrasing
//   drinkClassFor(e)   — entity object (or name+category) → CLASS_DRINKS member
//   foodClassFor(e)    — entity object (or name+category) → FOOD_CLASSES member
//   tierFor(a, b, map) — given two entity names + the pairing map, returns the
//                        tier (or null) that 'b' occupies in a's recommendation
//                        lists. Mirror-aware: also checks reverse.
//   verifyCoverage(map) — diagnostic. Walks every entity in the map; returns
//                        { drinkClass: {classCounts, defaultEntities},
//                          foodClass:  {classCounts, defaultEntities} }.
//                        Health check fails if defaultEntities is non-empty.
//
// Convention: drinkClassFor / foodClassFor return null (NOT a 'DEFAULT' string)
// when an entity does not classify cleanly. Callers must treat null as a
// blocker — either add an explicit override here or fix the entity's category.
//
// ─────────────────────────────────────────────────────────────────────────────

'use strict';

// ── CATEGORY SETS ──────────────────────────────────────────────────────────

// Pairing-map-v2.js uses 'category' slugs that are display-oriented.
// Group them into food vs. drink for the engine.
const FOOD_CATS = new Set([
  'steak',
  'starter',
  'soup-salad',
  'main',
  'side',
  'dessert',
]);

const DRINK_CATS = new Set([
  'cocktail',
  'wine-sparkling',
  'wine-white',
  'wine-red',
  'wine-dessert',
  'bourbon',          // legacy slug — currently rolled under 'spirit'
  'rye',              // legacy slug
  'scotch',
  'irish',
  'japanese',
  'canadian',
  'tequila',          // legacy slug
  'mezcal',
  'vodka',
  'gin',
  'rum',
  'cognac',
  'liqueur',
  'singlemalt',
  'spirit',           // catch-all that holds bourbons / ryes / tequilas / scotches
  'nz-whisky',
]);

// ── TIERS ──────────────────────────────────────────────────────────────────

// Strongest → weakest. 'avoid' is tracked separately in the map's `avoid` list.
const TIERS = ['gold', 'excellent', 'strong', 'works', 'avoid'];

// ── DRINK CLASSES (19) ─────────────────────────────────────────────────────

const CLASS_DRINKS = [
  'BIG_RED',           // heavy/big reds — Caymus, Opus, Silver Oak
  'ELEGANT_RED',       // medium-bodied reds — Pinots, Chianti, Bordeaux blends
  'BOURBON_BOLD',      // all whiskey-family (bourbon/scotch/rye/Irish/Japanese)
  'TEQUILA_BOLD',      // añejo / extra-añejo / heavier reposado
  'MEZCAL',            // all mezcals
  'COGNAC',            // non-luxury cognac (Hennessy, Courvoisier)
  'COGNAC_LUXURY',     // luxury-icon cognac (Louis XIII)
  'SPARKLING',         // Champagne, Cava, Prosecco
  'WHITE_WINE',        // still whites
  'GIN',               // all gins
  'VODKA',             // all vodkas
  'LIGHT_SPIRIT',      // light rum, blanco/silver tequila
  'HEAVY_SPIRIT',      // rare fallback for heavy non-classified spirits
  'COCKTAIL_BOLD',     // whiskey-forward cocktails
  'COCKTAIL_LIGHT',    // citrus / gin / tequila cocktails (light register)
  'SWEET_LIQUEUR',     // non-bitter sweet liqueurs (Sambuca, Frangelico, Limoncello)
  'APERITIVO_BITTER',  // bitter amari, Campari, Aperol, Fernet, vermouths
  'SWEET_WINE',        // Port, Sauternes, dessert wines
];

// ── FOOD CLASSES ───────────────────────────────────────────────────────────
//
// Derived from the templated phrasing patterns visible in pairing-notes.js
// ("bourbon-on-light-side", "bourbon-on-hearty-soup", etc.). These divide the
// six pairing-map food categories into finer flavor/weight buckets that the
// templated generator can address directly.

const FOOD_CLASSES = [
  'STEAK_LEAN',         // filet, bone-in filet — buttery/delicate
  'STEAK_BOLD',         // KC, cowboy ribeye, tomahawk, porterhouse — firm/marbled
  'HEARTY_STARTER',     // bone marrow, escargot, prime tartare, brussels+belly
  'LIGHT_STARTER',      // crab cake, shrimp cocktail, burrata, seafood tower
  'HEARTY_SOUP',        // french onion, mushroom bisque, gumbo, shrimp bisque, loaded potato
  'LIGHT_SOUP',         // tomato basil, butternut squash, seasonal soup, clam chowder
  'CREAMY_SIDE',        // au gratin, creamed spinach, lobster mac, loaded potato variants
  'LIGHT_SIDE',         // asparagus, broccolini, sauteed garlic spinach, honey carrots, seasonal veg
  'RICH_SIDE',          // truffle fries, mushrooms, brussels and belly sides
  'SALAD',              // grilled caesar, house wedge
  'CHICKEN_MAIN',       // roast half chicken
  'FISH_MAIN_RICH',     // faroe island salmon, swordfish, chilean seabass
  'FISH_MAIN_DELICATE', // rainbow trout, market fish, salt-cured halibut, tuxedo tuna
  'VEG_MAIN',           // vegetable curry with chickpeas, seared scallops (sits between)
  'DESSERT_CHOCOLATE',  // chocolate cake, brownie, peanut butter brownie, mocha creme
  'DESSERT_LIGHT',      // creme brulee, cheesecake, beignets, carrot cake
];

// ── EXPLICIT NAME-PATTERN OVERRIDES ────────────────────────────────────────
//
// Entities whose `category` doesn't fully determine their drink class.
// Most are 'spirit' (which covers bourbons / ryes / tequilas / scotches) and
// 'cocktail' / 'liqueur' (which span multiple flavor registers).
//
// Lookup is exact-match by name. If you add a bottle, add it here too.

const DRINK_CLASS_OVERRIDES = {
  // ── Tequilas in 'spirit' category (TEQUILA_BOLD vs LIGHT_SPIRIT) ────────
  // Aged / reposado / anejo / extra-anejo tequilas
  'Adictivo Cristalino':       'TEQUILA_BOLD',
  'Adictivo Reposado':         'TEQUILA_BOLD',
  'Avion 44':                  'TEQUILA_BOLD',
  'Camarena Tequila':          'TEQUILA_BOLD',
  'Clase Azul Anejo':          'TEQUILA_BOLD',
  'Clase Azul Durango':        'TEQUILA_BOLD',
  'Clase Azul Gold':           'TEQUILA_BOLD',
  'Clase Azul Reposado':       'TEQUILA_BOLD',
  'Clase Azul Ultra':          'TEQUILA_BOLD',
  'Codigo 1530 Rosa':          'TEQUILA_BOLD',
  'Corazon Reposado':          'TEQUILA_BOLD',
  'Corazon Sazerac':           'TEQUILA_BOLD',
  'Corazon Stagg':             'TEQUILA_BOLD',
  'Corazon Weller':            'TEQUILA_BOLD',
  'Don Fulano Anejo':          'TEQUILA_BOLD',
  'Don Fulano Reposado':       'TEQUILA_BOLD',
  'Don Julio 1942':            'TEQUILA_BOLD',
  'Don Julio 70th':            'TEQUILA_BOLD',
  'Don Julio Reposado':        'TEQUILA_BOLD',
  'El Cabo':                   'TEQUILA_BOLD',
  'El Mayor Extra Anejo':      'TEQUILA_BOLD',
  'El Mayor Reposado':         'TEQUILA_BOLD',
  'G4 High Proof':             'TEQUILA_BOLD',
  'Komos Anejo Reserva':       'TEQUILA_BOLD',
  'Komos Crystallino Anejo':   'TEQUILA_BOLD',
  'Komos Extra Anejo':         'TEQUILA_BOLD',
  'Komos Rosa Reposado':       'TEQUILA_BOLD',
  'Milagro Anejo':             'TEQUILA_BOLD',
  'Milagro Reposado':          'TEQUILA_BOLD',
  'Ocho Anejo':                'TEQUILA_BOLD',
  'Patron Anejo':              'TEQUILA_BOLD',
  'Rey Sol Anejo':             'TEQUILA_BOLD',
  'Siete Leguas Reposado':     'TEQUILA_BOLD',
  'Tears of Llorona':          'TEQUILA_BOLD',
  'Trombo Cedano Reposado':    'TEQUILA_BOLD',

  // Blanco / silver / plata / platinum tequilas → LIGHT_SPIRIT
  'Avion Silver':              'LIGHT_SPIRIT',
  'Clase Azul Plata':          'LIGHT_SPIRIT',
  'Corazon Blanco':            'LIGHT_SPIRIT',
  'Don Fulano Blanco':         'LIGHT_SPIRIT',
  'Don Julio Blanco':          'LIGHT_SPIRIT',
  'G4 Blanco':                 'LIGHT_SPIRIT',
  'Gran Patron Platinum':      'LIGHT_SPIRIT',
  'Lalo Silver':               'LIGHT_SPIRIT',
  'Mijenta Blanco':            'LIGHT_SPIRIT',
  'Patron Silver':             'LIGHT_SPIRIT',
  'Siete Leguas Blanco':       'LIGHT_SPIRIT',

  // ── Cognac luxury-icon ─────────────────────────────────────────────────
  'Louis XIII Cognac':         'COGNAC_LUXURY',

  // ── Cocktail bold (whiskey-forward) vs. light ──────────────────────────
  "Bowdie's Old Fashioned":    'COCKTAIL_BOLD',
  'Espresso Old Fashioned':    'COCKTAIL_BOLD',
  'The Manhattan':             'COCKTAIL_BOLD',
  'Vieux Carré':               'COCKTAIL_BOLD',
  'Sazerac':                   'COCKTAIL_BOLD',
  'New York Sour':             'COCKTAIL_BOLD',
  'Not a Paper Plane':         'COCKTAIL_BOLD',
  'Espresso Martini':          'COCKTAIL_BOLD',  // heavy/intense register
  'Negroni':                   'COCKTAIL_BOLD',  // bitter-forward but spirit-driven
  'Inhibited':                 'COCKTAIL_BOLD',

  'The BG':                    'COCKTAIL_LIGHT',
  'French 75':                 'COCKTAIL_LIGHT',
  "Bee's Knees":               'COCKTAIL_LIGHT',
  'Cucumber Gimlet':           'COCKTAIL_LIGHT',
  'Vesper':                    'COCKTAIL_LIGHT',
  'Aviation':                  'COCKTAIL_LIGHT',
  'Paloma':                    'COCKTAIL_LIGHT',
  'Pablo Sour':                'COCKTAIL_LIGHT',
  'Margarita':                 'COCKTAIL_LIGHT',
  'The Happy Wife':            'COCKTAIL_LIGHT',
  'Transfusion':               'COCKTAIL_LIGHT',
  'Head Fake':                 'COCKTAIL_LIGHT',
  'Lemon Lavender Gin Martini':'COCKTAIL_LIGHT',
  'Corpse Reviver':            'COCKTAIL_LIGHT',

  // ── Liqueur split: APERITIVO_BITTER vs SWEET_LIQUEUR ───────────────────
  // Bitter amari / Campari-Aperol / Fernet / Vermouth / Absinthe / Chartreuse
  'Amaro Nonino':              'APERITIVO_BITTER',
  'Averna Amaro':              'APERITIVO_BITTER',
  'Lucano Amaro':              'APERITIVO_BITTER',
  'Montenegro Amaro':          'APERITIVO_BITTER',
  'Fernet Branca':             'APERITIVO_BITTER',
  'Fernet Menta':              'APERITIVO_BITTER',
  'Campari':                   'APERITIVO_BITTER',
  'Aperol':                    'APERITIVO_BITTER',
  'Contratto Vermouth':        'APERITIVO_BITTER',
  'Mata Hari Absinthe':        'APERITIVO_BITTER',
  'Green Chartreuse':          'APERITIVO_BITTER',
  'Yellow Chartreuse':         'APERITIVO_BITTER',

  // Sweet liqueurs
  'Grand Marnier':             'SWEET_LIQUEUR',
  'Limoncello':                'SWEET_LIQUEUR',
  'Chambord':                  'SWEET_LIQUEUR',
  'Licor 43':                  'SWEET_LIQUEUR',
  'Drambuie':                  'SWEET_LIQUEUR',
  'Sambuca':                   'SWEET_LIQUEUR',
  'Ancho Reyes':               'SWEET_LIQUEUR',
  'Baileys Irish Cream':       'SWEET_LIQUEUR',
  'Buffalo Trace Cream':       'SWEET_LIQUEUR',
  'Kahlua':                    'SWEET_LIQUEUR',
  'Patron XO Cafe':            'SWEET_LIQUEUR',
  'Frangelico':                'SWEET_LIQUEUR',
  'Disaronno':                 'SWEET_LIQUEUR',
  'Fireball Whisky':           'SWEET_LIQUEUR',
  'Pineau des Charentes':      'SWEET_LIQUEUR',
};

// ── FOOD CLASS OVERRIDES ───────────────────────────────────────────────────
//
// Because templated notes already use specific phrasing per food sub-class
// (e.g. "bourbon-on-light-side" vs "bourbon-on-rich-side"), foodClassFor
// must subdivide the 6 broad food categories. We use explicit name overrides
// against the menu — the menu is small and stable enough for this to be the
// most reliable path.

const FOOD_CLASS_OVERRIDES = {
  // ── Steak ──────────────────────────────────────────────────────────────
  'Filet Mignon':              'STEAK_LEAN',
  'Bone-In Filet':             'STEAK_LEAN',
  'Kansas City':               'STEAK_BOLD',
  'Cowboy Ribeye':             'STEAK_BOLD',
  'The Tomahawk':              'STEAK_BOLD',
  'Porterhouse':               'STEAK_BOLD',

  // ── Starter ────────────────────────────────────────────────────────────
  'Bone Marrow':               'HEARTY_STARTER',
  'Escargot':                  'HEARTY_STARTER',
  'Prime Tartare':             'HEARTY_STARTER',
  'Brussels and Belly':        'HEARTY_STARTER',
  'Crab Cake':                 'LIGHT_STARTER',
  'Shrimp Cocktail':           'LIGHT_STARTER',
  'Burrata':                   'LIGHT_STARTER',
  'Seafood Tower':             'LIGHT_STARTER',

  // ── Soup / Salad ───────────────────────────────────────────────────────
  'French Onion':              'HEARTY_SOUP',
  'Mushroom Bisque':           'HEARTY_SOUP',
  'Gumbo':                     'HEARTY_SOUP',
  'Shrimp Bisque':             'HEARTY_SOUP',
  'Loaded Potato':             'HEARTY_SOUP',
  'Clam Chowder':              'HEARTY_SOUP',
  'Tomato Basil':              'LIGHT_SOUP',
  'Butternut Squash':          'LIGHT_SOUP',
  'Seasonal Soup':             'LIGHT_SOUP',
  'Creamy Potato':             'LIGHT_SOUP',
  'Broccoli Cheddar':          'LIGHT_SOUP',
  'Roasted Red Pepper Chickpea':'LIGHT_SOUP',
  'Grilled Caesar':            'SALAD',
  'House Wedge':               'SALAD',

  // ── Side ───────────────────────────────────────────────────────────────
  'Au Gratin Potatoes':        'CREAMY_SIDE',
  'Creamed Spinach':           'CREAMY_SIDE',
  'Lobster Mac':               'CREAMY_SIDE',
  'Asparagus':                 'LIGHT_SIDE',
  'Broccolini':                'LIGHT_SIDE',
  'Sauteed Garlic Spinach':    'LIGHT_SIDE',
  'Honey Roasted Carrots':     'LIGHT_SIDE',
  'Seasonal Vegetables':       'LIGHT_SIDE',
  'Truffle Fries':             'RICH_SIDE',
  'Mushrooms':                 'RICH_SIDE',

  // ── Main ───────────────────────────────────────────────────────────────
  'Roast Half Chicken':        'CHICKEN_MAIN',
  'Faroe Island Salmon':       'FISH_MAIN_RICH',
  'Swordfish':                 'FISH_MAIN_RICH',
  'Chilean Seabass':           'FISH_MAIN_RICH',
  'Tuxedo-Crusted Yellowfin Tuna': 'FISH_MAIN_DELICATE',
  'Rainbow Trout':             'FISH_MAIN_DELICATE',
  'Market Fish':               'FISH_MAIN_DELICATE',
  'Salt-Cured Halibut':        'FISH_MAIN_DELICATE',
  'Vegetable Curry with Chickpeas': 'VEG_MAIN',
  'Seared Scallops':           'FISH_MAIN_DELICATE',

  // ── Dessert ────────────────────────────────────────────────────────────
  'Chocolate Cake':            'DESSERT_CHOCOLATE',
  'Chocolate Brownie':         'DESSERT_CHOCOLATE',
  'Peanut Butter Brownie':     'DESSERT_CHOCOLATE',
  'Mocha Creme':               'DESSERT_CHOCOLATE',
  'Creme Brulee':              'DESSERT_LIGHT',
  'Cheesecake':                'DESSERT_LIGHT',
  'Beignets':                  'DESSERT_LIGHT',
  'Carrot Cake':               'DESSERT_LIGHT',
};

// ── CATEGORY → DRINK CLASS DEFAULTS ────────────────────────────────────────

const DRINK_CAT_DEFAULTS = {
  'wine-sparkling':  'SPARKLING',
  'wine-white':      'WHITE_WINE',
  'wine-dessert':    'SWEET_WINE',
  'gin':             'GIN',
  'vodka':           'VODKA',
  'mezcal':          'MEZCAL',
  'cognac':          'COGNAC',
  'scotch':          'BOURBON_BOLD',
  'irish':           'BOURBON_BOLD',
  'japanese':        'BOURBON_BOLD',
  'canadian':        'BOURBON_BOLD',
  'singlemalt':      'BOURBON_BOLD',
  'nz-whisky':       'BOURBON_BOLD',
  'rum':             'LIGHT_SPIRIT',  // most rums on the menu are light/mid; heavy rums get an override
  // 'spirit', 'cocktail', 'liqueur', 'wine-red' are intentionally NOT here —
  // they require name-based or weight-based disambiguation handled below.
};

// ── HEAVY-RUM OVERRIDES (rum category) ─────────────────────────────────────
const HEAVY_RUM_OVERRIDES = new Set([
  'Doctor Bird Jamaica Rum',
  'Jung and Wulff Guyana',
  'Jung and Wulff Trinidad',
  'Myers\'s Rum',
  'Ron Zacapa Rum',
]);

// ── CLASSIFIERS ────────────────────────────────────────────────────────────

function _entityName(e) {
  if (typeof e === 'string') return e;
  if (e && typeof e === 'object' && e.name) return e.name;
  return null;
}

function _entityCategory(e) {
  if (typeof e === 'string') return null;  // bare name — caller must pass full obj
  if (e && typeof e === 'object' && e.category) return e.category;
  return null;
}

function _entityWeight(e) {
  // Pull from enriched-profiles axes if available
  if (e && e.axes && e.axes.weight) return e.axes.weight;
  return null;
}

/**
 * Returns the CLASS_DRINKS member for a drink entity, or null if it can't be
 * classified.
 *
 * Order of resolution:
 *   1. Explicit name override (DRINK_CLASS_OVERRIDES) — wins always
 *   2. Heavy-rum override
 *   3. wine-red split by weight (BIG_RED if heavy/big, ELEGANT_RED otherwise)
 *   4. spirit category — defaults to BOURBON_BOLD (most spirits are whiskey-family)
 *   5. Category default (DRINK_CAT_DEFAULTS)
 *   6. null — caller must surface as a coverage error
 */
function drinkClassFor(entity) {
  const name = _entityName(entity);
  const cat = _entityCategory(entity);
  if (!name) return null;

  // 1. Explicit override
  if (DRINK_CLASS_OVERRIDES[name]) return DRINK_CLASS_OVERRIDES[name];

  // 2. Heavy rum
  if (cat === 'rum' && HEAVY_RUM_OVERRIDES.has(name)) return 'HEAVY_SPIRIT';

  // 3. wine-red — split on weight axis
  if (cat === 'wine-red') {
    const w = _entityWeight(entity);
    if (w === 'big' || w === 'heavy') return 'BIG_RED';
    return 'ELEGANT_RED';
  }

  // 4. spirit — default to BOURBON_BOLD (whiskey-family is the majority).
  //    Tequilas + LIGHT_SPIRIT entries are caught by name overrides above.
  if (cat === 'spirit') return 'BOURBON_BOLD';

  // 5. Category default
  if (DRINK_CAT_DEFAULTS[cat]) return DRINK_CAT_DEFAULTS[cat];

  return null;
}

/**
 * Returns the FOOD_CLASSES member for a food entity, or null if not classified.
 * Currently relies on FOOD_CLASS_OVERRIDES — the menu is small/stable enough
 * that explicit mapping is the most reliable path. If menu grows, fold in
 * profile-tag heuristics here.
 */
function foodClassFor(entity) {
  const name = _entityName(entity);
  const cat = _entityCategory(entity);
  if (!name) return null;
  if (!FOOD_CATS.has(cat)) return null;

  if (FOOD_CLASS_OVERRIDES[name]) return FOOD_CLASS_OVERRIDES[name];
  return null;
}

/**
 * tierFor — given two entity names and the pairing map, returns the tier
 * 'b' occupies in 'a's recommendation lists.
 *
 * The map is mirror-aware in the engine but pairing-map-v2.js is one-directional
 * (each entity's lists name the items it pairs with). So we check both:
 *   - is b in a's tier lists?
 *   - is a in b's tier lists?
 * Returns the strongest tier found, or null if neither has the other.
 */
function tierFor(aName, bName, pairingMap) {
  const tierRank = { gold: 0, excellent: 1, strong: 2, works: 3, avoid: 4 };
  let best = null;

  for (const direction of [[aName, bName], [bName, aName]]) {
    const [src, tgt] = direction;
    const entry = pairingMap.find(e => e.name === src);
    if (!entry) continue;
    for (const tier of TIERS) {
      const list = entry[tier];
      if (Array.isArray(list) && list.includes(tgt)) {
        if (best === null || tierRank[tier] < tierRank[best]) best = tier;
      }
    }
  }
  return best;
}

/**
 * verifyCoverage — diagnostic. Walks every entity in the pairing map and
 * confirms each gets a non-null class assignment. Returns a structured
 * report. The health check fails if defaultEntities is non-empty.
 */
function verifyCoverage(pairingMap, enrichedProfiles) {
  const drinkClassCounts = {};
  const foodClassCounts = {};
  const drinkDefaults = [];
  const foodDefaults = [];
  const orphanCategory = [];

  for (const e of pairingMap) {
    // Merge axes from enriched profile if available
    const enriched = enrichedProfiles && enrichedProfiles[e.name]
      ? { ...e, axes: enrichedProfiles[e.name].axes }
      : e;

    if (FOOD_CATS.has(e.category)) {
      const fc = foodClassFor(enriched);
      if (fc === null) foodDefaults.push(e.name);
      else foodClassCounts[fc] = (foodClassCounts[fc] || 0) + 1;
    } else if (DRINK_CATS.has(e.category)) {
      const dc = drinkClassFor(enriched);
      if (dc === null) drinkDefaults.push(e.name);
      else drinkClassCounts[dc] = (drinkClassCounts[dc] || 0) + 1;
    } else {
      orphanCategory.push({ name: e.name, category: e.category });
    }
  }

  return {
    drink: { counts: drinkClassCounts, defaults: drinkDefaults },
    food:  { counts: foodClassCounts,  defaults: foodDefaults  },
    orphanCategory,
    totalEntities: pairingMap.length,
  };
}

// ── EXPORTS ────────────────────────────────────────────────────────────────

module.exports = {
  FOOD_CATS,
  DRINK_CATS,
  TIERS,
  CLASS_DRINKS,
  FOOD_CLASSES,
  DRINK_CLASS_OVERRIDES,
  FOOD_CLASS_OVERRIDES,
  drinkClassFor,
  foodClassFor,
  tierFor,
  verifyCoverage,
};

// ── SELF-TEST ──────────────────────────────────────────────────────────────
// Run `node engine/pairing_engine_taxonomy.js` to verify coverage against the
// current pairing-map-v2.js and enriched-profiles.js.

if (require.main === module) {
  const path = require('path');
  const repoRoot = path.resolve(__dirname, '..');

  // Load pairing-map-v2.js and enriched-profiles.js as scripts (they assign
  // to globals in browser; in Node we eval into a sandbox).
  const fs = require('fs');
  const vm = require('vm');

  const ctx = {};
  vm.createContext(ctx);
  const mapSrc = fs.readFileSync(path.join(repoRoot, 'pairing-map-v2.js'), 'utf8');
  vm.runInContext(mapSrc + '\nthis.PAIRING_MAP = PAIRING_MAP;', ctx);
  const profilesSrc = fs.readFileSync(path.join(repoRoot, 'enriched-profiles.js'), 'utf8');
  vm.runInContext(profilesSrc + '\nthis.ENRICHED_PROFILES = ENRICHED_PROFILES;', ctx);

  const report = verifyCoverage(ctx.PAIRING_MAP, ctx.ENRICHED_PROFILES);
  console.log('═══ TAXONOMY COVERAGE REPORT ═══');
  console.log(`Total entities: ${report.totalEntities}`);
  console.log('\nDrink class counts:');
  for (const [k, v] of Object.entries(report.drink.counts).sort((a,b)=>b[1]-a[1])) {
    console.log(`  ${k.padEnd(20)} ${v}`);
  }
  console.log('\nFood class counts:');
  for (const [k, v] of Object.entries(report.food.counts).sort((a,b)=>b[1]-a[1])) {
    console.log(`  ${k.padEnd(22)} ${v}`);
  }
  if (report.drink.defaults.length) {
    console.log(`\n⚠  Unclassified drinks (${report.drink.defaults.length}):`);
    report.drink.defaults.forEach(n => console.log(`    ${n}`));
  }
  if (report.food.defaults.length) {
    console.log(`\n⚠  Unclassified foods (${report.food.defaults.length}):`);
    report.food.defaults.forEach(n => console.log(`    ${n}`));
  }
  if (report.orphanCategory.length) {
    console.log(`\n⚠  Entities with unknown category (${report.orphanCategory.length}):`);
    report.orphanCategory.forEach(o => console.log(`    ${o.name}  (category: ${o.category})`));
  }
  const ok = !report.drink.defaults.length && !report.food.defaults.length && !report.orphanCategory.length;
  console.log('\n' + (ok ? '✓ Coverage clean.' : '✗ Coverage gaps — fix overrides above.'));
  process.exit(ok ? 0 : 1);
}
