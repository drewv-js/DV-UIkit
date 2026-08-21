# Publish And Release

This project is configured for private npm publishing from a personal account.

## One-Time Setup

1. Create an npm granular access token with publish permission for `@dv-uikit/web-components`.
2. Add repository secret `NPM_PUBLISH_TOKEN` in GitHub.
3. Confirm package name and scope in `package.json`.
4. Keep `publishConfig.access` set to `restricted`.

Never put the token in a tracked `.npmrc` file or commit it.

## Release Flow

1. Run the release checks:

```bash
pnpm run release:verify
```

2. Update version:

```bash
npm version patch
```

Use `minor` or `major` when needed.

3. Push commit and tag:

```bash
git push --follow-tags
```

4. Publish from GitHub Actions:

- Open the workflow `Publish Private Package`
- Run workflow manually (`workflow_dispatch`)

## Local Emergency Publish (Optional)

Prefer CI publish. If needed:

```bash
npm run lint
npm run test
npm run build
npm publish
```

Requires local npm auth with a publish-capable token.

## Post-Publish Checks

- Confirm package version exists on npm.
- Install in one consumer repo and run a smoke check.
- Confirm the consumer project uses a read-capable `NPM_TOKEN`.
