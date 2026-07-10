import { newSpecPage } from '@stencil/core/testing';
import { DvRadio } from './radio';

describe('dv-radio', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DvRadio],
      html: '<dv-radio></dv-radio>'
    });

    expect(page.root).toBeTruthy();
  });
});
