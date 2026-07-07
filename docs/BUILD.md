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

Build outputs are generated in `dist`:

- `index.js` and `auto-register.js`
- `react.js`
- `*.d.ts` type declarations
- `styles.css`

## Useful scripts

- `npm run clean` removes `dist` and `coverage`
- `npm run audit` checks runtime dependency vulnerabilities
