import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { getStoryHelpers, buildMultiFrameworkSource } from '../../internal/storybook-helpers';

const withFixedHeight = (heightPx: number) => (storyFn: () => unknown) => {
	return html`<div style="height: ${heightPx}px;">${storyFn()}</div>`;
};

type MenuArgs = Record<string, never>;

function buildReactMenuSnippet(withIcons: boolean): string {
	if (withIcons) {
		return `import { DvMenu, DvMenuLabel, DvMenuItem, DvDivider, DvIcon } from '@dv-uikit/react';

function App() {
  return (
    <DvMenu onMenuSelect={handleMenuSelect}>
      <DvMenuLabel>First Grouping of Items w/icons</DvMenuLabel>
      <DvMenuItem value="1">
        <DvIcon slot="startIcon" name="user" color="brand" />
        Menu Item 1 w/icon
      </DvMenuItem>
      <DvMenuItem value="2">
        <DvIcon slot="startIcon" name="comments" color="brand" />
        Menu Item w/start and end icon
        <DvIcon slot="endIcon" name="close" color="brand" />
      </DvMenuItem>
      <DvDivider />
      <DvMenuLabel>Second Grouping of Items</DvMenuLabel>
      <DvMenuItem value="3">Menu Item 3</DvMenuItem>
      <DvMenuItem value="4">Menu Item 4</DvMenuItem>
      <DvMenuItem value="5">Menu Item 5</DvMenuItem>
    </DvMenu>
  );
}`;
	}
	return `import { DvMenu, DvMenuLabel, DvMenuItem } from '@dv-uikit/react';

function App() {
  return (
    <DvMenu onMenuSelect={handleMenuSelect}>
      <DvMenuLabel>First Grouping of Items</DvMenuLabel>
      <DvMenuItem value="1">Menu Item 1</DvMenuItem>
      <DvMenuItem value="2">Menu Item 2</DvMenuItem>
      <DvMenuItem value="3">Menu Item 3</DvMenuItem>
    </DvMenu>
  );
}`;
}

function buildVueMenuSnippet(withIcons: boolean): string {
	if (withIcons) {
		return `<template>
  <dv-menu @menu-select="handleMenuSelect">
    <dv-menu-label>First Grouping of Items w/icons</dv-menu-label>
    <dv-menu-item value="1">
      <dv-icon slot="startIcon" name="user" color="brand"></dv-icon>
      Menu Item 1 w/icon
    </dv-menu-item>
    <dv-menu-item value="2">
      <dv-icon slot="startIcon" name="comments" color="brand"></dv-icon>
      Menu Item w/start and end icon
      <dv-icon slot="endIcon" name="close" color="brand"></dv-icon>
    </dv-menu-item>
    <dv-divider></dv-divider>
    <dv-menu-label>Second Grouping of Items</dv-menu-label>
    <dv-menu-item value="3">Menu Item 3</dv-menu-item>
    <dv-menu-item value="4">Menu Item 4</dv-menu-item>
    <dv-menu-item value="5">Menu Item 5</dv-menu-item>
  </dv-menu>
</template>

<script setup>
import { DvMenu, DvMenuLabel, DvMenuItem, DvDivider, DvIcon } from '@dv-uikit/vue';

const handleMenuSelect = (event) => {};
</script>`;
	}
	return `<template>
  <dv-menu @menu-select="handleMenuSelect">
    <dv-menu-label>First Grouping of Items</dv-menu-label>
    <dv-menu-item value="1">Menu Item 1</dv-menu-item>
    <dv-menu-item value="2">Menu Item 2</dv-menu-item>
    <dv-menu-item value="3">Menu Item 3</dv-menu-item>
  </dv-menu>
</template>

<script setup>
import { DvMenu, DvMenuLabel, DvMenuItem } from '@dv-uikit/vue';

const handleMenuSelect = (event) => {};
</script>`;
}

const { argTypes } = getStoryHelpers('dv-menu', {
	excludeCategories: ['properties']
});

const meta: Meta<MenuArgs> = {
	title: 'Components/Menu',
	component: 'dv-menu',
	tags: ['autodocs'],
	decorators: [withFixedHeight(250)],
	parameters: {
		componentSubtitle: '<DvMenu> | <dv-menu>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: MenuArgs; id?: string }) => {
					const withIcons = storyContext.id === 'components-menu--menu-with-start-and-end-icon-plus-divider';
					return buildMultiFrameworkSource(buildReactMenuSnippet(withIcons), buildVueMenuSnippet(withIcons));
				}
			}
		}
	},
	argTypes,
	args: {}
};

export default meta;
type Story = StoryObj<MenuArgs>;

export const Playground: Story = {
	parameters: { docs: { description: { story: 'A simple menu displayed directly in the container.' } } },
	render: () => html`
		<dv-menu>
			<dv-menu-label>This is a menu label</dv-menu-label>
			<dv-menu-item value="1">Menu Item 1</dv-menu-item>
			<dv-menu-item value="2">Menu Item 2</dv-menu-item>
		</dv-menu>
	`
};

export const Default: Story = {
	parameters: { docs: { description: { story: 'A simple menu displayed directly in the container.' } } },
	render: () => html`
		<dv-menu>
			<dv-menu-label>This is a menu label</dv-menu-label>
			<dv-menu-item value="1">Menu Item 1</dv-menu-item>
			<dv-menu-item value="2">Menu Item 2</dv-menu-item>
		</dv-menu>
	`
};

export const MenuWithStartAndEndIconPlusDivider: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A more refined example of a menu utilizing the divider component as well as start and end icon slot.'
			}
		}
	},
	render: () => html`
		<dv-menu>
			<dv-menu-label>First Grouping of Items w/icons</dv-menu-label>
			<dv-menu-item value="1">
				<dv-icon name="user" color="brand" slot="startIcon"></dv-icon>
				Menu Item 1 w/icon
			</dv-menu-item>
			<dv-menu-item value="2">
				<dv-icon name="comments" color="brand" slot="startIcon"></dv-icon>
				Menu Item w/start and end icon
				<dv-icon name="close" color="brand" slot="endIcon"></dv-icon>
			</dv-menu-item>
			<dv-divider></dv-divider>
			<dv-menu-label>Second Grouping of Items</dv-menu-label>
			<dv-menu-item value="3">Menu Item 3</dv-menu-item>
			<dv-menu-item value="4">Menu Item 4</dv-menu-item>
			<dv-menu-item value="5">Menu Item 5</dv-menu-item>
		</dv-menu>
	`
};

export const MenuWithAnchorLinks: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Menu items can render as anchor links using the `href` prop. This provides native link semantics (right-click "Open in new tab", accessible link role) while preserving the menu item appearance.'
			},
			source: {
				transform: () =>
					buildMultiFrameworkSource(
						`import { DvMenu, DvMenuItem } from '@dv-uikit/react';

function App() {
  return (
    <DvMenu>
      <DvMenuItem href="/#" value="dashboard">Dashboard</DvMenuItem>
      <DvMenuItem href="/#" value="settings">Settings</DvMenuItem>
      <DvMenuItem href="/#" value="profile">Profile</DvMenuItem>
    </DvMenu>
  );
}`,
						`<template>
  <dv-menu>
    <dv-menu-item href="/#" value="dashboard">Dashboard</dv-menu-item>
    <dv-menu-item href="/#" value="settings">Settings</dv-menu-item>
    <dv-menu-item href="/#" value="profile">Profile</dv-menu-item>
  </dv-menu>
</template>

<script setup>
import { DvMenu, DvMenuItem } from '@dv-uikit/vue';
</script>`
					)
			}
		}
	},
	render: () => html`
		<dv-menu>
			<dv-menu-item href="/#" value="dashboard">Dashboard</dv-menu-item>
			<dv-menu-item href="/#" value="settings">Settings</dv-menu-item>
			<dv-menu-item href="/#" value="profile">Profile</dv-menu-item>
		</dv-menu>
	`
};


