// engine/fxf_strong_steak_starter_editorial.js
//
// Phase 4 / Session 10 — hand-curated editorial for 26 starter × steak × strong pairs.
// Cooking-method canon: steaks are flame-grilled, never seared.

'use strict';

const FXF_STRONG_STEAK_STARTER = {
  'Filet Mignon|Prime Tartare':
    "Filet Mignon after the tartare -- raw beef into flame-grilled beef, both lean cuts, the tartare's caper-and-shallot brightness priming the palate for the 10oz tenderloin's restraint. Strong; the opener sets the table for the cut.",

  'Filet Mignon|Bone Marrow':
    "Filet Mignon after the bone marrow -- the marrow's beefy unctuous richness adds the dimension the 10oz lean cut leaves room for, the opener anchoring what the filet keeps clean. Strong; the marrow primes the palate the filet finishes.",

  'Filet Mignon|Crab Cake':
    "Filet Mignon after the crab cake -- the panko-and-lump crab opens with delicate sweetness, the 10oz tenderloin following with restrained beef butter. Strong; both courses lean refined, the cut closes the line cleanly.",

  'Filet Mignon|Seafood Tower':
    "Filet Mignon after the seafood tower -- the iced shellfish lineup cleans the palate, the 10oz lean cut following with quiet beef butter. Strong; the cold opener resets the table for the cut.",

  'Filet Mignon|Shrimp Cocktail':
    "Filet Mignon after the shrimp cocktail -- the chilled shrimp and citrus-horseradish bite refreshes the palate, the 10oz tenderloin following with clean grilled butter. Strong; the bright opener primes the lean cut.",

  'Filet Mignon|Escargot':
    "Filet Mignon after the escargot -- the herb-butter snail plate opens with garlic-and-parsley lift, the 10oz tenderloin meeting it with the same butter register, scaled down. Strong; both courses speak the same gentle language.",

  'Filet Mignon|Burrata':
    "Filet Mignon after the burrata -- fresh basil-tomato-cream opens the meal, the 10oz lean cut following with restrained beef butter that pairs to the cream's milky note. Strong; refined opener into refined cut.",

  'Bone-In Filet|Prime Tartare':
    "The bone-in filet after the tartare -- raw beef into bone-deepened flame-grilled beef, the tartare's bright caper-and-shallot edge priming the palate for the 14oz cut's marrow-touched richness. Strong; the opener carries cleanly into the cut.",

  'Bone-In Filet|Bone Marrow':
    "The bone-in filet after the bone marrow -- both courses speak the same beefy-marrow language, the unctuous opener priming the palate for the 14oz cut's bone-deepened butter. Strong; the marrow line carries through the meal.",

  'Bone-In Filet|Crab Cake':
    "The bone-in filet after the crab cake -- the panko-and-lump crab opens with delicate sweetness, the 14oz bone-enhanced cut following with marrow-touched butter that doesn't crowd the opener's memory. Strong; refined opener into bone-deepened cut.",

  'Bone-In Filet|Seafood Tower':
    "The bone-in filet after the seafood tower -- the iced shellfish cleans the palate, the 14oz cut following with bone-marrow depth the opener leaves room for. Strong; the contrast in temperature and weight reads composed.",

  'Bone-In Filet|Shrimp Cocktail':
    "The bone-in filet after the shrimp cocktail -- the chilled shrimp's citrus-horseradish snap refreshes the palate, the 14oz bone-deepened cut following with marrow-touched butter. Strong; the opener resets for the cut's richness.",

  'Bone-In Filet|Escargot':
    "The bone-in filet after the escargot -- the herb-butter snail plate opens with garlic-and-parsley lift, the 14oz bone-deepened cut meeting it with a richer butter that the herbs cut through. Strong; the snail opener primes the marrow cut.",

  'Bone-In Filet|Burrata':
    "The bone-in filet after the burrata -- fresh milky basil-tomato cream opens the meal, the 14oz cut following with bone-deepened butter that meets the cream's richness on the same plane. Strong; the dairy opener sets the table.",

  'Kansas City|Bone Marrow':
    "Kansas City after the bone marrow -- the marrow's beefy unctuous depth opens the meal, the 18oz strip's savory grain following with clean lean character that the marrow primes without overlap. Strong; both courses honor beef in different keys.",

  'Kansas City|Crab Cake':
    "Kansas City after the crab cake -- the panko-and-lump crab opens with delicate sweetness, the 18oz lean-bold strip following with savory grain that the crab's brightness preceded cleanly. Strong; refined opener primes the strip.",

  'Kansas City|Seafood Tower':
    "Kansas City after the seafood tower -- the iced shellfish opens with cold-brine refresh, the 18oz strip following with clean savory grain that the tower's cool primed without crowding. Strong; the contrast in register reads composed.",

  'Kansas City|Shrimp Cocktail':
    "Kansas City after the shrimp cocktail -- the chilled shrimp's citrus-horseradish bite cleans the palate, the 18oz strip's clean savory grain following with restrained char. Strong; the bright opener primes the strip's middle register.",

  'Kansas City|Burrata':
    "Kansas City after the burrata -- fresh basil-tomato-cream opens with milky delicacy, the 18oz lean-bold strip following with clean savory grain that the cream cleaned the palate for. Strong; the dairy opener lifts the strip's middle weight.",

  'Cowboy Ribeye|Bone Marrow':
    "Cowboy Ribeye after the bone marrow -- the unctuous marrow opens the meal, the 26oz cap-and-fat richness following with rendered fat and char that share the marrow's beefy language without competing. Strong; both courses speak fat in the same register.",

  'Cowboy Ribeye|Seafood Tower':
    "Cowboy Ribeye after the seafood tower -- the iced shellfish opens with bright cold-brine, the 26oz marbled char-and-fat following with rendered richness that the cold opener primed the palate to receive. Strong; the contrast carries the table.",

  'Cowboy Ribeye|Shrimp Cocktail':
    "Cowboy Ribeye after the shrimp cocktail -- the chilled shrimp's citrus-horseradish snap cleans the palate, the 26oz cap-and-fat cut following with rendered char-and-fat richness. Strong; the bright opener primes the indulgent cut.",

  'The Tomahawk|Seafood Tower':
    "The Tomahawk after the seafood tower -- showpiece into showpiece, the iced shellfish lineup opens the table with theater, the 36oz long-bone cut following with smoky char that the cold opener primed the palate to anticipate. Strong; both courses earn the spectacle billing.",

  'The Tomahawk|Shrimp Cocktail':
    "The Tomahawk after the shrimp cocktail -- the chilled shrimp's citrus-horseradish brightness cleans the palate, the 36oz long-bone showpiece following with theatrical bone-in marbling and smoky char. Strong; the bright classic opener primes the spectacle cut.",

  'Porterhouse|Seafood Tower':
    "Porterhouse after the seafood tower -- iced shellfish opens with showpiece presentation, the 40oz dual strip-and-filet following with two cuts in one, both courses indulgent in their own register. Strong; showpiece into showpiece reads steakhouse-classic.",

  'Porterhouse|Shrimp Cocktail':
    "Porterhouse after the shrimp cocktail -- the chilled shrimp's citrus-horseradish snap cleans the palate, the 40oz dual strip-and-filet following with strip char and filet butter, both cuts the opener primed cleanly. Strong; the classic combo reads timeless.",
};

module.exports = { FXF_STRONG_STEAK_STARTER };
