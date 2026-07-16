## Phase 3: Core Package Migration

Goal: Move Stencil components into @dv-uikit/core as the canonical API/behavior source.

**Depends on**
- Phase 2

**Execution Checklist**
- Owner: Core Components
- Estimate: 3-5 days
- Entry Criteria:
- Phase 2 token artifacts are available and versioned in workspace.
- Component source and script move map approved.
- Exit Criteria:
- Core package builds independently with dist outputs.
- CEM/docs generation and Storybook metadata integration work.

**Scope**
- Move component source, internal utilities, tests, and stories to packages/core.
- Re-home Stencil config, build scripts, and component helper scripts.
- Configure output targets for distribution plus docs-json/CEM generation.
- Preserve current Storybook metadata conversion logic compatibility for docs rendering.
- Ensure styling is driven by design-token outputs.

**Deliverables**
- Core package builds independently and emits dist artifacts.
- Core package emits CEM/docs metadata for Storybook and wrappers.

**Verification**
1. pnpm --filter @dv-uikit/core build succeeds.
2. pnpm --filter @dv-uikit/core cem:analyze outputs custom-elements metadata.
3. Storybook in core reads generated metadata without docs schema errors.

**Out of Scope**
- Final publish workflows and consumer compatibility adapter.
