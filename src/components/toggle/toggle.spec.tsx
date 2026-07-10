import { newSpecPage } from '@stencil/core/testing';
import { DvToggle } from './toggle';

describe('dv-toggle', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DvToggle],
      html: '<dv-toggle></dv-toggle>'
    });

    expect(page.root).toBeTruthy();
  });
});
