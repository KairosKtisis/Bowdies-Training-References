// engine/apply_fxf_editorial.js (v2 — sandbox-protected)
//
// Phase 4 — applies hand-curated FxF editorial to pairing-notes.js.
//
// v2 change: writes the modified corpus to a sandbox path first, then a
// separate bash step atomically copies it back into the OneDrive folder.
// Avoids the timeout-during-sync corruption observed when writing 15MB
// directly to the synced folder.
//
// USAGE:
//   node engine/apply_fxf_editorial.js <module-path>            # dry-run
//   node engine/apply_fxf_editorial.js <module-path> --commit   # produces sandbox file
//
// After --commit: a separate bash `cp` step moves the file into place.

'use strict';

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ARGS = process.argv.slice(2);
const MODULE_PATH = ARGS.find(a => !a.startsWith('--'));
if (!MODULE_PATH) {
  console.error('USAGE: node engine/apply_fxf_editorial.js <module-path> [--commit]');
  process.exit(1);
}
const COMMIT = ARGS.includes('--commit');

const repoRoot = path.resolve(__dirname, '..');
const SANDBOX_OUTPUT = '/sessions/adoring-serene-dijkstra/mnt/outputs/pairing-notes.new.js';

const editorialMod = require(path.resolve(repoRoot, MODULE_PATH));
const editorial = Object.values(editorialMod)[0];
if (!editorial || typeof editorial !== 'object') {
  console.error('ERROR: module must export an object of pair-key → text entries');
  process.exit(1);
}

const ctx = { console };
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(path.join(repoRoot, 'pairing-notes.js'), 'utf8') + '\nthis.PAIRING_NOTES = PAIRING_NOTES;',
  ctx
);
const PAIRING_NOTES = ctx.PAIRING_NOTES;

const changes = new Map();
const missing = [];
for (const [key, after] of Object.entries(editorial)) {
  const [a, b] = key.split('|');
  for (const k of [key, b + '|' + a]) {
    const before = PAIRING_NOTES[k];
    if (!before) { missing.push(k); continue; }
    if (before !== after) changes.set(k, { before, after });
  }
}

console.log('=== APPLY FxF EDITORIAL v2 — ' + (COMMIT ? 'COMMIT' : 'DRY-RUN') + ' ===');
console.log('Editorial entries:    ' + Object.keys(editorial).length);
console.log('Pairs to update:      ' + changes.size + ' (' + (changes.size / 2) + ' canonical + mirror)');
console.log('Missing in corpus:    ' + missing.length);
console.log('');

const diffPath = path.join(__dirname, 'apply_fxf_diff.txt');
const diff = [];
diff.push('=== APPLY FxF EDITORIAL — SAMPLE DIFF ===');
diff.push('Run mode: ' + (COMMIT ? 'COMMIT' : 'DRY-RUN'));
diff.push('Generated: ' + new Date().toISOString());
diff.push('Total changes: ' + changes.size);
diff.push('');
const seen = new Set();
for (const [key, { before, after }] of changes) {
  const [a, b] = key.split('|');
  const canonical = [a, b].sort().join('|');
  if (seen.has(canonical)) continue;
  seen.add(canonical);
  diff.push('[' + a + ' × ' + b + ']');
  diff.push('  BEFORE: ' + before);
  diff.push('  AFTER:  ' + after);
  diff.push('');
}
fs.writeFileSync(diffPath, diff.join('\n'));
console.log('Diff written to: engine/apply_fxf_diff.txt');

if (!COMMIT) {
  console.log('');
  console.log('DRY-RUN complete.');
  process.exit(0);
}

// ── COMMIT — write to sandbox, NOT the OneDrive folder ─────────────────
console.log('');
console.log('COMMIT mode — writing modified corpus to sandbox: ' + SANDBOX_OUTPUT);
const t0 = Date.now();

const src = fs.readFileSync(path.join(repoRoot, 'pairing-notes.js'), 'utf8');
const LINE_RX = /^(  ")([^"]+(?:\\.[^"]*)*)("\s*:\s*)("(?:[^"\\]|\\.)*")(,?\s*)$/gm;

let replaceCount = 0;
const out = src.replace(LINE_RX, (match, indent, key, sep, valQuoted, trail) => {
  const change = changes.get(key);
  if (!change) return match;
  const newVal = JSON.stringify(change.after);
  replaceCount++;
  return indent + key + sep + newVal + trail;
});

console.log('Replaced: ' + replaceCount + ' / ' + changes.size + ' expected');
fs.writeFileSync(SANDBOX_OUTPUT, out);
const written = fs.statSync(SANDBOX_OUTPUT).size;
console.log('Wrote ' + written + ' bytes to sandbox in ' + (Date.now() - t0) + 'ms');
console.log('');
console.log('NEXT STEPS (run these in bash):');
console.log('  1. Backup current corpus:');
console.log('     cp pairing-notes.js pairing-notes.js.pre-fxf-editorial-{timestamp}.bak');
console.log('  2. Atomic copy from sandbox:');
console.log('     cp ' + SANDBOX_OUTPUT + ' pairing-notes.js');
console.log('  3. Verify size:');
console.log('     wc -c pairing-notes.js   # expect ' + written + ' bytes');
console.log('  4. Health check + mirror sync');
