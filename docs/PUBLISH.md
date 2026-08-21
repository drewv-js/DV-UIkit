# Publish And Release

This project is configured for private publishing to GitHub Packages.

The package is published to GitHub Packages instead of the public npm registry. This keeps it private for repositories that have access to the GitHub account.

## One-Time Setup

1. Confirm the repository owner is `drewv-js`, matching the package scope `@drewv-js`.
2. GitHub Actions uses its built-in `GITHUB_TOKEN` to publish.
3. Confirm package name and scope in `package.json`.
4. Keep `publishConfig.access` set to `restricted`.
5. Keep the workflow's `packages: write` permission enabled.

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
- For the first publication, set `force_publish` to `true`.

The workflow checks whether files changed compared with `origin/main`. A manual run on the current `main` commit can pass all checks and still skip publishing because it finds no new changes. Use `force_publish: true` for the initial publication.

## Local Emergency Publish (Optional)

Prefer CI publish. If needed:

```bash
npm run lint
npm run test
npm run build
npm publish
```

Use the GitHub Packages registry when publishing manually:

```bash
npm publish --registry=https://npm.pkg.github.com
```

Requires local GitHub Packages authentication with a token that has `write:packages` access. Prefer the GitHub Actions workflow instead.

## Post-Publish Checks

- Confirm package version exists on npm.
- Install in one consumer repo and run a smoke check.
- Confirm the consumer project uses a GitHub token with `read:packages` access.
