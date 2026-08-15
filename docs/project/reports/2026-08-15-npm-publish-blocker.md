# npm publish blocker — 2026-08-15

Status: **blocked on npm publish auth policy (2FA / granular token)**. In-repo packages remain ready at **0.1.9**; **no** package was published to the registry.

## Retry session (after `npm login`)

| Check | Result |
| --- | --- |
| `npm whoami` | **`vjsplus-j`** (logged in; email verified) |
| `npm profile get` | `tfa: false` |
| `node ./scripts/check-publish-ready.mjs` | Pass (`wouldPublish` 17 packages, `firstTag` `v0.1.9`) |
| Build of public graph (17 packages) | Pass |
| `npm view @chameleon-ui/tokens version` | **404** (still unpublished) |
| `npm access list packages vjsplus-j` | Only `@vjsplus-j/*` packages (read-write); no `@chameleon-ui/*` yet |
| `npm org ls chameleon-ui` | `{}` |
| Real publish attempt | `pnpm --filter @chameleon-ui/tokens publish --access public --no-git-checks` → **E403** (see below) |

## Exact failure (this retry)

```text
npm notice package: @chameleon-ui/tokens@0.1.9
npm notice Publishing to https://registry.npmjs.org/ with tag latest and public access
npm error code E403
npm error 403 403 Forbidden - PUT https://registry.npmjs.org/@chameleon-ui%2ftokens - Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
npm error 403 In most cases, you or one of your dependencies are requesting a package version that is forbidden by your security policy, or on a server you do not have access to.
```

Previous blocker was **ENEEDAUTH** (not logged in). Login is fixed; publish still did not succeed. No packages were uploaded.

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

Root `chameleon-ui` and apps remain `private: true` (not published).

## What the owner must do next

npm now requires one of:

1. **Enable 2FA** on the npm account, then publish with an OTP, e.g.  
   `pnpm --filter @chameleon-ui/tokens publish --access public --otp <code>`  
   (or set OTP for the recursive publish), **or**
2. Create a **granular access token** with publish permission and **“Bypass two-factor authentication”** enabled, put it in user/`~/.npmrc` as  
   `//registry.npmjs.org/:_authToken=…`, then retry.

Also confirm org/scope ownership for **`chameleon-ui` / `@chameleon-ui`** (create at https://www.npmjs.com/org/create if needed; add `vjsplus-j` as Owner). Scope emptiness and ownership were not fully proven in this session because publish stopped at the 2FA gate first.

### Retry commands (from `d:\ChameleonUI\chameleon-ui`)

```powershell
npm whoami
node ./scripts/check-publish-ready.mjs
npx --yes pnpm@9.15.0 publish -r --access public --no-git-checks
# or with OTP after enabling 2FA:
# npx --yes pnpm@9.15.0 publish -r --access public --no-git-checks --otp <code>

npm view @chameleon-ui/tokens version
npm view @chameleon-ui/components version
npm view @chameleon-ui/components-vue version
```

Do **not** invent registry success. Do **not** update CONTRIBUTING/AGENTS consume docs to claim npm publish until `npm view` returns `0.1.9`. Do **not** use `--no-verify` on git hooks.

## Local prep already done

- Versions at `0.1.9`
- Publish-ready gate green
- Public graph built successfully (this retry)
- Docs that say “this repo still does not npm publish” left unchanged (honest until registry success)
