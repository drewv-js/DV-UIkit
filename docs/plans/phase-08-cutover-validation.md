## Phase 8: Cutover Validation

Goal: Validate production readiness before first stable monorepo publish.

**Depends on**
- Phases 1 through 7 complete

**Execution Checklist**
- Owner: QA and Release Readiness
- Estimate: 1-2 days
- Entry Criteria:
- All previous phases completed and merged.
- Packaged artifacts are available for smoke testing.
- Exit Criteria:
- Go/No-Go report completed with pass evidence.
- First publish candidate is approved.

**Scope**
- Full graph validation (lint, typecheck, test, build).
- Wrapper parity checks against current component API/events.
- Consumer smoke tests for legacy and new package import paths.
- Artifact inspection from packed outputs prior to publish.

**Deliverables**
- Go/No-Go readiness report with pass/fail evidence.

**Verification**
1. pnpm turbo run lint typecheck test build passes.
2. pnpm -r pack artifacts contain correct files and exports.
3. Smoke apps validate both compatibility imports and direct package imports.
4. Publish dry-run passes with expected package set.

**Out of Scope**
- Post-release monitoring or incident response procedures.
