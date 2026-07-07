import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedBaseStyles } from '../../utils/sharedStyles';

@customElement('dv-card')
export class DvCard extends LitElement {
  @property({ type: String })
  heading = '';

  static override styles = [
    sharedBaseStyles,
    css`
      article {
        background: linear-gradient(145deg, white 0%, #f9fbff 100%);
        border: 1px solid var(--dv-color-border);
        border-radius: var(--dv-radius-xl);
        box-shadow: var(--dv-shadow-soft);
        color: var(--dv-color-text);
        display: block;
        padding: var(--dv-space-6);
      }

      header {
        font-size: 1.1rem;
        font-weight: 800;
        margin-bottom: var(--dv-space-3);
      }

      .body {
        color: var(--dv-color-text-muted);
      }
    `
  ];

  override render() {
    return html`
      <article part="card">
        ${this.heading
          ? html`<header part="header">${this.heading}</header>`
          : null}
        <div class="body" part="body">
          <slot></slot>
        </div>
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dv-card': DvCard;
  }
}
