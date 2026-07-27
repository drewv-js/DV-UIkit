import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getColorGroups } from '../../internal/color';
import { getStoryHelpers, buildMultiFrameworkSource } from '../../internal/storybook-helpers';

type TagArgs = Components.DvTag;

const statusColors = getColorGroups(['status']);
const availableVariants = Object.keys(statusColors)
	.filter((key) => key !== 'info')
	.map((key) => (key === 'neutral' ? 'default' : key));

type TagSnippetOptions = {
	withStartIcon?: boolean;
};

const getTagSnippetOptions = (storyId?: string): TagSnippetOptions => ({
	withStartIcon: storyId === 'components-tag--with-start-icon'
});

const buildReactTagSnippet = (args: TagArgs, options: TagSnippetOptions = {}) => {
	const dismissible = args.dismissible ? ' dismissible' : '';
	const color = String(args.color);
	if (options.withStartIcon) {
		return `import { DvTag, DvIcon } from '@dv-uikit/react';

function App() {
  return (
    <DvTag color="${color}"${dismissible}>
      <DvIcon slot="startIcon" name="house" />
      Content
    </DvTag>
  );
}`;
	}
	return `import { DvTag } from '@dv-uikit/react';

function App() {
  return <DvTag color="${color}"${dismissible}>Content</DvTag>;
}`;
};

const buildVueTagSnippet = (args: TagArgs, options: TagSnippetOptions = {}) => {
	const dismissible = args.dismissible ? ' dismissible' : '';
	const color = String(args.color);
	if (options.withStartIcon) {
		return `<template>
  <dv-tag color="${color}"${dismissible}>
    <template #startIcon>
      <dv-icon name="house" />
    </template>
    Content
  </dv-tag>
</template>

<script setup>
import { DvTag, DvIcon } from '@dv-uikit/vue';
</script>`;
	}
	return `<template>
  <dv-tag color="${color}"${dismissible}>Content</dv-tag>
</template>

<script setup>
import { DvTag } from '@dv-uikit/vue';
</script>`;
};

const { argTypes } = getStoryHelpers<TagArgs>('dv-tag', {
	excludeCategories: ['properties']
});
const colorArgType = argTypes['color'] as any;

const meta: Meta<TagArgs> = {
	title: 'Components/Tag',
	component: 'dv-tag',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvTag> | <dv-tag>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: TagArgs; id?: string }) => {
					const args = storyContext.args;
					const options = getTagSnippetOptions(storyContext.id);
					return buildMultiFrameworkSource(buildReactTagSnippet(args, options), buildVueTagSnippet(args, options));
				}
			}
		}
	},
	argTypes: {
		...argTypes,
		color: {
			...colorArgType,
			control: 'select',
			options: availableVariants,
			table: {
				...(colorArgType?.table ?? {})
			}
		}
	},
	args: {
		color: 'default',
		dismissible: false
	}
};

export default meta;
type Story = StoryObj<TagArgs>;

function renderTag(args: TagArgs, withStartIcon = false) {
	return html`<dv-tag color=${args.color} ?dismissible=${args.dismissible}>
		${withStartIcon ? html`<dv-icon name="house" slot="startIcon" size="xs"></dv-icon>` : null} Content
	</dv-tag>`;
}

export const Playground: Story = {
	render: (args) => renderTag(args)
};

export const Default: Story = {
	args: { color: 'default', dismissible: false },
	parameters: {
		docs: {
			description: {
				story: 'Tag with default color variant and the option to be closable and have a start icon.'
			}
		}
	},
	render: (args) => renderTag(args)
};

export const Success: Story = {
	args: { color: 'success', dismissible: false },
	parameters: { docs: { description: { story: 'Tag with success color variant applied.' } } },
	render: (args) => renderTag(args)
};

export const Warning: Story = {
	args: { color: 'warning', dismissible: false },
	parameters: { docs: { description: { story: 'Tag with warning color variant applied.' } } },
	render: (args) => renderTag(args)
};

export const Error: Story = {
	args: { color: 'error', dismissible: false },
	parameters: { docs: { description: { story: 'Tag with error color variant applied.' } } },
	render: (args) => renderTag(args)
};

export const Dismissible: Story = {
	args: { color: 'default', dismissible: true },
	parameters: { docs: { description: { story: 'Default tag that is dismissible.' } } },
	render: (args) => renderTag(args)
};

export const WithStartIcon: Story = {
	args: { color: 'default', dismissible: false },
	parameters: { docs: { description: { story: 'Default tag with a start icon applied.' } } },
	render: (args) => renderTag(args, true)
};


