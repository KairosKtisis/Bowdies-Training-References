// set-the-stage-auth.js — v4
//
// Device-identity layer. One-time setup per device, two-tier role:
//   - Enter your name (used as the savedBy stamp on every admin action).
//   - Enter the SHARED MANAGEMENT CODE to unlock admin tools (86 toggle, etc.)
//     OR leave blank to continue as staff (name-only, no admin surface).
//
// The management code is hardcoded in this file as a SHA-256 hash so a casual
// devtools peek doesn't reveal it. The actual code is shared verbally with
// management staff. Anyone who clears localStorage can re-enter as staff or
// re-enter the code to re-promote — no central server, no recovery flow needed.
//
// This is a soft gate, not a secure vault: anyone with dev tools can set
// `authState.profile.role = 'management'` and grant themselves admin. Its
// job is to (a) attach a real name to admin writes for attribution, and
// (b) put friction in front of admin tools so a server doesn't 86 a steak
// by accident.

const AUTH_PROFILE_KEY = 'sts_device_profile_v2';   // { name, role, createdAt }
const AUTH_MIN_CODE    = 6;
const AUTH_CODE_SALT   = 'bowdies-sts-device';

// SHA-256 of `${AUTH_CODE_SALT}:rapid72396`.
// To rotate: pick a new code (>= AUTH_MIN_CODE chars), regenerate the hash with:
//   node -e "const c=require('crypto');console.log(c.createHash('sha256').update('bowdies-sts-device:NEWCODE').digest('hex'))"
// then paste the result here. Devices already configured stay logged in;
// only re-promotion to management requires the new code.
const AUTH_MGMT_HASH   = '50f6067ad2ae1be4fa3fe5fe487df8e5689e41dbcf95d3f1898128945a4a62ef';

const ROLE_STAFF       = 'staff';
const ROLE_MANAGEMENT  = 'management';

const authState = { profile: null };

// ── HASH ─────────────────────────────────────────────────────────────────────

async function authSha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function authVerifyMgmtCode(code) {
  if (!code) return false;
  const h = await authSha256(AUTH_CODE_SALT + ':' + code);
  return h === AUTH_MGMT_HASH;
}

// ── PERSISTENCE ──────────────────────────────────────────────────────────────

function authLoadProfile() {
  try {
    const raw = localStorage.getItem(AUTH_PROFILE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    // Backstop: any older profile shape without a role gets coerced to staff.
    if (parsed && !parsed.role) parsed.role = ROLE_STAFF;
    authState.profile = parsed;
  } catch (e) { authState.profile = null; }
  return authState.profile;
}

function authPersistProfile() {
  try {
    if (authState.profile) localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(authState.profile));
    else localStorage.removeItem(AUTH_PROFILE_KEY);
  } catch (e) {}
}

// ── SETUP (one-time) ─────────────────────────────────────────────────────────

async function authHandleSetup() {
  const name = (document.getElementById('setup-name').value || '').trim();
  const code = (document.getElementById('setup-code').value || '').trim();
  authClearError('setup');

  if (!name) return authShowError('setup', 'Please enter your name.');

  // Code is optional. Blank = staff. Filled = must verify.
  let role = ROLE_STAFF;
  if (code) {
    if (code.length < AUTH_MIN_CODE) {
      return authShowError('setup', 'Management code is at least ' + AUTH_MIN_CODE + ' characters. Leave blank to continue as staff.');
    }
    const ok = await authVerifyMgmtCode(code);
    if (!ok) {
      return authShowError('setup', 'Invalid management code. Leave blank to continue as staff.');
    }
    role = ROLE_MANAGEMENT;
  }

  authState.profile = { name, role, createdAt: Date.now() };
  authPersistProfile();

  // Clear inputs so nothing leaks back if the gate ever re-appears.
  document.getElementById('setup-name').value = '';
  document.getElementById('setup-code').value = '';

  authHideGate();
  // Now the user lands on the home screen — apply the scroll lock that
  // bootIndex skipped while the gate was up.
  document.body.classList.add('scroll-locked');
  if (typeof window.authOnLoginComplete === 'function') window.authOnLoginComplete();
}

// ── RESET (simple confirm) ───────────────────────────────────────────────────
// Reset just wipes this device's identity. The actual gate is re-setup —
// a staff person can reset and re-enter the management code to re-promote
// only if they've been given the code. No code-on-reset means we don't
// need to make staff memorize anything.

function authPromptReset() {
  authHideProfileMenu();
  document.getElementById('reset-device-modal').classList.add('open');
}

function authCancelReset() {
  document.getElementById('reset-device-modal').classList.remove('open');
}

function authHandleReset() {
  authState.profile = null;
  try { localStorage.removeItem(AUTH_PROFILE_KEY); } catch (e) {}
  document.getElementById('reset-device-modal').classList.remove('open');
  authUpdateChip();
  authShowGate();
}

// ── UI CONTROL ───────────────────────────────────────────────────────────────

function authShowGate() {
  // Close any in-app sheets/modals so the gate is the only thing on screen.
  document.querySelectorAll('.modal-overlay.open').forEach(m => {
    if (m.id !== 'reset-device-modal') m.classList.remove('open');
  });
  const seatSheet = document.getElementById('seat-sheet');
  if (seatSheet) seatSheet.classList.remove('open');

  document.getElementById('setup-gate').classList.add('visible');
  authClearError('setup');
  // Small defer so iOS focuses reliably after the gate renders.
  setTimeout(() => {
    const n = document.getElementById('setup-name');
    if (n) n.focus();
  }, 50);
}

function authHideGate() {
  document.getElementById('setup-gate').classList.remove('visible');
  authUpdateChip();
}

function authShowError(which, msg) {
  const el = document.getElementById(which + '-error');
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
}

function authClearError(which) {
  const el = document.getElementById(which + '-error');
  if (!el) return;
  el.textContent = '';
  el.hidden = true;
}

function authRoleLabel(role) {
  return role === ROLE_MANAGEMENT ? 'Management' : 'Staff';
}

function authUpdateChip() {
  const chip = document.getElementById('top-bar-profile');
  if (!chip) return;
  if (!authState.profile) { chip.hidden = true; return; }
  chip.hidden = false;
  const firstName = (authState.profile.name || '').split(/\s+/)[0] || authState.profile.name;
  const nameEl = document.getElementById('top-bar-profile-name');
  if (nameEl) nameEl.textContent = firstName;
  const roleEl = document.getElementById('top-bar-profile-role');
  if (roleEl) roleEl.textContent = authRoleLabel(authState.profile.role);
  // Hide/show the Admin button in the dropdown based on role.
  const adminBtn = document.getElementById('top-bar-profile-admin-btn');
  if (adminBtn) adminBtn.style.display = (authState.profile.role === ROLE_MANAGEMENT) ? '' : 'none';
}

function authToggleProfileMenu() {
  const menu = document.getElementById('top-bar-profile-menu');
  if (!menu) return;
  if (menu.classList.contains('open')) { authHideProfileMenu(); return; }
  if (!authState.profile) return;
  const nameEl = document.getElementById('top-bar-profile-menu-name');
  if (nameEl) nameEl.textContent = authState.profile.name + ' \u00b7 ' + authRoleLabel(authState.profile.role);
  // Re-sync the admin button visibility every time the menu opens.
  const adminBtn = document.getElementById('top-bar-profile-admin-btn');
  if (adminBtn) adminBtn.style.display = (authState.profile.role === ROLE_MANAGEMENT) ? '' : 'none';
  menu.classList.add('open');
  setTimeout(() => {
    document.addEventListener('click', authHideProfileMenuOnOutside, { once: true, capture: true });
  }, 0);
}

function authHideProfileMenu() {
  const menu = document.getElementById('top-bar-profile-menu');
  if (menu) menu.classList.remove('open');
}

function authHideProfileMenuOnOutside(e) {
  const menu = document.getElementById('top-bar-profile-menu');
  const chip = document.getElementById('top-bar-profile');
  if (!menu || !menu.classList.contains('open')) return;
  if (menu.contains(e.target) || (chip && chip.contains(e.target))) {
    // Click was inside — re-arm the dismisser.
    document.addEventListener('click', authHideProfileMenuOnOutside, { once: true, capture: true });
    return;
  }
  authHideProfileMenu();
}

// ── PUBLIC HELPERS (consumed by other modules) ───────────────────────────────

function authIsConfigured() { return !!authState.profile; }
function authIsManagement() { return !!(authState.profile && authState.profile.role === ROLE_MANAGEMENT); }
function authCurrentUser() {
  if (!authState.profile) return null;
  return {
    id: 'device_owner',
    name: authState.profile.name,
    role: authState.profile.role || ROLE_STAFF
  };
}

// ── BOOT ─────────────────────────────────────────────────────────────────────
// Returns true if the device is already configured; caller can proceed with
// normal boot. Returns false if the setup gate has been shown — caller must
// register window.authOnLoginComplete.

function authBoot() {
  // Best-effort cleanup of any prior storage shapes that shipped on this
  // device. v1 was the account-system experiment; v1 of the device profile
  // (sts_device_profile_v1 + sts_device_code_hash_v1) was the per-device
  // code model. Wiping these means a returning user just hits setup once.
  try {
    localStorage.removeItem('sts_accounts_v1');
    localStorage.removeItem('sts_session_v1');
    localStorage.removeItem('sts_mgmt_code_hash_v1');
    localStorage.removeItem('sts_device_profile_v1');
    localStorage.removeItem('sts_device_code_hash_v1');
  } catch (e) {}

  authLoadProfile();
  authUpdateChip();
  if (authState.profile) return true;
  authShowGate();
  return false;
}

if (typeof window !== 'undefined' && typeof window.authOnLoginComplete !== 'function') {
  window.authOnLoginComplete = function () {};
}
