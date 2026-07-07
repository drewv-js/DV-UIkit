# Maintenance Guide

## Weekly or before release

1. Run quality checks:

```bash
npm run lint
npm run test
npm run build
```

2. Review dependency risk:

```bash
npm run audit
```

3. Update dependencies when needed:

```bash
npm outdated
npm update
```

Re-run quality checks after updates.

## Adding a new component

1. Create component under `src/components/<name>/`.
2. Register it through `src/define.ts`.
3. Export public types from `src/index.ts`.
4. Add optional React wrapper under `src/react/` and export in `src/react.ts`.
5. Add tests for registration and rendering behavior.
6. Run lint/test/build before publishing.

## Versioning policy

- `patch`: fixes and small non-breaking improvements
- `minor`: new backward-compatible components/features
- `major`: breaking API or behavior changes

## Token hygiene

- Keep publish token only in CI secrets.
- Use read-only token for local installs.
- Rotate or revoke immediately if exposure is suspected.
