import { newSpecPage } from '@stencil/core/testing';
import { DvSidebarItem } from './sidebar-item';

describe('dv-sidebar-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DvSidebarItem],
      html: '<dv-sidebar-item></dv-sidebar-item>'
    });

    expect(page.root).toBeTruthy();
  });
});
