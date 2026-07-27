import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type SidebarArgs = Pick<Components.DvSidebar, 'label'>;

const sidebarSnippets: ComponentSnippets<SidebarArgs> = {
	react: (args) => {
		const label = args.label ? ` label="${args.label}"` : '';
		return `import { DvSidebar, DvSidebarItem } from '@dv-uikit/react';
import { useState } from 'react';

function App() {
	const [activePath, setActivePath] = useState('/home');

	const handleSidebarItemClick = (event) => {
		const sidebarItem = event.target;
		setActivePath(sidebarItem.href);
    // Navigate using your router here
  };

  return (
		<DvSidebar${label}>
			<DvSidebarItem href="/home" icon="house" active={activePath === '/home'} onSidebarItemClick={handleSidebarItemClick}>Home</DvSidebarItem>
			<DvSidebarItem href="/reports" icon="scroll" active={activePath === '/reports'} onSidebarItemClick={handleSidebarItemClick}>Reports</DvSidebarItem>
			<DvSidebarItem href="/search" icon="magnifying-glass" active={activePath === '/search'} onSidebarItemClick={handleSidebarItemClick}>Search</DvSidebarItem>

			<DvSidebarItem slot="footer" href="/settings" icon="gear" active={activePath === '/settings'} onSidebarItemClick={handleSidebarItemClick}>Settings</DvSidebarItem>
			<DvSidebarItem slot="footer" href="/logout" icon="arrow-right-from-bracket" active={activePath === '/logout'} onSidebarItemClick={handleSidebarItemClick}>Logout</DvSidebarItem>
    </DvSidebar>
  );
}`;
	},
	vue: (args) => {
		const label = args.label ? ` label="${args.label}"` : '';
		return `<template>
	<dv-sidebar${label}>
		<dv-sidebar-item href="/home" icon="house" :active="activePath === '/home'" @sidebar-item-click="handleSidebarItemClick">Home</dv-sidebar-item>
		<dv-sidebar-item href="/reports" icon="scroll" :active="activePath === '/reports'" @sidebar-item-click="handleSidebarItemClick">Reports</dv-sidebar-item>
		<dv-sidebar-item href="/search" icon="magnifying-glass" :active="activePath === '/search'" @sidebar-item-click="handleSidebarItemClick">Search</dv-sidebar-item>

		<dv-sidebar-item slot="footer" href="/settings" icon="gear" :active="activePath === '/settings'" @sidebar-item-click="handleSidebarItemClick">Settings</dv-sidebar-item>
		<dv-sidebar-item slot="footer" href="/logout" icon="arrow-right-from-bracket" :active="activePath === '/logout'" @sidebar-item-click="handleSidebarItemClick">Logout</dv-sidebar-item>
  </dv-sidebar>
</template>

<script setup>
import { ref } from 'vue';
import { DvSidebar, DvSidebarItem } from '@dv-uikit/vue';

const activePath = ref('/home');

const handleSidebarItemClick = (event) => {
	const sidebarItem = event.target;
	activePath.value = sidebarItem.href;
  // Navigate using your router here
};
</script>`;
	}
};

const withFixedHeight = (heightPx: number) => (storyFn: () => unknown) => {
	return html`<div style="height: ${heightPx}px;">${storyFn()}</div>`;
};

const { argTypes } = getStoryHelpers<SidebarArgs>('dv-sidebar', {
	excludeCategories: ['properties']
});

const meta: Meta<SidebarArgs> = {
	title: 'Components/Sidebar',
	component: 'dv-sidebar',
	tags: ['autodocs'],
	decorators: [withFixedHeight(500)],
	parameters: {
		layout: 'fullscreen',
		componentSubtitle: '<DvSidebar> | <dv-sidebar>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: SidebarArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(sidebarSnippets.react(args), sidebarSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		label: 'Sidebar navigation'
	}
};

export default meta;

type Story = StoryObj<SidebarArgs>;

function renderSidebar(args: SidebarArgs) {
	return html`
		<dv-sidebar label=${args.label}>
			<dv-sidebar-item href="/home" icon="house" ?active=${true}>Home</dv-sidebar-item>
			<dv-sidebar-item href="/reports" icon="scroll">Reports</dv-sidebar-item>
			<dv-sidebar-item href="/search" icon="magnifying-glass">Search</dv-sidebar-item>
			<dv-sidebar-item slot="footer" href="/settings" icon="gear">Settings</dv-sidebar-item>
			<dv-sidebar-item slot="footer" href="/logout" icon="arrow-right-from-bracket">Logout</dv-sidebar-item>
		</dv-sidebar>
	`;
}

export const Playground: Story = {
	render: (args) => renderSidebar(args)
};

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Vertical navigation rail with main nav items in the default slot and secondary actions in the `footer` slot. The parent framework controls active state via the `active` prop based on router state. Listen to each item's `sidebarItemClick` event to handle navigation."
			}
		}
	},
	render: (args) => renderSidebar(args)
};

export const WithScroll: Story = {
	decorators: [withFixedHeight(500)],
	parameters: {
		docs: {
			description: {
				story: 'When the sidebar container is too short to display all nav items, sidebar content becomes scrollable.'
			}
		}
	},
	render: (args) => html`
		<dv-sidebar label=${args.label}>
			<dv-sidebar-item href="/home" icon="house" ?active=${true}>Home</dv-sidebar-item>
			<dv-sidebar-item href="/reports" icon="scroll">Reports</dv-sidebar-item>
			<dv-sidebar-item href="/search" icon="magnifying-glass">Search</dv-sidebar-item>
			<dv-sidebar-item href="/analytics" icon="chart-mixed">Analytics</dv-sidebar-item>
			<dv-sidebar-item href="/messages" icon="envelope">Messages</dv-sidebar-item>
			<dv-sidebar-item href="/calendar" icon="calendar">Calendar</dv-sidebar-item>
			<dv-sidebar-item href="/alerts" icon="bell">Alerts</dv-sidebar-item>
			<dv-sidebar-item href="/tasks" icon="list-check">Tasks</dv-sidebar-item>
			<dv-sidebar-item href="/teams" icon="user-plus">Teams</dv-sidebar-item>
			<dv-sidebar-item href="/billing" icon="credit-card">Billing</dv-sidebar-item>
			<dv-sidebar-item href="/insights" icon="file-chart-column">Insights</dv-sidebar-item>
			<dv-sidebar-item href="/integrations" icon="sparkles">Integrations</dv-sidebar-item>
			<dv-sidebar-item href="/support" icon="circle-question">Support</dv-sidebar-item>
			<dv-sidebar-item slot="footer" href="/settings" icon="gear">Settings</dv-sidebar-item>
			<dv-sidebar-item slot="footer" href="/logout" icon="arrow-right-from-bracket">Logout</dv-sidebar-item>
		</dv-sidebar>
	`
};


