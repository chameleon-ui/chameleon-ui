# npm publish blocker — 2026-08-15

Status: **blocked on auth / scope ownership**. In-repo packages are ready at **0.1.9**; no registry publish occurred.

## What was verified today

| Check | Result |
| --- | --- |
| `node ./scripts/check-publish-ready.mjs` | Pass (`wouldPublish` 17 packages, `firstTag` `v0.1.9`, `npmPublish: false` dry plan) |
| Build of public graph | Pass (`pnpm` filter build for all 17) |
| `npm whoami` | **ENEEDAUTH** — not logged in |
| User `~/.npmrc` | No `//registry.npmjs.org/:_authToken` |
| `NPM_TOKEN` / `NODE_AUTH_TOKEN` | Unset |
| `npm view @chameleon-ui/tokens` | **404** (scope/package not on registry yet) |
| Real publish attempt | `pnpm --filter @chameleon-ui/tokens publish --access public --no-git-checks` → **ENEEDAUTH** |
| Dry-run `pnpm publish -r --access public --no-git-checks --dry-run` | All 17 tarballs pack cleanly; each warns login required |

## Publish set (ready at 0.1.9, not published)

- `@chameleon-ui/tokens@0.1.9`
- `@chameleon-ui/i18n@0.1.9`
- `@chameleon-ui/primitives@0.1.9`
- `@chameleon-ui/primitives-vue@0.1.9`
- `@chameleon-ui/themes@0.1.9`
- `@chameleon-ui/components@0.1.9`
- `@chameleon-ui/components-vue@0.1.9`
- `@chameleon-ui/contract@0.1.9`
- `@chameleon-ui/schema-renderer@0.1.9`
- `@chameleon-ui/cli@0.1.9`
- `@chameleon-ui/mcp-server@0.1.9`
- `@chameleon-ui/registry@0.1.9`
- `@chameleon-ui/install-core@0.1.9`
- `@chameleon-ui/adapter-a2ui@0.1.9`
- `@chameleon-ui/adapter-ag-ui@0.1.9`
- `@chameleon-ui/adapter-mcp-apps@0.1.9`
- `@chameleon-ui/blocks@0.1.9`

All have `private: false`, `publishConfig.access: public`, `LICENSE`, and `files` allowlists. Root `chameleon-ui` and apps remain `private: true` (not published).

## Exact blocker

```text
npm error code ENEEDAUTH
npm error need auth This command requires you to be logged in to https://registry.npmjs.org/
npm error need auth You need to authorize this machine using `npm login`
```

Secondary expected gate after login: the npm org/scope **`@chameleon-ui`** must exist and the logged-in user must have publish rights. Packages are currently 404 on the public registry.

## Owner commands (after interactive login)

Run from `d:\ChameleonUI\chameleon-ui` (or repo path to the library).

```powershell
# 1) Auth
npm login
npm whoami

# 2) Create / claim scope (one-time; use npm website if CLI org create differs)
#    https://www.npmjs.com/org/create  → org name: chameleon-ui
#    Add this npm user as Owner.

# 3) Confirm scope empty / first publish
npm view @chameleon-ui/tokens version
# expect 404 until first publish

# 4) Rebuild + publish all non-private workspace packages
corepack enable
corepack pnpm@9.15.0 install
corepack pnpm@9.15.0 --filter @chameleon-ui/tokens --filter @chameleon-ui/i18n --filter @chameleon-ui/primitives --filter @chameleon-ui/primitives-vue --filter @chameleon-ui/themes --filter @chameleon-ui/components --filter @chameleon-ui/components-vue --filter @chameleon-ui/contract --filter @chameleon-ui/schema-renderer --filter @chameleon-ui/cli --filter @chameleon-ui/mcp-server --filter @chameleon-ui/registry --filter @chameleon-ui/install-core --filter @chameleon-ui/adapter-a2ui --filter @chameleon-ui/adapter-ag-ui --filter @chameleon-ui/adapter-mcp-apps --filter @chameleon-ui/blocks build
corepack pnpm@9.15.0 publish:check
corepack pnpm@9.15.0 publish -r --access public

# 5) Verify
npm view @chameleon-ui/tokens version
npm view @chameleon-ui/components version
npm view @chameleon-ui/components-vue version
```

Optional CI provenance (preferred for signed publishes; requires GitHub Actions OIDC + `id-token: write`):

```bash
pnpm publish -r --access public --provenance
```

Do **not** publish from a machine without login. Do **not** use `--no-verify` on git hooks for the follow-up doc commit.

## Local prep already done (this machine)

- Versions bumped to `0.1.9` in workspace `package.json` files
- Publish-ready gate green
- Public graph built successfully
- Local git tag `v0.1.9` created when this report was committed (tag is local only; **not** force-pushed)
- Docs that say “this repo still does not npm publish” left unchanged (honest until registry success)

## After a successful publish

1. Confirm all 17 `npm view … version` return `0.1.9`
2. Update `CONTRIBUTING.md` (root + `chameleon-ui/`) to remove “still does not npm publish”
3. Update Phase 9 / T9.3 notes to record real publish evidence (no invented download stats)
4. `git push origin v0.1.9` only when the owner explicitly wants the tag remote (not done in this session)
