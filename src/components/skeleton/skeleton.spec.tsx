import { newSpecPage } from '@stencil/core/testing';
import { DvSkeleton } from './skeleton';

describe('dv-skeleton', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DvSkeleton],
      html: '<dv-skeleton></dv-skeleton>'
    });

    expect(page.root).toBeTruthy();
  });
});
