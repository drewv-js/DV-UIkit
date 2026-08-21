# Security Policy

This repository uses a lean-professional security model for personal/private package usage.

## Supported Versions

Only the latest minor version is supported for security updates.

## Reporting a Vulnerability

Report vulnerabilities privately to the repository owner.
Do not open public issues with exploit details.

## Token Policy

- Use GitHub tokens only for GitHub Packages access.
- Use separate tokens for publishing and installing when possible.
- Set expiration on all tokens when possible.
- Rotate tokens periodically or immediately if exposure is suspected.
- Store tokens in CI secrets, never in source control.

## Practical Baseline

- Keep the package private (`access: restricted`).
- Publish from CI using the workflow's `GITHUB_TOKEN`.
- Use a token with `read:packages` for local installs in consumer projects.
