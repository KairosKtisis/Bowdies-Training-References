// engine/avoid_reasoning_pool.js  (v2 — archetype-aware)
// Per-pair AVOID reasoning. Replaces monotone "overpowers" with verb + why-clause
// picked deterministically by md5(pair-key). Structure:
//   [drinkClass][foodCategory][archetype] = [{verb, why}]
// Picker mixes archetype-specific entries with cell DEFAULT.
//
// Session 2b: BOURBON_BOLD, ELEGANT_RED seeded
// Session 2c: SWEET_LIQUEUR, GIN, SWEET_WINE, APERITIVO_BITTER added

'use strict';

const crypto = require('crypto');
const { foodArchetypeFor } = require('./food_archetypes');

const AVOID_REASONING_POOL = {
  "BIG_RED": {
    "main": {
      "main-fish-delicate": [
        {
          "verb": "overwhelms",
          "why": "the Cab's tannin and weight obliterate the delicate flesh"
        },
        {
          "verb": "flattens",
          "why": "structured red rolls over the gentle fish profile"
        },
        {
          "verb": "crushes",
          "why": "big-red weight has no business with a delicate-fish main"
        },
        {
          "verb": "jars against",
          "why": "tannin reads metallic on delicate flesh — needs crisp white"
        }
      ],
      "main-fish-rich": [
        {
          "verb": "fights",
          "why": "Cab tannin and oily fish meet without integration — tannin reads metallic"
        },
        {
          "verb": "clashes with",
          "why": "the red's structure overpowers the rich flesh's natural fat"
        },
        {
          "verb": "overwhelms",
          "why": "big red weight buries the salmon's register instead of carrying it"
        },
        {
          "verb": "jars against",
          "why": "no acid to cut the rich flesh — tannin doubles the weight wrong"
        }
      ],
      "main-fish-crusted": [
        {
          "verb": "fights",
          "why": "Cab structure clashes with the rare-seared crust's mineral edge"
        },
        {
          "verb": "overwhelms",
          "why": "the red's tannin obliterates the rare flesh's sharp profile"
        },
        {
          "verb": "jars against",
          "why": "big-red weight has no foil against the protein's clean sear"
        },
        {
          "verb": "flattens",
          "why": "tannin rolls over the crust without complement"
        }
      ],
      "main-poultry": [
        {
          "verb": "overwhelms",
          "why": "Cab weight buries the chicken's mild herbed-skin frame"
        },
        {
          "verb": "overshadows",
          "why": "structured red crowds the bird's gentle savory without complement"
        },
        {
          "verb": "crushes",
          "why": "needs a softer call — big red is wrong direction for poultry"
        },
        {
          "verb": "fights",
          "why": "the Cab's tannin doesn't bridge into the roast's mild profile"
        }
      ],
      "DEFAULT": [
        {
          "verb": "overwhelms",
          "why": "big red is built for red meat — wrong register for this main"
        },
        {
          "verb": "flattens",
          "why": "Cab structure crowds the protein without integration"
        },
        {
          "verb": "fights",
          "why": "the red's tannin and the main course refuse each other"
        },
        {
          "verb": "jars against",
          "why": "wrong-course energy — big red belongs with the steak headliner"
        }
      ]
    },
    "starter": {
      "starter-shellfish": [
        {
          "verb": "overwhelms",
          "why": "Cab tannin obliterates the delicate shellfish — needs crisp acidity"
        },
        {
          "verb": "crushes",
          "why": "big-red weight buries the clean briny opener"
        },
        {
          "verb": "jars against",
          "why": "tannin reads metallic on clean shellfish flesh"
        },
        {
          "verb": "flattens",
          "why": "structured red has no bridge into the shellfish's clean profile"
        }
      ],
      "starter-dairy": [
        {
          "verb": "fights",
          "why": "Cab tannin and fresh cream refuse each other — tannin reads metallic"
        },
        {
          "verb": "crushes",
          "why": "big-red weight obliterates the milky cheese plate's delicate frame"
        },
        {
          "verb": "clashes with",
          "why": "structured red has no foil against fresh dairy — needs structural acid"
        },
        {
          "verb": "overwhelms",
          "why": "Cab register buries the burrata's clean dairy lift"
        }
      ],
      "starter-meat": [
        {
          "verb": "overshadows",
          "why": "big red is built for headline cuts — overshoots the opening course"
        },
        {
          "verb": "jars against",
          "why": "Cab structure crowds the iron-savory starter without integration"
        },
        {
          "verb": "fights",
          "why": "red tannin and the meat starter compound rather than balance"
        },
        {
          "verb": "clashes with",
          "why": "wrong-course energy — save the big red for the steak"
        }
      ],
      "starter-herb": [
        {
          "verb": "overwhelms",
          "why": "big red rolls over the herb-bright opener"
        },
        {
          "verb": "flattens",
          "why": "Cab weight buries the dish's garlic-herb lift"
        },
        {
          "verb": "jars against",
          "why": "structured red overshadows the herbal complexity — no contrast"
        },
        {
          "verb": "crushes",
          "why": "red tannin clashes with the bright herbal profile"
        }
      ],
      "DEFAULT": [
        {
          "verb": "overwhelms",
          "why": "big red is wrong-course energy for the table's opener"
        },
        {
          "verb": "crushes",
          "why": "Cab weight crowds the starter's lighter register"
        },
        {
          "verb": "flattens",
          "why": "structured red has no bridge into the opening course's clean profile"
        },
        {
          "verb": "jars against",
          "why": "the red's tannin reads heavy against the starter's frame"
        }
      ]
    },
    "soup-salad": {
      "soup-salad-cream": [
        {
          "verb": "fights",
          "why": "Cab tannin and dairy cream refuse each other — tannin reads metallic"
        },
        {
          "verb": "crushes",
          "why": "big-red weight doubles the soup's density without lift"
        },
        {
          "verb": "clashes with",
          "why": "structured red has no acid to bridge into the cream"
        },
        {
          "verb": "overwhelms",
          "why": "Cab register buries the soup's creamy base instead of carrying it"
        }
      ],
      "soup-salad-broth": [
        {
          "verb": "fights",
          "why": "Cab weight and the broth's salt-and-spice base refuse each other"
        },
        {
          "verb": "overwhelms",
          "why": "big-red structure flattens the broth's clean lift"
        },
        {
          "verb": "clashes with",
          "why": "tannin has no foil against the savory broth — needs lighter pour"
        },
        {
          "verb": "jars against",
          "why": "structured red crowds the broth's register without complement"
        }
      ],
      "soup-salad-greens": [
        {
          "verb": "overwhelms",
          "why": "Cab tannin obliterates the salad's bright edge"
        },
        {
          "verb": "jars against",
          "why": "structured red is wrong for green-vegetable course — tannin reads bitter"
        },
        {
          "verb": "fights",
          "why": "big-red weight clashes with the salad's clean profile"
        },
        {
          "verb": "crushes",
          "why": "tannin reads heavy against the greens' light frame"
        }
      ],
      "DEFAULT": [
        {
          "verb": "overwhelms",
          "why": "big red is wrong moment for the soup-or-salad course"
        },
        {
          "verb": "crushes",
          "why": "Cab weight crowds the opening course without integration"
        },
        {
          "verb": "flattens",
          "why": "structured red flattens the soup-or-salad register"
        },
        {
          "verb": "jars against",
          "why": "red tannin has no bridge into the lighter course's profile"
        }
      ]
    },
    "side": {
      "side-cream": [
        {
          "verb": "fights",
          "why": "Cab tannin and the side's cream refuse each other"
        },
        {
          "verb": "overwhelms",
          "why": "big-red weight doubles the dairy without lift"
        },
        {
          "verb": "jars against",
          "why": "tannin reads metallic against the cream side"
        },
        {
          "verb": "clashes with",
          "why": "structured red has no acid to clean the dairy side"
        }
      ],
      "side-vegetable": [
        {
          "verb": "overwhelms",
          "why": "Cab tannin overshadows the green-vegetal edge"
        },
        {
          "verb": "jars against",
          "why": "big red is wrong for clean vegetable sides — tannin reads bitter"
        },
        {
          "verb": "fights",
          "why": "structured red has no bridge into the side's clean profile"
        },
        {
          "verb": "flattens",
          "why": "Cab weight crowds the vegetable course without lift"
        }
      ],
      "side-glazed": [
        {
          "verb": "fights",
          "why": "Cab tannin clashes with the glaze's sugar — bitter-sweet conflict"
        },
        {
          "verb": "jars against",
          "why": "big-red structure reads off against the glazed side"
        },
        {
          "verb": "overwhelms",
          "why": "tannin obliterates the glaze's sweet edge"
        },
        {
          "verb": "clashes with",
          "why": "red and sugar register refuse each other without bridge"
        }
      ],
      "side-earthy": [
        {
          "verb": "fights",
          "why": "Cab tannin and earthy umami refuse each other — needs softer red"
        },
        {
          "verb": "overwhelms",
          "why": "big-red weight buries the mushroom register"
        },
        {
          "verb": "clashes with",
          "why": "structured red has nothing to meet the side's depth"
        },
        {
          "verb": "jars against",
          "why": "Cab structure crowds the earthy plate instead of carrying it"
        }
      ],
      "side-starch": [
        {
          "verb": "overshadows",
          "why": "big red needs the cut, not the supporting starch plate"
        },
        {
          "verb": "jars against",
          "why": "Cab weight is wrong for a neutral starch frame"
        },
        {
          "verb": "overwhelms",
          "why": "tannin reads heavy against the side's mild profile"
        },
        {
          "verb": "flattens",
          "why": "this is a bottle for the headline, not a starch alongside"
        }
      ],
      "DEFAULT": [
        {
          "verb": "overshadows",
          "why": "big red is wrong for the side course — wants the protein headliner"
        },
        {
          "verb": "jars against",
          "why": "Cab structure is misaligned with the supporting plate"
        },
        {
          "verb": "crushes",
          "why": "tannin crowds the side without complement"
        },
        {
          "verb": "overwhelms",
          "why": "structured red overshadows the lighter course"
        }
      ]
    },
    "dessert": {
      "dessert-chocolate": [
        {
          "verb": "fights",
          "why": "Cab tannin and chocolate sugar refuse each other — bitter-sweet conflict"
        },
        {
          "verb": "jars against",
          "why": "big-red weight has no bridge into chocolate's lift — needs Port or amaro"
        },
        {
          "verb": "clashes with",
          "why": "tannin reads bitter against the chocolate's sweetness"
        },
        {
          "verb": "overwhelms",
          "why": "structured red overpowers the dessert's delicate cocoa frame"
        }
      ],
      "dessert-custard": [
        {
          "verb": "fights",
          "why": "Cab tannin clashes with the custard's tang — no bridge"
        },
        {
          "verb": "jars against",
          "why": "big-red weight is wrong moment for the custard's silk"
        },
        {
          "verb": "overwhelms",
          "why": "structured red obliterates the gentle vanilla frame"
        },
        {
          "verb": "clashes with",
          "why": "tannin reads metallic against the dairy custard"
        }
      ],
      "dessert-cake-spice": [
        {
          "verb": "fights",
          "why": "Cab tannin clashes with the cream-cheese-and-cinnamon register"
        },
        {
          "verb": "jars against",
          "why": "big-red weight is wrong direction for the cake's warm spice"
        },
        {
          "verb": "overwhelms",
          "why": "structured red obliterates the cake's delicate spice frame"
        },
        {
          "verb": "clashes with",
          "why": "tannin reads bitter against the cream-cheese frosting"
        }
      ],
      "dessert-pastry": [
        {
          "verb": "fights",
          "why": "Cab tannin clashes with warm-pastry sugar — bitter-sweet conflict"
        },
        {
          "verb": "jars against",
          "why": "big-red weight has no foil against the dessert's lightness"
        },
        {
          "verb": "overwhelms",
          "why": "structured red overshadows the warm-pastry delicacy"
        },
        {
          "verb": "clashes with",
          "why": "tannin and fried-sugar dessert refuse each other"
        }
      ],
      "DEFAULT": [
        {
          "verb": "jars against",
          "why": "big red is wrong-course energy for the dessert close"
        },
        {
          "verb": "fights",
          "why": "Cab tannin has no bridge into dessert sweetness"
        },
        {
          "verb": "clashes with",
          "why": "structured red and dessert register refuse each other"
        },
        {
          "verb": "overwhelms",
          "why": "tannin reads bitter against the dessert's sugar"
        }
      ]
    },
    "steak": {
      "steak-big": [
        {
          "verb": "underclubs",
          "why": "this red's register is right but the bottle reads short of the long-bone cut"
        },
        {
          "verb": "falls short of",
          "why": "this expression doesn't carry the 26+ ounce cut — needs a bigger Cab"
        },
        {
          "verb": "reads light against",
          "why": "the cut overshadows the bottle's frame — needs more weight"
        },
        {
          "verb": "mis-pairs with",
          "why": "big red but underweight — the headline cut deserves a heavier pour"
        }
      ],
      "steak-medium": [
        {
          "verb": "mis-pairs with",
          "why": "the bottle's tannin profile is wrong direction for the marbled mid-cut"
        },
        {
          "verb": "jars against",
          "why": "big-red character reads off against the strip-and-bone register"
        },
        {
          "verb": "underclubs",
          "why": "needs a bigger Cab at full register for this cut"
        },
        {
          "verb": "falls short of",
          "why": "the bottle is capable but doesn't fully meet the mid-cut weight"
        }
      ],
      "steak-lean": [
        {
          "verb": "overwhelms",
          "why": "big-red tannin crowds the filet's lean buttery frame — needs softer call"
        },
        {
          "verb": "crushes",
          "why": "Cab structure buries the cut's gentle tenderness"
        },
        {
          "verb": "jars against",
          "why": "tannin reads heavy against the lean cut's subtle profile"
        },
        {
          "verb": "fights",
          "why": "big-red weight overshadows the tenderloin's delicate finish"
        }
      ],
      "DEFAULT": [
        {
          "verb": "mis-pairs with",
          "why": "big red is wrong direction for this steak course"
        },
        {
          "verb": "underclubs",
          "why": "the bottle reads short of the cut's headline weight"
        },
        {
          "verb": "jars against",
          "why": "Cab character is misaligned with the protein's frame"
        },
        {
          "verb": "overshadows",
          "why": "tannin and the cut refuse each other without integration"
        }
      ]
    }
  },
  "APERITIVO_BITTER": {
    "main": {
      "main-fish-delicate": [
        { verb: "overwhelms", why: "bitter herbs flatten delicate fish — the protein can't lift the amaro's register" },
        { verb: "clashes with", why: "aperitivo bitterness fights gentle flesh without a bridge" },
        { verb: "cuts wrong against", why: "the bitter-aperitivo edge flattens the clean flesh instead of carrying it" },
        { verb: "cuts wrong against", why: "aperitivo weight has no bridge into the gentle fish profile" },
        { verb: "scorches", why: "the bitter-aperitivo edge flattens the clean flesh instead of carrying it" },
      ],
      "main-fish-rich": [
        { verb: "jars against", why: "bitter herbs on oily fish read metallic — the rich flesh deserves a crisp white" },
        { verb: "clashes with", why: "aperitivo weight and oily fish meet without integration — density on density" },
        { verb: "cuts wrong against", why: "no acid to cut the rich flesh — the spirit just compounds the weight" },
        { verb: "fights", why: "the bitter-aperitivo edge doubles the natural richness without contrast" },
      ],
      "main-fish-crusted": [
        { verb: "clashes with", why: "bitter botanicals fight the savory sear — bitter against char without resolution" },
        { verb: "scorches", why: "the aperitivo register clashes with the rare flesh's mineral edge" },
        { verb: "scorches", why: "spirit depth crowds the crust's sharp profile" },
        { verb: "jars against", why: "spirit depth crowds the crust's sharp profile" },
      ],
      "main-poultry": [
        { verb: "overwhelms", why: "amaro bitterness buries the chicken's mild herbed-skin frame" },
        { verb: "jars against", why: "the bitter-aperitivo edge buries the bird's gentle savory register" },
        { verb: "cuts wrong against", why: "the bitter-aperitivo edge buries the bird's gentle savory register" },
        { verb: "jars against", why: "the bitter-aperitivo edge crowds the chicken's mild frame without complement" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "bitter aperitivo is for before or after the meal — not on a main protein" },
        { verb: "scorches", why: "the bitter-aperitivo edge reads wrong against the main course's register" },
        { verb: "cuts wrong against", why: "the aperitivo weight is misaligned with the protein's profile" },
        { verb: "fights", why: "the bitter-aperitivo edge reads wrong against the main course's register" },
      ],
    },
    "side": {
      "side-cream": [
        { verb: "clashes with", why: "amaro bitterness on dairy reads metallic — needs warmth or sweetness to balance" },
        { verb: "cuts wrong against", why: "the bitter-aperitivo edge compounds the cream side without structural cut" },
        { verb: "jars against", why: "the bitter-aperitivo edge compounds the cream side without structural cut" },
        { verb: "jars against", why: "the bitter-aperitivo edge meets dairy richness with no contrast" },
      ],
      "side-vegetable": [
        { verb: "doubles down on", why: "bitter herbs and a green vegetable side compound the same register — no contrast" },
        { verb: "clashes with", why: "the bitter-aperitivo edge overshadows the green-vegetal edge" },
        { verb: "jars against", why: "no bridge into the side's clean profile — spirit weight crowds" },
        { verb: "fights", why: "the bitter-aperitivo edge overshadows the green-vegetal edge" },
      ],
      "side-glazed": [
        { verb: "fights", why: "aperitivo bitterness and the glaze's sugar refuse each other — bitter wins, dessert reads cloying" },
        { verb: "scorches", why: "spirit warmth on glaze reads cloying — needs acidity" },
        { verb: "cuts wrong against", why: "the bitter-aperitivo edge reads heavy on the glazed side without complement" },
        { verb: "clashes with", why: "the aperitivo oak and the side's sugar register compound — no lift" },
      ],
      "side-earthy": [
        { verb: "overshadows", why: "amaro's bitter herbs crowd the mushroom's umami without complement" },
        { verb: "scorches", why: "the aperitivo register has nothing to meet the side's depth" },
        { verb: "clashes with", why: "the bitter-aperitivo edge crowds the mushroom register instead of carrying it" },
        { verb: "clashes with", why: "the bitter-aperitivo edge fights the earthy umami without bridge" },
      ],
      "side-starch": [
        { verb: "clashes with", why: "bitter botanicals on the truffle-fry register fight the warm-savory side" },
        { verb: "fights", why: "the aperitivo needs the cut, not the supporting starch plate" },
        { verb: "jars against", why: "aperitivo register reads heavy against the side's mild profile" },
        { verb: "jars against", why: "the aperitivo needs the cut, not the supporting starch plate" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "bitter aperitivo on the supporting side reads as wrong register for the course" },
        { verb: "fights", why: "the aperitivo weight is misaligned with the side's lighter register" },
        { verb: "fights", why: "aperitivo crowds the supporting course without lift" },
        { verb: "scorches", why: "aperitivo crowds the supporting course without lift" },
      ],
    },
    "soup-salad": {
      "soup-salad-cream": [
        { verb: "clashes with", why: "amaro bitterness on dairy cream reads metallic — no bridge from herbal sharp to soft fat" },
        { verb: "fights", why: "bitter herbs cut the bisque's round cream without lifting it" },
        { verb: "cuts wrong against", why: "the aperitivo weight doubles the soup's density instead of lifting" },
        { verb: "scorches", why: "the aperitivo weight doubles the soup's density instead of lifting" },
        { verb: "scorches", why: "spirit warmth and cream pull the same direction without bridge" },
      ],
      "soup-salad-broth": [
        { verb: "jars against", why: "bitter botanicals on savory broth pull against the salt-and-spice frame without resolving" },
        { verb: "scorches", why: "spirit register crowds the clean broth without integration" },
        { verb: "fights", why: "spirit register crowds the clean broth without integration" },
        { verb: "scorches", why: "aperitivo has no acid to balance the broth's savory base" },
      ],
      "soup-salad-greens": [
        { verb: "doubles down on", why: "aperitivo bitterness and the salad's green edge compound the bitter register" },
        { verb: "jars against", why: "aperitivo has no acid foil against the salad's clean profile" },
        { verb: "scorches", why: "the bitter-aperitivo edge crowds the greens' bright edge without bridge" },
        { verb: "jars against", why: "the bitter-aperitivo edge reads heavy against the salad's light frame" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "bitter aperitivo crowds the soup-salad course without complement" },
        { verb: "fights", why: "aperitivo crowds the opening course without complement" },
        { verb: "cuts wrong against", why: "aperitivo crowds the opening course without complement" },
        { verb: "scorches", why: "the aperitivo weight is wrong moment for the course" },
      ],
    },
    "starter": {
      "starter-shellfish": [
        { verb: "overwhelms", why: "amaro bitterness on cold shellfish flattens the delicate brine — needs sparkling instead" },
        { verb: "cuts wrong against", why: "the aperitivo register flattens the briny opener instead of lifting it" },
        { verb: "clashes with", why: "the bitter-aperitivo edge crowds the brine without acid to bridge" },
        { verb: "cuts wrong against", why: "the bitter-aperitivo edge buries the clean shellfish profile without complement" },
      ],
      "starter-dairy": [
        { verb: "fights", why: "bitter herbs and fresh dairy refuse each other — the milky plate reads sour back" },
        { verb: "clashes with", why: "aperitivo has no foil against fresh cream — needs structural cut" },
        { verb: "scorches", why: "the aperitivo weight buries the milky cheese plate's delicate frame" },
        { verb: "clashes with", why: "the bitter-aperitivo edge curdles against fresh dairy without structural acid" },
      ],
      "starter-meat": [
        { verb: "mis-pairs with", why: "this bitter's register fights the rich meat starter — needs warmth or fat, not herbs" },
        { verb: "scorches", why: "spirit weight crowds the iron-savory starter without integration" },
        { verb: "jars against", why: "the aperitivo is capable but the rich meat starter deserves a more decisive call" },
        { verb: "cuts wrong against", why: "this expression doesn't carry the meat opener — a bigger pour earns it" },
      ],
      "starter-herb": [
        { verb: "doubles down on", why: "aperitivo herbs and a herb-bright opener compound the bitter register — no contrast" },
        { verb: "jars against", why: "spirit register overshadows the herbal complexity — no contrast" },
        { verb: "cuts wrong against", why: "the bitter-aperitivo edge rolls over the herb-bright opener" },
        { verb: "clashes with", why: "the aperitivo weight buries the dish's garlic-herb lift" },
      ],
      "DEFAULT": [
        { verb: "overwhelms", why: "bitter aperitivo flattens the opener's lighter register" },
        { verb: "cuts wrong against", why: "the bitter-aperitivo edge reads wrong-course for the table's opener" },
        { verb: "fights", why: "the bitter-aperitivo edge reads wrong-course for the table's opener" },
        { verb: "scorches", why: "the bitter-aperitivo edge reads wrong-course for the table's opener" },
      ],
    },
    "steak": {
      "steak-big": [
        { verb: "clashes with", why: "aperitivo bitterness fights the headline cut's marbled char — bitter and savory pull apart" },
        { verb: "underclubs", why: "amaro reads light against the marbled char — the cut deserves wine or whiskey weight" },
        { verb: "cuts wrong against", why: "the aperitivo register is right but this bottle reads short of the long-bone cut" },
        { verb: "jars against", why: "this expression doesn't carry the 26+ ounce cut — a bigger pour earns it" },
        { verb: "fights", why: "this expression doesn't carry the 26+ ounce cut — a bigger pour earns it" },
      ],
      "steak-medium": [
        { verb: "mis-pairs with", why: "bitter botanicals on the cut fight the savory char without payoff" },
        { verb: "fights", why: "the bottle's character is wrong direction for the mid-cut weight" },
        { verb: "jars against", why: "the bitter-aperitivo edge reads off against the marbled mid-cut" },
        { verb: "clashes with", why: "the bitter-aperitivo edge fights the strip-and-bone register" },
      ],
      "steak-lean": [
        { verb: "overwhelms", why: "amaro bitterness flattens the lean cut's buttery delicacy" },
        { verb: "fights", why: "spirit weight overshadows the lean cut's subtle profile" },
        { verb: "scorches", why: "spirit weight overshadows the lean cut's subtle profile" },
        { verb: "cuts wrong against", why: "the aperitivo register buries the cut's gentle tenderness" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "bitter aperitivo belongs before or after the meal, not alongside the steak" },
        { verb: "jars against", why: "the bitter-aperitivo edge reads wrong for the steak course" },
        { verb: "fights", why: "the aperitivo character is misaligned with the protein's weight" },
        { verb: "cuts wrong against", why: "the aperitivo character is misaligned with the protein's weight" },
      ],
    },
  },
  "BOURBON_BOLD": {
    "dessert": {
      "dessert-chocolate": [
        { verb: "flattens", why: "the whiskey's heat dulls the chocolate's lift instead of carrying it" },
        { verb: "clashes with", why: "cask-aged oak doubles the cocoa weight without lift" },
        { verb: "overwhelms", why: "the whiskey heat dulls the chocolate's lift instead of carrying it" },
        { verb: "crushes", why: "no bridge into the chocolate sweetness — whiskey jars instead" },
        { verb: "rolls over", why: "the whiskey weight doubles the cocoa weight without lift" },
      ],
      "dessert-custard": [
        { verb: "clashes with", why: "the cask-aged oak doubles the custard's sweetness without contrast" },
        { verb: "fights", why: "the spirit's spice register pulls against the custard's tang" },
        { verb: "overwhelms", why: "the whiskey spice register pulls against the custard's tang" },
        { verb: "smothers", why: "the whiskey spice register pulls against the custard's tang" },
        { verb: "crushes", why: "the whiskey spice register pulls against the custard's tang" },
      ],
      "dessert-cake-spice": [
        { verb: "overwhelms", why: "the whiskey's cask weight buries the spice cake's delicate cinnamon frame" },
        { verb: "buries", why: "spirit warmth on cake spice reads heavy — needs sweet wine pair" },
        { verb: "rolls over", why: "the whiskey weight clashes with the cream-cheese-and-cinnamon register" },
        { verb: "buries", why: "the whiskey cask weight buries the spice cake's delicate cinnamon" },
      ],
      "dessert-pastry": [
        { verb: "crowds", why: "the whiskey weight has no foil against a warm pastry's sugar-and-fry sweetness" },
        { verb: "rolls over", why: "the whiskey weight has no foil against warm pastry's sugar-and-fry" },
        { verb: "smothers", why: "spirit overshadows the warm-pastry delicacy — needs sweet liqueur" },
        { verb: "overwhelms", why: "spirit overshadows the warm-pastry delicacy — needs sweet liqueur" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "the cask weight has no foil against a delicate dessert finish" },
        { verb: "fights", why: "whiskey register clashes with the dessert's sugar-and-spice register" },
        { verb: "fights", why: "the whiskey weight is wrong-course energy for the dessert close" },
        { verb: "jars against", why: "the whiskey weight is wrong-course energy for the dessert close" },
      ],
    },
    "main": {
      "main-fish-delicate": [
        { verb: "smothers", why: "the brown-spirit weight pulls focus off the delicate fish protein" },
        { verb: "overwhelms", why: "brown-spirit weight belongs with red meat, not flaky white fish" },
        { verb: "flattens", why: "aged-oak density rolls over the gentle flesh without lifting it" },
        { verb: "crowds out", why: "the whiskey weight buries the delicate flesh without lifting it" },
        { verb: "swallows", why: "the protein is too gentle for the whiskey register — needs a crisp white" },
        { verb: "buries", why: "whiskey weight has no bridge into the gentle fish profile" },
      ],
      "main-fish-rich": [
        { verb: "clashes with", why: "the oily flesh and the brown-spirit oak refuse to meet cleanly" },
        { verb: "smothers", why: "cask-aged-spirit register doubles the natural fish-richness — no contrast" },
        { verb: "overwhelms", why: "whiskey weight needs red meat, not the salmon's already-rich oils" },
        { verb: "jars against", why: "the whiskey weight doubles the natural richness without contrast" },
        { verb: "compounds", why: "no acid to cut the rich flesh — the spirit just compounds the weight" },
        { verb: "jars against", why: "whiskey weight and oily fish meet without integration — density on density" },
      ],
      "main-fish-crusted": [
        { verb: "flattens", why: "aged-oak density rolls over the seared crust without lifting it" },
        { verb: "swallows", why: "the sweet-spirit register fights the savory sear without a bridge" },
        { verb: "clashes with", why: "whiskey's warmth crowds the rare crust's clean char" },
        { verb: "doubles down on", why: "whiskey has no foil against the protein's signature finish" },
        { verb: "jars against", why: "whiskey has no foil against the protein's signature finish" },
        { verb: "doubles down on", why: "the whiskey register clashes with the rare flesh's mineral edge" },
      ],
      "main-poultry": [
        { verb: "overwhelms", why: "the whiskey's register is too heavy for the chicken's mild frame" },
        { verb: "smothers", why: "cask-driven oak-depth rolls over the herbed skin without complement" },
        { verb: "flattens", why: "the whiskey weight overshadows the herbed crisp skin" },
        { verb: "buries", why: "the whiskey weight buries the bird's gentle savory register" },
        { verb: "crowds out", why: "needs a softer call — the whiskey register is wrong direction for poultry" },
      ],
      "DEFAULT": [
        { verb: "overwhelms", why: "brown-spirit weight belongs with red meat, not a flaky main" },
        { verb: "swallows", why: "the sweet-spirit register fights the savory main without a bridge" },
        { verb: "rolls over", why: "the whiskey weight reads wrong against the main course's register" },
        { verb: "flattens", why: "the whiskey weight reads wrong against the main course's register" },
        { verb: "crushes", why: "spirit and main course refuse each other without bridge" },
      ],
    },
    "side": {
      "side-cream": [
        { verb: "doubles down on", why: "cask-aged oak meets dairy richness with no contrast between them" },
        { verb: "flattens", why: "whiskey weight and the side's cream pull in the same direction without bridge" },
        { verb: "jars against", why: "the whiskey weight and the side's cream pull the same direction" },
        { verb: "clashes with", why: "the whiskey weight compounds the cream side without structural cut" },
        { verb: "compounds", why: "spirit warmth on dairy reads heavy on heavy — no lift" },
      ],
      "side-vegetable": [
        { verb: "overshadows", why: "cask-driven oak-depth has nothing to bridge into green vegetable freshness" },
        { verb: "clashes with", why: "the whiskey's register is wrong for a clean vegetable side — needs crisp white instead" },
        { verb: "flattens", why: "the whiskey register is wrong for a clean vegetable side — needs crisp white" },
        { verb: "crushes", why: "the whiskey weight overshadows the green-vegetal edge" },
        { verb: "smothers", why: "no bridge into the side's clean profile — spirit weight crowds" },
      ],
      "side-glazed": [
        { verb: "doubles down on", why: "sweet-oak and a sweet glaze double the sugar register with no contrast" },
        { verb: "overwhelms", why: "whiskey weight buries the glaze's sweetness instead of carrying it" },
        { verb: "clashes with", why: "the whiskey weight doubles the glaze's sweetness without contrast" },
        { verb: "compounds", why: "spirit warmth on glaze reads cloying — needs acidity" },
        { verb: "fights", why: "spirit warmth on glaze reads cloying — needs acidity" },
      ],
      "side-earthy": [
        { verb: "overshadows", why: "the whiskey's warmth fights the side's earthy umami without bridge" },
        { verb: "clashes with", why: "spirit and earthy plate refuse each other — no integration" },
        { verb: "doubles down on", why: "the whiskey weight fights the earthy umami without bridge" },
        { verb: "jars against", why: "the whiskey weight crowds the mushroom register instead of carrying it" },
      ],
      "side-starch": [
        { verb: "crowds", why: "the whiskey needs the cut, not the supporting starch plate" },
        { verb: "clashes with", why: "whiskey register reads heavy against the side's mild profile" },
        { verb: "compounds", why: "this is a bottle for the headline, not a starch alongside" },
        { verb: "clashes with", why: "this is a bottle for the headline, not a starch alongside" },
      ],
      "DEFAULT": [
        { verb: "crowds", why: "the spirit needs the cut, not the supporting side" },
        { verb: "smothers", why: "the side reads small under oak-and-vanilla density" },
        { verb: "crowds out", why: "whiskey crowds the supporting course without lift" },
        { verb: "flattens", why: "whiskey crowds the supporting course without lift" },
        { verb: "overwhelms", why: "whiskey crowds the supporting course without lift" },
      ],
    },
    "soup-salad": {
      "soup-salad-cream": [
        { verb: "doubles down on", why: "cask-aged-spirit oak meets dairy cream with no contrast — both register heavy" },
        { verb: "flattens", why: "brown-spirit weight buries the soup's creamy base instead of carrying it" },
        { verb: "jars against", why: "spirit warmth and cream pull the same direction without bridge" },
        { verb: "jars against", why: "the whiskey weight compounds the cream's richness without acid to clean" },
        { verb: "jars against", why: "the whiskey weight meets the dairy cream with no contrast — both register heavy" },
      ],
      "soup-salad-broth": [
        { verb: "crowds", why: "the whiskey has no acid to balance the broth's savory base" },
        { verb: "clashes with", why: "spirit warmth and the broth's salt-and-spice frame refuse each other" },
        { verb: "rolls over", why: "whiskey has no acid to balance the broth's savory base" },
        { verb: "buries", why: "the whiskey weight and the salt-and-spice broth refuse each other" },
        { verb: "crowds out", why: "spirit register crowds the clean broth without integration" },
      ],
      "soup-salad-greens": [
        { verb: "overshadows", why: "cask-driven oak-depth has no business on cold lettuce — no acid to bridge it" },
        { verb: "clashes with", why: "the spirit reads bulky against the crisp salad frame" },
        { verb: "crushes", why: "the whiskey weight reads heavy against the salad's light frame" },
        { verb: "flattens", why: "whiskey has no acid foil against the salad's clean profile" },
        { verb: "overwhelms", why: "whiskey has no acid foil against the salad's clean profile" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "the soup-salad course needs lift, not oak-and-vanilla depth" },
        { verb: "crowds out", why: "the whiskey weight is wrong moment for the course" },
        { verb: "swallows", why: "the whiskey weight flattens the soup-or-salad course register" },
        { verb: "smothers", why: "the whiskey weight flattens the soup-or-salad course register" },
      ],
    },
    "starter": {
      "starter-shellfish": [
        { verb: "overshadows", why: "the spirit weight crowds the delicate shellfish — no acid to clean the brine" },
        { verb: "drowns out", why: "cask-driven oak-depth flattens the briny opener instead of lifting it" },
        { verb: "smothers", why: "whiskey warmth has no foil against cold, clean shellfish" },
        { verb: "overwhelms", why: "wrong-course energy — shellfish needs crisp acidity, not whiskey weight" },
        { verb: "crowds out", why: "wrong-course energy — shellfish needs crisp acidity, not whiskey weight" },
        { verb: "overwhelms", why: "the whiskey weight crowds the brine without acid to bridge" },
      ],
      "starter-dairy": [
        { verb: "crowds out", why: "whiskey register curdles next to fresh dairy without acid to balance" },
        { verb: "clashes with", why: "whiskey weight buries the milky cheese plate's delicate frame" },
        { verb: "jars against", why: "spirit warmth and fresh dairy refuse each other texturally" },
        { verb: "compounds", why: "whiskey has no foil against fresh cream — needs structural cut" },
        { verb: "doubles down on", why: "spirit warmth and fresh dairy refuse each other texturally" },
      ],
      "starter-meat": [
        { verb: "underclubs", why: "the bottle is capable but the rich meat starter deserves a more decisive call" },
        { verb: "falls short of", why: "this expression doesn't carry the meat opener — a bigger whiskey or Cab earns it" },
        { verb: "clashes with", why: "this expression doesn't carry the meat opener — a bigger pour earns it" },
        { verb: "doubles down on", why: "the whiskey is capable but the rich meat starter deserves a more decisive call" },
        { verb: "jars against", why: "this expression doesn't carry the meat opener — a bigger pour earns it" },
      ],
      "starter-herb": [
        { verb: "overwhelms", why: "cask-driven oak-depth rolls over the herb-bright opener" },
        { verb: "smothers", why: "the whiskey weight buries the dish's garlic-herb lift" },
        { verb: "rolls over", why: "the whiskey weight clashes with the bright herbal profile without bridge" },
        { verb: "crushes", why: "spirit register overshadows the herbal complexity — no contrast" },
        { verb: "crushes", why: "the whiskey weight clashes with the bright herbal profile without bridge" },
      ],
      "DEFAULT": [
        { verb: "crowds out", why: "whiskey depth is wrong for the table's opening course" },
        { verb: "fights", why: "the spirit register reads heavy on a starter's lighter frame" },
        { verb: "buries", why: "the whiskey weight is misaligned with the starter's lighter register" },
        { verb: "buries", why: "the whiskey weight reads wrong-course for the table's opener" },
        { verb: "flattens", why: "whiskey crowds the opening course instead of lifting it" },
      ],
    },
    "steak": {
      "steak-big": [
        { verb: "underclubs", why: "the whiskey's register is right but this bottle reads short of the long-bone cut" },
        { verb: "falls short of", why: "this expression doesn't carry 26+ ounces — a bigger whiskey or a Cab earns it" },
        { verb: "compounds", why: "this expression doesn't carry the 26+ ounce cut — a bigger pour earns it" },
        { verb: "fights", why: "the whiskey weight underclubs the headline-cut weight" },
        { verb: "doubles down on", why: "the whiskey register is right but this bottle reads short of the long-bone cut" },
      ],
      "steak-medium": [
        { verb: "mis-pairs with", why: "the bottle is capable but the cut earns a more decisive call" },
        { verb: "doubles down on", why: "the whiskey weight reads off against the marbled mid-cut" },
        { verb: "compounds", why: "the bottle's character is wrong direction for the mid-cut weight" },
        { verb: "fights", why: "needs a Cab or whiskey at full register for this cut" },
      ],
      "steak-lean": [
        { verb: "overwhelms", why: "the whiskey's weight crowds the filet's lean buttery frame — needs a softer call" },
        { verb: "clashes with", why: "the whiskey register buries the cut's gentle tenderness" },
        { verb: "fights", why: "the whiskey weight clashes with the tenderloin's delicate finish" },
        { verb: "compounds", why: "the whiskey weight clashes with the tenderloin's delicate finish" },
      ],
      "DEFAULT": [
        { verb: "underclubs", why: "the bottle's register lands at a lower tier than the cut deserves" },
        { verb: "fights", why: "the whiskey weight reads wrong for the steak course" },
        { verb: "jars against", why: "whiskey register clashes with the cut's headline frame" },
        { verb: "clashes with", why: "the whiskey weight reads wrong for the steak course" },
      ],
    },
  },
  "COCKTAIL_BOLD": {
    "dessert": {
      "dessert-chocolate": [
        { verb: "fights", why: "whiskey-cocktail bitters pull against the chocolate sugar without bridging" },
        { verb: "smothers", why: "the cocktail spirit-weight doubles the cocoa weight without lift" },
        { verb: "buries", why: "the spirit-forward cocktail heat dulls the chocolate's lift instead of carrying it" },
        { verb: "rolls over", why: "spirit-forward cocktail register clashes with chocolate's rich finish — needs Port or amaro" },
      ],
      "dessert-custard": [
        { verb: "clashes with", why: "bitters and custard tang refuse each other — neither course softens" },
        { verb: "crowds out", why: "the cocktail spirit-weight doubles the custard's sweetness without contrast" },
        { verb: "flattens", why: "the spirit-forward cocktail spice register pulls against the custard's tang" },
        { verb: "crowds out", why: "spirit-forward cocktail weight and the custard's silk refuse each other" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "a whiskey-forward cocktail has nothing to bridge into dessert" },
        { verb: "reads bitter against", why: "spirit-forward cocktail register clashes with the dessert's sugar-and-spice register" },
        { verb: "reads bitter against", why: "the cocktail spirit-weight is wrong-course energy for the dessert close" },
        { verb: "mis-pairs with", why: "the spirit-forward cocktail weight has no bridge into dessert sweetness" },
      ],
    },
    "main": {
      "main-fish-delicate": [
        { verb: "overwhelms", why: "whiskey-forward cocktail weight buries delicate fish — the cocktail belongs on red meat" },
        { verb: "smothers", why: "the bitters-and-whiskey register has no foil against gentle flesh" },
        { verb: "crowds out", why: "spirit-forward cocktail weight has no bridge into the gentle fish profile" },
        { verb: "flattens", why: "the protein is too gentle for the spirit-forward cocktail register — needs a crisp white" },
        { verb: "crowds out", why: "the cocktail spirit-weight flattens the clean flesh instead of carrying it" },
      ],
      "main-fish-rich": [
        { verb: "clashes with", why: "whiskey cocktail and oily fish refuse each other — needs acid, not bitters" },
        { verb: "fights", why: "no acid to cut the rich flesh — the spirit just compounds the weight" },
        { verb: "fights", why: "the cocktail spirit-weight doubles the natural richness without contrast" },
        { verb: "jars against", why: "the cocktail spirit-weight doubles the natural richness without contrast" },
      ],
      "main-fish-crusted": [
        { verb: "fights", why: "cocktail bitterness pulls against the savory sear without resolving" },
        { verb: "compounds", why: "the cocktail spirit-weight flattens the seared crust without complement" },
        { verb: "jars against", why: "the spirit-forward cocktail register clashes with the rare flesh's mineral edge" },
        { verb: "compounds", why: "spirit depth crowds the crust's sharp profile" },
      ],
      "main-poultry": [
        { verb: "overwhelms", why: "whiskey-cocktail weight buries the chicken's mild frame" },
        { verb: "buries", why: "the spirit-forward cocktail weight overshadows the herbed crisp skin" },
        { verb: "crowds out", why: "the cocktail spirit-weight buries the bird's gentle savory register" },
        { verb: "crushes", why: "needs a softer call — the spirit-forward cocktail register is wrong direction for poultry" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "a whiskey-forward cocktail is built for the cut, not the fish or chicken course" },
        { verb: "buries", why: "the spirit-forward cocktail weight is misaligned with the protein's profile" },
        { verb: "smothers", why: "the spirit-forward cocktail weight is misaligned with the protein's profile" },
        { verb: "swallows", why: "spirit and main course refuse each other without bridge" },
      ],
    },
    "side": {
      "side-cream": [
        { verb: "doubles down on", why: "cocktail whiskey and dairy side meet without contrast — both heavy" },
        { verb: "compounds", why: "the spirit-forward cocktail weight and the side's cream pull the same direction" },
        { verb: "jars against", why: "spirit warmth on dairy reads heavy on heavy — no lift" },
        { verb: "compounds", why: "the cocktail spirit-weight compounds the cream side without structural cut" },
      ],
      "side-vegetable": [
        { verb: "overshadows", why: "whiskey-cocktail register crowds the green vegetable plate" },
        { verb: "overwhelms", why: "the cocktail spirit-weight clashes with the vegetable's bright vegetal lift" },
        { verb: "crushes", why: "the cocktail spirit-weight clashes with the vegetable's bright vegetal lift" },
        { verb: "crushes", why: "no bridge into the side's clean profile — spirit weight crowds" },
      ],
      "side-glazed": [
        { verb: "doubles down on", why: "whiskey-cocktail sugar and glaze sugar compound without lift" },
        { verb: "jars against", why: "the cocktail spirit-weight doubles the glaze's sweetness without contrast" },
        { verb: "clashes with", why: "the cocktail spirit-weight reads heavy on the glazed side without complement" },
        { verb: "compounds", why: "the spirit-forward cocktail oak and the side's sugar register compound — no lift" },
      ],
      "side-starch": [
        { verb: "crowds", why: "the cocktail belongs with the cut, not the supporting starch" },
        { verb: "compounds", why: "the cocktail spirit-weight overshadows the side's neutral frame" },
        { verb: "doubles down on", why: "the cocktail spirit-weight overshadows the side's neutral frame" },
        { verb: "clashes with", why: "the cocktail spirit-weight overshadows the side's neutral frame" },
      ],
      "DEFAULT": [
        { verb: "crowds", why: "the cocktail needs the cut, not the supporting side" },
        { verb: "crushes", why: "the cocktail spirit-weight reads wrong for the side course" },
        { verb: "overwhelms", why: "the cocktail spirit-weight reads wrong for the side course" },
        { verb: "overwhelms", why: "spirit-forward cocktail crowds the supporting course without lift" },
      ],
    },
    "soup-salad": {
      "soup-salad-cream": [
        { verb: "flattens", why: "whiskey-cocktail register buries the soup's cream instead of carrying it" },
        { verb: "clashes with", why: "spirit warmth and cream pull the same direction without bridge" },
        { verb: "clashes with", why: "the spirit-forward cocktail weight doubles the soup's density instead of lifting" },
        { verb: "fights", why: "the cocktail spirit-weight compounds the cream's richness without acid to clean" },
      ],
      "soup-salad-broth": [
        { verb: "clashes with", why: "bitter-and-whiskey cocktail and savory broth refuse each other" },
        { verb: "swallows", why: "spirit-forward cocktail has no acid to balance the broth's savory base" },
        { verb: "overwhelms", why: "spirit-forward cocktail has no acid to balance the broth's savory base" },
        { verb: "crushes", why: "spirit register crowds the clean broth without integration" },
      ],
      "soup-salad-greens": [
        { verb: "overwhelms", why: "whiskey-cocktail weight has no business on cold lettuce" },
        { verb: "buries", why: "the cocktail spirit-weight crowds the greens' bright edge without bridge" },
        { verb: "rolls over", why: "the cocktail spirit-weight reads heavy against the salad's light frame" },
        { verb: "crowds out", why: "wrong direction — greens need bright acid, not spirit-forward cocktail weight" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "soup-salad course needs lift — bitters-and-whiskey brings weight instead" },
        { verb: "overwhelms", why: "the spirit-forward cocktail weight is wrong moment for the course" },
        { verb: "flattens", why: "the spirit-forward cocktail weight is wrong moment for the course" },
        { verb: "swallows", why: "the cocktail spirit-weight flattens the soup-or-salad course register" },
      ],
    },
    "starter": {
      "starter-shellfish": [
        { verb: "overwhelms", why: "whiskey-cocktail weight is wrong for cold shellfish — the opener needs lift, not bitters" },
        { verb: "flattens", why: "the spirit-forward cocktail register flattens the briny opener instead of lifting it" },
        { verb: "smothers", why: "the spirit-forward cocktail register flattens the briny opener instead of lifting it" },
        { verb: "buries", why: "the cocktail spirit-weight crowds the brine without acid to bridge" },
      ],
      "starter-dairy": [
        { verb: "fights", why: "whiskey-and-bitter cocktail and fresh dairy refuse each other texturally" },
        { verb: "clashes with", why: "the cocktail spirit-weight curdles against fresh dairy without structural acid" },
        { verb: "doubles down on", why: "spirit warmth and fresh dairy refuse each other texturally" },
        { verb: "jars against", why: "the spirit-forward cocktail weight buries the milky cheese plate's delicate frame" },
      ],
      "starter-meat": [
        { verb: "underclubs", why: "the cocktail is capable but the meat starter could carry a bigger pour" },
        { verb: "compounds", why: "spirit weight crowds the iron-savory starter without integration" },
        { verb: "jars against", why: "this expression doesn't carry the meat opener — a bigger pour earns it" },
        { verb: "compounds", why: "this expression doesn't carry the meat opener — a bigger pour earns it" },
      ],
      "starter-herb": [
        { verb: "overshadows", why: "whiskey-cocktail register buries the herb-bright opener" },
        { verb: "overwhelms", why: "the cocktail spirit-weight clashes with the bright herbal profile without bridge" },
        { verb: "crowds out", why: "spirit register overshadows the herbal complexity — no contrast" },
        { verb: "buries", why: "the cocktail spirit-weight rolls over the herb-bright opener" },
      ],
      "DEFAULT": [
        { verb: "overwhelms", why: "the cocktail's weight is forward for the table's first course" },
        { verb: "smothers", why: "the cocktail spirit-weight reads wrong-course for the table's opener" },
        { verb: "rolls over", why: "spirit-forward cocktail crowds the opening course instead of lifting it" },
        { verb: "crowds out", why: "spirit-forward cocktail crowds the opening course instead of lifting it" },
      ],
    },
    "steak": {
      "steak-big": [
        { verb: "mis-pairs with", why: "this specific cocktail underclubs the headline cut — a Cab or older bourbon earns it" },
        { verb: "jars against", why: "this expression doesn't carry the 26+ ounce cut — a bigger pour earns it" },
        { verb: "compounds", why: "the cocktail spirit-weight underclubs the headline-cut weight" },
        { verb: "clashes with", why: "the cocktail spirit-weight underclubs the headline-cut weight" },
      ],
      "steak-lean": [
        { verb: "overwhelms", why: "the cocktail's weight crowds the lean cut's buttery delicacy" },
        { verb: "compounds", why: "spirit weight overshadows the lean cut's subtle profile" },
        { verb: "fights", why: "spirit weight overshadows the lean cut's subtle profile" },
        { verb: "doubles down on", why: "the cocktail spirit-weight clashes with the tenderloin's delicate finish" },
      ],
      "DEFAULT": [
        { verb: "mis-pairs with", why: "the cocktail register is wrong for this cut — try a different pour" },
        { verb: "jars against", why: "spirit-forward cocktail register clashes with the cut's headline frame" },
        { verb: "doubles down on", why: "the cocktail spirit-weight reads wrong for the steak course" },
        { verb: "compounds", why: "the spirit-forward cocktail character is misaligned with the protein's weight" },
      ],
    },
  },
  "COCKTAIL_LIGHT": {
    "dessert": {
      "dessert-chocolate": [
        { verb: "fights", why: "citrus-cocktail brightness pulls against chocolate weight — no bridge between sour-sweet and rich-sweet" },
        { verb: "underclubs", why: "light cocktail register clashes with chocolate's rich finish — needs Port or amaro" },
        { verb: "doesn't anchor", why: "no bridge into the chocolate sweetness — light cocktail jars instead" },
        { verb: "can't carry", why: "light cocktail register clashes with chocolate's rich finish — needs Port or amaro" },
      ],
      "dessert-custard": [
        { verb: "jars against", why: "cocktail citrus and custard tang cancel each other — both reach for acid" },
        { verb: "mis-pairs with", why: "light cocktail weight and the custard's silk refuse each other" },
        { verb: "reads off against", why: "the cocktail citrus doubles the custard's sweetness without contrast" },
        { verb: "reads off against", why: "the light cocktail spice register pulls against the custard's tang" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "light cocktail citrus is wrong direction for the dessert's richness" },
        { verb: "mis-pairs with", why: "the cocktail citrus is wrong-course energy for the dessert close" },
        { verb: "fights", why: "the cocktail citrus is wrong-course energy for the dessert close" },
        { verb: "mis-pairs with", why: "the light cocktail weight has no bridge into dessert sweetness" },
      ],
    },
    "main": {
      "main-fish-rich": [
        { verb: "clashes with", why: "cocktail sweetness fights the rich fish's natural oils" },
        { verb: "mis-pairs with", why: "the cocktail citrus doubles the natural richness without contrast" },
        { verb: "can't carry", why: "no acid to cut the rich flesh — the spirit just compounds the weight" },
        { verb: "doesn't anchor", why: "light cocktail reads heavy on the oily protein — needs structural lift" },
      ],
      "DEFAULT": [
        { verb: "mis-pairs with", why: "light cocktail register is wrong for a main protein" },
        { verb: "flattens", why: "spirit and main course refuse each other without bridge" },
        { verb: "flattens", why: "the cocktail citrus reads wrong against the main course's register" },
        { verb: "swallows", why: "the cocktail citrus reads wrong against the main course's register" },
      ],
    },
    "side": {
      "side-cream": [
        { verb: "clashes with", why: "cocktail acid on dairy side cuts the cream wrong — texture reads off" },
        { verb: "reads light against", why: "the cocktail citrus compounds the cream side without structural cut" },
        { verb: "reads light against", why: "the cocktail citrus meets dairy richness with no contrast" },
        { verb: "falls short of", why: "the light cocktail weight and the side's cream pull the same direction" },
      ],
      "side-glazed": [
        { verb: "clashes with", why: "cocktail sweetness and glaze sugar compete instead of complementing" },
        { verb: "mis-pairs with", why: "the cocktail citrus doubles the glaze's sweetness without contrast" },
        { verb: "can't carry", why: "the cocktail citrus doubles the glaze's sweetness without contrast" },
        { verb: "mis-pairs with", why: "the light cocktail oak and the side's sugar register compound — no lift" },
      ],
      "DEFAULT": [
        { verb: "crowds", why: "a light cocktail belongs with the opener or aperitif, not a savory side" },
        { verb: "rolls over", why: "the cocktail citrus reads wrong for the side course" },
        { verb: "overwhelms", why: "the cocktail citrus reads wrong for the side course" },
        { verb: "flattens", why: "the light cocktail weight is misaligned with the side's lighter register" },
      ],
    },
    "soup-salad": {
      "soup-salad-cream": [
        { verb: "clashes with", why: "cocktail acid cuts the soup's cream wrong — needs full-bodied lift instead" },
        { verb: "can't carry", why: "the cocktail citrus meets the dairy cream with no contrast — both register heavy" },
        { verb: "reads light against", why: "spirit warmth and cream pull the same direction without bridge" },
        { verb: "mis-pairs with", why: "the light cocktail weight doubles the soup's density instead of lifting" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "the cocktail and the soup-salad course pull in different directions" },
        { verb: "flattens", why: "the light cocktail weight is wrong moment for the course" },
        { verb: "crowds out", why: "the light cocktail weight is wrong moment for the course" },
        { verb: "smothers", why: "the light cocktail weight is wrong moment for the course" },
      ],
    },
    "starter": {
      "starter-meat": [
        { verb: "underclubs", why: "cocktail citrus reads thin against rich meat — needs a fuller pour" },
        { verb: "falls short of", why: "the cocktail citrus reads thin against the iron richness — needs more weight" },
        { verb: "mis-pairs with", why: "this expression doesn't carry the meat opener — a bigger pour earns it" },
        { verb: "doesn't anchor", why: "spirit weight crowds the iron-savory starter without integration" },
      ],
      "DEFAULT": [
        { verb: "mis-pairs with", why: "this cocktail's register doesn't lift the opener — try a sparkling or crisp white" },
        { verb: "rolls over", why: "the light cocktail weight is misaligned with the starter's lighter register" },
        { verb: "swallows", why: "the cocktail citrus reads wrong-course for the table's opener" },
        { verb: "rolls over", why: "light cocktail crowds the opening course instead of lifting it" },
      ],
    },
    "steak": {
      "steak-big": [
        { verb: "underclubs", why: "a light citrus cocktail can't carry the marbled char — needs whiskey or red wine weight" },
        { verb: "doesn't anchor", why: "the light cocktail register is right but this bottle reads short of the long-bone cut" },
        { verb: "reads light against", why: "needs more weight — the cut overshadows the light cocktail's frame" },
        { verb: "doesn't anchor", why: "needs more weight — the cut overshadows the light cocktail's frame" },
      ],
      "steak-medium": [
        { verb: "underclubs", why: "cocktail citrus reads thin against the cut's structure" },
        { verb: "can't carry", why: "needs a Cab or whiskey at full register for this cut" },
        { verb: "mis-pairs with", why: "the bottle's character is wrong direction for the mid-cut weight" },
        { verb: "reads light against", why: "the cocktail citrus fights the strip-and-bone register" },
      ],
      "steak-lean": [
        { verb: "mis-pairs with", why: "citrus-cocktail register doesn't bridge into the filet's savory delicacy" },
        { verb: "reads light against", why: "spirit weight overshadows the lean cut's subtle profile" },
        { verb: "doesn't anchor", why: "the light cocktail register buries the cut's gentle tenderness" },
        { verb: "can't carry", why: "the cocktail citrus crowds the filet's lean buttery frame — needs softer call" },
      ],
      "DEFAULT": [
        { verb: "underclubs", why: "light cocktail lands short of any prime cut" },
        { verb: "mis-pairs with", why: "the light cocktail character is misaligned with the protein's weight" },
        { verb: "can't carry", why: "the cocktail citrus reads wrong for the steak course" },
        { verb: "doesn't anchor", why: "light cocktail register clashes with the cut's headline frame" },
      ],
    },
  },
  "COGNAC": {
    "main": {
      "main-fish-delicate": [
        { verb: "overwhelms", why: "cognac's aged-grape weight buries delicate fish — digestif belongs after the meal" },
        { verb: "buries", why: "the cognac depth flattens the clean flesh instead of carrying it" },
        { verb: "crowds out", why: "the protein is too gentle for the cognac register — needs a crisp white" },
        { verb: "crushes", why: "cognac weight has no bridge into the gentle fish profile" },
      ],
      "main-fish-rich": [
        { verb: "clashes with", why: "cognac and oily fish double up the richness with no foil" },
        { verb: "jars against", why: "cognac reads heavy on the oily protein — needs structural lift" },
        { verb: "jars against", why: "the cognac depth doubles the natural richness without contrast" },
        { verb: "compounds", why: "no acid to cut the rich flesh — the spirit just compounds the weight" },
      ],
      "main-fish-crusted": [
        { verb: "fights", why: "cognac's aged register pulls against the savory sear without resolving" },
        { verb: "doubles down on", why: "the cognac depth flattens the seared crust without complement" },
        { verb: "clashes with", why: "the cognac register clashes with the rare flesh's mineral edge" },
        { verb: "jars against", why: "the cognac depth flattens the seared crust without complement" },
      ],
      "main-poultry": [
        { verb: "overshadows", why: "cognac weight buries the chicken's mild herbed-skin frame" },
        { verb: "smothers", why: "the cognac depth crowds the chicken's mild frame without complement" },
        { verb: "rolls over", why: "needs a softer call — the cognac register is wrong direction for poultry" },
        { verb: "crushes", why: "needs a softer call — the cognac register is wrong direction for poultry" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "cognac is post-meal energy — wrong register for a main protein" },
        { verb: "smothers", why: "spirit and main course refuse each other without bridge" },
        { verb: "smothers", why: "the cognac depth reads wrong against the main course's register" },
        { verb: "crushes", why: "the cognac depth reads wrong against the main course's register" },
      ],
    },
    "side": {
      "side-cream": [
        { verb: "doubles down on", why: "cognac's aged weight and dairy side compound the richness with no contrast" },
        { verb: "jars against", why: "the cognac depth compounds the cream side without structural cut" },
        { verb: "compounds", why: "the cognac weight and the side's cream pull the same direction" },
        { verb: "clashes with", why: "spirit warmth on dairy reads heavy on heavy — no lift" },
      ],
      "side-vegetable": [
        { verb: "clashes with", why: "cognac on a green vegetable side is wrong direction — needs crisp white instead" },
        { verb: "flattens", why: "the cognac depth overshadows the green-vegetal edge" },
        { verb: "rolls over", why: "the cognac depth clashes with the vegetable's bright vegetal lift" },
        { verb: "crushes", why: "no bridge into the side's clean profile — spirit weight crowds" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "cognac on a savory side is wrong-course energy" },
        { verb: "rolls over", why: "the cognac depth reads wrong for the side course" },
        { verb: "flattens", why: "the cognac weight is misaligned with the side's lighter register" },
        { verb: "smothers", why: "cognac crowds the supporting course without lift" },
      ],
    },
    "starter": {
      "starter-shellfish": [
        { verb: "overwhelms", why: "cognac weight has no business on cold shellfish — needs sparkling or a crisp white" },
        { verb: "flattens", why: "the cognac depth crowds the brine without acid to bridge" },
        { verb: "buries", why: "the cognac register flattens the briny opener instead of lifting it" },
        { verb: "swallows", why: "the cognac register flattens the briny opener instead of lifting it" },
      ],
      "starter-dairy": [
        { verb: "clashes with", why: "cognac and fresh dairy refuse each other without acid to bridge" },
        { verb: "jars against", why: "the cognac weight buries the milky cheese plate's delicate frame" },
        { verb: "compounds", why: "spirit warmth and fresh dairy refuse each other texturally" },
        { verb: "doubles down on", why: "the cognac depth curdles against fresh dairy without structural acid" },
      ],
      "starter-meat": [
        { verb: "mis-pairs with", why: "this cognac's register is wrong for the meat opener — try a wine or bourbon" },
        { verb: "fights", why: "spirit weight crowds the iron-savory starter without integration" },
        { verb: "jars against", why: "this expression doesn't carry the meat opener — a bigger pour earns it" },
        { verb: "jars against", why: "the cognac is capable but the rich meat starter deserves a more decisive call" },
      ],
      "starter-herb": [
        { verb: "overshadows", why: "cognac depth buries the herb-bright opener" },
        { verb: "crowds out", why: "the cognac weight buries the dish's garlic-herb lift" },
        { verb: "swallows", why: "the cognac weight buries the dish's garlic-herb lift" },
        { verb: "rolls over", why: "the cognac depth clashes with the bright herbal profile without bridge" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "cognac is wrong-course energy for the table's opener" },
        { verb: "rolls over", why: "cognac crowds the opening course instead of lifting it" },
        { verb: "flattens", why: "the cognac weight is misaligned with the starter's lighter register" },
        { verb: "rolls over", why: "the cognac depth reads wrong-course for the table's opener" },
      ],
    },
  },
  "COGNAC_LUXURY": {
    "main": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "an icon cognac belongs at the end of the meal as a special-occasion pour — not the main course" },
        { verb: "smothers", why: "the icon cognac weight is misaligned with the protein's profile" },
        { verb: "flattens", why: "the prestige-cognac weight reads wrong against the main course's register" },
        { verb: "overwhelms", why: "the icon cognac weight is misaligned with the protein's profile" },
      ],
    },
    "side": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "a luxury cognac belongs alone after the meal, not alongside a side" },
        { verb: "flattens", why: "icon cognac crowds the supporting course without lift" },
        { verb: "smothers", why: "icon cognac crowds the supporting course without lift" },
        { verb: "buries", why: "icon cognac crowds the supporting course without lift" },
      ],
    },
    "soup-salad": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "an icon cognac on a soup-salad course is wrong moment — its register demands the close, not the open" },
        { verb: "rolls over", why: "the icon cognac weight is wrong moment for the course" },
        { verb: "flattens", why: "icon cognac crowds the opening course without complement" },
        { verb: "smothers", why: "the icon cognac weight is wrong moment for the course" },
      ],
    },
    "starter": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "a luxury cognac is wrong moment for the opener — save it for after the meal" },
        { verb: "crowds out", why: "icon cognac crowds the opening course instead of lifting it" },
        { verb: "crushes", why: "the icon cognac weight is misaligned with the starter's lighter register" },
        { verb: "flattens", why: "the icon cognac weight is misaligned with the starter's lighter register" },
      ],
    },
    "steak": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "an icon cognac is best as a separate occasion — pair the steak with a Cab or bourbon, then close with the cognac" },
        { verb: "fights", why: "the prestige-cognac weight reads wrong for the steak course" },
        { verb: "compounds", why: "the icon cognac character is misaligned with the protein's weight" },
        { verb: "doubles down on", why: "the prestige-cognac weight reads wrong for the steak course" },
      ],
    },
  },
  "ELEGANT_RED": {
    "dessert": {
      "dessert-chocolate": [
        { verb: "fights", why: "the dry red and the chocolate's sugar refuse each other — tannin reads bitter on the finish" },
        { verb: "clashes with", why: "savory tannin sits awkwardly on cocoa weight without resolving" },
        { verb: "mis-pairs with", why: "no bridge into the chocolate sweetness — medium-bodied red jars instead" },
        { verb: "reads bitter against", why: "the elegant tannin doubles the cocoa weight without lift" },
        { verb: "jars against", why: "no bridge into the chocolate sweetness — medium-bodied red jars instead" },
      ],
      "dessert-custard": [
        { verb: "jars against", why: "tannin reads astringent next to dairy custard, the custard reads sour back" },
        { verb: "pulls against", why: "the red's dry-fruit register has no bridge to dessert tang or sugar" },
        { verb: "reads bitter against", why: "spirit heat scorches the delicate vanilla-custard frame" },
        { verb: "mis-pairs with", why: "the medium-bodied red spice register pulls against the custard's tang" },
        { verb: "fights", why: "the elegant tannin doubles the custard's sweetness without contrast" },
      ],
      "dessert-cake-spice": [
        { verb: "clashes with", why: "red structure flattens the spice cake's cinnamon-and-cream-cheese delicacy" },
        { verb: "mis-pairs with", why: "spirit warmth on cake spice reads heavy — needs sweet wine pair" },
        { verb: "mis-pairs with", why: "the medium-bodied red cask weight buries the spice cake's delicate cinnamon" },
        { verb: "mis-pairs with", why: "the elegant tannin overshadows the cake's warm-spice profile" },
      ],
      "dessert-pastry": [
        { verb: "fights", why: "tannin can't pivot to warm pastry sugar — the pour reads dry, the dessert reads heavy" },
        { verb: "mis-pairs with", why: "the elegant tannin and the dessert's lightness refuse each other" },
        { verb: "reads bitter against", why: "medium-bodied red register is wrong direction for the warm-sugared dessert" },
        { verb: "jars against", why: "spirit overshadows the warm-pastry delicacy — needs sweet liqueur" },
      ],
      "DEFAULT": [
        { verb: "jars against", why: "savory tannin meets dessert sugar with no bridge between them" },
        { verb: "flattens", why: "the structured red has nothing to bridge into a dessert finish" },
        { verb: "reads bitter against", why: "the elegant tannin is wrong-course energy for the dessert close" },
        { verb: "clashes with", why: "the medium-bodied red weight has no bridge into dessert sweetness" },
        { verb: "reads bitter against", why: "the medium-bodied red weight has no bridge into dessert sweetness" },
      ],
    },
    "main": {
      "main-fish-delicate": [
        { verb: "clashes with", why: "tannin reads metallic against the delicate fish — a crisp white cleans where red sits heavy" },
        { verb: "overwhelms", why: "the red's structure is wrong for delicate flesh — built for red meat" },
        { verb: "crushes", why: "the elegant tannin buries the delicate flesh without lifting it" },
        { verb: "flattens", why: "the elegant tannin buries the delicate flesh without lifting it" },
        { verb: "crowds out", why: "medium-bodied red weight has no bridge into the gentle fish profile" },
      ],
      "main-fish-rich": [
        { verb: "jars against", why: "tannin on oily fish goes bitter, where a Pinot at the right register would carry it" },
        { verb: "fights", why: "the red's tannin and the salmon's rich oils refuse to integrate" },
        { verb: "overwhelms", why: "medium-bodied red reads heavy on the oily protein — needs structural lift" },
        { verb: "swallows", why: "the elegant tannin doubles the natural richness without contrast" },
        { verb: "overwhelms", why: "the elegant tannin doubles the natural richness without contrast" },
      ],
      "main-fish-crusted": [
        { verb: "overshadows", why: "dark-fruit weight crowds the seared sesame crust — needs a sparkling or crisp white for lift" },
        { verb: "clashes with", why: "tannin against rare-seared crust reads astringent without a bridge" },
        { verb: "buries", why: "the elegant tannin flattens the seared crust without complement" },
        { verb: "rolls over", why: "spirit depth crowds the crust's sharp profile" },
        { verb: "rolls over", why: "medium-bodied red has no foil against the protein's signature finish" },
      ],
      "main-poultry": [
        { verb: "overshadows", why: "the red wants red meat — the chicken's mild register can't hold its frame" },
        { verb: "overwhelms", why: "the wine's dark-fruit weight crowds the herbed-skin chicken without complement" },
        { verb: "rolls over", why: "the elegant tannin buries the bird's gentle savory register" },
        { verb: "smothers", why: "the medium-bodied red weight overshadows the herbed crisp skin" },
        { verb: "swallows", why: "needs a softer call — the medium-bodied red register is wrong direction for poultry" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "tannin reads metallic against the fish's natural fats" },
        { verb: "swallows", why: "the elegant tannin reads wrong against the main course's register" },
        { verb: "flattens", why: "the elegant tannin reads wrong against the main course's register" },
        { verb: "crushes", why: "the medium-bodied red weight is misaligned with the protein's profile" },
      ],
    },
    "side": {
      "side-cream": [
        { verb: "clashes with", why: "tannin on dairy reads bitter where a crisp white would clean the richness" },
        { verb: "doubles down on", why: "the wine's structure and the side's cream meet without contrast — both heavy" },
        { verb: "rolls over", why: "the elegant tannin meets dairy richness with no contrast" },
        { verb: "crushes", why: "the elegant tannin compounds the cream side without structural cut" },
        { verb: "swallows", why: "the medium-bodied red weight and the side's cream pull the same direction" },
      ],
      "side-vegetable": [
        { verb: "overshadows", why: "red weight crowds a green side without lifting it — needs crisp register, not tannin" },
        { verb: "clashes with", why: "tannin on raw green vegetable reads astringent without payoff" },
        { verb: "overwhelms", why: "the elegant tannin clashes with the vegetable's bright vegetal lift" },
        { verb: "overwhelms", why: "the medium-bodied red register is wrong for a clean vegetable side — needs crisp white" },
        { verb: "swallows", why: "the elegant tannin clashes with the vegetable's bright vegetal lift" },
      ],
      "side-glazed": [
        { verb: "fights", why: "red tannin and the glaze's sugar pull against each other — sugar reads cloying, tannin bitter" },
        { verb: "buries", why: "spirit warmth on glaze reads cloying — needs acidity" },
        { verb: "crushes", why: "the medium-bodied red oak and the side's sugar register compound — no lift" },
        { verb: "overwhelms", why: "the elegant tannin doubles the glaze's sweetness without contrast" },
      ],
      "side-earthy": [
        { verb: "overshadows", why: "the wine's weight flattens the mushroom's earthy register instead of complementing" },
        { verb: "overwhelms", why: "the elegant tannin fights the earthy umami without bridge" },
        { verb: "rolls over", why: "the medium-bodied red register has nothing to meet the side's depth" },
        { verb: "smothers", why: "the medium-bodied red register has nothing to meet the side's depth" },
      ],
      "side-starch": [
        { verb: "overshadows", why: "red weight crowds the truffle-fry register — needs a sparkling or whiskey-cocktail for contrast" },
        { verb: "overwhelms", why: "the elegant tannin overshadows the side's neutral frame" },
        { verb: "buries", why: "this is a bottle for the headline, not a starch alongside" },
        { verb: "crushes", why: "medium-bodied red register reads heavy against the side's mild profile" },
      ],
      "DEFAULT": [
        { verb: "crowds", why: "the side needs a crisper register to carry it cleanly" },
        { verb: "crushes", why: "medium-bodied red crowds the supporting course without lift" },
        { verb: "crushes", why: "the medium-bodied red weight is misaligned with the side's lighter register" },
        { verb: "overwhelms", why: "the elegant tannin reads wrong for the side course" },
      ],
    },
    "soup-salad": {
      "soup-salad-cream": [
        { verb: "clashes with", why: "red tannin on a cream-based course reads astringent — no acid to bridge dairy and structure" },
        { verb: "flattens", why: "the wine's structure sits on top of the bisque's cream instead of integrating" },
        { verb: "rolls over", why: "the medium-bodied red weight doubles the soup's density instead of lifting" },
        { verb: "buries", why: "the elegant tannin compounds the cream's richness without acid to clean" },
        { verb: "buries", why: "spirit warmth and cream pull the same direction without bridge" },
      ],
      "soup-salad-broth": [
        { verb: "jars against", why: "the dry-fruit register fights warm broth without resolving — needs crisp white or aperitivo" },
        { verb: "swallows", why: "needs structural cut — medium-bodied red weight flattens the broth's lift" },
        { verb: "flattens", why: "spirit register crowds the clean broth without integration" },
        { verb: "swallows", why: "the elegant tannin and the salt-and-spice broth refuse each other" },
      ],
      "soup-salad-greens": [
        { verb: "overwhelms", why: "tannin on cold lettuce reads bitter — the salad needs a crisp white, not red structure" },
        { verb: "clashes with", why: "the red's weight is wrong for fresh greens — refuses to lift the plate" },
        { verb: "swallows", why: "wrong direction — greens need bright acid, not medium-bodied red weight" },
        { verb: "crowds out", why: "medium-bodied red has no acid foil against the salad's clean profile" },
        { verb: "crushes", why: "the elegant tannin crowds the greens' bright edge without bridge" },
      ],
      "DEFAULT": [
        { verb: "overwhelms", why: "the red is built for protein weight, not a light soup or salad base" },
        { verb: "swallows", why: "the medium-bodied red weight is wrong moment for the course" },
        { verb: "flattens", why: "medium-bodied red crowds the opening course without complement" },
        { verb: "crushes", why: "the medium-bodied red weight is wrong moment for the course" },
      ],
    },
    "starter": {
      "starter-shellfish": [
        { verb: "overwhelms", why: "tannin obliterates the delicate shellfish flavor — a crisp white or sparkling carries it cleanly" },
        { verb: "crowds out", why: "the wine's weight has no business on cold shellfish — needs acid, not structure" },
        { verb: "rolls over", why: "the elegant tannin crowds the brine without acid to bridge" },
        { verb: "flattens", why: "the elegant tannin buries the clean shellfish profile without complement" },
        { verb: "smothers", why: "the elegant tannin buries the clean shellfish profile without complement" },
      ],
      "starter-dairy": [
        { verb: "fights", why: "tannin and fresh dairy curdle texture-wise — the milky plate reads sour" },
        { verb: "clashes with", why: "red structure on burrata curdles the cream's clean delicacy" },
        { verb: "overwhelms", why: "medium-bodied red has no foil against fresh cream — needs structural cut" },
        { verb: "swallows", why: "the medium-bodied red weight buries the milky cheese plate's delicate frame" },
        { verb: "rolls over", why: "the medium-bodied red weight buries the milky cheese plate's delicate frame" },
      ],
      "starter-meat": [
        { verb: "underclubs", why: "the wine's register is right but this bottle reads short of the rich meat starter" },
        { verb: "swallows", why: "the medium-bodied red is capable but the rich meat starter deserves a more decisive call" },
        { verb: "overwhelms", why: "the elegant tannin reads thin against the iron richness — needs more weight" },
        { verb: "swallows", why: "this expression doesn't carry the meat opener — a bigger pour earns it" },
      ],
      "starter-herb": [
        { verb: "overshadows", why: "red structure flattens the herb-bright opener instead of carrying it" },
        { verb: "overwhelms", why: "the elegant tannin clashes with the bright herbal profile without bridge" },
        { verb: "overwhelms", why: "the medium-bodied red weight buries the dish's garlic-herb lift" },
        { verb: "overwhelms", why: "the elegant tannin rolls over the herb-bright opener" },
      ],
      "DEFAULT": [
        { verb: "overshadows", why: "the elegant red is built for the entrée, not the opener's lighter register" },
        { verb: "crushes", why: "medium-bodied red crowds the opening course instead of lifting it" },
        { verb: "buries", why: "medium-bodied red crowds the opening course instead of lifting it" },
        { verb: "buries", why: "the elegant tannin reads wrong-course for the table's opener" },
      ],
    },
    "steak": {
      "steak-big": [
        { verb: "underclubs", why: "the wine's register is right but this bottle reads short of the long-bone cut" },
        { verb: "falls short of", why: "a Pinot can't carry the marbled char of a 26+ oz cut — a structured Cab or Bordeaux earns it" },
        { verb: "flattens", why: "the elegant tannin underclubs the headline-cut weight" },
        { verb: "buries", why: "the elegant tannin underclubs the headline-cut weight" },
        { verb: "flattens", why: "needs more weight — the cut overshadows the medium-bodied red's frame" },
      ],
      "steak-medium": [
        { verb: "sits awkwardly with", why: "the wine is capable but the cut earns a denser, more structured red" },
        { verb: "buries", why: "the elegant tannin fights the strip-and-bone register" },
        { verb: "crowds out", why: "the elegant tannin reads off against the marbled mid-cut" },
        { verb: "rolls over", why: "the bottle's character is wrong direction for the mid-cut weight" },
      ],
      "steak-lean": [
        { verb: "mis-pairs with", why: "the bottle's weight lands at a lower tier than the filet deserves" },
        { verb: "crowds out", why: "the medium-bodied red register buries the cut's gentle tenderness" },
        { verb: "flattens", why: "spirit weight overshadows the lean cut's subtle profile" },
        { verb: "overwhelms", why: "spirit weight overshadows the lean cut's subtle profile" },
      ],
      "DEFAULT": [
        { verb: "underclubs", why: "the bottle's register lands at a lower tier than the cut deserves" },
        { verb: "crowds out", why: "medium-bodied red register clashes with the cut's headline frame" },
        { verb: "buries", why: "the elegant tannin reads wrong for the steak course" },
        { verb: "crushes", why: "medium-bodied red register clashes with the cut's headline frame" },
      ],
    },
  },
  "GIN": {
    "dessert": {
      "dessert-chocolate": [
        { verb: "fights", why: "juniper and cocoa refuse each other — botanical bitterness reads metallic against chocolate" },
        { verb: "clashes with", why: "gin botanicals jar against the chocolate's sweetness with no bridge" },
        { verb: "mis-pairs with", why: "the gin heat dulls the chocolate's lift instead of carrying it" },
        { verb: "underclubs", why: "the gin botanicals doubles the cocoa weight without lift" },
        { verb: "doesn't anchor", why: "the gin botanicals doubles the cocoa weight without lift" },
      ],
      "dessert-custard": [
        { verb: "jars against", why: "sharp botanicals cut through dairy custard without resolving — the dessert reads broken" },
        { verb: "reads off against", why: "gin weight and the custard's silk refuse each other" },
        { verb: "mis-pairs with", why: "gin weight and the custard's silk refuse each other" },
        { verb: "mis-pairs with", why: "the gin botanicals doubles the custard's sweetness without contrast" },
      ],
      "dessert-cake-spice": [
        { verb: "clashes with", why: "juniper-citrus and warm cake spices pull in opposite directions" },
        { verb: "jars against", why: "the gin botanicals overshadows the cake's warm-spice profile" },
        { verb: "reads off against", why: "spirit warmth on cake spice reads heavy — needs sweet wine pair" },
        { verb: "mis-pairs with", why: "the gin botanicals overshadows the cake's warm-spice profile" },
      ],
      "dessert-pastry": [
        { verb: "fights", why: "gin's herbal edge has no foil against warm pastry sugar — sharp meets sweet, neither wins" },
        { verb: "jars against", why: "spirit overshadows the warm-pastry delicacy — needs sweet liqueur" },
        { verb: "clashes with", why: "the gin botanicals and the dessert's lightness refuse each other" },
        { verb: "mis-pairs with", why: "spirit overshadows the warm-pastry delicacy — needs sweet liqueur" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "gin's botanical-citrus register fights dessert sweetness without a bridge" },
        { verb: "reads bitter against", why: "the gin weight has no bridge into dessert sweetness" },
        { verb: "jars against", why: "the gin weight has no bridge into dessert sweetness" },
        { verb: "jars against", why: "the gin botanicals is wrong-course energy for the dessert close" },
      ],
    },
    "starter": {
      "starter-shellfish": [
        { verb: "mis-pairs with", why: "this specific gin's botanical register fights the shellfish — Tanqueray or Plymouth carries it better" },
        { verb: "jars against", why: "wrong-course energy — shellfish needs crisp acidity, not gin weight" },
        { verb: "clashes with", why: "the gin botanicals buries the clean shellfish profile without complement" },
        { verb: "reads off against", why: "the gin botanicals buries the clean shellfish profile without complement" },
      ],
      "starter-meat": [
        { verb: "clashes with", why: "gin's herbal lift jars against rich meat opener — needs warmth, not citrus" },
        { verb: "can't carry", why: "spirit weight crowds the iron-savory starter without integration" },
        { verb: "falls short of", why: "this expression doesn't carry the meat opener — a bigger pour earns it" },
        { verb: "doesn't anchor", why: "spirit weight crowds the iron-savory starter without integration" },
      ],
      "starter-dairy": [
        { verb: "fights", why: "sharp botanicals cut through fresh dairy without bridging — texture reads broken" },
        { verb: "underclubs", why: "gin has no foil against fresh cream — needs structural cut" },
        { verb: "reads light against", why: "spirit warmth and fresh dairy refuse each other texturally" },
        { verb: "reads light against", why: "the gin botanicals curdles against fresh dairy without structural acid" },
      ],
      "DEFAULT": [
        { verb: "mis-pairs with", why: "this gin's botanical balance is wrong for the starter — a different gin would carry it" },
        { verb: "overwhelms", why: "gin crowds the opening course instead of lifting it" },
        { verb: "rolls over", why: "the gin botanicals reads wrong-course for the table's opener" },
        { verb: "overwhelms", why: "the gin botanicals reads wrong-course for the table's opener" },
      ],
    },
    "steak": {
      "steak-big": [
        { verb: "underclubs", why: "gin's light register can't carry the marbled char — the cut deserves a bigger pour" },
        { verb: "falls short of", why: "botanical-citrus can't stand up to 26+ ounces — a Cab or bourbon earns it" },
        { verb: "mis-pairs with", why: "this expression doesn't carry the 26+ ounce cut — a bigger pour earns it" },
        { verb: "reads light against", why: "this expression doesn't carry the 26+ ounce cut — a bigger pour earns it" },
        { verb: "doesn't anchor", why: "needs more weight — the cut overshadows the gin's frame" },
      ],
      "steak-medium": [
        { verb: "mis-pairs with", why: "gin's clean lift reads thin against the cut's weight" },
        { verb: "can't carry", why: "needs a Cab or whiskey at full register for this cut" },
        { verb: "underclubs", why: "the bottle's character is wrong direction for the mid-cut weight" },
        { verb: "reads light against", why: "the bottle's character is wrong direction for the mid-cut weight" },
      ],
      "steak-lean": [
        { verb: "sits awkwardly with", why: "the gin's herbal sharpness fights the filet's buttery delicacy" },
        { verb: "falls short of", why: "the gin botanicals crowds the filet's lean buttery frame — needs softer call" },
        { verb: "doesn't anchor", why: "the gin register buries the cut's gentle tenderness" },
        { verb: "reads light against", why: "the gin register buries the cut's gentle tenderness" },
      ],
      "DEFAULT": [
        { verb: "underclubs", why: "gin reads light against the prime cut's weight — needs a red or whiskey" },
        { verb: "doesn't anchor", why: "the gin botanicals reads wrong for the steak course" },
        { verb: "reads light against", why: "gin register clashes with the cut's headline frame" },
        { verb: "can't carry", why: "the gin character is misaligned with the protein's weight" },
      ],
    },
  },
  "HEAVY_SPIRIT": {
    "main": {
      "DEFAULT": [
        { verb: "overwhelms", why: "heavy spirit weight buries the main protein — needs a wine or lighter spirit" },
        { verb: "swallows", why: "the heavy spirit weight is misaligned with the protein's profile" },
        { verb: "flattens", why: "the heavy-spirit weight reads wrong against the main course's register" },
        { verb: "smothers", why: "the heavy-spirit weight reads wrong against the main course's register" },
      ],
    },
    "starter": {
      "DEFAULT": [
        { verb: "overwhelms", why: "the spirit's weight is too forward for the opening course" },
        { verb: "smothers", why: "the heavy-spirit weight reads wrong-course for the table's opener" },
        { verb: "swallows", why: "heavy spirit crowds the opening course instead of lifting it" },
        { verb: "rolls over", why: "heavy spirit crowds the opening course instead of lifting it" },
      ],
    },
  },
  "MEZCAL": {
    "main": {
      "main-fish-delicate": [
        { verb: "overwhelms", why: "mezcal smoke buries the delicate flesh — the fish has no foil against agave + smoke" },
        { verb: "swallows", why: "the mezcal smoke buries the delicate flesh without lifting it" },
        { verb: "buries", why: "mezcal weight has no bridge into the gentle fish profile" },
        { verb: "swallows", why: "the protein is too gentle for the mezcal register — needs a crisp white" },
      ],
      "main-fish-rich": [
        { verb: "clashes with", why: "mezcal smoke and the fish's natural oils refuse to meet cleanly" },
        { verb: "fights", why: "the mezcal smoke doubles the natural richness without contrast" },
        { verb: "fights", why: "mezcal weight and oily fish meet without integration — density on density" },
        { verb: "fights", why: "mezcal reads heavy on the oily protein — needs structural lift" },
      ],
      "main-fish-crusted": [
        { verb: "doubles down on", why: "mezcal smoke and the seared crust double up smoky char without contrast" },
        { verb: "jars against", why: "the mezcal register clashes with the rare flesh's mineral edge" },
        { verb: "jars against", why: "mezcal has no foil against the protein's signature finish" },
        { verb: "jars against", why: "spirit depth crowds the crust's sharp profile" },
      ],
      "DEFAULT": [
        { verb: "overwhelms", why: "mezcal smoke is wrong register for the main fish course" },
        { verb: "flattens", why: "spirit and main course refuse each other without bridge" },
        { verb: "rolls over", why: "spirit and main course refuse each other without bridge" },
        { verb: "rolls over", why: "the mezcal weight is misaligned with the protein's profile" },
      ],
    },
    "side": {
      "DEFAULT": [
        { verb: "overshadows", why: "mezcal smoke crowds the side without lifting it" },
        { verb: "overwhelms", why: "mezcal crowds the supporting course without lift" },
        { verb: "swallows", why: "the mezcal weight is misaligned with the side's lighter register" },
        { verb: "swallows", why: "the mezcal smoke reads wrong for the side course" },
      ],
    },
    "soup-salad": {
      "soup-salad-cream": [
        { verb: "clashes with", why: "mezcal smoke fights the soup's cream — smoke has no bridge into dairy delicacy" },
        { verb: "doubles down on", why: "spirit warmth and cream pull the same direction without bridge" },
        { verb: "jars against", why: "the mezcal smoke compounds the cream's richness without acid to clean" },
        { verb: "doubles down on", why: "the mezcal weight doubles the soup's density instead of lifting" },
      ],
      "soup-salad-broth": [
        { verb: "overwhelms", why: "mezcal's smoke crowds the broth's clean register without lifting it" },
        { verb: "swallows", why: "spirit register crowds the clean broth without integration" },
        { verb: "crushes", why: "spirit register crowds the clean broth without integration" },
        { verb: "crowds out", why: "spirit register crowds the clean broth without integration" },
      ],
      "soup-salad-greens": [
        { verb: "overwhelms", why: "smoke buries the salad's green delicacy — needs sparkling or crisp white" },
        { verb: "buries", why: "wrong direction — greens need bright acid, not mezcal weight" },
        { verb: "rolls over", why: "wrong direction — greens need bright acid, not mezcal weight" },
        { verb: "flattens", why: "wrong direction — greens need bright acid, not mezcal weight" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "mezcal smoke is wrong register for the soup-salad course" },
        { verb: "crushes", why: "mezcal crowds the opening course without complement" },
        { verb: "rolls over", why: "mezcal crowds the opening course without complement" },
        { verb: "buries", why: "mezcal crowds the opening course without complement" },
      ],
    },
    "starter": {
      "starter-shellfish": [
        { verb: "overwhelms", why: "mezcal smoke obliterates delicate shellfish — needs sparkling or sancerre" },
        { verb: "crowds out", why: "the mezcal smoke buries the clean shellfish profile without complement" },
        { verb: "swallows", why: "the mezcal smoke crowds the brine without acid to bridge" },
        { verb: "flattens", why: "wrong-course energy — shellfish needs crisp acidity, not mezcal weight" },
      ],
      "starter-dairy": [
        { verb: "clashes with", why: "smoke and fresh dairy refuse each other — texture reads broken" },
        { verb: "fights", why: "the mezcal weight buries the milky cheese plate's delicate frame" },
        { verb: "fights", why: "mezcal has no foil against fresh cream — needs structural cut" },
        { verb: "doubles down on", why: "the mezcal weight buries the milky cheese plate's delicate frame" },
      ],
      "DEFAULT": [
        { verb: "overwhelms", why: "mezcal smoke is too forward for the table's opener" },
        { verb: "crowds out", why: "mezcal crowds the opening course instead of lifting it" },
        { verb: "smothers", why: "the mezcal weight is misaligned with the starter's lighter register" },
        { verb: "flattens", why: "mezcal crowds the opening course instead of lifting it" },
      ],
    },
  },
  "RUM_LIGHT": {
    "dessert": {
      "dessert-chocolate": [
        { verb: "falls short of", why: "light spirit can't carry chocolate's weight — needs a richer pour like an aged rum or tawny" },
        { verb: "mis-pairs with", why: "the light rum heat dulls the chocolate's lift instead of carrying it" },
        { verb: "reads light against", why: "light rum register clashes with chocolate's rich finish — needs Port or amaro" },
        { verb: "doesn't anchor", why: "the rum lift doubles the cocoa weight without lift" },
      ],
      "dessert-custard": [
        { verb: "mis-pairs with", why: "the spirit reads thin against the custard's richness" },
        { verb: "reads off against", why: "spirit heat scorches the delicate vanilla-custard frame" },
        { verb: "jars against", why: "spirit heat scorches the delicate vanilla-custard frame" },
        { verb: "reads off against", why: "the rum lift doubles the custard's sweetness without contrast" },
      ],
      "DEFAULT": [
        { verb: "falls short of", why: "light spirit reads thin against dessert sweetness" },
        { verb: "jars against", why: "the rum lift is wrong-course energy for the dessert close" },
        { verb: "reads bitter against", why: "light rum register clashes with the dessert's sugar-and-spice register" },
        { verb: "clashes with", why: "the light rum weight has no bridge into dessert sweetness" },
      ],
    },
    "main": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "light spirit reads thin against a main protein — needs a fuller pour" },
        { verb: "flattens", why: "the rum lift reads wrong against the main course's register" },
        { verb: "crowds out", why: "the light rum weight is misaligned with the protein's profile" },
        { verb: "flattens", why: "spirit and main course refuse each other without bridge" },
      ],
    },
    "side": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "light spirit needs the cut, not the supporting plate" },
        { verb: "flattens", why: "the light rum weight is misaligned with the side's lighter register" },
        { verb: "crowds out", why: "light rum crowds the supporting course without lift" },
        { verb: "buries", why: "light rum crowds the supporting course without lift" },
      ],
    },
    "soup-salad": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "the light spirit doesn't add to the soup-salad course — neutral but wrong" },
        { verb: "rolls over", why: "the light rum weight is wrong moment for the course" },
        { verb: "crowds out", why: "the light rum weight is wrong moment for the course" },
        { verb: "rolls over", why: "the rum lift flattens the soup-or-salad course register" },
      ],
    },
    "starter": {
      "starter-meat": [
        { verb: "underclubs", why: "light spirit reads thin against the rich meat opener" },
        { verb: "mis-pairs with", why: "spirit weight crowds the iron-savory starter without integration" },
        { verb: "falls short of", why: "this expression doesn't carry the meat opener — a bigger pour earns it" },
        { verb: "doesn't anchor", why: "the light rum is capable but the rich meat starter deserves a more decisive call" },
      ],
      "DEFAULT": [
        { verb: "mis-pairs with", why: "this light spirit's register is wrong for the starter — try a different pour" },
        { verb: "crowds out", why: "light rum crowds the opening course instead of lifting it" },
        { verb: "crushes", why: "the rum lift reads wrong-course for the table's opener" },
        { verb: "crushes", why: "the light rum weight is misaligned with the starter's lighter register" },
      ],
    },
    "steak": {
      "steak-big": [
        { verb: "underclubs", why: "light spirit can't stand up to the marbled char — needs a Cab, bourbon, or añejo" },
        { verb: "can't carry", why: "this expression doesn't carry the 26+ ounce cut — a bigger pour earns it" },
        { verb: "falls short of", why: "needs more weight — the cut overshadows the light rum's frame" },
        { verb: "mis-pairs with", why: "the light rum register is right but this bottle reads short of the long-bone cut" },
      ],
      "steak-medium": [
        { verb: "underclubs", why: "light spirit reads thin against the cut's weight" },
        { verb: "doesn't anchor", why: "the bottle's character is wrong direction for the mid-cut weight" },
        { verb: "falls short of", why: "needs a Cab or whiskey at full register for this cut" },
        { verb: "mis-pairs with", why: "the rum lift reads off against the marbled mid-cut" },
      ],
      "steak-lean": [
        { verb: "mis-pairs with", why: "the spirit's register doesn't carry even the lean cut's structure" },
        { verb: "underclubs", why: "spirit weight overshadows the lean cut's subtle profile" },
        { verb: "underclubs", why: "the light rum register buries the cut's gentle tenderness" },
        { verb: "can't carry", why: "spirit weight overshadows the lean cut's subtle profile" },
      ],
      "DEFAULT": [
        { verb: "underclubs", why: "light spirit lands short of any prime cut" },
        { verb: "can't carry", why: "light rum register clashes with the cut's headline frame" },
        { verb: "can't carry", why: "the rum lift reads wrong for the steak course" },
        { verb: "can't carry", why: "the light rum character is misaligned with the protein's weight" },
      ],
    },
  },
  "SPARKLING": {
    "dessert": {
      "dessert-chocolate": [
        { verb: "clashes with", why: "brut bubbles and chocolate weight refuse each other — needs sweetness, not crisp acid" },
        { verb: "reads light against", why: "no bridge into the chocolate sweetness — sparkling jars instead" },
        { verb: "underclubs", why: "the sparkling heat dulls the chocolate's lift instead of carrying it" },
        { verb: "mis-pairs with", why: "the sparkling lift doubles the cocoa weight without lift" },
      ],
      "dessert-custard": [
        { verb: "jars against", why: "sparkling acid cuts through custard wrong — leaves the dessert reading sharp" },
        { verb: "reads off against", why: "the sparkling lift doubles the custard's sweetness without contrast" },
        { verb: "clashes with", why: "the sparkling spice register pulls against the custard's tang" },
        { verb: "reads off against", why: "spirit heat scorches the delicate vanilla-custard frame" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "a dry sparkling belongs with the opener, not the dessert close" },
        { verb: "mis-pairs with", why: "the sparkling lift is wrong-course energy for the dessert close" },
        { verb: "jars against", why: "the sparkling lift is wrong-course energy for the dessert close" },
        { verb: "fights", why: "the sparkling weight has no bridge into dessert sweetness" },
      ],
    },
    "main": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "this specific sparkling's register is wrong for the main — try a different brut or vintage" },
        { verb: "flattens", why: "the sparkling weight is misaligned with the protein's profile" },
        { verb: "smothers", why: "the sparkling lift reads wrong against the main course's register" },
        { verb: "overwhelms", why: "the sparkling weight is misaligned with the protein's profile" },
      ],
    },
    "side": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "sparkling is opener territory — the side reads small under its lift" },
        { verb: "smothers", why: "the sparkling lift reads wrong for the side course" },
        { verb: "flattens", why: "the sparkling weight is misaligned with the side's lighter register" },
        { verb: "crowds out", why: "sparkling crowds the supporting course without lift" },
      ],
    },
    "soup-salad": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "this sparkling's acidity is wrong direction for the soup-salad course" },
        { verb: "flattens", why: "the sparkling weight is wrong moment for the course" },
        { verb: "crushes", why: "the sparkling lift flattens the soup-or-salad course register" },
        { verb: "crowds out", why: "sparkling crowds the opening course without complement" },
      ],
    },
    "starter": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "this specific sparkling fights the starter — a different brut or rosé would carry it" },
        { verb: "smothers", why: "the sparkling weight is misaligned with the starter's lighter register" },
        { verb: "overwhelms", why: "sparkling crowds the opening course instead of lifting it" },
        { verb: "smothers", why: "sparkling crowds the opening course instead of lifting it" },
      ],
    },
    "steak": {
      "steak-big": [
        { verb: "underclubs", why: "sparkling reads light against the marbled char — the cut deserves a structured red" },
        { verb: "mis-pairs with", why: "needs more weight — the cut overshadows the sparkling's frame" },
        { verb: "can't carry", why: "the sparkling register is right but this bottle reads short of the long-bone cut" },
        { verb: "falls short of", why: "the sparkling register is right but this bottle reads short of the long-bone cut" },
      ],
      "DEFAULT": [
        { verb: "underclubs", why: "sparkling sits short of the prime cut's weight" },
        { verb: "reads light against", why: "the sparkling lift reads wrong for the steak course" },
        { verb: "falls short of", why: "sparkling register clashes with the cut's headline frame" },
        { verb: "can't carry", why: "the sparkling character is misaligned with the protein's weight" },
      ],
    },
  },
  "SWEET_LIQUEUR": {
    "dessert": {
      "dessert-chocolate": [
        { verb: "doubles down on", why: "two sweet registers without contrast — neither course lifts the other" },
        { verb: "mis-pairs with", why: "the liqueur sweetness doubles the cocoa weight without lift" },
        { verb: "jars against", why: "no bridge into the chocolate sweetness — sweet liqueur jars instead" },
        { verb: "mis-pairs with", why: "no bridge into the chocolate sweetness — sweet liqueur jars instead" },
      ],
      "dessert-custard": [
        { verb: "clashes with", why: "sweet liqueur and tangy custard refuse each other — sugar reads cloying, custard reads sharp" },
        { verb: "fights", why: "spirit heat scorches the delicate vanilla-custard frame" },
        { verb: "mis-pairs with", why: "spirit heat scorches the delicate vanilla-custard frame" },
        { verb: "mis-pairs with", why: "the sweet liqueur spice register pulls against the custard's tang" },
      ],
      "DEFAULT": [
        { verb: "doubles down on", why: "the liqueur compounds the dessert's sweetness without contrast" },
        { verb: "jars against", why: "the sweet liqueur weight has no bridge into dessert sweetness" },
        { verb: "fights", why: "the sweet liqueur weight has no bridge into dessert sweetness" },
        { verb: "mis-pairs with", why: "sweet liqueur register clashes with the dessert's sugar-and-spice register" },
      ],
    },
    "main": {
      "main-fish-delicate": [
        { verb: "overwhelms", why: "sugar on delicate fish is wrong direction — the plate needs acid, not sweetness" },
        { verb: "smothers", why: "the liqueur's sweet register buries the gentle flesh's lift" },
        { verb: "jars against", why: "the protein is too gentle for the sweet liqueur register — needs a crisp white" },
        { verb: "compounds the savory of", why: "sweet liqueur weight has no bridge into the gentle fish profile" },
        { verb: "compounds the savory of", why: "the liqueur sweetness flattens the clean flesh instead of carrying it" },
      ],
      "main-fish-rich": [
        { verb: "doubles down on", why: "the liqueur's sugar piles onto the fish's natural oils with no lift" },
        { verb: "clashes with", why: "dessert-grade sugar refuses the rich-fish course — needs a crisp white instead" },
        { verb: "jars against", why: "the liqueur sweetness doubles the natural richness without contrast" },
        { verb: "smothers", why: "sweet liqueur reads heavy on the oily protein — needs structural lift" },
        { verb: "compounds the savory of", why: "the liqueur sweetness doubles the natural richness without contrast" },
      ],
      "main-fish-crusted": [
        { verb: "fights", why: "sweet liqueur jars against the savory sear — no bridge between dessert sugar and a seared main" },
        { verb: "flattens", why: "sugar dulls the crust's clean char instead of carrying it" },
        { verb: "compounds the savory of", why: "spirit depth crowds the crust's sharp profile" },
        { verb: "smothers", why: "sweet liqueur has no foil against the protein's signature finish" },
        { verb: "doubles down on", why: "sweet liqueur has no foil against the protein's signature finish" },
      ],
      "main-poultry": [
        { verb: "buries", why: "sugar smothers the chicken's savory frame — wait for dessert" },
        { verb: "jars against", why: "needs a softer call — the sweet liqueur register is wrong direction for poultry" },
        { verb: "compounds the savory of", why: "the liqueur sweetness crowds the chicken's mild frame without complement" },
        { verb: "compounds the savory of", why: "the liqueur sweetness buries the bird's gentle savory register" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "a sweet liqueur is dessert-course energy — wrong register for any main protein" },
        { verb: "doubles down on", why: "the sweet liqueur weight is misaligned with the protein's profile" },
        { verb: "doubles down on", why: "spirit and main course refuse each other without bridge" },
        { verb: "smothers", why: "the sweet liqueur weight is misaligned with the protein's profile" },
      ],
    },
    "side": {
      "side-cream": [
        { verb: "doubles down on", why: "sweet liqueur and dairy-rich side double the indulgence with no contrast" },
        { verb: "overwhelms", why: "the liqueur's sugar buries the side's cream instead of lifting it" },
        { verb: "muddies", why: "the sweet liqueur weight and the side's cream pull the same direction" },
        { verb: "compounds the savory of", why: "the liqueur sweetness meets dairy richness with no contrast" },
        { verb: "compounds the savory of", why: "the sweet liqueur weight and the side's cream pull the same direction" },
      ],
      "side-vegetable": [
        { verb: "clashes with", why: "sugar on a clean vegetable side is wrong direction — needs herb-acid lift, not sweetness" },
        { verb: "doubles down on", why: "no bridge into the side's clean profile — spirit weight crowds" },
        { verb: "muddies", why: "the liqueur sweetness clashes with the vegetable's bright vegetal lift" },
        { verb: "doubles down on", why: "the liqueur sweetness clashes with the vegetable's bright vegetal lift" },
      ],
      "side-glazed": [
        { verb: "doubles down on", why: "sweet liqueur and a sweet glaze double the sugar register — no contrast left" },
        { verb: "compounds the savory of", why: "the sweet liqueur oak and the side's sugar register compound — no lift" },
        { verb: "compounds the savory of", why: "spirit warmth on glaze reads cloying — needs acidity" },
        { verb: "jars against", why: "the liqueur sweetness doubles the glaze's sweetness without contrast" },
      ],
      "side-earthy": [
        { verb: "fights", why: "the liqueur's sweet register pulls against the mushroom's umami without bridge" },
        { verb: "compounds the savory of", why: "the sweet liqueur register has nothing to meet the side's depth" },
        { verb: "muddies", why: "the liqueur sweetness fights the earthy umami without bridge" },
        { verb: "doubles down on", why: "spirit and earthy plate refuse each other — no integration" },
      ],
      "side-starch": [
        { verb: "flattens", why: "sugar on starch is dessert territory — wrong course for the supporting plate" },
        { verb: "jars against", why: "sweet liqueur register reads heavy against the side's mild profile" },
        { verb: "muddies", why: "sweet liqueur register reads heavy against the side's mild profile" },
        { verb: "muddies", why: "the sweet liqueur needs the cut, not the supporting starch plate" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "a sweet liqueur on a savory side is wrong-course energy" },
        { verb: "jars against", why: "the liqueur sweetness reads wrong for the side course" },
        { verb: "smothers", why: "sweet liqueur crowds the supporting course without lift" },
        { verb: "doubles down on", why: "the sweet liqueur weight is misaligned with the side's lighter register" },
      ],
    },
    "soup-salad": {
      "soup-salad-cream": [
        { verb: "doubles down on", why: "sugar piled onto cream is dessert-course energy on a savory plate — no contrast" },
        { verb: "overwhelms", why: "the liqueur's sweetness buries the soup's creamy base instead of supporting it" },
        { verb: "muddies", why: "the sweet liqueur weight doubles the soup's density instead of lifting" },
        { verb: "muddies", why: "spirit warmth and cream pull the same direction without bridge" },
        { verb: "muddies", why: "the liqueur sweetness meets the dairy cream with no contrast — both register heavy" },
      ],
      "soup-salad-broth": [
        { verb: "clashes with", why: "sweet liqueur on savory broth jars — sugar pulls one way, the salt-and-spice broth pulls the other" },
        { verb: "doubles down on", why: "sweet liqueur has no acid to balance the broth's savory base" },
        { verb: "smothers", why: "the liqueur sweetness and the salt-and-spice broth refuse each other" },
        { verb: "compounds the savory of", why: "spirit register crowds the clean broth without integration" },
      ],
      "soup-salad-greens": [
        { verb: "jars against", why: "sugar on cold lettuce reads like dressing gone wrong — needs acid, not sweetness" },
        { verb: "compounds the savory of", why: "the liqueur sweetness crowds the greens' bright edge without bridge" },
        { verb: "muddies", why: "sweet liqueur has no acid foil against the salad's clean profile" },
        { verb: "doubles down on", why: "sweet liqueur has no acid foil against the salad's clean profile" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "the soup-salad course needs lift or acid — sweet liqueur brings neither" },
        { verb: "compounds the savory of", why: "the sweet liqueur weight is wrong moment for the course" },
        { verb: "jars against", why: "the liqueur sweetness flattens the soup-or-salad course register" },
        { verb: "jars against", why: "the sweet liqueur weight is wrong moment for the course" },
      ],
    },
    "starter": {
      "starter-shellfish": [
        { verb: "overwhelms", why: "sweet liqueur on cold shellfish is wrong-course energy — too forward for a clean opener" },
        { verb: "smothers", why: "sugar buries the delicate shellfish without any acid to balance" },
        { verb: "compounds the savory of", why: "wrong-course energy — shellfish needs crisp acidity, not sweet liqueur weight" },
        { verb: "compounds the savory of", why: "the liqueur sweetness crowds the brine without acid to bridge" },
        { verb: "jars against", why: "wrong-course energy — shellfish needs crisp acidity, not sweet liqueur weight" },
      ],
      "starter-dairy": [
        { verb: "doubles down on", why: "sweet liqueur and fresh dairy compound the richness without contrast — heavy too early" },
        { verb: "jars against", why: "spirit warmth and fresh dairy refuse each other texturally" },
        { verb: "smothers", why: "the liqueur sweetness curdles against fresh dairy without structural acid" },
        { verb: "muddies", why: "spirit warmth and fresh dairy refuse each other texturally" },
      ],
      "starter-meat": [
        { verb: "flattens", why: "sugar dulls the savory edge of a rich meat opener instead of complementing it" },
        { verb: "compounds the savory of", why: "spirit weight crowds the iron-savory starter without integration" },
        { verb: "muddies", why: "spirit weight crowds the iron-savory starter without integration" },
        { verb: "smothers", why: "this expression doesn't carry the meat opener — a bigger pour earns it" },
      ],
      "starter-herb": [
        { verb: "buries", why: "sweet liqueur smothers the herb-bright opener instead of lifting it" },
        { verb: "doubles down on", why: "spirit register overshadows the herbal complexity — no contrast" },
        { verb: "jars against", why: "the sweet liqueur weight buries the dish's garlic-herb lift" },
        { verb: "smothers", why: "the liqueur sweetness rolls over the herb-bright opener" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "sweet liqueur is dessert energy — wrong place for the table's first course" },
        { verb: "doubles down on", why: "sweet liqueur crowds the opening course instead of lifting it" },
        { verb: "compounds the savory of", why: "the liqueur sweetness reads wrong-course for the table's opener" },
        { verb: "doubles down on", why: "the liqueur sweetness reads wrong-course for the table's opener" },
      ],
    },
    "steak": {
      "steak-big": [
        { verb: "clashes with", why: "sweet liqueur on the headline cut is dessert-course energy — save it for after the meal" },
        { verb: "flattens", why: "sugar dulls the marbled char instead of lifting it — the steak deserves a savory call" },
        { verb: "smothers", why: "the liqueur sweetness underclubs the headline-cut weight" },
        { verb: "muddies", why: "the sweet liqueur register is right but this bottle reads short of the long-bone cut" },
        { verb: "compounds the savory of", why: "the liqueur sweetness underclubs the headline-cut weight" },
      ],
      "steak-medium": [
        { verb: "clashes with", why: "a sweet liqueur belongs after the meal, not during the steak course" },
        { verb: "smothers", why: "the liqueur sweetness fights the strip-and-bone register" },
        { verb: "smothers", why: "the bottle's character is wrong direction for the mid-cut weight" },
        { verb: "compounds the savory of", why: "the liqueur sweetness reads off against the marbled mid-cut" },
      ],
      "steak-lean": [
        { verb: "overwhelms", why: "the liqueur's sugar buries the lean cut's buttery delicacy" },
        { verb: "jars against", why: "the liqueur sweetness crowds the filet's lean buttery frame — needs softer call" },
        { verb: "compounds the savory of", why: "the liqueur sweetness crowds the filet's lean buttery frame — needs softer call" },
        { verb: "doubles down on", why: "the sweet liqueur register buries the cut's gentle tenderness" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "sweet liqueur is post-meal territory — wrong register for any steak course" },
        { verb: "doubles down on", why: "the liqueur sweetness reads wrong for the steak course" },
        { verb: "jars against", why: "sweet liqueur register clashes with the cut's headline frame" },
        { verb: "smothers", why: "sweet liqueur register clashes with the cut's headline frame" },
      ],
    },
  },
  "SWEET_WINE": {
    "main": {
      "main-fish-delicate": [
        { verb: "overwhelms", why: "dessert wine on delicate fish is wrong-course energy — needs a dry white, not honeyed sugar" },
        { verb: "smothers", why: "the wine's sweetness buries the gentle flesh's lift" },
        { verb: "jars against", why: "the sweet-wine sugar flattens the clean flesh instead of carrying it" },
        { verb: "compounds the savory of", why: "the sweet-wine sugar flattens the clean flesh instead of carrying it" },
        { verb: "jars against", why: "the sweet-wine sugar buries the delicate flesh without lifting it" },
      ],
      "main-fish-rich": [
        { verb: "doubles down on", why: "honeyed wine and oily fish double up richness with no contrast" },
        { verb: "clashes with", why: "dessert sugar refuses the rich-fish course — needs acid, not sweetness" },
        { verb: "compounds the savory of", why: "sweet wine weight and oily fish meet without integration — density on density" },
        { verb: "jars against", why: "no acid to cut the rich flesh — the spirit just compounds the weight" },
        { verb: "muddies", why: "sweet wine weight and oily fish meet without integration — density on density" },
      ],
      "main-fish-crusted": [
        { verb: "flattens", why: "sweet wine dulls the sear's clean char — savory main deserves a dry pour" },
        { verb: "jars against", why: "spirit depth crowds the crust's sharp profile" },
        { verb: "compounds the savory of", why: "sweet wine has no foil against the protein's signature finish" },
        { verb: "smothers", why: "the sweet-wine sugar flattens the seared crust without complement" },
      ],
      "main-poultry": [
        { verb: "buries", why: "dessert wine on chicken is wrong course — sugar smothers the herbed-skin frame" },
        { verb: "compounds the savory of", why: "needs a softer call — the sweet wine register is wrong direction for poultry" },
        { verb: "muddies", why: "the sweet-wine sugar crowds the chicken's mild frame without complement" },
        { verb: "compounds the savory of", why: "the sweet-wine sugar buries the bird's gentle savory register" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "dessert wine on a main protein is wrong-course energy" },
        { verb: "compounds the savory of", why: "spirit and main course refuse each other without bridge" },
        { verb: "smothers", why: "the sweet wine weight is misaligned with the protein's profile" },
        { verb: "jars against", why: "spirit and main course refuse each other without bridge" },
      ],
    },
    "side": {
      "side-cream": [
        { verb: "doubles down on", why: "sweet wine and a dairy side compound the richness — dessert energy on savory plate" },
        { verb: "smothers", why: "the sweet-wine sugar compounds the cream side without structural cut" },
        { verb: "muddies", why: "the sweet-wine sugar meets dairy richness with no contrast" },
        { verb: "compounds the savory of", why: "the sweet-wine sugar compounds the cream side without structural cut" },
      ],
      "side-vegetable": [
        { verb: "clashes with", why: "sweet wine on green vegetable is wrong direction — needs crisp white" },
        { verb: "muddies", why: "no bridge into the side's clean profile — spirit weight crowds" },
        { verb: "doubles down on", why: "no bridge into the side's clean profile — spirit weight crowds" },
        { verb: "compounds the savory of", why: "the sweet wine register is wrong for a clean vegetable side — needs crisp white" },
      ],
      "side-glazed": [
        { verb: "doubles down on", why: "sweet wine and a sweet glaze double the sugar register — no foil" },
        { verb: "jars against", why: "spirit warmth on glaze reads cloying — needs acidity" },
        { verb: "muddies", why: "the sweet-wine sugar doubles the glaze's sweetness without contrast" },
        { verb: "smothers", why: "the sweet-wine sugar doubles the glaze's sweetness without contrast" },
      ],
      "side-starch": [
        { verb: "flattens", why: "dessert sugar on starch is wrong-course energy for the supporting plate" },
        { verb: "smothers", why: "the sweet wine needs the cut, not the supporting starch plate" },
        { verb: "muddies", why: "the sweet-wine sugar overshadows the side's neutral frame" },
        { verb: "compounds the savory of", why: "sweet wine register reads heavy against the side's mild profile" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "sweet wine on a savory side is wrong-course energy" },
        { verb: "muddies", why: "sweet wine crowds the supporting course without lift" },
        { verb: "smothers", why: "sweet wine crowds the supporting course without lift" },
        { verb: "compounds the savory of", why: "the sweet-wine sugar reads wrong for the side course" },
      ],
    },
    "soup-salad": {
      "soup-salad-cream": [
        { verb: "doubles down on", why: "sweet wine on cream is dessert-course energy on a savory plate — heavy, no contrast" },
        { verb: "smothers", why: "the sweet-wine sugar compounds the cream's richness without acid to clean" },
        { verb: "jars against", why: "the sweet-wine sugar compounds the cream's richness without acid to clean" },
        { verb: "smothers", why: "the sweet-wine sugar meets the dairy cream with no contrast — both register heavy" },
      ],
      "soup-salad-broth": [
        { verb: "clashes with", why: "honeyed sugar on savory broth jars — wrong direction for the course" },
        { verb: "muddies", why: "sweet wine has no acid to balance the broth's savory base" },
        { verb: "smothers", why: "spirit register crowds the clean broth without integration" },
        { verb: "doubles down on", why: "spirit register crowds the clean broth without integration" },
      ],
      "soup-salad-greens": [
        { verb: "jars against", why: "sweet wine on cold lettuce refuses the salad's clean register" },
        { verb: "smothers", why: "sweet wine has no acid foil against the salad's clean profile" },
        { verb: "smothers", why: "the sweet-wine sugar crowds the greens' bright edge without bridge" },
        { verb: "smothers", why: "wrong direction — greens need bright acid, not sweet wine weight" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "the soup-salad course needs acid, not dessert sugar" },
        { verb: "compounds the savory of", why: "the sweet wine weight is wrong moment for the course" },
        { verb: "jars against", why: "the sweet-wine sugar flattens the soup-or-salad course register" },
        { verb: "compounds the savory of", why: "sweet wine crowds the opening course without complement" },
      ],
    },
    "starter": {
      "starter-shellfish": [
        { verb: "overwhelms", why: "dessert sugar on cold shellfish is wrong direction — needs sparkling or Sancerre" },
        { verb: "compounds the savory of", why: "wrong-course energy — shellfish needs crisp acidity, not sweet wine weight" },
        { verb: "compounds the savory of", why: "the sweet wine register flattens the briny opener instead of lifting it" },
        { verb: "doubles down on", why: "wrong-course energy — shellfish needs crisp acidity, not sweet wine weight" },
      ],
      "starter-dairy": [
        { verb: "doubles down on", why: "sweet wine and fresh dairy compound the richness with no foil" },
        { verb: "compounds the savory of", why: "sweet wine has no foil against fresh cream — needs structural cut" },
        { verb: "jars against", why: "the sweet-wine sugar curdles against fresh dairy without structural acid" },
        { verb: "muddies", why: "the sweet wine weight buries the milky cheese plate's delicate frame" },
      ],
      "starter-meat": [
        { verb: "flattens", why: "honeyed sugar dulls the savory meat opener instead of lifting it" },
        { verb: "jars against", why: "spirit weight crowds the iron-savory starter without integration" },
        { verb: "jars against", why: "this expression doesn't carry the meat opener — a bigger pour earns it" },
        { verb: "jars against", why: "the sweet wine is capable but the rich meat starter deserves a more decisive call" },
      ],
      "starter-herb": [
        { verb: "buries", why: "dessert sugar buries the herb-bright opener — wait for dessert" },
        { verb: "smothers", why: "the sweet-wine sugar rolls over the herb-bright opener" },
        { verb: "muddies", why: "spirit register overshadows the herbal complexity — no contrast" },
        { verb: "smothers", why: "spirit register overshadows the herbal complexity — no contrast" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "dessert wine is wrong-course energy for the opener" },
        { verb: "muddies", why: "the sweet wine weight is misaligned with the starter's lighter register" },
        { verb: "muddies", why: "sweet wine crowds the opening course instead of lifting it" },
        { verb: "compounds the savory of", why: "sweet wine crowds the opening course instead of lifting it" },
      ],
    },
    "steak": {
      "steak-big": [
        { verb: "clashes with", why: "dessert wine on prime cut is wrong-course entirely — save it for after" },
        { verb: "flattens", why: "honeyed sugar dulls the marbled char — the steak earns a savory pour" },
        { verb: "doubles down on", why: "the sweet-wine sugar underclubs the headline-cut weight" },
        { verb: "smothers", why: "this expression doesn't carry the 26+ ounce cut — a bigger pour earns it" },
        { verb: "doubles down on", why: "this expression doesn't carry the 26+ ounce cut — a bigger pour earns it" },
      ],
      "steak-medium": [
        { verb: "clashes with", why: "dessert wine belongs after the meal, not alongside the steak" },
        { verb: "muddies", why: "the sweet-wine sugar fights the strip-and-bone register" },
        { verb: "doubles down on", why: "the bottle's character is wrong direction for the mid-cut weight" },
        { verb: "jars against", why: "the sweet-wine sugar fights the strip-and-bone register" },
      ],
      "steak-lean": [
        { verb: "overwhelms", why: "sweet wine smothers the lean cut's buttery delicacy" },
        { verb: "smothers", why: "the sweet-wine sugar clashes with the tenderloin's delicate finish" },
        { verb: "jars against", why: "spirit weight overshadows the lean cut's subtle profile" },
        { verb: "smothers", why: "spirit weight overshadows the lean cut's subtle profile" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "dessert wine is post-meal — wrong register for the steak course" },
        { verb: "doubles down on", why: "the sweet wine character is misaligned with the protein's weight" },
        { verb: "doubles down on", why: "the sweet-wine sugar reads wrong for the steak course" },
        { verb: "jars against", why: "the sweet-wine sugar reads wrong for the steak course" },
      ],
    },
  },
  "TEQUILA_BLANCO": {
    "dessert": {
      "dessert-chocolate": [
        { verb: "falls short of", why: "light spirit can't carry chocolate's weight — needs a richer pour like an aged rum or tawny" },
        { verb: "reads light against", why: "blanco tequila register clashes with chocolate's rich finish — needs Port or amaro" },
        { verb: "doesn't anchor", why: "blanco tequila register clashes with chocolate's rich finish — needs Port or amaro" },
        { verb: "reads light against", why: "the blanco-agave lift doubles the cocoa weight without lift" },
      ],
      "dessert-custard": [
        { verb: "mis-pairs with", why: "the spirit reads thin against the custard's richness" },
        { verb: "reads off against", why: "spirit heat scorches the delicate vanilla-custard frame" },
        { verb: "reads off against", why: "the blanco-agave lift doubles the custard's sweetness without contrast" },
        { verb: "clashes with", why: "the blanco tequila spice register pulls against the custard's tang" },
      ],
      "DEFAULT": [
        { verb: "falls short of", why: "light spirit reads thin against dessert sweetness" },
        { verb: "reads bitter against", why: "the blanco tequila weight has no bridge into dessert sweetness" },
        { verb: "clashes with", why: "the blanco tequila weight has no bridge into dessert sweetness" },
        { verb: "fights", why: "the blanco-agave lift is wrong-course energy for the dessert close" },
      ],
    },
    "main": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "light spirit reads thin against a main protein — needs a fuller pour" },
        { verb: "crowds out", why: "spirit and main course refuse each other without bridge" },
        { verb: "rolls over", why: "the blanco-agave lift reads wrong against the main course's register" },
        { verb: "rolls over", why: "spirit and main course refuse each other without bridge" },
      ],
    },
    "side": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "light spirit needs the cut, not the supporting plate" },
        { verb: "crowds out", why: "the blanco-agave lift reads wrong for the side course" },
        { verb: "crushes", why: "blanco tequila crowds the supporting course without lift" },
        { verb: "overwhelms", why: "blanco tequila crowds the supporting course without lift" },
      ],
    },
    "soup-salad": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "the light spirit doesn't add to the soup-salad course — neutral but wrong" },
        { verb: "rolls over", why: "the blanco-agave lift flattens the soup-or-salad course register" },
        { verb: "crowds out", why: "the blanco-agave lift flattens the soup-or-salad course register" },
        { verb: "rolls over", why: "the blanco tequila weight is wrong moment for the course" },
      ],
    },
    "starter": {
      "starter-meat": [
        { verb: "underclubs", why: "light spirit reads thin against the rich meat opener" },
        { verb: "can't carry", why: "this expression doesn't carry the meat opener — a bigger pour earns it" },
        { verb: "mis-pairs with", why: "the blanco-agave lift reads thin against the iron richness — needs more weight" },
        { verb: "reads light against", why: "this expression doesn't carry the meat opener — a bigger pour earns it" },
      ],
      "DEFAULT": [
        { verb: "mis-pairs with", why: "this light spirit's register is wrong for the starter — try a different pour" },
        { verb: "flattens", why: "blanco tequila crowds the opening course instead of lifting it" },
        { verb: "swallows", why: "blanco tequila crowds the opening course instead of lifting it" },
        { verb: "rolls over", why: "the blanco-agave lift reads wrong-course for the table's opener" },
      ],
    },
    "steak": {
      "steak-big": [
        { verb: "underclubs", why: "light spirit can't stand up to the marbled char — needs a Cab, bourbon, or añejo" },
        { verb: "falls short of", why: "the blanco tequila register is right but this bottle reads short of the long-bone cut" },
        { verb: "reads light against", why: "the blanco tequila register is right but this bottle reads short of the long-bone cut" },
        { verb: "reads light against", why: "the blanco-agave lift underclubs the headline-cut weight" },
      ],
      "steak-medium": [
        { verb: "underclubs", why: "light spirit reads thin against the cut's weight" },
        { verb: "falls short of", why: "the bottle's character is wrong direction for the mid-cut weight" },
        { verb: "reads light against", why: "the blanco-agave lift reads off against the marbled mid-cut" },
        { verb: "doesn't anchor", why: "needs a Cab or whiskey at full register for this cut" },
      ],
      "steak-lean": [
        { verb: "mis-pairs with", why: "the spirit's register doesn't carry even the lean cut's structure" },
        { verb: "underclubs", why: "spirit weight overshadows the lean cut's subtle profile" },
        { verb: "doesn't anchor", why: "spirit weight overshadows the lean cut's subtle profile" },
        { verb: "can't carry", why: "spirit weight overshadows the lean cut's subtle profile" },
      ],
      "DEFAULT": [
        { verb: "underclubs", why: "light spirit lands short of any prime cut" },
        { verb: "can't carry", why: "blanco tequila register clashes with the cut's headline frame" },
        { verb: "doesn't anchor", why: "the blanco tequila character is misaligned with the protein's weight" },
        { verb: "doesn't anchor", why: "the blanco-agave lift reads wrong for the steak course" },
      ],
    },
  },
  "TEQUILA_BOLD": {
    "dessert": {
      "dessert-chocolate": [
        { verb: "clashes with", why: "aged-agave register fights chocolate sweetness without bridging" },
        { verb: "buries", why: "no bridge into the chocolate sweetness — aged tequila jars instead" },
        { verb: "crowds out", why: "no bridge into the chocolate sweetness — aged tequila jars instead" },
        { verb: "overwhelms", why: "the aged tequila heat dulls the chocolate's lift instead of carrying it" },
      ],
      "dessert-custard": [
        { verb: "jars against", why: "añejo weight and custard tang refuse each other" },
        { verb: "buries", why: "the aged tequila spice register pulls against the custard's tang" },
        { verb: "rolls over", why: "spirit heat scorches the delicate vanilla-custard frame" },
        { verb: "overwhelms", why: "the aged-agave weight doubles the custard's sweetness without contrast" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "aged tequila has nothing to bridge into dessert" },
        { verb: "mis-pairs with", why: "the aged-agave weight is wrong-course energy for the dessert close" },
        { verb: "reads bitter against", why: "aged tequila register clashes with the dessert's sugar-and-spice register" },
        { verb: "jars against", why: "aged tequila register clashes with the dessert's sugar-and-spice register" },
      ],
    },
    "main": {
      "main-fish-delicate": [
        { verb: "overwhelms", why: "aged-agave weight buries the delicate flesh — agave register is wrong for fish" },
        { verb: "flattens", why: "the protein is too gentle for the aged tequila register — needs a crisp white" },
        { verb: "swallows", why: "the aged-agave weight flattens the clean flesh instead of carrying it" },
        { verb: "smothers", why: "the aged-agave weight flattens the clean flesh instead of carrying it" },
      ],
      "main-fish-rich": [
        { verb: "clashes with", why: "agave and oily fish refuse each other — the fish needs acid, not aged spirit" },
        { verb: "jars against", why: "aged tequila reads heavy on the oily protein — needs structural lift" },
        { verb: "compounds", why: "aged tequila reads heavy on the oily protein — needs structural lift" },
        { verb: "doubles down on", why: "no acid to cut the rich flesh — the spirit just compounds the weight" },
      ],
      "main-fish-crusted": [
        { verb: "fights", why: "the cask-aged agave register pulls against the savory sear" },
        { verb: "doubles down on", why: "the aged tequila register clashes with the rare flesh's mineral edge" },
        { verb: "clashes with", why: "the aged tequila register clashes with the rare flesh's mineral edge" },
        { verb: "doubles down on", why: "aged tequila has no foil against the protein's signature finish" },
      ],
      "main-poultry": [
        { verb: "overshadows", why: "añejo weight buries the chicken's herbed-skin delicacy" },
        { verb: "smothers", why: "needs a softer call — the aged tequila register is wrong direction for poultry" },
        { verb: "swallows", why: "needs a softer call — the aged tequila register is wrong direction for poultry" },
        { verb: "crowds out", why: "the aged tequila weight overshadows the herbed crisp skin" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "aged tequila is wrong register for a main fish or poultry course" },
        { verb: "flattens", why: "the aged tequila weight is misaligned with the protein's profile" },
        { verb: "crowds out", why: "the aged tequila weight is misaligned with the protein's profile" },
        { verb: "smothers", why: "the aged-agave weight reads wrong against the main course's register" },
      ],
    },
    "starter": {
      "starter-shellfish": [
        { verb: "overwhelms", why: "añejo weight has no foil against cold shellfish — needs sparkling or crisp white" },
        { verb: "smothers", why: "aged-agave register crowds the delicate shellfish frame" },
        { verb: "crushes", why: "the aged tequila register flattens the briny opener instead of lifting it" },
        { verb: "swallows", why: "the aged-agave weight crowds the brine without acid to bridge" },
        { verb: "buries", why: "wrong-course energy — shellfish needs crisp acidity, not aged tequila weight" },
      ],
      "starter-dairy": [
        { verb: "fights", why: "agave and fresh dairy refuse each other texturally" },
        { verb: "doubles down on", why: "aged tequila has no foil against fresh cream — needs structural cut" },
        { verb: "clashes with", why: "spirit warmth and fresh dairy refuse each other texturally" },
        { verb: "doubles down on", why: "spirit warmth and fresh dairy refuse each other texturally" },
      ],
      "starter-meat": [
        { verb: "mis-pairs with", why: "añejo could work but this specific bottle is wrong register for the meat opener" },
        { verb: "fights", why: "spirit weight crowds the iron-savory starter without integration" },
        { verb: "compounds", why: "spirit weight crowds the iron-savory starter without integration" },
        { verb: "compounds", why: "this expression doesn't carry the meat opener — a bigger pour earns it" },
      ],
      "starter-herb": [
        { verb: "overshadows", why: "aged tequila weight buries the herb-bright opener" },
        { verb: "crowds out", why: "the aged tequila weight buries the dish's garlic-herb lift" },
        { verb: "crushes", why: "spirit register overshadows the herbal complexity — no contrast" },
        { verb: "rolls over", why: "spirit register overshadows the herbal complexity — no contrast" },
      ],
      "DEFAULT": [
        { verb: "overwhelms", why: "aged tequila is too forward for the opening course" },
        { verb: "rolls over", why: "the aged tequila weight is misaligned with the starter's lighter register" },
        { verb: "smothers", why: "the aged-agave weight reads wrong-course for the table's opener" },
        { verb: "flattens", why: "aged tequila crowds the opening course instead of lifting it" },
      ],
    },
    "steak": {
      "steak-big": [
        { verb: "mis-pairs with", why: "añejo could pair with steak but this bottle reads short of the headline cut" },
        { verb: "fights", why: "needs more weight — the cut overshadows the aged tequila's frame" },
        { verb: "clashes with", why: "the aged-agave weight underclubs the headline-cut weight" },
        { verb: "clashes with", why: "this expression doesn't carry the 26+ ounce cut — a bigger pour earns it" },
      ],
      "steak-lean": [
        { verb: "overwhelms", why: "aged-agave weight crowds the lean cut's buttery delicacy" },
        { verb: "clashes with", why: "the aged-agave weight clashes with the tenderloin's delicate finish" },
        { verb: "clashes with", why: "the aged tequila register buries the cut's gentle tenderness" },
        { verb: "doubles down on", why: "the aged tequila register buries the cut's gentle tenderness" },
      ],
      "DEFAULT": [
        { verb: "underclubs", why: "this expression lands short of the cut's register" },
        { verb: "clashes with", why: "aged tequila register clashes with the cut's headline frame" },
        { verb: "fights", why: "the aged tequila character is misaligned with the protein's weight" },
        { verb: "jars against", why: "the aged tequila character is misaligned with the protein's weight" },
      ],
    },
  },
  "VODKA": {
    "dessert": {
      "dessert-chocolate": [
        { verb: "falls short of", why: "vodka brings no flavor to bridge the chocolate's weight — neutral but wrong for the close" },
        { verb: "mis-pairs with", why: "the vodka heat dulls the chocolate's lift instead of carrying it" },
        { verb: "mis-pairs with", why: "the vodka neutrality doubles the cocoa weight without lift" },
        { verb: "underclubs", why: "the vodka neutrality doubles the cocoa weight without lift" },
      ],
      "dessert-custard": [
        { verb: "mis-pairs with", why: "clean vodka has nothing to add against the custard's richness" },
        { verb: "jars against", why: "the vodka spice register pulls against the custard's tang" },
        { verb: "reads off against", why: "the vodka neutrality doubles the custard's sweetness without contrast" },
        { verb: "clashes with", why: "the vodka neutrality doubles the custard's sweetness without contrast" },
      ],
      "DEFAULT": [
        { verb: "falls short of", why: "vodka brings no anchor — the dessert needs a flavor partner, not a clean spirit" },
        { verb: "mis-pairs with", why: "the vodka neutrality is wrong-course energy for the dessert close" },
        { verb: "fights", why: "the vodka neutrality is wrong-course energy for the dessert close" },
        { verb: "mis-pairs with", why: "vodka register clashes with the dessert's sugar-and-spice register" },
      ],
    },
    "steak": {
      "steak-big": [
        { verb: "underclubs", why: "vodka is neutral by design — the marbled char deserves a pour with character" },
        { verb: "can't carry", why: "this expression doesn't carry the 26+ ounce cut — a bigger pour earns it" },
        { verb: "doesn't anchor", why: "the vodka neutrality underclubs the headline-cut weight" },
        { verb: "doesn't anchor", why: "the vodka register is right but this bottle reads short of the long-bone cut" },
      ],
      "steak-medium": [
        { verb: "mis-pairs with", why: "clean vodka reads thin against the cut's weight — needs a wine or whiskey" },
        { verb: "doesn't anchor", why: "needs a Cab or whiskey at full register for this cut" },
        { verb: "falls short of", why: "needs a Cab or whiskey at full register for this cut" },
        { verb: "doesn't anchor", why: "the vodka neutrality fights the strip-and-bone register" },
      ],
      "steak-lean": [
        { verb: "mis-pairs with", why: "vodka adds nothing to the filet's register — try a softer red or aged spirit" },
        { verb: "reads light against", why: "the vodka neutrality crowds the filet's lean buttery frame — needs softer call" },
        { verb: "doesn't anchor", why: "the vodka register buries the cut's gentle tenderness" },
        { verb: "doesn't anchor", why: "the vodka neutrality crowds the filet's lean buttery frame — needs softer call" },
      ],
      "DEFAULT": [
        { verb: "underclubs", why: "vodka is too neutral to carry any prime cut" },
        { verb: "falls short of", why: "the vodka character is misaligned with the protein's weight" },
        { verb: "doesn't anchor", why: "vodka register clashes with the cut's headline frame" },
        { verb: "doesn't anchor", why: "the vodka character is misaligned with the protein's weight" },
      ],
    },
  },
  "WHITE_WINE": {
    "dessert": {
      "dessert-chocolate": [
        { verb: "falls short of", why: "dry white can't carry chocolate's weight — needs a tawny or sweet wine for the close" },
        { verb: "doesn't anchor", why: "the white wine heat dulls the chocolate's lift instead of carrying it" },
        { verb: "can't carry", why: "no bridge into the chocolate sweetness — white wine jars instead" },
        { verb: "reads light against", why: "no bridge into the chocolate sweetness — white wine jars instead" },
      ],
      "dessert-custard": [
        { verb: "clashes with", why: "dry-white acidity and dessert tang refuse each other without sweetness to bridge" },
        { verb: "reads off against", why: "the white-wine acid doubles the custard's sweetness without contrast" },
        { verb: "mis-pairs with", why: "white wine weight and the custard's silk refuse each other" },
        { verb: "jars against", why: "white wine weight and the custard's silk refuse each other" },
      ],
      "DEFAULT": [
        { verb: "clashes with", why: "a dry white belongs with the main course, not the dessert close" },
        { verb: "mis-pairs with", why: "white wine register clashes with the dessert's sugar-and-spice register" },
        { verb: "jars against", why: "the white wine weight has no bridge into dessert sweetness" },
        { verb: "fights", why: "the white wine weight has no bridge into dessert sweetness" },
      ],
    },
    "side": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "this white sits awkwardly with the side — needs the entrée or a different pour" },
        { verb: "flattens", why: "the white-wine acid reads wrong for the side course" },
        { verb: "smothers", why: "the white-wine acid reads wrong for the side course" },
        { verb: "smothers", why: "white wine crowds the supporting course without lift" },
      ],
    },
    "soup-salad": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "this specific white's register doesn't lift the soup-salad — try a brighter or more aromatic white" },
        { verb: "smothers", why: "white wine crowds the opening course without complement" },
        { verb: "rolls over", why: "the white-wine acid flattens the soup-or-salad course register" },
        { verb: "crowds out", why: "white wine crowds the opening course without complement" },
      ],
    },
    "starter": {
      "DEFAULT": [
        { verb: "mis-pairs with", why: "this white's register is wrong for the starter — a different white or sparkling would lift it" },
        { verb: "crowds out", why: "the white-wine acid reads wrong-course for the table's opener" },
        { verb: "rolls over", why: "the white-wine acid reads wrong-course for the table's opener" },
        { verb: "flattens", why: "white wine crowds the opening course instead of lifting it" },
      ],
    },
    "steak": {
      "steak-big": [
        { verb: "underclubs", why: "white wine can't stand up to the marbled char — the cut earns a structured red or whiskey" },
        { verb: "falls short of", why: "crisp white reads thin against 26+ ounces of cap-fat ribeye" },
        { verb: "can't carry", why: "this expression doesn't carry the 26+ ounce cut — a bigger pour earns it" },
        { verb: "doesn't anchor", why: "the white wine register is right but this bottle reads short of the long-bone cut" },
        { verb: "reads light against", why: "needs more weight — the cut overshadows the white wine's frame" },
      ],
      "steak-medium": [
        { verb: "underclubs", why: "white wine reads light against the cut's weight — a Pinot or Cab would carry it" },
        { verb: "reads light against", why: "needs a Cab or whiskey at full register for this cut" },
        { verb: "falls short of", why: "the bottle's character is wrong direction for the mid-cut weight" },
        { verb: "falls short of", why: "needs a Cab or whiskey at full register for this cut" },
      ],
      "steak-lean": [
        { verb: "mis-pairs with", why: "this white's register is wrong for the filet — a softer red would bridge better" },
        { verb: "underclubs", why: "the white-wine acid crowds the filet's lean buttery frame — needs softer call" },
        { verb: "doesn't anchor", why: "the white wine register buries the cut's gentle tenderness" },
        { verb: "falls short of", why: "the white-wine acid clashes with the tenderloin's delicate finish" },
      ],
      "DEFAULT": [
        { verb: "underclubs", why: "white wine reads thin against any prime cut" },
        { verb: "can't carry", why: "white wine register clashes with the cut's headline frame" },
        { verb: "can't carry", why: "the white-wine acid reads wrong for the steak course" },
        { verb: "reads light against", why: "the white-wine acid reads wrong for the steak course" },
      ],
    },
  },
};

function pickAvoidReasoning(drinkClass, food, pairKey) {
  const classCells = AVOID_REASONING_POOL[drinkClass];
  if (!classCells) return null;
  const foodCategory = typeof food === 'string' ? null : food.category;
  if (!foodCategory) return null;
  const cell = classCells[foodCategory];
  if (!cell || typeof cell !== 'object' || Array.isArray(cell)) return null;
  const archetype = foodArchetypeFor(food);
  const archetypePool = archetype && Array.isArray(cell[archetype]) ? cell[archetype] : [];
  const defaultPool = Array.isArray(cell.DEFAULT) ? cell.DEFAULT : [];
  const combined = archetypePool.concat(defaultPool);
  if (combined.length === 0) return null;
  const hash = crypto.createHash('md5').update(pairKey).digest('hex');
  const idx = parseInt(hash.slice(0, 8), 16) % combined.length;
  return combined[idx];
}

function coverageReport() {
  const out = { classes: 0, cells: 0, archetypes: 0, entries: 0, byClass: {} };
  for (const [dc, classCells] of Object.entries(AVOID_REASONING_POOL)) {
    let classEntries = 0, classCellsCount = 0, classArchetypes = 0;
    const cellInfo = {};
    for (const [fcat, cell] of Object.entries(classCells)) {
      if (!cell || typeof cell !== 'object') continue;
      const archInfo = {};
      let cellEntries = 0;
      for (const [arch, arr] of Object.entries(cell)) {
        if (!Array.isArray(arr) || arr.length === 0) continue;
        archInfo[arch] = arr.length;
        cellEntries += arr.length;
        if (arch !== 'DEFAULT') classArchetypes++;
      }
      if (cellEntries > 0) {
        cellInfo[fcat] = archInfo;
        classCellsCount++;
        classEntries += cellEntries;
      }
    }
    if (classEntries > 0) {
      out.classes++;
      out.cells += classCellsCount;
      out.archetypes += classArchetypes;
      out.entries += classEntries;
      out.byClass[dc] = cellInfo;
    }
  }
  return out;
}

if (require.main === module) {
  const rpt = coverageReport();
  console.log('=== AVOID_REASONING_POOL coverage ===');
  console.log(`Classes seeded:   ${rpt.classes}`);
  console.log(`Cells seeded:     ${rpt.cells}`);
  console.log(`Archetype buckets: ${rpt.archetypes}`);
  console.log(`Total entries:    ${rpt.entries}`);
  console.log('');
  for (const [dc, cells] of Object.entries(rpt.byClass)) {
    console.log(`  ${dc}:`);
    for (const [fcat, archInfo] of Object.entries(cells)) {
      console.log(`    ${fcat}:`);
      for (const [arch, n] of Object.entries(archInfo)) {
        console.log(`      ${arch.padEnd(24)}  ${n} entries`);
      }
    }
  }
}

module.exports = { AVOID_REASONING_POOL, pickAvoidReasoning, coverageReport };
