// Curated allowlist of the ~50 most useful/common icons for this design system.
// Edit src/internal/icon-catalog.json, then run `node ./scripts/generate-icon-names.mjs`
// to regenerate src/icon-name.generated.ts. Names must exist in
// @fortawesome/free-solid-svg-icons (checked either by canonical iconName or FA4-style alias).
import curatedIconNames from './icon-catalog.json';

export const CURATED_ICON_NAMES = curatedIconNames as readonly string[];

