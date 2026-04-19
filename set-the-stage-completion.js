// set-the-stage-completion.js
// Continuation of set-the-stage.html inline script

function ftNext() {
  if (!state.ftAnswers[state.ftCurrentQ]) {
    state.ftAnswers[state.ftCurrentQ] = 'none';
  }
  if (state.ftCurrentQ < ftQuestions.length - 1) {
    state.ftCurrentQ++;
    renderFTQuestion();
  } else {
    renderFTRecs();
  }
}

function ftPrev() {
  if (state.ftCurrentQ > 0) {
    state.ftCurrentQ--;
    renderFTQuestion();
  }
}

function renderFTRecs() {
  const answers = state.ftAnswers.filter(a => a && a !== 'none');
  const recs = getFirstTimerRecommendations(answers);

  document.getElementById('ft-recs-area').style.display = 'block';
  document.getElementById('ft-recs-count').textContent = ' — ' + recs.length + ' suggestions';

  // Mark all progress pips done
  const total = ftQuestions.length;
  let pipHtml = '';
  for (let i = 0; i < total; i++) pipHtml += '<div class="ft-progress-pip done"></div>';
  document.getElementById('ft-progress').innerHTML = pipHtml;

  // Switch next button to restart
  const nextBtn = document.getElementById('ft-next-btn');
  nextBtn.textContent = 'Restart';
  nextBtn.onclick = function() {
    state.ftAnswers = [];
    state.ftCurrentQ = 0;
    document.getElementById('ft-recs-area').style.display = 'none';
    nextBtn.onclick = ftNext;
    renderFTQuestion();
  };
  document.getElementById('ft-prev-btn').style.display = 'none';

  if (!recs.length) {
    document.getElementById('ft-recs-content').innerHTML =
      '<div class="empty-state">Not enough information. Try answering more questions.</div>';
    document.getElementById('ft-recs-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const maxScore = recs[0].overlapScore || 1;
  const groups = {};
  for (const rec of recs.slice(0, 30)) {
    if (!groups[rec.category]) groups[rec.category] = [];
    groups[rec.category].push(rec);
  }

  let html = '';
  for (const cat of CATEGORY_ORDER) {
    if (!groups[cat]) continue;
    html += '<div class="rec-category-group"><div class="rec-cat-label">' + getCategoryForDisplay(cat) + '</div>';
    for (const rec of groups[cat]) {
      const tier = rec.overlapScore >= maxScore * 0.75 ? 'excellent'
                 : rec.overlapScore >= maxScore * 0.4  ? 'strong' : 'works';
      const meta = rec.price || '';
      html += '<div class="rec-item">'
            + '<div class="tier-pip ' + tier + '"></div>'
            + '<div class="rec-info"><div class="rec-name">' + rec.name + '</div>'
            + (meta ? '<div class="rec-meta">' + meta + '</div>' : '')
            + '</div><div class="tier-badge ' + tier + '">' + tier + '</div></div>';
    }
    html += '</div>';
  }

  document.getElementById('ft-recs-content').innerHTML = html;
  document.getElementById('ft-recs-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── RESET ────────────────────────────────────────────────────────────────────

function confirmReset() {
  resetSession();
}

function resetSession() {
  state.path = null;
  state.guestCount = 1;
  state.activeGuest = 0;
  state.activeView = 'guest';
  state.guests = [];
  state.specials = [];
  state.ftDepth = 'short';
  state.ftAnswers = [];
  state.ftCurrentQ = 0;

  // Remove dynamically added specials from PAIRING_MAP
  for (let i = PAIRING_MAP.length - 1; i >= 0; i--) {
    if (PAIRING_MAP[i].special) PAIRING_MAP.splice(i, 1);
  }

  document.getElementById('guest-tab-bar').classList.remove('visible');
  document.getElementById('guest-count-display').textContent = '1';
  document.getElementById('ft-recs-area').style.display = 'none';
  document.getElementById('ft-short-btn').classList.add('active');
  document.getElementById('ft-deep-btn').classList.remove('active');
  document.getElementById('ft-question-area').innerHTML = '';
  document.getElementById('ft-progress').innerHTML = '';

  try { localStorage.removeItem('sts_session'); } catch(e) {}
  showScreen('screen-path');
}

// ── RESTORE SESSION ──────────────────────────────────────────────────────────

function restoreSession() {
  if (!loadState()) return;

  if (state.path === 'firsttimer') {
    ftQuestions = state.ftDepth === 'deep' ? FT_QUESTIONS_DEEP : FT_QUESTIONS_SHORT;
    document.getElementById('ft-short-btn').classList.toggle('active', state.ftDepth === 'short');
    document.getElementById('ft-deep-btn').classList.toggle('active', state.ftDepth === 'deep');
    showScreen('screen-firsttimer');
    renderFTQuestion();
    if (state.ftAnswers.length >= ftQuestions.length) renderFTRecs();
    return;
  }

  if (state.guests && state.guests.length > 0) {
    document.getElementById('guest-count-display').textContent = state.guestCount;

    // Rebuild specials in PAIRING_MAP
    for (const s of state.specials || []) {
      const exists = PAIRING_MAP.find(e => e.name === s.name && e.special);
      if (!exists) {
        const entry = {
          name: s.name, category: s.category, profile: s.profile || [],
          excellent: [], strong: [], works: [], avoid: [], special: true
        };
        for (const e of PAIRING_MAP) {
          if (e.variable || e.oos) continue;
          const overlap = e.profile.filter(p => (s.profile || []).includes(p)).length;
          if (overlap >= 2) entry.excellent.push(e.name);
          else if (overlap === 1) entry.strong.push(e.name);
        }
        PAIRING_MAP.push(entry);
      }
    }

    buildGuestTabs();
    document.getElementById('guest-tab-bar').classList.add('visible');

    if (state.activeView === 'table') {
      showScreen('screen-table');
      renderTableView();
    } else {
      showScreen('screen-session');
      updateSessionHeading();
      renderSelected();
      renderRecs();
    }
  }
}

// ── INIT ─────────────────────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', function() {
  restoreSession();
});