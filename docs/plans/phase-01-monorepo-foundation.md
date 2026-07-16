## Phase 1: Monorepo Foundation

Goal: Convert the repository root from a single publishable package into a pnpm + turbo workspace orchestrator.

**Depends on**
- None

**Execution Checklist**
- Owner: Platform/Build
- Estimate: 1-2 days
- Entry Criteria:
- Repo is in baseline single-package state.
- Team agreed on pnpm + turbo adoption.
- Exit Criteria:
- Workspace root is orchestration-only.
- pnpm workspace discovery and turbo graph validation pass.

**Scope**
- Create workspace topology under packages/.
- Add root pnpm-workspace.yaml and turbo.json task graph.
- Convert root package.json to orchestration scripts (build:design-tokens, build:core, build:frameworks, aggregate build, lint, test, typecheck).
- Keep root docs and governance files (README, LICENSE, security/publish docs) at root.

**Deliverables**
- Workspace and package discovery works via pnpm.
- Turbo dependency graph enforces upstream build order.
- Root no longer publishes a single package artifact.

**Verification**
1. pnpm install resolves workspace links.
2. pnpm turbo run build --dry=json shows ordered graph.
3. Root scripts execute package-filtered commands without path errors.

**Out of Scope**
- Package internals for design tokens/core/framework wrappers.
