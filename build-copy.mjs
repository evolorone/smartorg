#!/usr/bin/env node
// build-copy.mjs — inject copy from COPY.md into the funnel HTML pages.
//
// How it works:
//   - COPY.md is the single source of truth for editable copy.
//   - Each editable string lives under a `### page.section.field` heading in COPY.md.
//   - In the HTML, the matching element carries data-copy="page.section.field".
//   - This script reads COPY.md and rewrites the inner text of every data-copy element.
//
// Usage:
//   node build-copy.mjs          # inject COPY.md into the HTML pages
//   node build-copy.mjs --check  # report mismatches, write nothing (exit 1 if any)
//
// Markdown you can use inside a field: **bold**, [text](url). Everything else is
// treated as plain text and HTML-escaped. Keep each field to one block of prose.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const COPY_FILE = path.join(ROOT, 'COPY.md');
const CHECK = process.argv.includes('--check');

// Pages the copy system manages. Add a page here after instrumenting it.
const PAGES = [
  'index.html',
  'instant-blueprint.html',
  'case-study-evolor.html',
  'donor-file-health-check.html',
  'ai-readiness-scorecard.html',
  'grantmakers.html',
];

function parseCopy(md) {
  const map = {};
  let key = null;
  let buf = [];
  const flush = () => { if (key) map[key] = buf.join('\n').trim(); buf = []; };
  for (const raw of md.split('\n')) {
    const m = raw.match(/^###\s+`?([A-Za-z0-9_.\-]+)`?\s*$/);
    if (m) { flush(); key = m[1]; continue; }
    if (/^#{1,2}\s/.test(raw)) { flush(); key = null; continue; }
    if (raw.trim().startsWith('<!--')) continue; // allow HTML comments as notes
    if (key !== null) buf.push(raw);
  }
  flush();
  return map;
}

function renderInline(text) {
  let t = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/\s*\n\s*/g, ' ').replace(/[ \t]{2,}/g, ' ').trim();
  return t;
}

const copy = parseCopy(fs.readFileSync(COPY_FILE, 'utf8'));
const usedKeys = new Set();
let totalInjected = 0;
const missingInHtml = {}; // key present in HTML, absent in COPY.md
let changedFiles = 0;

for (const page of PAGES) {
  const file = path.join(ROOT, page);
  if (!fs.existsSync(file)) { console.warn(`! skip (not found): ${page}`); continue; }
  const before = fs.readFileSync(file, 'utf8');
  let injected = 0;
  const after = before.replace(
    /<([a-zA-Z0-9]+)((?:[^>]*?)\sdata-copy="([^"]+)"(?:[^>]*?))>([\s\S]*?)<\/\1>/g,
    (full, tag, attrs, key, inner) => {
      if (!(key in copy)) { (missingInHtml[page] ??= []).push(key); return full; }
      usedKeys.add(key);
      injected++;
      return `<${tag}${attrs}>${renderInline(copy[key])}</${tag}>`;
    }
  );
  totalInjected += injected;
  if (after !== before) {
    changedFiles++;
    if (!CHECK) fs.writeFileSync(file, after);
  }
  console.log(`${CHECK ? 'check' : 'build'} ${page}: ${injected} fields`);
}

const orphanMd = Object.keys(copy).filter(k => !usedKeys.has(k));
let problems = 0;
for (const [page, keys] of Object.entries(missingInHtml)) {
  problems += keys.length;
  console.error(`\n✗ ${page}: data-copy keys with no entry in COPY.md:\n   ${[...new Set(keys)].join('\n   ')}`);
}
if (orphanMd.length) {
  console.warn(`\n! COPY.md keys not used by any page (ok if intentional):\n   ${orphanMd.join('\n   ')}`);
}

console.log(`\n${CHECK ? 'Checked' : 'Injected'} ${totalInjected} fields across ${PAGES.length} pages. ${changedFiles} file(s) ${CHECK ? 'would change' : 'written'}.`);
if (problems > 0) { console.error(`\n${problems} unmatched key(s). Fix COPY.md.`); process.exit(1); }
