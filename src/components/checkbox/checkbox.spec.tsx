import { newSpecPage } from '@stencil/core/testing';
import { DvCheckbox } from './checkbox';

describe('dv-checkbox', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DvCheckbox],
      html: '<dv-checkbox></dv-checkbox>'
    });

    expect(page.root).toBeTruthy();
  });
});
