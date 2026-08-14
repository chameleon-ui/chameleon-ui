import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { searchByIntent } from '../intent.js';

interface FixtureCase {
  intent: string;
  expectFirst: string;
  expectInTop3: string[];
}

const fixtures = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '../../test-fixtures/intent-search.fixtures.json'),
    'utf8',
  ),
) as { version: string; cases: FixtureCase[] };

describe('A2 search-by-intent (frozen test set)', () => {
  it('returns the expected slugs for every frozen intent', () => {
    for (const fixture of fixtures.cases) {
      const hits = searchByIntent(fixture.intent);
      expect(hits.length, `intent "${fixture.intent}" returned no hits`).toBeGreaterThan(0);
      expect(hits[0]?.item.id, `intent "${fixture.intent}" top hit`).toBe(fixture.expectFirst);
      const top3 = hits.slice(0, 3).map((hit) => hit.item.id);
      for (const slug of fixture.expectInTop3) {
        expect(top3, `intent "${fixture.intent}" top3 missing ${slug}`).toContain(slug);
      }
    }
  });

  it('is reproducible: two runs over the same registry return identical results', () => {
    for (const fixture of fixtures.cases) {
      const first = searchByIntent(fixture.intent).map((hit) => [hit.item.id, hit.score]);
      const second = searchByIntent(fixture.intent).map((hit) => [hit.item.id, hit.score]);
      expect(second).toEqual(first);
    }
  });

  it('explains every hit with matched contract fields', () => {
    for (const fixture of fixtures.cases) {
      const hits = searchByIntent(fixture.intent);
      for (const hit of hits) {
        expect(hit.matched.length).toBeGreaterThan(0);
        for (const match of hit.matched) {
          expect(['dataAi.intents', 'purpose', 'scenarios', 'name', 'id']).toContain(match.field);
        }
      }
    }
  });

  it('returns no results for empty or tokenless intents', () => {
    expect(searchByIntent('')).toEqual([]);
    expect(searchByIntent('?!')).toEqual([]);
  });
});
