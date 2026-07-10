import { newSpecPage } from '@stencil/core/testing';
import { DvTabGroup } from './tab-group';

describe('dv-tab-group', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DvTabGroup],
      html: '<dv-tab-group></dv-tab-group>'
    });

    expect(page.root).toBeTruthy();
  });
});
