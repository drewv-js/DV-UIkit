import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type DividerArgs = Components.DvDivider;

const dividerSnippets: ComponentSnippets<DividerArgs> = {
	react: (args) => {
		const variant = args.variant !== 'horizontal' ? ` variant="${args.variant}"` : '';
		return `import { DvDivider } from '@dv-uikit/react';

function App() {
  return <DvDivider${variant} />;
}`;
	},
	vue: (args) => {
		const variant = args.variant !== 'horizontal' ? ` variant="${args.variant}"` : '';
		return `<template>
  <dv-divider${variant} />
</template>

<script setup>
import { DvDivider } from '@dv-uikit/vue';
</script>`;
	}
};

const { argTypes } = getStoryHelpers<DividerArgs>('dv-divider', {
	excludeCategories: ['properties']
});

const meta: Meta<DividerArgs> = {
	title: 'Components/Divider',
	component: 'dv-divider',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvDivider> | <dv-divider>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: DividerArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(dividerSnippets.react(args), dividerSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		variant: 'horizontal'
	}
};

export default meta;

type Story = StoryObj<DividerArgs>;

function renderDivider(args: DividerArgs) {
	return html`
		<div
			style="margin-top: 20px; display: ${
				args.variant === 'horizontal' ? 'block' : 'flex'
			}; align-items: center; height: ${args.variant === 'horizontal' ? 'auto' : '2rem'}"
		>
			<a style="display: inline-block; padding: 8px;">Privacy Policy</a>
			<dv-divider variant=${args.variant}></dv-divider>
			<a style="display: inline-block; padding: 8px;">Terms of Service</a>
		</div>
	`;
}

export const Playground: Story = {
	render: (args) => renderDivider(args)
};

export const Horizontal: Story = {
	args: {
		variant: 'horizontal'
	},
	parameters: {
		docs: {
			description: {
				story: 'A divider that is used for when the content is displayed ontop of one another and need separation.'
			}
		}
	},
	render: (args) => renderDivider(args)
};

export const Vertical: Story = {
	args: {
		variant: 'vertical'
	},
	parameters: {
		docs: {
			description: {
				story: 'A divider that is used for when the content is displayed side by side and need separation.'
			}
		}
	},
	render: (args) => renderDivider(args)
};


