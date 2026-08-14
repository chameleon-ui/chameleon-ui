import { createHash, timingSafeEqual } from 'node:crypto';

export function parseBearerToken(header: string | undefined): string | undefined {
  if (!header) return undefined;
  const match = /^Bearer\s+(\S+)/i.exec(header.trim());
  return match?.[1];
}

export function tokensEqual(given: string, expected: string): boolean {
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

export function authorizeRequest(
  authorizationHeader: string | undefined,
  expectedToken: string,
): boolean {
  const given = parseBearerToken(authorizationHeader);
  if (!given) return false;
  return tokensEqual(given, expectedToken);
}
