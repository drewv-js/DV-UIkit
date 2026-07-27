# DV UIkit

Private, reusable UI kit for personal projects with a lean-professional workflow.

- Workspace root: orchestration only
- Core package: `@dv-uikit/core`
- Stack: Stencil Web Components, Tailwind-based tokens, React/TypeScript wrappers
- Registry: npmjs private package (personal account)

## Quick Start (Consumers)

1. Configure npm auth in the consumer project.
2. Install the package.
3. Import styles and components.

Current compatibility package for consumers is `@dv-uikit/web-components`.

## Use This In Another Project

Quick path for external consumers:

1. Add npm auth (`.npmrc`) for the `@dv-uikit` scope.
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

## Documentation

- Install and consume: [docs/INSTALL.md](docs/INSTALL.md)
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
