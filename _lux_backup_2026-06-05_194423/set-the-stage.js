// ── STATE ──────────────────────────────────────────────────────────────────────
// Seating + session-library state was removed with the scope-down (Apr 2026).
// All that's left is the first-timer flow + an empty specials array that
// getAllItems() still iterates defensively. The unified-layout pass (May 2026)
// added stageFilter — drives which kind of recommendation appears in each
// tier section ('all' | 'wines' | 'cocktails' | 'spirits' | 'dishes').
const state = {
  specials: [],
  ftDepth: 'short',
  ftAnswers: [],
  ftCurrentQ: 0,
  ftForSeat: null,   // always null post-scope-down; retained for completion.js compatibility
  ftForTable: null,  // same
  stageFilter: 'all',
  expandedTiers: { gold: true, excellent: false, strong: false, works: false, avoid: false },
};

// Category buckets used by the stage filter. Keys are filter names from the
// filters-stage filter-bar; values are sets of pairing-map category slugs
// — matching the actual category values in pairing-map-v2.js (verified by
// scanning every entry's `category` field). My earlier guess at these slugs
// was wrong on every bucket and the filter silently returned zero matches.
const STAGE_CATEGORY_BUCKETS = {
  wines: new Set([
    'wine-red', 'wine-white', 'wine-sparkling', 'wine-dessert',
  ]),
  cocktails: new Set(['cocktail']),
  spirits: new Set([
    'spirit', 'scotch', 'singlemalt', 'cognac', 'liqueur', 'gin', 'vodka',
    'rum', 'mezcal', 'irish', 'japanese', 'canadian', 'nz-whisky',
  ]),
  dishes: new Set([
    'starter', 'soup-salad', 'main', 'steak', 'side', 'dessert',
  ]),
};

function stageMatchesFilter(category, filter) {
  if (filter === 'all') return true;
  const bucket = STAGE_CATEGORY_BUCKETS[filter];
  return bucket ? bucket.has(category) : false;
}

// Called by main.js when a filters-stage button is clicked. Just refresh the
// detail view so each tier section re-filters its rec list.
function applyStageFilter(filter) {
  state.stageFilter = filter || 'all';
  if (pbState.current) pbRenderDetail();
}

// ── NAV ────────────────────────────────────────────────────────────────────────
// Post-unification (May 2026): Set the Stage lives inside index.html as the
// fourth top-level tab. "← Reference" is no longer meaningful from inside
// the panel — the user is already on the reference. goBack() now bounces to
// the home screen, mirroring the home/return affordance shared with the
// Spirits, Wine, and Prime & Plate panels.
function goBack() {
  if (typeof returnHome === 'function') returnHome();
}
function showScreen(id) {
  document.querySelectorAll('#panel-stage .screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  // Hide the global sticky-nav (search bar + filter row) while a workflow
  // screen is up. First-Timer Questions and Pick a Pair both have their own
  // inputs; the global search would just be dead chrome there. The pairing
  // browser (screen-pairings) keeps the sticky-nav visible because that's
  // exactly where it drives the experience.
  const stickyNav = document.querySelector('.sticky-nav');
  if (stickyNav) {
    stickyNav.style.display =
      (id === 'screen-firsttimer' || id === 'screen-compare') ? 'none' : '';
  }
  window.scrollTo(0, 0);
}
function updateTopBar(screen) {
  // No-op post-unification. The top bar is owned by index.html's main.js.
  // In-flow back navigation (Compare → Pairings, First-Timer → Pairings)
  // is handled by the in-screen "← Back" buttons (backFromCompare,
  // backFromFT) which both call pbOpen() to return to the pairing browser.
}


// ── SEARCH ────────────────────────────────────────────────────────────────────
function getAllItems() {
  const items = [];
  PAIRING_MAP.forEach(e => {
    if (e.spiritCluster) {
      items.push({ name:e.name, category:e.category, variable:false });
      (e.members||[]).forEach(m => items.push({ name:m, category:e.category, variable:false }));
    } else {
      items.push({ name:e.name, category:e.category, variable:e.variable||false });
    }
  });
  state.specials.forEach(s => items.push({ name:s.name, category:s.category, variable:false }));
  return items;
}

// Display label for a category slug. The canonical source of truth is
// CATEGORY_LABELS in pairing-map-v2.js — we look there first so adding a new
// category only requires touching the pairing data. If a slug isn't mapped
// (e.g. a special or a brand-new category), fall back to a title-case
// prettifier so it renders legibly instead of as a raw slug.
// ── PAIRING BROWSER (decoupled reference screen) ─────────────────────────────
// Post-scope-down: this is the only real screen on the page besides the
// first-timer flow and the admin sheet. Look up pairings for any item;
// tap any rec to pivot the browser to that item's pairings.
let pbState = { current: null, history: [], recents: [], searchDebounce: null };
const PB_RECENTS_KEY = 'bc_sts_pb_recents_v1';
const PB_RECENTS_MAX = 6;

function pbLoadRecents() {
  try { pbState.recents = JSON.parse(localStorage.getItem(PB_RECENTS_KEY) || '[]'); }
  catch(e) { pbState.recents = []; }
  if (!Array.isArray(pbState.recents)) pbState.recents = [];
}

function pbSaveRecents() {
  try { localStorage.setItem(PB_RECENTS_KEY, JSON.stringify(pbState.recents)); } catch(e){}
}

function pbRememberRecent(name) {
  // Remember anything resolvable — top-level entries OR cluster members.
  // Staff often re-look-up a specific bottle (e.g. Macallan 18) even though
  // the pairings come from the Speyside Scotch cluster; the recents chip
  // should carry the bottle name they searched, not the cluster parent.
  if (!pbResolveEntry(name)) return;
  pbState.recents = pbState.recents.filter(n => n !== name);
  pbState.recents.unshift(name);
  if (pbState.recents.length > PB_RECENTS_MAX) pbState.recents = pbState.recents.slice(0, PB_RECENTS_MAX);
  pbSaveRecents();
}

function pbOpen() {
  // The pairing browser is always home now — no concept of being routed in
  // from another screen. Admin + first-timer are the only places that route
  // back here, and both call pbOpen() with no arguments.
  pbLoadRecents();
  pbState.current = null;
  pbState.history = [];
  pbShowSearch();
  showScreen('screen-pairings');
  updateTopBar('screen-pairings');
}

// Launch first-timer as a standalone training flow — the only remaining
// "mode" on this page. ftForSeat/ftForTable stay null so completion.js's
// renderFTRecs treats this as a standalone run.
function startFirstTimerStandalone() {
  state.ftForSeat = null;
  state.ftForTable = null;
  state.ftAnswers = [];
  state.ftCurrentQ = 0;
  state.ftDepth = state.ftDepth || 'short';
  if (typeof renderFTQuestion === 'function') renderFTQuestion();
  document.getElementById('ft-recs-area').style.display = 'none';
  showScreen('screen-firsttimer');
  updateTopBar('screen-firsttimer');
}

function pbHome() {
  pbState.current = null;
  pbState.history = [];
  pbShowSearch();
}

function pbShowSearch() {
  document.getElementById('pb-search-view').style.display = 'block';
  document.getElementById('pb-detail-view').style.display = 'none';
  // Post-unification (May 2026) the search input lives in the global sticky
  // nav (#search-active). Clear it and the dropdown when re-entering the
  // home view, so a previous query doesn't carry over.
  const input = document.getElementById('search-active');
  if (input && activeGuide === 'stage') input.value = '';
  const results = document.getElementById('pb-search-results');
  if (results) results.classList.remove('visible');
  pbRenderRecents();
  window.scrollTo(0, 0);
}

function pbRenderRecents() {
  const wrap = document.getElementById('pb-recents-wrap');
  const list = document.getElementById('pb-recents-list');
  if (!wrap || !list) return;
  // Filter out any stale names that no longer resolve to a renderable entry.
  pbState.recents = pbState.recents.filter(n => pbResolveEntry(n));
  if (!pbState.recents.length) { wrap.style.display = 'none'; list.innerHTML = ''; return; }
  list.innerHTML = '';
  pbState.recents.forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'pb-recent-chip';
    btn.textContent = name;
    btn.onclick = () => pbNavigate(name);
    list.appendChild(btn);
  });
  wrap.style.display = 'block';
}

function handlePbSearch(val) {
  clearTimeout(pbState.searchDebounce);
  pbState.searchDebounce = setTimeout(() => {
    const results = document.getElementById('pb-search-results');
    if (!val || val.trim().length < 1) { results.classList.remove('visible'); return; }
    const q = val.toLowerCase();
    // Surface anything we can resolve to a renderable pairing card — top-level
    // entries AND spirit-cluster members (they render the cluster's pairings
    // with a "category-level" indicator). Dedupe by name so a cluster parent
    // that also appears verbatim as a member doesn't show twice.
    const seen = new Set();
    const matches = getAllItems()
      .filter(i => {
        if (seen.has(i.name)) return false;
        if (!i.name.toLowerCase().includes(q)) return false;
        if (!pbResolveEntry(i.name)) return false;
        seen.add(i.name);
        return true;
      })
      .slice(0, 20);
    if (!matches.length) { results.innerHTML = ''; results.classList.remove('visible'); return; }
    results.innerHTML = '';
    matches.forEach(item => {
      // OOS items stay surfaced and tappable — staff still need the context,
      // they just need to see it's 86'd before they pitch it.
      const oos = isItemOos(item.name);
      const div = document.createElement('div');
      div.className = 'search-result-item' + (oos ? ' oos' : '');
      div.innerHTML = '<span class="press-fill"></span><span class="result-name">'
        + item.name + '</span>'
        + (oos ? '<span class="result-86">86</span>' : '')
        + '<span class="result-cat">'
        + getCategoryForDisplay(item.category) + '</span>';
      div.onclick = () => pbNavigate(item.name);
      results.appendChild(div);
    });
    results.classList.add('visible');
  }, 80);
}

// Resolve a user-facing name to a renderable PAIRING_MAP entry. If the name
// matches a top-level entry, return it directly. If it matches a spirit-cluster
// member (e.g. "Macallan 18" → Speyside Scotch cluster), return the cluster
// entry so we render its category-level pairings, and expose viaCluster so the
// detail view can flag that the pairings aren't bottle-specific. This is what
// surfaces the ~295 cluster members that otherwise have no pairing card.
function pbResolveEntry(name) {
  const top = PAIRING_MAP.find(e => e.name === name);
  if (top) return { entry: top, viaCluster: null };
  const cluster = PAIRING_MAP.find(e => e.spiritCluster && Array.isArray(e.members) && e.members.includes(name));
  if (cluster) return { entry: cluster, viaCluster: cluster.name };
  return null;
}

function pbNavigate(name) {
  const resolved = pbResolveEntry(name);
  if (!resolved) return; // Truly unknown name.
  if (pbState.current && pbState.current !== name) {
    pbState.history.push(pbState.current);
  }
  pbState.current = name;
  pbRememberRecent(name);
  // Close the search dropdown and clear the input — once an item is loaded
  // the user is in the detail view, the dropdown is no longer relevant.
  // (Was sticking open before; users had to tap elsewhere to dismiss.)
  const results = document.getElementById('pb-search-results');
  if (results) results.classList.remove('visible');
  const input = document.getElementById('search-active');
  if (input) input.value = '';
  pbRenderDetail();
}

function pbBack() {
  if (pbState.history.length) {
    pbState.current = pbState.history.pop();
    pbRenderDetail();
  } else {
    pbHome();
  }
}

function pbRenderDetail() {
  const name = pbState.current;
  const resolved = pbResolveEntry(name);
  if (!resolved) { pbHome(); return; }
  const entry = resolved.entry;
  // Every fresh item render resets tier expansion to defaults — Gold open,
  // the rest closed. Without this, expansion state leaks across navigation
  // (e.g. expand Excellent on Filet, navigate to Bone-In Filet, Excellent
  // would still be open from the previous item).
  state.expandedTiers = { gold: true, excellent: false, strong: false, works: false, avoid: false };
  document.getElementById('pb-search-view').style.display = 'none';
  document.getElementById('pb-detail-view').style.display = 'block';
  // Title is always the user-facing name they searched — cluster members keep
  // their bottle name (e.g. "Macallan 18") rather than flipping to the parent.
  document.getElementById('pb-item-title').textContent = name;
  document.getElementById('pb-item-cat-badge').textContent = getCategoryForDisplay(entry.category);
  document.getElementById('pb-back-label').textContent = pbState.history.length ? 'Back' : 'Search';

  const clusterSlot = document.getElementById('pb-cluster-note-slot');
  if (clusterSlot) {
    clusterSlot.innerHTML = resolved.viaCluster
      ? '<div class="pb-cluster-note"><strong>Category-level pairing</strong>These pairings reflect '
        + escapeHtml(resolved.viaCluster)
        + ' as a style. Use them as a starting point — a specific bottle may lean richer, smokier, or drier than the category average.</div>'
      : '';
  }

  const bannerSlot = document.getElementById('pb-oos-banner-slot');
  if (bannerSlot) {
    bannerSlot.innerHTML = entry.oos
      ? '<div class="pb-oos-banner"><strong>86’d</strong>Currently out of stock — do not offer. Check with management before pitching.</div>'
      : '';
  }

  const profileEl = document.getElementById('pb-item-profile');
  const profile = entry.profile || [];
  profileEl.innerHTML = profile.slice(0, 10)
    .map(p => '<span class="pb-profile-tag">'+escapeHtml(p)+'</span>').join('');

  // Unified five-tier accordion (May 2026). Each tier renders as a collapsible
  // section. Default expansion is held in state.expandedTiers — Gold open, the
  // rest closed. Rec items inside each section are filtered by state.stageFilter:
  // 'all' shows every rec, 'wines'/'cocktails'/'spirits'/'dishes' restrict to
  // their category bucket. A tier with zero recs after filtering renders a
  // small placeholder so the structure stays predictable.
  const tiersEl = document.getElementById('pb-tiers');
  tiersEl.innerHTML = '';
  // Avoid lives in pb-avoid in the markup; keep that container empty since
  // the accordion now includes Avoid as its 5th section.
  const legacyAvoidEl = document.getElementById('pb-avoid');
  if (legacyAvoidEl) legacyAvoidEl.innerHTML = '';

  const TIERS = [
    { key: 'gold',      label: 'GOLD STANDARD', isAvoid: false },
    { key: 'excellent', label: 'EXCELLENT',     isAvoid: false },
    { key: 'strong',    label: 'STRONG',        isAvoid: false },
    { key: 'works',     label: 'WORKS',         isAvoid: false },
    { key: 'avoid',     label: 'AVOID WITH',    isAvoid: true  },
  ];

  // Backend keeps gold as a subset of excellent (every gold pair is also
  // listed in excellent). For the UI we want each item to appear only in
  // its highest tier — so when rendering excellent, drop anything that's
  // already in gold. Per CLAUDE.md this is the only tier overlap.
  const goldSet = new Set(entry.gold || []);

  TIERS.forEach(({ key, label, isAvoid }) => {
    let allNames = entry[key] || [];
    if (key === 'excellent') {
      allNames = allNames.filter(n => !goldSet.has(n));
    }
    // Filter recs by the current stage filter. We always include unknown
    // (no PAIRING_MAP entry) recs only when the filter is 'all', since we
    // can't classify them otherwise.
    const filteredNames = allNames.filter(recName => {
      const recEntry = PAIRING_MAP.find(e => e.name === recName);
      if (!recEntry) return state.stageFilter === 'all';
      return stageMatchesFilter(recEntry.category, state.stageFilter);
    })
    // Alphabetize within each tier — pairing-map order is roughly insertion
    // order, which feels random when scanning a long list. Locale-aware,
    // case-insensitive sort keeps "Macallan 18" next to "macallan 25" etc.
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    const section = document.createElement('div');
    // tier-{key} class lets the stylesheet color the section directly
    // without relying on :has(.tier-pip.X), which older mobile Safari
    // builds don't support reliably.
    section.className = 'pb-tier-section tier-' + key + (isAvoid ? ' pb-avoid-section' : '');
    if (state.expandedTiers[key]) section.classList.add('open');
    section.dataset.tier = key;

    // Tier header — clicking toggles `.open`. Header always shows the *full*
    // pre-filter count so the user sees the headline number; the body shows
    // the filtered subset (or empty placeholder if filter excluded everything).
    const header = document.createElement('div');
    header.className = 'pb-tier-label' + (isAvoid ? ' pb-avoid-label' : '');
    header.innerHTML = (isAvoid
        ? '<span class="pb-avoid-glyph">⚠</span>'
        : '<span class="tier-pip ' + key + '"></span>')
      + '<span class="pb-tier-name">' + label + '</span>'
      + '<span class="pb-tier-count">' + allNames.length + '</span>';
    header.onclick = () => {
      state.expandedTiers[key] = !state.expandedTiers[key];
      section.classList.toggle('open');
    };
    section.appendChild(header);

    // List body. For non-avoid tiers, recs render as pb-rec-* rows; for the
    // avoid section, as pb-avoid-* rows (warning visual treatment retained).
    const list = document.createElement('div');
    list.className = isAvoid ? 'pb-avoid-list' : 'pb-rec-list';

    if (!filteredNames.length) {
      const empty = document.createElement('div');
      empty.className = 'pb-tier-empty';
      empty.textContent = allNames.length === 0
        ? (isAvoid ? 'No items to flag.' : 'No pairings at this tier.')
        : 'No matches for the active filter.';
      list.appendChild(empty);
    } else if (isAvoid) {
      filteredNames.forEach(n => {
        const row = document.createElement('div');
        row.className = 'pb-avoid-row';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pb-avoid-item';
        btn.innerHTML = '<span>' + escapeHtml(n) + '</span><span class="pb-avoid-arrow">›</span>';
        btn.onclick = () => pbToggleAvoidExplain(n);
        row.appendChild(btn);
        const explain = document.createElement('div');
        // Tag with tier-avoid so the explain panel's border + accent text
        // take the warning color instead of the default gold.
        explain.className = 'pb-avoid-explain tier-' + key;
        explain.id = 'pb-avoid-explain-' + encodeURIComponent(n);
        explain.hidden = true;
        row.appendChild(explain);
        list.appendChild(row);
      });
    } else {
      filteredNames.forEach(recName => {
        const recEntry = PAIRING_MAP.find(e => e.name === recName);
        const cat = recEntry && recEntry.category;
        const oos = recEntry && recEntry.oos;
        const row = document.createElement('div');
        row.className = 'pb-rec-row';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pb-rec-item' + (oos ? ' oos' : '');
        btn.innerHTML = '<div class="pb-rec-info">'
          + '<div class="pb-rec-name">' + escapeHtml(recName) + '</div>'
          + (cat ? '<div class="pb-rec-cat">' + escapeHtml(getCategoryForDisplay(cat)) + '</div>' : '')
          + (oos ? '<div class="pb-rec-oos">Currently Unavailable</div>' : '')
          + '</div><span class="pb-rec-arrow">›</span>';
        btn.onclick = () => pbToggleRecExplain(recName);
        row.appendChild(btn);
        const explain = document.createElement('div');
        // Tag with tier-{key} so the explain panel's border-left and the
        // bold item name inside the note take the tier's color instead of
        // the default gold.
        explain.className = 'pb-rec-explain tier-' + key;
        explain.id = 'pb-explain-' + encodeURIComponent(recName);
        explain.hidden = true;
        row.appendChild(explain);
        list.appendChild(row);
      });
    }

    section.appendChild(list);
    tiersEl.appendChild(section);
  });

  window.scrollTo(0, 0);
}

// Close every open explain panel inside the pairing browser (tier + avoid).
// Used when toggling a new panel (one-open-at-a-time) and when navigating away.
function pbCloseAllExplainPanels(except) {
  document.querySelectorAll('#screen-pairings .pb-rec-explain.open, #screen-pairings .pb-avoid-explain.open').forEach(p => {
    if (p !== except) { p.classList.remove('open'); p.hidden = true; }
  });
  document.querySelectorAll('#screen-pairings .pb-rec-item.expanded, #screen-pairings .pb-avoid-item.expanded').forEach(b => {
    if (!except || !b.parentElement || b.parentElement.querySelector('.pb-rec-explain, .pb-avoid-explain') !== except) {
      b.classList.remove('expanded');
    }
  });
}

// Expand the pairing reasoning for a recommended item inline. The "source" is
// the item currently being browsed (pbState.current) — i.e. the reason shown
// answers "why does THIS item pair with that rec", not the other way around.
function pbToggleRecExplain(recName) {
  const panel = document.getElementById('pb-explain-' + encodeURIComponent(recName));
  if (!panel) return;
  const btn = panel.parentElement && panel.parentElement.querySelector('.pb-rec-item');
  const wasOpen = panel.classList.contains('open');
  pbCloseAllExplainPanels(panel);
  if (wasOpen) {
    panel.classList.remove('open');
    panel.hidden = true;
    if (btn) btn.classList.remove('expanded');
    return;
  }
  const sourceName = pbState.current;
  // pairing-notes.js is keyed by top-level entry names. For a cluster member
  // (e.g. "Macallan 18"), look up the note under the cluster's name so the
  // category-level reasoning still shows. The header keeps the bottle name.
  const sourceResolved = pbResolveEntry(sourceName);
  const noteKey = sourceResolved && sourceResolved.viaCluster ? sourceResolved.viaCluster : sourceName;
  const note = typeof getPairingNote === 'function' ? getPairingNote(noteKey, recName) : null;
  const targetEntry = PAIRING_MAP.find(e => e.name === recName);
  let body;
  if (note) {
    body = '<div class="rec-explain-source">Why this pairs with <strong>' + escapeHtml(sourceName) + '</strong>:</div>'
         + '<div class="rec-explain-body">' + escapeHtml(note) + '</div>';
  } else {
    body = '<div class="rec-explain-source">Paired with <strong>' + escapeHtml(sourceName) + '</strong></div>'
         + '<div class="rec-explain-body rec-explain-pending">Detailed pairing notes coming soon.</div>';
  }
  panel.innerHTML = body;
  if (targetEntry) {
    const navBtn = document.createElement('button');
    navBtn.type = 'button';
    navBtn.className = 'pb-rec-explain-nav';
    navBtn.textContent = 'View ' + recName + '’s pairings →';
    navBtn.onclick = (e) => { e.stopPropagation(); pbCloseAllExplainPanels(null); pbNavigate(recName); };
    panel.appendChild(navBtn);
  }
  panel.hidden = false;
  if (btn) btn.classList.add('expanded');
  requestAnimationFrame(() => panel.classList.add('open'));
}

// Avoid-list analog: expand the "never pair with" reasoning inline.
function pbToggleAvoidExplain(avoidName) {
  const panel = document.getElementById('pb-avoid-explain-' + encodeURIComponent(avoidName));
  if (!panel) return;
  const btn = panel.parentElement && panel.parentElement.querySelector('.pb-avoid-item');
  const wasOpen = panel.classList.contains('open');
  pbCloseAllExplainPanels(panel);
  if (wasOpen) {
    panel.classList.remove('open');
    panel.hidden = true;
    if (btn) btn.classList.remove('expanded');
    return;
  }
  const sourceName = pbState.current;
  const sourceResolved = pbResolveEntry(sourceName);
  const noteKey = sourceResolved && sourceResolved.viaCluster ? sourceResolved.viaCluster : sourceName;
  const note = typeof getPairingNote === 'function' ? getPairingNote(noteKey, avoidName) : null;
  const targetEntry = PAIRING_MAP.find(e => e.name === avoidName);
  let body;
  if (note) {
    body = '<div class="rec-explain-source">Why <strong>' + escapeHtml(sourceName) + '</strong> + <strong>' + escapeHtml(avoidName) + '</strong> doesn’t work:</div>'
         + '<div class="rec-explain-body">' + escapeHtml(note) + '</div>';
  } else {
    body = '<div class="rec-explain-source">Avoid pairing <strong>' + escapeHtml(sourceName) + '</strong> with <strong>' + escapeHtml(avoidName) + '</strong></div>'
         + '<div class="rec-explain-body rec-explain-pending">Detailed conflict notes coming soon.</div>';
  }
  panel.innerHTML = body;
  if (targetEntry) {
    const navBtn = document.createElement('button');
    navBtn.type = 'button';
    navBtn.className = 'pb-rec-explain-nav';
    navBtn.textContent = 'View ' + avoidName + '’s pairings →';
    navBtn.onclick = (e) => { e.stopPropagation(); pbCloseAllExplainPanels(null); pbNavigate(avoidName); };
    panel.appendChild(navBtn);
  }
  panel.hidden = false;
  if (btn) btn.classList.add('expanded');
  requestAnimationFrame(() => panel.classList.add('open'));
}
// ── FIRST TIMER ───────────────────────────────────────────────────────────────
// Post-scope-down: first-timer is always standalone. The "Back" affordance
// lives in the top bar (← Pairings) and in the ft-nav row (backFromFT below).
function backFromFT() {
  if (typeof pbOpen === 'function') { pbOpen(); return; }
  showScreen('screen-pairings');
  updateTopBar('screen-pairings');
}

// ── COMPARE TWO ITEMS ────────────────────────────────────────────────────────
// Standalone screen: user picks two items, we render a verdict tier + the two
// notes (forward + reverse). Lookup is direct against PAIRING_MAP.
const cmpState = { a: null, b: null, debA: null, debB: null };
const CMP_TIERS = ['gold', 'excellent', 'strong', 'works', 'avoid'];

function startCompareStandalone() {
  cmpState.a = null;
  cmpState.b = null;
  ['a','b'].forEach(side => {
    const inp = document.getElementById('cmp-input-' + side);
    const res = document.getElementById('cmp-results-' + side);
    if (inp) inp.value = '';
    if (res) { res.innerHTML = ''; res.classList.remove('visible'); }
  });
  const verdict = document.getElementById('cmp-verdict');
  if (verdict) verdict.innerHTML = '';
  showScreen('screen-compare');
  updateTopBar('screen-compare');
}

function handleCmpSearch(side, val) {
  const debKey = side === 'a' ? 'debA' : 'debB';
  clearTimeout(cmpState[debKey]);
  cmpState[debKey] = setTimeout(() => {
    const results = document.getElementById('cmp-results-' + side);
    if (!val || val.trim().length < 1) { results.classList.remove('visible'); return; }
    const q = val.toLowerCase();
    const seen = new Set();
    const matches = getAllItems()
      .filter(i => {
        if (seen.has(i.name)) return false;
        if (!i.name.toLowerCase().includes(q)) return false;
        if (!pbResolveEntry(i.name)) return false;
        seen.add(i.name);
        return true;
      })
      .slice(0, 20);
    if (!matches.length) { results.innerHTML = ''; results.classList.remove('visible'); return; }
    results.innerHTML = '';
    matches.forEach(item => {
      const oos = isItemOos(item.name);
      const div = document.createElement('div');
      div.className = 'search-result-item' + (oos ? ' oos' : '');
      div.innerHTML = '<span class="press-fill"></span><span class="result-name">'
        + item.name + '</span>'
        + (oos ? '<span class="result-86">86</span>' : '')
        + '<span class="result-cat">'
        + getCategoryForDisplay(item.category) + '</span>';
      div.onclick = () => pbCompareSelect(side, item.name);
      results.appendChild(div);
    });
    results.classList.add('visible');
  }, 80);
}

function pbCompareSelect(side, name) {
  cmpState[side] = name;
  const input = document.getElementById('cmp-input-' + side);
  const results = document.getElementById('cmp-results-' + side);
  if (input) input.value = name;
  if (results) results.classList.remove('visible');
  pbCompareRender();
}

function pbCompareReset() {
  startCompareStandalone();
}

function pbCompareRender() {
  const verdict = document.getElementById('cmp-verdict');
  if (!verdict) return;
  verdict.innerHTML = '';
  if (!cmpState.a || !cmpState.b) return;

  if (cmpState.a === cmpState.b) {
    verdict.innerHTML = '<div class="cmp-error">Pick two different items.</div>';
    return;
  }

  const a = pbResolveEntry(cmpState.a);
  const b = pbResolveEntry(cmpState.b);
  if (!a || !b) {
    verdict.innerHTML = '<div class="cmp-error">One or both items not found.</div>';
    return;
  }

  // Tier lookup: A's perspective first, then B's defensively.
  let tier = null;
  for (const t of CMP_TIERS) {
    if ((a.entry[t] || []).includes(cmpState.b)) { tier = t; break; }
  }
  if (!tier) {
    for (const t of CMP_TIERS) {
      if ((b.entry[t] || []).includes(cmpState.a)) { tier = t; break; }
    }
  }

  const fwdNote = (typeof PAIRING_NOTES !== 'undefined') && PAIRING_NOTES[cmpState.a + '|' + cmpState.b];
  const revNote = (typeof PAIRING_NOTES !== 'undefined') && PAIRING_NOTES[cmpState.b + '|' + cmpState.a];

  let html = '';
  if (tier) {
    const tierLabel = tier === 'gold' ? 'GOLD STANDARD' : tier.toUpperCase();
    html += '<div class="cmp-verdict-card cmp-tier-' + tier + '">';
    html += '<div class="cmp-tier-row">';
    if (tier !== 'avoid') html += '<span class="tier-pip ' + tier + '"></span>';
    html += '<span class="cmp-tier-label">' + tierLabel + '</span>';
    html += '</div>';
    html += '</div>';
  } else {
    html += '<div class="cmp-verdict-card cmp-no-guidance">';
    html += '<div class="cmp-tier-label">NO SPECIFIC GUIDANCE</div>';
    html += '<div class="cmp-no-guidance-body">No specific tier relationship between these two. Both are good on their own — order what sounds best.</div>';
    html += '</div>';
  }

  // Post-canonicalization: forward and reverse notes are the same content.
  // Show ONE note per pair instead of two redundant blocks. If they happen to
  // differ (e.g., a stale state), prefer fwdNote.
  const note = fwdNote || revNote;
  if (note) {
    html += '<div class="cmp-notes-block">';
    html += '<div class="cmp-note">';
    html += '<div class="cmp-note-label">' + escapeHtml(cmpState.a) + '  ↔  ' + escapeHtml(cmpState.b) + '</div>';
    html += '<div class="cmp-note-body">' + escapeHtml(note) + '</div>';
    html += '</div>';
    html += '</div>';
  }

  verdict.innerHTML = html;
}

function backFromCompare() {
  if (typeof pbOpen === 'function') { pbOpen(); return; }
  showScreen('screen-pairings');
  updateTopBar('screen-pairings');
}

const FT_QUESTIONS_SHORT = [
  { q:"Is your guest drinking tonight?", options:[
    {label:"Yes — open to everything",value:'drinkingYes'},
    {label:"Wine only",value:'drinkingWineOnly'},
    {label:"Cocktails only",value:'drinkingCocktailsOnly'},
    {label:"No — non-alcoholic evening",value:'drinkingNo'}
  ]},
  { q:"How do they typically take their protein?", options:[
    {label:"Rare to medium-rare — they want it red",value:'proteinRareMR'},
    {label:"Medium — right down the middle",value:'proteinMedium'},
    {label:"Medium-well to well — no pink",value:'proteinMWWell'},
    {label:"No red meat tonight",value:'proteinNoRed'}
  ]},
  { q:"How do they tend to eat and drink?", options:[
    {label:"Bold and rich — the more the better",value:'boldAndRich'},
    {label:"Somewhere in the middle",value:'middle'},
    {label:"Light and fresh — clean flavors",value:'lightAndFresh'}
  ]},
  { q:"Any dietary restrictions or allergies?", options:[
    {label:"None",value:'none'},{label:"Dairy-free",value:'none'},
    {label:"Gluten-free",value:'none'},{label:"Shellfish allergy",value:'none'},
    {label:"Vegetarian / pescatarian",value:'proteinNoRed'}
  ]}
];
const FT_QUESTIONS_DEEP = [
  ...FT_QUESTIONS_SHORT,
  { q:"Do they gravitate toward sweet, savory, or both?", options:[
    {label:"Mostly sweet",value:'sweetFlavor'},{label:"Mostly savory",value:'savoryFlavor'},
    {label:"Both — they appreciate the full spectrum",value:'bothFlavors'}
  ]},
  { q:"How familiar are they with wine?", options:[
    {label:"Knowledgeable — they know what they like",value:'wineExpert'},
    {label:"Curious — they'd appreciate a recommendation",value:'wineGuided'},
    {label:"Not their focus tonight",value:'none'}
  ]},
  { q:"Are they celebrating something?", options:[
    {label:"Yes — special occasion",value:'celebrating'},{label:"Just a great dinner",value:'none'}
  ]},
  { q:"What's their comfort level on spend?", options:[
    {label:"Approachable — keep it reasonable",value:'budgetApproachable'},
    {label:"Mid-range — they're here to enjoy themselves",value:'budgetMid'},
    {label:"The sky's the limit",value:'budgetSky'}
  ]}
];
let ftQuestions = FT_QUESTIONS_SHORT;

function setFTDepth(depth) {
  state.ftDepth = depth;
  state.ftAnswers = []; state.ftCurrentQ = 0;
  ftQuestions = depth === 'deep' ? FT_QUESTIONS_DEEP : FT_QUESTIONS_SHORT;
  document.getElementById('ft-short-btn').classList.toggle('active', depth==='short');
  document.getElementById('ft-deep-btn').classList.toggle('active', depth==='deep');
  document.getElementById('ft-recs-area').style.display = 'none';
  initFirstTimer();
}
function initFirstTimer() {
  state.ftAnswers = []; state.ftCurrentQ = 0;
  ftQuestions = state.ftDepth === 'deep' ? FT_QUESTIONS_DEEP : FT_QUESTIONS_SHORT;
  renderFTQuestion();
}
function renderFTQuestion() {
  const q = ftQuestions[state.ftCurrentQ];
  const total = ftQuestions.length;
  document.getElementById('ft-progress').innerHTML = Array.from({length:total},(_,i) =>
    '<div class="ft-progress-pip '+(i<state.ftCurrentQ?'done':i===state.ftCurrentQ?'active':'')+'"></div>'
  ).join('');
  document.getElementById('ft-question-area').innerHTML =
    '<div class="ft-question"><div class="ft-question-label">'+q.q+'</div><div class="ft-options">'
    +q.options.map(opt =>
      '<button class="ft-option'+(state.ftAnswers[state.ftCurrentQ]===opt.value?' selected':'')+'" data-ftval="'+opt.value+'">'+opt.label+'</button>'
    ).join('')+'</div></div>';
  document.getElementById('ft-prev-btn').style.display = state.ftCurrentQ>0?'block':'none';
  document.getElementById('ft-next-btn').textContent = state.ftCurrentQ===total-1?'See Recommendations':'Next →';
  document.getElementById('ft-next-btn').onclick = ftNext;
}
function selectFTAnswer(value, btn) {
  state.ftAnswers[state.ftCurrentQ] = value;
  btn.closest('.ft-options').querySelectorAll('.ft-option').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

// First-timer answer button delegation. Same one-handler pattern from the
// original set-the-stage.html (the only delegation needed here).
document.addEventListener('click', e => {
  const ftBtn = e.target.closest('[data-ftval]');
  if (ftBtn) { selectFTAnswer(ftBtn.dataset.ftval, ftBtn); return; }
});