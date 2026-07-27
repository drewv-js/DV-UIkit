import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type ListItemArgs = Omit<
	Components.DvListItem,
	'listItemSetFocus' | 'listItemSetSelected' | 'listItemSetRadio' | 'name'
>;

const listItemSnippets: ComponentSnippets<ListItemArgs> = {
	react: (args) => {
		const selected = args.selected ? ' selected' : '';
		const disabled = args.disabled ? ' disabled' : '';
		return `import { DvList, DvListItem } from '@dv-uikit/react';

function App() {
  return (
    <DvList>
      <DvListItem${selected}${disabled} onItemClick={handleItemClick}>
        Item 1
        <template slot="description">This is the description.</template>
      </DvListItem>
    </DvList>
  );
}`;
	},
	vue: (args) => {
		const selected = args.selected ? ' selected' : '';
		const disabled = args.disabled ? ' disabled' : '';
		return `<template>
  <dv-list>
    <dv-list-item${selected}${disabled} @item-click="handleItemClick">
      Item 1
      <template #description>This is the description.</template>
    </dv-list-item>
  </dv-list>
</template>

<script setup>
import { DvList, DvListItem } from '@dv-uikit/vue';

const handleItemClick = (event) => {};
</script>`;
	}
};

const { argTypes } = getStoryHelpers<ListItemArgs>('dv-list-item', {
	excludeCategories: ['properties']
});

const meta: Meta<ListItemArgs> = {
	title: 'Components/List/List Item',
	component: 'dv-list-item',
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		componentSubtitle: '<DvListItem> | <dv-list-item>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: ListItemArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(listItemSnippets.react(args), listItemSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		selected: false,
		disabled: false
	}
};

export default meta;
type Story = StoryObj<ListItemArgs>;

function renderListItem(args: ListItemArgs) {
	return html`
		<dv-list>
			<dv-list-item ?selected=${args.selected} ?disabled=${args.disabled}>
				Item 1
				<div slot="description">This is the description.</div>
			</dv-list-item>
		</dv-list>
	`;
}

export const Playground: Story = {
	parameters: { docs: { description: { story: 'A default list item.' } } },
	render: (args) => renderListItem(args)
};

export const Default: Story = {
	parameters: { docs: { description: { story: 'A default list item.' } } },
	render: (args) => renderListItem(args)
};

export const WithDisabledState: Story = {
	parameters: { docs: { description: { story: 'A list item that is disabled and cannot be selected.' } } },
	render: () => html`
		<dv-list>
			<dv-list-item disabled>
				Item 2 (Disabled)
				<div slot="description">This is the description.</div>
			</dv-list-item>
		</dv-list>
	`
};

export const WithRadioButton: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A list item that displays a radio button when the parent list has showRadio enabled.'
			}
		}
	},
	render: (args) => html`
		<dv-list show-radio="true">
			<dv-list-item ?selected=${args.selected} value="1">
				Item 1 with Radio
				<div slot="description">This is the description.</div>
			</dv-list-item>
		</dv-list>
	`
};


