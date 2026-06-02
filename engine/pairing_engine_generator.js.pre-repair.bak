// engine/pairing_engine_generator.js (v6 — profile + corpus wired)
//
// Templated pair-note generator -- food x food only.
//
// v6 (2026-04-27): added the food profile layer (food_profiles_curated.js)
// and the mined editorial corpus (food_corpus_mined.js). The generator now:
//   - Pulls subjects/targets from FOOD_PROFILES (4-6 each) when available,
//     falling back to BRIDGE_PARTS (2 each) for legacy compatibility.
//   - Substitutes verdict tails with mined editorial snippets when the
//     archetype.tier slot has 3+ mined entries.
//   - flavor_relationships.flavorPattern() now returns 4-6 variants per
//     pattern kind (deterministic per pair), so patternReading stops
//     repeating across hundreds of pairs.
//
// v3 (legacy): consults CHEMISTRY_CLAIMS for flavor-pair-specific bridge
// clauses when a match exists for the pair under construction.

'use strict';

const fs = require('fs');
const vm = require('vm');
const path = require('path');
const crypto = require('crypto');

const taxonomy = require('./pairing_engine_taxonomy');
const flavorRel = require('./flavor_relationships');
const foodProfiles = require('./food_profiles_curated');

let MINED_CORPUS = null;
try { MINED_CORPUS = require('./food_corpus_mined'); } catch (e) { /* not yet mined */ }

// ── COURSE WEIGHT ──────────────────────────────────────────────────────────
const CATEGORY_WEIGHT = { 'steak':1, 'main':2, 'starter':3, 'soup-salad':4, 'side':5, 'dessert':6 };
function canonicalize(foodA, foodB) {
  const wA = CATEGORY_WEIGHT[foodA.category] || 99;
  const wB = CATEGORY_WEIGHT[foodB.category] || 99;
  if (wA < wB) return [foodA, foodB];
  if (wA > wB) return [foodB, foodA];
  // v6: same-category pairs (steak×steak, side×side, etc.) — sort by name
  // alphabetically so canonical form is direction-independent. This guarantees
  // A|B and B|A render to the same templated note (mirror integrity).
  return foodA.name < foodB.name ? [foodA, foodB] : [foodB, foodA];
}

// ── ARCHETYPE ──────────────────────────────────────────────────────────────
function archetypeFor(foodA, foodB) {
  const a = foodA.category, b = foodB.category;
  if (a === 'steak'      && b === 'steak')      return 'STEAK_PAIR';
  if (a === 'main'       && b === 'main')       return 'MAIN_PAIR';
  if (a === 'starter'    && b === 'starter')    return 'STARTER_PAIR';
  if (a === 'soup-salad' && b === 'soup-salad') return 'SOUP_SALAD_PAIR';
  if (a === 'side'       && b === 'side')       return 'SIDE_PAIR';
  if (a === 'dessert'    && b === 'dessert')    return 'DESSERT_PAIR';
  if (a === 'steak'      && b === 'main')       return 'STEAK_MAIN';
  if (a === 'steak'      && b === 'starter')    return 'STEAK_STARTER';
  if (a === 'steak'      && b === 'soup-salad') return 'STEAK_SOUP_SALAD';
  if (a === 'steak'      && b === 'side')       return 'STEAK_SIDE';
  if (a === 'steak'      && b === 'dessert')    return 'COURSE_TO_DESSERT';
  if (a === 'main'       && b === 'starter')    return 'MAIN_STARTER';
  if (a === 'main'       && b === 'soup-salad') return 'MAIN_SOUP_SALAD';
  if (a === 'main'       && b === 'side')       return 'MAIN_SIDE';
  if (a === 'main'       && b === 'dessert')    return 'COURSE_TO_DESSERT';
  if (a === 'starter'    && b === 'soup-salad') return 'STARTER_SOUP_SALAD';
  if (a === 'starter'    && b === 'side')       return 'STARTER_SIDE';
  if (a === 'starter'    && b === 'dessert')    return 'STARTER_TO_DESSERT';
  if (a === 'soup-salad' && b === 'side')       return 'SOUP_SALAD_SIDE';
  if (a === 'soup-salad' && b === 'dessert')    return 'SOUP_SALAD_TO_DESSERT';
  if (a === 'side'       && b === 'dessert')    return 'SIDE_TO_DESSERT';
  return 'GENERIC_FOOD_PAIR';
}

// ── FOOD CHARACTER ─────────────────────────────────────────────────────────
const FOOD_CHARACTER = {
  'Filet Mignon':'lean buttery tenderness','Bone-In Filet':'bone-enhanced buttery tenderness',
  'Kansas City':'lean-bold strip with savory grain','Cowboy Ribeye':'marbled char-and-fat richness',
  'The Tomahawk':'theatrical bone-in marbling and smoky char','Porterhouse':'dual strip-and-filet character',
  'Bone Marrow':'unctuous rendered-marrow richness','Escargot':'garlic-herb-butter savory weight',
  'Prime Tartare':'raw beef-and-brine umami','Brussels and Belly':'maple-pork-belly glaze over charred sprouts',
  'Crab Cake':'delicate sweet crab in a crisp crust','Shrimp Cocktail':'cool brine-and-citrus shellfish',
  'Burrata':'fresh basil-tomato-cream delicacy','Seafood Tower':'chilled shellfish lineup',
  'French Onion':'beef-broth-and-gruyere depth','Mushroom Bisque':'silky earthy mushroom cream',
  'Gumbo':'spiced creole stew','Shrimp Bisque':'creamy shellfish soup',
  'Loaded Potato':'rich loaded-potato soup','Clam Chowder':'creamy clam-and-potato base',
  'Tomato Basil':'bright tomato-basil acid','Butternut Squash':'silky sweet squash cream',
  'Seasonal Soup':'house seasonal build','Creamy Potato':'silky-bodied cream',
  'Broccoli Cheddar':'cheddar-and-broccoli cream','Roasted Red Pepper Chickpea':'roasted-pepper chickpea warmth',
  'Grilled Caesar':'charred-romaine and anchovy edge','House Wedge':'iceberg-and-bleu cool crunch',
  'Au Gratin Potatoes':'cheese-and-cream golden crust','Creamed Spinach':'rich bechamel-laced greens',
  'Lobster Mac':'shellfish-in-cream indulgence','Asparagus':'green-vegetal edge',
  'Broccolini':'tender green stalks','Sauteed Garlic Spinach':'garlic-buttered greens',
  'Honey Roasted Carrots':'honey-glazed carrot sweetness','Seasonal Vegetables':'seasonal garden plate',
  'Truffle Fries':'parmesan-and-truffle fry weight','Mushrooms':'earthy umami weight',
  'Roast Half Chicken':'herbed crisp-skin roast','Faroe Island Salmon':'rich oily flesh',
  'Swordfish':'meaty swordfish steak','Chilean Seabass':'buttery seabass flesh',
  'Tuxedo-Crusted Yellowfin Tuna':'seared-rare flesh with sesame crust','Rainbow Trout':'delicate flesh',
  'Market Fish':'clean white-fish flesh','Salt-Cured Halibut':'salt-cured flesh',
  'Vegetable Curry with Chickpeas':'spiced chickpea-curry warmth','Seared Scallops':'caramelized sear-and-sweet richness',
  'Chocolate Cake':'layered chocolate body','Chocolate Brownie':'fudgy cocoa-and-chocolate weight',
  'Peanut Butter Brownie':'peanut-butter-and-chocolate fudge','Mocha Creme':'coffee-chocolate richness',
  'Creme Brulee':'burnt-sugar custard','Cheesecake':'dense tangy dairy custard',
  'Beignets':'warm sugar-dusted pastry','Carrot Cake':'cream-cheese-frosted spice cake',
};

function characterFor(food) {
  if (FOOD_CHARACTER[food.name]) return FOOD_CHARACTER[food.name];
  const prof = food.profile || [];
  if (prof.length) return prof.slice(0,2).join(' and ');
  return food.name.toLowerCase();
}

const FOOD_FLAVORS = {
  'Filet Mignon':         ['butter','fat','beef','tenderloin','meat'],
  'Bone-In Filet':        ['butter','fat','beef','tenderloin','meat'],
  'Kansas City':          ['char','fat','savory','strip','meat'],
  'Cowboy Ribeye':        ['char','smoke','fat','cap-fat','meat','marbled'],
  'The Tomahawk':         ['smoke','char','fat','cap-fat','meat','marbled'],
  'Porterhouse':          ['char','fat','strip','meat','beef'],
  'Bone Marrow':          ['fat','butter','meat','marrow','richness'],
  'Escargot':             ['butter','herbs','savory'],
  'Prime Tartare':        ['meat','umami','savory','brine'],
  'Brussels and Belly':   ['char','fat','sugar','sweet','savory'],
  'Crab Cake':            ['shellfish','sweet','crust'],
  'Shrimp Cocktail':      ['shellfish','citrus','brine'],
  'Burrata':              ['cream','butter','herbs'],
  'Seafood Tower':        ['shellfish','brine'],
  'French Onion':         ['broth','cheese','sauce'],
  'Mushroom Bisque':      ['cream','earthy','bisque','umami'],
  'Gumbo':                ['spice','sauce','soup'],
  'Shrimp Bisque':        ['shellfish','cream','bisque'],
  'Loaded Potato':        ['cream','soup','richness'],
  'Clam Chowder':         ['shellfish','cream','soup'],
  'Tomato Basil':         ['herbs','soup','green'],
  'Butternut Squash':     ['cream','sugar','soup'],
  'Seasonal Soup':        ['soup'],
  'Creamy Potato':        ['cream','soup'],
  'Broccoli Cheddar':     ['cheese','cream','green'],
  'Roasted Red Pepper Chickpea': ['soup','spice'],
  'Grilled Caesar':       ['char','green','herbs'],
  'House Wedge':          ['cheese','green'],
  'Au Gratin Potatoes':   ['cream','cheese','crust'],
  'Creamed Spinach':      ['cream','butter','green'],
  'Lobster Mac':          ['shellfish','cream','cheese'],
  'Asparagus':            ['green','edge'],
  'Broccolini':           ['green'],
  'Sauteed Garlic Spinach': ['butter','green','herbs'],
  'Honey Roasted Carrots':['honey','sugar','sweet'],
  'Seasonal Vegetables':  ['green'],
  'Truffle Fries':        ['fat','umami','earthy','savory'],
  'Mushrooms':            ['earthy','umami'],
  'Roast Half Chicken':   ['bird','herbs','crust'],
  'Faroe Island Salmon':  ['fish','fat','oil'],
  'Swordfish':            ['fish','meat'],
  'Chilean Seabass':      ['fish','butter','richness'],
  'Tuxedo-Crusted Yellowfin Tuna': ['fish','char','crust','sesame'],
  'Rainbow Trout':        ['fish'],
  'Market Fish':          ['fish'],
  'Salt-Cured Halibut':   ['fish'],
  'Vegetable Curry with Chickpeas': ['spice','sauce'],
  'Seared Scallops':      ['shellfish','char','sweet'],
  'Chocolate Cake':       ['chocolate','cocoa','sugar','dessert'],
  'Chocolate Brownie':    ['chocolate','cocoa','sugar','dessert'],
  'Peanut Butter Brownie':['chocolate','cocoa','sugar','dessert'],
  'Mocha Creme':          ['coffee','chocolate','cream','mocha','dessert'],
  'Creme Brulee':         ['sugar','cream','dessert'],
  'Cheesecake':           ['cheese','cream','dairy','dessert','sugar'],
  'Beignets':             ['sugar','dessert'],
  'Carrot Cake':          ['spice','sugar','dessert'],
};

function flavorsFor(food) { return FOOD_FLAVORS[food.name] || []; }

// ── BRIDGE PARTS (legacy fallback; v6 prefers food_profiles_curated) ───────
const BRIDGE_PARTS = {
  'Filet Mignon':{subjects:['the lean cut','the buttery beef'],targets:['the lean buttery filet','the delicate restraint of the cut']},
  'Bone-In Filet':{subjects:['the bone-enhanced cut','the buttery beef'],targets:['the bone-enhanced filet','the marrow-edged tenderness']},
  'Kansas City':{subjects:['the lean-bold strip','the savory grain'],targets:['the strip steak','the firm savory cut']},
  'Cowboy Ribeye':{subjects:['the marbled char','the rendered fat'],targets:['the cap-fat ribeye','the bold marbled cut']},
  'The Tomahawk':{subjects:['the marbled char','the smoky bone-in weight'],targets:['the 36oz showpiece','the theatrical bone-in cut']},
  'Porterhouse':{subjects:['the dual strip-and-filet','the bold beefy character'],targets:['the dual-cut steak','the strip-and-tender pairing']},
  'Bone Marrow':{subjects:['the unctuous marrow','the rendered fat'],targets:['the rich marrow','the bone-enhanced richness']},
  'Escargot':{subjects:['the garlic-herb butter','the savory weight'],targets:['the buttered escargot','the garlic-and-parsley plate']},
  'Prime Tartare':{subjects:['the raw beef','the briny umami'],targets:['the tartare','the raw-beef plate']},
  'Brussels and Belly':{subjects:['the maple-glazed belly','the charred sprouts'],targets:['the pork-belly plate','the sweet-savory build']},
  'Crab Cake':{subjects:['the sweet crab','the crisp crust'],targets:['the delicate crab cake','the sweet shellfish plate']},
  'Shrimp Cocktail':{subjects:['the cool brine','the cocktail citrus'],targets:['the chilled shrimp','the cocktail-citrus plate']},
  'Burrata':{subjects:['the fresh cream','the basil-tomato edge'],targets:['the burrata','the milky cheese plate']},
  'Seafood Tower':{subjects:['the chilled shellfish','the cool brine'],targets:['the seafood tower','the chilled shellfish lineup']},
  'French Onion':{subjects:['the beef-broth depth','the gruyere crust'],targets:['the French onion','the broth-and-cheese soup']},
  'Mushroom Bisque':{subjects:['the silky cream','the earthy mushroom'],targets:['the mushroom bisque','the earthy cream']},
  'Gumbo':{subjects:['the spiced stew','the creole heat'],targets:['the gumbo','the spiced creole bowl']},
  'Shrimp Bisque':{subjects:['the creamy shellfish','the silky body'],targets:['the shrimp bisque','the rich shellfish soup']},
  'Loaded Potato':{subjects:['the rich potato','the loaded toppings'],targets:['the loaded potato soup','the indulgent potato bowl']},
  'Clam Chowder':{subjects:['the creamy clam','the silky chowder'],targets:['the chowder','the clam-and-potato cream']},
  'Tomato Basil':{subjects:['the bright acid','the herbed tomato'],targets:['the tomato basil','the bright soup']},
  'Butternut Squash':{subjects:['the silky cream','the sweet squash'],targets:['the squash bisque','the silky sweet bowl']},
  'Seasonal Soup':{subjects:['the house build','the seasonal body'],targets:['the seasonal soup','the house bowl']},
  'Creamy Potato':{subjects:['the silky body','the potato cream'],targets:['the potato soup','the silky bowl']},
  'Broccoli Cheddar':{subjects:['the cheddar cream','the broccoli weight'],targets:['the broccoli cheddar','the cheese-and-broccoli soup']},
  'Roasted Red Pepper Chickpea':{subjects:['the roasted pepper','the chickpea warmth'],targets:['the chickpea soup','the pepper-and-chickpea bowl']},
  'Grilled Caesar':{subjects:['the charred romaine','the anchovy edge'],targets:['the grilled Caesar','the charred-and-anchovy salad']},
  'House Wedge':{subjects:['the cool crunch','the bleu dressing'],targets:['the wedge','the iceberg-and-bleu salad']},
  'Au Gratin Potatoes':{subjects:['the cheese cream','the golden crust'],targets:['the au gratin','the cheese-and-cream side']},
  'Creamed Spinach':{subjects:['the rich bechamel','the laced greens'],targets:['the creamed spinach','the rich greens']},
  'Lobster Mac':{subjects:['the shellfish cream','the dairy weight'],targets:['the lobster mac','the indulgent shellfish-and-cream side']},
  'Asparagus':{subjects:['the green spear','the vegetal edge'],targets:['the asparagus','the bright green side']},
  'Broccolini':{subjects:['the tender green','the bright stem'],targets:['the broccolini','the tender green side']},
  'Sauteed Garlic Spinach':{subjects:['the buttered greens','the garlic edge'],targets:['the garlic spinach','the green-and-garlic side']},
  'Honey Roasted Carrots':{subjects:['the honey glaze','the roasted sweetness'],targets:['the honey carrots','the glazed carrot side']},
  'Seasonal Vegetables':{subjects:['the garden plate','the seasonal mix'],targets:['the seasonal vegetables','the garden side']},
  'Truffle Fries':{subjects:['the parmesan-and-truffle weight','the savory fry'],targets:['the truffle fries','the parmesan-and-truffle side']},
  'Mushrooms':{subjects:['the earthy mushroom','the umami depth'],targets:['the mushrooms','the earthy umami side']},
  'Roast Half Chicken':{subjects:['the herbed crisp skin','the roast bird'],targets:['the roast chicken','the herbed bird']},
  'Faroe Island Salmon':{subjects:['the rich oily flesh','the buttery salmon'],targets:['the salmon','the oily-rich fish']},
  'Swordfish':{subjects:['the meaty steak','the firm-fish flesh'],targets:['the swordfish','the meaty fish']},
  'Chilean Seabass':{subjects:['the buttery flesh','the rich seabass'],targets:['the seabass','the rich-buttered fish']},
  'Tuxedo-Crusted Yellowfin Tuna':{subjects:['the seared-rare flesh','the sesame crust'],targets:['the tuna','the seared-rare tuna plate']},
  'Rainbow Trout':{subjects:['the delicate flesh','the trout body'],targets:['the trout','the delicate fish']},
  'Market Fish':{subjects:['the clean flesh','the white-fish body'],targets:['the market fish','the clean white-fish']},
  'Salt-Cured Halibut':{subjects:['the salt-cured flesh','the firm halibut'],targets:['the halibut','the salt-cured fish']},
  'Vegetable Curry with Chickpeas':{subjects:['the spiced curry','the chickpea warmth'],targets:['the curry','the spiced vegetable plate']},
  'Seared Scallops':{subjects:['the caramelized sear','the scallop sweetness'],targets:['the scallops','the seared-rare scallop plate']},
  'Chocolate Cake':{subjects:['the layered chocolate','the cocoa weight'],targets:['the chocolate cake','the layered cocoa dessert']},
  'Chocolate Brownie':{subjects:['the fudgy cocoa','the brownie weight'],targets:['the brownie','the cocoa-fudge dessert']},
  'Peanut Butter Brownie':{subjects:['the peanut-butter fudge','the cocoa stack'],targets:['the PB brownie','the peanut-cocoa dessert']},
  'Mocha Creme':{subjects:['the coffee-chocolate cream','the mocha depth'],targets:['the mocha creme','the coffee-chocolate dessert']},
  'Creme Brulee':{subjects:['the burnt-sugar crust','the silky custard'],targets:['the brulee','the burnt-sugar dessert']},
  'Cheesecake':{subjects:['the tangy custard','the dairy weight'],targets:['the cheesecake','the dense dairy dessert']},
  'Beignets':{subjects:['the warm pastry','the sugar dust'],targets:['the beignets','the choux-and-sugar dessert']},
  'Carrot Cake':{subjects:['the spice cake','the cream-cheese frosting'],targets:['the carrot cake','the spice-and-cream dessert']},
};

function _bridgeParts(food) {
  const prof = foodProfiles.getProfile(food);
  if (prof && prof.subjects && prof.targets) {
    return { subjects: prof.subjects, targets: prof.targets };
  }
  return BRIDGE_PARTS[food.name] || {
    subjects: ['the ' + characterFor(food)],
    targets:  ['the ' + characterFor(food)],
  };
}

const SHORT_NAME = {
  'Filet Mignon':'the filet','Bone-In Filet':'the bone-in filet','Kansas City':'the KC',
  'Cowboy Ribeye':'the cowboy ribeye','The Tomahawk':'the Tomahawk','Porterhouse':'the porterhouse',
  'Bone Marrow':'the bone marrow','Escargot':'the escargot','Prime Tartare':'the tartare',
  'Brussels and Belly':'Brussels + Belly','Crab Cake':'the crab cake','Shrimp Cocktail':'the shrimp cocktail',
  'Burrata':'the burrata','Seafood Tower':'the seafood tower','French Onion':'the French onion',
  'Mushroom Bisque':'the mushroom bisque','Gumbo':'the gumbo','Shrimp Bisque':'the shrimp bisque',
  'Loaded Potato':'the loaded potato','Clam Chowder':'the chowder','Tomato Basil':'the tomato basil',
  'Butternut Squash':'the butternut squash','Seasonal Soup':'the seasonal soup','Creamy Potato':'the potato soup',
  'Broccoli Cheddar':'the broccoli cheddar','Roasted Red Pepper Chickpea':'the chickpea soup',
  'Grilled Caesar':'the Caesar','House Wedge':'the wedge','Au Gratin Potatoes':'the au gratin',
  'Creamed Spinach':'the creamed spinach','Lobster Mac':'the lobster mac','Asparagus':'the asparagus',
  'Broccolini':'the broccolini','Sauteed Garlic Spinach':'the garlic spinach',
  'Honey Roasted Carrots':'the honey carrots','Seasonal Vegetables':'the seasonal vegetables',
  'Truffle Fries':'the truffle fries','Mushrooms':'the mushrooms','Roast Half Chicken':'the chicken',
  'Faroe Island Salmon':'the salmon','Swordfish':'the swordfish','Chilean Seabass':'the seabass',
  'Tuxedo-Crusted Yellowfin Tuna':'the tuna','Rainbow Trout':'the trout','Market Fish':'the market fish',
  'Salt-Cured Halibut':'the halibut','Vegetable Curry with Chickpeas':'the curry','Seared Scallops':'the scallops',
  'Chocolate Cake':'the chocolate cake','Chocolate Brownie':'the brownie','Peanut Butter Brownie':'the PB brownie',
  'Mocha Creme':'the mocha creme','Creme Brulee':'the brulee','Cheesecake':'the cheesecake',
  'Beignets':'the beignets','Carrot Cake':'the carrot cake',
};
function shortNameFor(food) { return SHORT_NAME[food.name] || food.name.replace(/^The\s+/i,'').toLowerCase(); }
function possessiveFor(food) {
  const sn = shortNameFor(food);
  return sn.endsWith('s') ? sn + "'" : sn + "'s";
}

// ── BODY BRIDGE COMPOSER ───────────────────────────────────────────────────
// v6 expanded: 8-12 verbs per tier (was 3-4), and subjects/targets are 4-6
// each (was 2 each) when the food has a curated profile.
const BRIDGE_VERBS = {
  gold:['handles cleanly','carries cleanly into','frames','lifts','anchors','pairs into','locks against','plays with','wraps around','peaks against'],
  excellent:['handles','carries into','frames','lifts','plays with','anchors','wraps around','meets cleanly','primes','threads into'],
  strong:['meets','holds with','matches','wraps','frames','plays against','threads','sits cleanly with','carries into','anchors against'],
  works:['sits with','reads alongside','holds against','meets quietly','rests against','reads beside','composes with','sits cleanly beside','runs alongside','holds beside'],
  avoid:['obliterates','overwhelms','crowds out','overshadows','flattens','steamrolls','drowns','runs over'],
};
const BRIDGE_VERBS_2 = {
  gold:['threads','softens','underlines','rounds','lifts','anchors','frames'],
  excellent:['threads','softens','underlines','rounds','plays with','frames','wraps','anchors'],
  strong:['sits with','frames','underlines','plays against','threads','wraps','holds with','anchors'],
  works:['reads quietly against','composes against','sits beside','reads alongside','holds against','rests beside','sits cleanly with','runs alongside'],
  avoid:['drowns out','fights','crowds out','flattens','overrides','runs over'],
};

function findChemistryClause(foodA, foodB, claims) {
  if (!claims) return null;
  const flavA = flavorsFor(foodA);
  const flavB = flavorsFor(foodB);
  let bestClause = null;
  let bestCount = 0;
  for (const fa of flavA) {
    for (const fb of flavB) {
      if (claims[fa] && claims[fa][fb] && claims[fa][fb].count > bestCount) {
        bestClause = claims[fa][fb].clause;
        bestCount  = claims[fa][fb].count;
      }
      if (claims[fb] && claims[fb][fa] && claims[fb][fa].count > bestCount) {
        bestClause = claims[fb][fa].clause;
        bestCount  = claims[fb][fa].count;
      }
    }
  }
  return bestClause;
}

function bodyBridge(foodA, foodB, tier, ctx) {
  // Single-clause body (May 2026): the previous template emitted two
  // syntactically parallel clauses joined by ", and " — both subject+verb+target
  // shapes pulling from the same pools, which read as restatement rather than
  // additional information. We dropped the parallel-restate clause across all
  // tiers; the verdict hook + the wrapping template already do the framing
  // work the second clause was supposed to do. The chemistry-clause path is
  // preserved because those clauses carry pair-specific facts (e.g. cream-
  // doubling, umami-stack) that genuinely add to the first clause rather than
  // restate it. BRIDGE_VERBS_2 stays declared at module top in case the
  // chemistry path or a future contrast/qualifier path wants its own pool.
  const partsA = _bridgeParts(foodA);
  const partsB = _bridgeParts(foodB);
  const verbs1 = BRIDGE_VERBS[tier] || BRIDGE_VERBS.works;
  const sig = foodA.name + '|' + foodB.name + '|' + tier;
  const h = crypto.createHash('md5').update(sig).digest();
  const i1 = h.readUInt8(0) % partsA.subjects.length;
  const j1 = h.readUInt8(1) % partsB.targets.length;
  const v1 = h.readUInt8(2) % verbs1.length;
  const subA1 = partsA.subjects[i1], tgtB1 = partsB.targets[j1];

  const templateClause1 = subA1 + ' ' + verbs1[v1] + ' ' + tgtB1;

  const claims = ctx && ctx.CHEMISTRY_CLAIMS;
  if (claims && tier !== 'avoid') {
    const chemClause = findChemistryClause(foodA, foodB, claims);
    if (chemClause) {
      return templateClause1 + ', and ' + chemClause;
    }
  }

  return templateClause1;
}

// ── MINED VERDICT RESOLVER (v6) ────────────────────────────────────────────
function pickMinedVerdict(archetype, tier, foodA, foodB) {
  if (!MINED_CORPUS || !MINED_CORPUS.verdicts) return null;
  const slot = archetype + '.' + tier;
  const pool = MINED_CORPUS.verdicts[slot];
  if (!pool || pool.length < 3) return null;
  const sig = foodA.name + '|' + foodB.name + '|verdict|' + slot;
  const h = crypto.createHash('md5').update(sig).digest();
  return pool[h.readUInt32BE(0) % pool.length];
}

function alternativesFor(food, pairingMap, n, opts) {
  if (!pairingMap) return [];
  const entry = pairingMap.find(e => e.name === food.name);
  if (!entry) return [];
  // opts.kind: 'drink' returns only drink-category alternatives (used by DxF
  // avoid templates so "the plate deserves X, Y, or Z" never recommends a
  // food when the guest needs a different beverage). 'food' returns only foods.
  // Default (undefined): returns any category — same as legacy behavior.
  const kind = opts && opts.kind;
  const FOOD_CATS = new Set(['steak','starter','soup-salad','main','side','dessert']);
  const byName = {};
  for (const e of pairingMap) byName[e.name] = e;
  const out = [];
  for (const tier of ['gold','excellent']) {
    const list = entry[tier];
    if (!Array.isArray(list)) continue;
    for (const name of list) {
      if (out.includes(name)) continue;
      if (kind) {
        const ent = byName[name];
        if (!ent) continue;
        const isFood = FOOD_CATS.has(ent.category);
        if (kind === 'drink' && isFood) continue;
        if (kind === 'food' && !isFood) continue;
      }
      out.push(name);
    }
  }
  return out.slice(0, n || 3);
}

// ── TEMPLATES ──────────────────────────────────────────────────────────────
const TEMPLATES = {
  'STEAK_SIDE.gold':[
    "* {A} alongside {b} -- {aPos} {charA} carries cleanly into {bPos} {charB}. Gold standard; the side-on-steak pairing the menu was built around.",
    "* {aCap} with {b} -- {aPos} {charA} frames {bPos} {charB}. Gold standard; the side that defines the steak course."
  ],
  'STEAK_SIDE.excellent':[
    "{A} alongside {b} -- {aPos} {charA} carries cleanly into {bPos} {charB}. Excellent; the headline side pairing for {a}.",
    "{aCap} into {b} -- {aPos} {charA} meets {bPos} {charB}. Excellent; reliable headline side for the steak course.",
    "{A} with {b} -- {body}. Excellent; the side that completes the steak plate.",
    "{aCap} alongside {b} -- {aPos} {charA} frames {bPos} {charB}. Excellent; the side-on-steak call lands at full register."
  ],
  'STEAK_SIDE.strong':[
    "{A} alongside {b} -- {body}. Strong; reliable side-on-steak match.",
    "{aCap} with {b} -- {aPos} {charA} meets {bPos} {charB} cleanly. Strong; the side carries its register against the cut.",
    "{A} into {b} -- {body}. Strong; the side composes cleanly with the cut.",
    "{aCap} and {b} on the plate -- {body}. Strong; the side holds the steak's weight without competing."
  ],
  'STEAK_SIDE.works':[
    "{A} with {b} -- {patternReading}. Works; the side carries cleanly with the cut.",
    "{aCap} into {b} -- {patternReading}. Works; safe alongside, but not the headline pick.",
    "{A} alongside {b} -- {aPos} {charA} meets {bPos} {charB}: {patternReading}. Works; the side reads as a measured plate companion.",
    "{aCap} with {b} -- {patternReading}. Works; the side sits without pulling focus."
  ],
  'STEAK_SIDE.avoid':[
    "{aPosCap} {charA} overshadows {bPos} {charB}. Avoid; the cut overshadows the side. Pair {b} with a lighter cut, and pour {altsA} for {a}."
  ],
  'COURSE_TO_DESSERT.gold':[
    "* After {a}, {b} -- {aPos} {charA} gives way to {bPos} {charB}. Gold standard; the textbook close to a steak meal.",
    "* {aCap} into {b} -- {body}. Gold standard; the dessert that defines the close after {a}."
  ],
  'COURSE_TO_DESSERT.excellent':[
    "After {a}, {b} -- {body}. Excellent; classic steak-house transition into {b}.",
    "{aCap} closes with {b} -- {body}. Excellent; the dessert picks up where the cut leaves off.",
    "{aCap} closes with {b} -- {body}. Excellent; the meal resolves into the dessert at full register.",
    "After {a}, {b} -- {aPos} {charA} resolves into {bPos} {charB}. Excellent; reliable headline close for the steak course."
  ],
  'COURSE_TO_DESSERT.strong':[
    "After {a}, {b} -- {body}. Strong; reliable steak-house finish.",
    "{aCap} closes with {b} -- {body}. Strong; the dessert carries the close at full register.",
    "{aCap} closes with {b} -- {body}. Strong; the close composes without strain.",
    "After {a}, {b} -- {aPos} {charA} settles into {bPos} {charB}. Strong; the dessert lands without competing with the cut."
  ],
  'COURSE_TO_DESSERT.works':[
    "After {a}, {b} -- {patternReading}. Works; a measured close to the meal.",
    "{aCap} closes with {b} -- {patternReading}. Works; the close holds without strain.",
    "{aCap} closes with {b} -- {aPos} {charA} resolves into {bPos} {charB}: {patternReading}. Works; the dessert lands cleanly.",
    "After {a}, {b} -- {patternReading}. Works; the dessert closes the meal without crowding."
  ],
  'COURSE_TO_DESSERT.avoid':[
    "{aPosCap} {charA} doesn't resolve into {bPos} {charB}. Avoid; the close clashes with the meal. After {a}, reach for a lighter dessert -- pour {altsA} alongside {a} and route {b} to a different night."
  ],
  'STEAK_STARTER.gold':[
    "* {A} preceded by {b} -- {bPos} {charB} sets up {aPos} {charA} cleanly. Gold standard; the starter that primes the cut."
  ],
  'STEAK_STARTER.excellent':[
    "{A} preceded by {b} -- {body}. Excellent; the starter sets up the cut at full register.",
    "{aCap} after {b} -- {bPos} {charB} primes the palate for {aPos} {charA}. Excellent; reliable opener for the steak course."
  ],
  'STEAK_STARTER.strong':[
    "{A} preceded by {b} -- {body}. Strong; reliable opener for the steak course.",
    "{aCap} after {b} -- {body}. Strong; the starter composes cleanly before the cut."
  ],
  'STEAK_STARTER.works':[
    "{A} preceded by {b} -- {patternReading}. Works; the call holds, the starter primes the cut without strain.",
    "{aCap} after {b} -- {bPos} {charB} sets up {aPos} {charA}: {patternReading}. Works; the starter composes before the cut.",
    "{A} after {b} -- {patternReading}. Works; the opener sits cleanly before the steak.",
    "{aCap} preceded by {b} -- {patternReading}. Works; safe opener, the meal builds without crowding the cut."
  ],
  'STEAK_STARTER.avoid':[
    "{aPosCap} {charA} obliterates {bPos} {charB}. Avoid; the cut is too bold for the delicate starter. Stand {b} on its own course -- pair {b} with {altsB} -- and pour {altsA} for {a}.",
    "{aPosCap} {charA} overwhelms {bPos} {charB}. Avoid; the courses can't share a meal cleanly. Pair {b} with {altsB} on a different visit; pour {altsA} alongside {a}."
  ],
  'STEAK_SOUP_SALAD.gold':[
    "* {A} preceded by {b} -- {bPos} {charB} primes the table for {aPos} {charA}. Gold standard; the opener that defines the steak course."
  ],
  'STEAK_SOUP_SALAD.excellent':[
    "{A} preceded by {b} -- {body}. Excellent; the soup-or-salad frames the steak course cleanly.",
    "{aCap} after {b} -- {bPos} {charB} sets the table for {aPos} {charA}. Excellent; the headline opener for the cut.",
    "{A} preceded by {b} -- {aPos} {charA} resolves into {bPos} {charB}. Excellent; the opener that primes the cut at full register.",
    "{aCap} after {b} -- {body}. Excellent; the soup-or-salad call before the cut lands cleanly."
  ],
  'STEAK_SOUP_SALAD.strong':[
    "{A} into {b} -- {body}. Strong; reliable opener for the cut.",
    "{aCap} preceded by {b} -- {body}. Strong; the opener composes cleanly before the cut.",
    "{A} after {b} -- {bPos} {charB} primes the palate for {aPos} {charA}. Strong; the soup-or-salad sets the table without crowding the cut.",
    "{aCap} with {b} alongside -- {body}. Strong; the opener carries its register against the cut."
  ],
  'STEAK_SOUP_SALAD.works':[
    "{A} preceded by {b} -- {patternReading}. Works; the opener primes the cut without strain.",
    "{A} with {b} alongside -- {patternReading}. Works; the soup-or-salad call holds, the meal builds cleanly.",
    "{aCap} after {b} -- {bPos} {charB} sets the table for {aPos} {charA}: {patternReading}. Works; the opener carries before the cut.",
    "{A} into {b} -- {patternReading}. Works; safe opener, the meal builds without crowding."
  ],
  'STEAK_SOUP_SALAD.avoid':[
    "{aPosCap} {charA} crowds out {bPos} {charB}. Avoid; the courses don't compose together. Pair {b} with {altsB}; pour {altsA} for {a}."
  ],
  'MAIN_SIDE.gold':[
    "* {A} alongside {b} -- {aPos} {charA} carries cleanly into {bPos} {charB}. Gold standard; the side that defines the {a} plate."
  ],
  'MAIN_SIDE.excellent':[
    "{A} alongside {b} -- {aPos} {charA} carries cleanly into {bPos} {charB}. Excellent; the headline side pairing for {a}.",
    "{aCap} into {b} -- {aPos} {charA} meets {bPos} {charB}. Excellent; reliable headline side for the {a}.",
    "{A} with {b} -- {body}. Excellent; the side that completes the {a} plate.",
    "{aCap} alongside {b} -- {aPos} {charA} frames {bPos} {charB}. Excellent; the side-on-{a} call lands at full register."
  ],
  'MAIN_SIDE.strong':[
    "{A} with {b} -- {body}. Strong; reliable side for the {a}.",
    "{aCap} alongside {b} -- {aPos} {charA} meets {bPos} {charB} cleanly. Strong; the side carries its register against the main.",
    "{A} into {b} -- {body}. Strong; the side composes cleanly with the main.",
    "{aCap} and {b} on the plate -- {body}. Strong; the side holds the {a}'s weight without competing."
  ],
  'MAIN_SIDE.works':[
    "{A} alongside {b} -- {patternReading}. Works; the side carries cleanly with the {a}.",
    "{aCap} into {b} -- {patternReading}. Works; safe alongside, but not the headline pick.",
    "{A} with {b} -- {aPos} {charA} meets {bPos} {charB}: {patternReading}. Works; the side reads as a measured plate companion.",
    "{aCap} alongside {b} -- {patternReading}. Works; the side sits without pulling focus."
  ],
  'MAIN_SIDE.avoid':[
    "{aPosCap} {charA} overwhelms {bPos} {charB}. Avoid; the side can't hold its register against the main. Pair {b} with {altsB}; pour {altsA} for {a}."
  ],
  'STEAK_MAIN.works':[
    "{A} alongside {b} -- two protein courses on one table. Works; the meal carries the cut and the main cleanly.",
    "{aCap} with {b} -- the steak and the main share the meal. Works; both proteins land without crowding."
  ],
  'STEAK_MAIN.avoid':[
    "{aPosCap} {charA} clashes with {bPos} {charB}. Avoid; the two protein courses pull in different directions. Order one or the other -- pour {altsA} for {a}, or {altsB} for {b}."
  ],
  'STEAK_PAIR.works':[
    "{A} and {b} together -- two cuts on the same table. Works; the two steaks share the meal at full register.",
    "{aCap} alongside {b} -- {body}. Works; both cuts land cleanly when the table splits."
  ],
  'STEAK_PAIR.avoid':[
    "{A} and {b} overlap on the steak course -- {body}. Avoid; pick one cut or the other. Pair {a} with {altsA}, or {b} with {altsB}."
  ],
  'MAIN_PAIR.works':[
    "{A} and {b} together -- two mains on the same table. Works; both proteins land cleanly when the table splits.",
    "{aCap} alongside {b} -- {body}. Works; the two mains share the meal without crowding."
  ],
  'MAIN_PAIR.avoid':[
    "{A} and {b} overlap on the main course -- {body}. Avoid; pick one or the other. Pair {a} with {altsA}, or {b} with {altsB}."
  ],
  'MAIN_STARTER.gold':[
    "* {A} preceded by {b} -- {bPos} {charB} primes the palate for {aPos} {charA}. Gold standard; the starter that sets the {a} up."
  ],
  'MAIN_STARTER.excellent':[
    "{A} preceded by {b} -- {body}. Excellent; the starter sets up the {a} at full register.",
    "{aCap} after {b} -- {bPos} {charB} primes the palate for {aPos} {charA}. Excellent; reliable headline opener for the {a}.",
    "{A} with {b} as the lead-in -- {body}. Excellent; the starter that carries into the {a} cleanly.",
    "{aCap} preceded by {b} -- {body}. Excellent; the opener that frames the {a} at full register."
  ],
  'MAIN_STARTER.strong':[
    "{A} preceded by {b} -- {body}. Strong; reliable opener for the main.",
    "{aCap} after {b} -- {body}. Strong; the starter composes cleanly before the main.",
    "{A} with {b} as the lead-in -- {body}. Strong; the starter sets the table for the {a}.",
    "{aCap} and {b} across courses -- {body}. Strong; the opener carries its register before the main."
  ],
  'MAIN_STARTER.works':[
    "{A} preceded by {b} -- {body}. Works; the call holds, neither soars nor fights.",
    "{aCap} after {b} -- {body}. Works; the starter sits without crowding the main.",
    "{A} with {b} as the lead-in -- {body}. Works; the opener composes at neutral register.",
    "{aCap} preceded by {b} -- {body}. Works; safe opener, but not the headline pick."
  ],
  'MAIN_STARTER.avoid':[
    "{aPosCap} {charA} obliterates {bPos} {charB}. Avoid; the main is too bold for the delicate starter. Pair {b} with {altsB}; pour {altsA} for {a}.",
    "{aPosCap} {charA} overwhelms {bPos} {charB}. Avoid; the courses can't share a meal cleanly. Pair {b} with {altsB} on a different visit; pour {altsA} alongside {a}."
  ],
  'MAIN_SOUP_SALAD.gold':[
    "* {A} preceded by {b} -- {bPos} {charB} primes the table for {aPos} {charA}. Gold standard; the opener that defines the {a} course."
  ],
  'MAIN_SOUP_SALAD.excellent':[
    "{A} preceded by {b} -- {body}. Excellent; the soup-or-salad frames the {a} course cleanly.",
    "{aCap} after {b} -- {bPos} {charB} sets the table for {aPos} {charA}. Excellent; the headline opener for the main.",
    "{A} with {b} alongside -- {body}. Excellent; the opener that primes the {a} at full register.",
    "{aCap} preceded by {b} -- {body}. Excellent; the soup-or-salad call before the main lands cleanly."
  ],
  'MAIN_SOUP_SALAD.strong':[
    "{A} into {b} -- {body}. Strong; reliable opener for the main.",
    "{aCap} preceded by {b} -- {body}. Strong; the opener composes cleanly before the main.",
    "{A} after {b} -- {bPos} {charB} primes the palate for {aPos} {charA}. Strong; the soup-or-salad sets the table for the {a}.",
    "{aCap} with {b} alongside -- {body}. Strong; the opener carries its register against the main."
  ],
  'MAIN_SOUP_SALAD.works':[
    "{A} preceded by {b} -- {body}. Works; the call holds at neutral register.",
    "{A} with {b} alongside -- {body}. Works; the side-salad call holds before the main.",
    "{aCap} after {b} -- {body}. Works; the opener sits without competing.",
    "{A} into {b} -- {body}. Works; safe opener, but not the headline pick."
  ],
  'MAIN_SOUP_SALAD.avoid':[
    "{aPosCap} {charA} crowds out {bPos} {charB}. Avoid; the courses don't compose together. Pair {b} with {altsB}; pour {altsA} for {a}."
  ],
  'STARTER_SOUP_SALAD.excellent':[
    "{A} alongside {b} -- {aPos} {charA} carries cleanly into {bPos} {charB}. Excellent; the opening courses compose at full register.",
    "{aCap} with {b} -- {body}. Excellent; the headline opener pair for the meal.",
    "{A} and {b} together -- the table opens with two strong courses. Excellent; the openers frame the meal cleanly."
  ],
  'STARTER_SOUP_SALAD.strong':[
    "{A} alongside {b} -- {body}. Strong; the openers compose cleanly together.",
    "{aCap} with {b} -- {aPos} {charA} meets {bPos} {charB}. Strong; the opening courses share the table at full register.",
    "{A} and {b} together -- {body}. Strong; both openers earn their place on the meal."
  ],
  'STARTER_SOUP_SALAD.works':[
    "{A} alongside {b} -- {patternReading}. Works; the openers share the table cleanly, sequence or share.",
    "{aCap} with {b} -- {aPos} {charA} meets {bPos} {charB}: {patternReading}. Works; both opening courses earn their place.",
    "{A} and {b} together -- {patternReading}. Works; the table opens with both, no clash either way.",
    "{aCap} preceded by {b} -- {patternReading}. Works; safe opening pair, the meal builds without strain."
  ],
  'STARTER_SOUP_SALAD.avoid':[
    "{aPosCap} {charA} clashes with {bPos} {charB}. Avoid; the opening courses don't compose together. Pair {a} with {altsA}; pair {b} with {altsB}."
  ],
  'STARTER_SIDE.excellent':[
    "{aCap} opens the meal, {b} with the entree -- {aPos} {charA} sets up cleanly for {bPos} {charB}. Excellent; the starter primes the table at full register before the side lands.",
    "{A} early, {b} on the steak plate -- {body}. Excellent; both items earn their place on a thoughtful build."
  ],
  'STARTER_SIDE.strong':[
    "{aCap} opens the meal, {b} with the entree -- {body}. Strong; both items hold their weight on the build.",
    "{A} early, {b} later with the main -- {aPos} {charA} primes the table for {bPos} {charB}. Strong; the starter sets the table before the side lands.",
    "{aCap} and {b} on different courses -- the starter opens, the side rides with the entree. Strong; the meal builds cleanly."
  ],
  'STARTER_SIDE.works':[
    "{aCap} and {b} -- {patternReading}. Works; sequence them or share the table, no concern either way.",
    "{A} alongside {b} -- {aPos} {charA} meets {bPos} {charB}: {patternReading}. Works; no conflict, the meal builds.",
    "{aCap} and {b} -- {patternReading}. Works; the call holds whether the table sequences them or shares.",
    "{A} and {b} -- {patternReading}. Works; both items hold their register, no clash."
  ],
  'STARTER_SIDE.avoid':[
    "{aPosCap} {charA} overwhelms {bPos} {charB}. Avoid; the courses can't share register. Pair {b} with {altsB}; pair {a} with {altsA}."
  ],
  'STARTER_TO_DESSERT.excellent':[
    "{aCap} opens the meal, {b} closes -- the bookends compose at full register. Excellent; the meal arc lands cleanly from open to close.",
    "{A} as the opener, {b} for the close. Excellent; both bookends earn their place on the meal."
  ],
  'STARTER_TO_DESSERT.strong':[
    "{aCap} opens, {b} closes. Strong; the meal's bookends earn their place across the courses.",
    "{A} early, {b} for the close. Strong; the meal arc reads thoughtful from open to close.",
    "{aCap} as the opener, {b} as the close. Strong; the bookends carry the meal cleanly."
  ],
  'STARTER_TO_DESSERT.works':[
    "{aCap} and {b} -- {aPos} {charA} bookends {bPos} {charB}: {patternReading}. Works; no conflict across the meal, either as opener-close or together.",
    "{A} and {b} -- {patternReading}. Works; sequence them as opener and close or share the table, no clash.",
    "{aCap} alongside {b} -- {patternReading}. Works; both bookends earn their place, the meal arc holds.",
    "{A} and {b} -- {patternReading}. Works; sequence or together, the meal carries cleanly."
  ],
  'STARTER_TO_DESSERT.avoid':[
    "{aPosCap} {charA} doesn't carry into {bPos} {charB}. Avoid; the meal's bookends don't compose. Pair {a} with {altsA}; pair {b} with {altsB}."
  ],
  'STARTER_PAIR.works':[
    "{A} and {b} together -- two openers on the same table. Works; the table opens with both courses cleanly.",
    "{aCap} alongside {b} -- {body}. Works; the split-starter call composes without crowding."
  ],
  'STARTER_PAIR.avoid':[
    "{A} and {b} overlap on the opening course -- {body}. Avoid; pick one starter or the other. Pair {a} with {altsA}, or {b} with {altsB}."
  ],
  'SOUP_SALAD_PAIR.works':[
    "{A} and {b} together -- soup-and-salad open the meal. Works; both courses share the opening without crowding.",
    "{aCap} alongside {b} -- {body}. Works; the opening pair holds at table register."
  ],
  'SOUP_SALAD_PAIR.avoid':[
    "{A} and {b} overlap on the opening course -- {body}. Avoid; pick one or the other. Pair {a} with {altsA}, or {b} with {altsB}."
  ],
  'SOUP_SALAD_SIDE.strong':[
    "{aCap} opens the meal, {b} with the entree -- {aPos} {charA} sets up cleanly for {bPos} {charB}. Strong; the build reads thoughtful across the courses.",
    "{A} early, {b} on the steak plate -- {body}. Strong; both items earn their weight when the table builds the full meal."
  ],
  'SOUP_SALAD_SIDE.works':[
    "{aCap} and {b} -- {patternReading}. Works; sequence them or share the table, the call holds either way.",
    "{aCap} alongside {b} -- {patternReading}. Works; the table can build them in order or together.",
    "{A} and {b} -- {aPos} {charA} meets {bPos} {charB}: {patternReading}. Works; no conflict however the table orders them.",
    "{aCap} and {b} on the same meal -- {patternReading}. Works; sequence or share, the build holds."
  ],
  'SOUP_SALAD_SIDE.avoid':[
    "{aPosCap} {charA} clashes with {bPos} {charB}. Avoid; the opener and the side can't share register. Pair {b} with {altsB}; pair {a} with {altsA}."
  ],
  'SOUP_SALAD_TO_DESSERT.strong':[
    "{aCap} opens the meal, {b} closes. Strong; the meal arc carries from opener to dessert cleanly.",
    "{A} as the opener, {b} as the close. Strong; the bookends earn their place across the courses."
  ],
  'SOUP_SALAD_TO_DESSERT.works':[
    "{aCap} and {b} -- {aPos} {charA} bookends {bPos} {charB}: {patternReading}. Works; no conflict across the meal, either as opener-close or together.",
    "{A} and {b} -- {patternReading}. Works; sequence them as opener and close or share the table, no clash.",
    "{aCap} alongside {b} -- {patternReading}. Works; both bookends earn their place, the meal arc holds.",
    "{A} and {b} -- {patternReading}. Works; either timing holds, the table builds either way."
  ],
  'SOUP_SALAD_TO_DESSERT.avoid':[
    "{aPosCap} {charA} doesn't carry into {bPos} {charB}. Avoid; the meal's bookends don't compose. Pair {a} with {altsA}; pair {b} with {altsB}."
  ],
  'SIDE_TO_DESSERT.strong':[
    "{aCap} with the entree; {b} for the close. Strong; the side gives way cleanly to the dessert.",
    "{A} on the entree plate, {b} for the close. Strong; the meal transitions cleanly from side to dessert."
  ],
  'SIDE_TO_DESSERT.works':[
    "{aCap} and {b} -- {aPos} {charA} hands off cleanly to {bPos} {charB}: {patternReading}. Works; sequence them or share the table, no clash.",
    "{A} and {b} -- {patternReading}. Works; clean transition or together if the table wants.",
    "{aCap} alongside {b} -- {patternReading}. Works; the contrast holds, neither course overshadows the other.",
    "{A} and {b} -- {patternReading}. Works; the meal closes cleanly from the side."
  ],
  'SIDE_TO_DESSERT.avoid':[
    "{aPosCap} {charA} doesn't carry into {bPos} {charB}. Avoid; the side and the close don't compose. Pair {a} with {altsA}; pair {b} with {altsB}."
  ],
  'SIDE_PAIR.strong':[
    "{A} and {b} together -- {body}. Strong; the two sides hold the plate at full register.",
    "{aCap} alongside {b} -- {aPos} {charA} composes against {bPos} {charB}. Strong; both sides earn their place on the meal."
  ],
  'SIDE_PAIR.works':[
    "{A} and {b} together -- {body}. Works; the two sides share the meal without competing.",
    "{aCap} alongside {b} -- {body}. Works; both sides hold at neutral register.",
    "{A} with {b} on the plate -- {body}. Works; the call composes without crowding.",
    "{aCap} and {b} across the plate -- {body}. Works; safe call when the table doubles up on sides."
  ],
  'SIDE_PAIR.avoid':[
    "{A} and {b} together overlap -- {body}. Avoid; pick one side or the other."
  ],
  'DESSERT_PAIR.excellent':[
    "{A} and {b} together -- {body}. Excellent; the close lands at full register when the table splits desserts.",
    "{aCap} alongside {b} -- {aPos} {charA} carries cleanly into {bPos} {charB}. Excellent; the dessert pair frames the close cleanly."
  ],
  'DESSERT_PAIR.strong':[
    "{A} and {b} together -- {body}. Strong; both desserts hold the close at full register.",
    "{aCap} alongside {b} -- {body}. Strong; the dessert split composes cleanly."
  ],
  'DESSERT_PAIR.works':[
    "{A} and {b} together -- {body}. Works; the two desserts share the close without crowding.",
    "{aCap} alongside {b} -- {body}. Works; the dessert split holds at neutral register."
  ],
  'DESSERT_PAIR.avoid':[
    "{A} and {b} together overlap on the close -- {body}. Avoid; pick one or the other. Pair {a} with {altsA}, or {b} with {altsB}."
  ],
  'GENERIC_FOOD_PAIR.gold':[
    "* {A} with {b} -- {body}. Gold standard; the pairing that defines the meal."
  ],
  'GENERIC_FOOD_PAIR.excellent':[
    "{A} with {b} -- {body}. Excellent; the headline call."
  ],
  'GENERIC_FOOD_PAIR.strong':[
    "{A} with {b} -- {body}. Strong; reliable match across the courses."
  ],
  'GENERIC_FOOD_PAIR.works':[
    "{A} with {b} -- {body}. Works; the call holds at neutral register."
  ],
  'GENERIC_FOOD_PAIR.avoid':[
    "{aPosCap} {charA} clashes with {bPos} {charB}. Avoid; the courses don't share register. Pair {a} with {altsA}; pair {b} with {altsB}."
  ],
  'DUPLICATION.avoid':[
    "{aCap} and {b} -- both {dupLabel}-forward, the table doubles up on {dupLabel}. Avoid; pick one or the other. Pair {a} with {altsA}; pair {b} with {altsB}.",
    "{aCap} and {b} -- {dupLabel}-on-{dupLabel}, the meal goes redundant. Avoid; the table reads heavy without payoff. Suggest {altsA} for {a}, or {altsB} for {b}.",
    "{aCap} alongside {b} -- both bring {dupLabel} as the headline. Avoid; one is enough. Pair {a} with {altsA}; pair {b} with {altsB}.",
    "{aCap} and {b} share {dupLabel} as the primary character. Avoid; the meal doubles down without contrast. Route {a} with {altsA} or {b} with {altsB} instead."
  ],
};

function pickTemplate(archetype, tier, foodA, foodB) {
  const key = archetype + '.' + tier;
  let variants = TEMPLATES[key];
  if (!variants || variants.length === 0) variants = TEMPLATES['GENERIC_FOOD_PAIR.' + tier];
  if (!variants || variants.length === 0) throw new Error('No template for archetype ' + archetype + ' tier ' + tier);
  const sig = foodA.name + '|' + foodB.name + '|' + tier;
  const h = crypto.createHash('md5').update(sig).digest();
  return variants[h.readUInt32BE(0) % variants.length];
}

function render(template, foodA, foodB, charA, charB, body, altsA, altsB, patternReading) {
  const a = shortNameFor(foodA), b = shortNameFor(foodB);
  const aPos = possessiveFor(foodA), bPos = possessiveFor(foodB);
  const aCap = a.charAt(0).toUpperCase() + a.slice(1);
  const aPosCap = aPos.charAt(0).toUpperCase() + aPos.slice(1);
  const bCap = b.charAt(0).toUpperCase() + b.slice(1);
  const formatList = (arr) => {
    if (!arr || !arr.length) return '';
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr[0] + ' or ' + arr[1];
    return arr.slice(0,-1).join(', ') + ', or ' + arr[arr.length-1];
  };
  return template
    .replace(/\{A\}/g, foodA.name).replace(/\{B\}/g, foodB.name)
    .replace(/\{aCap\}/g, aCap).replace(/\{bCap\}/g, bCap)
    .replace(/\{aPosCap\}/g, aPosCap).replace(/\{aPos\}/g, aPos).replace(/\{bPos\}/g, bPos)
    .replace(/\{a\}/g, a).replace(/\{b\}/g, b)
    .replace(/\{charA\}/g, charA).replace(/\{charB\}/g, charB)
    .replace(/\{body\}/g, body || '')
    .replace(/\{patternReading\}/g, patternReading || '')
    .replace(/\{altsA\}/g, formatList(altsA)).replace(/\{altsB\}/g, formatList(altsB))
    // v6: collapse "the the" doubled-article from templates that say "the {a}"
    // when {a} already contains a leading "the" via SHORT_NAME ("the chicken",
    // "the salmon", etc.). Catches "the the chicken" -> "the chicken" and
    // capitalized variants. Idempotent — never collapses a legitimate "the
    // The Tomahawk" because SHORT_NAME maps it to "the Tomahawk".
    .replace(/\bthe the\b/g, 'the')
    .replace(/\bThe the\b/g, 'The');
}

function generate(foodA, foodB, tier, ctx) {
  if (!foodA || !foodB) throw new Error('generate: foodA and foodB required');
  if (!taxonomy.FOOD_CATS.has(foodA.category)) throw new Error('generate: foodA must be a food (got ' + foodA.category + ')');
  if (!taxonomy.FOOD_CATS.has(foodB.category)) throw new Error('generate: foodB must be a food (got ' + foodB.category + ')');
  if (!['gold','excellent','strong','works','avoid'].includes(tier)) throw new Error('generate: invalid tier ' + tier);
  const [a, b] = canonicalize(foodA, foodB);

  const dup = flavorRel.duplicationKindFor(a, b);
  if (dup && dup.severity === 'severe') {
    tier = 'avoid';
    const charA = characterFor(a), charB = characterFor(b);
    const altsA = alternativesFor(a, ctx.PAIRING_MAP, 3);
    const altsB = alternativesFor(b, ctx.PAIRING_MAP, 3);
    const template = pickTemplate('DUPLICATION', 'avoid', a, b);
    return render(template, a, b, charA, charB, '', altsA, altsB).replace(/\{dupLabel\}/g, dup.label);
  }

  const archetype = archetypeFor(a, b);
  const charA = characterFor(a), charB = characterFor(b);
  const body  = bodyBridge(a, b, tier, ctx);
  const altsA = alternativesFor(a, ctx.PAIRING_MAP, 3);
  const altsB = alternativesFor(b, ctx.PAIRING_MAP, 3);
  const template = pickTemplate(archetype, tier, a, b);
  let patternReading = '';
  if (tier === 'works') {
    const pat = flavorRel.flavorPattern(a, b);
    if (pat) patternReading = pat.reading;
  }
  let rendered = render(template, a, b, charA, charB, body, altsA, altsB, patternReading);

  // v6: substitute templated verdict tail with mined editorial verdict
  // when the corpus has 3+ entries for this archetype.tier slot.
  if (tier !== 'avoid') {
    const minedVerdict = pickMinedVerdict(archetype, tier, a, b);
    if (minedVerdict) {
      const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
      rendered = rendered.replace(
        new RegExp('\\b' + tierLabel + ';[^.]+(\\.\\s*$|\\.$)'),
        tierLabel + '; ' + minedVerdict + '.'
      );
    }
  }

  return rendered;
}

module.exports = {
  generate, archetypeFor, characterFor, canonicalize, bodyBridge,
  alternativesFor, findChemistryClause, flavorsFor,
  pickMinedVerdict,
  TEMPLATES, FOOD_CHARACTER, BRIDGE_PARTS, FOOD_FLAVORS,
};
A, charB, body, altsA, altsB, patternReading);

  // v6: substitute templated verdict tail with mined editorial verdict
  // when the corpus has 3+ entries for this archetype.tier slot.
  if (tier !== 'avoid') {
    const minedVerdict = pickMinedVerdict(archetype, tier, a, b);
    if (minedVerdict) {
      const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
      rendered = rendered.replace(
        new RegExp('\\b' + tierLabel + ';[^.]+(\\.\\s*$|\\.$)'),
        tierLabel + '; ' + minedVerdict + '.'
      );
    }
  }

  return rendered;
}

module.exports = {
  generate, archetypeFor, characterFor, canonicalize, bodyBridge,
  alternativesFor, findChemistryClause, flavorsFor,
  TEMPLATES, FOOD_CHARACTER, BRIDGE_PARTS, FOOD_FLAVORS,
};
S, FOOD_FLAVORS,
};
