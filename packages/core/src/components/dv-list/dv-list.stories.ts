import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type ListArgs = Omit<Components.DvList, 'listSetSelectedItem'>;

const listSnippets: ComponentSnippets<ListArgs> = {
	react: (args) => {
		const label = args.label ? `\n      label="${args.label}"` : '';
		const name = args.name ? `\n      name="${args.name}"` : '';
		const showRadio = args.showRadio ? ' showRadio' : '';
		const required = args.required ? ' required' : '';
		const helpText = args.helpText ? `\n      helpText="${args.helpText}"` : '';
		const errorText = args.errorText ? `\n      errorText="${args.errorText}"` : '';
		return `import { DvList, DvListItem } from '@dv-uikit/react';

function App() {
  return (
    <DvList${label}${name}${showRadio}${required}${helpText}${errorText}
      onItemSelected={handleItemSelected}
      onValueChange={handleValueChange}
    >
      <DvListItem value="1">Item 1</DvListItem>
      <DvListItem value="2">Item 2</DvListItem>
      <DvListItem value="3">Item 3</DvListItem>
    </DvList>
  );
}`;
	},
	vue: (args) => {
		const label = args.label ? `\n    label="${args.label}"` : '';
		const name = args.name ? `\n    name="${args.name}"` : '';
		const showRadio = args.showRadio ? ' show-radio' : '';
		const required = args.required ? ' required' : '';
		const helpText = args.helpText ? `\n    help-text="${args.helpText}"` : '';
		const errorText = args.errorText ? `\n    error-text="${args.errorText}"` : '';
		return `<template>
  <dv-list${label}${name}${showRadio}${required}${helpText}${errorText}
    @item-selected="handleItemSelected"
    @value-change="handleValueChange"
  >
    <dv-list-item value="1">Item 1</dv-list-item>
    <dv-list-item value="2">Item 2</dv-list-item>
    <dv-list-item value="3">Item 3</dv-list-item>
  </dv-list>
</template>

<script setup>
import { DvList, DvListItem } from '@dv-uikit/vue';

const handleItemSelected = (event) => {};
const handleValueChange = (event) => {};
</script>`;
	}
};

const { argTypes } = getStoryHelpers<ListArgs>('dv-list', {
	excludeCategories: ['properties']
});

const meta: Meta<ListArgs> = {
	title: 'Components/List',
	component: 'dv-list',
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		componentSubtitle: '<DvList> | <dv-list>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: ListArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(listSnippets.react(args), listSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		label: '',
		name: '',
		showRadio: false,
		required: false,
		helpText: '',
		errorText: ''
	}
};

export default meta;
type Story = StoryObj<ListArgs>;

function listItems() {
	return html`
		<dv-list-item value="1"
			>Item 1
			<div slot="description">This is the description for item 1.</div></dv-list-item
		>
		<dv-list-item value="2"
			>Item 2
			<div slot="description">This is the description for item 2.</div></dv-list-item
		>
		<dv-list-item value="3"
			>Item 3
			<div slot="description">This is the description for item 3.</div></dv-list-item
		>
	`;
}

function renderList(args: ListArgs) {
	return html`
		<dv-list
			label=${args.label}
			name=${args.name}
			?show-radio=${args.showRadio}
			?required=${args.required}
			help-text=${args.helpText}
			error-text=${args.errorText}
		>
			${listItems()}
		</dv-list>
	`;
}

export const Playground: Story = {
	render: (args) => renderList(args)
};

export const Default: Story = {
	parameters: { docs: { description: { story: 'A basic list with selectable items.' } } },
	render: (args) => renderList(args)
};

export const LabelText: Story = {
	args: { label: 'Labeled List' },
	parameters: { docs: { description: { story: 'A list with a label displayed above it.' } } },
	render: (args) => renderList(args)
};

export const HelpText: Story = {
	args: { helpText: 'This is some helpful information' },
	parameters: { docs: { description: { story: 'A list with help text displayed below.' } } },
	render: (args) => renderList(args)
};

export const Required: Story = {
	args: { label: 'Required List', required: true },
	parameters: { docs: { description: { story: 'A list that requires a selection to be made.' } } },
	render: (args) => renderList(args)
};

export const Error: Story = {
	args: { errorText: 'This field has an error', label: 'Error List' },
	parameters: { docs: { description: { story: 'A list in an error state with error text displayed.' } } },
	render: (args) => renderList(args)
};

export const RadioButtons: Story = {
	args: { showRadio: true, label: 'Radio List' },
	parameters: { docs: { description: { story: 'A list that shows radio buttons alongside each item.' } } },
	render: (args) => renderList(args)
};

export const RadioButtonsDisabled: Story = {
	args: { showRadio: true, label: 'Disabled Radio List' },
	parameters: {
		docs: { description: { story: 'A list with radio buttons where some items are disabled.' } }
	},
	render: (args) => html`
		<dv-list label=${args.label} ?show-radio=${args.showRadio}>
			<dv-list-item value="1"
				>Item 1
				<div slot="description">Description 1</div></dv-list-item
			>
			<dv-list-item value="2" disabled
				>Item 2 (Disabled)
				<div slot="description">Description 2</div></dv-list-item
			>
			<dv-list-item value="3"
				>Item 3
				<div slot="description">Description 3</div></dv-list-item
			>
		</dv-list>
	`
};


