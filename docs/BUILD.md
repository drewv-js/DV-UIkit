# Build and Test

## Prerequisites

- Node.js 20+
- npm 10+

## Install dependencies

```bash
npm install
```

## Validate quality

```bash
npm run lint
npm run typecheck
npm run test
npm run ci:validate
```

## Build distributables

```bash
npm run build
```

## Visual development and review

Run Storybook locally:

```bash
npm run storybook
```

Create a static Storybook build:

```bash
npm run storybook:build
```

Build outputs are generated in `packages/core/dist`:

- `index.js` and `auto-register.js`
- `react.js`
- `*.d.ts` type declarations
- `styles.css`

## Useful scripts

- `npm run clean` removes `packages/core/dist` and `packages/core/coverage`
- `npm run audit` checks runtime dependency vulnerabilities
- `npm run test:compat` validates compatibility import paths from a packed fixture
- `npm run test:apps-smoke` validates React, Vue, and HTML consumer smoke apps
- `npm run release:pack:verify` validates npm pack artifact contents
- `npm run release:dry-run` runs build, compatibility smoke, and pack verification
