import path from "node:path";
import { fileURLToPath } from "node:url";
import { compileTokenDirectory, TokenCompilerError } from "./token-compiler.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = path.join(packageRoot, "src", "core");
const buildDirectory = path.join(packageRoot, "dist", "css");

async function loadStyleDictionary() {
  try {
    const module = await import("style-dictionary");
    return module.default;
  } catch (error) {
    throw new TokenCompilerError(
      "packages/tokens/package.json",
      `Style Dictionary is unavailable: ${error instanceof Error ? error.message : String(error)}`,
      "run pnpm install once from the chameleon-ui monorepo root, then rerun this build",
    );
  }
}

async function main() {
  const compiled = await compileTokenDirectory(sourceDirectory);
  const StyleDictionary = await loadStyleDictionary();
  const formatName = "chameleon/css-variables-deterministic";

  StyleDictionary.registerFormat({
    name: formatName,
    format: () => compiled.css,
  });

  // Style Dictionary receives already-resolved DTCG tokens so its only write is
  // the reviewed deterministic string. It remains the selected O2 build engine.
  const dictionary = new StyleDictionary({
    log: { verbosity: "silent", warnings: "disabled" },
    tokens: compiled.dtcg,
    usesDtcg: true,
    platforms: {
      css: {
        buildPath: `${buildDirectory}${path.sep}`,
        files: [
          {
            destination: "variables.css",
            format: formatName,
            options: { showFileHeader: false },
          },
        ],
      },
    },
  });

  await dictionary.buildAllPlatforms();
  console.log(
    `[@chameleon-ui/tokens] wrote ${compiled.tokens.length} variables to dist/css/variables.css`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
