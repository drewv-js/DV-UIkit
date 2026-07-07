# Component Structure Standard

All components must follow this folder pattern:

- `src/components/<name>/<name>.tsx`
- `src/components/<name>/<name>.scss`
- `src/components/<name>/<name>.spec.tsx`

Example:

- `src/components/button/button.tsx`
- `src/components/button/button.scss`
- `src/components/button/button.spec.tsx`

## Why this standard

- Predictable structure across all components
- Faster onboarding and maintenance
- Easier automated validation in CI

## Create a new component scaffold

```bash
npm run component:new -- --name badge
```

This generates:

- `src/components/badge/badge.tsx`
- `src/components/badge/badge.scss`
- `src/components/badge/badge.spec.tsx`

## Validate structure

```bash
npm run component:check
```

`release:verify` includes this check automatically.

## React wrappers

React wrappers are defined centrally in `src/react.ts`.
Component source-of-truth stays in the component folder `.tsx` file.
