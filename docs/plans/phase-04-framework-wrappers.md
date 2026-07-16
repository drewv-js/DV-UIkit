## Phase 4: Framework Wrappers (React + Vue)

Goal: Generate framework wrappers from core outputs instead of hand-maintained wrappers.

**Depends on**
- Phase 3

**Execution Checklist**
- Owner: Framework Integrations
- Estimate: 2-3 days
- Entry Criteria:
- Core output targets are ready to emit framework proxies.
- Package boundaries for react and vue are stable.
- Exit Criteria:
- React and Vue wrappers build from generated proxies.
- Wrapper typings align with core API.

**Scope**
- Configure Stencil output targets to emit React and Vue proxies into sibling packages.
- Build @dv-uikit/react packaging around generated proxies and selected helper exports.
- Build @dv-uikit/vue packaging around generated proxies.
- Ensure typings/events/props are sourced from core-generated data.

**Deliverables**
- Generated React and Vue wrapper packages with stable exports.
- No manual prop/event duplication as a source of truth.

**Verification**
1. pnpm --filter @dv-uikit/react build succeeds.
2. pnpm --filter @dv-uikit/vue build succeeds.
3. Wrapper types align with core component API surface.

**Out of Scope**
- Legacy import compatibility surface (@dv-uikit/web-components/*).
