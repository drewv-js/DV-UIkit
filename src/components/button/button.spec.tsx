import { newSpecPage } from '@stencil/core/testing';
import { DvButton } from './button';

describe('dv-button', () => {
  it('renders with primary class by default', async () => {
    const page = await newSpecPage({
      components: [DvButton],
      html: '<dv-button>Save</dv-button>'
    });

    const button = page.root?.shadowRoot?.querySelector('button');
    expect(button?.classList.contains('primary')).toBe(true);
  });

  it('applies disabled attribute to native button', async () => {
    const page = await newSpecPage({
      components: [DvButton],
      html: '<dv-button disabled></dv-button>'
    });

    const button = page.root?.shadowRoot?.querySelector('button');
    expect(button?.hasAttribute('disabled')).toBe(true);
  });
});
