import { newSpecPage } from '@stencil/core/testing';
import { DButton } from './button';

describe('d-button', () => {
  it('renders with primary class by default', async () => {
    const page = await newSpecPage({
      components: [DButton],
      html: '<d-button>Save</d-button>'
    });

    const button = page.root?.shadowRoot?.querySelector('button');
    expect(button?.classList.contains('primary')).toBe(true);
  });

  it('applies disabled attribute to native button', async () => {
    const page = await newSpecPage({
      components: [DButton],
      html: '<d-button disabled></d-button>'
    });

    const button = page.root?.shadowRoot?.querySelector('button');
    expect(button?.hasAttribute('disabled')).toBe(true);
  });
});
