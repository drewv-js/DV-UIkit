# Go/No-Go Release Report Template

Use this template before any release candidate decision. Keep entries concise and evidence-based.

## Release Candidate

- Date:
- Candidate version:
- Target registry/dist-tag:
- Owner:
- Decision: Go | No-Go

## Validation Summary

| Check | Status | Evidence |
| --- | --- | --- |
| Workspace graph validation (`ci:graph`) |  |  |
| Compatibility smoke (`test:compat`) |  |  |
| Consumer app smoke (`test:apps-smoke`) |  |  |
| Pack artifact verification (`release:pack:verify`) |  |  |
| Release lockstep (`release:lockstep`) |  |  |
| Publish dry-run (`release:dry-run`) |  |  |

## Scope and Change Set

- Changed packages:
- Breaking changes:
- Implementation notes:

## Risks and Mitigations

| Risk | Severity | Mitigation | Owner |
| --- | --- | --- | --- |
|  |  |  |  |

## Open Issues

- 

## Final Decision

- Decision rationale:
- Follow-up actions:
