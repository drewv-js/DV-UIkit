import { newSpecPage } from '@stencil/core/testing';
import { DvAvatar } from './avatar';

describe('dv-avatar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DvAvatar],
      html: '<dv-avatar></dv-avatar>'
    });

    expect(page.root).toBeTruthy();
  });
});
