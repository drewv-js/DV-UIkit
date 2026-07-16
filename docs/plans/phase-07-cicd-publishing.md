## Phase 7: CI/CD and Publishing

Goal: Replace single-package CI/publish with monorepo-aware validation and controlled multi-package release.

**Depends on**
- Phases 1 through 6 stabilizing package outputs

**Execution Checklist**
- Owner: DevOps/Release
- Estimate: 2-3 days
- Entry Criteria:
- Package build/test commands are stable across workspace.
- Versioning policy for release group is approved.
- Exit Criteria:
- CI validates graph tasks on PR and main.
- Publish dry-run and release-group guard pass.

**Scope**
- Update CI workflows to run lint/typecheck/test/build via turbo graph.
- Add changed-package publish logic.
- Enforce fixed release-group version lockstep for core/react/vue.
- Implement co-publish rule when core publishes.
- Parameterize registry target to allow npmjs private or Azure feed.

**Deliverables**
- Monorepo CI workflow.
- Controlled publish workflow with guardrails.

**Verification**
1. CI passes on clean checkout.
2. Publish dry-run correctly identifies changed packages.
3. Release-group guard fails mismatched versions and passes lockstep versions.

**Out of Scope**
- Consumer app-level QA beyond smoke tests.
