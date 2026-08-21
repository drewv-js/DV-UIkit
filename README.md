# DV UIkit

Private, reusable UI kit for projects owned by the DV UIkit GitHub account.

- Workspace root: orchestration only
- Installable package: `@dv-uikit/web-components`
- Stack: Stencil Web Components, Tailwind-based tokens, React/TypeScript wrappers
- Registry: npmjs private package (personal account)

## Quick Start

Configure access to the private npm package, install it, then import registration and styles:

```bash
npm install @dv-uikit/web-components
```

```ts
import '@dv-uikit/web-components/auto-register';
import '@dv-uikit/web-components/styles.css';
```

```html
<dv-button variant="primary">Save</dv-button>
```

## Use This In Another Project

Quick path for external consumers:

1. Add the private npm registry settings shown in [docs/INSTALL.md](docs/INSTALL.md).
2. Install `@dv-uikit/web-components`.
3. Import `@dv-uikit/web-components/auto-register` and `@dv-uikit/web-components/styles.css`.
4. Optionally use `@dv-uikit/web-components/react` and `@dv-uikit/web-components/tailwind-preset`.

For complete setup, full examples, and troubleshooting, use:

- [docs/INSTALL.md](docs/INSTALL.md)

Supported consumer entrypoints:

- `@dv-uikit/web-components`
- `@dv-uikit/web-components/auto-register`
- `@dv-uikit/web-components/react`
- `@dv-uikit/web-components/styles.css`
- `@dv-uikit/web-components/tailwind-preset`

The package is currently private and intended for projects owned by the DV UIkit GitHub account.

## Documentation

- Install and consume: [docs/INSTALL.md](docs/INSTALL.md)
- Internal npm package plan: [docs/INTERNAL_NPM_PACKAGE_PLAN.md](docs/INTERNAL_NPM_PACKAGE_PLAN.md)
- Build and test: [docs/BUILD.md](docs/BUILD.md)
- Component structure standard: [docs/COMPONENT_STRUCTURE.md](docs/COMPONENT_STRUCTURE.md)
- Publish and release: [docs/PUBLISH.md](docs/PUBLISH.md)
- Release checklist: [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md)
- Maintenance workflow: [docs/MAINTENANCE.md](docs/MAINTENANCE.md)
- Security baseline: [SECURITY.md](SECURITY.md)

## Local Dev Commands

```bash
npm install
npm run ci:validate
npm run build:workspace
npm run storybook
```

## Font Awesome Placeholder

Font Awesome integration is intentionally a placeholder for your own account/package setup.

- Placeholder config: `packages/core/src/internal/fontawesome-placeholder.ts`
- Replace `importSource` with your own kit/package when ready.
