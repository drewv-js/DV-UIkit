import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type TabArgs = Components.DvTab;

type TabSnippetOptions = {
	withStartIcon?: boolean;
	withEndIcon?: boolean;
};

const getTabSnippetOptions = (storyId?: string): TabSnippetOptions => ({
	withStartIcon: storyId === 'components-tab-group-tab--with-icons',
	withEndIcon: storyId === 'components-tab-group-tab--with-icons'
});

const buildReactTabSnippet = (args: TabArgs, options: TabSnippetOptions = {}) => {
	const imports = ['DvTab', 'DvTabGroup', 'DvTabPanel'];

	if (options.withStartIcon || options.withEndIcon) {
		imports.push('DvIcon');
	}

	const props = [
		args.panel ? ` panel="${args.panel}"` : '',
		args.active ? ' active' : '',
		args.disabled ? ' disabled' : '',
		args.size === 'sm' ? ` size="sm"` : ''
	].join('');

	const content = [
		options.withStartIcon ? '      <DvIcon slot="startIcon" name="plus" />' : '',
		'      Tab 1',
		options.withEndIcon ? '      <DvIcon slot="endIcon" name="plus" />' : ''
	]
		.filter(Boolean)
		.join('\n');

	return `import { ${imports.join(', ')} } from '@dv-uikit/react';

function App() {
  return (
	<DvTabGroup>
      <DvTab slot="nav"${props}>
        ${content}
      </DvTab>

      <DvTabPanel name="panel-1" active>
        <p>This is an enabled tab.</p>
      </DvTabPanel>
    </DvTabGroup>
  );
}`;
};

const buildVueTabSnippet = (args: TabArgs, options: TabSnippetOptions = {}) => {
	const imports = ['DvTab', 'DvTabGroup', 'DvTabPanel'];

	if (options.withStartIcon || options.withEndIcon) {
		imports.push('DvIcon');
	}

	const props = [
		args.panel ? ` panel="${args.panel}"` : '',
		args.active ? ' active' : '',
		args.disabled ? ' disabled' : '',
		args.size === 'sm' ? ` size="sm"` : ''
	].join('');

	const content = [
		options.withStartIcon ? '    <template #startIcon>\n      <dv-icon name="plus" />\n    </template>' : '',
		'    Tab 1',
		options.withEndIcon ? '    <template #endIcon>\n      <dv-icon name="plus" />\n    </template>' : ''
	]
		.filter(Boolean)
		.join('\n');

	return `<template>
	<dv-tab-group>
      <dv-tab slot="nav"${props}>
        ${content}
      </dv-tab>

      <dv-tab-panel name="panel-1" active>
        <p>This is an enabled tab.</p>
      </dv-tab-panel>
    </dv-tab-group>
</template>

<script setup>
import { ${imports.join(', ')} } from '@dv-uikit/vue';
</script>`;
};

const { argTypes } = getStoryHelpers('dv-tab', {
	excludeCategories: ['properties']
});

const meta: Meta<TabArgs> = {
	title: 'Components/Tab Group/Tab',
	component: 'dv-tab',
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		componentSubtitle: '<DvTab> | <dv-tab>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: TabArgs; id?: string }) => {
					const args = storyContext.args;
					const options = getTabSnippetOptions(storyContext.id);
					return buildMultiFrameworkSource(buildReactTabSnippet(args, options), buildVueTabSnippet(args, options));
				}
			}
		}
	},
	argTypes,
	args: {
		panel: 'panel-1',
		active: true,
		disabled: false,
		size: 'md'
	}
};

export default meta;

type Story = StoryObj<TabArgs>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Interactive tab group demonstrating `dv-tab` with different states and variants.'
			}
		}
	},
	render: (args) => html`
		<dv-tab-group>
			<dv-tab slot="nav" panel="panel-1" ?active=${args.active} ?disabled=${args.disabled} size=${args.size}>
				Tab 1
			</dv-tab>
		</dv-tab-group>
	`
};

export const Default: Story = {
	args: {
		active: true
	},
	parameters: {
		docs: {
			description: {
				story: 'A default tab showing the standard visual appearance in active state.'
			}
		}
	},
	render: (args) => html`
		<dv-tab-group>
			<dv-tab slot="nav" panel="panel-1" ?active=${args.active} ?disabled=${args.disabled} size=${args.size}>
				Tab 1
			</dv-tab>
		</dv-tab-group>
	`
};

export const Active: Story = {
	args: {
		active: true
	},
	parameters: {
		docs: {
			description: {
				story:
					'A tab with the `active` property set to true, showing the selected state with brand color and bottom border.'
			}
		}
	},
	render: (args) => html`
		<dv-tab-group>
			<dv-tab slot="nav" panel="panel-1" ?active=${args.active} ?disabled=${args.disabled} size=${args.size}>
				Tab 1
			</dv-tab>
		</dv-tab-group>
	`
};

export const Disabled: Story = {
	args: {
		disabled: true
	},
	parameters: {
		docs: {
			description: {
				story: 'A disabled tab showing the inactive appearance with reduced opacity and no interaction.'
			}
		}
	},
	render: (args) => html`
		<dv-tab-group>
			<dv-tab slot="nav" panel="panel-2" ?active=${args.active} ?disabled=${args.disabled} size=${args.size}>
				Tab 1
			</dv-tab>
		</dv-tab-group>
	`
};

export const WithIcons: Story = {
	args: {
		active: true
	},
	parameters: {
		docs: {
			description: {
				story: 'A tab with icon slots demonstrating `startIcon` and `endIcon` named slots for icon placeholders.'
			}
		}
	},
	render: (args) => html`
		<dv-tab-group>
			<dv-tab slot="nav" panel="panel-1" ?active=${args.active} ?disabled=${args.disabled} size=${args.size}>
				<dv-icon name="plus" slot="startIcon" size="xs"></dv-icon>
				Tab 1
				<dv-icon name="plus" slot="endIcon" size="xs"></dv-icon>
			</dv-tab>
		</dv-tab-group>
	`
};


