# Publish and Release

This project is configured for private npm publishing from a personal account.

## One-time setup

1. Create an npm granular access token with publish permission for this package.
2. Add repository secret `NPM_PUBLISH_TOKEN` in GitHub.
3. Confirm package name and scope in `package.json`.

## Release flow

1. Update version:

```bash
npm version patch
```

Use `minor` or `major` when needed.

2. Push commit and tag:

```bash
git push --follow-tags
```

3. Publish from GitHub Actions:

- Open the workflow `Publish Private Package`
- Run workflow manually (`workflow_dispatch`)

## Local emergency publish (optional)

Prefer CI publish. If needed:

```bash
npm run lint
npm run test
npm run build
npm publish
```

Requires local npm auth with a publish-capable token.

## Post-publish checks

- Confirm package version exists on npm.
- Install in one consumer repo and run a smoke check.
