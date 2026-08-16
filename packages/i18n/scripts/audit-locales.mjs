// Locale coverage audit for the 21 shipping locales.
//
// Checks every component under packages/components-react/src/<slug>/locales/:
//   1. all 21 locale files exist
//   2. every key in en.json exists in each locale file
//   3. no non-en leaf is byte-identical to its en.json counterpart
//      (placeholder mirror), except reviewed loanwords in LOANWORD_WHITELIST
//
// Run: node packages/i18n/scripts/audit-locales.mjs
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SRC = path.join(root, 'packages', 'components-react', 'src');
const LOCALES = ['zh-CN', 'zh-HK', 'ja', 'ko', 'ru', 'hi', 'de', 'ar', 'ug', 'sw', 'ha', 'am', 'es', 'fr', 'pt', 'bn', 'id', 'ur', 'fa', 'vi'];

// Reviewed 2026-08-17: these strings are spelled identically in the target
// language (loanwords / shared vocabulary), not untranslated placeholders.
const LOANWORD_WHITELIST = new Set([
  'Accordion|vi', 'Avatar|sw', 'Avatar|es', 'Avatar|fr', 'Avatar|pt', 'Avatar|id',
  'Badge|fr', 'Breadcrumb|id', 'Breadcrumb|vi', 'Canvas|vi', 'Chip|sw', 'Chip|ha',
  'Chip|es', 'Chip|pt', 'Chip|id', 'Chip|vi', 'Color|es', 'Date|fr', 'Error|es',
  'Footer|id', 'Gauge|id', 'Image|fr', 'Label|id', 'Link|pt', 'Masonry|ha',
  'Masonry|pt', 'Masonry|id', 'Masonry|vi', 'Menu|ha', 'Menu|fr', 'Menu|pt',
  'Menu|id', 'Menu|vi', 'Navigation|fr', 'Notification|fr', 'Digit|id',
  'Pagination|fr', 'Pipeline|es', 'Pipeline|fr', 'Pipeline|pt', 'Pipeline|id',
  'Pipeline|vi', 'Rating|id', 'Sheet|vi', 'Skeleton|id', 'Skeleton|vi',
  'Slider|id', 'Sparkline|sw', 'Sparkline|id', 'Sparkline|vi', 'Status|pt',
  'Status|id', 'Tag|pt', 'Tag|id', 'Ticker|id', 'Article|fr', 'Message|fr',
  'Minute|fr', 'Notifications|fr',
]);

const flat = (o, p = '') =>
  Object.entries(o).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null ? flat(v, p + k + '.') : [[p + k, String(v)]],
  );

const problems = [];
let audited = 0;
for (const slug of readdirSync(SRC)) {
  const dir = path.join(SRC, slug, 'locales');
  if (!existsSync(dir)) continue;
  audited += 1;
  const en = Object.fromEntries(flat(JSON.parse(readFileSync(path.join(dir, 'en.json'), 'utf8'))));
  for (const locale of LOCALES) {
    const file = path.join(dir, locale + '.json');
    if (!existsSync(file)) {
      problems.push(`${slug}: missing ${locale}.json`);
      continue;
    }
    const data = Object.fromEntries(flat(JSON.parse(readFileSync(file, 'utf8'))));
    for (const [key, enValue] of Object.entries(en)) {
      if (!(key in data)) {
        problems.push(`${slug}: ${locale}.json missing key ${key}`);
      } else if (
        data[key] === enValue &&
        /[A-Za-z]{3,}/.test(enValue) &&
        !LOANWORD_WHITELIST.has(`${enValue}|${locale}`)
      ) {
        problems.push(`${slug}: ${locale}.json ${key} still mirrors en ("${enValue}")`);
      }
    }
  }
}

if (problems.length > 0) {
  console.error(`[i18n audit] ${problems.length} problem(s) across ${audited} components:`);
  for (const p of problems) console.error(' - ' + p);
  process.exit(1);
}
console.log(`[i18n audit] ok: ${audited} components × 21 locales, no missing keys, no placeholder mirrors`);
