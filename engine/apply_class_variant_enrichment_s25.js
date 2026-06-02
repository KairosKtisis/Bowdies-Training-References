'use strict';
const fs = require('fs');
const path = require('path');
const { CLASS_ENRICHMENT } = require('./class_variant_enrichment_s25');

const GEN_FILE = path.join(__dirname, 'drink_x_food_generator.js');
const SANDBOX = '/sessions/adoring-serene-dijkstra/mnt/outputs/drink_x_food_generator.s25.js';

let src = fs.readFileSync(GEN_FILE, 'utf8');
const results = [];

for (const [cls, payload] of Object.entries(CLASS_ENRICHMENT)) {
  const classBlockRx = new RegExp(
    "(  " + cls + ": \\{[\\s\\S]*?(?:verdictHook|verdict_hook):)",
    'm'
  );
  const blockMatch = src.match(classBlockRx);
  if (!blockMatch) { results.push({ cls, status: 'BLOCK NOT FOUND' }); continue; }
  const blockStart = blockMatch.index;
  const blockEnd = blockStart + blockMatch[0].length;
  let block = src.slice(blockStart, blockEnd);

  const b1Rx = /(bridge1Variants:\s*\[[\s\S]*?)(\n\s*\])/;
  const b1m = block.match(b1Rx);
  if (b1m) {
    const indent = '      ';
    const newEntries = payload.bridge1_add
      .map(s => indent + "'" + s.replace(/'/g, "\\'") + "',")
      .join('\n');
    block = block.replace(b1Rx, b1m[1] + ',\n' + newEntries + b1m[2]);
  } else { results.push({ cls, status: 'bridge1Variants not found' }); continue; }

  const b2Rx = /(bridge2Variants:\s*\[[\s\S]*?)(\n\s*\])/;
  const b2m = block.match(b2Rx);
  if (b2m) {
    const indent = '      ';
    const newEntries = payload.bridge2_add
      .map(s => indent + "'" + s.replace(/'/g, "\\'") + "',")
      .join('\n');
    block = block.replace(b2Rx, b2m[1] + ',\n' + newEntries + b2m[2]);
  } else { results.push({ cls, status: 'bridge2Variants not found' }); continue; }

  src = src.slice(0, blockStart) + block + src.slice(blockEnd);
  results.push({ cls, status: 'OK', addedB1: payload.bridge1_add.length, addedB2: payload.bridge2_add.length });
}

fs.writeFileSync(SANDBOX, src);
console.log('=== S25 CLASS ENRICHMENT ===');
for (const r of results) {
  if (r.status === 'OK') console.log('  ' + r.cls.padEnd(18) + ' OK  +' + r.addedB1 + ' b1, +' + r.addedB2 + ' b2');
  else console.log('  ' + r.cls.padEnd(18) + ' [' + r.status + ']');
}
console.log('\nWrote: ' + SANDBOX);
