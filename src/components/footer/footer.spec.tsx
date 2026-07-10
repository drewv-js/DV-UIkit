import { newSpecPage } from '@stencil/core/testing';
import { DvFooter } from './footer';

describe('dv-footer', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DvFooter],
      html: '<dv-footer></dv-footer>'
    });

    expect(page.root).toBeTruthy();
  });
});
