// engine/apply_class_variant_enrichment.js
//
// Phase 9 / Session 24 — injects new variants into DRINK_CLASS_DEFAULT
// in engine/drink_x_food_generator.js. Targets the bridge1Variants /
// bridge2Variants array literals inside each class entry and appends
// the new phrases before the closing bracket.

'use strict';
const fs = require('fs');
const path = require('path');
const { CLASS_ENRICHMENT } = require('./class_variant_enrichment');

const GEN_FILE = path.join(__dirname, 'drink_x_food_generator.js');
const SANDBOX = '/sessions/adoring-serene-dijkstra/mnt/outputs/drink_x_food_generator.enriched.js';

let src = fs.readFileSync(GEN_FILE, 'utf8');
const results = [];

for (const [cls, payload] of Object.entries(CLASS_ENRICHMENT)) {
  // Find the class block (between the class name and the next class or end).
  // Then locate bridge1Variants and bridge2Variants array literals INSIDE.
  const classBlockRx = new RegExp(
    "(  " + cls + ": \\{[\\s\\S]*?(?:verdictHook|verdict_hook):)",
    'm'
  );
  const blockMatch = src.match(classBlockRx);
  if (!blockMatch) { results.push({ cls, status: 'BLOCK NOT FOUND' }); continue; }
  const blockStart = blockMatch.index;
  const blockEnd = blockStart + blockMatch[0].length;
  let block = src.slice(blockStart, blockEnd);

  // Inject into bridge1Variants
  const b1Rx = /(bridge1Variants:\s*\[[\s\S]*?)(\n\s*\])/;
  const b1m = block.match(b1Rx);
  if (b1m) {
    const indent = '      '; // standard inner-array indent
    const newEntries = payload.bridge1_add
      .map(s => indent + "'" + s.replace(/'/g, "\\'") + "',")
      .join('\n');
    block = block.replace(b1Rx, b1m[1] + ',\n' + newEntries + b1m[2]);
  } else {
    results.push({ cls, status: 'bridge1Variants not found' });
    continue;
  }

  // Inject into bridge2Variants
  const b2Rx = /(bridge2Variants:\s*\[[\s\S]*?)(\n\s*\])/;
  const b2m = block.match(b2Rx);
  if (b2m) {
    const indent = '      ';
    const newEntries = payload.bridge2_add
      .map(s => indent + "'" + s.replace(/'/g, "\\'") + "',")
      .join('\n');
    block = block.replace(b2Rx, b2m[1] + ',\n' + newEntries + b2m[2]);
  } else {
    results.push({ cls, status: 'bridge2Variants not found' });
    continue;
  }

  src = src.slice(0, blockStart) + block + src.slice(blockEnd);
  results.push({
    cls,
    status: 'OK',
    addedB1: payload.bridge1_add.length,
    addedB2: payload.bridge2_add.length,
  });
}

fs.writeFileSync(SANDBOX, src);
console.log('=== CLASS VARIANT ENRICHMENT ===');
for (const r of results) {
  if (r.status === 'OK') {
    console.log('  ' + r.cls.padEnd(15) + ' OK  +' + r.addedB1 + ' b1, +' + r.addedB2 + ' b2');
  } else {
    console.log('  ' + r.cls.padEnd(15) + ' [' + r.status + ']');
  }
}
console.log('\nWrote enriched module to sandbox: ' + SANDBOX);
console.log('Next: cp ' + SANDBOX + ' engine/drink_x_food_generator.js');
