// engine/drink_x_food_generator.js (v2 — v9-structure aligned)
//
// Templated drink x food pair-note generator. v2 redesigns around the v9
// structural pattern observed in the existing 12,909 templated notes:
//
//   Pattern A: "{Drink} — {tasting notes}. {Body bridge using tasting
//                notes}. {Tier} {classFraming} for {food} — {bottle/food
//                specific close}."
//   Pattern C: "{Drink}'s {character} {action} the {food}'s {char}: {body}.
//                {Tier}; {short verdict}."
//   Pattern D: "{Drink}'s {character} {drowns/overwhelms} the {food}'s
//                {char} — the plate deserves {alts}, not a {drink-class}.
//                Avoid; Reach for {alts}. Save the {drink} for the steak."
//
// Per-bottle data is richer than v1:
//   { tastingNotes: ['cocoa','mocha','velvety tannins'],
//     character: 'cocoa-mocha velvety-tannin opulence',  // single-phrase form
//     bodyBridge: 'the opulent body cuts {foodTarget}',  // bottle-specific
//     verdictHook: 'iconic Napa Cab for {food}' }        // tier-extender
//
// Drink-class chemistry filter: chemistry-claims clauses are tagged
// implicitly by their text. We reject clauses containing drink-class
// qualifiers that don't match the drink's actual class
// (e.g. "bourbon depth" can't appear in a Cab note).

'use strict';

const fs = require('fs');
const vm = require('vm');
const path = require('path');
const crypto = require('crypto');

const taxonomy = require('./pairing_engine_taxonomy');
const fxfGen   = require('./pairing_engine_generator');

// ── PER-BOTTLE PROFILES ────────────────────────────────────────────────────
//
// Each entry: { tastingNotes, character, bridge1, bridge2, verdictHook }.
// bridge1/bridge2 are templates with {foodTarget} or {foodSubj} slots that
// get filled with the food's bridge-parts. verdictHook is a phrase that can
// be appended to the tier verdict for bottle-specific flavor.

const BOTTLE_PROFILE = {
  // ── Big Reds ────────────────────────────────────────────────────────────
  'Caymus Cabernet Sauvignon': {
    tastingNotes: ['cocoa', 'mocha', 'velvety tannins'],
    character:    'cocoa-mocha velvety-tannin opulence',
    bridge1:      'the opulent body cuts {foodTarget}',
    bridge2:      'the cocoa-mocha plays against {foodSubj}',
    verdictHook:  'iconic Napa Cab',
  },
  'Opus One': {
    tastingNotes: ['blackcurrant', 'graphite', 'cedar'],
    character:    'Bordeaux-blend allocated-icon power',
    bridge1:      'the structured tannin frames {foodTarget}',
    bridge2:      'the graphite plays against {foodSubj}',
    verdictHook:  'allocated-icon Cab blend',
  },
  'Silver Oak Cabernet Sauvignon': {
    tastingNotes: ['American oak', 'dark cherry', 'cedar'],
    character:    'American-oak Cab character',
    bridge1:      'the American-oak weight handles {foodTarget}',
    bridge2:      'the cherry-fruit echoes {foodSubj}',
    verdictHook:  'American-oak Cab',
  },
  'Jordan Cabernet Sauvignon': {
    tastingNotes: ['black cherry', 'cedar', 'silky tannins'],
    character:    'classical-Napa Cab elegance',
    bridge1:      'the silky tannins wrap {foodTarget}',
    bridge2:      'the cherry-fruit frames {foodSubj}',
    verdictHook:  'classical Napa Cab',
  },
  'Far Niente Cabernet Sauvignon': {
    tastingNotes: ['black currant', 'mocha', 'mineral'],
    character:    'estate-Cab Napa character',
    bridge1:      'the estate Cab body matches {foodTarget}',
    bridge2:      'the mocha edge plays against {foodSubj}',
    verdictHook:  'estate Napa Cab',
  },
  'Château Beaucastel': {
    tastingNotes: ['Châteauneuf-du-Pape', 'garrigue herbs', 'spice'],
    character:    'old-world Châteauneuf-du-Pape gravitas',
    bridge1:      'the garrigue-spice depth wraps {foodTarget}',
    bridge2:      'the southern-Rhône weight frames {foodSubj}',
    verdictHook:  "old-world Châteauneuf",
  },
  'Heitz Trailside Vineyard': {
    tastingNotes: ['Napa Cab icon', 'eucalyptus', 'graphite'],
    character:    'Napa-icon Cab character',
    bridge1:      'the icon-Cab body handles {foodTarget}',
    bridge2:      'the graphite-and-mint plays against {foodSubj}',
    verdictHook:  'Napa-icon Cab',
  },
  // ── Bourbons ────────────────────────────────────────────────────────────
  '1792 Small Batch': {
    tastingNotes: ['caramel', 'spice', '93.7 proof Barton'],
    character:    'caramel-spice character',
    bridge1:      'the bourbon depth settles into {foodTarget}',
    bridge2:      'the rounded sweetness softens {foodSubj}',
    verdictHook:  'small-batch Barton bourbon',
  },
  "Maker's Mark": {
    tastingNotes: ['wheated', 'red-rope', 'caramel'],
    character:    'wheated red-rope sweetness',
    bridge1:      'the wheated softness matches {foodTarget}',
    bridge2:      'the red-rope caramel rounds {foodSubj}',
    verdictHook:  'classic wheated bourbon',
  },
  "Maker's Mark Cellar Aged": {
    tastingNotes: ['cellar-aged wheated', 'oak depth', 'caramel'],
    character:    'aged wheated depth',
    bridge1:      'the cellar-aged depth wraps {foodTarget}',
    bridge2:      'the oak frames {foodSubj}',
    verdictHook:  'cellar-aged wheated bourbon',
  },
  'Buffalo Trace': {
    tastingNotes: ['vanilla', 'toffee', 'oak'],
    character:    'rounded vanilla-and-toffee character',
    bridge1:      'the vanilla settles into {foodTarget}',
    bridge2:      'the oak threads {foodSubj}',
    verdictHook:  'workhorse Sazerac-house bourbon',
  },
  'Bulleit Bourbon': {
    tastingNotes: ['high-rye mash bill', 'spice-forward', 'oak'],
    character:    'high-rye spice-forward depth',
    bridge1:      'the rye-spice edge cuts {foodTarget}',
    bridge2:      'the oak underlines {foodSubj}',
    verdictHook:  'spice-forward bourbon',
  },
  'Knob Creek': {
    tastingNotes: ['100-proof', 'oak', 'vanilla'],
    character:    'oak-and-vanilla 100-proof depth',
    bridge1:      'the 100-proof depth handles {foodTarget}',
    bridge2:      'the vanilla rounds {foodSubj}',
    verdictHook:  '100-proof small-batch bourbon',
  },
  'Eagle Rare 10 Year': {
    tastingNotes: ['BTAC adjacent', 'aged oak', 'caramel'],
    character:    'aged-oak elegance',
    bridge1:      'the aged-oak depth threads {foodTarget}',
    bridge2:      'the caramel rounds {foodSubj}',
    verdictHook:  'allocated 10yr bourbon',
  },
  'Weller 12 Year': {
    tastingNotes: ['aged wheated', 'honey', 'vanilla'],
    character:    'aged wheated honey-vanilla character',
    bridge1:      'the wheated weight wraps {foodTarget}',
    bridge2:      'the honey-vanilla threads {foodSubj}',
    verdictHook:  'aged wheated bourbon',
  },
  'Weller Special Reserve': {
    tastingNotes: ['wheated', 'soft vanilla', 'gentle oak'],
    character:    'wheated soft-vanilla character',
    bridge1:      'the wheated softness matches {foodTarget}',
    bridge2:      'the gentle oak frames {foodSubj}',
    verdictHook:  'wheated workhorse bourbon',
  },
  "Booker's": {
    tastingNotes: ['cask strength', '125+ proof', 'oak char'],
    character:    'cask-strength bourbon depth',
    bridge1:      'the cask-strength power drives {foodTarget}',
    bridge2:      'the oak-char underlines {foodSubj}',
    verdictHook:  'cask-strength bourbon power',
  },
  'Pappy Van Winkle 13 Year Rye': {
    tastingNotes: ['allocated', 'aged rye', 'caramel-spice'],
    character:    'allocated-icon Pappy rye character',
    bridge1:      'the allocated rye depth threads {foodTarget}',
    bridge2:      'the caramel-spice softens {foodSubj}',
    verdictHook:  'allocated Pappy 13 rye',
  },
  'George T. Stagg': {
    tastingNotes: ['BTAC', 'cask strength', 'concentrated'],
    character:    'cask-strength BTAC bourbon power',
    bridge1:      'the BTAC cask-strength drives {foodTarget}',
    bridge2:      'the concentrated oak underlines {foodSubj}',
    verdictHook:  'BTAC cask-strength bourbon',
  },
  // ── Elegant Reds ────────────────────────────────────────────────────────
  'Cristom Mt Jefferson Cuvée': {
    tastingNotes: ['Willamette Pinot', 'red cherry', 'silky tannins'],
    character:    'Willamette Pinot elegance',
    bridge1:      'the silky red-fruit body wraps {foodTarget}',
    bridge2:      'the cherry-fruit frames {foodSubj}',
    verdictHook:  'Willamette Pinot',
  },
  'Lingua Franca Avni Pinot Noir': {
    tastingNotes: ['Willamette Pinot', 'red plum', 'forest floor'],
    character:    'Willamette layered Pinot character',
    bridge1:      'the layered Pinot body matches {foodTarget}',
    bridge2:      'the forest-floor edge frames {foodSubj}',
    verdictHook:  'Willamette Pinot',
  },
  // ── White wines ─────────────────────────────────────────────────────────
  'Far Niente Chardonnay': {
    tastingNotes: ['Napa Chardonnay', 'tropical fruit', 'oak'],
    character:    'estate Napa Chardonnay character',
    bridge1:      'the Chardonnay weight matches {foodTarget}',
    bridge2:      'the tropical fruit lifts {foodSubj}',
    verdictHook:  'estate Napa Chardonnay',
  },
  'Joseph Mellot Sancerre': {
    tastingNotes: ['Loire Sauvignon Blanc', 'flint', 'citrus'],
    character:    'classic Loire Sauvignon Blanc',
    bridge1:      'the flinty minerality lifts {foodTarget}',
    bridge2:      'the citrus cuts {foodSubj}',
    verdictHook:  'classic Loire Sauv Blanc',
  },
  'Jean-Pierre Grossot Chablis': {
    tastingNotes: ['Burgundy Chablis', 'flint', 'lemon'],
    character:    'Burgundy Chablis flinty minerality',
    bridge1:      'the Chablis flint frames {foodTarget}',
    bridge2:      'the citrus cuts {foodSubj}',
    verdictHook:  'Burgundy Chablis',
  },
  'Stoneleigh Sauvignon Blanc': {
    tastingNotes: ['NZ Sauvignon Blanc', 'grapefruit', 'crisp acid'],
    character:    'crisp NZ Sauvignon Blanc',
    bridge1:      'the bright acid lifts {foodTarget}',
    bridge2:      'the grapefruit edge cuts {foodSubj}',
    verdictHook:  'crisp NZ Sauv Blanc',
  },
  'Pommery Cuvée Louise': {
    tastingNotes: ['prestige Champagne', 'brioche', 'fine mousse'],
    character:    'prestige cuvée Champagne elegance',
    bridge1:      'the fine bubbles lift {foodTarget}',
    bridge2:      'the brioche edge frames {foodSubj}',
    verdictHook:  'tête de cuvée Champagne',
  },
  // ── Sparkling ───────────────────────────────────────────────────────────
  'Laurent Perrier Le Cuvée Brut': {
    tastingNotes: ['non-vintage Champagne', 'citrus', 'fine bubbles'],
    character:    'classic non-vintage Champagne brightness',
    bridge1:      'the bright bubbles lift {foodTarget}',
    bridge2:      'the citrus frames {foodSubj}',
    verdictHook:  'classic Champagne',
  },
  // ── Liqueurs ────────────────────────────────────────────────────────────
  'Amaro Nonino': {
    tastingNotes: ['orange peel', 'grappa-base', 'bitter herb'],
    character:    'crisp orange-peel-grappa sweetness',
    bridge1:      'the bitter herb edge cuts {foodTarget}',
    bridge2:      'the orange peel echoes {foodSubj}',
    verdictHook:  'aperitivo amaro',
  },
  'Aperol': {
    tastingNotes: ['bitter orange', 'aperitivo', 'low-proof'],
    character:    'crisp bitter-orange-aperitivo edge',
    bridge1:      'the aperitivo edge cuts {foodTarget}',
    bridge2:      'the bitter-orange frames {foodSubj}',
    verdictHook:  'aperitivo apéritif',
  },
  'Fernet Branca': {
    tastingNotes: ['cask-strength', 'menthol', 'nuclear bitter'],
    character:    'cask-strength nuclear-bitter-menthol edge',
    bridge1:      'the nuclear-bitter edge cuts {foodTarget}',
    bridge2:      'the menthol frames {foodSubj}',
    verdictHook:  'Italian digestivo bitter',
  },
  'Clase Azul Plata': {
    tastingNotes: ['hand-crafted ceramic decanter', 'silky Jalisco blanco', 'slow-cooked agave'],
    character:    'silky Jalisco blanco with ceramic-decanter presentation',
    bridge1:      'the silky-blanco lift brightens {foodTarget}',
    bridge2:      'the Jalisco terroir threads {foodSubj}',
    verdictHook:  'ceramic-decanter blanco',
  },
  'Casa Dragones Blanco': {
    tastingNotes: ['joven blanco', 'estate Jalisco', 'restaurant-pour standard'],
    character:    'estate-Jalisco joven blanco',
    bridge1:      'the joven-blanco lift brightens {foodTarget}',
    bridge2:      'the estate agave note threads {foodSubj}',
    verdictHook:  'joven blanco',
  },
  'Don Julio Blanco': {
    tastingNotes: ['workhorse blanco', 'agave-forward', 'restaurant standard'],
    character:    'workhorse blanco with clean agave snap',
    bridge1:      'the agave-forward body brightens {foodTarget}',
    bridge2:      'the citrus snap threads {foodSubj}',
    verdictHook:  'workhorse blanco',
  },
  'Patron Silver': {
    tastingNotes: ['polished silver tequila', 'restaurant call', 'agave-forward'],
    character:    'polished silver tequila with agave-forward lift',
    bridge1:      'the silver-tequila body brightens {foodTarget}',
    bridge2:      'the polished agave note threads {foodSubj}',
    verdictHook:  'polished silver tequila',
  },
};


// ── DEFAULT (CLASS-LEVEL) FALLBACK PROFILES ────────────────────────────────
const DRINK_CLASS_DEFAULT = {
  BIG_RED: {
    character: 'concentrated dark-fruit and tannin',
    bridge1: 'the structured body wraps {foodTarget}',
    bridge1Variants: [
      'the structured body wraps {foodTarget}',
      'the concentrated dark-fruit weight handles {foodTarget}',
      'the firm tannin grips {foodTarget}',
      'the powerful body carries {foodTarget}',
      'the bold Cab register matches {foodTarget}',
      'the dark-fruit body sits with {foodTarget}',
    ],
    bridge2: 'the cassis frames {foodSubj}',
    bridge2Variants: [
      'the cassis frames {foodSubj}',
      'the blackberry edge underlines {foodSubj}',
      'the espresso-cocoa note rounds {foodSubj}',
      'the iron-mineral plays against {foodSubj}',
      'the tannin grips {foodSubj}',
    ],
    verdictHook: 'big-red Cab'
  },
  ELEGANT_RED: {
    character: 'red-fruit-and-spice elegance',
    bridge1: 'the silky body carries {foodTarget}',
    bridge1Variants: [
      'the silky body carries {foodTarget}',
      'the elegant tannin frames {foodTarget}',
      'the red-fruit-and-spice register sits with {foodTarget}',
      'the medium body wraps {foodTarget}',
      'the polished red-fruit weight matches {foodTarget}',
    ],
    bridge2: 'the cherry-pepper note frames {foodSubj}',
    bridge2Variants: [
      'the cherry-pepper note frames {foodSubj}',
      'the red-fruit edge brightens {foodSubj}',
      'the silky tannin rounds {foodSubj}',
      'the spice underlines {foodSubj}',
      'the cherry-and-earth register softens {foodSubj}',
    ],
    verdictHook: 'elegant red'
  },
  BOURBON_BOLD: {
    character: 'oak-and-vanilla bourbon depth',
    bridge1: 'the brown-spirit body settles into {foodTarget}',
    bridge1Variants: [
      'the brown-spirit body settles into {foodTarget}',
      'the oak-and-vanilla weight wraps {foodTarget}',
      'the whiskey-family backbone carries {foodTarget}',
      'the brown-spirit register matches {foodTarget}',
      'the dark-spirit weight handles {foodTarget}',
      'the oak depth threads {foodTarget}',
    ],
    bridge2: 'the toffee-vanilla edge softens {foodSubj}',
    bridge2Variants: [
      'the toffee-vanilla edge softens {foodSubj}',
      'the caramel rounds {foodSubj}',
      'the oak frames {foodSubj}',
      'the spice-and-vanilla brightens {foodSubj}',
      'the rounded sweetness underlines {foodSubj}',
    ],
    verdictHook: 'bourbon'
  },
  TEQUILA_BOLD: {
    character: 'aged-agave character',
    bridge1: 'the barrel-rested body handles {foodTarget}',
    bridge1Variants: [
      'the barrel-rested body handles {foodTarget}',
      'the a\u00f1ejo register carries {foodTarget}',
      'the aged-agave weight wraps {foodTarget}',
      'the cooked-agave-and-oak body matches {foodTarget}',
      'the rested-agave depth sits with {foodTarget}',
      'the oak-aged tequila body threads {foodTarget}',
    ],
    bridge2: 'the oak threads {foodSubj}',
    bridge2Variants: [
      'the oak threads {foodSubj}',
      'the cooked-agave note underlines {foodSubj}',
      'the caramel-agave register brightens {foodSubj}',
      'the vanilla-and-pepper edge frames {foodSubj}',
      'the soft-spice note softens {foodSubj}',
    ],
    verdictHook: 'a\u00f1ejo tequila'
  },
  MEZCAL: {
    character: 'smoky agave character',
    bridge1: 'the wood-fire body meets {foodTarget}',
    bridge1Variants: [
      'the wood-fire body meets {foodTarget}',
      'the smoky agave register handles {foodTarget}',
      'the earthen-pit smoke carries {foodTarget}',
      'the espadín-and-smoke body wraps {foodTarget}',
      'the rustic mezcal weight sits with {foodTarget}',
    ],
    bridge2: 'the earthy backbone threads {foodSubj}',
    bridge2Variants: [
      'the earthy backbone threads {foodSubj}',
      'the wood-smoke note underlines {foodSubj}',
      'the green-agave edge brightens {foodSubj}',
      'the campfire register frames {foodSubj}',
      'the mineral smoke plays against {foodSubj}',
    ],
    verdictHook: 'smoky mezcal'
  },
  COGNAC: {
    character: 'barrel-aged cognac character',
    bridge1: 'the brandy depth wraps {foodTarget}',
    bridge1Variants: [
      'the brandy depth wraps {foodTarget}',
      'the cognac register matches {foodTarget}',
      'the eau-de-vie body carries {foodTarget}',
      'the Limousin-oak weight handles {foodTarget}',
      'the aged-grape brandy body sits with {foodTarget}',
    ],
    bridge2: 'the caramel rounds {foodSubj}',
    bridge2Variants: [
      'the caramel rounds {foodSubj}',
      'the dried-fruit note underlines {foodSubj}',
      'the oak-and-vanilla edge brightens {foodSubj}',
      'the rancio register softens {foodSubj}',
      'the orchard-fruit thread frames {foodSubj}',
    ],
    verdictHook: 'classic cognac'
  },
  COGNAC_LUXURY: {
    character: 'luxury-icon cognac depth',
    bridge1: 'the heritage-blend body wraps {foodTarget}',
    bridge1Variants: [
      'the heritage-blend body wraps {foodTarget}',
      'the icon-cognac register elevates {foodTarget}',
      'the prestige-blend weight carries {foodTarget}',
      'the multi-decade aged body matches {foodTarget}',
      'the heritage-cognac depth handles {foodTarget}',
    ],
    bridge2: 'the caramel rounds {foodSubj}',
    bridge2Variants: [
      'the caramel rounds {foodSubj}',
      'the rancio-and-walnut note underlines {foodSubj}',
      'the icon-prestige edge brightens {foodSubj}',
      'the layered eau-de-vie register frames {foodSubj}',
      'the polished oak softens {foodSubj}',
    ],
    verdictHook: 'luxury cognac'
  },
  SPARKLING: {
    character: 'bright sparkling effervescence',
    bridge1: 'the fine bubbles lift {foodTarget}',
    bridge1Variants: [
      'the fine bubbles lift {foodTarget}',
      'the autolytic toast register matches {foodTarget}',
      'the mineral-driven sparkling body cuts {foodTarget}',
      'the bright effervescence carries {foodTarget}',
      'the Champagne acidity matches {foodTarget}',
      'the toasty méthode register sits with {foodTarget}',
    ],
    bridge2: 'the citrus frames {foodSubj}',
    bridge2Variants: [
      'the citrus frames {foodSubj}',
      'the brioche-and-toast note underlines {foodSubj}',
      'the chalky minerality brightens {foodSubj}',
      'the bright acidity cuts {foodSubj}',
      'the apple-pear edge plays against {foodSubj}',
    ],
    verdictHook: 'Champagne'
  },
  WHITE_WINE: {
    character: 'crisp white-wine character',
    bridge1: 'the bright acid lifts {foodTarget}',
    bridge1Variants: [
      'the bright acid lifts {foodTarget}',
      'the crisp white-wine body matches {foodTarget}',
      'the cool-climate register carries {foodTarget}',
      'the mineral-driven body cuts {foodTarget}',
      'the citrus-and-stone-fruit weight sits with {foodTarget}',
    ],
    bridge2: 'the citrus cuts {foodSubj}',
    bridge2Variants: [
      'the citrus cuts {foodSubj}',
      'the green-apple edge brightens {foodSubj}',
      'the stone-fruit note underlines {foodSubj}',
      'the chalky minerality plays against {foodSubj}',
      'the white-flower thread softens {foodSubj}',
    ],
    verdictHook: 'white wine'
  },
  GIN: {
    character: 'botanical-driven lift',
    bridge1: 'the floral edge frames {foodTarget}',
    bridge1Variants: [
      'the floral edge frames {foodTarget}',
      'the juniper-led botanicals carry {foodTarget}',
      'the gin lift cuts {foodTarget}',
      'the botanical-citrus register matches {foodTarget}',
      'the herbal gin body sits with {foodTarget}',
      'the bright botanical edge handles {foodTarget}',
    ],
    bridge2: 'the juniper threads {foodSubj}',
    bridge2Variants: [
      'the juniper threads {foodSubj}',
      'the citrus-peel note underlines {foodSubj}',
      'the floral-and-herb register brightens {foodSubj}',
      'the coriander-and-cardamom edge frames {foodSubj}',
      'the dry gin lift plays against {foodSubj}',
    ],
    verdictHook: 'gin'
  },
  VODKA: {
    character: 'crystalline neutrality',
    bridge1: 'the unflavored body sits with {foodTarget}',
    bridge1Variants: [
      'the unflavored body sits with {foodTarget}',
      'the clean vodka register matches {foodTarget}',
      'the crystalline body carries {foodTarget}',
      'the neutral-spirit weight handles {foodTarget}',
      'the cold-distilled body wraps {foodTarget}',
    ],
    bridge2: 'the crisp profile carries {foodSubj}',
    bridge2Variants: [
      'the crisp profile carries {foodSubj}',
      'the clean register frames {foodSubj}',
      'the bright vodka edge brightens {foodSubj}',
      'the unobtrusive backbone supports {foodSubj}',
      'the silky neutrality lifts {foodSubj}',
    ],
    verdictHook: 'vodka'
  },
  LIGHT_SPIRIT: {
    character: 'silver-spirit lift with agave-citrus edge',
    bridge1: 'the unaged body brightens {foodTarget}',
    bridge1Variants: [
      'the unaged body brightens {foodTarget}',
      'the silver-spirit register lifts {foodTarget}',
      'the blanco-tequila body matches {foodTarget}',
      'the bright agave-citrus weight carries {foodTarget}',
      'the light-rum body cuts {foodTarget}',
    ],
    bridge2: 'the agave-citrus thread frames {foodSubj}',
    bridge2Variants: [
      'the agave-citrus thread frames {foodSubj}',
      'the green-agave edge brightens {foodSubj}',
      'the bright blanco register underlines {foodSubj}',
      'the unaged-cane note plays against {foodSubj}',
      'the lime-and-pepper thread softens {foodSubj}',
    ],
    verdictHook: 'silver spirit'
  },
  HEAVY_SPIRIT: {
    character: 'dense-spirit weight',
    bridge1: 'the heavy body handles {foodTarget}',
    bridge1Variants: [
      'the heavy body handles {foodTarget}',
      'the dense-spirit weight carries {foodTarget}',
      'the high-proof register matches {foodTarget}',
      'the rich pour wraps {foodTarget}',
      'the layered spirit body sits with {foodTarget}',
    ],
    bridge2: 'the deep backbone frames {foodSubj}',
    bridge2Variants: [
      'the deep backbone frames {foodSubj}',
      'the heavy-pour register grips {foodSubj}',
      'the dense weight underlines {foodSubj}',
      'the layered body brightens {foodSubj}',
      'the rich character softens {foodSubj}',
    ],
    verdictHook: 'heavy pour'
  },
  COCKTAIL_BOLD: {
    character: 'spirit-forward cocktail register',
    bridge1: 'the bold-mix depth handles {foodTarget}',
    bridge1Variants: [
      'the bold-mix depth handles {foodTarget}',
      'the spirit-forward register carries {foodTarget}',
      'the whiskey-led build matches {foodTarget}',
      'the stirred-cocktail body wraps {foodTarget}',
      'the bitters-and-spirit weight sits with {foodTarget}',
    ],
    bridge2: 'the bitters edge frames {foodSubj}',
    bridge2Variants: [
      'the bitters edge frames {foodSubj}',
      'the stirred-cocktail register underlines {foodSubj}',
      'the spirit-driven note plays against {foodSubj}',
      'the aromatic-bitters thread softens {foodSubj}',
      'the cherry-and-orange edge brightens {foodSubj}',
    ],
    verdictHook: 'spirit-forward cocktail'
  },
  COCKTAIL_LIGHT: {
    character: 'citrus-and-bright cocktail lift',
    bridge1: 'the bright build frames {foodTarget}',
    bridge1Variants: [
      'the bright build frames {foodTarget}',
      'the citrus-driven lift cuts {foodTarget}',
      'the shaken-cocktail register carries {foodTarget}',
      'the gin-or-tequila build matches {foodTarget}',
      'the high-acid cocktail body sits with {foodTarget}',
    ],
    bridge2: 'the citrus cuts {foodSubj}',
    bridge2Variants: [
      'the citrus cuts {foodSubj}',
      'the bright lemon-lime edge brightens {foodSubj}',
      'the herbal-citrus thread underlines {foodSubj}',
      'the egg-white silk softens {foodSubj}',
      'the bubble-or-tonic top lifts {foodSubj}',
    ],
    verdictHook: 'light cocktail'
  },
  SWEET_LIQUEUR: {
    character: 'sweet liqueur character',
    bridge1: 'the digestif body mirrors {foodTarget}',
    bridge1Variants: [
      'the digestif body mirrors {foodTarget}',
      'the sweet-liqueur register carries {foodTarget}',
      'the herbal-sweet weight matches {foodTarget}',
      'the after-dinner pour body sits with {foodTarget}',
      'the syrupy liqueur weight wraps {foodTarget}',
    ],
    bridge2: 'the herbal-sugar edge threads {foodSubj}',
    bridge2Variants: [
      'the herbal-sugar edge threads {foodSubj}',
      'the digestif sweetness softens {foodSubj}',
      'the orange-or-anise note underlines {foodSubj}',
      'the soft-spice register brightens {foodSubj}',
      'the candied-fruit edge plays against {foodSubj}',
    ],
    verdictHook: 'digestif liqueur'
  },
  APERITIVO_BITTER: {
    character: 'bitter-herb aperitivo edge',
    bridge1: 'the herbal cut works {foodTarget}',
    bridge1Variants: [
      'the herbal cut works {foodTarget}',
      'the amaro-bitter register cuts {foodTarget}',
      'the gentian-driven edge sharpens {foodTarget}',
      'the bittersweet aperitivo body matches {foodTarget}',
      'the rhubarb-and-orange aperitivo carries {foodTarget}',
    ],
    bridge2: 'the amaro backbone frames {foodSubj}',
    bridge2Variants: [
      'the amaro backbone frames {foodSubj}',
      'the herbal-bitter edge underlines {foodSubj}',
      'the bittersweet thread cuts {foodSubj}',
      'the orange-rind register brightens {foodSubj}',
      'the gentian bite plays against {foodSubj}',
    ],
    verdictHook: 'aperitivo'
  },
  SWEET_WINE: {
    character: 'dessert-wine sweetness',
    bridge1: 'the late-harvest body mirrors {foodTarget}',
    bridge1Variants: [
      'the late-harvest body mirrors {foodTarget}',
      'the dessert-wine register matches {foodTarget}',
      'the botrytis-honey weight wraps {foodTarget}',
      'the Sauternes-or-Port body carries {foodTarget}',
      'the sticky-sweet pour sits with {foodTarget}',
    ],
    bridge2: 'the honey threads {foodSubj}',
    bridge2Variants: [
      'the honey threads {foodSubj}',
      'the apricot-and-marmalade note underlines {foodSubj}',
      'the late-harvest sugar rounds {foodSubj}',
      'the noble-rot register brightens {foodSubj}',
      'the dessert-wine acid balances {foodSubj}',
    ],
    verdictHook: 'dessert wine'
  },
};

// ── WHISKEY VOICE SUBCLASS ─────────────────────────────────────────────────
// CLAUDE.md groups all whiskey-family under BOURBON_BOLD for tier reasoning.
// For VOICE/LANGUAGE, we split into Bourbon / Scotch / Irish / Japanese /
// Canadian / Rye so the prose doesn't say "bourbon depth" about Glenmorangie.

function whiskeyVoiceSubclass(drink) {
  const cat = drink.category;
  const name = drink.name.toLowerCase();
  // Name patterns win over category (some data has Jack Daniel's miscategorized as singlemalt)
  if (/jack daniel|gentleman jack|george dickel/.test(name)) return 'BOURBON';
  if (cat === 'scotch' || cat === 'singlemalt') return 'SCOTCH';
  if (cat === 'irish')    return 'IRISH';
  if (cat === 'japanese') return 'JAPANESE';
  if (cat === 'canadian') return 'CANADIAN';
  if (/glenfiddich|glenlivet|glenmorangie|macallan|bowmore|laphroaig|lagavulin|aberlour|balvenie|cragganmore|dalmore|bruichladdich|loch lomond|glenglassaugh|monkey shoulder|johnnie walker|dewar|chivas|oban|midnight|highland/.test(name)) return 'SCOTCH';
  if (/jameson|tullamore|redbreast|bushmills|garavogue|dunville|midleton/.test(name)) return 'IRISH';
  if (/yamazaki|hakushu|hibiki|toki|suntory|nikka/.test(name)) return 'JAPANESE';
  if (/crown royal|canadian club|caribou crossing/.test(name)) return 'CANADIAN';
  if (/\brye\b/.test(name) || /sazerac|pikesville|whistlepig|mammoth.*rye/.test(name)) return 'RYE';
  return 'BOURBON';
}

const WHISKEY_VOICE_DEFAULTS = {
  BOURBON:  {
    character: 'oak-and-vanilla bourbon depth',
    bridge1: 'the bourbon depth settles into {foodTarget}',
    bridge1Variants: [
      'the bourbon depth settles into {foodTarget}',
      'the oak-and-vanilla weight wraps {foodTarget}',
      'the bourbon body sits with {foodTarget}',
      'the brown-spirit warmth threads {foodTarget}',
      'the caramel-spice register matches {foodTarget}',
      'the bourbon backbone carries {foodTarget}',
      'the oak depth lays under {foodTarget}',
      'the bourbon weight handles {foodTarget}',
    ],
    bridge2: 'the vanilla softens {foodSubj}',
    bridge2Variants: [
      'the vanilla softens {foodSubj}',
      'the caramel rounds {foodSubj}',
      'the oak frames {foodSubj}',
      'the rounded sweetness brightens {foodSubj}',
      'the toffee-vanilla edge underlines {foodSubj}',
      'the oak-and-spice register settles {foodSubj}',
    ],
    verdictHook: 'bourbon', avoidLabel: 'bourbon'
  },
  SCOTCH:   {
    character: 'Highland-scotch character',
    bridge1: 'the scotch depth settles into {foodTarget}',
    bridge1Variants: [
      'the scotch depth settles into {foodTarget}',
      'the malt-driven body wraps {foodTarget}',
      'the Highland register carries {foodTarget}',
      'the heather-and-honey weight sits with {foodTarget}',
      'the malt-and-oak threads {foodTarget}',
      'the scotch backbone matches {foodTarget}',
    ],
    bridge2: 'the malt edge frames {foodSubj}',
    bridge2Variants: [
      'the malt edge frames {foodSubj}',
      'the smoke threads {foodSubj}',
      'the heather brightens {foodSubj}',
      'the honey rounds {foodSubj}',
      'the oak-and-smoke underlines {foodSubj}',
      'the malt-driven sweetness softens {foodSubj}',
    ],
    verdictHook: 'scotch', avoidLabel: 'scotch'
  },
  IRISH: {
    character: 'Irish whiskey smoothness',
    bridge1: 'the Irish whiskey body sits with {foodTarget}',
    bridge1Variants: [
      'the Irish whiskey body sits with {foodTarget}',
      'the smooth triple-distilled register matches {foodTarget}',
      'the soft malt-and-grain weight wraps {foodTarget}',
      'the approachable Irish character carries {foodTarget}',
      'the gentle Irish body threads {foodTarget}',
      'the malt-grain blend handles {foodTarget}',
    ],
    bridge2: 'the soft malt rounds {foodSubj}',
    bridge2Variants: [
      'the soft malt rounds {foodSubj}',
      'the gentle barley note frames {foodSubj}',
      'the triple-distilled smoothness brightens {foodSubj}',
      'the orchard-fruit edge underlines {foodSubj}',
      'the grain register softens {foodSubj}',
    ],
    verdictHook: 'Irish whiskey', avoidLabel: 'Irish whiskey'
  },
  JAPANESE: {
    character: 'Japanese whisky precision',
    bridge1: 'the Japanese whisky balance frames {foodTarget}',
    bridge1Variants: [
      'the Japanese whisky balance frames {foodTarget}',
      'the Mizunara-influenced register sits with {foodTarget}',
      'the precise Japanese craft body wraps {foodTarget}',
      'the elegant Suntory/Nikka register matches {foodTarget}',
      'the restrained whisky body threads {foodTarget}',
    ],
    bridge2: 'the precision rounds {foodSubj}',
    bridge2Variants: [
      'the precision rounds {foodSubj}',
      'the umami-tinged finish frames {foodSubj}',
      'the Japanese-craft balance underlines {foodSubj}',
      'the green-fruit edge brightens {foodSubj}',
      'the sandalwood-and-honey register softens {foodSubj}',
    ],
    verdictHook: 'Japanese whisky', avoidLabel: 'Japanese whisky'
  },
  CANADIAN: {
    character: 'Canadian whisky character',
    bridge1: 'the Canadian whisky weight matches {foodTarget}',
    bridge1Variants: [
      'the Canadian whisky weight matches {foodTarget}',
      'the rye-blended Canadian body sits with {foodTarget}',
      'the smooth Canadian register carries {foodTarget}',
      'the easygoing Canadian character handles {foodTarget}',
      'the blended whisky body wraps {foodTarget}',
    ],
    bridge2: 'the soft profile rounds {foodSubj}',
    bridge2Variants: [
      'the soft profile rounds {foodSubj}',
      'the light caramel edge frames {foodSubj}',
      'the gentle rye thread underlines {foodSubj}',
      'the easy Canadian register softens {foodSubj}',
      'the light-grain note brightens {foodSubj}',
    ],
    verdictHook: 'Canadian whisky', avoidLabel: 'Canadian whisky'
  },
  RYE: {
    character: 'rye-spice character',
    bridge1: 'the rye spice cuts {foodTarget}',
    bridge1Variants: [
      'the rye spice cuts {foodTarget}',
      'the rye-pepper edge sharpens {foodTarget}',
      'the rye backbone drives {foodTarget}',
      'the high-rye spice register matches {foodTarget}',
      'the dry rye body wraps {foodTarget}',
      'the rye-and-oak weight handles {foodTarget}',
    ],
    bridge2: 'the rye edge frames {foodSubj}',
    bridge2Variants: [
      'the rye edge frames {foodSubj}',
      'the rye-pepper note underlines {foodSubj}',
      'the dry-spice register brightens {foodSubj}',
      'the rye-grain bite cuts {foodSubj}',
      'the spice-and-vanilla thread softens {foodSubj}',
    ],
    verdictHook: 'rye whiskey', avoidLabel: 'rye whiskey'
  },
};

// ── ELEGANT_RED VOICE SUBCLASS ─────────────────────────────────────────────
// ELEGANT_RED is a broad bucket containing Pinot Noir, Cabernet, Nebbiolo,
// Sangiovese, Rhone, Tempranillo, Malbec, Zinfandel — each reading distinctly
// at the table. This splits the voice the same way whiskey is split.

function elegantRedVoiceSubclass(drink) {
  const profile = (drink.profile || []).map(p => p.toLowerCase()).join(' ');
  const name = drink.name.toLowerCase();
  const all = profile + ' ' + name;

  if (/\bpinot[- ]noir\b/.test(all) || /pinot/.test(name)) return 'PINOT';
  if (/\bnebbiolo\b|\bbarolo\b|\bbarbaresco\b/.test(all)) return 'NEBBIOLO';
  if (/\bsangiovese\b|\bchianti\b|\bbarbera\b|tuscan-blend|super-tuscan/.test(all)) return 'CHIANTI';
  if (/\bgrenache\b|\bsyrah\b|\bmourv|\brhone\b|\brh\u00f4ne\b|gigondas|bandol|rhone-style/.test(all)) return 'RHONE';
  if (/\btempranillo\b|\brioja\b|\bmencia\b|\bmenc\u00eda\b/.test(all)) return 'SPANISH';
  if (/\bmalbec\b/.test(all)) return 'MALBEC';
  if (/\bzinfandel\b|\bzin\b|petite-sirah|petite syrah|zin-led|zin-dominant/.test(all)) return 'ZIN';
  if (/cab-franc|cabernet-franc|chinon/.test(all)) return 'CAB_FRANC';
  if (/saint-\u00e9milion|pomerol|bordeaux-blend|bordeaux blend|merlot-dominant/.test(all)) return 'BORDEAUX';
  if (/\bcab\b|\bcabernet\b|napa cab|cab-dominant|meritage/.test(all)) return 'CAB';
  return 'GENERIC_ELEGANT_RED';
}

const ELEGANT_RED_VOICE_DEFAULTS = {
  PINOT: {
    character: 'silky Pinot Noir with cherry-and-forest-floor lift',
    bridge1: 'the Pinot body brightens {foodTarget}',
    bridge1Variants: [
      'the Pinot body brightens {foodTarget}',
      'the silky red-fruit lift carries {foodTarget}',
      'the cool-climate Pinot register sits with {foodTarget}',
      'the cherry-bright Pinot weight wraps {foodTarget}',
      'the supple Pinot body matches {foodTarget}',
      'the Pinot finesse threads {foodTarget}',
    ],
    bridge2: 'the cherry-and-earth note frames {foodSubj}',
    bridge2Variants: [
      'the cherry-and-earth note frames {foodSubj}',
      'the forest-floor edge underlines {foodSubj}',
      'the red-cherry register brightens {foodSubj}',
      'the silky tannin softens {foodSubj}',
      'the cool red-fruit note plays against {foodSubj}',
    ],
    verdictHook: 'Pinot Noir'
  },
  NEBBIOLO: {
    character: 'high-acid Nebbiolo with rose-and-tar grip',
    bridge1: 'the Nebbiolo grip cuts {foodTarget}',
    bridge1Variants: [
      'the Nebbiolo grip cuts {foodTarget}',
      'the Piedmont tannin grips {foodTarget}',
      'the high-acid Nebbiolo register matches {foodTarget}',
      'the rose-and-tar body wraps {foodTarget}',
      'the dried-cherry Nebbiolo weight handles {foodTarget}',
    ],
    bridge2: 'the tar-and-rose edge frames {foodSubj}',
    bridge2Variants: [
      'the tar-and-rose edge frames {foodSubj}',
      'the dried-fruit note underlines {foodSubj}',
      'the firm Piedmont tannin grips {foodSubj}',
      'the orange-peel-and-leather edge brightens {foodSubj}',
      'the savory dried-cherry register plays against {foodSubj}',
    ],
    verdictHook: 'Piedmont Nebbiolo'
  },
  CHIANTI: {
    character: 'Sangiovese-driven Tuscan acidity',
    bridge1: 'the bright Sangiovese body lifts {foodTarget}',
    bridge1Variants: [
      'the bright Sangiovese body lifts {foodTarget}',
      'the high-acid Tuscan register cuts {foodTarget}',
      'the cherry-leather Sangiovese body matches {foodTarget}',
      'the savory Tuscan red carries {foodTarget}',
      'the dusty Sangiovese tannin wraps {foodTarget}',
    ],
    bridge2: 'the cherry-leather edge frames {foodSubj}',
    bridge2Variants: [
      'the cherry-leather edge frames {foodSubj}',
      'the dried-herb note underlines {foodSubj}',
      'the Sangiovese acid brightens {foodSubj}',
      'the dusty tannin grips {foodSubj}',
      'the savory red register plays against {foodSubj}',
    ],
    verdictHook: 'Tuscan Sangiovese'
  },
  RHONE: {
    character: 'spice-and-dark-fruit Rhone register',
    bridge1: 'the Rhone-blend body wraps {foodTarget}',
    bridge1Variants: [
      'the Rhone-blend body wraps {foodTarget}',
      'the GSM-spice weight handles {foodTarget}',
      'the peppery Rhone register sits with {foodTarget}',
      'the dark-fruit-and-garrigue body matches {foodTarget}',
      'the Syrah-led blend carries {foodTarget}',
    ],
    bridge2: 'the peppery edge frames {foodSubj}',
    bridge2Variants: [
      'the peppery edge frames {foodSubj}',
      'the garrigue-herb note underlines {foodSubj}',
      'the dark-plum register brightens {foodSubj}',
      'the white-pepper edge plays against {foodSubj}',
      'the smoke-and-violet thread softens {foodSubj}',
    ],
    verdictHook: 'Rhone red'
  },
  SPANISH: {
    character: 'Tempranillo with vanilla-and-leather depth',
    bridge1: 'the Tempranillo body wraps {foodTarget}',
    bridge1Variants: [
      'the Tempranillo body wraps {foodTarget}',
      'the Rioja American-oak register matches {foodTarget}',
      'the vanilla-and-leather weight carries {foodTarget}',
      'the dried-cherry Tempranillo handles {foodTarget}',
      'the Spanish-red body sits with {foodTarget}',
    ],
    bridge2: 'the vanilla-leather edge frames {foodSubj}',
    bridge2Variants: [
      'the vanilla-leather edge frames {foodSubj}',
      'the dried-fig note underlines {foodSubj}',
      'the American-oak vanilla brightens {foodSubj}',
      'the leather-and-tobacco register softens {foodSubj}',
      'the Tempranillo tannin grips {foodSubj}',
    ],
    verdictHook: 'Spanish red'
  },
  MALBEC: {
    character: 'plush Malbec with plum-and-violet weight',
    bridge1: 'the Malbec body wraps {foodTarget}',
    bridge1Variants: [
      'the Malbec body wraps {foodTarget}',
      'the plush plum register handles {foodTarget}',
      'the Argentine Malbec weight carries {foodTarget}',
      'the plum-and-violet body matches {foodTarget}',
      'the high-altitude Malbec register sits with {foodTarget}',
    ],
    bridge2: 'the plum-and-violet edge frames {foodSubj}',
    bridge2Variants: [
      'the plum-and-violet edge frames {foodSubj}',
      'the inky body underlines {foodSubj}',
      'the violet-and-mocha note brightens {foodSubj}',
      'the soft-tannin register plays against {foodSubj}',
      'the dark-plum thread softens {foodSubj}',
    ],
    verdictHook: 'Argentine Malbec'
  },
  ZIN: {
    character: 'jammy Zinfandel with bramble-and-pepper lift',
    bridge1: 'the Zin body wraps {foodTarget}',
    bridge1Variants: [
      'the Zin body wraps {foodTarget}',
      'the jammy Zinfandel register handles {foodTarget}',
      'the bramble-fruit weight carries {foodTarget}',
      'the high-octane Zin body matches {foodTarget}',
      'the warm Zinfandel register sits with {foodTarget}',
    ],
    bridge2: 'the bramble-and-pepper edge frames {foodSubj}',
    bridge2Variants: [
      'the bramble-and-pepper edge frames {foodSubj}',
      'the wild-fruit note underlines {foodSubj}',
      'the briary edge brightens {foodSubj}',
      'the warm-spice register plays against {foodSubj}',
      'the high-extract sweetness rounds {foodSubj}',
    ],
    verdictHook: 'Zinfandel'
  },
  CAB_FRANC: {
    character: 'herbaceous Cab Franc with red-fruit and bell-pepper',
    bridge1: 'the Cab Franc body lifts {foodTarget}',
    bridge1Variants: [
      'the Cab Franc body lifts {foodTarget}',
      'the herbaceous Loire Cab Franc register matches {foodTarget}',
      'the red-fruit-and-pepper weight carries {foodTarget}',
      'the bright Cab Franc body wraps {foodTarget}',
      'the Chinon-style register sits with {foodTarget}',
    ],
    bridge2: 'the bell-pepper-and-cherry note frames {foodSubj}',
    bridge2Variants: [
      'the bell-pepper-and-cherry note frames {foodSubj}',
      'the green-herb register underlines {foodSubj}',
      'the bright red-fruit edge brightens {foodSubj}',
      'the Loire pepper note plays against {foodSubj}',
      'the herbaceous thread softens {foodSubj}',
    ],
    verdictHook: 'Cab Franc'
  },
  BORDEAUX: {
    character: 'Merlot-led Bordeaux blend with plush dark-fruit',
    bridge1: 'the Bordeaux body wraps {foodTarget}',
    bridge1Variants: [
      'the Bordeaux body wraps {foodTarget}',
      'the Merlot-led blend register handles {foodTarget}',
      'the right-bank weight carries {foodTarget}',
      'the cedar-and-cassis Bordeaux body matches {foodTarget}',
      'the structured Bordeaux register sits with {foodTarget}',
    ],
    bridge2: 'the cassis-and-tobacco edge frames {foodSubj}',
    bridge2Variants: [
      'the cassis-and-tobacco edge frames {foodSubj}',
      'the cedar note underlines {foodSubj}',
      'the dark-plum register brightens {foodSubj}',
      'the leather-and-graphite edge plays against {foodSubj}',
      'the Bordeaux tannin grips {foodSubj}',
    ],
    verdictHook: 'Bordeaux blend'
  },
  CAB: {
    character: 'structured Cabernet with cassis-and-cedar depth',
    bridge1: 'the Cabernet body wraps {foodTarget}',
    bridge1Variants: [
      'the Cabernet body wraps {foodTarget}',
      'the structured Cab tannin grips {foodTarget}',
      'the cassis-and-cedar register handles {foodTarget}',
      'the Napa Cab body carries {foodTarget}',
      'the polished Cab weight matches {foodTarget}',
      'the dark-fruit Cab register sits with {foodTarget}',
    ],
    bridge2: 'the cassis-and-cedar edge frames {foodSubj}',
    bridge2Variants: [
      'the cassis-and-cedar edge frames {foodSubj}',
      'the blackcurrant register underlines {foodSubj}',
      'the firm Cab tannin grips {foodSubj}',
      'the dark-plum edge plays against {foodSubj}',
      'the cedar-tobacco note brightens {foodSubj}',
    ],
    verdictHook: 'Cabernet Sauvignon'
  },
  GENERIC_ELEGANT_RED: {
    character: 'red-fruit-and-spice elegance',
    bridge1: 'the silky body carries {foodTarget}',
    bridge1Variants: [
      'the silky body carries {foodTarget}',
      'the elegant red-fruit register matches {foodTarget}',
      'the polished tannin wraps {foodTarget}',
      'the medium-body red sits with {foodTarget}',
      'the red-fruit-and-spice weight handles {foodTarget}',
    ],
    bridge2: 'the cherry-pepper note frames {foodSubj}',
    bridge2Variants: [
      'the cherry-pepper note frames {foodSubj}',
      'the red-fruit edge brightens {foodSubj}',
      'the silky tannin softens {foodSubj}',
      'the spice register underlines {foodSubj}',
      'the elegant red note plays against {foodSubj}',
    ],
    verdictHook: 'elegant red'
  },
};

// Try to load mined profiles (auto-generated). Optional dependency.
let MINED_PROFILES = {};
let CURATED_PROFILES = {};
try { MINED_PROFILES = require('./bottle_profiles_mined').BOTTLE_PROFILES_MINED || {}; }
catch (e) { MINED_PROFILES = {}; }
try { CURATED_PROFILES = require('./bottle_profiles_curated').BOTTLE_PROFILES_CURATED || {}; }
catch (e) { CURATED_PROFILES = {}; }
let TIER_CORRECTIONS = {};
let COMPETITOR_REFS = {};
try { TIER_CORRECTIONS = require('./tier_corrections').TIER_CORRECTIONS || {}; }
catch (e) { TIER_CORRECTIONS = {}; }
try { COMPETITOR_REFS = require('./competitor_refs').COMPETITOR_REFS || {}; }
catch (e) { COMPETITOR_REFS = {}; }

// LIGHT_SPIRIT subclass: distinguish blanco tequila from light rum.
function lightSpiritVoiceSubclass(drink) {
  const name = drink.name.toLowerCase();
  if (/\brum\b|bacardi|mount gay|captain morgan|malibu/.test(name)) return 'RUM_LIGHT';
  return 'TEQUILA_BLANCO';
}

const LIGHT_SPIRIT_VOICE_DEFAULTS = {
  TEQUILA_BLANCO: {
    character: 'unaged blanco-tequila lift with agave-citrus snap',
    bridge1: 'the unaged body brightens {foodTarget}',
    bridge1Variants: [
      'the unaged body brightens {foodTarget}',
      'the silver-tequila register lifts {foodTarget}',
      'the blanco-tequila body matches {foodTarget}',
      'the bright agave-citrus weight carries {foodTarget}',
      'the unaged blanco body cuts {foodTarget}',
    ],
    bridge2: 'the agave-citrus thread frames {foodSubj}',
    bridge2Variants: [
      'the agave-citrus thread frames {foodSubj}',
      'the green-agave edge brightens {foodSubj}',
      'the bright blanco register underlines {foodSubj}',
      'the unaged-agave note plays against {foodSubj}',
      'the lime-and-pepper thread softens {foodSubj}',
    ],
    verdictHook: 'blanco tequila',
  },
  RUM_LIGHT: {
    character: 'light-rum register with cane and citrus lift',
    bridge1: 'the light-rum body lifts {foodTarget}',
    bridge1Variants: [
      'the light-rum body lifts {foodTarget}',
      'the unaged-cane register matches {foodTarget}',
      'the Caribbean-rum body carries {foodTarget}',
      'the bright cane-and-citrus weight wraps {foodTarget}',
      'the silver-rum body cuts {foodTarget}',
      'the molasses-light register sits with {foodTarget}',
    ],
    bridge2: 'the cane-and-citrus thread frames {foodSubj}',
    bridge2Variants: [
      'the cane-and-citrus thread frames {foodSubj}',
      'the bright sugarcane edge underlines {foodSubj}',
      'the Caribbean register brightens {foodSubj}',
      'the light-rum lift plays against {foodSubj}',
      'the rum-and-lime thread softens {foodSubj}',
    ],
    verdictHook: 'light rum',
  },
};

// HEAVY_SPIRIT subclass: most are aged/dark rums (Doctor Bird, Myers's, Jung & Wulff, Ron Zacapa).
function heavySpiritVoiceSubclass(drink) {
  const name = drink.name.toLowerCase();
  if (/\brum\b|jung and wulff|doctor bird|ron zacapa|myers/.test(name)) return 'RUM_AGED';
  return 'GENERIC_HEAVY';
}

const HEAVY_SPIRIT_VOICE_DEFAULTS = {
  RUM_AGED: {
    character: 'aged-rum register with molasses and oak depth',
    bridge1: 'the aged-rum body wraps {foodTarget}',
    bridge1Variants: [
      'the aged-rum body wraps {foodTarget}',
      'the molasses-and-oak weight carries {foodTarget}',
      'the dark-rum register matches {foodTarget}',
      'the aged-cane body sits with {foodTarget}',
      'the Caribbean-aged depth handles {foodTarget}',
      'the molasses-rum weight threads {foodTarget}',
    ],
    bridge2: 'the molasses-and-oak edge frames {foodSubj}',
    bridge2Variants: [
      'the molasses-and-oak edge frames {foodSubj}',
      'the dark-cane note underlines {foodSubj}',
      'the aged-cane sweetness brightens {foodSubj}',
      'the rum-oak register softens {foodSubj}',
      'the molasses-and-spice thread plays against {foodSubj}',
    ],
    verdictHook: 'aged rum',
  },
  GENERIC_HEAVY: {
    character: 'dense-spirit weight',
    bridge1: 'the heavy body handles {foodTarget}',
    bridge1Variants: [
      'the heavy body handles {foodTarget}',
      'the dense-spirit weight carries {foodTarget}',
      'the high-proof register matches {foodTarget}',
      'the rich pour wraps {foodTarget}',
      'the layered spirit body sits with {foodTarget}',
    ],
    bridge2: 'the deep backbone frames {foodSubj}',
    bridge2Variants: [
      'the deep backbone frames {foodSubj}',
      'the heavy-pour register grips {foodSubj}',
      'the dense weight underlines {foodSubj}',
      'the layered body brightens {foodSubj}',
      'the rich character softens {foodSubj}',
    ],
    verdictHook: 'heavy pour',
  },
};

function classDefaultFor(drink) {
  const dc = taxonomy.drinkClassFor(drink) || 'BOURBON_BOLD';
  if (dc === 'BOURBON_BOLD') {
    const sub = whiskeyVoiceSubclass(drink);
    return WHISKEY_VOICE_DEFAULTS[sub] || WHISKEY_VOICE_DEFAULTS.BOURBON;
  }
  if (dc === 'ELEGANT_RED') {
    const sub = elegantRedVoiceSubclass(drink);
    return ELEGANT_RED_VOICE_DEFAULTS[sub] || ELEGANT_RED_VOICE_DEFAULTS.GENERIC_ELEGANT_RED;
  }
  if (dc === 'LIGHT_SPIRIT') {
    const sub = lightSpiritVoiceSubclass(drink);
    return LIGHT_SPIRIT_VOICE_DEFAULTS[sub] || LIGHT_SPIRIT_VOICE_DEFAULTS.TEQUILA_BLANCO;
  }
  if (dc === 'HEAVY_SPIRIT') {
    const sub = heavySpiritVoiceSubclass(drink);
    return HEAVY_SPIRIT_VOICE_DEFAULTS[sub] || HEAVY_SPIRIT_VOICE_DEFAULTS.GENERIC_HEAVY;
  }
  return DRINK_CLASS_DEFAULT[dc] || DRINK_CLASS_DEFAULT.BOURBON_BOLD;
}

function profileFor(drink) {
  if (BOTTLE_PROFILE[drink.name]) {
    // Merge variants from class default if the curated bottle lacks them.
    // This lets per-bottle profiles inherit the variant pool for variety
    // while keeping their own character / verdictHook / single-bridge fallback.
    const inline = BOTTLE_PROFILE[drink.name];
    if (inline.bridge1Variants || inline.bridge2Variants) return inline;
    const cd = classDefaultFor(drink);
    if (cd && (cd.bridge1Variants || cd.bridge2Variants)) {
      return Object.assign({}, inline, {
        bridge1Variants: cd.bridge1Variants,
        bridge2Variants: cd.bridge2Variants,
      });
    }
    return inline;
  }

  const dc = taxonomy.drinkClassFor(drink) || 'BOURBON_BOLD';
  // Class-default base
  let base;
  if (dc === 'BOURBON_BOLD') {
    const sub = whiskeyVoiceSubclass(drink);
    base = WHISKEY_VOICE_DEFAULTS[sub] || WHISKEY_VOICE_DEFAULTS.BOURBON;
  } else if (dc === 'ELEGANT_RED') {
    const sub = elegantRedVoiceSubclass(drink);
    base = ELEGANT_RED_VOICE_DEFAULTS[sub] || ELEGANT_RED_VOICE_DEFAULTS.GENERIC_ELEGANT_RED;
  } else if (dc === 'LIGHT_SPIRIT') {
    const sub = lightSpiritVoiceSubclass(drink);
    base = LIGHT_SPIRIT_VOICE_DEFAULTS[sub] || LIGHT_SPIRIT_VOICE_DEFAULTS.TEQUILA_BLANCO;
  } else if (dc === 'HEAVY_SPIRIT') {
    const sub = heavySpiritVoiceSubclass(drink);
    base = HEAVY_SPIRIT_VOICE_DEFAULTS[sub] || HEAVY_SPIRIT_VOICE_DEFAULTS.GENERIC_HEAVY;
  } else {
    base = DRINK_CLASS_DEFAULT[dc] || DRINK_CLASS_DEFAULT.BOURBON_BOLD;
  }
  // Mined overlay: tastingNotes/character/verdictHook win if present
  // CURATED takes precedence over MINED. Both lose to inline BOTTLE_PROFILE.
  if (CURATED_PROFILES[drink.name]) return Object.assign({}, base, CURATED_PROFILES[drink.name]);
  const mined = MINED_PROFILES[drink.name];
  if (mined) {
    // Reject mined character if it repeats the bottle's own name anywhere
    // (e.g. "accessible aged El Mayor" for El Mayor Extra Anejo).
    let useCharacter = mined.character;
    if (useCharacter) {
      const nameWords = drink.name.split(/\s+/).filter(w => w.length > 2);
      for (const w of nameWords) {
        const escW = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (new RegExp('\\b' + escW + '\\b', 'i').test(useCharacter)) {
          useCharacter = null;
          break;
        }
      }
    }
    return Object.assign({}, base, {
      tastingNotes: mined.tastingNotes || base.tastingNotes || null,
      character:    useCharacter || base.character,
      verdictHook:  mined.verdictHook  || base.verdictHook,
    });
  }
  return Object.assign({ tastingNotes: null }, base);
}

// ── DRINK-CLASS COMPATIBILITY FILTER FOR CHEMISTRY ─────────────────────────
// Reject chemistry clauses whose text contains drink-class qualifiers that
// don't match the current drink's class.

const DRINK_CLASS_REJECT_KEYWORDS = {
  BIG_RED:          ['bourbon', 'agave', 'gin', 'vodka', 'champagne', 'mezcal', 'sherry', 'rum'],
  ELEGANT_RED:      ['bourbon', 'agave', 'gin', 'vodka', 'champagne', 'mezcal', 'sherry', 'rum'],
  BOURBON_BOLD:     ['cab', 'pinot', 'agave', 'champagne', 'rum', 'gin', 'vodka', 'mezcal'],
  TEQUILA_BOLD:     ['bourbon', 'cab', 'pinot', 'champagne', 'gin', 'vodka', 'cognac'],
  MEZCAL:           ['bourbon', 'cab', 'pinot', 'champagne', 'gin', 'vodka', 'cognac'],
  COGNAC:           ['bourbon', 'cab', 'pinot', 'champagne', 'gin', 'vodka', 'agave', 'mezcal'],
  COGNAC_LUXURY:    ['bourbon', 'cab', 'pinot', 'champagne', 'gin', 'vodka', 'agave', 'mezcal'],
  SPARKLING:        ['bourbon', 'cab', 'pinot', 'agave', 'gin', 'vodka', 'mezcal', 'cognac'],
  WHITE_WINE:       ['bourbon', 'cab', 'pinot', 'agave', 'gin', 'vodka', 'mezcal', 'cognac', 'champagne'],
  GIN:              ['bourbon', 'cab', 'pinot', 'agave', 'champagne', 'mezcal', 'vodka'],
  VODKA:            ['bourbon', 'cab', 'pinot', 'agave', 'champagne', 'mezcal', 'gin'],
  LIGHT_SPIRIT:     ['bourbon', 'cab', 'pinot', 'champagne', 'cognac'],
  HEAVY_SPIRIT:     ['cab', 'pinot', 'champagne'],
  COCKTAIL_BOLD:    ['cab', 'pinot', 'champagne'],
  COCKTAIL_LIGHT:   ['bourbon', 'cab', 'pinot', 'champagne', 'cognac', 'mezcal'],
  SWEET_LIQUEUR:    ['cab', 'pinot', 'champagne'],
  APERITIVO_BITTER: ['bourbon', 'cab', 'pinot', 'agave', 'champagne'],
  SWEET_WINE:       ['bourbon', 'agave', 'gin', 'vodka', 'mezcal'],
};

function clauseFitsDrinkClass(clause, drinkClass) {
  if (!drinkClass) return true;
  const rejects = DRINK_CLASS_REJECT_KEYWORDS[drinkClass] || [];
  const lower = clause.toLowerCase();
  for (const r of rejects) {
    if (lower.includes(r)) return false;
  }
  return true;
}

// Look up a chemistry clause for (drink × food), filtered by drink-class.
function findChemistryClause(drink, food, ctx) {
  const claims = ctx && ctx.CHEMISTRY_CLAIMS;
  if (!claims) return null;
  const dc = taxonomy.drinkClassFor(drink);

  // Tight filter: chemistry clause must
  //   1. fit drink-class (no bourbon language on Cab, etc.)
  //   2. have a high count (>=50) — generic clauses generalize across pairs;
  //      low-count clauses tend to carry pair-specific qualifiers ("herb
  //      butter" from an escargot pairing, etc.) that don't fit other foods.
  //   3. only quote modifiers the food actually has (filter on food-side
  //      modifier words like "herb", "rendered", "seared" — reject if the
  //      food's character text doesn't include them).
  const MIN_COUNT = 50;
  const FOOD_MODIFIERS = ['herb', 'rendered', 'cap-fat', 'briny', 'caramelized', 'garlic-butter', 'truffle-oil', 'creole'];
  const foodCharText = (fxfGen.FOOD_CHARACTER[food.name] || '').toLowerCase() + ' ' + (food.profile || []).join(' ');

  const drinkFlavors = drinkFlavorsFor(drink);
  const foodFlavors  = fxfGen.flavorsFor(food);

  let bestClause = null;
  let bestCount = 0;
  for (const df of drinkFlavors) {
    if (!claims[df]) continue;
    for (const ff of foodFlavors) {
      const entry = claims[df][ff];
      if (!entry) continue;
      if (entry.count < MIN_COUNT) continue;
      const checkClause = entry.clause || (Array.isArray(entry.clauses) && entry.clauses[0]) || '';
      if (!clauseFitsDrinkClass(checkClause, dc)) continue;
      // Check food-side modifier match
      const lower = (entry.clause || (Array.isArray(entry.clauses) && entry.clauses[0]) || '').toLowerCase();
      let modifierOk = true;
      for (const mod of FOOD_MODIFIERS) {
        if (lower.includes(mod) && !foodCharText.includes(mod)) {
          modifierOk = false;
          break;
        }
      }
      if (!modifierOk) continue;
      if (entry.count > bestCount) {
        // Variant pool support: entry may be { clauses: [...], count } for hot
        // chemistry pairs that would otherwise recycle one clause across many
        // bottles.
        if (Array.isArray(entry.clauses) && entry.clauses.length > 0) {
          const seed = drink.name + '|' + food.name;
          let h = 0;
          for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
          bestClause = entry.clauses[Math.abs(h) % entry.clauses.length];
        } else {
          bestClause = entry.clause;
        }
        bestCount = entry.count;
      }
    }
  }
  return bestClause;
}

function drinkFlavorsFor(drink) {
  const dc = taxonomy.drinkClassFor(drink);
  const out = [];
  switch (dc) {
    case 'BOURBON_BOLD': {
      const sub = whiskeyVoiceSubclass(drink);
      if      (sub === 'SCOTCH')   out.push('oak','malt','smoke','honey');
      else if (sub === 'IRISH')    out.push('honey','oak','malt');
      else if (sub === 'JAPANESE') out.push('oak','silk','honey');
      else if (sub === 'CANADIAN') out.push('caramel','oak');
      else if (sub === 'RYE')      out.push('spice','caramel','oak');
      else                          out.push('oak','vanilla','caramel','spice');
      break;
    }
    case 'BIG_RED':          out.push('cassis','tannin','cherry-fruit','plum','graphite','red'); break;
    case 'ELEGANT_RED':      out.push('cherry-fruit','red','silk'); break;
    case 'WHITE_WINE':       out.push('citrus','mineral','acidity'); break;
    case 'SPARKLING':        out.push('mousse-and-citrus','mousse-and-acid','citrus','acidity'); break;
    case 'GIN':              out.push('juniper','citrus'); break;
    case 'VODKA':            out.push('neutrality'); break;
    case 'TEQUILA_BOLD':     out.push('agave','agave-pepper'); break;
    case 'MEZCAL':           out.push('smoke','agave'); break;
    case 'COGNAC':           out.push('caramel'); break;
    case 'COGNAC_LUXURY':    out.push('caramel'); break;
    case 'LIGHT_SPIRIT':     out.push('citrus'); break;
    case 'COCKTAIL_BOLD':    out.push('spice'); break;
    case 'COCKTAIL_LIGHT':   out.push('citrus','lift'); break;
    case 'SWEET_LIQUEUR':    out.push('caramel','spice','honey','orange'); break;
    case 'APERITIVO_BITTER': out.push('bitter','orange','spice'); break;
    case 'SWEET_WINE':       out.push('honey','dried-fruit'); break;
  }
  return out;
}

// ── FOOD HELPERS (reuse food x food generator's name + bridge data) ────────

function _enrich(entity, ctx) {
  if (!ctx || !ctx.ENRICHED_PROFILES) return entity;
  const ep = ctx.ENRICHED_PROFILES[entity.name];
  if (!ep || !ep.axes) return entity;
  return Object.assign({}, entity, { axes: ep.axes });
}

function foodShortName(food) {
  // Reuse the same SHORT_NAME table from food x food generator
  const SHORT = {
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
  return SHORT[food.name] || food.name.replace(/^The\s+/i, '').toLowerCase();
}

function foodPossessive(food) {
  const sn = foodShortName(food);
  return sn.endsWith('s') ? sn + "'" : sn + "'s";
}

// Drink-side possessive: handles names ending in 's' (Vineyards', Booker's
// already has 's), avoiding double-possessive output.
function drinkPossessive(name) {
  // Names ending in 's' (e.g., "Booker's", "Basil Hayden's") are themselves
  // possessive — don't double-apostrophize. Names ending in 's' but NOT
  // already possessive (rare — "Pernod Ricard 70s" etc.) get the trailing
  // apostrophe per English style.
  if (name.endsWith("'s")) return name;          // already possessive
  if (name.endsWith('s')) return name + "'";     // trailing apostrophe
  return name + "'s";
}

// Strip a leading bottle-name possessive OR generic "this X's" prefix from
// a mined character phrase. Prevents "Bottle's Bottle's char" / "Bottle's
// this structured red's char" output.
function stripLeadingPossessive(name, char) {
  if (!char) return char;
  // 1. Exact bottle name prefix (e.g. "Avion 44's ...")
  const escName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  char = char.replace(new RegExp('^' + escName + "'s\\s+", 'i'), '');
  // 2. First word of bottle name + 's (e.g. "Avion's ..." when name is "Avion 44")
  const firstWord = name.split(/\s+/)[0];
  if (firstWord && firstWord.length > 2) {
    const escFirst = firstWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    char = char.replace(new RegExp("^" + escFirst + "'s\\s+", 'i'), '');
  }
  // 3. "this X's" or "this X" patterns (e.g. "this structured red's cassis...")
  char = char.replace(/^this\s+[\w\-]+(?:\s+[\w\-]+){0,3}'s\s+/i, '');
  char = char.replace(/^this\s+/i, '');
  return char;
}

// Pull bridge SUBJECT and TARGET phrases from the food x food bridge library.
function foodBridgeSubject(food) {
  const p = fxfGen.BRIDGE_PARTS[food.name];
  return p ? p.subjects[0] : 'the ' + (fxfGen.FOOD_CHARACTER[food.name] || food.name.toLowerCase());
}
function foodBridgeTarget(food) {
  const p = fxfGen.BRIDGE_PARTS[food.name];
  return p ? p.targets[0] : 'the ' + (fxfGen.FOOD_CHARACTER[food.name] || food.name.toLowerCase());
}
function foodCharacter(food) {
  return fxfGen.FOOD_CHARACTER[food.name] || (food.profile || []).slice(0,2).join(' and ') || food.name.toLowerCase();
}

// ── BUILD BODY (uses bottle bridges, with chemistry as alternate clause 2) ──

// Generic short form per food category — used in clause 2 to avoid repeating
// modifiers like "the bone-enhanced filet ... softens the bone-enhanced cut".
const FOOD_GENERIC_SHORT = {
  'steak':      'the cut',
  'main':       'the plate',
  'starter':    'the starter',
  'soup-salad': 'the bowl',
  'side':       'the side',
  'dessert':    'the dessert',
};
function foodGenericShort(food) {
  return FOOD_GENERIC_SHORT[food.category] || ('the ' + (food.profile && food.profile[0] || 'plate'));
}

// pickBridgeVariant — deterministic hash-based variant selector.
// Same (drink, food) pair always returns the same variant index, so the
// regenerated note text is stable across re-runs. Distributes across the
// pool, breaking the "bourbon depth settles on the plate" mono-skeleton.
function pickBridgeVariant(variants, drinkName, foodName) {
  if (!Array.isArray(variants) || variants.length === 0) return null;
  const seed = drinkName + '|' + foodName;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return variants[Math.abs(h) % variants.length];
}

function buildBody(drink, food, tier, ctx) {
  const profile = profileFor(drink);
  const tgt  = foodBridgeTarget(food);
  const subj = foodBridgeSubject(food);
  const generic = foodGenericShort(food);

  // Clause 1: from bottle's bridge1Variants pool (preferred) or bridge1 fallback.
  const b1tpl = pickBridgeVariant(profile.bridge1Variants, drink.name, food.name) || profile.bridge1;
  const clause1 = b1tpl
    .replace('{foodTarget}', tgt)
    .replace('{foodSubj}', subj);

  // Clause 2: prefer chemistry, else bottle's bridge2Variants pool / bridge2 fallback.
  const chem = (tier !== 'avoid') ? findChemistryClause(drink, food, ctx) : null;
  const b2tpl = pickBridgeVariant(profile.bridge2Variants, drink.name, food.name + '~b2') || profile.bridge2;
  const clause2 = chem || b2tpl
    .replace('{foodTarget}', generic)
    .replace('{foodSubj}', generic);

  return clause1 + ', and ' + clause2;
}

// ── VERDICT TEMPLATES (richer, name-aware) ─────────────────────────────────
// Each tier has an array of patterns. Pattern slots:
//   {hook}  - profile.verdictHook (e.g. "iconic Napa Cab")
//   {drink} - drink.name (e.g. "Caymus Cabernet Sauvignon")
//   {food}  - foodShortName (e.g. "the filet")

const VERDICT_PATTERNS = {
  gold: [
    "Gold standard; the {hook} that defines {food}.",
    "Gold standard; {drink} on {food} -- the call you don't second-guess.",
    "Gold standard; for {food}, {drink} is the answer, full stop.",
    "Gold standard; {hook} on {food} -- pour it and step back.",
    "Gold standard; if a guest asks what to drink with {food}, the answer is {drink}.",
    "Gold standard; pour {drink} on {food}, that's the play.",
    "Gold standard; {drink} into {food} -- textbook.",
  ],
  excellent: [
    "Excellent; {hook} on {food} -- the call servers pour without second-guessing.",
    "Excellent; the {hook} pour for {food}.",
    "Peak {hook} for {food} -- {drink} elegance meets the plate.",
    "Excellent; {hook} carries {food} without overshooting.",
    "Excellent; {drink} dials in cleanly on {food}.",
    "Excellent; {hook} when a guest asks what works on {food}.",
    "Excellent; {drink} sits in the pocket on {food}.",
    "Excellent; {hook} on {food} -- the kind of pour that earns a regular.",
  ],
  strong: [
    "Strong; {hook} on {food} reads cleanly at the table.",
    "Strong; reliable {hook} for {food}.",
    "Strong; {drink} earns its place next to {food}.",
    "Strong; {hook} keeps pace with {food}.",
    "Strong; {drink} on {food} -- workhorse pairing, no surprises.",
    "Strong; the {hook} option when the gold call is spoken for.",
    "Strong; {hook} settles in alongside {food} without asking for attention.",
  ],
  works: [
    "Works; the {hook} call sits at neutral register against {food}.",
    "Works; capable {hook} for {food}, but not the headline pour.",
    "Works; the {hook} pairing holds without pulling focus.",
    "Works; {drink} is fine on {food} -- fine, not memorable.",
    "Works; {hook} doesn't fight {food}, but doesn't lift it either.",
    "Works; {drink} pulls neither way against {food}.",
    "Works; the {hook} backup when the strong calls are weeded.",
    "Works; functional pour for {food} -- save the storytelling for another bottle.",
  ],
  avoid: [
    // avoid is handled separately (needs alternatives)
  ],
};

// ── EDITORIAL_PHRASES MAPPING ──────────────────────────────────────────────
// v9 EDITORIAL_PHRASES uses a different food-class vocabulary than mine.
// Map mine -> v9 so we can look up real corpus verdicts. Missing v9 entries
// fall through to hand-written VERDICT_PATTERNS.

const FC_TO_V9 = {
  STEAK_LEAN: 'STEAK_LEAN',  STEAK_BOLD: 'STEAK_BOLD',
  HEARTY_STARTER: 'HEARTY_STARTER',  LIGHT_STARTER: 'DELICATE_SEAFOOD',
  HEARTY_SOUP: 'SOUP_HEARTY',  LIGHT_SOUP: 'SOUP_HEARTY',
  CREAMY_SIDE: 'SIDE_RICH',  LIGHT_SIDE: 'SIDE_LIGHT',  RICH_SIDE: 'SIDE_RICH',
  SALAD: 'SALAD',
  CHICKEN_MAIN: 'CHICKEN',
  FISH_MAIN_RICH: 'FISH_MAIN',  FISH_MAIN_DELICATE: 'DELICATE_SEAFOOD',
  VEG_MAIN: 'SIDE_LIGHT',
  DESSERT_CHOCOLATE: 'DESSERT',  DESSERT_LIGHT: 'DESSERT',
};

const DC_TO_V9 = {
  BOURBON_BOLD: 'BOURBON_BOLD',
  TEQUILA_BOLD: 'TEQUILA_BOLD',
  GIN: 'GIN',  VODKA: 'VODKA',
  COGNAC: 'COGNAC',  COGNAC_LUXURY: 'COGNAC_LUXURY',
  LIGHT_SPIRIT: 'LIGHT_SPIRIT',  HEAVY_SPIRIT: 'HEAVY_SPIRIT',
  // Wines and other classes have no specific v9 verdict bucket -- fall through to DEFAULT
};

let _editorialPhrases = null;
function _loadEditorialPhrases() {
  if (_editorialPhrases !== null) return _editorialPhrases;
  try {
    _editorialPhrases = require(path.join(REPO_ROOT, 'editorial-phrases.js')).EDITORIAL_PHRASES;
  } catch (e) {
    _editorialPhrases = {};
  }
  // Merge mined gold corpus (keyed as 'dc|fc' using engine's class names directly)
  try {
    const gold = require('./gold_corpus_mined').GOLD_CORPUS_MINED || {};
    if (!_editorialPhrases.verdict) _editorialPhrases.verdict = {};
    if (!_editorialPhrases.verdict.gold) _editorialPhrases.verdict.gold = {};
    for (const ck of Object.keys(gold)) {
      const [dc, fc] = ck.split('|');
      if (!_editorialPhrases.verdict.gold[dc]) _editorialPhrases.verdict.gold[dc] = {};
      _editorialPhrases.verdict.gold[dc][fc] = gold[ck];
    }
  } catch (e) { /* gold corpus optional */ }
  // Merge mined corpus for excellent/strong/works (4,770+ entries, 371 buckets)
  try {
    const all = require('./corpus_mined_all_tiers').CORPUS_MINED || {};
    if (!_editorialPhrases.verdict) _editorialPhrases.verdict = {};
    for (const tier of Object.keys(all)) {
      if (!_editorialPhrases.verdict[tier]) _editorialPhrases.verdict[tier] = {};
      for (const ck of Object.keys(all[tier])) {
        const [dc, fc] = ck.split('|');
        if (!_editorialPhrases.verdict[tier][dc]) _editorialPhrases.verdict[tier][dc] = {};
        const existing = _editorialPhrases.verdict[tier][dc][fc] || [];
        const seen = new Set(existing.map(e => e.template));
        for (const e of all[tier][ck]) {
          if (!seen.has(e.template)) { existing.push(e); seen.add(e.template); }
        }
        _editorialPhrases.verdict[tier][dc][fc] = existing;
      }
    }
  } catch (e) { /* corpus optional */ }
  // Merge hand-written gold supplements (sparse-bucket fallbacks)
  try {
    const supp = require('./gold_corpus_supplement').GOLD_CORPUS_SUPPLEMENT || {};
    if (!_editorialPhrases.verdict) _editorialPhrases.verdict = {};
    if (!_editorialPhrases.verdict.gold) _editorialPhrases.verdict.gold = {};
    for (const ck of Object.keys(supp)) {
      const [dc, fc] = ck.split('|');
      if (!_editorialPhrases.verdict.gold[dc]) _editorialPhrases.verdict.gold[dc] = {};
      const existing = _editorialPhrases.verdict.gold[dc][fc] || [];
      const seen = new Set(existing.map(e => e.template));
      for (const e of supp[ck]) {
        if (!seen.has(e.template)) { existing.push(e); seen.add(e.template); }
      }
      _editorialPhrases.verdict.gold[dc][fc] = existing;
    }
  } catch (e) { /* supplement optional */ }
  return _editorialPhrases;
}
const REPO_ROOT_PATH = path.resolve(__dirname, '..');
// Resolve REPO_ROOT lazily; use the module's path constant
const REPO_ROOT = REPO_ROOT_PATH;

function _editorialVerdict(tier, drink, food, profile) {
  const phrases = _loadEditorialPhrases();
  if (!phrases || !phrases.verdict) return null;
  const tierBucket = phrases.verdict[tier];
  if (!tierBucket) return null;

  const dc = taxonomy.drinkClassFor(drink);
  const fc = taxonomy.foodClassFor(food);
  const v9dc = DC_TO_V9[dc] || 'DEFAULT';
  const v9fc = FC_TO_V9[fc];
  if (!v9fc) return null;

  // Always merge: specific (dc × fc) + (v9dc × v9fc) + DEFAULT × v9fc + cross-food (tier × dc × *)
  // The 12-gate filter stack below rejects mismatches. More candidates = higher corpus hit rate.
  let entries = [];
  const _seenT = new Set();
  function _add(arr) {
    if (!Array.isArray(arr)) return;
    for (const e of arr) { if (!_seenT.has(e.template)) { entries.push(e); _seenT.add(e.template); } }
  }
  _add((tierBucket[dc] || {})[fc]);
  _add((tierBucket[v9dc] || {})[v9fc]);
  _add((tierBucket.DEFAULT || {})[v9fc]);
  // Cross-food: any (tier × dc × *) entries — food-noun filter rejects mismatches
  const _dcBucket = tierBucket[dc] || {};
  for (const fk of Object.keys(_dcBucket)) { if (fk !== fc) _add(_dcBucket[fk]); }
  if (v9dc !== dc) {
    const _v9dcBucket = tierBucket[v9dc] || {};
    for (const fk of Object.keys(_v9dcBucket)) { if (fk !== v9fc) _add(_v9dcBucket[fk]); }
  }
  if (!entries.length) return null;

  // Reject standalone tier-word templates (e.g. "Strong.", "Excellent.") — they
  // produce notes ending with a bare verdict word and no closer phrase.
  entries = entries.filter(e => !/^\s*(Gold standard|Excellent|Strong|Works|Avoid)\.?\s*$/i.test(e.template));
  if (!entries.length) return null;

  // Filter out templates that contain {DRINK} or {FOOD} slots we can't fill
  // cleanly when the corpus phrase is bottle-specific to a different bottle.
  const slotless = entries.filter(e => !/\{DRINK\}|\{FOOD\}/.test(e.template));
  let pool = slotless.length ? slotless : entries;

  // Reject templates that mention specific food/drink-side nouns that aren't
  // in the current pair (prevents "marrow-adjacent richness" from leaking
  // onto a Filet x Macallan pair when the corpus phrase came from a Macallan
  // x Bone Marrow note).
  const foodCharText = (fxfGen.FOOD_CHARACTER[food.name] || '').toLowerCase();
  const foodNameLower = food.name.toLowerCase();
  const foodProfile = (food.profile || []).join(' ').toLowerCase();
  const allowedFoodContext = foodCharText + ' ' + foodNameLower + ' ' + foodProfile;
  const FOOD_NOUN_RX = /\b(marrow|crab|cream|potato|shellfish|brulee|cake|fries|fish|chicken|halibut|tuna|trout|salmon|seabass|burrata|escargot|tartare|asparagus|broccoli|spinach|carrot|brownie|cheesecake|beignets|wedge|caesar|gumbo|chowder|bisque|ribeye|filet|steak|tomahawk|cowboy|porterhouse|kc|kansas city|strip|tenderloin|pork|belly|sprouts|mushroom|shrimp|cocoa|chocolate|custard|raisin|umami|broth|cheddar|gruyere|honey-glazed|sugar|scallops|scallop|swordfish|squash|au gratin|gratin|broccolini|peanut|mac|mocha|bacon|bleu|lardon|lardons|anchovy|romaine|iceberg)\b/gi;
  pool = pool.filter(e => {
    const t = e.template.toLowerCase();
    let m;
    FOOD_NOUN_RX.lastIndex = 0;
    while ((m = FOOD_NOUN_RX.exec(t)) !== null) {
      if (!allowedFoodContext.includes(m[0])) return false;
    }
    return true;
  });

  // Class-keyword filter: reject corpus phrases mentioning a drink-class
  // keyword that doesn't match the current drink's class. Prevents
  // "the textbook light-rum answer" appearing for tequila, "Friulian amaro"
  // appearing for vodka, etc.
  const DRINK_CLASS_KEYWORDS = {
    BOURBON_BOLD:    ['bourbon','scotch','whiskey','whisky','rye','speyside','islay','highland','jameson','macallan','glenfiddich','glenlivet','glenmorangie','aberlour','balvenie','laphroaig','lagavulin','bowmore','crown royal','jack daniel','yamazaki','hibiki','redbreast','fiddich'],
    BIG_RED:         ['cab','cabernet','bordeaux','barolo','beaucastel','rhone','rhône','châteauneuf','chateauneuf','brunello'],
    ELEGANT_RED:     ['pinot','chianti','sangiovese'],
    WHITE_WINE:      ['chardonnay','sauv blanc','sauvignon blanc','sancerre','chablis','riesling','pinot blanc','pinot grigio'],
    SPARKLING:       ['champagne','prosecco','cava','moscato','sparkling'],
    TEQUILA_BOLD:    ['tequila','añejo','anejo','agave','reposado'],
    MEZCAL:          ['mezcal'],
    LIGHT_SPIRIT:    ['rum','blanco','silver','plata','light-rum','light rum'],
    VODKA:           ['vodka'],
    GIN:             ['gin','juniper'],
    COGNAC:          ['cognac'],
    COGNAC_LUXURY:   ['cognac'],
    APERITIVO_BITTER:['amaro','amari','aperitivo','vermouth','fernet','aperol','campari','friulian','grappa'],
    SWEET_LIQUEUR:   ['liqueur','amaretto','disaronno','frangelico','kahlua','baileys','grand marnier','chambord','limoncello','sambuca','drambuie','licor 43'],
    SWEET_WINE:      ['port','sauternes','tawny','vin santo','tokaji'],
    COCKTAIL_BOLD:   ['old fashioned','manhattan','sazerac','vieux carré','negroni'],
    COCKTAIL_LIGHT:  ['gimlet','french 75','margarita'],
    HEAVY_SPIRIT:    [],
  };
  // Compatible classes — share keyword spaces (BIG_RED ↔ ELEGANT_RED both use
  // varietal terms like Cab/Pinot/Bordeaux that overlap in real wine speak).
  // Subclass filter (below) handles intra-bucket varietal precision.
  const COMPATIBLE_CLASSES = {
    BIG_RED:     ['ELEGANT_RED'],
    ELEGANT_RED: ['BIG_RED'],
  };
  const myClassKeywords = new Set(DRINK_CLASS_KEYWORDS[dc] || []);
  for (const compat of COMPATIBLE_CLASSES[dc] || []) {
    for (const kw of (DRINK_CLASS_KEYWORDS[compat] || [])) myClassKeywords.add(kw);
  }
  const foreignKeywords = [];
  for (const klass of Object.keys(DRINK_CLASS_KEYWORDS)) {
    if (klass === dc) continue;
    if ((COMPATIBLE_CLASSES[dc] || []).includes(klass)) continue;
    for (const kw of DRINK_CLASS_KEYWORDS[klass]) {
      if (!myClassKeywords.has(kw)) foreignKeywords.push(kw);
    }
  }
  pool = pool.filter(e => {
    const lower = e.template.toLowerCase();
    for (const kw of foreignKeywords) {
      const escKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp('\\b' + escKw + '\\b', 'i').test(lower)) return false;
    }
    return true;
  });

  // Sub-class filter for ELEGANT_RED (Pinot vs Cab vs Nebbiolo vs Spanish, etc.)
  if (dc === 'ELEGANT_RED' || dc === 'BIG_RED') {
    const sub = elegantRedVoiceSubclass(drink);
    const ELEGANT_SUBCLASS_FOREIGN = {
      PINOT:     ['cab','cabernet','bordeaux','barolo','barbaresco','nebbiolo','malbec','zinfandel','chianti','sangiovese','rhone','rh\u00f4ne','tempranillo','rioja','menc\u00eda','mencia','beaucastel','ch\u00e2teauneuf','chateauneuf','brunello','gigondas','bandol','grenache','syrah','mourv'],
      CAB:       ['pinot','willamette','barolo','barbaresco','nebbiolo','malbec','zinfandel','chianti','sangiovese','rhone','rh\u00f4ne','tempranillo','rioja','menc\u00eda','mencia','beaucastel','ch\u00e2teauneuf','chateauneuf','brunello','gigondas','bandol'],
      NEBBIOLO:  ['cab','cabernet','bordeaux','pinot','malbec','zinfandel','chianti','sangiovese','rhone','rh\u00f4ne','tempranillo','rioja','menc\u00eda','mencia','beaucastel','ch\u00e2teauneuf','chateauneuf','brunello','gigondas','bandol'],
      CHIANTI:   ['cab','cabernet','bordeaux','pinot','malbec','zinfandel','barolo','barbaresco','nebbiolo','rhone','rh\u00f4ne','tempranillo','rioja','menc\u00eda','mencia','beaucastel','ch\u00e2teauneuf','chateauneuf','gigondas','bandol'],
      RHONE:     ['cab','cabernet','bordeaux','pinot','malbec','zinfandel','barolo','barbaresco','nebbiolo','chianti','sangiovese','tempranillo','rioja','menc\u00eda','mencia','brunello'],
      SPANISH:   ['cab','cabernet','bordeaux','pinot','malbec','zinfandel','barolo','barbaresco','nebbiolo','chianti','sangiovese','rhone','rh\u00f4ne','beaucastel','ch\u00e2teauneuf','chateauneuf','brunello','gigondas','bandol'],
      MALBEC:    ['cab','cabernet','bordeaux','pinot','zinfandel','barolo','barbaresco','nebbiolo','chianti','sangiovese','rhone','rh\u00f4ne','tempranillo','rioja','menc\u00eda','mencia','beaucastel','brunello'],
      ZIN:       ['cab','cabernet','bordeaux','pinot','malbec','barolo','barbaresco','nebbiolo','chianti','sangiovese','rhone','rh\u00f4ne','tempranillo','rioja','menc\u00eda','mencia','beaucastel','ch\u00e2teauneuf','chateauneuf','brunello'],
      CAB_FRANC: ['cab','cabernet','bordeaux','pinot','malbec','zinfandel','barolo','barbaresco','nebbiolo','chianti','sangiovese','rhone','rh\u00f4ne','tempranillo','rioja','menc\u00eda','mencia'],
      BORDEAUX:  ['pinot','malbec','zinfandel','barolo','barbaresco','nebbiolo','chianti','sangiovese','rhone','rh\u00f4ne','tempranillo','rioja','menc\u00eda','mencia','beaucastel','brunello','gigondas','bandol'],
      GENERIC_ELEGANT_RED: [],
    };
    const subForeign = ELEGANT_SUBCLASS_FOREIGN[sub] || [];
    pool = pool.filter(e => {
      const lower = e.template.toLowerCase();
      for (const kw of subForeign) {
        if (new RegExp('\\b' + kw + '\\b', 'i').test(lower)) return false;
      }
      return true;
    });
  }

  // Sub-class filter for whiskey-family (BOURBON_BOLD splits into BOURBON / SCOTCH / IRISH / etc.)
  if (dc === 'BOURBON_BOLD') {
    const sub = whiskeyVoiceSubclass(drink);
    const SUBCLASS_FOREIGN = {
      BOURBON:  ['scotch','speyside','islay','highland','macallan','glenfiddich','glenlivet','glenmorangie','aberlour','balvenie','laphroaig','lagavulin','bowmore','fiddich','irish','jameson','redbreast','japanese','yamazaki','hibiki','canadian'],
      SCOTCH:   ['bourbon','rye','irish','jameson','redbreast','japanese','yamazaki','hibiki','canadian'],
      IRISH:    ['bourbon','rye','scotch','speyside','islay','highland','japanese','canadian'],
      JAPANESE: ['bourbon','rye','scotch','speyside','islay','highland','irish','canadian'],
      CANADIAN: ['bourbon','rye','scotch','speyside','islay','highland','irish','japanese'],
      RYE:      ['scotch','speyside','islay','highland','irish','japanese','canadian'],
    };
    const subForeign = SUBCLASS_FOREIGN[sub] || [];
    pool = pool.filter(e => {
      const lower = e.template.toLowerCase();
      for (const kw of subForeign) {
        if (new RegExp('\\b' + kw + '\\b', 'i').test(lower)) return false;
      }
      return true;
    });
  }

  // Tequila bottles in LIGHT_SPIRIT shouldn't accept rum-specific phrases
  if (dc === 'LIGHT_SPIRIT') {
    const isTequila = /tequila|blanco|silver|plata|patron|don julio|clase azul|don fulano|adictivo|corazon|el mayor|komos|milagro|ocho|rey sol|siete leguas|tears of llorona|trombo|el cabo|gran patron|lalo|mijenta|avion|codigo|camarena|g4 /i.test(drink.name);
    if (isTequila) {
      pool = pool.filter(e => !/\b(rum|light-rum)\b/i.test(e.template));
    }
    const isRum = /\brum\b/i.test(drink.name);
    if (isRum) {
      pool = pool.filter(e => !/\b(tequila|añejo|anejo|reposado|agave)\b/i.test(e.template));
    }
  }

  // Bottle-name catalog filter: reject phrases mentioning a different bottle
  // by a name fragment that's not the current drink. Expanded with every
  // distillery / brand name observable in the corpus.
  const otherBottlePatterns = [
    // Scotch distilleries
    'fiddich','glenfiddich','macallan','oban','lagavulin','laphroaig',
    'bowmore','glenmorangie','glenlivet','aberlour','cragganmore','dalmore',
    'bruichladdich','glenglassaugh','loch lomond','monkey shoulder',
    'johnnie walker','dewar','chivas','balvenie',
    // Irish distilleries
    'jameson','redbreast','tullamore','bushmills','garavogue','dunville',
    'midleton','echlinville','teeling','kilbeggan','powers',
    // Japanese
    'yamazaki','hibiki','hakushu','suntory','nikka','toki',
    // American/bourbon
    'pappy','stagg','blanton',"booker",'eagle rare','weller','maker','knob creek',
    'jack daniel','gentleman jack','george dickel','old grand-dad','old fitzgerald',
    'bulleit','elijah craig','heaven hill','henry mckenna','jim beam','larceny',
    '1792','1881','michter','woodford','wild turkey','angel\u0027s envy','basil hayden',
    'four roses','jefferson','blade & bow','clermont','i.w. harper','little book',
    'whistlepig','mister sam','sazerac','pikesville','mammoth','old emmer',
    'never say die','bardstown','bowman','old elk','fox & oden','fox and oden','caribou crossing','caribou','foursquare',
    // Wines
    'caymus','opus one','silver oak','jordan','far niente','heitz','shafer','hillside select','lyndenhurst','martha\'s vineyard','jubilation','colgin','meritage',
    'cristom','lingua franca','domaine serene','elk cove','raen','spottswoode',
    'château beaucastel','beaucastel','peju','quilt','nickel & nickel',
    'venge','prisoner','muga','marimar','château','barolo','scavino',
    'pio cesare','le pupille','barbaresco','brunello',
    // Aperitivo / liqueur
    'fernet','aperol','campari','amaro nonino','green chartreuse','yellow chartreuse',
    'mata hari','sambuca','frangelico','disaronno','grand marnier','chambord',
    'baileys','kahlua','licor 43','drambuie','limoncello','averna','lucano','montenegro',
    'contratto','ancho reyes','fireball',
    // Gin
    'inverroche','mahón','mahon','long road','tanqueray','bombay','beefeater',
    'plymouth','hendricks','aviation','botanist','roku','monkey 47','elephant',
    'gray whale','iron fish','bluecoat','knickerbocker','nolets','liberator',
    'eastern kille','detroit city','empress','2 james','scapegrace','mahon',
    'sansho',
    // Vodka
    'belvedere','grey goose','ketel','stoli','tito','reyka','wheatley','chopin',
    'hangar','hdw','hangar 1','smirnoff',
    // Rum
    'bacardi','ron zacapa','captain morgan','myers','mount gay','malibu',
    'doctor bird','jung and wulff',
    // Tequila
    'don julio','patron','clase azul','don fulano','adictivo','corazon',
    'el mayor','komos','milagro','ocho','rey sol','siete leguas','tears of llorona',
    'trombo','el cabo','gran patron','lalo','mijenta','avion','codigo','camarena','g4',
    // Cognac/brandy
    'hennessy','courvoisier','remy','louis xiii','pierre ferrand','christian bros',
    'villon',
    // Champagne / wine
    'laurent perrier','veuve','pommery','pierre gimonnet','paul bara','il colle',
    'raventós','daniel chotard','schloss vollrads',
    // Region/style descriptors that act as bottle-specific touches
    'cape-floral','gr-pride','michigan-pride','hometown','grand rapids',
  ];
  const myNameLower = drink.name.toLowerCase();
  // Reject compound-word substitution templates where {DRINK}- becomes "{Bottle}-X"
  pool = pool.filter(e => !/\{DRINK\}-/.test(e.template));
  if (!pool.length) return null;

  pool = pool.filter(e => {
    const lower = e.template.toLowerCase();
    for (const pat of otherBottlePatterns) {
      if (myNameLower.indexOf(pat) !== -1) continue;
      const escPat = pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp('\\b' + escPat + '\\b', 'i').test(lower)) return false;
    }
    return true;
  });
  if (!pool.length) return null;

  // Reject phrases mentioning an age-statement variant of the current brand.
  // E.g. "Bruichladdich 21" in a plain Bruichladdich note, or "Glenfiddich 14"
  // in a Glenfiddich 12 note. The corpus stores templates like
  //     "{DRINK} 21 rides {FOOD} at collector register"
  // where the age statement is baked into the template before {DRINK}
  // substitutes. We catch this in two passes:
  //   1. Reject templates with "{DRINK} <number>" — the post-substitution
  //      will be "{Bottle} <number>", which only fits if the current bottle
  //      already has that age in its name.
  //   2. Reject post-substitution age variants of the brand stem.
  pool = pool.filter(e => {
    const m = e.template.match(/\{DRINK\}\s+(\d+\w*)/);
    if (!m) return true;
    const ageStr = m[1].toLowerCase();
    return myNameLower.includes(ageStr);
  });
  if (!pool.length) return null;
  const brandStem = drink.name.split(/\s+/)[0].toLowerCase();
  if (brandStem && brandStem.length > 3) {
    const escStem = brandStem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const ageVariantRx = new RegExp('\\b' + escStem + '\\s+\\d+\\w*', 'gi');
    pool = pool.filter(e => {
      const matches = e.template.match(ageVariantRx) || [];
      for (const m of matches) {
        if (!myNameLower.includes(m.toLowerCase())) return false;
      }
      return true;
    });
    if (!pool.length) return null;
  }

  // Flavor-word validation: every flavor noun mentioned in the corpus phrase
  // must appear in the drink's character/tasting-notes/name OR the food's
  // character/profile/name OR the chemistry-claim keys. Catches "mint
  // threads through spice" appearing on a Pablo Sour x Mocha Creme pair
  // where neither has mint or spice.
  const FLAVOR_NOUNS = ['mint','basil','lavender','rosemary','sage','thyme',
    'caramel','vanilla','oak','spice','honey','smoke','peat','fruit','cherry',
    'cassis','tannin','cocoa','mocha','chocolate','coffee','citrus','orange',
    'lemon','grapefruit','mineral','flint','earth','herb','botanical','floral',
    'toffee','almond','hazelnut','sherry','rye','malt','juniper','anise',
    'apple','pear','peach','cherry','plum','currant','raisin','nut','sesame'];
  // Build allowed-flavor context from drink + food
  const drinkProfile = profile.character + ' ' + (profile.tastingNotes || []).join(' ') + ' ' + drink.name + ' ' + (profile.verdictHook || '');
  const foodCtx = (fxfGen.FOOD_CHARACTER[food.name] || '') + ' ' + food.name + ' ' + (food.profile || []).join(' ');
  const allowedFlavorContext = (drinkProfile + ' ' + foodCtx).toLowerCase();
  pool = pool.filter(e => {
    const lower = e.template.toLowerCase();
    for (const fn of FLAVOR_NOUNS) {
      const escFn = fn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp('\\b' + escFn + '\\b', 'i').test(lower)) {
        if (!allowedFlavorContext.includes(fn)) return false;
      }
    }
    return true;
  });
  if (!pool.length) return null;

  // Deterministic pick by pair signature
  const sig = drink.name + '|' + food.name + '|' + tier;
  const h = crypto.createHash('md5').update(sig).digest();
  const pick = pool[h.readUInt32BE(0) % pool.length];

  // Fill slots if present
  let filled = pick.template
    .replace(/\{DRINK\}/g, drink.name)
    .replace(/\{FOOD\}/g, foodShortName(food));
  // Capitalize lowercase verdict-tier word at start (corpus formatting artifact)
  filled = filled.replace(/^(excellent|strong|works|gold|avoid)\b/, (m) => m.charAt(0).toUpperCase() + m.slice(1));
  return filled;
}

// Price-tier-aware extras for VERDICT_PATTERNS.
// PREMIUM bottles unlock collector/luxury closers ("the staff fights over").
// BTG bottles unlock everyday/workhorse closers ("the table's first pour").
// MID bottles use only the base pool.
const VERDICT_PATTERNS_PREMIUM = {
  gold: [
    "Gold standard; {drink} on {food} -- the call you save for the regulars.",
    "Gold standard; {drink} on {food} -- the bottle the staff talks about.",
    "Gold standard; for {food}, this is the special-occasion call.",
    "Gold standard; {drink} into {food} -- the once-a-month-pour move.",
  ],
  excellent: [
    "Excellent; {drink} on {food} -- the upsell move when the table looks ready.",
    "Excellent; {hook} on {food} -- step up from the everyday call.",
  ],
  strong: [],
  works: [],
};
const VERDICT_PATTERNS_BTG = {
  gold: [],
  excellent: [
    "Excellent; the workhorse {hook} for {food}.",
    "Excellent; {drink} on {food} -- the table's first pour.",
  ],
  strong: [
    "Strong; reliable BTG {hook} for {food}.",
    "Strong; {drink} on {food} -- the everyday call.",
    "Strong; pour {drink} on {food} when the table just wants something solid.",
  ],
  works: [
    "Works; {drink} for {food} -- the value-pour fit.",
    "Works; everyday {hook} doesn't fight {food}.",
  ],
};

function pickVerdict(tier, drink, food, profile) {
  // Try EDITORIAL_PHRASES first (real v9 corpus phrases)
  const editorial = _editorialVerdict(tier, drink, food, profile);
  if (editorial) return editorial;

  // Fallback: hand-written templates, mixed with price-tier-eligible extras
  const baseVariants = VERDICT_PATTERNS[tier] || [];
  let priceTier = 'MID';
  try { priceTier = require('./price_tiers').priceTierFor(drink); } catch (e) { /* optional */ }
  let extras = [];
  if (priceTier === 'PREMIUM') extras = VERDICT_PATTERNS_PREMIUM[tier] || [];
  else if (priceTier === 'BTG') extras = VERDICT_PATTERNS_BTG[tier] || [];
  const variants = baseVariants.concat(extras);
  if (!variants.length) return null;

  const sig = drink.name + '|' + food.name + '|' + tier;
  const h = crypto.createHash('md5').update(sig).digest();
  const pat = variants[h.readUInt32BE(0) % variants.length];
  return pat
    .replace(/\{hook\}/g, profile.verdictHook || 'pour')
    .replace(/\{drink\}/g, drink.name)
    .replace(/\{food\}/g, foodShortName(food));
}

// ── MAIN ENTRY ───────────────────────────
function _enrich(entity, ctx) {
  if (!ctx || !ctx.ENRICHED_PROFILES) return entity;
  const ep = ctx.ENRICHED_PROFILES[entity.name];
  if (!ep || !ep.axes) return entity;
  return Object.assign({}, entity, { axes: ep.axes });
}

function generate(drink, food, tier, ctx) {
  if (!drink || !food) throw new Error('generate: drink and food required');
  if (taxonomy.FOOD_CATS.has(drink.category)) throw new Error('drink must not be a food');
  if (!taxonomy.FOOD_CATS.has(food.category)) throw new Error('food must be a food');

  drink = _enrich(drink, ctx);
  food  = _enrich(food, ctx);
  const _tcKey = drink.name + "|" + food.name;
  if (TIER_CORRECTIONS[_tcKey]) tier = TIER_CORRECTIONS[_tcKey];

  const profile = profileFor(drink);

  if (tier === 'avoid') {
    const fc = taxonomy.foodClassFor(food);
    const dc = taxonomy.drinkClassFor(drink);
    const altsFood = fxfGen.alternativesFor(food, ctx.PAIRING_MAP, 3, { kind: 'drink' });
    const altsList = altsFood.length
      ? (altsFood.length === 1 ? altsFood[0] : altsFood.length === 2 ? altsFood[0] + ' or ' + altsFood[1] : altsFood.slice(0,-1).join(', ') + ', or ' + altsFood[altsFood.length-1])
      : 'a wine that fits the plate';
    let dcLabel = ({BIG_RED:'big red',ELEGANT_RED:'elegant red',BOURBON_BOLD:'bourbon',TEQUILA_BOLD:'añejo tequila',MEZCAL:'mezcal',COGNAC:'cognac',COGNAC_LUXURY:'icon cognac',SPARKLING:'sparkling',WHITE_WINE:'white wine',GIN:'gin',VODKA:'vodka',LIGHT_SPIRIT:'light spirit',HEAVY_SPIRIT:'heavy spirit',COCKTAIL_BOLD:'spirit-forward cocktail',COCKTAIL_LIGHT:'light cocktail',SWEET_LIQUEUR:'digestif',APERITIVO_BITTER:'bitter aperitivo',SWEET_WINE:'dessert wine'})[dc] || 'pour';
    if (dc === 'BOURBON_BOLD' && profile.avoidLabel) dcLabel = profile.avoidLabel;
    const article = /^[aeiouAEIOU]/.test(dcLabel) ? 'an' : 'a';
    const avoidChar = stripLeadingPossessive(drink.name, profile.character || '');
    // Determine "save for" target — avoid contradiction when food IS a steak
    const isFoodSteak = fc === 'STEAK_LEAN' || fc === 'STEAK_BOLD';
    const saveFor = isFoodSteak ? 'another course' : 'the steak course';
    // Deterministic pick: 5 closer × 3 save-phrase variants
    const closers = [
      'Avoid; reach for any of those instead.',
      'Avoid; the alts above are the call.',
      'Avoid; pick from the alternatives.',
      'Avoid; one of those is the move.',
      'Avoid; steer the table to the alternatives.',
      'Avoid; route the table to a better-fit pour.',
      'Avoid; redirect the order — the alternatives carry it.',
      'Avoid; lead with the alternatives instead.',
      'Avoid; the better calls are above.',
      'Avoid; the listed alts pair where this does not.',
      'Avoid; recommend one of the alternatives.',
      'Avoid; offer the alts at the table — they fit.',
    ];
    // Drink names starting with "The" already include the article — don't double it.
    const _hasThe = /^The\s/.test(drink.name);
    const _verbed = (verb) => _hasThe ? verb + ' ' + drink.name : verb + ' the ' + drink.name;
    const savePhrases = [
      _verbed('Save') + ' for ' + saveFor + '.',
      drink.name + ' belongs on ' + saveFor + '.',
      _verbed('Hold') + ' for ' + saveFor + '.',
      _verbed('Pour') + ' on ' + saveFor + ' instead.',
      _verbed('Reserve') + ' for ' + saveFor + '.',
      drink.name + ' lands on ' + saveFor + ' — not here.',
    ];
    const sig = drink.name + '|' + food.name + '|avoid';
    const h = crypto.createHash('md5').update(sig).digest();
    const closer = closers[h.readUInt32BE(0) % closers.length];
    const saveClause = savePhrases[h.readUInt32BE(4) % savePhrases.length];
    return drinkPossessive(drink.name) + ' ' + avoidChar + ' overpowers ' + foodPossessive(food) + ' ' + foodCharacter(food) + ' -- the plate deserves ' + altsList + ', not ' + article + ' ' + dcLabel + '. ' + closer + ' ' + saveClause;
  }

  const action = pickAction(tier, drink, food);
  const body = buildBody(drink, food, tier, ctx);
  let verdict = pickVerdict(tier, drink, food, profile);
  const _fc = taxonomy.foodClassFor(food);
  const _dc = taxonomy.drinkClassFor(drink);
  if (_fc && _dc && COMPETITOR_REFS[_fc] && COMPETITOR_REFS[_fc][_dc]) {
    const ref = COMPETITOR_REFS[_fc][_dc];
    if (ref.bottle && ref.bottle !== drink.name && tier !== "avoid") {
      verdict = verdict.replace(/\.\s*$/, "") + "; " + ref.bottle + " still cuts it harder.";
    }
  }

  let setup;
  if (profile.tastingNotes && tier !== 'works') {
    setup = drink.name + ' -- ' + profile.tastingNotes.join(', ') + '. ' + body.charAt(0).toUpperCase() + body.slice(1) + '. ' + verdict;
  } else {
    const charText = stripLeadingPossessive(drink.name, profile.character || '');
    setup = drinkPossessive(drink.name) + ' ' + charText + ' ' + action + ' ' + foodPossessive(food) + ' ' + foodCharacter(food) + ': ' + body + '. ' + verdict;
  }
  const prefix = (tier === 'gold') ? '* ' : '';
  return prefix + setup;
}

function pickAction(tier, drink, food) {
  const opts = ({
    gold:      ['runs straight into', 'meets head-on'],
    excellent: ['carries cleanly into', 'meets at register with', 'lifts'],
    strong:    ['meets at register with', 'sits alongside', 'leans against'],
    works:     ['finds neutral with', 'reads alongside', 'sits alongside', 'leans against'],
  })[tier] || ['sits alongside'];
  const sig = drink.name + '|' + food.name + '|' + tier;
  const h = crypto.createHash('md5').update(sig).digest();
  return opts[h.readUInt8(0) % opts.length];
}

module.exports = {
  generate, profileFor, buildBody, pickVerdict, pickAction,
  drinkFlavorsFor, findChemistryClause, clauseFitsDrinkClass,
  whiskeyVoiceSubclass, elegantRedVoiceSubclass,
  BOTTLE_PROFILE, DRINK_CLASS_DEFAULT, VERDICT_PATTERNS, WHISKEY_VOICE_DEFAULTS, ELEGANT_RED_VOICE_DEFAULTS,
};
VOICE_DEFAULTS,
};
