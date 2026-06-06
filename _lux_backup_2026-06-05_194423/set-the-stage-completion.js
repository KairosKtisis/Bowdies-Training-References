// set-the-stage-completion.js — v8
//
// Post-scope-down: the seating simulation and sessions library are gone.
// This file now just owns first-timer rec rendering + boot.

function ftNext() {
  if (!state.ftAnswers[state.ftCurrentQ]) state.ftAnswers[state.ftCurrentQ] = 'none';
  if (state.ftCurrentQ < ftQuestions.length - 1) {
    state.ftCurrentQ++;
    renderFTQuestion();
  } else {
    renderFTRecs();
  }
}

function ftPrev() {
  if (state.ftCurrentQ > 0) { state.ftCurrentQ--; renderFTQuestion(); }
}

function renderFTRecs() {
  const answers = state.ftAnswers.filter(a => a && a !== 'none');
  const recs = getFirstTimerRecommendations(answers);

  document.getElementById('ft-recs-area').style.display = 'block';
  document.getElementById('ft-recs-count').textContent = ' — ' + recs.length + ' suggestions';

  const total = ftQuestions.length;
  document.getElementById('ft-progress').innerHTML =
    Array.from({length:total}, () => '<div class="ft-progress-pip done"></div>').join('');

  const nextBtn = document.getElementById('ft-next-btn');
  nextBtn.textContent = 'Restart';
  nextBtn.onclick = () => {
    state.ftAnswers = []; state.ftCurrentQ = 0;
    document.getElementById('ft-recs-area').style.display = 'none';
    nextBtn.onclick = ftNext;
    renderFTQuestion();
  };
  document.getElementById('ft-prev-btn').style.display = 'none';

  if (!recs.length) {
    document.getElementById('ft-recs-content').innerHTML =
      '<div class="empty-state">Not enough information. Try answering more questions.</div>';
    document.getElementById('ft-recs-area').scrollIntoView({behavior:'smooth',block:'start'});
    return;
  }

  const maxScore = recs[0].overlapScore || 1;
  const groups = {};
  recs.slice(0, 30).forEach(rec => {
    if (!groups[rec.category]) groups[rec.category] = [];
    groups[rec.category].push(rec);
  });

  const CAT_ORDER = ['steak','starter','soup-salad','main','side','dessert','cocktail',
    'wine-sparkling','wine-white','wine-red','wine-dessert','bourbon','rye','scotch','irish',
    'japanese','canadian','tequila','mezcal','vodka','gin','rum','cognac','liqueur','singlemalt'];

  let html = '';
  CAT_ORDER.forEach(cat => {
    if (!groups[cat]) return;
    html += '<div class="rec-group"><div class="rec-group-label">' + getCategoryForDisplay(cat) + '</div>';
    groups[cat].forEach(rec => {
      const tier = rec.overlapScore >= maxScore*0.75 ? 'excellent'
                 : rec.overlapScore >= maxScore*0.4  ? 'strong' : 'works';
      html += '<div class="rec-item"><div class="tier-pip ' + tier + '"></div>'
            + '<div class="rec-info"><div class="rec-name">' + rec.name + '</div>'
            + (rec.price ? '<div class="rec-meta">' + rec.price + '</div>' : '')
            + '</div><div class="tier-badge ' + tier + '">' + tier + '</div></div>';
    });
    html += '</div>';
  });

  document.getElementById('ft-recs-content').innerHTML = html;
  document.getElementById('ft-recs-area').scrollIntoView({behavior:'smooth',block:'start'});
}

// ── BOOT ────────────────────────────────────────────────────────────────────────
// Post-Phase-2: the device setup gate lives on index.html. If this device
// hasn't been configured we bounce there (the gate writes to the shared
// sts_device_profile_v2 key, so returning here afterward just works). If it
// IS configured, we merge specials, apply the OOS overlay, and open the
// pairing browser. No gate UI runs on this page anymore.

function bootStage() {
  // Merge any pre-existing specials (from the old sts_v6 state blob) into
  // PAIRING_MAP so pairing recommendations account for them. This is a
  // one-way read — we don't write back to sts_v6 from this page anymore.
  try {
    const raw = localStorage.getItem('sts_v6');
    if (raw) {
      const prior = JSON.parse(raw);
      (prior.specials || []).forEach(s => {
        if (PAIRING_MAP.find(e => e.name === s.name && e.special)) return;
        const entry = { name: s.name, category: s.category, profile: s.profile || [],
          excellent: [], strong: [], works: [], avoid: [], special: true };
        PAIRING_MAP.forEach(e => {
          if (e.variable || e.oos) return;
          const overlap = e.profile.filter(p => (s.profile || []).includes(p)).length;
          if (overlap >= 2) entry.excellent.push(e.name);
          else if (overlap === 1) entry.strong.push(e.name);
        });
        PAIRING_MAP.push(entry);
      });
    }
  } catch (e) {}

  // Device identity is hydrated for downstream consumers. We used to also
  // redirect unconfigured devices to index.html — that made sense when Set
  // the Stage was its own page (sts.html). After the May 2026 migration the
  // pairing browser lives inside index.html, so `replace('index.html')`
  // from index.html is just a reload — and on DOMContentLoaded it became
  // an infinite loop. The auth gate is now shown by main.js's bootIndex
  // when no profile exists; this script doesn't need to redirect.
  if (typeof authLoadProfile === 'function') authLoadProfile();
  if (typeof authIsConfigured === 'function' && !authIsConfigured()) {
    // No-op. Wait for the user to complete setup in the gate that main.js
    // is already showing. Don't initialize the pairing browser yet.
    return;
  }

  // Apply the OOS overlay now that specials have been merged — this flips
  // `entry.oos = true` on each matching PAIRING_MAP row so the existing rec
  // filters silently exclude them. admin.js provides applyOosOverlay.
  if (typeof applyOosOverlay === 'function') applyOosOverlay();

  // Pairing browser is home. Nothing else to restore.
  if (typeof pbOpen === 'function') {
    pbOpen(null);
  } else {
    showScreen('screen-pairings');
    updateTopBar('screen-pairings');
  }
}

window.addEventListener('DOMContentLoaded', bootStage);
