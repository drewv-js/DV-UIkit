import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getColorGroups } from '../../internal/color';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type BadgeArgs = Components.DvBadge;

const statusColors = getColorGroups(['status']);
const availableVariants = Object.keys(statusColors);

const badgeSnippets: ComponentSnippets<BadgeArgs> = {
	react: (args) => `import { DvBadge } from '@dv-uikit/react';

function App() {
  return <DvBadge color="${args.color}">123</DvBadge>;
}`,
	vue: (args) => `<template>
  <dv-badge color="${args.color}">123</dv-badge>
</template>

<script setup>
import { DvBadge } from '@dv-uikit/vue';
</script>`
};

const { argTypes } = getStoryHelpers<BadgeArgs>('dv-badge', {
	excludeCategories: ['properties']
});

const meta: Meta<BadgeArgs> = {
	title: 'Components/Badge',
	component: 'dv-badge',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvBadge> | <dv-badge>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: BadgeArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(badgeSnippets.react(args), badgeSnippets.vue(args));
				}
			}
		}
	},
	argTypes: {
		...argTypes,
		color: {
			...argTypes.color,
			control: 'select',
			options: availableVariants
		}
	},
	args: {
		color: 'neutral'
	}
};

export default meta;
type Story = StoryObj<BadgeArgs>;

function renderBadge(args: BadgeArgs, content: string = '123') {
	return html`<dv-badge color=${args.color}>${content}</dv-badge>`;
}

export const Playground: Story = {
	render: (args) => renderBadge(args)
};

export const Neutral: Story = {
	args: { color: 'neutral' },
	parameters: { docs: { description: { story: 'Badge with neutral color variant applied.' } } },
	render: (args) => renderBadge(args)
};

export const Info: Story = {
	args: { color: 'info' },
	parameters: { docs: { description: { story: 'Badge with the info color variant applied.' } } },
	render: (args) => renderBadge(args)
};

export const Success: Story = {
	args: { color: 'success' },
	parameters: { docs: { description: { story: 'Badge with the success color variant applied.' } } },
	render: (args) => renderBadge(args)
};

export const Warning: Story = {
	args: { color: 'warning' },
	parameters: { docs: { description: { story: 'Badge with warning color variant applied.' } } },
	render: (args) => renderBadge(args)
};

export const Error: Story = {
	args: { color: 'error' },
	parameters: { docs: { description: { story: 'Badge with error color variant applied.' } } },
	render: (args) => renderBadge(args)
};

export const NoValue: Story = {
	parameters: { docs: { description: { story: 'Default Badge with no value supplied.' } } },
	render: (args) => html`<dv-badge color=${args.color}> </dv-badge>`
};


