// engine/flavor_relationships.js
//
// v6: ingredient duplication detection + multi-variant flavor-register
// pattern detection. v6 (2026-04-27) replaces single-reading flavorPattern
// with a 4-6 variant pool per pattern kind. Same pair always returns the same
// reading (deterministic via crypto hash) but the corpus distributes across
// all variants — breaks up the recycled phrases that hit 100+ occurrences
// each ("savory gives way to sweet, the close lands cleanly", etc.).

'use strict';

const _crypto = require('crypto');

const INGREDIENT_TAGS = {
  "Filet Mignon": [
    "beef",
    "lean-cut"
  ],
  "Bone-In Filet": [
    "beef",
    "lean-cut",
    "bone-in"
  ],
  "Kansas City": [
    "beef",
    "strip"
  ],
  "Cowboy Ribeye": [
    "beef",
    "ribeye",
    "marbled"
  ],
  "The Tomahawk": [
    "beef",
    "ribeye",
    "marbled",
    "bone-in"
  ],
  "Porterhouse": [
    "beef",
    "strip",
    "lean-cut"
  ],
  "Roast Half Chicken": [
    "chicken"
  ],
  "Faroe Island Salmon": [
    "fish",
    "salmon",
    "oily-fish"
  ],
  "Swordfish": [
    "fish",
    "meaty-fish"
  ],
  "Chilean Seabass": [
    "fish",
    "rich-fish"
  ],
  "Tuxedo-Crusted Yellowfin Tuna": [
    "fish",
    "tuna"
  ],
  "Rainbow Trout": [
    "fish",
    "delicate-fish"
  ],
  "Market Fish": [
    "fish"
  ],
  "Salt-Cured Halibut": [
    "fish"
  ],
  "Seared Scallops": [
    "shellfish",
    "scallop"
  ],
  "Vegetable Curry with Chickpeas": [
    "vegetable",
    "chickpea",
    "spice"
  ],
  "Bone Marrow": [
    "marrow",
    "rich-fat"
  ],
  "Escargot": [
    "snail",
    "butter",
    "herb"
  ],
  "Prime Tartare": [
    "raw-beef"
  ],
  "Brussels and Belly": [
    "pork",
    "pork-belly",
    "sweet-glaze"
  ],
  "Crab Cake": [
    "shellfish",
    "crab"
  ],
  "Shrimp Cocktail": [
    "shellfish",
    "shrimp"
  ],
  "Burrata": [
    "cheese",
    "fresh-cheese",
    "tomato"
  ],
  "Seafood Tower": [
    "shellfish",
    "mixed-shellfish"
  ],
  "French Onion": [
    "onion",
    "cheese",
    "broth",
    "bread"
  ],
  "Mushroom Bisque": [
    "mushroom",
    "cream"
  ],
  "Gumbo": [
    "stew",
    "spice",
    "sausage"
  ],
  "Shrimp Bisque": [
    "shellfish",
    "shrimp",
    "cream"
  ],
  "Loaded Potato": [
    "potato",
    "cream",
    "bacon"
  ],
  "Clam Chowder": [
    "shellfish",
    "clam",
    "potato",
    "cream"
  ],
  "Tomato Basil": [
    "tomato",
    "herb",
    "bright-acid"
  ],
  "Butternut Squash": [
    "squash",
    "sweet",
    "cream"
  ],
  "Seasonal Soup": [
    "soup"
  ],
  "Creamy Potato": [
    "potato",
    "cream"
  ],
  "Broccoli Cheddar": [
    "broccoli",
    "cheese",
    "cream"
  ],
  "Roasted Red Pepper Chickpea": [
    "pepper",
    "chickpea",
    "spice"
  ],
  "Grilled Caesar": [
    "lettuce",
    "romaine",
    "cheese",
    "anchovy"
  ],
  "House Wedge": [
    "lettuce",
    "iceberg",
    "cheese",
    "bacon"
  ],
  "Au Gratin Potatoes": [
    "potato",
    "cheese",
    "cream"
  ],
  "Creamed Spinach": [
    "spinach",
    "cream"
  ],
  "Lobster Mac": [
    "shellfish",
    "lobster",
    "cheese",
    "pasta",
    "cream"
  ],
  "Asparagus": [
    "green-veg",
    "asparagus"
  ],
  "Broccolini": [
    "green-veg",
    "broccoli"
  ],
  "Sauteed Garlic Spinach": [
    "spinach",
    "garlic"
  ],
  "Honey Roasted Carrots": [
    "carrot",
    "sweet"
  ],
  "Seasonal Vegetables": [
    "vegetable",
    "green-veg"
  ],
  "Truffle Fries": [
    "potato",
    "cheese",
    "truffle"
  ],
  "Mushrooms": [
    "mushroom"
  ],
  "Chocolate Cake": [
    "chocolate",
    "sweet"
  ],
  "Chocolate Brownie": [
    "chocolate",
    "sweet"
  ],
  "Peanut Butter Brownie": [
    "chocolate",
    "peanut",
    "sweet"
  ],
  "Mocha Creme": [
    "chocolate",
    "coffee",
    "cream",
    "sweet"
  ],
  "Creme Brulee": [
    "custard",
    "sweet"
  ],
  "Cheesecake": [
    "sweet",
    "custard"
  ],
  "Beignets": [
    "pastry",
    "sweet"
  ],
  "Carrot Cake": [
    "carrot",
    "sweet",
    "spice"
  ]
};

const DUPLICATION_RULES = {
  "shellfish": {
    "severity": "severe",
    "label": "shellfish"
  },
  "beef": {
    "severity": "severe",
    "label": "beef"
  },
  "fish": {
    "severity": "severe",
    "label": "fish"
  },
  "chicken": {
    "severity": "severe",
    "label": "chicken"
  },
  "pork": {
    "severity": "severe",
    "label": "pork"
  },
  "snail": {
    "severity": "severe",
    "label": "snail"
  },
  "potato": {
    "severity": "severe",
    "label": "potato"
  },
  "pasta": {
    "severity": "severe",
    "label": "pasta"
  },
  "cheese": {
    "severity": "severe",
    "label": "cheese"
  },
  "mushroom": {
    "severity": "severe",
    "label": "mushroom"
  },
  "tomato": {
    "severity": "severe",
    "label": "tomato"
  },
  "spinach": {
    "severity": "severe",
    "label": "spinach"
  },
  "broccoli": {
    "severity": "severe",
    "label": "broccoli"
  },
  "carrot": {
    "severity": "severe",
    "label": "carrot"
  },
  "lettuce": {
    "severity": "severe",
    "label": "lettuce-base salad"
  },
  "chocolate": {
    "severity": "severe",
    "label": "chocolate"
  },
  "cream": {
    "severity": "warn",
    "label": "cream"
  },
  "sweet": {
    "severity": "warn",
    "label": "sweetness"
  }
};

const FOOD_REGISTER = {
  "Filet Mignon": "rich-protein",
  "Bone-In Filet": "rich-protein",
  "Kansas City": "rich-protein",
  "Cowboy Ribeye": "rich-protein",
  "The Tomahawk": "rich-protein",
  "Porterhouse": "rich-protein",
  "Roast Half Chicken": "rich-protein",
  "Faroe Island Salmon": "rich-protein",
  "Swordfish": "rich-protein",
  "Chilean Seabass": "rich-protein",
  "Tuxedo-Crusted Yellowfin Tuna": "delicate",
  "Rainbow Trout": "delicate",
  "Market Fish": "delicate",
  "Salt-Cured Halibut": "delicate",
  "Seared Scallops": "rich-protein",
  "Vegetable Curry with Chickpeas": "spice-warmth",
  "Bone Marrow": "rich-protein",
  "Escargot": "umami-savory",
  "Prime Tartare": "umami-savory",
  "Brussels and Belly": "rich-protein",
  "Crab Cake": "delicate",
  "Shrimp Cocktail": "bright-acid",
  "Burrata": "delicate",
  "Seafood Tower": "bright-acid",
  "French Onion": "umami-savory",
  "Mushroom Bisque": "umami-savory",
  "Gumbo": "spice-warmth",
  "Shrimp Bisque": "rich-cream",
  "Loaded Potato": "rich-cream",
  "Clam Chowder": "rich-cream",
  "Tomato Basil": "bright-acid",
  "Butternut Squash": "sweet",
  "Seasonal Soup": "neutral",
  "Creamy Potato": "rich-cream",
  "Broccoli Cheddar": "rich-cream",
  "Roasted Red Pepper Chickpea": "spice-warmth",
  "Grilled Caesar": "umami-savory",
  "House Wedge": "umami-savory",
  "Au Gratin Potatoes": "rich-cream",
  "Creamed Spinach": "rich-cream",
  "Lobster Mac": "rich-cream",
  "Asparagus": "bright-acid",
  "Broccolini": "bright-acid",
  "Sauteed Garlic Spinach": "bright-acid",
  "Honey Roasted Carrots": "sweet",
  "Seasonal Vegetables": "neutral",
  "Truffle Fries": "umami-savory",
  "Mushrooms": "umami-savory",
  "Chocolate Cake": "sweet",
  "Chocolate Brownie": "sweet",
  "Peanut Butter Brownie": "sweet",
  "Mocha Creme": "sweet",
  "Creme Brulee": "sweet",
  "Cheesecake": "sweet",
  "Beignets": "sweet",
  "Carrot Cake": "sweet"
};

const PATTERN_VARIANTS = {
  "cream-doubling": [
    "both cream-forward, the meal goes heavy on the table",
    "cream stacked on cream, the plate reads dense across the meal",
    "two cream-rounded courses share the meal — the weight piles on",
    "both lean into dairy, the table loses contrast",
    "the meal doubles the cream, neither course gets to play off the other"
  ],
  "umami-stack": [
    "both umami-savory, the meal builds with depth",
    "savory-on-savory, the table reads dense and earnest",
    "both pull from the umami register, the contrast sits flat",
    "the meal stacks savory weight, the courses share register without lift",
    "both build on umami, the plate carries weight without contrast"
  ],
  "protein-stack": [
    "both substantial, the table reads weighty",
    "two protein-led plates, the meal carries serious weight",
    "protein on protein, the table holds register without softening",
    "both weighty on the plate, the meal sits heavy without contrast",
    "two substantial courses, the table loses its lighter notes"
  ],
  "bright-stack": [
    "both bright, the meal stays light and clean",
    "two bright registers, the table reads fresh across the courses",
    "both pull from the bright side, the meal carries air through to the close",
    "both crisp and clean, the table reads light from open to handoff",
    "two acid-forward courses, the meal stays unburdened"
  ],
  "sweet-stack": [
    "both sweet, the close goes saccharine",
    "sugar on sugar, the close reads heavy with sweetness",
    "two sweets stacked, the close loses dimension",
    "both desserts pull the same lever, the table doubles the sugar",
    "two sweet closes, the meal piles sugar without contrast"
  ],
  "delicate-stack": [
    "both delicate, the meal stays composed",
    "two restrained courses, the table reads quiet across the meal",
    "both light on the plate, the meal carries air without filler",
    "two delicate calls, the meal builds without heaviness",
    "both pulled-back, the table holds composure across the courses"
  ],
  "spice-stack": [
    "both spice-forward, the meal builds heat",
    "two spiced courses, the table reads hot across the meal",
    "both lean spicy, the heat compounds without relief",
    "both pull spice as the headline, the meal loses the cooler register",
    "two heat-forward plates, the table doubles the warmth"
  ],
  "register-match": [
    "same register, the meal carries cleanly",
    "matched in tone, the courses build without friction",
    "register-aligned, the meal reads composed across the courses",
    "same key throughout, the table carries clean"
  ],
  "bright-cuts-rich": [
    "the bright cuts the rich cleanly",
    "acid lifts the richness, the meal gets the contrast it needs",
    "bright-acid breaks the weight, the plate finds its lift",
    "the bright register cleaves the heavy course, the table breathes",
    "acid plays against richness, the contrast holds across the courses"
  ],
  "bright-cuts-umami": [
    "the bright cuts the savory weight",
    "acid lifts the umami, the meal carries lift without losing depth",
    "the bright register pulls against the savory, the contrast lands",
    "acid breaks the umami stack, the table earns the brighter note"
  ],
  "bright-meets-sweet": [
    "bright meets sweet, the contrast stays light",
    "acid plays against sweetness, the close stays unburdened",
    "the bright register lifts the sweet, the meal closes clean",
    "acid and sugar share the table, neither course pulls heavy"
  ],
  "bright-cuts-spice": [
    "the bright cuts through the spice cleanly",
    "acid breaks the heat, the meal earns relief from the spice",
    "bright-acid lifts the spiced course, the contrast settles the table",
    "acid plays against warmth, the meal carries the cooler note through"
  ],
  "bright-with-delicate": [
    "both light, the meal stays composed",
    "two restrained registers, the table reads air across the courses",
    "bright and delicate share air, the meal carries lift without weight",
    "both pulled back, the table reads composed and open"
  ],
  "cream-meets-sweet": [
    "rich cream gives way to sweet, the close lands generously",
    "the cream rounds into the sweet close, the meal lands rich and full",
    "cream-and-sugar build the close, the meal finishes generous",
    "rich dairy yields to dessert weight, the close composes thickly"
  ],
  "savory-meets-sweet": [
    "savory gives way to sweet, the close lands cleanly",
    "the savory course resolves into sugar, the meal closes with contrast",
    "protein hands off to dessert, the close builds without conflict",
    "savory-into-sweet, the classic close lands intact",
    "the entree yields to the dessert, the meal arc reads on-key"
  ],
  "sweet-meets-savory": [
    "sweet contrast lifts the savory",
    "sugar plays against the savory weight, the table earns its lift",
    "the sweet register lifts the umami, the contrast holds without crowding",
    "sugar and umami share the table, the contrast carries the meal"
  ],
  "sweet-meets-spice": [
    "sweet meets spice, the contrast holds",
    "sugar plays against the heat, the table reads round across the courses",
    "sweetness lifts the spice, the contrast settles the meal",
    "sweet and warmth share the table, the contrast earns its place"
  ],
  "delicate-meets-bold": [
    "the delicate plate gives way to bold, the table builds register",
    "restrained yields to weighty, the meal arcs from light to full",
    "the delicate course primes the bold, the table builds clean",
    "delicate-into-bold, the meal earns its register lift, the courses arc cleanly"
  ],
  "delicate-meets-rich": [
    "the delicate plate yields to rich, the meal builds",
    "restrained yields to cream, the table arcs cleanly",
    "the lighter course primes the richer, the meal carries register lift",
    "delicate gives way to rich, the table earns its weight"
  ],
  "delicate-meets-savory": [
    "delicate yields to savory weight cleanly",
    "the delicate course primes the savory, the table builds register",
    "restrained gives way to umami, the meal earns its weight",
    "the lighter plate hands off to the savory, the table arcs clean"
  ],
  "delicate-meets-sweet": [
    "delicate gives way to sweet, the close lands light",
    "the delicate course resolves into the close, the meal stays unburdened",
    "restrained meets sugar, the close composes light",
    "the lighter course hands off to dessert, the meal closes clean"
  ],
  "delicate-with-spice": [
    "spice plays against the delicate, the contrast holds",
    "heat lifts the restrained, the table earns the warmer note",
    "spice and delicate share the table, the contrast settles cleanly",
    "the delicate course meets the spiced, the table reads bright across the meal"
  ],
  "rich-with-rich": [
    "cream meets protein, the meal builds with weight",
    "two rich courses on the same plate, the table earns its substance",
    "cream and protein share the meal, the build reads full",
    "the meal layers rich on rich, the table carries weight cleanly when the registers match",
    "cream rounds the protein, the plate composes thick"
  ],
  "cream-meets-umami": [
    "cream meets umami, the table goes deep",
    "cream rounds the savory, the meal earns its depth",
    "dairy plays against umami, the table reads layered",
    "cream and umami share the plate, the build reads dense and clean"
  ],
  "cream-meets-spice": [
    "spice cuts cream cleanly, the contrast holds",
    "heat plays against dairy, the meal earns the cooler register",
    "spice and cream share the table, the contrast settles round",
    "the spiced course breaks the cream, the table reads balanced"
  ],
  "spice-meets-rich": [
    "spice plays against rich protein, clean contrast",
    "heat lifts the rich course, the table earns the warmer note",
    "spice and substance share the plate, the contrast settles the meal",
    "the spiced register breaks the weight, the table reads round"
  ],
  "protein-with-umami": [
    "protein meets umami, the table builds substance",
    "the savory course rounds the protein, the meal reads layered",
    "umami plays against the protein, the table earns its depth",
    "protein and umami share the plate, the build reads weighty and clean"
  ],
  "neutral": [
    "a clean call, no friction either way",
    "the courses share the meal without conflict",
    "neither course pulls focus, the table reads even",
    "a quiet call, the meal carries without strain"
  ],
  "cross-register": [
    "different registers compose without clash",
    "the courses pull from different keys but share the table cleanly",
    "two registers in contrast, the meal earns its shape",
    "separate registers share the plate, the contrast settles the build"
  ]
};

function pickVariant(kind, foodA, foodB) {
  const variants = PATTERN_VARIANTS[kind];
  if (!variants || !variants.length) return null;
  const sig = (foodA.name || foodA) + '|' + (foodB.name || foodB) + '|' + kind;
  const h = _crypto.createHash('md5').update(sig).digest();
  return variants[h.readUInt32BE(0) % variants.length];
}

function duplicationKindFor(foodA, foodB) {
  const tagsA = INGREDIENT_TAGS[foodA.name];
  const tagsB = INGREDIENT_TAGS[foodB.name];
  if (!tagsA || !tagsB) return null;
  let best = null;
  for (const tag of tagsA) {
    if (!tagsB.includes(tag)) continue;
    const rule = DUPLICATION_RULES[tag];
    if (!rule) continue;
    if (!best || (best.severity === 'warn' && rule.severity === 'severe')) {
      best = { tag: tag, severity: rule.severity, label: rule.label };
    }
  }
  return best;
}

function flavorPattern(foodA, foodB) {
  const ra = FOOD_REGISTER[foodA.name];
  const rb = FOOD_REGISTER[foodB.name];
  if (!ra || !rb) return null;
  let kind = null;
  if (ra === rb) {
    if (ra === 'rich-cream')        kind = 'cream-doubling';
    else if (ra === 'umami-savory') kind = 'umami-stack';
    else if (ra === 'rich-protein') kind = 'protein-stack';
    else if (ra === 'bright-acid')  kind = 'bright-stack';
    else if (ra === 'sweet')        kind = 'sweet-stack';
    else if (ra === 'delicate')     kind = 'delicate-stack';
    else if (ra === 'spice-warmth') kind = 'spice-stack';
    else                            kind = 'register-match';
  } else {
    const pair = [ra, rb].sort().join('+');
    if      (pair === 'bright-acid+rich-cream')    kind = 'bright-cuts-rich';
    else if (pair === 'bright-acid+rich-protein')  kind = 'bright-cuts-rich';
    else if (pair === 'bright-acid+umami-savory')  kind = 'bright-cuts-umami';
    else if (pair === 'bright-acid+sweet')         kind = 'bright-meets-sweet';
    else if (pair === 'bright-acid+spice-warmth')  kind = 'bright-cuts-spice';
    else if (pair === 'bright-acid+delicate')      kind = 'bright-with-delicate';
    else if (pair === 'rich-cream+sweet')          kind = 'cream-meets-sweet';
    else if (pair === 'rich-protein+sweet')        kind = 'savory-meets-sweet';
    else if (pair === 'sweet+umami-savory')        kind = 'sweet-meets-savory';
    else if (pair === 'sweet+spice-warmth')        kind = 'sweet-meets-spice';
    else if (pair === 'delicate+rich-protein')     kind = 'delicate-meets-bold';
    else if (pair === 'delicate+rich-cream')       kind = 'delicate-meets-rich';
    else if (pair === 'delicate+umami-savory')     kind = 'delicate-meets-savory';
    else if (pair === 'delicate+sweet')            kind = 'delicate-meets-sweet';
    else if (pair === 'delicate+spice-warmth')     kind = 'delicate-with-spice';
    else if (pair === 'rich-cream+rich-protein')   kind = 'rich-with-rich';
    else if (pair === 'rich-cream+umami-savory')   kind = 'cream-meets-umami';
    else if (pair === 'rich-cream+spice-warmth')   kind = 'cream-meets-spice';
    else if (pair === 'rich-protein+spice-warmth') kind = 'spice-meets-rich';
    else if (pair === 'rich-protein+umami-savory') kind = 'protein-with-umami';
    else if (ra === 'neutral' || rb === 'neutral') kind = 'neutral';
    else                                           kind = 'cross-register';
  }
  const reading = pickVariant(kind, foodA, foodB);
  return { kind: kind, reading: reading };
}

function scanForDuplications(pairingMap) {
  const out = [];
  for (let i = 0; i < pairingMap.length; i++) {
    const a = pairingMap[i];
    if (!INGREDIENT_TAGS[a.name]) continue;
    for (const tier of ['gold', 'excellent', 'strong', 'works']) {
      if (!Array.isArray(a[tier])) continue;
      for (const target of a[tier]) {
        const b = pairingMap.find(function (e) { return e.name === target; });
        if (!b || !INGREDIENT_TAGS[b.name]) continue;
        const dup = duplicationKindFor(a, b);
        if (dup && dup.severity === 'severe') {
          out.push({ a: a.name, b: b.name, currentTier: tier, tag: dup.tag, severity: dup.severity, label: dup.label });
        }
      }
    }
  }
  return out;
}

module.exports = {
  INGREDIENT_TAGS: INGREDIENT_TAGS,
  DUPLICATION_RULES: DUPLICATION_RULES,
  FOOD_REGISTER: FOOD_REGISTER,
  PATTERN_VARIANTS: PATTERN_VARIANTS,
  duplicationKindFor: duplicationKindFor,
  flavorPattern: flavorPattern,
  scanForDuplications: scanForDuplications,
  pickVariant: pickVariant,
};
