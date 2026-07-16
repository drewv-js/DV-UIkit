## Phase 6: Docs, Storybook, and Dev UX

Goal: Align docs and developer workflows to monorepo structure while keeping Storybook authoritative in core.

**Depends on**
- Phase 3 (core) and stable package boundaries

**Execution Checklist**
- Owner: Documentation and DX
- Estimate: 1-2 days
- Entry Criteria:
- Core Storybook path and metadata generation are stable.
- Compatibility and direct-import guidance is finalized.
- Exit Criteria:
- Storybook runs from core package in monorepo layout.
- README/docs reflect monorepo workflows and migration paths.

**Scope**
- Move/host Storybook under packages/core.
- Preserve CEM-to-Storybook metadata mapping behavior.
- Update root README/docs for monorepo commands and package usage guidance.
- Add migration guidance covering both compatibility and direct package imports.

**Deliverables**
- Core-hosted Storybook and updated documentation.
- Clear dev command matrix for root vs package-level operations.

**Verification**
1. pnpm --filter @dv-uikit/core dev-storybook or equivalent runs.
2. Storybook docs display props/events/slots from generated metadata.
3. Documentation reflects monorepo usage and migration paths.

**Out of Scope**
- Registry-specific publish execution.
