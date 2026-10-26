# Figma and UI Kit Sync Audit

**Audited:** 2026-10-26  
**Figma file:** [Design System v0.6](https://www.figma.com/design/kl19d4xA5nP4cFl0BegHL2/Design-System-v0.6)  
**Repository:** DV UIkit

This audit compares the Figma file's visible page/component catalogue and theme documentation with the UI kit source and token definitions. It records discrepancies and follow-up work; it does not change either implementation.

## Summary

The Figma library and codebase have substantial overlap, but do not yet have a verifiable one-to-one source of truth. The most important gaps are theme coverage, divergent status-token definitions, component/variant coverage, and missing Figma-to-code mappings.

## Findings

### High priority

#### Theme modes are not fully implemented in code

The Figma [Themes page](https://www.figma.com/design/kl19d4xA5nP4cFl0BegHL2/Design-System-v0.6?node-id=1260-22) documents Light, Dark, and Product Red modes. The generated code tokens provide the default theme and a `[data-theme="dark"]` override, but no Product Red mode.

**Follow-up:** Decide whether Product Red is an officially supported theme. If so, implement it in the token source and generated outputs, and add coverage for theme switching.

#### Status colors have multiple competing definitions in code

The codebase does not have one consistent status-palette baseline:

- [`packages/design-tokens/src/tokens.json`](../packages/design-tokens/src/tokens.json) defines semantic values including success `#33b57a`, warning `#db842f`, info `#3db2fa`, and error `#d94c3d`.
- [`packages/design-tokens/scripts/build.mjs`](../packages/design-tokens/scripts/build.mjs) substitutes compatibility values, including success `#3faf7f`, warning `#f2994a`, info `#3aafc2`, and danger `#d94a5a`.
- [`packages/core/src/styles/tokens.css`](../packages/core/src/styles/tokens.css) defines additional status background and content colors directly.

This makes exact Figma-to-code status-color parity difficult to validate and maintain.

**Follow-up:** Choose one canonical semantic palette and derive compatibility aliases and component status styles from it, avoiding separately maintained literal values.

#### Some Figma catalogue entries have no direct code component

The Figma catalogue includes Loader, Progress Bar, Pagination, Metadata List, Settings Row, and Table. No direct component counterpart was found for these names in the code component inventory. The [Figma Table page](https://www.figma.com/design/kl19d4xA5nP4cFl0BegHL2/Design-System-v0.6?node-id=1031-38) appears empty, and the codebase has no `dv-table`.

**Follow-up:** For each item, decide whether it is planned, intentionally design-only, or should be removed from the published design-system catalogue. Confirm whether Table is intentionally empty.

### Medium priority

#### Some documented variants are missing from component APIs

Figma documents small and default sizes for Radio, Switch, and Textarea. In code:

- [`dv-radio`](../packages/core/src/components/dv-radio/dv-radio.tsx) uses a fixed 20px control and exposes no size property.
- [`dv-toggle`](../packages/core/src/components/dv-toggle/dv-toggle.tsx) exposes no size property; it is the likely code counterpart to the Figma Switch.
- [`dv-textarea`](../packages/core/src/components/dv-textarea/dv-textarea.tsx) supports `rows`, but exposes no size variant.

These documented small-size variants therefore do not have direct API equivalents.

**Follow-up:** Confirm whether the size variants are intended behavior. If they are, add corresponding APIs/styles and tests; otherwise, update the Figma documentation to match the supported component contract.

#### Several component names and concepts do not map one-to-one

Examples of likely correspondences under different names:

| Figma    | Likely code counterpart                                                                 |
| -------- | --------------------------------------------------------------------------------------- |
| Modal    | `dv-dialog`                                                                             |
| Nav Bar  | `dv-app-bar`                                                                            |
| Side Nav | `dv-sidebar` / navigation components                                                    |
| Switch   | `dv-toggle`                                                                             |
| Dropdown | `dv-select` for the form-control pattern; `dv-dropdown` for a trigger-and-popup pattern |

The distinction between Figma Dropdown and the code's `dv-dropdown` is especially worth resolving: `dv-dropdown` is a popup primitive, while `dv-select` is the closer form-control counterpart.

**Follow-up:** Publish a canonical component mapping, including cases where one Figma component maps to multiple code components or vice versa.

#### Code components are missing dedicated Figma catalogue pages

The codebase includes components without an obvious dedicated page in the Figma catalogue, including Callout, Carousel, Icon Button, List, Navigation, Select, Skeleton, Stepper, and Toggle Group.

**Follow-up:** Decide which components need design documentation, and add pages or mark them as intentionally implementation-only.

#### Code Connect mapping was not available for the inspected Button

The Figma Button component had no Web Components Code Connect mapping in the lookup performed for this audit. This limits direct traceability between the design component and the code implementation.

**Follow-up:** Add and verify Code Connect mappings for the canonical components after agreeing on the name map.

### Unverified

#### Exact Figma variable values and bindings could not be confirmed

The Themes page documents semantic roles such as `surface/canvas`, `background/raised`, `text/default`, and `border/default`. However, the Figma variable-definition request returned a “nothing selected” error, and searches for those variable names returned no matches. The available inspection showed page structure and component examples, but did not confirm the exact variable values or whether the swatches are bound to live variables.

**Follow-up:** Re-run variable inspection from a valid Figma selection or another supported file-level variable export. Compare the actual Figma values and modes directly against the canonical code token source before marking token parity complete.

## Areas that appear aligned

- The Figma [Button page](https://www.figma.com/design/kl19d4xA5nP4cFl0BegHL2/Design-System-v0.6?node-id=1010-12) documents Primary, Secondary, and Text variants with default/small sizes. The [`dv-button` API](../packages/core/src/components/dv-button/dv-button.tsx) has corresponding variants and `sm`/`md` sizes.
- The Figma Textfield page documents default/small sizes and error/disabled states. The [`dv-textfield` API](../packages/core/src/components/dv-textfield/dv-textfield.tsx) exposes size, error text, and disabled properties.

These are API-level comparisons; exact visual parity still requires comparing Figma variable values and rendered component styles.

## Suggested order of work

1. Establish and document the canonical token source, then reconcile status colors and generated compatibility tokens.
2. Confirm the supported theme modes and add Product Red if it is in scope.
3. Agree on a Figma-to-code component/name map.
4. Resolve missing component and variant coverage, starting with documented small-size variants.
5. Add Code Connect mappings for canonical components.
6. Re-run the audit with access to Figma's actual variable values and verify visual parity.
