import { newSpecPage } from '@stencil/core/testing';
import { DvCard } from './card';

describe('dv-card', () => {
  it('renders heading when provided', async () => {
    const page = await newSpecPage({
      components: [DvCard],
      html: '<dv-card heading="Account"></dv-card>'
    });

    const header = page.root?.shadowRoot?.querySelector('header');
    expect(header?.textContent).toBe('Account');
  });
});
