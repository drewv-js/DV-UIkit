import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

const withFixedHeight = (heightPx: number) => (storyFn: () => unknown) => {
	return html`
		<div style="height: ${heightPx}px; display:flex; justify-content:center; width:300px;">${storyFn()}</div>
	`;
};

type DropdownArgs = Components.DvDropdown;

const dropdownSnippets: ComponentSnippets<DropdownArgs> = {
	react: (args) => {
		const placement = args.placement !== 'bottom' ? ` placement="${args.placement}"` : '';
		const disabled = args.disabled ? ' disabled' : '';
		return `import { DvDropdown, DvButton, DvMenu, DvMenuLabel, DvMenuItem, DvDivider } from '@dv-uikit/react';

function App() {
  return (
    <DvDropdown${placement}${disabled}>
      <DvButton variant="primary" slot="trigger">Open Dropdown</DvButton>
      <DvMenu>
        <DvMenuLabel>First Grouping of Items</DvMenuLabel>
        <DvMenuItem value="1">Menu Item 1</DvMenuItem>
        <DvMenuItem value="2">Menu Item 2</DvMenuItem>
        <DvDivider />
        <DvMenuLabel>Second Grouping of Items</DvMenuLabel>
        <DvMenuItem value="3">Menu Item 3</DvMenuItem>
        <DvMenuItem value="4">Menu Item 4</DvMenuItem>
      </DvMenu>
    </DvDropdown>
  );
}`;
	},
	vue: (args) => {
		const placement = args.placement !== 'bottom' ? ` placement="${args.placement}"` : '';
		const disabled = args.disabled ? ' disabled' : '';
		return `<template>
  <dv-dropdown${placement}${disabled}>
    <template #trigger>
      <dv-button variant="primary">Open Dropdown</dv-button>
    </template>
    <dv-menu>
      <dv-menu-label>First Grouping of Items</dv-menu-label>
      <dv-menu-item value="1">Menu Item 1</dv-menu-item>
      <dv-menu-item value="2">Menu Item 2</dv-menu-item>
      <dv-divider></dv-divider>
      <dv-menu-label>Second Grouping of Items</dv-menu-label>
      <dv-menu-item value="3">Menu Item 3</dv-menu-item>
      <dv-menu-item value="4">Menu Item 4</dv-menu-item>
    </dv-menu>
  </dv-dropdown>
</template>

<script setup>
import { DvDropdown, DvButton, DvMenu, DvMenuLabel, DvMenuItem, DvDivider } from '@dv-uikit/vue';
</script>`;
	}
};

const { argTypes } = getStoryHelpers<DropdownArgs>('dv-dropdown', {
	excludeCategories: ['properties']
});

const meta: Meta<DropdownArgs> = {
	title: 'Components/Dropdown',
	component: 'dv-dropdown',
	tags: ['autodocs'],
	decorators: [withFixedHeight(400)],
	parameters: {
		componentSubtitle: '<DvDropdown> | <dv-dropdown>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: DropdownArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(dropdownSnippets.react(args), dropdownSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		open: false,
		placement: 'bottom',
		disabled: false
	}
};

export default meta;
type Story = StoryObj<DropdownArgs>;

function renderDropdown(args: DropdownArgs) {
	return html`
		<dv-dropdown ?open=${args.open} placement=${args.placement} ?disabled=${args.disabled}>
			<dv-button variant="primary" slot="trigger">Open Dropdown</dv-button>
			<dv-menu>
				<dv-menu-label>First Grouping of Items</dv-menu-label>
				<dv-menu-item value="1">The Top of the List (Menu Item 1)</dv-menu-item>
				<dv-menu-item value="2">Menu Item 2</dv-menu-item>
				<dv-divider></dv-divider>
				<dv-menu-label>Second Grouping of Items</dv-menu-label>
				<dv-menu-item value="3">Menu Item 3</dv-menu-item>
				<dv-menu-item value="4">Menu Item Four (4)</dv-menu-item>
				<dv-menu-item value="5">Menu Item 5</dv-menu-item>
				<dv-menu-item value="6">This One is the Sixth Menu Item</dv-menu-item>
			</dv-menu>
		</dv-dropdown>
	`;
}

export const Playground: Story = {
	render: (args) => renderDropdown(args)
};

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A basic dropdown using a button as the trigger and showing a menu when clicked.'
			}
		}
	},
	render: (args) => renderDropdown(args)
};

export const Disabled: Story = {
	args: { open: true, disabled: true },
	parameters: {
		docs: {
			description: {
				story: 'A disabled dropdown that will not open the panel when the trigger is clicked.'
			}
		}
	},
	render: (args) => html`
		<dv-dropdown ?open=${args.open} placement=${args.placement} ?disabled=${args.disabled}>
			<dv-button variant="primary" slot="trigger">Open Dropdown (It Won't)</dv-button>
			<div
				style="width: 200px; border-radius: 8px; border: 2px solid #BFC4CD; padding: 2px; font-size:14px; text-align: center"
			>
				Dropdown Panel Content Here
			</div>
		</dv-dropdown>
	`
};


