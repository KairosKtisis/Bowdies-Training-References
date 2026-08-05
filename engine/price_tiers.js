// engine/price_tiers.js
//
// Bottle price-tier classification.
//
// Three tiers:
//   PREMIUM — allocated, luxury, age 18+, collector bottles. The "save for
//             special occasion" / "the staff fights over" register.
//   MID     — standard restaurant pours. The default class.
//   BTG     — by-the-glass / value workhorses. The "everyday call" register.
//
// Used by drink_x_food_generator's pickVerdict to gate verdict templates by
// register so we don't say "the once-in-a-lifetime call" about Buffalo Trace
// or "everyday workhorse" about Pappy.
//
// Resolution order:
//   1. PRICE_TIER_OVERRIDES (manual curation) — wins
//   2. Profile-array signal scan
//   3. Name-pattern scan (age statements, premium brand names)
//   4. Default to MID
'use strict';

// Manual overrides — bottles where the heuristics get it wrong, or where we
// just want explicit control.
const PRICE_TIER_OVERRIDES = {
  // Wine list update 2026-08-05
  "Ceretto Moscato d'Asti": "BTG",
  "Calçada Reserva Vinho Verde": "BTG",
  "Lubanzi Chenin Blanc": "BTG",
  "Maison du Chancelier Les Mosnières": "BTG",
  "Painted Fields Curse of Knowledge": "BTG",
  "Soul of Mendocino": "BTG",
  "Tenuta dei Sette Cieli Yantra": "BTG",
  "Tenuta Tascante Ghiaia Nera": "BTG",
  "Domaine des Ardoisières Silice": "BTG",
  "Michel Goubard Mont Avril": "MID",
  "Sanford Pinot Noir": "MID",
  // PREMIUM — allocated / icon / luxury
  'Pappy Van Winkle 13 Year Rye': 'PREMIUM',
  'Pappy Van Winkle 15 Year': 'PREMIUM',
  'Pappy Van Winkle 20 Year': 'PREMIUM',
  'Pappy Van Winkle 23 Year': 'PREMIUM',
  'Weller Millennium': 'PREMIUM',
  "Maker's Mark Cellar Aged": 'PREMIUM',
  'George T. Stagg': 'PREMIUM',
  'Stagg Jr.': 'PREMIUM',
  "Booker's": 'PREMIUM',
  'Knob Creek 15 Year': 'PREMIUM',
  'Eagle Rare 17 Year': 'PREMIUM',
  'Blanton\'s': 'PREMIUM',
  'Blanton\'s Gold': 'PREMIUM',
  'Macallan 18': 'PREMIUM',
  'Macallan 25': 'PREMIUM',
  'Glenfiddich 18': 'PREMIUM',
  'Glenfiddich Gran Cru 23': 'PREMIUM',
  'Glenmorangie 18': 'PREMIUM',
  'Glenmorangie 25': 'PREMIUM',
  'Yamazaki 18 Year': 'PREMIUM',
  'Hibiki 21': 'PREMIUM',
  'Hibiki 30': 'PREMIUM',
  'Louis XIII Cognac': 'PREMIUM',
  'Hennessy Paradis': 'PREMIUM',
  'Avion 44': 'PREMIUM',
  'Clase Azul Plata': 'PREMIUM',
  'Clase Azul Reposado': 'PREMIUM',
  'Clase Azul Anejo': 'PREMIUM',
  'Clase Azul Ultra': 'PREMIUM',
  'Don Julio 1942': 'PREMIUM',
  'Don Julio 70th': 'PREMIUM',
  'Komos Extra Anejo': 'PREMIUM',
  'Tears of Llorona': 'PREMIUM',
  'Casa Dragones Blanco': 'PREMIUM',
  'Caymus Cabernet Sauvignon': 'PREMIUM',
  'Caymus Special Selection': 'PREMIUM',
  'Opus One': 'PREMIUM',
  'Silver Oak Cabernet Sauvignon': 'PREMIUM',
  'Heitz Trailside Vineyard': "PREMIUM",
  "Heitz Martha's Vineyard": 'PREMIUM',
  'Shafer Hillside Select': 'PREMIUM',
  'Spottswoode Cabernet Sauvignon': 'PREMIUM',
  'J. Davies Cabernet Sauvignon': 'PREMIUM',
  'Jubilation by Colgin': 'PREMIUM',
  'Jordan Cabernet Sauvignon': 'PREMIUM',
  'Far Niente Cabernet Sauvignon': 'PREMIUM',
  'Faust Napa Valley Cabernet': 'PREMIUM',
  'Scavino Barolo': 'PREMIUM',
  'Pio Cesare Barbaresco': 'PREMIUM',
  'Brunello di Montalcino': 'PREMIUM',
  'Château Beaucastel': 'PREMIUM',
  'Domaine Tempier Bandol': 'PREMIUM',
  'Pommery Cuvée Louise': 'PREMIUM',
  'Pierre Gimonnet Special Club Brut': 'PREMIUM',
  'Veuve Clicquot Brut': 'MID',  // workhorse Champagne, not premium-tier
  'J Davies Ferrington Vineyards': 'PREMIUM',
  'Lail Vineyards Daniel Cuvée': 'PREMIUM',
  'Venge Family Reserve': 'PREMIUM',
  'Lingua Franca Avni Pinot Noir': 'MID',
  "Graham's 2017 Vintage Port": 'PREMIUM',
  "Graham's 20 Year Tawny": 'PREMIUM',
  'Vin Santo': 'MID',

  // BTG — workhorse / value / everyday
  'Buffalo Trace': 'BTG',
  'Bulleit Bourbon': 'BTG',
  "Maker's Mark": 'BTG',
  'Wild Turkey 101': 'BTG',
  'Jim Beam White Label': 'BTG',
  'Jim Beam Black': 'BTG',
  'Old Forester': 'BTG',
  'Jack Daniels': 'BTG',
  "Jack Daniel's Bonded": 'BTG',
  'Jameson': 'BTG',
  'Tullamore D.E.W.': 'BTG',
  'Crown Royal': 'BTG',
  'Canadian Club': 'BTG',
  "Dewar's White Label": 'BTG',
  'Glenfiddich 12': 'BTG',
  'Glenlivet 12': 'BTG',
  'Glenmorangie Original 10': 'BTG',
  'Macallan 12': 'MID',
  "Tito's Vodka": 'BTG',
  "Tito's Handmade Vodka": 'BTG',
  'Wheatley Vodka': 'BTG',
  'Absolut': 'BTG',
  'Smirnoff': 'BTG',
  'Tanqueray Gin': 'BTG',
  'Bombay Sapphire': 'BTG',
  'Beefeater': 'BTG',
  "Hendrick's Gin": 'BTG',
  'Don Julio Blanco': 'BTG',
  'Patron Silver': 'BTG',
  'Casamigos Blanco': 'BTG',
  'Casamigos Reposado': 'BTG',
  'Espolon Blanco': 'BTG',
  '1800 Silver': 'BTG',
  'Hennessy VS': 'BTG',
  'Courvoisier Cognac': 'BTG',
  'Christian Bros Brandy': 'BTG',
  'Aperol': 'BTG',
  'Campari': 'BTG',
  'Fernet Branca': 'BTG',
  'Bowdie\'s Old Fashioned': 'MID',
  'The Manhattan': 'MID',
  'French 75': 'BTG',
  'Margarita': 'BTG',
  'Espresso Martini': 'MID',
  'Negroni': 'BTG',
  "Bee's Knees": 'BTG',
};

// Profile-keyword signals
const PROFILE_PREMIUM = ['allocated','luxury','icon','prestige','collector','grand cru','reserve','special selection','heritage','flagship','prestige cuvée','vintage','single barrel','single-barrel'];
const PROFILE_BTG = ['workhorse','value','by-the-glass','btg','everyday','restaurant standard','classic'];

function priceTierFor(entity) {
  if (!entity || !entity.name) return 'MID';
  if (PRICE_TIER_OVERRIDES[entity.name]) return PRICE_TIER_OVERRIDES[entity.name];

  const profile = (entity.profile || []).join(' ').toLowerCase();
  const name = (entity.name || '').toLowerCase();

  // Age-statement premium signals (18+ years for whiskey)
  if (/\b(18|19|20|21|23|25|27|30|35|40|50)[\s-]?year/i.test(name)) return 'PREMIUM';
  if (/\bxo\b|extra-old|x\.o\.|\bvieille\b|\bdécanteur\b/i.test(name)) return 'PREMIUM';

  for (const sig of PROFILE_PREMIUM) {
    if (profile.includes(sig)) return 'PREMIUM';
  }
  for (const sig of PROFILE_BTG) {
    if (profile.includes(sig)) return 'BTG';
  }

  return 'MID';
}

module.exports = { priceTierFor, PRICE_TIER_OVERRIDES };
