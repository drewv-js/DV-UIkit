import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource } from '../../internal/storybook-helpers';

type TabGroupArgs = Omit<Components.DvTabGroup, 'tabGroupShow'>;

type TabGroupSnippetOptions = {
	withDisabled?: boolean;
	withIcons?: boolean;
	scrollingTabs?: boolean;
};

const getTabGroupSnippetOptions = (storyId?: string): TabGroupSnippetOptions => ({
	withDisabled: storyId === 'components-tab-group--with-disabled-tabs',
	withIcons: storyId === 'components-tab-group--with-icons',
	scrollingTabs: storyId === 'components-tab-group--scrolling-tabs'
});

const buildReactTabGroupSnippet = (args: TabGroupArgs, options: TabGroupSnippetOptions = {}) => {
	const imports = ['DvTabGroup', 'DvTab', 'DvTabPanel'];
	if (options.withIcons) imports.push('DvIcon');

	const props = [
		args.noScrollControls ? ' noScrollControls' : '',
		args.size && args.size !== 'md' ? ` size="${args.size}"` : '',
		' onTabShow={handleTabShow}',
		' onTabHide={handleTabHide}'
	].join('');

	if (options.scrollingTabs) {
		imports.push('DvTabControl');
		return `import { ${imports.join(', ')} } from '@dv-uikit/react';

function App() {
  const handleTabShow = (event) => {};
  const handleTabHide = (event) => {};

  return (
    <DvTabGroup${props}>
      {/* Scroll controls (DvTabControl) are automatically rendered when tabs overflow */}
      <DvTab slot="nav" panel="tab-1">Tab 1</DvTab>
      <DvTab slot="nav" panel="tab-2">Tab 2</DvTab>
      {/* ... more tabs ... */}
      <DvTab slot="nav" panel="tab-20">Tab 20</DvTab>
      <DvTabPanel name="tab-1">Content for Tab 1</DvTabPanel>
      <DvTabPanel name="tab-2">Content for Tab 2</DvTabPanel>
      {/* ... more panels ... */}
      <DvTabPanel name="tab-20">Content for Tab 20</DvTabPanel>
    </DvTabGroup>
  );
}`;
	}

	const tabs = [
		options.withIcons
			? '      <DvTab slot="nav" panel="tab-1">\n        <DvIcon slot="startIcon" name="home" />\n        Tab 1\n      </DvTab>'
			: '      <DvTab slot="nav" panel="tab-1">Tab 1</DvTab>',
		options.withDisabled
			? '      <DvTab slot="nav" panel="tab-2" disabled>Tab 2 (Disabled)</DvTab>'
			: '      <DvTab slot="nav" panel="tab-2">Tab 2</DvTab>',
		options.withIcons
			? '      <DvTab slot="nav" panel="tab-3">\n        <DvIcon slot="startIcon" name="cog" />\n        Tab 3\n      </DvTab>'
			: '      <DvTab slot="nav" panel="tab-3">Tab 3</DvTab>',
		options.withDisabled ? '      <DvTab slot="nav" panel="tab-4" disabled>Tab 4 (Disabled)</DvTab>' : '',
		options.withDisabled ? '      <DvTab slot="nav" panel="tab-5">Tab 5</DvTab>' : ''
	]
		.filter(Boolean)
		.join('\n');

	const panels = [
		'      <DvTabPanel name="tab-1">Content for Tab 1</DvTabPanel>',
		'      <DvTabPanel name="tab-2">Content for Tab 2</DvTabPanel>',
		'      <DvTabPanel name="tab-3">Content for Tab 3</DvTabPanel>',
		options.withDisabled ? '      <DvTabPanel name="tab-4">Content for Tab 4</DvTabPanel>' : '',
		options.withDisabled ? '      <DvTabPanel name="tab-5">Content for Tab 5</DvTabPanel>' : ''
	]
		.filter(Boolean)
		.join('\n');

	return `import { ${imports.join(', ')} } from '@dv-uikit/react';

function App() {
  const handleTabShow = (event) => {};
  const handleTabHide = (event) => {};

  return (
    <DvTabGroup${props}>
${tabs}
${panels}
    </DvTabGroup>
  );
}`;
};

const buildVueTabGroupSnippet = (args: TabGroupArgs, options: TabGroupSnippetOptions = {}) => {
	const imports = ['DvTabGroup', 'DvTab', 'DvTabPanel'];
	if (options.withIcons) imports.push('DvIcon');

	const props = [
		args.noScrollControls ? ' no-scroll-controls' : '',
		args.size && args.size !== 'md' ? ` size="${args.size}"` : '',
		' @tab-show="handleTabShow"',
		' @tab-hide="handleTabHide"'
	].join('');

	if (options.scrollingTabs) {
		imports.push('DvTabControl');
		return `<template>
  <dv-tab-group${props}>
    <!-- Scroll controls (DvTabControl) are automatically rendered when tabs overflow -->
    <dv-tab slot="nav" panel="tab-1">Tab 1</dv-tab>
    <dv-tab slot="nav" panel="tab-2">Tab 2</dv-tab>
    <!-- ... more tabs ... -->
    <dv-tab slot="nav" panel="tab-20">Tab 20</dv-tab>
    <dv-tab-panel name="tab-1">Content for Tab 1</dv-tab-panel>
    <dv-tab-panel name="tab-2">Content for Tab 2</dv-tab-panel>
    <!-- ... more panels ... -->
    <dv-tab-panel name="tab-20">Content for Tab 20</dv-tab-panel>
  </dv-tab-group>
</template>

<script setup>
import { ${imports.join(', ')} } from '@dv-uikit/vue';

const handleTabShow = (event) => {};
const handleTabHide = (event) => {};
</script>`;
	}

	const tabs = [
		options.withIcons
			? '    <dv-tab slot="nav" panel="tab-1">\n      <dv-icon slot="startIcon" name="home"></dv-icon>\n      Tab 1\n    </dv-tab>'
			: '    <dv-tab slot="nav" panel="tab-1">Tab 1</dv-tab>',
		options.withDisabled
			? '    <dv-tab slot="nav" panel="tab-2" disabled>Tab 2 (Disabled)</dv-tab>'
			: '    <dv-tab slot="nav" panel="tab-2">Tab 2</dv-tab>',
		options.withIcons
			? '    <dv-tab slot="nav" panel="tab-3">\n      <dv-icon slot="startIcon" name="cog"></dv-icon>\n      Tab 3\n    </dv-tab>'
			: '    <dv-tab slot="nav" panel="tab-3">Tab 3</dv-tab>',
		options.withDisabled ? '    <dv-tab slot="nav" panel="tab-4" disabled>Tab 4 (Disabled)</dv-tab>' : '',
		options.withDisabled ? '    <dv-tab slot="nav" panel="tab-5">Tab 5</dv-tab>' : ''
	]
		.filter(Boolean)
		.join('\n');

	const panels = [
		'    <dv-tab-panel name="tab-1">Content for Tab 1</dv-tab-panel>',
		'    <dv-tab-panel name="tab-2">Content for Tab 2</dv-tab-panel>',
		'    <dv-tab-panel name="tab-3">Content for Tab 3</dv-tab-panel>',
		options.withDisabled ? '    <dv-tab-panel name="tab-4">Content for Tab 4</dv-tab-panel>' : '',
		options.withDisabled ? '    <dv-tab-panel name="tab-5">Content for Tab 5</dv-tab-panel>' : ''
	]
		.filter(Boolean)
		.join('\n');

	return `<template>
  <dv-tab-group${props}>
${tabs}
${panels}
  </dv-tab-group>
</template>

<script setup>
import { ${imports.join(', ')} } from '@dv-uikit/vue';

const handleTabShow = (event) => {};
const handleTabHide = (event) => {};
</script>`;
};

const { argTypes } = getStoryHelpers<TabGroupArgs>('dv-tab-group', {
	excludeCategories: ['properties']
});

const meta: Meta<TabGroupArgs> = {
	title: 'Components/Tab Group',
	component: 'dv-tab-group',
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		componentSubtitle: '<DvTabGroup> | <dv-tab-group>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: TabGroupArgs; id?: string }) => {
					const args = storyContext.args;
					const options = getTabGroupSnippetOptions(storyContext.id);
					return buildMultiFrameworkSource(
						buildReactTabGroupSnippet(args, options),
						buildVueTabGroupSnippet(args, options)
					);
				}
			}
		}
	},
	argTypes,
	args: {
		noScrollControls: false
	}
};

export default meta;
type Story = StoryObj<TabGroupArgs>;

function renderTabGroup(args: TabGroupArgs) {
	return html`
		<dv-tab-group ?no-scroll-controls=${args.noScrollControls} size="${args.size || 'md'}">
			<dv-tab slot="nav" panel="tab-1">Tab 1</dv-tab>
			<dv-tab slot="nav" panel="tab-2">Tab 2</dv-tab>
			<dv-tab slot="nav" panel="tab-3">Tab 3</dv-tab>
			<dv-tab-panel name="tab-1">Content for Tab 1</dv-tab-panel>
			<dv-tab-panel name="tab-2">Content for Tab 2</dv-tab-panel>
			<dv-tab-panel name="tab-3">Content for Tab 3</dv-tab-panel>
		</dv-tab-group>
	`;
}

export const Playground: Story = {
	render: (args) => renderTabGroup(args)
};

export const Default: Story = {
	parameters: {
		docs: { description: { story: 'A default tab group with three tabs and their corresponding content panels.' } }
	},
	render: (args) => renderTabGroup(args)
};

export const NoScrollControls: Story = {
	args: { noScrollControls: true },
	parameters: {
		docs: { description: { story: 'A tab group with scroll arrow controls disabled.' } }
	},
	render: (args) => renderTabGroup(args)
};

export const PreSelectedTab: Story = {
	parameters: {
		docs: { description: { story: 'A tab group with the second tab preselected .' } }
	},
	render: (args) => html`
		<dv-tab-group ?no-scroll-controls=${args.noScrollControls} size="${args.size || 'md'}">
			<dv-tab slot="nav" panel="tab-1">Tab 1</dv-tab>
			<dv-tab slot="nav" panel="tab-2" active>Tab 2</dv-tab>
			<dv-tab slot="nav" panel="tab-3">Tab 3</dv-tab>
			<dv-tab-panel name="tab-1">Content for Tab 1</dv-tab-panel>
			<dv-tab-panel name="tab-2">Content for Tab 2 (pre-selected)</dv-tab-panel>
			<dv-tab-panel name="tab-3">Content for Tab 3</dv-tab-panel>
		</dv-tab-group>
	`
};

export const ScrollingTabs: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A tab group with the second tab preselected .'
			}
		}
	},
	render: (args) => {
		const tabs = Array.from({ length: 20 }, (_, i) => i + 1);
		return html`
			<dv-tab-group ?no-scroll-controls=${args.noScrollControls} size="${args.size || 'md'}">
				${tabs.map((n) => html`<dv-tab slot="nav" panel="scroll-tab-${n}">Tab ${n}</dv-tab>`)}
				${tabs.map((n) => html`<dv-tab-panel name="scroll-tab-${n}">Content for Tab ${n}</dv-tab-panel>`)}
			</dv-tab-group>
		`;
	}
};

export const WithDisabledTabs: Story = {
	parameters: {
		docs: { description: { story: 'A tab group demonstrating disabled tab with two tabs and their content.' } }
	},
	render: (args) => html`
		<dv-tab-group ?no-scroll-controls=${args.noScrollControls} size="${args.size || 'md'}">
			<dv-tab slot="nav" panel="tab-1">Tab 1</dv-tab>
			<dv-tab slot="nav" panel="tab-2" disabled>Tab 2 (Disabled)</dv-tab>
			<dv-tab slot="nav" panel="tab-3">Tab 3</dv-tab>
			<dv-tab slot="nav" panel="tab-4" disabled>Tab 4 (Disabled)</dv-tab>
			<dv-tab slot="nav" panel="tab-5">Tab 5</dv-tab>
			<dv-tab-panel name="tab-1">Content for Tab 1</dv-tab-panel>
			<dv-tab-panel name="tab-2">Content for Tab 2</dv-tab-panel>
			<dv-tab-panel name="tab-3">Content for Tab 3</dv-tab-panel>
			<dv-tab-panel name="tab-4">Content for Tab 4</dv-tab-panel>
			<dv-tab-panel name="tab-5">Content for Tab 5</dv-tab-panel>
		</dv-tab-group>
	`
};

export const WithIcons: Story = {
	parameters: {
		docs: { description: { story: 'A tab group with icons in the tab labels using the startIcon and endIcon slots.' } }
	},
	render: (args) => {
		const iconSize = args.size === 'sm' ? 'xs' : 'md';
		return html`
			<dv-tab-group ?no-scroll-controls=${args.noScrollControls} size="${args.size || 'md'}">
				<dv-tab slot="nav" panel="tab-1">
					<dv-icon slot="startIcon" name="home" size="${iconSize}"></dv-icon>
					Home
				</dv-tab>
				<dv-tab slot="nav" panel="tab-2">
					<dv-icon slot="startIcon" name="cog" size="${iconSize}"></dv-icon>
					Settings
				</dv-tab>
				<dv-tab slot="nav" panel="tab-3">
					<dv-icon slot="startIcon" name="user" size="${iconSize}"></dv-icon>
					Profile
				</dv-tab>
				<dv-tab-panel name="tab-1">Content for Home Tab</dv-tab-panel>
				<dv-tab-panel name="tab-2">Content for Settings Tab</dv-tab-panel>
				<dv-tab-panel name="tab-3">Content for Profile Tab</dv-tab-panel>
			</dv-tab-group>
		`;
	}
};

export const SmallSize: Story = {
	args: { size: 'sm' },
	parameters: {
		docs: {
			description: {
				story: 'A tab group demonstrating the small size variant with two tabs and their content.'
			}
		}
	},
	render: (args) => html`
		<dv-tab-group size="${args.size || 'md'}">
			<dv-tab slot="nav" panel="md-1">Tab 1</dv-tab>
			<dv-tab slot="nav" panel="md-2">Tab 2</dv-tab>
			<dv-tab-panel name="md-1">Content for Tab 1</dv-tab-panel>
			<dv-tab-panel name="md-2">Content for Tab 2</dv-tab-panel>
		</dv-tab-group>
	`
};


