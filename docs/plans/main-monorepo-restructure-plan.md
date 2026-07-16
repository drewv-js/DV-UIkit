## DV-UIkit Monorepo Restructure Plan

This is the master plan for restructuring DV-UIkit from a single-package repository into a pnpm + turbo monorepo, modeled on D:/oecui-library while preserving consumer compatibility.

### Phase Index
1. [Phase 1: Monorepo Foundation](./phase-01-monorepo-foundation.md)
2. [Phase 2: Design Tokens Package](./phase-02-design-tokens.md)
3. [Phase 3: Core Package Migration](./phase-03-core-package-migration.md)
4. [Phase 4: Framework Wrappers](./phase-04-framework-wrappers.md)
5. [Phase 5: Compatibility Package](./phase-05-compatibility-package.md)
6. [Phase 6: Docs, Storybook, and Dev UX](./phase-06-docs-storybook-dev-ux.md)
7. [Phase 7: CI/CD and Publishing](./phase-07-cicd-publishing.md)
8. [Phase 8: Cutover Validation](./phase-08-cutover-validation.md)

### Program Principles
- Keep @dv-uikit/web-components import paths backward-compatible.
- Make @dv-uikit/core the source of truth for API and behavior.
- Generate framework wrappers from core outputs, do not hand-maintain proxy APIs.
- Use design-token generated artifacts as the single source of truth for styling primitives.
- Enforce release guardrails for core/react/vue version lockstep.

### Critical Open Inputs (Before First Publish)
- Final registry destination (npmjs private or Azure Artifacts).
- Initial dist-tag strategy (recommend pre-release tag before latest).
- Whether to include demo apps in v1 cutover or defer to post-cutover.
