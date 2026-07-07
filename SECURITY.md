# Security Policy

This repository uses a lean-professional security model for personal/private package usage.

## Supported Versions

Only the latest minor version is supported for security updates.

## Reporting a Vulnerability

Report vulnerabilities privately to the repository owner.
Do not open public issues with exploit details.

## Token Policy

- Use npm granular access tokens only.
- Use separate tokens for publishing and installing.
- Set expiration on all tokens when possible.
- Rotate tokens periodically or immediately if exposure is suspected.
- Store tokens in CI secrets, never in source control.

## Practical Baseline

- Keep package private (`access: restricted`).
- Publish from CI using `NPM_PUBLISH_TOKEN`.
- Use read-only token for local installs in consumer projects.
