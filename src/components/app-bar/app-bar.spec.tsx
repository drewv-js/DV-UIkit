import { newSpecPage } from '@stencil/core/testing';
import { DvAppBar } from './app-bar';

describe('dv-app-bar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DvAppBar],
      html: '<dv-app-bar></dv-app-bar>'
    });

    expect(page.root).toBeTruthy();
  });
});
