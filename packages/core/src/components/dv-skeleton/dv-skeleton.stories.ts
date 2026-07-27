import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type SkeletonArgs = Record<string, never>;

const skeletonSnippets: ComponentSnippets<SkeletonArgs> = {
	react: () => `import { DvSkeleton, DvCard } from '@dv-uikit/react';

function App() {
  return (
    <DvCard style={{ width: 400 }}>
      <DvSkeleton />
      <DvSkeleton />
      <DvSkeleton />
    </DvCard>
  );
}`,
	vue: () => `<template>
  <dv-card style="width: 400px; height: auto;">
    <dv-skeleton />
    <dv-skeleton />
    <dv-skeleton />
  </dv-card>
</template>

<script setup>
import { DvSkeleton, DvCard } from '@dv-uikit/vue';
</script>`
};

const withFixedSize = (widthPx: number, heightPx: number) => (storyFn: () => unknown) => {
	return html`<div style="width: ${widthPx}px; height: ${heightPx}px;">${storyFn()}</div>`;
};

const { argTypes } = getStoryHelpers('dv-skeleton', {
	excludeCategories: ['properties']
});

const meta: Meta<SkeletonArgs> = {
	title: 'Components/Skeleton',
	component: 'dv-skeleton',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvSkeleton> | <dv-skeleton>',
		docs: {
			source: {
				transform: () => buildMultiFrameworkSource(skeletonSnippets.react({}), skeletonSnippets.vue({}))
			}
		}
	},
	argTypes
};

export default meta;

type Story = StoryObj<SkeletonArgs>;

function renderSkeleton() {
	return html`<dv-skeleton></dv-skeleton>`;
}

function renderSkeletonInCard() {
	return html`
		<dv-card style="box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25); border-radius: 8px; width: 400px; height: auto;">
			<div style="width: 100%; margin-bottom: 10px;"><dv-skeleton></dv-skeleton></div>
			<div style="width: 100%; margin-bottom: 10px;"><dv-skeleton></dv-skeleton></div>
			<div style="width: 75%; margin-bottom: 10px;"><dv-skeleton></dv-skeleton></div>
		</dv-card>
	`;
}

export const Playground: Story = {
	decorators: [withFixedSize(300, 150)],
	render: () => renderSkeleton()
};

export const Default: Story = {
	decorators: [withFixedSize(300, 150)],
	parameters: {
		docs: {
			description: {
				story: 'A skeleton loading placeholder for pending content.'
			}
		}
	},
	render: () => renderSkeleton()
};

export const SkeletonInCard: Story = {
	decorators: [withFixedSize(420, 190)],
	parameters: {
		docs: {
			description: {
				story: 'Multiple skeleton lines inside a card to represent loading structured content.'
			}
		}
	},
	render: () => renderSkeletonInCard()
};


