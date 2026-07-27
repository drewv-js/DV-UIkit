import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type SidebarItemArgs = Pick<Components.DvSidebarItem, 'href' | 'active' | 'icon'>;

const sidebarItemSnippets: ComponentSnippets<SidebarItemArgs> = {
	react: (args) => {
		const href = args.href ? ` href="${args.href}"` : '';
		const icon = args.icon ? ` icon="${args.icon}"` : '';
		return `import { DvSidebar, DvSidebarItem } from '@dv-uikit/react';
import { useState } from 'react';

function App() {
	const [activePath, setActivePath] = useState('${args.href || '/home'}');

	const handleSidebarItemClick = (event) => {
		const sidebarItem = event.target;
		setActivePath(sidebarItem.href);
		// Navigate using your router here
	};

	return (
		<DvSidebar>
			<DvSidebarItem${href}${icon} active={activePath === '${args.href || '/home'}'} onSidebarItemClick={handleSidebarItemClick}>
				Home
			</DvSidebarItem>
		</DvSidebar>
	);
}`;
	},
	vue: (args) => {
		const href = args.href ? ` href="${args.href}"` : '';
		const icon = args.icon ? ` icon="${args.icon}"` : '';
		return `<template>
  <dv-sidebar>
    <dv-sidebar-item${href}${icon} :active="activePath === '${args.href || '/home'}'" @sidebar-item-click="handleSidebarItemClick">
      Home
    </dv-sidebar-item>
  </dv-sidebar>
</template>

<script setup>
import { ref } from 'vue';
import { DvSidebar, DvSidebarItem } from '@dv-uikit/vue';

const activePath = ref('${args.href || '/home'}');

const handleSidebarItemClick = (event) => {
	const sidebarItem = event.target;
	activePath.value = sidebarItem.href;
	// Navigate using your router here
};
</script>`;
	}
};

const { argTypes } = getStoryHelpers<SidebarItemArgs>('dv-sidebar-item', {
	excludeCategories: ['properties']
});

const meta: Meta<SidebarItemArgs> = {
	title: 'Components/Sidebar/Sidebar Item',
	component: 'dv-sidebar-item',
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		componentSubtitle: '<DvSidebarItem> | <dv-sidebar-item>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: SidebarItemArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(sidebarItemSnippets.react(args), sidebarItemSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		href: '/home',
		active: false,
		icon: 'house'
	}
};

export default meta;
type Story = StoryObj<SidebarItemArgs>;

function renderCentered(content: unknown) {
	return html`<div style="min-height: 200px; display: flex; align-items: center; justify-content: center;">
		${content}
	</div>`;
}

function renderSidebarItem(args: SidebarItemArgs) {
	return renderCentered(html`
		<dv-sidebar>
			<dv-sidebar-item ?active=${args.active} href=${args.href || '/home'} icon=${args.icon || 'house'}
				>Home</dv-sidebar-item
			>
		</dv-sidebar>
	`);
}

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'A sidebar item in its default (inactive) state. The active state is controlled by the parent via the `active` prop.'
			}
		}
	},
	render: (args) => renderSidebarItem(args)
};

export const Active: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A sidebar item in the active state, indicating the current page or section.'
			}
		}
	},
	args: { active: true, href: '/home', icon: 'house' },
	render: (args) => renderSidebarItem(args)
};


