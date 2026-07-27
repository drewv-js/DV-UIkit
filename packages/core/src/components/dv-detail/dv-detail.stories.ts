import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type DetailArgs = Omit<Components.DvDetail, 'detailHide' | 'detailShow' | 'setFocus'>;

const detailSnippets: ComponentSnippets<DetailArgs> = {
	react: (args) => {
		const iconPlacement = args.iconPlacement !== 'end' ? ` iconPlacement="${args.iconPlacement}"` : '';
		return `import { DvDetail, DvCard } from '@dv-uikit/react';

function App() {
  return (
    <DvDetail open={${args.open}}${iconPlacement}>
      <div slot="summary">Click Here to Open Details</div>
      <DvCard>Detail content</DvCard>
    </DvDetail>
  );
}`;
	},
	vue: (args) => {
		const iconPlacement = args.iconPlacement !== 'end' ? ` icon-placement="${args.iconPlacement}"` : '';
		return `<template>
  <dv-detail :open="${args.open}"${iconPlacement}>
    <template #summary>Click Here to Open Details</template>
    <dv-card>Detail content</dv-card>
  </dv-detail>
</template>

<script setup>
import { DvDetail, DvCard } from '@dv-uikit/vue';
</script>`;
	}
};

const { argTypes } = getStoryHelpers<DetailArgs>('dv-detail', {
	excludeCategories: ['properties']
});

const meta: Meta<DetailArgs> = {
	title: 'Components/Detail',
	component: 'dv-detail',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvDetail> | <dv-detail>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: DetailArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(detailSnippets.react(args), detailSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		open: false,
		iconPlacement: 'end'
	}
};

export default meta;
type Story = StoryObj<DetailArgs>;

function renderDetail(args: DetailArgs) {
	return html`
		<dv-detail ?open=${args.open} icon-placement=${args.iconPlacement}>
			<div slot="summary">Click Here to Open Details</div>
			<dv-card>
				<div>
					<strong>Details List:</strong>
					<ul style="margin: 8px 0; padding-left: 20px;">
						<li>First item</li>
						<li>Second item</li>
						<li>Third item</li>
					</ul>
				</div>
			</dv-card>
		</dv-detail>
	`;
}

export const Playground: Story = {
	render: (args) => renderDetail(args)
};

export const Default: Story = {
	args: { open: false, iconPlacement: 'end' },
	parameters: {
		docs: {
			description: {
				story: 'A detail component with an end icon by default and a card as content.'
			}
		}
	},
	render: (args) => renderDetail(args)
};

export const StartIcon: Story = {
	args: { iconPlacement: 'start' },
	parameters: {
		docs: {
			description: {
				story: 'A detail component with a start icon and a card as content.'
			}
		}
	},
	render: (args) => renderDetail(args)
};


