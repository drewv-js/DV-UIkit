import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ref } from 'lit/directives/ref.js';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

const withFixedHeight = (heightPx: number) => (storyFn: () => unknown) => {
	return html`<div style="height: ${heightPx}px;">${storyFn()}</div>`;
};

type CarouselArgs = Omit<Components.DvCarousel, 'carouselGoToSlide' | 'carouselNext' | 'carouselPrevious'>;

const carouselSnippets: ComponentSnippets<CarouselArgs> = {
	react: (args) => {
		const navigation = args.navigation ? ' navigation' : '';
		const pagination = args.pagination ? ' pagination' : '';
		return `import { DvCarousel, DvCarouselItem, DvCard } from '@dv-uikit/react';

function App() {
  return (
    <DvCarousel${navigation}${pagination} onSlideChange={handleSlideChange}>
      <DvCarouselItem>
        <DvCard><div slot="header-text">Slide 1</div><div>Card content</div></DvCard>
      </DvCarouselItem>
      <DvCarouselItem>
        <DvCard><div slot="header-text">Slide 2</div><div>Card content</div></DvCard>
      </DvCarouselItem>
      <DvCarouselItem>
        <DvCard><div slot="header-text">Slide 3</div><div>Card content</div></DvCard>
      </DvCarouselItem>
    </DvCarousel>
  );
}`;
	},
	vue: (args) => {
		const navigation = args.navigation ? ' navigation' : '';
		const pagination = args.pagination ? ' pagination' : '';
		return `<template>
  <dv-carousel${navigation}${pagination} @slide-change="handleSlideChange">
    <dv-carousel-item>
      <dv-card>
        <template #header-text>Slide 1</template>
        <div>Card content</div>
      </dv-card>
    </dv-carousel-item>
    <dv-carousel-item>
      <dv-card>
        <template #header-text>Slide 2</template>
        <div>Card content</div>
      </dv-card>
    </dv-carousel-item>
    <dv-carousel-item>
      <dv-card>
        <template #header-text>Slide 3</template>
        <div>Card content</div>
      </dv-card>
    </dv-carousel-item>
  </dv-carousel>
</template>

<script setup>
import { DvCarousel, DvCarouselItem, DvCard } from '@dv-uikit/vue';

const handleSlideChange = (event) => {};
</script>`;
	}
};

const { argTypes } = getStoryHelpers<CarouselArgs>('dv-carousel', {
	excludeCategories: ['properties']
});

const meta: Meta<CarouselArgs> = {
	title: 'Components/Carousel',
	component: 'dv-carousel',
	tags: ['autodocs'],
	decorators: [withFixedHeight(200)],
	parameters: {
		componentSubtitle: '<DvCarousel> | <dv-carousel>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: CarouselArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(carouselSnippets.react(args), carouselSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		navigation: false,
		pagination: false
	}
};

export default meta;
type Story = StoryObj<CarouselArgs>;

function carouselSlides() {
	return html`
		<dv-carousel-item>
			<dv-card>
				<div slot="header-text">SLIDE DvNE</div>
				<div>The first slide in a carousel of CarouselItems.</div>
			</dv-card>
		</dv-carousel-item>
		<dv-carousel-item>
			<dv-card>
				<div slot="header-text">SLIDE TWO</div>
				<div>
					The second slide in a carousel of CarouselItems - this one has slightly more content than the first slide.
				</div>
			</dv-card>
		</dv-carousel-item>
		<dv-carousel-item>
			<dv-card>
				<div slot="header-text">SLIDE THREE</div>
				<div>
					The third slide in a carousel of CarouselItems - this slide will have the most content. Lorem ipsum dolor sit
					amet consectetur, adipisicing elit. Repudiandae recusandae impedit repellat tempora iure, atque voluptatibus
					quibusdam asperiores aliquam ut, delectus omnis, illum doloremque ea! Consequatur reprehenderit sint ad hic
					minus aut labore cumque magnam explicabo voluptatem. Omnis, ipsum quidem.
				</div>
			</dv-card>
		</dv-carousel-item>
	`;
}

function renderCarousel(args: CarouselArgs) {
	return html`
		<dv-carousel ?navigation=${args.navigation} ?pagination=${args.pagination}> ${carouselSlides()} </dv-carousel>
	`;
}

export const Playground: Story = {
	render: (args) => renderCarousel(args)
};

export const Default: Story = {
	parameters: {
		docs: { description: { story: 'A default content carousel with neither navigation nor pagination.' } }
	},
	render: (args) => renderCarousel(args)
};

export const Navigation: Story = {
	args: { navigation: true },
	parameters: { docs: { description: { story: 'A carousel with navigation arrows.' } } },
	render: (args) => renderCarousel(args)
};

export const Pagination: Story = {
	args: { pagination: true },
	parameters: { docs: { description: { story: 'A carousel with pagination buttons only.' } } },
	render: (args) => renderCarousel(args)
};

export const NavigationAndPagination: Story = {
	args: { navigation: true, pagination: true },
	parameters: {
		docs: { description: { story: 'A carousel with both navigation nor pagination.' } }
	},
	render: (args) => renderCarousel(args)
};

export const ManualTrigger: Story = {
	args: { navigation: false, pagination: false },
	parameters: {
		docs: {
			description: {
				story: 'A carousel with a manual slide change trigger.'
			}
		}
	},
	render: (args) => {
		let carouselEl: { carouselGoToSlide?: (index: number) => void } | null = null;

		const handleCarouselRef = (el: Element | undefined) => {
			carouselEl = (el as typeof carouselEl) ?? null;
		};

		return html`
			<dv-carousel ?navigation=${args.navigation} ?pagination=${args.pagination} ${ref(handleCarouselRef)}>
				${carouselSlides()}
			</dv-carousel>
			<div style="display: flex; gap: 8px; margin-top: 8px;">
				<dv-button variant="secondary" @click=${() => carouselEl?.carouselGoToSlide?.(2)}>Go to Slide 3</dv-button>
			</div>
		`;
	}
};


