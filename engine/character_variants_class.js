// engine/character_variants_class.js
//
// Phase 10 / Session 26 — class-level characterVariants for all 18 drink
// classes. The `character` field is a single phrase per class (e.g.
// "concentrated dark-fruit and tannin" for BIG_RED). It's used in AVOID
// notes and most non-AVOID notes as the drink's opening character
// description. Without variants, every BIG_RED AVOID reads "Macauley X's
// structured Cabernet with cassis-and-cedar depth..." identically.
//
// Six variants per class, each class-broad but textured. Hash-picked
// deterministically per pair so each pair stays stable across regens.

'use strict';

const CLASS_CHARACTER_VARIANTS = {
  BIG_RED: [
    'concentrated dark-fruit and tannin',
    'heavy Cab structure with cassis-and-cedar depth',
    'muscular tannin with dark-fruit weight',
    'powerhouse red with new-oak grip',
    'dense red-fruit body with firm tannin',
    'high-extraction Cab character',
  ],
  ELEGANT_RED: [
    'red-fruit-and-spice elegance',
    'silky medium-bodied red with cherry-and-pepper lift',
    'cool-climate red character with bright acidity',
    'polished red-fruit body with silk tannin',
    'food-friendly red with red-fruit lift',
    'medium-weight elegant red register',
  ],
  BOURBON_BOLD: [
    'whiskey-family depth with cask-aged warmth',
    'cask-aged brown-spirit weight',
    'whiskey-family backbone with toasted-oak character',
    'matured brown-spirit with cask-aged register',
    'long-aged grain-and-malt depth',
    'brown-spirit body with oak-driven finish',
  ],
  TEQUILA_BOLD: [
    'aged-agave character',
    'oak-rested tequila body with cooked-agave depth',
    'aged tequila register with caramel-and-pepper edge',
    'cask-aged tequila weight with dried-fruit warmth',
    'oak-influenced tequila body with cooked-agave register',
    'highland-agave depth with cooked-honey register',
  ],
  MEZCAL: [
    'smoky agave character',
    'palenque-distilled body with wood-smoke depth',
    'rustic mezcal with earthen-pit smoke',
    'wild-agave register with mineral-and-smoke edge',
    'underground-roasted character with green-vegetal lift',
    'artisan-mezcal weight with campfire-and-mineral register',
  ],
  COGNAC: [
    'barrel-aged cognac character',
    'Limousin-oak brandy with dried-fruit warmth',
    'Charente-region body with floral-and-orchard register',
    'column-still cognac with eau-de-vie depth',
    'Fine-Champagne register with honeyed-orchard edge',
    'artisan-cognac body with rancio-and-vanilla finish',
  ],
  COGNAC_LUXURY: [
    'luxury-icon cognac depth',
    'centuries-aged eaux-de-vie weight',
    'heritage-blend register with layered rancio',
    'collector-tier cognac body with dried-fig-and-walnut depth',
    'prestige-house body with polished oak-and-spice',
    'multi-generation cellar pour with silk-and-spice depth',
  ],
  SPARKLING: [
    'bright sparkling effervescence',
    'sparkling body with chalk-and-citrus lift',
    'fine-bead sparkling register with mineral edge',
    'crisp sparkling mousse with bright acidity',
    'high-acid sparkling body with refreshing crispness',
    'lively sparkling register with bubble-driven lift',
  ],
  WHITE_WINE: [
    'crisp white-wine character',
    'bright white-wine body with citrus-and-mineral lift',
    'dry white register with stone-fruit edge',
    'high-acid white-wine body with chalky finish',
    'mineral white wine with saline edge',
    'aromatic white-wine body with fruit-driven character',
  ],
  GIN: [
    'botanical-driven lift',
    'juniper-led gin character with citrus-and-coriander edge',
    'classic gin register with bright-juniper backbone',
    'contemporary-gin character with floral-and-botanical lift',
    'aromatic gin body with botanical complexity',
    'spirit-forward gin character with bright-botanical register',
  ],
  VODKA: [
    'crystalline neutrality',
    'column-distilled clean body',
    'cold-filtered neutral register',
    'workhorse vodka character with silky finish',
    'wheat-or-corn base with polished neutrality',
    'cocktail-friendly vodka body with unobtrusive backbone',
  ],
  HEAVY_SPIRIT: [
    'dense-spirit weight',
    'cask-aged heavy-spirit body with rich depth',
    'high-proof spirit register with toffee-and-caramel finish',
    'pot-still aged-spirit body with full warmth',
    'long-aged spirit with caramel-and-spice register',
    'rich heavy-spirit body with oak-and-fruit depth',
  ],
  LIGHT_SPIRIT: [
    'silver-spirit lift with agave-citrus edge',
    'column-distilled silver body with citrus-friendly lift',
    'unaged blanco register with bright cane-and-citrus edge',
    'cocktail-base light-spirit body with high-acid finish',
    'workhorse silver-spirit with pepper-and-citrus close',
    'gentle blanco-or-cane body with green-agave register',
  ],
  COCKTAIL_BOLD: [
    'spirit-forward cocktail register',
    'classic-cocktail build with bitter-and-amaro depth',
    'stirred-cocktail body with full spirit weight',
    'spirit-led cocktail register with cask-aged warmth',
    'bartender-canon body with aromatic-bitters edge',
    'classic spirit-forward cocktail with bold cocktail character',
  ],
  COCKTAIL_LIGHT: [
    'citrus-and-bright cocktail lift',
    'shaken-citrus cocktail body with bright acidity',
    'light cocktail with refreshing citrus build',
    'bartender-canon citrus body with sour-cocktail register',
    'light-spirit cocktail with high-acid finish',
    'bright sour-cocktail body with citrus-forward register',
  ],
  SWEET_LIQUEUR: [
    'sweet liqueur character',
    'digestif body with herbal-sweet register',
    'after-dinner liqueur with cordial-style sweetness',
    'anise-or-orange-base liqueur with bottled-syrup edge',
    'artisan-liqueur register with botanical depth',
    'cordial-style sweet body with candied-fruit close',
  ],
  APERITIVO_BITTER: [
    'bitter-herb aperitivo edge',
    'amaro body with gentian-and-quinine register',
    'bittersweet aperitivo character with herbal edge',
    'aperitivo body with bitter-and-orange register',
    'bittersweet aperitivo with bright-citrus and herbal close',
    'herbal-bitter aperitivo with botanical depth',
  ],
  SWEET_WINE: [
    'dessert-wine sweetness',
    'late-harvest body with honeyed register',
    'fortified sweet wine with rich dark-fruit depth',
    'aged sweet wine with caramel-and-spice register',
    'rich dessert wine with sticky-sweet body',
    'sweet wine body with honeyed-and-dried-fruit finish',
  ],
};

module.exports = { CLASS_CHARACTER_VARIANTS };
