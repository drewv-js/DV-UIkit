## Phase 2: Design Tokens Package

Goal: Establish @dv-uikit/design-tokens as the token source of truth and generated artifact producer.

**Depends on**
- Phase 1

**Execution Checklist**
- Owner: Design System Tokens
- Estimate: 2-3 days
- Entry Criteria:
- Phase 1 complete with working workspace graph.
- Existing token sources identified for migration.
- Exit Criteria:
- Token package builds CSS, Tailwind, and JSON outputs.
- Core and compatibility packages can consume token exports.

**Scope**
- Create token source structure and build scripts (Style Dictionary-based).
- Generate outputs for v1: CSS theme variables, Tailwind extension config, JSON token payloads.
- Expose stable package exports for downstream consumption.
- Replace duplicated token definitions currently split across CSS and Tailwind preset maintenance.

**Deliverables**
- @dv-uikit/design-tokens build outputs consumed by core/react/compat packages.
- Stable import paths for consumer usage.

**Verification**
1. pnpm --filter @dv-uikit/design-tokens build produces expected artifacts.
2. Output paths resolve through exports map.
3. Core and compatibility package can import generated token outputs.

**Out of Scope**
- AG Grid/Figma outputs unless later required by consumers.
