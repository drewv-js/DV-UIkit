# DV UIkit

Private, reusable UI kit for personal projects with a lean-professional workflow.

- Package: `@dv-uikit/web-components`
- Stack: Stencil Web Components, Tailwind-based tokens, React/TypeScript wrappers
- Registry: npmjs private package (personal account)

## Quick Start

1. Configure npm auth in the consumer project.
2. Install the package.
3. Import styles and components.

```bash
npm install @dv-uikit/web-components
```

```ts
import '@dv-uikit/web-components/auto-register';
import '@dv-uikit/web-components/styles.css';
```

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
npm run lint
npm run test
npm run build
```
