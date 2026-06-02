// engine/class_variant_enrichment_s25.js
//
// Phase 9 / Session 25 — completes class-level variant enrichment for the
// remaining 13 classes (after S24's top-5 work). Same 7+7 cadence as S24.
// Each variant is class-broad but textured.

'use strict';

const CLASS_ENRICHMENT_S25 = {
  COGNAC: {
    bridge1_add: [
      'the artisan-cognac depth threads {foodTarget}',
      'the Charente-region body settles into {foodTarget}',
      'the column-still cognac body meets {foodTarget}',
      'the Fine-Champagne register composes with {foodTarget}',
      'the long-aged eau-de-vie weight anchors against {foodTarget}',
      'the floral-cognac body wraps {foodTarget}',
      'the multi-cru blended brandy carries {foodTarget}',
    ],
    bridge2_add: [
      'the honeyed-orchard close softens {foodSubj}',
      'the candied-peel cognac edge plays against {foodSubj}',
      'the Limousin-oak warmth threads {foodSubj}',
      'the long-aged spice-and-fig finish frames {foodSubj}',
      'the floral-grape close underlines {foodSubj}',
      'the polished cognac caramel-and-pepper edge softens {foodSubj}',
      'the dried-apricot-and-orange finish plays against {foodSubj}',
    ],
  },

  COGNAC_LUXURY: {
    bridge1_add: [
      'the rare-blend depth threads {foodTarget}',
      'the collector-tier cognac body settles into {foodTarget}',
      'the centuries-aged eaux-de-vie weight composes with {foodTarget}',
      'the prestige-house heritage body anchors against {foodTarget}',
      'the multi-generation cellar pour carries {foodTarget}',
      'the heritage-blend luxury body meets {foodTarget}',
      'the cellar-master assembled body wraps {foodTarget}',
    ],
    bridge2_add: [
      'the polished rancio-and-cedar close softens {foodSubj}',
      'the long-aged candied-fruit finish frames {foodSubj}',
      'the layered dried-fig-and-walnut edge plays against {foodSubj}',
      'the heritage-blend silk-and-spice threads {foodSubj}',
      'the prestige-tier honeyed depth underlines {foodSubj}',
      'the centuries-aged cellar finish softens {foodSubj}',
      'the icon-cognac dried-orange close plays against {foodSubj}',
    ],
  },

  SPARKLING: {
    bridge1_add: [
      'the traditional-method body lifts {foodTarget}',
      'the blanc-de-blancs register threads {foodTarget}',
      'the grower-Champagne body composes with {foodTarget}',
      'the bottle-fermented mousse anchors against {foodTarget}',
      'the dosage-balanced sparkling carries {foodTarget}',
      'the autolytic-aged body meets {foodTarget}',
      'the high-acid sparkling register settles into {foodTarget}',
    ],
    bridge2_add: [
      'the chalk-and-lemon-pith close frames {foodSubj}',
      'the fine-mousse-and-citrus edge threads {foodSubj}',
      'the autolytic brioche-and-yeast note underlines {foodSubj}',
      'the bottle-aged minerality softens {foodSubj}',
      'the long-lees creamy finish plays against {foodSubj}',
      'the méthode-traditionnelle dryness frames {foodSubj}',
      'the high-altitude grape acidity softens {foodSubj}',
    ],
  },

  WHITE_WINE: {
    bridge1_add: [
      'the cool-climate white body lifts {foodTarget}',
      'the unoaked-white register matches {foodTarget}',
      'the high-acid white-wine body carries {foodTarget}',
      'the Old-World white character composes with {foodTarget}',
      'the New-World white body anchors against {foodTarget}',
      'the floral-citrus white settles into {foodTarget}',
      'the dry-style white-wine body threads {foodTarget}',
    ],
    bridge2_add: [
      'the lime-and-pear note threads {foodSubj}',
      'the saline-mineral edge brightens {foodSubj}',
      'the cool-climate citrus close plays against {foodSubj}',
      'the polished stone-fruit-and-acid finish underlines {foodSubj}',
      'the unoaked-white crispness frames {foodSubj}',
      'the dry-style white-wine acidity softens {foodSubj}',
      'the chalky finish plays against {foodSubj}',
    ],
  },

  VODKA: {
    bridge1_add: [
      'the column-distilled body sits with {foodTarget}',
      'the polished neutral spirit meets {foodTarget}',
      'the cold-filtered register matches {foodTarget}',
      'the workhorse-vodka body carries {foodTarget}',
      'the wheat-or-corn base body wraps {foodTarget}',
      'the multi-distilled clean register threads {foodTarget}',
      'the cocktail-friendly vodka body sits with {foodTarget}',
    ],
    bridge2_add: [
      'the silky-clean close softens {foodSubj}',
      'the polished neutrality threads {foodSubj}',
      'the cold-filtered crispness underlines {foodSubj}',
      'the column-distilled clarity frames {foodSubj}',
      'the wheat-grain backbone supports {foodSubj}',
      'the workhorse-vodka clean finish plays against {foodSubj}',
      'the unflavored backbone backbone settles {foodSubj}',
    ],
  },

  COCKTAIL_BOLD: {
    bridge1_add: [
      'the classic-cocktail build meets {foodTarget}',
      'the brown-spirit cocktail body composes with {foodTarget}',
      'the bartender-canon stirred-build anchors against {foodTarget}',
      'the rye-or-bourbon-led cocktail register threads {foodTarget}',
      'the cask-spirit cocktail weight settles into {foodTarget}',
      'the speakeasy-classic body wraps {foodTarget}',
      'the bitter-and-amaro-touched body carries {foodTarget}',
    ],
    bridge2_add: [
      'the orange-bitters close frames {foodSubj}',
      'the cherry-and-citrus garnish edge threads {foodSubj}',
      'the stirred-cocktail polish underlines {foodSubj}',
      'the cask-spirit warmth plays against {foodSubj}',
      'the amaro-touched bittersweet close softens {foodSubj}',
      'the classic-build dryness frames {foodSubj}',
      'the bartender-canon depth plays against {foodSubj}',
    ],
  },

  COCKTAIL_LIGHT: {
    bridge1_add: [
      'the tropical-citrus cocktail body lifts {foodTarget}',
      'the agave-citrus build meets {foodTarget}',
      'the bartender-canon citrus body threads {foodTarget}',
      'the shaken-citrus cocktail composes with {foodTarget}',
      'the gin-citrus cocktail register anchors against {foodTarget}',
      'the rum-citrus light-spirit build carries {foodTarget}',
      'the bright sour-cocktail body wraps {foodTarget}',
    ],
    bridge2_add: [
      'the lime-and-orange-peel close threads {foodSubj}',
      'the salt-rim-or-sugar-rim edge frames {foodSubj}',
      'the shaken-citrus brightness underlines {foodSubj}',
      'the bartender-canon citrus polish plays against {foodSubj}',
      'the tropical-citrus close softens {foodSubj}',
      'the sour-and-bright cocktail finish frames {foodSubj}',
      'the high-acid cocktail edge plays against {foodSubj}',
    ],
  },

  SWEET_LIQUEUR: {
    bridge1_add: [
      'the after-dinner liqueur body wraps {foodTarget}',
      'the herbal-sweet digestif meets {foodTarget}',
      'the anise-or-orange-base liqueur threads {foodTarget}',
      'the bottled-syrupy-spice body composes with {foodTarget}',
      'the artisan-liqueur register anchors against {foodTarget}',
      'the cordial-style sweet body carries {foodTarget}',
      'the Italian-or-French liqueur body settles into {foodTarget}',
    ],
    bridge2_add: [
      'the candied-orange-or-anise close frames {foodSubj}',
      'the herbal-syrup edge threads {foodSubj}',
      'the digestif-sweetness-and-spice finish underlines {foodSubj}',
      'the after-dinner sugar-and-herb polish plays against {foodSubj}',
      'the cordial-style cherry-or-almond close softens {foodSubj}',
      'the artisan-liqueur botanical edge frames {foodSubj}',
      'the bottled-syrup-and-honey finish plays against {foodSubj}',
    ],
  },

  APERITIVO_BITTER: {
    bridge1_add: [
      'the Italian-amaro body cuts {foodTarget}',
      'the bittersweet vermouth register threads {foodTarget}',
      'the rhubarb-orange aperitivo body composes with {foodTarget}',
      'the gentian-and-quinine edge anchors against {foodTarget}',
      'the classic-Campari-or-Aperol body matches {foodTarget}',
      'the Fernet-style bitter body settles into {foodTarget}',
      'the herbal-bitter aperitivo carries {foodTarget}',
    ],
    bridge2_add: [
      'the orange-peel-and-rhubarb edge threads {foodSubj}',
      'the gentian-bitter close cuts {foodSubj}',
      'the Italian-amaro warmth plays against {foodSubj}',
      'the wormwood-or-quinine edge brightens {foodSubj}',
      'the bittersweet vermouth polish underlines {foodSubj}',
      'the Aperol-or-Campari brightness softens {foodSubj}',
      'the herbal-bitter close frames {foodSubj}',
    ],
  },

  SWEET_WINE: {
    bridge1_add: [
      'the Port-style body mirrors {foodTarget}',
      'the late-harvest dessert wine body meets {foodTarget}',
      'the noble-rot Sauternes body composes with {foodTarget}',
      'the tawny-aged dessert wine wraps {foodTarget}',
      'the vintage-Port body anchors against {foodTarget}',
      'the dried-grape dessert wine carries {foodTarget}',
      'the appassimento-style sweet wine threads {foodTarget}',
    ],
    bridge2_add: [
      'the dried-fig-and-walnut close threads {foodSubj}',
      'the botrytis honey-and-apricot edge frames {foodSubj}',
      'the tawny-aged caramel-and-orange-peel underlines {foodSubj}',
      'the late-harvest honeyed close softens {foodSubj}',
      'the dessert-wine sugar-and-acid balance plays against {foodSubj}',
      'the Port-style dark-fruit close frames {foodSubj}',
      'the noble-rot dried-orchard finish plays against {foodSubj}',
    ],
  },

  MEZCAL: {
    bridge1_add: [
      'the Oaxaca-distilled body meets {foodTarget}',
      'the small-batch artisan mezcal threads {foodTarget}',
      'the wild-agave body composes with {foodTarget}',
      'the underground-roasted agave anchors against {foodTarget}',
      'the palenque-distilled body carries {foodTarget}',
      'the artisan-mezcal smoke-and-earth register wraps {foodTarget}',
      'the maguey-roasted body settles into {foodTarget}',
    ],
    bridge2_add: [
      'the wood-smoke-and-mineral close threads {foodSubj}',
      'the earthen-pit smoke-and-citrus edge frames {foodSubj}',
      'the wild-agave green-vegetal finish plays against {foodSubj}',
      'the underground-roasted ashy edge underlines {foodSubj}',
      'the rustic mezcal mineral-and-smoke softens {foodSubj}',
      'the artisan-mezcal earth-and-fruit close plays against {foodSubj}',
      'the espadín-driven smoky-citrus edge frames {foodSubj}',
    ],
  },

  HEAVY_SPIRIT: {
    bridge1_add: [
      'the cask-aged heavy-rum body meets {foodTarget}',
      'the dark-rum register composes with {foodTarget}',
      'the molasses-rich rum body threads {foodTarget}',
      'the pot-still aged spirit anchors against {foodTarget}',
      'the high-proof aged body carries {foodTarget}',
      'the navy-strength register wraps {foodTarget}',
      'the long-aged Caribbean body settles into {foodTarget}',
    ],
    bridge2_add: [
      'the toffee-and-banana close threads {foodSubj}',
      'the molasses-and-spice finish frames {foodSubj}',
      'the dark-rum dried-fruit edge plays against {foodSubj}',
      'the long-aged caramel-and-coconut underlines {foodSubj}',
      'the navy-strength backbone softens {foodSubj}',
      'the pot-still oak-and-fruit close plays against {foodSubj}',
      'the molasses-rich vanilla finish frames {foodSubj}',
    ],
  },

  LIGHT_SPIRIT: {
    bridge1_add: [
      'the column-distilled silver body meets {foodTarget}',
      'the unaged blanco register composes with {foodTarget}',
      'the cocktail-base light-spirit body threads {foodTarget}',
      'the high-acid bright spirit anchors against {foodTarget}',
      'the citrus-friendly silver register carries {foodTarget}',
      'the workhorse-light-spirit body wraps {foodTarget}',
      'the gentle blanco-or-cane body settles into {foodTarget}',
    ],
    bridge2_add: [
      'the bright cane-or-agave close threads {foodSubj}',
      'the unaged citrus-friendly finish frames {foodSubj}',
      'the silver-spirit brightness underlines {foodSubj}',
      'the blanco-tequila pepper-and-citrus close plays against {foodSubj}',
      'the light-rum sugarcane-and-lime softens {foodSubj}',
      'the cocktail-base clean edge plays against {foodSubj}',
      'the high-acid silver finish frames {foodSubj}',
    ],
  },
};

module.exports = { CLASS_ENRICHMENT: CLASS_ENRICHMENT_S25 };
