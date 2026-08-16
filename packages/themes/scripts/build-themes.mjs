import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  compileThemeTokens,
  resolveThemeExtends,
  TokenCompilerError,
} from "@chameleon-ui/tokens/compiler";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const themesRoot = path.join(packageRoot, "src");
const distRoot = path.join(packageRoot, "dist");
const coreDirectory = path.resolve(packageRoot, "../tokens/src/core");

const themeIds = [
  "linear",
  "mercedes",
  "porsche",
  "ferrari",
  "apple",
  "tiktok",
  "wechat",
  "alipay",
];

async function readOptionalUtf8(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Load a `$extends` ref from disk. Refs are resolved relative to the
 * referencing theme directory and must stay inside packages/themes/src
 * (no escaping into arbitrary filesystem paths).
 */
function createFsExtendsLoader(themeDirectory) {
  return async (ref) => {
    const resolved = path.resolve(themeDirectory, ref);
    const relative = path.relative(themesRoot, resolved);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      throw new TokenCompilerError(
        ref,
        `$extends ref escapes the themes source root`,
        "keep inheritance refs inside packages/themes/src",
      );
    }
    return JSON.parse(await readFile(resolved, "utf8"));
  };
}

async function buildTheme(themeId) {
  const themeDirectory = path.join(themesRoot, themeId);
  const overlayPath = path.join(themeDirectory, "tokens.json");
  const designRulesPath = path.join(themeDirectory, "design-rules.json");
  const metaPath = path.join(themeDirectory, "meta.json");
  const outputDirectory = path.join(distRoot, themeId);

  let overlayObject = JSON.parse(await readFile(overlayPath, "utf8"));
  const designRules = JSON.parse(await readFile(designRulesPath, "utf8"));
  const meta = JSON.parse(await readFile(metaPath, "utf8"));

  if (meta.id !== themeId) {
    throw new TokenCompilerError(
      themeId,
      `meta.json id ${meta.id} does not match theme directory ${themeId}`,
      "keep meta.id aligned with the theme folder name",
    );
  }

  if (overlayObject.$extends !== undefined) {
    overlayObject = await resolveThemeExtends(overlayObject, createFsExtendsLoader(themeDirectory), {
      label: themeId,
    });
  }

  const compiled = await compileThemeTokens(coreDirectory, overlayObject, themeId);
  await mkdir(outputDirectory, { recursive: true });

  let css = compiled.css;

  // Optional manual-switch scheme: tokens.light.json compiles into a
  // `:root[data-color-scheme="light"]` block. ThemeProvider sets
  // documentElement[data-color-scheme]; omitting it keeps the theme default.
  const lightSource = await readOptionalUtf8(path.join(themeDirectory, "tokens.light.json"));
  if (lightSource && lightSource.trim()) {
    let lightOverlay = JSON.parse(lightSource);
    if (lightOverlay.$extends !== undefined) {
      lightOverlay = await resolveThemeExtends(lightOverlay, createFsExtendsLoader(themeDirectory), {
        label: `${themeId} (light)`,
      });
    }
    const lightCompiled = await compileThemeTokens(coreDirectory, lightOverlay, `${themeId}-light`);
    css += `\n/* Theme light scheme (manual [data-color-scheme="light"] switch) */\n${lightCompiled.css
      .trim()
      .replaceAll(":root", ':root[data-color-scheme="light"]')}\n`;
  }

  // Mirror for light-first themes: tokens.dark.json compiles into a
  // `:root[data-color-scheme="dark"]` block so ThemeProvider colorScheme="dark"
  // flips a theme whose base tokens are light.
  const darkSource = await readOptionalUtf8(path.join(themeDirectory, "tokens.dark.json"));
  if (darkSource && darkSource.trim()) {
    let darkOverlay = JSON.parse(darkSource);
    if (darkOverlay.$extends !== undefined) {
      darkOverlay = await resolveThemeExtends(darkOverlay, createFsExtendsLoader(themeDirectory), {
        label: `${themeId} (dark)`,
      });
    }
    const darkCompiled = await compileThemeTokens(coreDirectory, darkOverlay, `${themeId}-dark`);
    css += `\n/* Theme dark scheme (manual [data-color-scheme="dark"] switch) */\n${darkCompiled.css
      .trim()
      .replaceAll(":root", ':root[data-color-scheme="dark"]')}\n`;
  }

  const languageCssFiles = ["radius.css", "shadow.css", "motion.css", "effects.css"];
  for (const fileName of languageCssFiles) {
    const source = await readOptionalUtf8(path.join(themeDirectory, fileName));
    if (!source || !source.trim()) continue;
    const label = fileName === "effects.css" ? "Theme effects overlay" : `Theme ${fileName}`;
    css += `\n/* ${label} */\n${source.trim()}\n`;
  }

  await writeFile(path.join(outputDirectory, "variables.css"), css, "utf8");
  await writeFile(
    path.join(outputDirectory, "tokens.resolved.json"),
    `${JSON.stringify(compiled.dtcg, null, 2)}\n`,
    "utf8",
  );
  await writeFile(
    path.join(outputDirectory, "design-rules.json"),
    `${JSON.stringify(designRules, null, 2)}\n`,
    "utf8",
  );
  await writeFile(path.join(outputDirectory, "meta.json"), `${JSON.stringify(meta, null, 2)}\n`, "utf8");

  console.log(
    `[@chameleon-ui/themes] built ${themeId}: ${compiled.tokens.length} CSS variables → dist/${themeId}/`,
  );
}

async function main() {
  for (const themeId of themeIds) {
    await buildTheme(themeId);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
