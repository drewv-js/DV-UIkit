import { newSpecPage } from '@stencil/core/testing';
import { DvDropdown } from './dropdown';

describe('dv-dropdown', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DvDropdown],
      html: '<dv-dropdown></dv-dropdown>'
    });

    expect(page.root).toBeTruthy();
  });
});
