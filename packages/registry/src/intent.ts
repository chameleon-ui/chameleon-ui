import { registry as bundledRegistry, type RegistryItem } from './catalog.js';

export interface IntentMatch {
  field: 'dataAi.intents' | 'purpose' | 'scenarios' | 'name' | 'id';
  token: string;
  value: string;
}

export interface IntentSearchResult {
  item: RegistryItem;
  score: number;
  matched: IntentMatch[];
}

interface ContractDataAi {
  role?: string;
  states?: string[];
  intents?: string[];
}

interface ContractDoc {
  purpose?: string;
  scenarios?: string[];
  dataAi?: ContractDataAi;
}

function contractOf(item: RegistryItem): ContractDoc | undefined {
  const file = item.files.find((entry) => entry.path.endsWith('/contract.json'));
  if (!file) return undefined;
  try {
    return JSON.parse(file.content) as ContractDoc;
  } catch {
    return undefined;
  }
}

function tokenize(intent: string): string[] {
  return intent
    .toLowerCase()
    .split(/[^a-z0-9-]+/i)
    .filter((token) => token.length >= 2);
}

/**
 * Search registry components by user intent.
 *
 * Intent terms are matched against the A1 contract fields (dataAi.intents,
 * purpose, scenarios) extracted from the contract.json bundled inside each
 * registry item. Scoring is a deterministic point sum so results are
 * reproducible and explainable (轨道卡 A2: 结果可解释、固定测试集可复现).
 *
 * @complexity time O(r * (t + c)) | space O(r) | r = registry items, t = query tokens, c = contract fields
 * @guarantees deterministic order: score desc, then id asc
 */
export function searchByIntent(
  intent: string,
  items: RegistryItem[] = bundledRegistry,
): IntentSearchResult[] {
  const tokens = tokenize(intent);
  if (tokens.length === 0) return [];

  const results: IntentSearchResult[] = [];
  for (const item of items) {
    if (item.type !== 'registry:ui') continue;
    const matched: IntentMatch[] = [];
    let score = 0;

    const contract = contractOf(item);
    const contractIntents = contract?.dataAi?.intents ?? [];

    for (const token of tokens) {
      for (const registered of contractIntents) {
        if (registered === token) {
          score += 100;
          matched.push({ field: 'dataAi.intents', token, value: registered });
        } else if (registered.includes(token) || token.includes(registered)) {
          score += 40;
          matched.push({ field: 'dataAi.intents', token, value: registered });
        }
      }

      if (contract?.purpose?.toLowerCase().includes(token)) {
        score += 10;
        matched.push({ field: 'purpose', token, value: contract.purpose });
      }
      for (const scenario of contract?.scenarios ?? []) {
        if (scenario.toLowerCase().includes(token)) {
          score += 8;
          matched.push({ field: 'scenarios', token, value: scenario });
        }
      }
      if (item.name.toLowerCase().includes(token)) {
        score += 5;
        matched.push({ field: 'name', token, value: item.name });
      }
      if (item.id.toLowerCase().includes(token)) {
        score += 4;
        matched.push({ field: 'id', token, value: item.id });
      }
    }

    if (score > 0) {
      results.push({ item, score, matched });
    }
  }

  return results.sort(
    (left, right) => right.score - left.score || left.item.id.localeCompare(right.item.id, 'en'),
  );
}
