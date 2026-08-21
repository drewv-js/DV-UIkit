# @dv-uikit/design-tokens

Minimal design token package for DV UIkit.

## Outputs

- build/css/dv-tokens.css
- build/json/tokens.json
- build/tailwind/dv-tailwind-tokens.cjs

## Theme Roles

The default theme uses deep navy for primary structure, soft lavender for page backgrounds, near-white for surfaces, coral for prominent actions, and purple for secondary accents.

Semantic color tokens follow the OUI naming model:

- `color.brand.*` contains the theme's brand ingredients.
- `color.background.*` describes surfaces and interaction backgrounds.
- `color.content.*` describes text and icon content roles.
- `color.border.*` describes borders and dividers.
- `color.background.status.*`, `color.content.status.*`, and `color.border.status.*` describe status states.

Components should use semantic roles rather than raw color values.

- Primary brand: `#343d68`
- Primary hover: `#20284f`
- Deepest surface: `#111632`
- Light surface: `#f8f9ff`
- Page background: `#d4d6ed`
- Action: `#ff5b68`
- Secondary accent: `#6459c9`

Dark mode overrides the semantic CSS variables when an ancestor uses `data-theme="dark"`.

## Commands

- npm run build
- npm run dev (alias to build for now)
