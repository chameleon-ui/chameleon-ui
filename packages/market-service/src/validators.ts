import type { ListingApplication, ListingValidationCheck } from './contracts.js';

/**
 * Validates that the submitted design-rules.json (if present) declares the
 * required v1.0 fields and RTL support. This is a real local schema check, not
 * a remote call.
 */
export function checkRules(application: ListingApplication): ListingValidationCheck {
  const rulesFile = application.files.find((f) => f.path.endsWith('design-rules.json'));
  if (!rulesFile) {
    return {
      id: 'check.rules',
      ok: false,
      message: 'Missing design-rules.json',
    };
  }
  try {
    const parsed = JSON.parse(rulesFile.content) as Record<string, unknown>;
    const hasVersion = parsed.version === '1.0';
    const hasTypography = typeof parsed.typography === 'object' && parsed.typography !== null;
    const hasSpacing = typeof parsed.spacing === 'object' && parsed.spacing !== null;
    const hasColorBoundaries =
      typeof parsed.colorBoundaries === 'object' && parsed.colorBoundaries !== null;
    const ok = hasVersion && hasTypography && hasSpacing && hasColorBoundaries;
    return {
      id: 'check.rules',
      ok,
      message: ok
        ? 'design-rules.json conforms to the required v1.0 shape'
        : 'design-rules.json is missing required v1.0 sections (version, typography, spacing, colorBoundaries)',
    };
  } catch {
    return {
      id: 'check.rules',
      ok: false,
      message: 'design-rules.json is not valid JSON',
    };
  }
}

/**
 * Validates RTL support by inspecting the design-rules.json rtl section or
 * the presence of logical CSS properties in a bundled CSS file.
 */
export function checkRtl(application: ListingApplication): ListingValidationCheck {
  const rulesFile = application.files.find((f) => f.path.endsWith('design-rules.json'));
  if (rulesFile) {
    try {
      const parsed = JSON.parse(rulesFile.content) as Record<string, unknown>;
      const rtl =
        typeof parsed.rtl === 'object' && parsed.rtl !== null
          ? (parsed.rtl as Record<string, unknown>)
          : undefined;
      if (rtl?.supported === true) {
        return {
          id: 'check.rtl',
          ok: true,
          message: 'RTL support explicitly declared in design-rules.json',
        };
      }
    } catch {
      // fall through to CSS heuristic
    }
  }

  const cssFile = application.files.find(
    (f) => f.path.endsWith('.css') && !f.path.includes('node_modules'),
  );
  if (cssFile) {
    const usesLogical = /margin-inline|padding-inline|inset-inline|border-inline/.test(
      cssFile.content,
    );
    if (usesLogical) {
      return {
        id: 'check.rtl',
        ok: true,
        message: 'CSS uses logical direction properties for RTL',
      };
    }
  }

  return {
    id: 'check.rtl',
    ok: false,
    message:
      'No RTL evidence found: design-rules.json rtl.supported is not true and CSS lacks logical properties',
  };
}

/**
 * Validates that a license identifier is present. Accepts an SPDX short
 * identifier or a LICENSE file content.
 */
export function checkLicense(application: ListingApplication): ListingValidationCheck {
  const hasLicenseFile = application.files.some(
    (f) => f.path.toLowerCase().includes('license') || f.path.toLowerCase().endsWith('license.md'),
  );
  if (hasLicenseFile) {
    return {
      id: 'check.license',
      ok: true,
      message: 'LICENSE file present',
    };
  }

  const spdx = [
    'MIT',
    'Apache-2.0',
    'BSD-2-Clause',
    'BSD-3-Clause',
    'GPL-3.0',
    'LGPL-3.0',
    'MPL-2.0',
    'CC0-1.0',
    'UNLICENSED',
  ];
  const license = application.license.trim();
  const ok = license.length > 0 && spdx.some((id) => license.toUpperCase().startsWith(id));
  return {
    id: 'check.license',
    ok,
    message: ok
      ? `License declared as ${license}`
      : 'Missing LICENSE file and license field is not a recognized SPDX identifier',
  };
}

/**
 * Lightweight a11y auto-check: ensures the bundle contains at least one file
 * that mentions an accessibility concern (focus, aria, reduced-motion) or a
 * meta.json with a11y notes. This is intentionally a basic local signal, not
 * a full WCAG audit.
 */
export function checkA11y(application: ListingApplication): ListingValidationCheck {
  const pattern = /aria-|focus|reduced-motion|role=|keyboard|screen.reader|wcag/i;
  const found = application.files.some((f) => pattern.test(f.content));
  return {
    id: 'check.a11y',
    ok: found,
    message: found
      ? 'Bundle contains a11y-related markers'
      : 'Bundle lacks a11y-related markers (aria, focus, keyboard, reduced-motion, WCAG)',
  };
}

/** Plugin-shaped validator entry. New checks can be added to this array. */
export type ListingValidator = (application: ListingApplication) => ListingValidationCheck;

export const defaultValidators: ListingValidator[] = [checkRules, checkRtl, checkLicense, checkA11y];
