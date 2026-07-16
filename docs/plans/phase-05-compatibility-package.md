## Phase 5: Compatibility Package

Goal: Preserve existing consumer import paths via @dv-uikit/web-components adapter package.

**Depends on**
- Phases 3 and 4

**Execution Checklist**
- Owner: Consumer Experience
- Estimate: 1-2 days
- Entry Criteria:
- Core/react/vue package exports are stable.
- Legacy import contract list is locked.
- Exit Criteria:
- All legacy entrypoints resolve through compatibility package.
- Smoke app passes for registration, styles, and react import path.

**Scope**
- Implement compatibility package exports and build wiring.
- Preserve legacy entrypoints:
- @dv-uikit/web-components
- @dv-uikit/web-components/auto-register
- @dv-uikit/web-components/react
- @dv-uikit/web-components/styles.css
- @dv-uikit/web-components/tailwind-preset
- Route these paths to new package outputs without changing consumer code.

**Deliverables**
- Adapter package with backward-compatible import behavior.

**Verification**
1. Consumer smoke app imports legacy paths successfully.
2. Components register and render through adapter path.
3. Styles and Tailwind preset resolve from adapter exports.

**Out of Scope**
- CI publish automation details.
