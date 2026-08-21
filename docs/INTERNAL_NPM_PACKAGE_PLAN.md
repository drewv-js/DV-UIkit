# Internal npm Package Plan

This runbook describes the first release path for DV UIkit. The initial goal is reliable consumption from our own GitHub projects, not public distribution. The package should remain easy to make public or split into framework-specific packages later.

## Target Outcome

Publish one private scoped package:

```text
@drewv-js/web-components
```

Consumers install one package and can use the Web Components directly:

```bash
npm install @drewv-js/web-components
```

```ts
import '@drewv-js/web-components/auto-register';
import '@drewv-js/web-components/styles.css';
```

```html
<dv-button variant="primary">Save</dv-button>
```

The internal workspace packages remain implementation packages for now:

- `@dv-uikit/core`
- `@dv-uikit/react`
- `@dv-uikit/vue`
- `@dv-uikit/design-tokens`

The root package already assembles the consumer-facing output through `scripts/build-compat.mjs`.

## Decision For The First Release

- Registry: GitHub Packages
- Visibility: private scoped package
- Package: `@drewv-js/web-components`
- Access: `restricted`
- Release location: GitHub Actions
- Authentication: built-in GitHub Actions `GITHUB_TOKEN` for publishing and a GitHub token with `read:packages` for consumers
- Versioning: keep the current lockstep versioning for core, React, and Vue
- Framework strategy: keep the current combined package for the first release; split React/Vue packages later only if usage justifies it

Important: GitHub Packages uses the GitHub repository owner as the npm scope. This plan uses `@drewv-js/web-components` because the repository is owned by `drewv-js`.

## Step 1: Make The Root Package Publishable

Status: **complete**

Change only the root `package.json`:

- Remove `"private": true`, or set `"private": false`.
- Keep `publishConfig.access` as `restricted`.
- Leave npm provenance disabled while the package uses restricted access. npm rejects provenance for private packages.
- Leave the internal workspace packages private.

Do not change the package name or package boundaries during this step.

After the change, verify:

```bash
npm pkg get name version private publishConfig
```

Expected values include:

```text
@drewv-js/web-components
0.1.0
false
restricted
```

## Step 2: Confirm Package Metadata

Status: **complete**

Before publishing, review the root `package.json`:

- `name` is `@drewv-js/web-components`.
- `description` explains the package clearly.
- `repository`, `homepage`, and `bugs` point to the GitHub repository.
- `files` includes only built output and required documentation.
- `exports` points to files produced by the build.
- `license` reflects the intended internal distribution policy.
- `author` is populated if desired.
- Leave npm provenance disabled while the package uses restricted access. npm rejects provenance for private packages.

`UNLICENSED` is acceptable for an intentionally private package, but choose a real license before making the package public.

## Step 3: Build And Inspect The Tarball

Status: **complete**

Run from the repository root:

```bash
pnpm install
pnpm run build:workspace
pnpm run release:pack:verify
npm pack --dry-run
```

The archive should include:

- `dist/components`
- `dist/auto-register.js`
- `dist/react.js` and its declarations
- `dist/styles.css`
- `tailwind.preset.cjs`
- `README.md`
- `SECURITY.md`
- `LICENSE`

It should not include source files, tests, Storybook sources, workspace configuration, or development caches.

## Step 4: Test From A Clean Consumer

Status: **complete**

Use a separate temporary project, outside this repository:

```bash
mkdir dv-uikit-consumer-test
cd dv-uikit-consumer-test
npm init -y
npm install ../DV-UIkit/dv-uikit-web-components-0.1.0.tgz
```

Add a small Web Components smoke test that:

- Imports `@drewv-js/web-components/auto-register`.
- Imports `@drewv-js/web-components/styles.css`.
- Renders a `dv-button` and another representative component.
- Confirms TypeScript can resolve the package declarations if the consumer uses TypeScript.

This test must use the packed tarball rather than workspace links.

## Step 5: Configure GitHub Packages Authentication

Status: **in progress**

### Publishing token

GitHub Actions publishes with its built-in `GITHUB_TOKEN`. The workflow grants it `packages: write` permission and sends npm to `https://npm.pkg.github.com`. A local publishing token is not needed for the Actions workflow.

### Consumer token

Each private consumer project needs an `.npmrc` file, or an equivalent user-level configuration:

```ini
@drewv-js:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
always-auth=true
```

For local installs, use a GitHub personal access token with `read:packages` permission. For GitHub Actions in a consuming repository, use its `GITHUB_TOKEN` with `packages: read` permission.

Do not commit a token value. The `${GITHUB_PACKAGES_TOKEN}` placeholder is safe to commit.

## Step 6: Publish A Beta Version

After the tarball works locally, publish a prerelease to GitHub Packages:

```bash
npm version prerelease --preid=beta
npm publish --tag beta --registry=https://npm.pkg.github.com
```

Alternatively, use the existing GitHub Actions publish workflow after the version is committed and tagged.

Test the registry package from a clean consumer:

```bash
npm install @drewv-js/web-components@beta
```

Verify registration, styles, exports, and declarations again.

## Step 7: Publish The First Stable Version

Once the beta works from npm:

```bash
npm version patch
npm publish --registry=https://npm.pkg.github.com
```

The preferred path is the existing `Publish Private Package` GitHub Actions workflow. It runs the build, tests, compatibility checks, and package verification before publishing.

Before triggering it, confirm:

- `NPM_PUBLISH_TOKEN` exists in GitHub repository secrets.
- The package version is not already published.
- The release commit and tag are pushed.
- The package is still intended to be private.

For the first package publication, set `force_publish` to `true` when running the workflow. A manual run on the current `main` commit can pass all checks and skip publishing because the change detector finds no changes compared with `origin/main`.

## Step 8: Consume It In Real Projects

In each internal project:

```bash
npm install @drewv-js/web-components
```

Add the registry configuration and import the package once during application startup:

```ts
import '@drewv-js/web-components/auto-register';
import '@drewv-js/web-components/styles.css';
```

For React projects, the current combined package also provides:

```tsx
import { DvButtonReact } from '@drewv-js/web-components/react';
```

## Release Checklist

- [ ] Root package is publishable; internal workspace packages remain private.
- [ ] npm package name and scope are correct.
- [ ] `NPM_PUBLISH_TOKEN` is configured in GitHub.
- [ ] Consumer `.npmrc` uses `${NPM_TOKEN}` and contains no secret value.
- [ ] `pnpm run build:workspace` passes.
- [ ] `pnpm run release:pack:verify` passes.
- [ ] A clean consumer can install the tarball.
- [ ] A beta can be installed from npm.
- [ ] A real internal GitHub project can install the package.
- [ ] Release notes record the version and changes.

## Future Upgrade Path

When the internal usage grows, this setup can evolve without changing the component implementation:

- Publish `@dv-uikit/react` separately.
- Publish `@dv-uikit/vue` separately.
- Publish `@dv-uikit/design-tokens` separately.
- Move the registry to GitHub Packages if that becomes more convenient.
- Change npm access from `restricted` to `public` after reviewing licensing and documentation.
- Add automated changelogs and release management.
- Add `next` and `beta` release channels.

Do not split packages or change registries until a real consumer need justifies the additional release and authentication complexity.
