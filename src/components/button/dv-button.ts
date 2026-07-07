import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { sharedBaseStyles } from '../../utils/sharedStyles';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

@customElement('dv-button')
export class DvButton extends LitElement {
  @property({ type: String })
  variant: ButtonVariant = 'primary';

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String })
  label = 'Button';

  static override styles = [
    sharedBaseStyles,
    css`
      button {
        all: unset;
        align-items: center;
        border-radius: var(--dv-radius-lg);
        cursor: pointer;
        display: inline-flex;
        font-size: 0.95rem;
        font-weight: 700;
        gap: var(--dv-space-2);
        justify-content: center;
        line-height: 1;
        padding: var(--dv-space-3) var(--dv-space-4);
        transition: transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease;
      }

      button:focus-visible {
        outline: 2px solid color-mix(in srgb, var(--dv-color-brand) 60%, white);
        outline-offset: 2px;
      }

      button.primary {
        background: var(--dv-color-brand);
        box-shadow: var(--dv-shadow-soft);
        color: white;
      }

      button.primary:hover {
        background: var(--dv-color-brand-strong);
        transform: translateY(-1px);
      }

      button.secondary {
        background: var(--dv-color-surface-strong);
        border: 1px solid var(--dv-color-border);
        color: var(--dv-color-text);
      }

      button.secondary:hover {
        background: var(--dv-color-surface);
      }

      button.danger {
        background: var(--dv-color-danger);
        color: white;
      }

      button.danger:hover {
        filter: brightness(0.95);
      }

      button:disabled {
        cursor: not-allowed;
        opacity: 0.55;
        transform: none;
      }
    `
  ];

  override render() {
    const classes = {
      primary: this.variant === 'primary',
      secondary: this.variant === 'secondary',
      danger: this.variant === 'danger'
    };

    return html`
      <button
        class=${classMap(classes)}
        ?disabled=${this.disabled}
        type="button"
      >
        <slot>${this.label}</slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dv-button': DvButton;
  }
}
