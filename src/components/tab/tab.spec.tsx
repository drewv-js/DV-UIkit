import { newSpecPage } from '@stencil/core/testing';
import { DvTab } from './tab';

describe('dv-tab', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DvTab],
      html: '<dv-tab></dv-tab>'
    });

    expect(page.root).toBeTruthy();
  });
});
