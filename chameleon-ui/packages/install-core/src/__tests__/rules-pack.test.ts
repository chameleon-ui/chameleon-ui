import { describe, expect, it } from 'vitest';
import {
  assertPaidRulesListingAllowed,
  assertRulesDownloadAuthorized,
  createStubRulesDownloadAuth,
  detectRulesMergeConflicts,
  mergeDesignRules,
  RulesDownloadAuthError,
  RulesListingPolicyError,
  RulesMergeError,
} from '../index';

const baseRules = {
  version: '1.0',
  typography: {
    scale: 'major-third',
    lineHeightBody: 1.5,
  },
  forbiddenPatterns: ['neon-glow'],
  composition: {
    componentRules: {
      Button: { minTouchTargetPx: 44 },
    },
  },
};

describe('rules merge', () => {
  it('unions open-ended lists and deep-merges compatible objects', () => {
    const merged = mergeDesignRules(baseRules, {
      forbiddenPatterns: ['color-only-state'],
      composition: {
        componentRules: {
          Input: { minTouchTargetPx: 44 },
        },
      },
    });
    expect(merged.forbiddenPatterns).toEqual(['neon-glow', 'color-only-state']);
    expect(merged.composition.componentRules).toEqual({
      Button: { minTouchTargetPx: 44 },
      Input: { minTouchTargetPx: 44 },
    });
  });

  it('reports U9-readable conflicts for incompatible scalars', () => {
    expect(() =>
      mergeDesignRules(baseRules, {
        typography: {
          scale: 'minor-second',
          lineHeightBody: 1.5,
        },
      }),
    ).toThrow(RulesMergeError);

    try {
      mergeDesignRules(baseRules, {
        typography: {
          scale: 'minor-second',
          lineHeightBody: 1.5,
        },
      });
    } catch (error) {
      expect(error).toBeInstanceOf(RulesMergeError);
      const mergeError = error as RulesMergeError;
      expect(mergeError.message).toContain('Design rules merge failed.');
      expect(mergeError.message).toContain('Path: typography.scale');
      expect(mergeError.message).toContain('Next:');
      expect(mergeError.conflicts[0]?.path).toBe('typography.scale');
    }
  });

  it('detects conflicts without merging', () => {
    const conflicts = detectRulesMergeConflicts(baseRules, {
      typography: {
        scale: 'minor-second',
        lineHeightBody: 1.5,
      },
    });
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]?.path).toBe('typography.scale');
  });
});

describe('rules paid policy', () => {
  it('blocks official homage ids from paid listings', () => {
    expect(() => assertPaidRulesListingAllowed('line')).toThrow(RulesListingPolicyError);
    expect(() => assertPaidRulesListingAllowed('ant-blue')).toThrow(RulesListingPolicyError);
  });

  it('requires community- prefix for paid community packs', () => {
    expect(() => assertPaidRulesListingAllowed('focus-first')).toThrow(
      RulesListingPolicyError,
    );
    expect(() => assertPaidRulesListingAllowed('community-focus-first')).not.toThrow();
  });
});

describe('rules download auth stub', () => {
  const port = createStubRulesDownloadAuth({ validToken: 'license-ok' });

  it('allows free downloads without a token', async () => {
    await expect(
      assertRulesDownloadAuthorized(port, 'community-focus-first', { paid: false }),
    ).resolves.toBeUndefined();
  });

  it('returns 401/402 for paid downloads without a valid license token', async () => {
    await expect(
      assertRulesDownloadAuthorized(port, 'community-focus-first', { paid: true }),
    ).rejects.toMatchObject({ status: 401 });

    await expect(
      assertRulesDownloadAuthorized(port, 'community-focus-first', {
        paid: true,
        token: 'wrong',
      }),
    ).rejects.toMatchObject({ status: 402 });
  });

  it('blocks paid downloads for homage ids before auth', async () => {
    await expect(
      assertRulesDownloadAuthorized(port, 'line', {
        paid: true,
        token: 'license-ok',
      }),
    ).rejects.toBeInstanceOf(RulesListingPolicyError);

    await expect(
      assertRulesDownloadAuthorized(port, 'line', {
        paid: true,
        token: 'license-ok',
      }),
    ).rejects.not.toBeInstanceOf(RulesDownloadAuthError);
  });
});
