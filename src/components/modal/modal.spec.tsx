import { newSpecPage } from '@stencil/core/testing';
import { DvModal } from './modal';

describe('dv-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DvModal],
      html: '<dv-modal></dv-modal>'
    });

    expect(page.root).toBeTruthy();
  });
});
