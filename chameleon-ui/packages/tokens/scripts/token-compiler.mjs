import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const REFERENCE_PATTERN = /\{([^{}]+)\}/g;
const FULL_REFERENCE_PATTERN = /^\{([^{}]+)\}$/;
const MAX_REFERENCE_DEPTH = 32;

export class TokenCompilerError extends Error {
  constructor(tokenPath, reason, nextStep) {
    super(
      [
        "Token compilation failed.",
        `Path: ${tokenPath}`,
        `Reason: ${reason}`,
        `Next: ${nextStep}`,
      ].join("\n"),
    );
    this.name = "TokenCompilerError";
  }
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * @complexity time O(f log f) | space O(f) | f = files and directories below root
 * @guarantees deterministic path order
 */
async function listJsonFiles(rootDirectory) {
  const result = [];

  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name, "en"));

    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(entryPath);
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        result.push(entryPath);
      }
    }
  }

  await visit(rootDirectory);
  return result;
}

function mergeTokenTrees(target, source, sourceFile, currentPath = []) {
  for (const key of Object.keys(source).sort((a, b) => a.localeCompare(b, "en"))) {
    const incoming = source[key];
    const tokenPath = [...currentPath, key];

    if (!(key in target)) {
      target[key] = incoming;
      continue;
    }

    const existing = target[key];
    const canMerge =
      isObject(existing) &&
      isObject(incoming) &&
      !("$value" in existing) &&
      !("$value" in incoming);

    if (!canMerge) {
      throw new TokenCompilerError(
        tokenPath.join("."),
        `duplicate token or incompatible group found while reading ${sourceFile}`,
        "keep each token path in exactly one src/core JSON file",
      );
    }

    mergeTokenTrees(existing, incoming, sourceFile, tokenPath);
  }
}

/**
 * @complexity time O(b + n log n) | space O(b) | b = input bytes, n = root keys
 * @guarantees deterministic merge order, duplicate-safe
 */
export async function loadTokenDirectory(rootDirectory) {
  const files = await listJsonFiles(rootDirectory);
  if (files.length === 0) {
    throw new TokenCompilerError(
      rootDirectory,
      "no DTCG JSON source files were found",
      "add at least one src/core/*.json file containing $value tokens",
    );
  }

  const root = {};
  for (const file of files) {
    let parsed;
    try {
      parsed = JSON.parse(await readFile(file, "utf8"));
    } catch (error) {
      throw new TokenCompilerError(
        file,
        `invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
        "fix the JSON syntax and rerun the token build",
      );
    }

    if (!isObject(parsed)) {
      throw new TokenCompilerError(
        file,
        "the JSON root must be an object",
        "wrap tokens in named DTCG groups",
      );
    }
    mergeTokenTrees(root, parsed, file);
  }

  return root;
}

/**
 * @complexity time O(n log n) | space O(n) | n = token and group count
 * @guarantees inherited DTCG type support and stable token order
 */
function flattenTokens(root) {
  const tokens = new Map();

  function visit(node, tokenPath, inheritedType) {
    if (!isObject(node)) {
      throw new TokenCompilerError(
        tokenPath.join(".") || "<root>",
        "a token group must be an object",
        "use an object group and put leaf values under $value",
      );
    }

    const currentType = typeof node.$type === "string" ? node.$type : inheritedType;
    if ("$value" in node) {
      if (tokenPath.length === 0) {
        throw new TokenCompilerError(
          "<root>",
          "the document root cannot be a token",
          "place the token below a named group",
        );
      }
      const name = tokenPath.join(".");
      tokens.set(name, { path: tokenPath, type: currentType, value: node.$value });
      return;
    }

    const childKeys = Object.keys(node)
      .filter((key) => !key.startsWith("$"))
      .sort((left, right) => left.localeCompare(right, "en"));
    for (const key of childKeys) {
      visit(node[key], [...tokenPath, key], currentType);
    }
  }

  visit(root, [], undefined);
  if (tokens.size === 0) {
    throw new TokenCompilerError(
      "<root>",
      "no DTCG $value tokens were found",
      "add leaf objects such as { \"$value\": \"#ffffff\" }",
    );
  }
  return tokens;
}

function cssScalar(value, tokenType, tokenPath) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (
    tokenType === "dimension" &&
    isObject(value) &&
    typeof value.value === "number" &&
    typeof value.unit === "string"
  ) {
    return `${value.value}${value.unit}`;
  }
  throw new TokenCompilerError(
    tokenPath,
    `the resolved ${tokenType ?? "unknown"} value cannot be serialized as a CSS scalar`,
    "use a string/number, or a DTCG dimension object with numeric value and string unit",
  );
}

/**
 * @complexity time O(n + r*d) amortized | space O(n + d) | n = tokens, r = references, d <= 32
 * @guarantees memoized, depth-bounded, cycle-safe, readable failure paths
 */
function resolveTokens(tokens) {
  const memo = new Map();

  function resolveToken(name, stack) {
    if (memo.has(name)) return memo.get(name);

    const cycleStart = stack.indexOf(name);
    if (cycleStart >= 0) {
      const cycle = [...stack.slice(cycleStart), name].join(" -> ");
      throw new TokenCompilerError(
        cycle,
        "circular token reference detected",
        "break the cycle by replacing one alias with a concrete value",
      );
    }
    if (stack.length >= MAX_REFERENCE_DEPTH) {
      throw new TokenCompilerError(
        [...stack, name].join(" -> "),
        `reference depth exceeds ${MAX_REFERENCE_DEPTH}`,
        "shorten the alias chain before rebuilding",
      );
    }

    const token = tokens.get(name);
    if (!token) {
      const owner = stack.at(-1) ?? "<root>";
      throw new TokenCompilerError(
        owner,
        `reference target ${name} does not exist`,
        "correct the {token.path} alias or add the missing token",
      );
    }

    const nextStack = [...stack, name];
    const value = resolveValue(token.value, token.type, nextStack);
    const resolved = { ...token, value };
    memo.set(name, resolved);
    return resolved;
  }

  function resolveValue(value, tokenType, stack) {
    if (typeof value === "string") {
      const fullReference = value.match(FULL_REFERENCE_PATTERN);
      if (fullReference) return resolveToken(fullReference[1], stack).value;
      return value.replace(REFERENCE_PATTERN, (_match, referenceName) => {
        const referenced = resolveToken(referenceName, stack);
        return cssScalar(referenced.value, referenced.type, referenceName);
      });
    }
    if (Array.isArray(value)) {
      return value.map((entry) => resolveValue(entry, tokenType, stack));
    }
    if (isObject(value)) {
      const resolved = {};
      for (const key of Object.keys(value).sort((a, b) => a.localeCompare(b, "en"))) {
        resolved[key] = resolveValue(value[key], tokenType, stack);
      }
      return resolved;
    }
    return value;
  }

  return [...tokens.keys()]
    .sort((left, right) => left.localeCompare(right, "en"))
    .map((name) => resolveToken(name, []));
}

function cssVariableName(tokenPath) {
  return `--cu-${tokenPath
    .map((segment) => segment.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase())
    .join("-")}`;
}

function renderCss(tokens) {
  const lines = ["/* Generated by @chameleon-ui/tokens. Do not edit. */", ":root {"];
  const names = new Set();
  for (const token of tokens) {
    const variableName = cssVariableName(token.path);
    if (names.has(variableName)) {
      throw new TokenCompilerError(
        token.path.join("."),
        `multiple token paths normalize to ${variableName}`,
        "rename one token path so every CSS variable is unique",
      );
    }
    names.add(variableName);
    lines.push(
      `  ${variableName}: ${cssScalar(token.value, token.type, token.path.join("."))};`,
    );
  }
  lines.push("}", "");
  return lines.join("\n");
}

function toResolvedDtcgTree(tokens) {
  const root = {};
  for (const token of tokens) {
    let cursor = root;
    for (const segment of token.path.slice(0, -1)) {
      cursor[segment] ??= {};
      cursor = cursor[segment];
    }
    cursor[token.path.at(-1)] = {
      ...(token.type ? { $type: token.type } : {}),
      $value: token.value,
    };
  }
  return root;
}

/**
 * @complexity time O(n log n) | space O(n) | n = token count
 * @guarantees deterministic, cycle-safe
 */
export function compileTokenObject(root) {
  const resolvedTokens = resolveTokens(flattenTokens(root));
  return {
    css: renderCss(resolvedTokens),
    dtcg: toResolvedDtcgTree(resolvedTokens),
    tokens: resolvedTokens,
  };
}

export async function compileTokenDirectory(rootDirectory) {
  return compileTokenObject(await loadTokenDirectory(rootDirectory));
}
