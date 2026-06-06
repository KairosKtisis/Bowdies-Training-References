// ── GUIDE TAB SWITCHING ──
const guideTabs = document.querySelectorAll('.guide-tab');
const guidePanels = document.querySelectorAll('.guide-panel');
const filterBarsAll = { cocktails: document.getElementById('filters-cocktails'), wine: document.getElementById('filters-wine'), food: document.getElementById('filters-food') };
const searchInput = document.getElementById('search-active');

let activeGuide = 'cocktails';
let activeFilters = { cocktails: 'all', wine: 'all', food: 'all' };
let activeSubFilter = 'all';

function updateSubFilters(primary) {
  document.getElementById('subfilters-cocktail').style.display = primary === 'cocktail' ? 'flex' : 'none';
  document.getElementById('subfilters-whiskey').style.display = primary === 'whiskey' ? 'flex' : 'none';
  document.getElementById('subfilters-scotch').style.display = primary === 'scotch' ? 'flex' : 'none';
  document.getElementById('subfilters-tequila').style.display = primary === 'tequila' ? 'flex' : 'none';
  document.getElementById('subfilters-vodka').style.display = primary === 'vodka' ? 'flex' : 'none';
  document.getElementById('subfilters-gin').style.display = primary === 'gin' ? 'flex' : 'none';
  document.getElementById('subfilters-liqueur').style.display = primary === 'liqueur' ? 'flex' : 'none';
  document.getElementById('subfilters-port').style.display = primary === 'port' ? 'flex' : 'none';
  document.getElementById('subfilters-rum').style.display = primary === 'rum' ? 'flex' : 'none';
  // Reset sub-filter when switching primary
  activeSubFilter = 'all';
  document.querySelectorAll('.sub-filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.sub-filter-btn[data-subfilter="all"]').forEach(b => b.classList.add('active'));
}
let searchTerm = [];

// Tab clicks delegate to switchGuide() — single source of truth for tab
// activation logic (filter visibility, search placeholder, sticky-nav,
// stage-panel bootstrap). Adding a new tab only requires updating switchGuide.
guideTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Scroll to top — without this, switching from a deep-scrolled section
    // left the new section opened at the same Y, hiding the top of its
    // content under the sticky-nav.
    window.scrollTo(0, 0);
    switchGuide(tab.dataset.guide);
    searchInput.value = '';
    searchTerm = [];
    applyFilters();
  });
});

// ── FILTERS ──
// Synonym expansion — searching one term also searches its equivalent
const SYNONYMS = {
  'french': 'france',
  'france': 'french',
  'italian': 'italy',
  'italy': 'italian',
  'spanish': 'spain',
  'spain': 'spanish',
  'american': 'california',
  'california': 'american',
  'burgundy': 'bourgogne',
  'bourgogne': 'burgundy',
  'champagne': 'france',
  'bordeaux': 'france',
  'tuscan': 'tuscany',
  'tuscany': 'tuscan',
  'rhone': 'rhône',
  'rhône': 'rhone',
  'cocoa': 'chocolate',
  'chocolate': 'cocoa',
  'cab': 'cabernet',
  'cabernet': 'cab',
  'sauv': 'sauvignon',
  'sauvignon': 'sauv',
  'chard': 'chardonnay',
  'chardonnay': 'chard',
  'citrusy': 'citrus',
  'sparkling': 'bubbles',
  'bubbles': 'sparkling',
};

function expandSynonyms(tokens) {
  const expanded = [];
  tokens.forEach(token => {
    expanded.push(token);
    const syn = SYNONYMS[token.value];
    if (syn) expanded.push({ type: 'word', value: syn });
  });
  return expanded;
}



// ── PRICE RANGE SEARCH ──
const winePrices = {
  // Bubbles (glass/bottle where applicable)
  "G.D. Vajra Moscato d'Asti": "$12 / $48",
  "Il Colle Prosecco Superiore": "$13 / $52",
  "Raventós Cava de NIT Rosé Brut": "$18 / $72",
  "Laurent Perrier Le Cuvée Brut": "$25 / $100",
  "Laurent Perrier Brut Rosé": "$120",
  "Veuve Clicquot Brut": "$120",
  "Paul Bara Grand Rosé Brut": "$150",
  "Robert Moncuit Les Grand Blancs": "$160",
  "Pierre Gimonnet Special Club Brut": "$200",
  "Pommery Cuvée Louise": "$300",
  // Whites (glass/bottle where applicable)
  "Stoneleigh Sauvignon Blanc": "$10 / $40",
  "Alexander Valley Chardonnay": "$12 / $48",
  "St Supéry Sauvignon Blanc": "$12 / $48",
  "Elk Cove Pinot Blanc": "$13 / $52",
  "Jean-Pierre Grossot Chablis": "$16 / $64",
  "Schloss Vollrads Riesling": "$16 / $64",
  "Le Garenne Rosé": "$17 / $68",
  "Domaine de Berthiers Pouilly-Fumé": "$19 / $76",
  "Our Lady of Guadalupe Acolytes": "$20 / $80",
  "Joseph Mellot Sancerre": "$76",
  "Keenan Chardonnay": "$120",
  "Far Niente Chardonnay": "$140",
  // By the Glass
  "Lunaria Coste di Moro": "$12 / $48",
  "Kermit Lynch Côtes du Rhône": "$12 / $48",
  "Alexander Valley Homestead Red": "$13 / $52",
  "Scotto Cellars The Lost Chapters": "$13 / $52",
  "Corazón del Sol Malbec": "$15 / $60",
  "Fento Ollo de Sapo Mencía": "$15 / $60",
  "Lingua Franca Avni Pinot Noir": "$18 / $72",
  "Fisher Unity Pinot Noir": "$19 / $76",
  "Château de Rouillac": "$20 / $80",
  "St Supéry Cabernet Sauvignon": "$20 / $80",
  "Quilt Cabernet Sauvignon": "$22 / $88",
  "Scavino Barolo": "$25 / $100",
  "Caymus Cabernet Sauvignon": "$28 / $180",
  // Pinot Noir
  "Cristom Mt Jefferson Cuvée": "$75",
  "Daniel Chotard Sancerre Rouge": "$90",
  "Evening Land Seven Springs": "$100",
  "Marimar Estate Christina": "$110",
  "Jax Calesa Vineyard Pinot Noir": "$120",
  "Macauley Pinot Noir": "$120",
  "Elk Cove Five Mountain": "$125",
  "RAEN Royal St Robert": "$125",
  "Sanford & Benedict Pinot Noir": "$130",
  "J Davies Ferrington Vineyards": "$140",
  // Cabernet
  "1881 Napa Valley": "$85",
  "Faust Napa Valley Cabernet": "$100",
  "Gundlach Bundschu Cabernet": "$115",
  "Venge Silencieux": "$120",
  "Austin Hope Cabernet Sauvignon": "$135",
  "Peju Cabernet Sauvignon": "$140",
  "Jordan Cabernet Sauvignon": "$145",
  "J. Davies Cabernet Sauvignon": "$150",
  "Teeter Totter Cabernet Sauvignon": "$150",
  "Ghost Block Cabernet Sauvignon": "$160",
  "Silver Oak Cabernet Sauvignon": "$160",
  "Brandlin Estate Cabernet Sauvignon": "$175",
  "Lail Vineyards Blueprint": "$175",
  "Spottswoode Lyndenhurst": "$175",
  "Nickel & Nickel Cabernet": "$195",
  "Shafer 1.5": "$195",
  "Cade Cabernet Sauvignon": "$210",
  "Darioush Cabernet Sauvignon": "$215",
  "Heitz Trailside Vineyard": "$220",
  "Frias Block 5": "$225",
  "Far Niente Cabernet Sauvignon": "$250",
  "Odette Cabernet Sauvignon": "$275",
  "Macauley Stagecoach Vineyard": "$295",
  "Freemark Abbey Bosché": "$300",
  "Venge Family Reserve": "$325",
  "Lail Vineyards Daniel Cuvée": "$350",
  "Heitz Martha's Vineyard": "$400",
  "Simon Family Estate Reserve": "$400",
  "Shafer Hillside Select": "$450",
  "Opus One": "$475",
  // Old World
  "Marc Brédif Chinon": "$60",
  "Braida Montebruna Barbera": "$70",
  "Le Volte dell'Ornellaia": "$80",
  "Muga Reserva": "$80",
  "Les Pallières Raciné": "$90",
  "Tenuta di Arceno Chianti Classico": "$95",
  "Château Haut Segottes": "$100",
  "Clos Petit Ona Grenache": "$110",
  "G.D. Vajra Albe Nebbiolo": "$120",
  "Le Ragnaie Brunello": "$120",
  "Domaine Tempier Bandol": "$130",
  "Domaine du Grand Tinel": "$140",
  "Pio Cesare Barbaresco": "$140",
  "Fattoria Le Pupille Saffredi": "$150",
  "Château Gombaude-Guillot": "$170",
  "Château Batailley": "$185",
  "Château Beaucastel": "$225",
  "Poderi Aldo Conterno Nebbiolo": "$225",
  "Sesti Brunello di Montalcino": "$225",
  // Blends
  "Bodega Noemia A Lisa": "$65",
  "Ghost Block Zinfandel": "$90",
  "The Prisoner Red Blend": "$100",
  "Macauley Petite Syrah": "$120",
  "Alexander Valley Cyrus": "$125",
  "Epoch Ingenuity": "$125",
  "San Simeon Stormwatch": "$130",
  "Domaine Serene Grand Cheval": "$140",
  "St Supéry Élu Meritage": "$140",
  "Darioush Cabernet Franc": "$150",
  "Keenan Mernet": "$190",
  "Venge Scout's Honor": "$110",
  "Jubilation by Colgin": "$350",
};

function extractPriceFilter(raw) {
  const s = raw.toLowerCase();
  let mode = 'bottle';
  if (/\bglass(es|\s+pour)?\b/.test(s)) mode = 'glass';
  else if (/\bbottles?\b/.test(s)) mode = 'bottle';

  let min = null, max = null, matched = '';

  const between = s.match(/\bbetween\s+\$?(\d+)\s+and\s+\$?(\d+)/);
  const range = s.match(/\$?(\d+)\s*(?:to|-|–)\s*\$?(\d+)/);
  const under = s.match(/\bunder\s+\$?(\d+)/);
  const over  = s.match(/\b(?:over|above)\s+\$?(\d+)/);
  const around = s.match(/\baround\s+\$?(\d+)/);

  if (between){ min = +between[1]; max = +between[2]; matched = between[0]; }
  else if (range)  { min = +range[1]; max = +range[2]; matched = range[0]; }
  else if (under) { max = +under[1]; matched = under[0]; }
  else if (over)  { min = +over[1];  matched = over[0]; }
  else if (around){ min = +around[1] - 15; max = +around[1] + 15; matched = around[0]; }

  return { min, max, mode, matched };
}

function getPriceForCard(name, mode) {
  const raw = winePrices[name];
  if (!raw) return null;
  const parts = raw.replace(/\$/g, '').split('/').map(p => parseInt(p.trim(), 10));
  if (mode === 'glass' && parts.length === 2) return parts[0];
  return parts[parts.length - 1];
}

function cardMatchesPrice(name, filter) {
  if (filter.min === null && filter.max === null) return true;
  const price = getPriceForCard(name, filter.mode);
  if (price === null) return false;
  if (filter.min !== null && price < filter.min) return false;
  if (filter.max !== null && price > filter.max) return false;
  return true;
}

function applyFilters() {
  const cards = document.querySelectorAll('#grid-' + activeGuide + ' .card');
  const noResults = document.getElementById('no-' + activeGuide);
  const filter = activeFilters[activeGuide];

  const cardTags = (card) =>
    Array.from(card.querySelectorAll('.tag')).map(el => el.textContent.trim().toLowerCase());

  const EXACT_MATCH_WORDS = new Set(['yellowfin']);

  const wordBoundary = (text, word) => {
    // Prefix-match between query word and text word, with a guard that
    // short query words can't latch onto longer text words. Specifically:
    //   - Query word must be at least 5 chars to use the (0..5) prefix
    //     against 7+ char text words.
    //   - Query word must be at least 4 chars to use the (0..4) prefix
    //     against 5-6 char text words.
    //   - Otherwise, exact match required.
    // Pre-fix behavior: "gin" (3) hit "ginger" (6) because slice(0,4) of
    // "gin" is still "gin" and "ginger".startsWith("gin") was true.
    const textWords = text.match(/\b[a-zÀ-ÿ']+\b/gi) || [];
    return textWords.some(tw => {
      if (EXACT_MATCH_WORDS.has(word)) return tw.toLowerCase() === word;
      const twl = tw.toLowerCase();
      const tl = tw.length;
      if (tl >= 7 && word.length >= 5) return twl.startsWith(word.slice(0, 5));
      if (tl >= 5 && word.length >= 4) return twl.startsWith(word.slice(0, 4));
      return twl === word;
    });
  };

  // Synonym matches always require exact word boundary — no prefix relaxation
  const exactWordBoundary = (text, word) =>
    new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(text);

  // Expand synonyms — each word token also checks its synonym
  const tokens = expandSynonyms(searchTerm);

  let visible = 0;
  cards.forEach(card => {
    const cat = card.dataset.category || '';
    const matchesFilter = (() => {
      if (filter === 'all') return true;
      const catParts = cat.split(' ');
      if (!catParts.includes(filter)) return false;
      // If a sub-filter is active, also check it
      if (activeSubFilter !== 'all') {
        return catParts.includes(activeSubFilter) ||
          (filter === 'cocktail' && activeSubFilter === 'offmenu' && cat.includes('offmenu'));
      }
      return true;
    })();
    if (!matchesFilter) { card.classList.add('hidden'); return; }

    const priceFilter = extractPriceFilter(searchInput.value);
    const matchesPrice = (activeGuide === 'wine') ? cardMatchesPrice(card.dataset.name, priceFilter) : true;

    if (!tokens.length) {
      if (matchesPrice) { card.classList.remove('hidden'); visible++; }
      else { card.classList.add('hidden'); }
      return;
    }

    const tags = cardTags(card);
    const detailEl = card.querySelector('.card-detail');
    const text = (card.dataset.name || '').toLowerCase() + ' ' + (detailEl ? detailEl.textContent : card.textContent).toLowerCase();

    const matches = matchesPrice && searchTerm.every(token => {
      if (token.type === 'tag') {
        return tags.includes(token.value);
      } else {
        const syn = SYNONYMS[token.value];
        if (syn) return exactWordBoundary(text, token.value) || exactWordBoundary(text, syn);
        return wordBoundary(text, token.value);
      }
    });

    if (matches) {
      card.classList.remove('hidden');
      visible++;
    } else {
      card.classList.add('hidden');
    }
  });

  // Zero results when any non-allergen-free tag token is present: retry as
  // a text-content AND match. This covers cases like "refreshing gin" where
  // no card carries BOTH tags but the user wants gin items described as
  // refreshing (and refreshing-tagged cocktails that use gin).
  // Allergen-free tokens always require strict tag presence — they're a
  // safety filter, not a search hint.
  // The wordBoundary function above is tightened: short query words (≤4
  // chars) require exact match against text words, so "gin" doesn't latch
  // onto "ginger", "red" doesn't latch onto "redder", etc.
  if (visible === 0 && searchTerm.some(t => t.type === 'tag' && !t.allergenFree)) {
    cards.forEach(card => {
      const cat = card.dataset.category || '';
      if (filter !== 'all' && !cat.split(' ').includes(filter)) return;
      const detailEl = card.querySelector('.card-detail');
      const cardTagsFallback = cardTags(card);
      // Tags live in the .tag-row OUTSIDE .card-detail, so detail.textContent
      // doesn't see them. The fallback needs to find tag-words as text too —
      // e.g., "refreshing" for Cucumber Gimlet whose Refreshing tag is the
      // only place that word appears. Concatenate tags into the search text.
      const text = (card.dataset.name || '').toLowerCase()
        + ' ' + cardTagsFallback.join(' ')
        + ' ' + (detailEl ? detailEl.textContent : card.textContent).toLowerCase();
      const matches = searchTerm.every(t => {
        if (t.allergenFree) return cardTagsFallback.includes(t.value);
        const syn = SYNONYMS[t.value];
        return wordBoundary(text, t.value) || (syn && exactWordBoundary(text, syn));
      });
      if (matches) {
        card.classList.remove('hidden');
        visible++;
      } else {
        card.classList.add('hidden');
      }
    });
  }

  if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
}

// Wire filter buttons for both guides
['cocktails', 'wine', 'food'].forEach(guide => {
  document.querySelectorAll('#filters-' + guide + ' .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#filters-' + guide + ' .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters[guide] = btn.dataset.filter;
      if (guide === 'cocktails') updateSubFilters(btn.dataset.filter);
      if (searchTerm.length) searchTerm = tokenizeQuery(searchInput.value.toLowerCase().trim());
      applyFilters();
    });
  });
});

// Wire sub-filter buttons
document.querySelectorAll('.sub-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Only deactivate siblings in same sub-filter bar
    btn.closest('.sub-filter-bar').querySelectorAll('.sub-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeSubFilter = btn.dataset.subfilter;
    if (searchTerm.length) searchTerm = tokenizeQuery(searchInput.value.toLowerCase().trim());
    applyFilters();
  });
});

// ── SEARCH LOGIC ──
// Collect all unique tags from all cards at runtime
function getAllTags() {
  const tags = new Set();
  document.querySelectorAll('#grid-' + activeGuide + ' .card .tag').forEach(el => {
    tags.add(el.textContent.trim().toLowerCase());
  });
  return Array.from(tags);
}

// Check if a query segment matches a tag using:
// full first word + first letter of second word (if multi-word tag)
// Tags that need 5-letter prefix match to avoid false positives
const LONG_PREFIX_TAGS = new Set(['champagne']);

function matchesTag(query, tag) {
  const qWords = query.trim().split(/\s+/);
  const tWords = tag.split(/\s+/);
  if (qWords.length === 1) {
    if (tWords.length !== 1) return false;
    const prefixLen = LONG_PREFIX_TAGS.has(tWords[0]) ? 5 : 3;
    return tWords[0].startsWith(qWords[0].slice(0, prefixLen));
  }
  // Multi-word query: first 3 letters of word 1, first letter of word 2
  if (tWords.length < 2) return false;
  return tWords[0].startsWith(qWords[0].slice(0, 3)) && tWords[1].startsWith(qWords[1][0]);
}

function findMatchingTag(query, allTags) {
  return allTags.find(tag => matchesTag(query, tag)) || null;
}

// Parse raw input into a list of {type, value} tokens
// type: 'tag' (must match tag exactly) or 'word' (loose match)
const STOPWORDS = new Set([
  'and', 'or', 'with', 'plus', 'also',
  'a', 'an', 'the', 'of', 'in', 'on', 'at', 'to', 'for', 'by', 'from',
  'some', 'any', 'something', 'like', 'similar', 'kind', 'type', 'style', 'sort',
  'i', 'want', 'give', 'me', 'show', 'anything', 'worthy', 'drink', 'under',
]);

// Allergens that, when followed by "free", must match tags only — never card text.
// This prevents e.g. "dairy free" from surfacing cards whose notes say "contains dairy".
const ALLERGEN_FREE_WORDS = new Set([
  'gluten', 'dairy', 'nut', 'nuts', 'peanut', 'peanuts',
  'shellfish', 'fish', 'egg', 'eggs', 'soy', 'wheat',
  'garlic', 'onion', 'lactose', 'sesame',
  // Common alternate names
  'milk', 'tree', 'shrimp', 'crab', 'lobster', 'oyster',
  'mustard', 'tamarind', 'ginger', 'shallot', 'pork', 'mollusc',
]);

// Allergen alternate name → canonical tag word
// Applied when the word precedes "free", so "milk free" → "dairy free"
const ALLERGEN_FREE_SYNONYMS = {
  'milk':    'dairy',
  'lactose': 'dairy',
  'wheat':   'gluten',
  'tree':    'tree nut',   // "tree free" → "tree nut free" (edge case, but covered)
  'tree nut': 'tree nut',
  'tree nuts': 'tree nut',
  'nuts':    'tree nut',
  'nut':     'tree nut',
  'peanuts': 'peanut',
  'eggs':    'egg',
  'shrimp':  'shellfish',
  'crab':    'shellfish',
  'lobster': 'shellfish',
  'oyster':  'shellfish',
  'mollusc': 'shellfish',
  'sesame':  'sesame',
  'soy':     'soy',
};

// Normalize natural-language allergen phrases into "[allergen] free"
// before tokenization, so the existing allergen-free path handles them.
// Handles: "free of X", "no X", "without X", "avoid X", "need to avoid X",
//          "X-free" (hyphenated), "X free options",
//          "safe for X allergy", "X allergy", "have a X allergy", "i have a X allergy",
//          "does not contain X", "contains no X",
//          "allergic to X", "i'm/i am allergic to X",
//          "sensitive to X", "i'm sensitive to X",
//          "X intolerant", "intolerant to X", "i'm intolerant to X",
//          "i can't have/eat X", "can't do/handle/touch X",
//          "don't do X", "off X",
//          "staying/keeping away from X", "keeping off X", "steering clear of X"
function normalizeAllergenPhrases(str) {
  const A =
    '(gluten|wheat|dairy|milk|lactose|eggs|egg|fish|shellfish|shrimp|crab|lobster|oyster|' +
    'mollusc|peanuts|peanut|tree\\s+nuts|tree\\s+nut|nuts|nut|soy|garlic|onion|mustard|' +
    'tamarind|ginger|shallot|sesame|pork)';

  // "X-free" hyphenated → "X free"
  str = str.replace(/(\w+)-free\b/gi, '$1 free');

  // "X free options" → "X free"  (consume "options" before anything else)
  str = str.replace(new RegExp(A + '\\s+free\\s+options\\b', 'gi'), (_, a) => a + ' free');

  // "free of X" → "X free"
  str = str.replace(new RegExp('\\bfree\\s+of\\s+' + A, 'gi'), (_, a) => a + ' free');

  // "no X" → "X free"
  str = str.replace(new RegExp('\\bno\\s+' + A, 'gi'), (_, a) => a + ' free');

  // "without X" → "X free"
  str = str.replace(new RegExp('\\bwithout\\s+' + A, 'gi'), (_, a) => a + ' free');

  // "avoid X" / "need to avoid X" / "avoiding X" → "X free"
  str = str.replace(new RegExp('\\b(?:need\\s+to\\s+)?avoid(?:ing)?\\s+' + A, 'gi'), (_, a) => a + ' free');

  // "off X" → "X free"
  str = str.replace(new RegExp('\\boff\\s+' + A, 'gi'), (_, a) => a + ' free');

  // "safe for X allergy" → "X free"
  str = str.replace(new RegExp('\\bsafe\\s+for\\s+' + A + '(?:\\s+allergy)?', 'gi'), (_, a) => a + ' free');

  // "X allergy" / "have a X allergy" / "i have a X allergy" → "X free"
  str = str.replace(new RegExp('\\b(?:i\\s+)?(?:have\\s+a\\s+)?' + A + '\\s+allergy\\b', 'gi'), (_, a) => a + ' free');

  // "does not contain X" → "X free"
  str = str.replace(new RegExp('\\bdoes\\s+not\\s+contain\\s+' + A, 'gi'), (_, a) => a + ' free');

  // "contains no X" → "X free"
  str = str.replace(new RegExp('\\bcontains\\s+no\\s+' + A, 'gi'), (_, a) => a + ' free');

  // "allergic to X" / "i'm allergic to X" / "i am allergic to X" → "X free"
  str = str.replace(new RegExp("\\bi'?m?\\s+(?:am\\s+)?allergic\\s+to\\s+" + A, 'gi'), (_, a) => a + ' free');
  str = str.replace(new RegExp('\\ballergic\\s+to\\s+' + A, 'gi'), (_, a) => a + ' free');

  // "sensitive to X" / "i'm sensitive to X" → "X free"
  str = str.replace(new RegExp("\\bi'?m?\\s+(?:am\\s+)?sensitive\\s+to\\s+" + A, 'gi'), (_, a) => a + ' free');
  str = str.replace(new RegExp('\\bsensitive\\s+to\\s+' + A, 'gi'), (_, a) => a + ' free');

  // "X intolerant" → "X free"
  str = str.replace(new RegExp(A + '\\s+intolerant\\b', 'gi'), (_, a) => a + ' free');

  // "intolerant to X" / "i'm intolerant to X" → "X free"
  str = str.replace(new RegExp("\\bi'?m?\\s+(?:am\\s+)?intolerant\\s+to\\s+" + A, 'gi'), (_, a) => a + ' free');
  str = str.replace(new RegExp('\\bintolerant\\s+to\\s+' + A, 'gi'), (_, a) => a + ' free');

  // "i can't have X" / "i can't eat X" / "can't have X" / "can't eat X" (with or without subject) → "X free"
  str = str.replace(new RegExp("\\b(?:\\w+\\s+)?can'?t\\s+(?:have|eat)\\s+" + A, 'gi'), (_, a) => a + ' free');

  // "can't do/handle/touch X" → "X free"
  str = str.replace(new RegExp("\\bcan'?t\\s+(?:do|handle|touch)\\s+" + A, 'gi'), (_, a) => a + ' free');

  // "don't do X" / "don't eat X" / "do not eat X" → "X free"
  str = str.replace(new RegExp("\\b(?:don'?t|do\\s+not)\\s+(?:do|eat)\\s+" + A, 'gi'), (_, a) => a + ' free');

  // "staying away from X" / "keeping away from X" → "X free"
  str = str.replace(new RegExp('\\b(?:staying|keeping)\\s+away\\s+from\\s+' + A, 'gi'), (_, a) => a + ' free');

  // "keeping off X" → "X free"
  str = str.replace(new RegExp('\\bkeeping\\s+off\\s+' + A, 'gi'), (_, a) => a + ' free');

  // "steering clear of X" → "X free"
  str = str.replace(new RegExp('\\bsteering\\s+clear\\s+of\\s+' + A, 'gi'), (_, a) => a + ' free');

  // Normalize plurals: "nuts free" → "nut free", "eggs free" → "egg free", "peanuts free" → "peanut free"
  str = str.replace(/\bnuts\s+free\b/gi, 'nut free');
  str = str.replace(/\beggs\s+free\b/gi, 'egg free');
  str = str.replace(/\bpeanuts\s+free\b/gi, 'peanut free');

  // Normalize "tree nut free" / "tree nuts free" spacing
  str = str.replace(/\btree\s+nuts?\s+free\b/gi, 'tree nut free');

  return str;
}

function tokenizeQuery(raw) {
  const allTags = getAllTags();
  raw = normalizeAllergenPhrases(raw);
  const words = raw.trim()
    .replace(/\boff\s+dry\b/g, 'off-dry')
    .replace(/\bage\s+worthy\b/g, 'age-worthy')
    .replace(/\bbetween\s+\$?\d+\s+and\s+\$?\d+/g, '')
    .replace(/\$?\d+/g, '')
    .replace(/\b(under|over|above|around|to|glass(?:es)?|bottle(?:s)?)\b/g, '')
    .split(/\s+/).filter(w => w && !STOPWORDS.has(w));
  const tokens = [];
  let i = 0;
  while (i < words.length) {
    // Allergen + "free": force tag-only match — never search card text, even in fallback
    // Also handles two-word allergens: "tree nut free"
    const nextIsFree = words[i + 1] === 'free';
    const twoWordAllergen = words[i] + ' ' + words[i + 1];
    const nextNextIsFree = words[i + 2] === 'free' && twoWordAllergen === 'tree nut';
    if ((nextIsFree && ALLERGEN_FREE_WORDS.has(words[i])) || nextNextIsFree) {
      const raw_allergen = nextNextIsFree ? twoWordAllergen : words[i];
      const canonical = ALLERGEN_FREE_SYNONYMS[raw_allergen] || ALLERGEN_FREE_SYNONYMS[words[i]] || raw_allergen;
      const twoWord = canonical + ' free';
      const tagMatch = findMatchingTag(twoWord, allTags);
      tokens.push({ type: 'tag', value: tagMatch || twoWord, allergenFree: true });
      i += nextNextIsFree ? 3 : 2;
      continue;
    }
    // Try two-word combination first — only consume both words if both match
    if (i + 1 < words.length) {
      const twoWord = words[i] + ' ' + words[i + 1];
      const tagMatch = findMatchingTag(twoWord, allTags);
      if (tagMatch) {
        tokens.push({ type: 'tag', value: tagMatch });
        i += 2;
        continue;
      }
    }
    // Two-word didn't match — try first word alone as a single-word tag
    // Exception: allergen words not followed by "free" must fall through to text search
    const singleMatch = !ALLERGEN_FREE_WORDS.has(words[i]) && findMatchingTag(words[i], allTags);
    if (singleMatch) {
      tokens.push({ type: 'tag', value: singleMatch });
    } else {
      // Check if this word is the start of any two-word tag
      // If so, emit it as a tag token for that two-word tag
      // Exception: allergen words not followed by "free" must go to text search, not tags
      const partialMatch = !ALLERGEN_FREE_WORDS.has(words[i]) && allTags.find(tag => {
        const tw = tag.split(' ');
        return tw.length === 2 && tw[0].startsWith(words[i].slice(0, 3));
      });
      if (partialMatch) {
        tokens.push({ type: 'tag', value: partialMatch });
      } else {
        tokens.push({ type: 'word', value: words[i] });
      }
    }
    i++;
  }
  return tokens;
}

// Shared search. On Spirits/Wine/Prime & Plate the input filters the card
// grid via applyFilters(). On Set the Stage it drives the pairing-browser's
// dropdown (search results below the input, click to load tier accordion).
searchInput.addEventListener('input', e => {
  if (activeGuide === 'stage') {
    if (typeof handlePbSearch === 'function') handlePbSearch(e.target.value);
    return;
  }
  searchTerm = tokenizeQuery(e.target.value.toLowerCase().trim());
  applyFilters();
});

// Stage filter buttons (All / Wines / Cocktails / Spirits / Dishes). The
// active filter is held in a stage-local state and drives which rec items
// appear inside the tier accordion. set-the-stage.js owns applyStageFilter.
document.addEventListener('click', e => {
  const btn = e.target.closest('#filters-stage .filter-btn');
  if (!btn) return;
  document.querySelectorAll('#filters-stage .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (typeof applyStageFilter === 'function') applyStageFilter(btn.dataset.filter);
});


// ── HOME SCREEN ──
const SEARCH_TIPS = {
  cocktails: '*tip — get familiar with the search bar  (try: "campari cocktail", "refreshing gin", "spirit forward and stirred")',
  wine: '*tip — get familiar with the search bar (try: "$100 to $150 blends", "earthy spanish red", "plum with medium body and soft tannins")',
  food: '*tip — get familiar with the search bar  (try: "gluten free", "seafood", "vegetarian")'
};

function switchGuide(guide) {
  document.querySelectorAll('.guide-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.guide-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-guide="' + guide + '"]').classList.add('active');
  document.getElementById('panel-' + guide).classList.add('active');
  // Restore the sticky-nav. set-the-stage.js hides it while the user is in
  // a workflow screen (First-Timer / Pick a Pair); without this reset, a tab
  // switch from inside a workflow would leave the search bar hidden on the
  // tab they jumped to.
  const stickyNav = document.querySelector('.sticky-nav');
  if (stickyNav) stickyNav.style.display = '';
  document.getElementById('filters-cocktails').style.display = guide === 'cocktails' ? 'flex' : 'none';
  document.getElementById('filters-wine').style.display = guide === 'wine' ? 'flex' : 'none';
  document.getElementById('filters-food').style.display = guide === 'food' ? 'flex' : 'none';
  // Set the Stage now uses the same global sticky-nav (search + filter bar)
  // as every other tab. The dedicated filters-stage row drops into the same
  // position as filters-food / filters-wine, only visible when stage is up.
  const filtersStage = document.getElementById('filters-stage');
  if (filtersStage) filtersStage.style.display = guide === 'stage' ? 'flex' : 'none';
  // Hide the search-tip line when stage is active — the dropdown does the
  // disclosure work and the tip would shadow the result list.
  const tipEl = document.getElementById('search-tip-text');
  if (tipEl) tipEl.style.display = guide === 'stage' ? 'none' : '';
  // Hide any pb-search-results dropdown when leaving stage; it's owned by stage.
  const pbResults = document.getElementById('pb-search-results');
  if (pbResults && guide !== 'stage') pbResults.classList.remove('visible');
  activeGuide = guide;
  if (guide === 'stage') {
    searchInput.placeholder = 'Search dishes, wines, cocktails, or spirits…';
  } else {
    searchInput.placeholder = guide === 'wine' ? 'Search wines, varietals, or tasting notes…' : guide === 'food' ? 'Search dishes, ingredients, or dietary needs…' : 'Search cocktails, spirits, or ingredients…';
  }
  if (tipEl && guide !== 'stage') tipEl.textContent = SEARCH_TIPS[guide] || SEARCH_TIPS.cocktails;
  // First-time activation of Set the Stage: bootstrap the pairing browser into
  // its default view. pbOpen() is defined in set-the-stage.js.
  if (guide === 'stage' && typeof pbOpen === 'function') pbOpen();
}

function selectSection(guide) {
  // Reset scroll. Without this, if the user scrolled deep into a previous
  // section and came back via Home, the new section opens scrolled to the
  // same Y as the prior one — and on mobile that locks the user in a
  // dead-zone where tabs at the top aren't reachable.
  window.scrollTo(0, 0);
  // Unlock body scrolling — sections have content beyond the viewport.
  document.body.classList.remove('scroll-locked');
  switchGuide(guide);
  searchInput.value = '';
  searchTerm = [];
  activeSubFilter = 'all';
  document.getElementById('subfilters-cocktail').style.display = 'none';
  document.getElementById('subfilters-whiskey').style.display = 'none';
  document.getElementById('subfilters-scotch').style.display = 'none';
  document.getElementById('subfilters-tequila').style.display = 'none';
  document.getElementById('subfilters-vodka').style.display = 'none';
  document.getElementById('subfilters-gin').style.display = 'none';
  document.getElementById('subfilters-liqueur').style.display = 'none';
  document.getElementById('subfilters-port').style.display = 'none';
  document.getElementById('subfilters-rum').style.display = 'none';
  applyFilters();
  const label = guide === 'wine' ? 'Wine' : guide === 'food' ? 'Prime & Plate' : guide === 'stage' ? 'Set the Stage' : 'Spirits';
  document.getElementById('home-section-label').textContent = label;
  document.getElementById('home-select').classList.add('hidden');
  document.getElementById('home-active').classList.add('visible');
  // Reveal main content, show top bar, fade out home screen
  document.getElementById('main-content').style.display = 'block';
  const topBar = document.getElementById('top-bar');
  topBar.style.display = 'flex';
  // Hide the profile chip — it sits top-right and would cover "← Home"
  // inside the sticky top bar. The chip is only visible on home + admin.
  if (typeof setChipVisible === 'function') setChipVisible(false);
  document.getElementById('top-bar-section').textContent = label;
  // Scale font size down for longer section names
  const sectionEl = document.getElementById('top-bar-section');
  sectionEl.style.fontSize = label.length > 8 ? '10px' : '13px';
  // Right-align section to same right edge as 'Chophouse' in home logo
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const wm = document.querySelector('.top-bar-wordmark');
      const sc = document.querySelector('.top-bar-section');
      const homeScript = document.querySelector('.home-script');
      if (!wm || !sc || !homeScript) return;

      // The home script already has paddingLeft set to align with home logo.
      // Its right edge = paddingLeft + its own rendered width.
      // We want sc's right edge to match that same proportional position
      // relative to wm's width.

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Measure home script right edge as fraction of home wordmark width
      const homeWm = document.querySelector('.home-wordmark');
      const hwmStyle = window.getComputedStyle(homeWm);
      ctx.font = hwmStyle.fontWeight + ' ' + hwmStyle.fontSize + ' ' + hwmStyle.fontFamily;
      const homeWmWidth = ctx.measureText("BOWDIE'S").width;

      const hsStyle = window.getComputedStyle(homeScript);
      ctx.font = hsStyle.fontStyle + ' ' + hsStyle.fontWeight + ' ' + hsStyle.fontSize + ' ' + hsStyle.fontFamily;
      const homeScWidth = ctx.measureText('Chophouse').width;
      const homeScLeft = parseFloat(homeScript.style.paddingLeft) || 0;
      // Right edge of Chophouse as fraction of home wordmark width
      const rightFraction = (homeScLeft + homeScWidth) / homeWmWidth;

      // Apply to top bar: sc right edge = wm width * rightFraction
      const wmStyle = window.getComputedStyle(wm);
      ctx.font = wmStyle.fontWeight + ' ' + wmStyle.fontSize + ' ' + wmStyle.fontFamily;
      const tbWmWidth = ctx.measureText("BOWDIE'S").width;

      const scStyle = window.getComputedStyle(sc);
      ctx.font = scStyle.fontStyle + ' ' + scStyle.fontWeight + ' ' + scStyle.fontSize + ' ' + scStyle.fontFamily;
      const scWidth = ctx.measureText(sc.textContent).width;

      const targetRight = tbWmWidth * rightFraction;
      sc.style.paddingLeft = Math.max(0, targetRight - scWidth) + 'px';
    });
  });
  document.getElementById('home-screen').classList.add('dismissed');
  setTimeout(() => {
    document.getElementById('home-screen').style.display = 'none';
  }, 400);
}

function returnHome() {
  // Same reason as selectSection — clear scroll so the home screen renders
  // at the viewport top instead of wherever the user left off in the
  // previous section.
  window.scrollTo(0, 0);
  // Lock body scroll while on home. position-fixed + overscroll-behavior
  // kills iOS bounce-scrolling that bare `overflow: hidden` doesn't catch.
  document.body.classList.add('scroll-locked');
  searchInput.value = '';
  searchTerm = [];
  activeFilters = { cocktails: 'all', wine: 'all', food: 'all' };
  activeSubFilter = 'all';
  document.getElementById('subfilters-cocktail').style.display = 'none';
  document.getElementById('subfilters-whiskey').style.display = 'none';
  document.getElementById('subfilters-scotch').style.display = 'none';
  document.getElementById('subfilters-tequila').style.display = 'none';
  document.getElementById('subfilters-vodka').style.display = 'none';
  document.getElementById('subfilters-gin').style.display = 'none';
  document.getElementById('subfilters-liqueur').style.display = 'none';
  document.getElementById('subfilters-port').style.display = 'none';
  document.getElementById('subfilters-rum').style.display = 'none';
  ['cocktails', 'wine'].forEach(guide => {
    document.querySelectorAll(`#filters-${guide} .filter-btn`).forEach(b => b.classList.remove('active'));
    document.querySelector(`#filters-${guide} .filter-btn[data-filter="all"]`).classList.add('active');
  });
  document.querySelectorAll('#filters-food .filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('#filters-food .filter-btn[data-filter="all"]').classList.add('active');
  applyFilters();
  const hs = document.getElementById('home-screen');
  // Position above viewport instantly (no transition), then slide down
  hs.style.transition = 'none';
  hs.style.display = 'flex';
  hs.classList.add('dismissed'); // puts it above viewport
  document.getElementById('home-select').classList.remove('hidden');
  document.getElementById('home-active').classList.remove('visible');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hs.style.transition = '';
      hs.classList.remove('dismissed'); // slide down into view
      // Hide main content once home screen is fully over it
      setTimeout(() => {
        document.getElementById('main-content').style.display = 'none';
        document.getElementById('top-bar').style.display = 'none';
      }, 400);
    });
  });
  // Back on home — restore the profile chip (if the device is configured).
  if (typeof setChipVisible === 'function') setChipVisible(true);
}

document.getElementById('home-spirits').addEventListener('click', () => selectSection('cocktails'));
document.getElementById('home-wine').addEventListener('click', () => selectSection('wine'));
document.getElementById('home-prime').addEventListener('click', () => selectSection('food'));
document.getElementById('home-return').addEventListener('click', returnHome);
document.getElementById('top-bar-return').addEventListener('click', returnHome);

document.getElementById('home-wheel').addEventListener('click', () => selectSection('stage'));




// Align home logo script the same way as header logo
function alignHomeScript() {
  const wordmark = document.querySelector('.home-wordmark');
  const script = document.querySelector('.home-script');
  if (!wordmark || !script) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const style = window.getComputedStyle(wordmark);
  ctx.font = style.fontWeight + ' ' + style.fontSize + ' ' + style.fontFamily;
  script.style.paddingLeft = ctx.measureText('BOWD').width + 'px';
}

alignHomeScript();
window.addEventListener('resize', alignHomeScript);

function alignTopBarSection() {
  const wm = document.querySelector('.top-bar-wordmark');
  const sc = document.querySelector('.top-bar-section');
  const homeWm = document.querySelector('.home-wordmark');
  const homeScript = document.querySelector('.home-script');
  if (!wm || !sc || !sc.textContent || !homeWm || !homeScript) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const hwmStyle = window.getComputedStyle(homeWm);
  ctx.font = hwmStyle.fontWeight + ' ' + hwmStyle.fontSize + ' ' + hwmStyle.fontFamily;
  const homeWmWidth = ctx.measureText("BOWDIE'S").width;
  const hsStyle = window.getComputedStyle(homeScript);
  ctx.font = hsStyle.fontStyle + ' ' + hsStyle.fontWeight + ' ' + hsStyle.fontSize + ' ' + hsStyle.fontFamily;
  const homeScWidth = ctx.measureText('Chophouse').width;
  const homeScLeft = parseFloat(homeScript.style.paddingLeft) || 0;
  const rightFraction = (homeScLeft + homeScWidth) / homeWmWidth;
  const wmStyle = window.getComputedStyle(wm);
  ctx.font = wmStyle.fontWeight + ' ' + wmStyle.fontSize + ' ' + wmStyle.fontFamily;
  const tbWmWidth = ctx.measureText("BOWDIE'S").width;
  const scStyle = window.getComputedStyle(sc);
  ctx.font = scStyle.fontStyle + ' ' + scStyle.fontWeight + ' ' + scStyle.fontSize + ' ' + scStyle.fontFamily;
  const scWidth = ctx.measureText(sc.textContent).width;
  const targetRight = tbWmWidth * rightFraction;
  sc.style.paddingLeft = Math.max(0, targetRight - scWidth) + 'px';
}
window.addEventListener('resize', alignTopBarSection);

// ── LOGO ALIGNMENT: C in Chophouse under right edge of D in Bowdie's ──
function alignLogo() {
  const wordmark = document.querySelector('.header-logo .wordmark');
  const script = document.querySelector('.header-logo .script');
  if (!wordmark || !script) return;

  // Measure width of "BOWDI" to find right edge of D
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const style = window.getComputedStyle(wordmark);
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const bowdiWidth = ctx.measureText('BOWD').width;

  script.style.paddingLeft = bowdiWidth + 'px';
}

alignLogo();

// Page always opens at the home screen. Set the Stage and the other sections
// are entered exclusively via the home buttons or the top guide-tabs — no
// URL-hash deep linking. (Earlier versions auto-switched on #wine/#stage and
// it kept hijacking ordinary loads when the hash carried over from a prior
// visit, so it's removed.)
window.addEventListener('resize', alignLogo);

// ── WINE PRICES ──

// Helper: extract numeric sort value from price string
function priceToNum(str) {
  if (!str) return 9999;
  const parts = str.replace(/\$/g, '').split('/');
  return parseInt(parts[parts.length - 1].trim(), 10) || 9999;
}

// Sort cards within each wine category by bottle price (low to high)
const wineGrid = document.getElementById('grid-wine');
const wineNoResults = document.getElementById('no-wine');
const wineCategories = ['bubbles', 'whites', 'glass', 'pinot', 'cab', 'old', 'blends'];

wineCategories.forEach(cat => {
  const cards = Array.from(wineGrid.querySelectorAll(`.card[data-category="${cat}"]`));
  cards.sort((a, b) => priceToNum(winePrices[a.dataset.name]) - priceToNum(winePrices[b.dataset.name]));
  cards.forEach(card => wineGrid.insertBefore(card, wineNoResults));
});

// Inject price badges next to vintage badges on wine cards
document.querySelectorAll('#grid-wine .card').forEach(card => {
  const name = card.dataset.name;
  const price = winePrices[name];
  if (!price) return;
  const badge = card.querySelector('.vintage-badge');
  if (!badge) return;
  // Remove existing price badge if any
  const existing = badge.parentNode.querySelector('.price-badge');
  if (existing) existing.remove();
  const priceBadge = document.createElement('span');
  priceBadge.className = 'price-badge';
  priceBadge.textContent = price;
  badge.insertAdjacentElement('afterend', priceBadge);
});

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const wasExpanded = card.classList.contains('expanded');
    const grid = card.closest('.grid');
    if (grid) grid.querySelectorAll('.card').forEach(c => c.classList.remove('expanded'));
    if (!wasExpanded) card.classList.add('expanded');
  });
});

// Click-off: clicking outside any card closes whatever's expanded. The card
// click handler above stops at "expand this one, collapse the rest in the
// grid" — but if a user reads a card and wants to scroll on without picking
// another, they had no way to dismiss it. Now any tap outside a .card
// closes the expansion. Also ignores clicks on the sticky-nav / guide-tabs
// chrome so a tab switch or filter tap doesn't get double-counted as a
// click-off (those have their own handlers).
document.addEventListener('click', (e) => {
  if (e.target.closest('.card')) return;
  if (e.target.closest('.sticky-nav, .guide-tabs, #top-bar')) return;
  document.querySelectorAll('.card.expanded').forEach(c => c.classList.remove('expanded'));
});

// ── DEVICE GATE + OOS OVERLAY BOOT ──
// auth.js shows the one-time setup gate if this device has never been configured.
// admin.js already wires its own DOMContentLoaded to tag home cards with 86
// badges, but the first PAIRING_MAP mutation happens here too so rec-filtering
// logic stays consistent even if a downstream script boots later.
(function bootIndex() {
  let profileExists = false;
  if (typeof authBoot === 'function') {
    // authBoot returns true when a profile already exists (no gate shown),
    // false when it just rendered the welcome / name-input gate.
    profileExists = authBoot();
  }
  // Lock body scroll on initial load — but ONLY when the home screen is
  // what the user will see. When the auth gate is up, leave scroll alone.
  // The gate is position:fixed with its own overflow-y:auto; layering our
  // scroll-lock on top of it caused iOS Safari to thrash and refresh-loop.
  // Also: we lock body only, not html. position:fixed on html had no extra
  // benefit and was contributing to the same thrash.
  if (profileExists) {
    document.body.classList.add('scroll-locked');
  }
})();