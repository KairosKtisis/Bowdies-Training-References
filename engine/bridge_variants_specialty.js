// engine/bridge_variants_specialty.js
//
// Phase 7 / Session 22 — bridge1/bridge2 variant expansion for the final
// 21 curated bottles, closing Phase 7. Covers Cognac, Tequila, Heavy Rum,
// Sparkling, Cava, Port, Dessert Wine, White Wine, Vodka, Gin, Light Rum,
// and remaining Cocktails.
//
// Each set follows the Session 19/20/21 pattern: 5 variants per bridge
// (4 new + original), each true to the specific bottle's identity.

'use strict';

const BRIDGE_VARIANTS = {
  // ── COGNAC ──────────────────────────────────────────────────────────
  'Hennessy Cognac': {
    bridge1Variants: [
      'the cognac depth wraps {foodTarget}',
      'the largest-cognac-house Hennessy body meets {foodTarget}',
      'the V.S Hennessy benchmark carries {foodTarget}',
      'the four-region Hennessy blend body threads {foodTarget}',
      'the Cognac-house entry Hennessy body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the dried-fruit-and-vanilla rounds {foodSubj}',
      'the Hennessy V.S dried-fruit edge underlines {foodSubj}',
      'the entry-cognac vanilla-and-spice finish softens {foodSubj}',
      'the world-cognac-bestseller close plays against {foodSubj}',
      'the Hennessy-house oak-and-fruit edge frames {foodSubj}',
    ],
  },

  'Remy VSOP Cognac': {
    bridge1Variants: [
      'the fine-champagne depth wraps {foodTarget}',
      'the Remy Martin Fine-Champagne Cognac body meets {foodTarget}',
      'the Grande-and-Petite-Champagne VSOP carries {foodTarget}',
      'the centaur-house Remy body threads {foodTarget}',
      'the VSOP-tier Fine-Champagne Remy body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the vanilla rounds {foodSubj}',
      'the floral-vanilla-and-apricot note underlines {foodSubj}',
      'the Fine-Champagne mid-tier vanilla edge softens {foodSubj}',
      'the polished VSOP vanilla-and-spice close plays against {foodSubj}',
      'the Remy-house silky-vanilla finish frames {foodSubj}',
    ],
  },

  'Courvoisier Cognac': {
    bridge1Variants: [
      'the cognac depth wraps {foodTarget}',
      'the "Cognac-of-Napoleon" Courvoisier body meets {foodTarget}',
      'the Jarnac-house Courvoisier character carries {foodTarget}',
      'the Napoleon-favored Courvoisier body threads {foodTarget}',
      'the historic-Cognac Courvoisier body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the caramel rounds {foodSubj}',
      'the toffee-and-toasted-oak Courvoisier note underlines {foodSubj}',
      'the Jarnac-house caramel-and-floral edge softens {foodSubj}',
      'the Napoleon-tier caramel-and-spice close plays against {foodSubj}',
      'the Courvoisier-house dried-apricot-and-toffee finish frames {foodSubj}',
    ],
  },

  // ── TEQUILA_BOLD ─────────────────────────────────────────────────────
  'Don Julio 1942': {
    bridge1Variants: [
      'the extra-añejo depth wraps {foodTarget}',
      'the Don-Julio González anniversary-bottling body meets {foodTarget}',
      'the 1942-founding-vintage tribute extra-añejo carries {foodTarget}',
      'the 2.5-year-aged Don Julio 1942 body threads {foodTarget}',
      'the Jalisco-highland Don Julio extra-añejo body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the caramel-vanilla rounds {foodSubj}',
      'the deep agave-and-caramel Don Julio note underlines {foodSubj}',
      'the extra-añejo cooked-agave-and-vanilla edge softens {foodSubj}',
      'the 1942 caramel-and-toasted-oak close plays against {foodSubj}',
      'the anniversary-bottling vanilla-honey finish frames {foodSubj}',
    ],
  },

  'Clase Azul Reposado': {
    bridge1Variants: [
      'the ceramic-icon reposado depth wraps {foodTarget}',
      'the hand-painted-decanter Clase Azul body meets {foodTarget}',
      'the 8-month-aged Clase Azul Reposado carries {foodTarget}',
      'the Los-Altos-de-Jalisco Clase Azul body threads {foodTarget}',
      'the Pueblo-Mata artisan reposado body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the agave-and-caramel rounds {foodSubj}',
      'the cooked-agave-and-honey Clase Azul note underlines {foodSubj}',
      'the Jalisco-highland agave-and-vanilla edge softens {foodSubj}',
      'the hand-decanter reposado caramel-and-spice close plays against {foodSubj}',
      'the Clase-Azul agave-honey-and-oak finish frames {foodSubj}',
    ],
  },

  // ── HEAVY_SPIRIT ─────────────────────────────────────────────────────
  'Ron Zacapa Rum': {
    bridge1Variants: [
      'the Solera honey wraps {foodTarget}',
      'the Sistema-Solera Guatemalan Ron Zacapa body meets {foodTarget}',
      'the high-altitude-aged Ron Zacapa 23 carries {foodTarget}',
      'the Guatemalan virgin-sugarcane-honey body threads {foodTarget}',
      'the Sistema-Solera barrel-blended Zacapa body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the caramel rounds {foodSubj}',
      'the Solera-aged dark-caramel-and-toffee note underlines {foodSubj}',
      'the high-altitude Solera oak-and-honey edge softens {foodSubj}',
      'the Zacapa-house dried-fruit-and-caramel close plays against {foodSubj}',
      'the Guatemalan virgin-honey-and-vanilla finish frames {foodSubj}',
    ],
  },

  // ── SPARKLING ────────────────────────────────────────────────────────
  'Pierre Gimonnet Special Club Brut': {
    bridge1Variants: [
      'the chalk-and-citrus body lifts {foodTarget}',
      'the Côte-des-Blancs grower-Champagne body meets {foodTarget}',
      'the Special-Club-tier blanc-de-blancs Gimonnet carries {foodTarget}',
      'the chalk-driven Cuis-village Champagne body threads {foodTarget}',
      'the Pierre-Gimonnet Chardonnay-only Champagne body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the fine bead frames {foodSubj}',
      'the chalk-and-lemon-pith fine-bead note underlines {foodSubj}',
      'the Special-Club blanc-de-blancs mineral edge softens {foodSubj}',
      'the Côte-des-Blancs chalk-and-citrus close plays against {foodSubj}',
      'the grower-Champagne fine-mousse finish frames {foodSubj}',
    ],
  },

  'Veuve Clicquot Brut': {
    bridge1Variants: [
      'the pinot-driven lift brightens {foodTarget}',
      'the Yellow-Label Veuve Clicquot body meets {foodTarget}',
      'the Pinot-Noir-dominant Veuve blend carries {foodTarget}',
      'the Madame-Clicquot-house Champagne body threads {foodTarget}',
      'the 50-55%-Pinot-Noir Veuve blend body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the toast-and-citrus edge frames {foodSubj}',
      'the brioche-and-yellow-apple Veuve note underlines {foodSubj}',
      'the Pinot-led toast-and-stone-fruit edge softens {foodSubj}',
      'the Yellow-Label toast-and-citrus close plays against {foodSubj}',
      'the Veuve-house autolytic-toast finish frames {foodSubj}',
    ],
  },

  'Raventós Cava de NIT Rose Brut': {
    bridge1Variants: [
      'the red-fruit Cava body lifts {foodTarget}',
      'the Conca-del-Riu-Anoia Raventós rosé body meets {foodTarget}',
      'the traditional-method Penedès rosé carries {foodTarget}',
      'the Raventós-i-Blanc estate-rosé body threads {foodTarget}',
      'the Macabeo-Xarello-Monastrell de-NIT rosé body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the floral edge frames {foodSubj}',
      'the strawberry-and-floral Raventós note underlines {foodSubj}',
      'the traditional-method Penedès-rosé mousse softens {foodSubj}',
      'the Conca-del-Anoia red-fruit-and-citrus close plays against {foodSubj}',
      'the de-NIT estate-rosé floral-bead finish frames {foodSubj}',
    ],
  },

  // ── SWEET_WINE ───────────────────────────────────────────────────────
  'Vin Santo': {
    bridge1Variants: [
      'the dried-fruit body mirrors {foodTarget}',
      'the Tuscan-appassimento Vin Santo body meets {foodTarget}',
      'the dried-grape-aged Vin-Santo del Chianti carries {foodTarget}',
      'the caratelli-cask aged Tuscan dessert wine body threads {foodTarget}',
      'the Trebbiano-and-Malvasia Vin Santo body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the honey-nut edge threads {foodSubj}',
      'the dried-apricot-and-walnut Vin Santo note underlines {foodSubj}',
      'the caratelli-cask honey-and-almond edge softens {foodSubj}',
      'the Tuscan dessert-wine fig-and-walnut close plays against {foodSubj}',
      'the appassimento honey-and-orange-peel finish frames {foodSubj}',
    ],
  },

  "Graham's 20 Year Tawny": {
    bridge1Variants: [
      'the tawny depth wraps {foodTarget}',
      'the Symington-family 20-year tawny body meets {foodTarget}',
      'the cask-aged Graham\'s 20 tawny carries {foodTarget}',
      'the average-20-year-blend tawny body threads {foodTarget}',
      'the Douro-aged Graham\'s 20-year tawny body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the walnut-caramel edge threads {foodSubj}',
      'the oxidative walnut-and-orange-peel note underlines {foodSubj}',
      'the 20-year tawny dried-fig-and-caramel edge softens {foodSubj}',
      'the Symington-house walnut-and-spice close plays against {foodSubj}',
      'the cask-aged Graham\'s caramel-and-nut finish frames {foodSubj}',
    ],
  },

  "Graham's 2017 Vintage Port": {
    bridge1Variants: [
      'the vintage-port depth wraps {foodTarget}',
      'the 2017-declared Graham\'s Vintage body meets {foodTarget}',
      'the Symington-family 2017 vintage carries {foodTarget}',
      'the Douro-vineyards 2017-declaration Vintage Port body threads {foodTarget}',
      'the bottle-aging Graham\'s 2017 Vintage body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the dark-fruit-and-spice edge threads {foodSubj}',
      'the blackberry-and-clove 2017 Graham\'s note underlines {foodSubj}',
      'the Douro vintage dark-fruit-and-pepper edge softens {foodSubj}',
      'the declared-year cassis-and-violet close plays against {foodSubj}',
      'the bottle-aging Vintage Port tannic-fruit finish frames {foodSubj}',
    ],
  },

  'Taylor Fladgate Tawny': {
    bridge1Variants: [
      'the tawny body mirrors {foodTarget}',
      'the oldest-port-house (1692) Taylor body meets {foodTarget}',
      'the Yeatman-family Taylor Fladgate tawny carries {foodTarget}',
      'the Vargellas-vineyard-sourced tawny body threads {foodTarget}',
      'the Taylor-house aged-tawny body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the caramel-nut edge threads {foodSubj}',
      'the dried-fig-and-walnut Taylor note underlines {foodSubj}',
      'the 1692-house oxidative caramel edge softens {foodSubj}',
      'the Taylor-Fladgate dried-orange-and-nut close plays against {foodSubj}',
      'the aged-tawny caramel-and-toffee finish frames {foodSubj}',
    ],
  },

  // ── WHITE_WINE ───────────────────────────────────────────────────────
  'Keenan Chardonnay': {
    bridge1Variants: [
      'the toasted-Chard body lifts {foodTarget}',
      'the Spring-Mountain-District Keenan body meets {foodTarget}',
      'the Keenan-family Mountain-Napa Chardonnay carries {foodTarget}',
      'the elevation-grown Keenan Chardonnay body threads {foodTarget}',
      'the Spring-Mountain estate Chardonnay body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the tropical-fruit edge frames {foodSubj}',
      'the pineapple-and-toasted-oak Keenan note underlines {foodSubj}',
      'the Spring-Mountain elevation citrus-and-oak edge softens {foodSubj}',
      'the Mountain-Napa stone-fruit-and-vanilla close plays against {foodSubj}',
      'the Keenan-house toasted-oak finish frames {foodSubj}',
    ],
  },

  'Schloss Vollrads Riesling': {
    bridge1Variants: [
      'the off-dry body brightens {foodTarget}',
      'the Rheingau-estate Schloss Vollrads body meets {foodTarget}',
      'the 1211-founded Schloss Vollrads Riesling carries {foodTarget}',
      'the oldest-Rheingau-estate Riesling body threads {foodTarget}',
      'the slate-soil Vollrads Riesling body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the lime-petrol note threads {foodSubj}',
      'the slate-driven lime-and-petrol Vollrads note underlines {foodSubj}',
      'the Rheingau off-dry citrus-and-mineral edge softens {foodSubj}',
      'the medieval-estate Riesling lime-and-honey close plays against {foodSubj}',
      'the slate-soil Schloss Vollrads finish frames {foodSubj}',
    ],
  },

  // ── VODKA ────────────────────────────────────────────────────────────
  'Detroit City Vodka': {
    bridge1Variants: [
      'the silky vodka body sits with {foodTarget}',
      'the Detroit-craft-distillery DCD vodka body meets {foodTarget}',
      'the Eastern-Market-distilled Detroit City body carries {foodTarget}',
      'the Michigan-craft vodka clean body threads {foodTarget}',
      'the local-Detroit craft-spirit body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the clean profile carries {foodSubj}',
      'the Michigan-craft clean-grain note underlines {foodSubj}',
      'the Eastern-Market-distilled clean profile softens {foodSubj}',
      'the local-Detroit silky-finish close plays against {foodSubj}',
      'the DCD craft-vodka clean edge frames {foodSubj}',
    ],
  },

  'Titos Vodka': {
    bridge1Variants: [
      'the round Tito\'s mouthfeel sits with {foodTarget}',
      'the Texas-distilled corn-based Tito\'s body meets {foodTarget}',
      'the Bert-"Tito"-Beveridge Austin vodka carries {foodTarget}',
      'the gluten-free corn-mash Tito\'s body threads {foodTarget}',
      'the Mockingbird-Distillery Tito\'s body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the slight sweetness softens {foodSubj}',
      'the corn-mash slight-sweetness Tito\'s note underlines {foodSubj}',
      'the Texas-craft round-mouthfeel edge softens {foodSubj}',
      'the Austin-distilled corn-vanilla close plays against {foodSubj}',
      'the Tito\'s gentle corn-grain finish frames {foodSubj}',
    ],
  },

  // ── GIN ──────────────────────────────────────────────────────────────
  'Detroit City Gin': {
    bridge1Variants: [
      'the city-distilled juniper frames {foodTarget}',
      'the Eastern-Market-distilled Detroit City Gin body meets {foodTarget}',
      'the Michigan-craft juniper-and-botanical body carries {foodTarget}',
      'the DCD gin botanical-build body threads {foodTarget}',
      'the local-Detroit gin juniper-led body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the local-spirit character meets {foodSubj}',
      'the Michigan-craft botanical edge underlines {foodSubj}',
      'the Eastern-Market-distilled local-character close softens {foodSubj}',
      'the Detroit-City juniper-and-coriander close plays against {foodSubj}',
      'the DCD gin Michigan-botanical finish frames {foodSubj}',
    ],
  },

  // ── RUM_LIGHT ────────────────────────────────────────────────────────
  'Bacardi Rum': {
    bridge1Variants: [
      'the crisp body lifts {foodTarget}',
      'the Puerto-Rico-distilled Bacardi Superior body meets {foodTarget}',
      'the Bacardi-house light-rum benchmark carries {foodTarget}',
      'the 1862-Don-Facundo-founded Bacardi body threads {foodTarget}',
      'the column-distilled Bacardi white-rum body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the clean profile carries {foodSubj}',
      'the light-rum clean-and-cane note underlines {foodSubj}',
      'the Bacardi-Superior clean-sugar-cane edge softens {foodSubj}',
      'the bat-logo workhorse-rum close plays against {foodSubj}',
      'the Puerto-Rico cane-and-citrus finish frames {foodSubj}',
    ],
  },

  // ── COCKTAIL_LIGHT ───────────────────────────────────────────────────
  'French 75': {
    bridge1Variants: [
      'the bubble-and-citrus build brightens {foodTarget}',
      'the gin-lemon-Champagne French-75 body meets {foodTarget}',
      'the WWI-artillery-named French-75 carries {foodTarget}',
      'the Harry\'s-Bar Paris-origin French-75 body threads {foodTarget}',
      'the gin-and-Champagne-coupe French-75 body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the gin botanicals frame {foodSubj}',
      'the juniper-and-citrus French-75 note underlines {foodSubj}',
      'the gin-led citrus-and-bubble edge softens {foodSubj}',
      'the Harry\'s-Bar gin-Champagne close plays against {foodSubj}',
      'the gin-botanical-and-mousse finish frames {foodSubj}',
    ],
  },

  'Margarita': {
    bridge1Variants: [
      'the agave-citrus body brightens {foodTarget}',
      'the tequila-lime-triple-sec Margarita body meets {foodTarget}',
      'the classic-Margarita three-part build carries {foodTarget}',
      'the salt-rimmed-coupe Margarita body threads {foodTarget}',
      'the bartender-canon Margarita body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the salt-rim edge frames {foodSubj}',
      'the lime-and-agave-and-salt note underlines {foodSubj}',
      'the salt-rim tequila-citrus edge softens {foodSubj}',
      'the orange-liqueur-and-lime close plays against {foodSubj}',
      'the agave-citrus-and-salt finish frames {foodSubj}',
    ],
  },

  // ── COCKTAIL_BOLD ────────────────────────────────────────────────────
  'Espresso Martini': {
    bridge1Variants: [
      'the espresso depth meets {foodTarget}',
      'the Bradsell-1980s espresso-martini body wraps {foodTarget}',
      'the vodka-Kahlúa-espresso build carries {foodTarget}',
      'the shaken-espresso-foam cocktail body threads {foodTarget}',
      'the after-dinner espresso-martini body meets {foodTarget}',
    ],
    bridge2Variants: [
      'the coffee-liqueur edge frames {foodSubj}',
      'the Kahlúa-and-espresso bittersweet note underlines {foodSubj}',
      'the shaken-espresso crema-and-coffee edge softens {foodSubj}',
      'the Dick-Bradsell coffee-and-vodka close plays against {foodSubj}',
      'the espresso-martini coffee-bitterness finish frames {foodSubj}',
    ],
  },
};

module.exports = { BRIDGE_VARIANTS };
