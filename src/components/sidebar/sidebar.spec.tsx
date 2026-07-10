import { newSpecPage } from '@stencil/core/testing';
import { DvSidebar } from './sidebar';

describe('dv-sidebar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DvSidebar],
      html: '<dv-sidebar></dv-sidebar>'
    });

    expect(page.root).toBeTruthy();
  });
});
