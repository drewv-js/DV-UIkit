import { css } from 'lit';

export const sharedBaseStyles = css`
  :host {
    box-sizing: border-box;
    font-family: var(--dv-font-sans);
    color: var(--dv-color-text);
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
`;
