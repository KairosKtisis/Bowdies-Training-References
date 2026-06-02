// engine/food_archetypes.js
//
// Single source of truth for food-archetype classification — the sub-category
// each food entity belongs to, used for per-pair reasoning in
// avoid_reasoning_pool.js (and any future generator that wants to vary
// language by food sub-type).
//
// PROBLEM THIS SOLVES (surfaced 2026-05-30, Session 2 preview):
//   The first-pass avoid_reasoning_pool indexed only by [drinkClass][foodCategory].
//   Within a single cell like BOURBON_BOLD × side, foods range from asparagus
//   (green-vegetable) to lobster mac (cream-rich). When the picker landed
//   a cream-specific clause ("sweet-spirit oak meets dairy richness") on
//   asparagus, the prose mismatched the actual food. The fix: subdivide
//   each cell by food archetype so reasoning targets the specific clash.
//
// ARCHETYPES (per category):
//
//   steak:       big | medium | lean
//   starter:     shellfish | dairy | meat | herb
//   main:        fish-delicate | fish-rich | fish-crusted | poultry
//   soup-salad:  cream | broth | greens
//   side:        cream | vegetable | glazed | earthy | starch
//   dessert:     chocolate | custard | cake-spice | pastry
//
// Why these splits drive different pairing language:
//   - Bourbon × shellfish-starter clashes differently than bourbon × dairy-starter
//     (sweet-oak crowds shellfish's clean brine vs curdles next to fresh dairy)
//   - Big red × fish-delicate reads metallic against natural fats; vs fish-crusted
//     where the red's structure crowds the sear itself
//   - Sweet liqueur × cream-soup doubles up the dairy register; vs broth-soup
//     where it adds sugar to a savory base
//
// Add new foods here as the menu changes. If an entity isn't listed, the
// picker falls back to the cell's DEFAULT pool — never blocks generation.

'use strict';

const FOOD_ARCHETYPES = {
  // ── STEAKS (by weight class — drives the under-club AVOID logic) ──────
  'Filet Mignon':    'steak-lean',       // 10oz
  'Bone-In Filet':   'steak-medium',     // 14oz
  'Kansas City':     'steak-medium',     // 18oz
  'Cowboy Ribeye':   'steak-big',        // 26oz
  'The Tomahawk':    'steak-big',        // 36oz
  'Porterhouse':     'steak-big',        // 40oz

  // ── STARTERS ──────────────────────────────────────────────────────────
  'Crab Cake':       'starter-shellfish',
  'Seared Scallops': 'starter-shellfish',
  'Seafood Tower':   'starter-shellfish',
  'Shrimp Cocktail': 'starter-shellfish',
  'Burrata':         'starter-dairy',
  'Bone Marrow':     'starter-meat',
  'Prime Tartare':   'starter-meat',
  'Escargot':        'starter-herb',     // herb-butter snail — closer to dairy/meat

  // ── MAINS ─────────────────────────────────────────────────────────────
  'Market Fish':                   'main-fish-delicate',
  'Rainbow Trout':                 'main-fish-delicate',
  'Salt-Cured Halibut':            'main-fish-delicate',
  'Chilean Seabass':               'main-fish-rich',      // buttery, rich-white
  'Faroe Island Salmon':           'main-fish-rich',      // oily, rich
  'Tuxedo-Crusted Yellowfin Tuna': 'main-fish-crusted',   // seared rare + sesame
  'Swordfish':                     'main-fish-crusted',   // meaty, often charred
  'Roast Half Chicken':            'main-poultry',

  // ── SOUP / SALAD ──────────────────────────────────────────────────────
  'Broccoli Cheddar':              'soup-salad-cream',
  'Butternut Squash':              'soup-salad-cream',
  'Clam Chowder':                  'soup-salad-cream',
  'Creamy Potato':                 'soup-salad-cream',
  'Loaded Potato':                 'soup-salad-cream',
  'Mushroom Bisque':               'soup-salad-cream',
  'Shrimp Bisque':                 'soup-salad-cream',
  'French Onion':                  'soup-salad-broth',    // broth-based even with cheese top
  'Gumbo':                         'soup-salad-broth',
  'Tomato Basil':                  'soup-salad-broth',
  'Seasonal Soup':                 'soup-salad-broth',    // safe default
  'Vegetable Curry with Chickpeas':'soup-salad-broth',
  'Roasted Red Pepper Chickpea':   'soup-salad-broth',
  'House Wedge':                   'soup-salad-greens',
  'Grilled Caesar':                'soup-salad-greens',

  // ── SIDES ─────────────────────────────────────────────────────────────
  'Au Gratin Potatoes':            'side-cream',
  'Creamed Spinach':               'side-cream',
  'Lobster Mac':                   'side-cream',
  'Asparagus':                     'side-vegetable',
  'Broccolini':                    'side-vegetable',
  'Sauteed Garlic Spinach':        'side-vegetable',
  'Seasonal Vegetables':           'side-vegetable',
  'Honey Roasted Carrots':         'side-glazed',
  'Brussels and Belly':            'side-glazed',         // maple-glazed pork belly
  'Mushrooms':                     'side-earthy',
  'Truffle Fries':                 'side-starch',

  // ── DESSERTS ──────────────────────────────────────────────────────────
  'Chocolate Cake':                'dessert-chocolate',
  'Chocolate Brownie':             'dessert-chocolate',
  'Peanut Butter Brownie':         'dessert-chocolate',
  'Mocha Creme':                   'dessert-chocolate',   // coffee-chocolate dominant
  'Cheesecake':                    'dessert-custard',
  'Creme Brulee':                  'dessert-custard',
  'Carrot Cake':                   'dessert-cake-spice',  // cream cheese + cinnamon — distinct
  'Beignets':                      'dessert-pastry',
};

// All known archetypes — handy for picker validation and pool seeding.
const KNOWN_ARCHETYPES = {
  steak:      ['steak-big', 'steak-medium', 'steak-lean'],
  starter:    ['starter-shellfish', 'starter-dairy', 'starter-meat', 'starter-herb'],
  main:       ['main-fish-delicate', 'main-fish-rich', 'main-fish-crusted', 'main-poultry'],
  'soup-salad': ['soup-salad-cream', 'soup-salad-broth', 'soup-salad-greens'],
  side:       ['side-cream', 'side-vegetable', 'side-glazed', 'side-earthy', 'side-starch'],
  dessert:    ['dessert-chocolate', 'dessert-custard', 'dessert-cake-spice', 'dessert-pastry'],
};

// Resolve a food entity (or name) to its archetype. Returns null if not
// mapped — caller falls back to category-default.
function foodArchetypeFor(foodOrName) {
  const name = typeof foodOrName === 'string' ? foodOrName : foodOrName?.name;
  return FOOD_ARCHETYPES[name] || null;
}

// Coverage report — emits per-category counts. Useful for spotting menu
// additions that aren't mapped yet.
function coverageReport(pairingMap) {
  const out = {};
  for (const e of (pairingMap || [])) {
    if (!KNOWN_ARCHETYPES[e.category]) continue;
    if (!out[e.category]) out[e.category] = { total: 0, mapped: 0, unmapped: [] };
    out[e.category].total++;
    if (FOOD_ARCHETYPES[e.name]) out[e.category].mapped++;
    else out[e.category].unmapped.push(e.name);
  }
  return out;
}

if (require.main === module) {
  // Quick self-report
  const totalEntries = Object.keys(FOOD_ARCHETYPES).length;
  console.log(`=== food_archetypes coverage ===`);
  console.log(`Mapped: ${totalEntries} food entities`);
  for (const [cat, archetypes] of Object.entries(KNOWN_ARCHETYPES)) {
    const count = Object.values(FOOD_ARCHETYPES).filter(a => archetypes.includes(a)).length;
    console.log(`  ${cat.padEnd(12)}  ${count} entries  archetypes: ${archetypes.join(', ')}`);
  }
}

module.exports = { FOOD_ARCHETYPES, KNOWN_ARCHETYPES, foodArchetypeFor, coverageReport };
