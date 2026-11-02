# Figma and UI Kit Sync Audit

**Audited:** 2026-11-02
**Figma file:** [Design System v0.6](https://www.figma.com/design/kl19d4xA5nP4cFl0BegHL2/Design-System-v0.6?node-id=1260-22)
**Repository:** DV UIkit

This audit compares the current Figma page/component inventory and local variable collections with the repository's design-token source and Stencil component APIs. It records work needed to align the two; it does not implement design changes.

## Summary

The current Figma file contains 26 non-empty component pages, three semantic-color modes, and separate size and typography variable collections. The repository has matching implementations for many of the documented patterns, but there is not a one-to-one contract:

- The Figma themes and code tokens differ in mode coverage, token names, and several values.
- Several Figma components have no direct component implementation, while several code components have no dedicated Figma page.
- Figma has small-size variants for Radio, Switch, Textarea, and Tag that are not exposed by their likely code counterparts.
- Component names and concepts are not always mapped consistently, and the inspected Button has no Web Components Code Connect mapping.

## Findings

### High priority

#### Figma and code themes/tokens are not in parity

Figma has a `Semantic Colors` collection with **48 variables** and **Light**, **Dark**, and **Product Red** modes. It also has separate `Sizes` (22 variables) and `Typography` (13 variables) collections.

The source in [`packages/design-tokens/src/tokens.json`](../packages/design-tokens/src/tokens.json) has a different nested taxonomy, and [`packages/design-tokens/scripts/build.mjs`](../packages/design-tokens/scripts/build.mjs) generates a default theme plus a `[data-theme="dark"]` override. There is no Product Red mode in the token source or generator. The current theme contract therefore cannot express all Figma modes or values.

Examples of value differences:

| Figma variable/mode              | Figma value | Closest code value/output                  | Difference                             |
| -------------------------------- | ----------- | ------------------------------------------ | -------------------------------------- |
| `surface/canvas` / Light         | `#F2F2F2`   | `--dv-color-surface`: `#D4D6ED`            | Canvas/page background does not match. |
| `text/default` / Light           | `#2B2B2B`   | `color.content.default`: `#111632`         | Default text differs.                  |
| `background/default` / Dark      | `#171B28`   | `color.background.dark.default`: `#20284F` | Dark surface differs.                  |
| `background/raised` / Dark       | `#202638`   | Closest generated dark surface: `#20284F`  | Raised surface differs.                |
| `border/default` / Dark          | `#58627D`   | `color.border.dark.default`: `#343D68`     | Dark border differs.                   |
| `background/brand` / Product Red | `#9F263D`   | No Product Red code mode                   | Product Red brand mode is missing.     |

Status colors also diverge between token layers. The Figma Light status values (success `#33B57A`, warning `#DB842F`, info `#3DB2FA`, error `#D94C3D`) match the corresponding status values in the source token JSON. However, the generator replaces those with compatibility values for the generated status CSS variables (success `#3FAF7F`, warning `#F2994A`, info `#3AAFC2`, danger `#D94A5A`). [`packages/core/src/styles/tokens.css`](../packages/core/src/styles/tokens.css) additionally defines status background and content colors as separate literals. Status styling consequently has multiple competing values, and the fixed compatibility colors do not model Figma's Dark mode values.

The Figma color names also include semantic roles not represented directly in the current token schema, including `background/overlay`, `background/inverse`, `background/pure`, `text/placeholder`, `text/secondary`, `text/input`, `text/inverse`, `text/error`, `border/input`, `border/input-hover`, `border/focus`, `control/thumb-off`, `control/thumb-on`, `control/track-off`, `progress/track`, and status hover roles. Some may have approximate code counterparts, but there is no explicit, verified mapping for them.

**Follow-up:** Agree on the canonical Figma-to-code semantic map, decide whether all three modes are supported, then derive generated CSS/Tailwind compatibility values from that source instead of maintaining separate literals.

#### Figma component catalogue has unimplemented patterns

The Figma component pages without a direct code component are:

- **Loader** — no `dv-loader`.
- **Pagination** — no pagination component.
- **Progress Bar** — no progress-bar component.
- **Metadata List** — no metadata-list component.
- **Settings Row** — no settings-row component.
- **Table** — the Figma page is currently empty and the codebase has no `dv-table`; there is not enough design content to implement or compare a table yet.

These are real catalogue-to-code gaps, but the repository does not establish whether each item is in scope for the published kit.

**Follow-up:** Confirm which patterns are intended for implementation, and populate or explicitly defer the empty Table page.

### Medium priority

#### Figma size and typography foundations differ from the code tokens

The Figma `Sizes` collection and code token values/names do not line up:

- Figma radii: `xs=4`, `sm=8`, `md=24`, `full=9999` px. Code radii: `sm=6`, `md=8`, `lg=12`, `xl=16` px.
- Figma spacing values: `none=0`, `xs=4`, `sm=8`, `md=12`, `lg=14`, `xl=16`, `xxl=20` px. Code spacing values are `4`, `8`, `12`, `16`, `24`, and `32` px. In particular, Figma's 14px and 20px steps are absent, while the code's 24px and 32px steps are not in that Figma collection.
- Figma stroke values are 1/2/3 px. Code has 1/2/3px border-width variables too, but uses different token names.
- Figma typography variables specify Arial, font sizes 12/14/16/20/24/32px, and weights 400/600/700. The code token source specifies Sora and does not define an equivalent font-size/font-weight scale.

Some Figma component-page descriptions refer to Sora while the Figma Typography collection says Arial. That is an additional inconsistency to resolve in the design source before treating its typography variables as the final specification.

**Follow-up:** Choose the canonical typography and scale values, then normalize token names and generated outputs. Verify icon sizes and effect/shadow roles separately before claiming those collections are aligned.

#### Documented variants exceed the likely code APIs

Figma documents these matrices; their likely code counterparts do not expose all of the documented sizes:

| Figma component | Figma variants                                | Likely code counterpart                | Code-side gap                                                                                                                                                         |
| --------------- | --------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Radio           | Checked/unchecked, four states, Default/Small | `dv-radio`                             | No size prop; the rendered control is fixed at 20px.                                                                                                                  |
| Switch          | Checked/unchecked, four states, Default/Small | `dv-toggle`                            | No size prop; the rendered track is fixed at 32×20px.                                                                                                                 |
| Textarea        | Five states, Default/Small                    | `dv-textarea`                          | Has `rows`, but no size variant prop.                                                                                                                                 |
| Tag             | Brand/Neutral, four states, Default/Small     | `dv-tag`                               | Has color/closable props, but no size variant prop.                                                                                                                   |
| Dropdown        | Six states, Default/Small                     | `dv-select` is the closer form control | `dv-select` has `sm`/`md` sizing, but the component-name/pattern mapping is not documented. `dv-dropdown` is a popup primitive and is not obviously the same control. |

The Figma Button (three variants, four states, two sizes) and Textfield (five states, two sizes) have corresponding variant/state/size capabilities in the code APIs. This is an API-level comparison; exact visual parity has not been checked.

**Follow-up:** Confirm whether the missing small sizes are intended component behavior. If so, add them to the component API, styles, stories, and tests; otherwise, update the Figma component matrix.

#### Figma and code component names need a canonical map

Likely counterparts with different names include:

| Figma    | Code counterpart                                                 |
| -------- | ---------------------------------------------------------------- |
| Modal    | `dv-dialog`                                                      |
| Nav Bar  | `dv-app-bar`                                                     |
| Side Nav | `dv-sidebar` / `dv-sidebar-item`                                 |
| Switch   | `dv-toggle`                                                      |
| Dropdown | `dv-select` for a form control; `dv-dropdown` for popup behavior |
| Tabs     | `dv-tab-group`, `dv-tab`, and related tab components             |

The Dropdown distinction is material: the Figma page presents a single-select field, while the codebase has both a select field and a lower-level dropdown popup.

**Follow-up:** Publish the canonical mapping, explicitly marking one-to-many and ambiguous mappings before component work begins.

#### Several code components have no dedicated Figma catalogue page

No direct page was found for these code patterns:

- Callout, Carousel, Detail, Footer, Icon Button
- Label, List, Navigation, Popup
- Radio Group, Select, Skeleton
- Stepper, System State, Toggle Group

Some component subparts and primitives are intentionally nested or internal, so this list is about missing top-level design documentation, not a recommendation to give every implementation helper its own Figma page.

**Follow-up:** Decide which are public design-system patterns and add pages for those; document the rest as implementation-only or composed patterns.

#### Code Connect traceability is missing for the inspected Button

The Web Components Code Connect lookup for the Figma Button component (`1010:12`) returned no mapping. Other nodes/labels were not exhaustively queried.

**Follow-up:** Add and verify mappings for the agreed canonical component map.

## Existing alignment

- **Button:** Figma documents Primary, Secondary, and Text, with Default/Small sizes and default/hover/disabled/loading states. `dv-button` supports the three variants, `sm`/`md` size, disabled, and loading.
- **Textfield:** Figma documents Default/Small sizes and default/hover/focus/disabled/error states. `dv-textfield` supports `sm`/`md` size, disabled, and error/help text.

These checks do not establish pixel-level parity.

## Suggested order of work

1. Agree on the canonical Figma variable taxonomy, values, and supported theme modes.
2. Resolve Figma's Arial/Sora discrepancy and align typography, spacing, radii, and status colors.
3. Decide which catalogue gaps to implement, including the empty Table page.
4. Confirm component naming and mapping, then address the missing size APIs.
5. Add Code Connect mappings for the confirmed component counterparts.
6. Compare rendered components against Figma, including responsive behavior, accessibility states, and token bindings.

## Audit limits

This is a live inventory and API/token comparison, not a pixel-by-pixel comparison of every Figma component. The Figma file's variable collections and page/component names were readable, but not every individual node binding, responsive layout, interaction, or visual state was checked against a rendered Storybook component. Those checks remain part of implementation/visual validation.
