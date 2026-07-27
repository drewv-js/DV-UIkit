import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type CarouselItemArgs = Record<string, never>;

const carouselItemSnippets: ComponentSnippets<CarouselItemArgs> = {
	react: () => `import { DvCarouselItem, DvCard } from '@dv-uikit/react';

function App() {
  return (
    <DvCarouselItem>
      <DvCard>
        <div slot="header-text">CONTENT FOR A CAROUSEL ITEM</div>
        <div>This is content within a CarouselItem component.</div>
      </DvCard>
    </DvCarouselItem>
  );
}`,
	vue: () => `<template>
  <dv-carousel-item>
    <dv-card>
      <template #header-text>CONTENT FOR A CAROUSEL ITEM</template>
      <div>This is content within a CarouselItem component.</div>
    </dv-card>
  </dv-carousel-item>
</template>

<script setup>
import { DvCarouselItem, DvCard } from '@dv-uikit/vue';
</script>`
};

const { argTypes } = getStoryHelpers('dv-carousel-item', {
	excludeCategories: ['properties']
});

const meta: Meta<CarouselItemArgs> = {
	title: 'Components/Carousel/Carousel Item',
	component: 'dv-carousel-item',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvCarouselItem> | <dv-carousel-item>',
		docs: {
			source: {
				transform: () => buildMultiFrameworkSource(carouselItemSnippets.react({}), carouselItemSnippets.vue({}))
			}
		}
	},
	argTypes,
	args: {}
};

export default meta;
type Story = StoryObj<CarouselItemArgs>;

export const Playground: Story = {
	render: () => html`
		<div style="height: 200px;">
			<dv-carousel-item>
				<dv-card>
					<div slot="header-text">CONTENT FOR A CAROUSEL ITEM</div>
					<div>
						This is content within a CarouselItem component, which essentially functions as a container to be placed
						into a Carousel.
					</div>
				</dv-card>
			</dv-carousel-item>
		</div>
	`
};

export const Default: Story = {
	parameters: { docs: { description: { story: 'A default carousel item with a card slotted as content.' } } },
	render: () => html`
		<div style="height: 200px;">
			<dv-carousel-item>
				<dv-card>
					<div slot="header-text">CONTENT FOR A CAROUSEL ITEM</div>
					<div>
						This is content within a CarouselItem component, which essentially functions as a container to be placed
						into a Carousel.
					</div>
				</dv-card>
			</dv-carousel-item>
		</div>
	`
};


