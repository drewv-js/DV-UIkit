# Release Checklist

Use this checklist for every release of `@drewv-js/web-components` to GitHub Packages.

## 1. Pre-release validation

Run from the package root:

```bash
npm install
npm run release:verify
```

If any command fails, fix issues before continuing.

## 2. Choose version bump

Use semantic versioning:

- `patch`: bug fixes / non-breaking polish
- `minor`: new backward-compatible components/features
- `major`: breaking changes

Apply version bump:

```bash
npm run release:patch
```

Replace with one of:

```bash
npm run release:patch
npm run release:minor
npm run release:major
```

## 3. Push commit and tag

```bash
git push --follow-tags
```

## 4. Publish (recommended path)

In GitHub Actions:

1. Open workflow: `Publish Private Package`
2. Click `Run workflow`
3. Wait for success

Requirements:

- The workflow grants `GITHUB_TOKEN` `packages: write` permission
- The package scope matches the GitHub repository owner: `@drewv-js`

## 5. Post-publish smoke test

In a consumer project:

```bash
npm install @drewv-js/web-components@latest --registry=https://npm.pkg.github.com
```

Verify:

- Import works: `import '@drewv-js/web-components';`
- Styles load: `import '@drewv-js/web-components/styles.css';`
- Components render: `dv-button`, `dv-card`

## 6. Optional local emergency publish

Only if CI publish is unavailable:

```bash
npm run lint
npm run test
npm run build
npm publish
```

Use a GitHub token with `write:packages` only when necessary. Prefer the GitHub Actions workflow.

## 7. Record release notes

Log the release in your preferred place (GitHub release notes or changelog):

- Version
- Added/changed/fixed items
- Breaking changes (if any)
