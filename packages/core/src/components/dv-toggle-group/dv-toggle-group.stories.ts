import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource } from '../../internal/storybook-helpers';

type ToggleGroupArgs = Components.DvToggleGroup;

type Variant = 'labels' | 'icons' | 'icon-only';

const getVariant = (storyId?: string): Variant => {
	if (storyId?.includes('icon-only')) return 'icon-only';
	if (storyId?.includes('icon')) return 'icons';
	return 'labels';
};

const buildReactSnippet = (args: ToggleGroupArgs, variant: Variant) => {
	const props = [
		args.size && args.size !== 'md' ? ` size="${args.size}"` : '',
		args.value ? ` value="${args.value}"` : '',
		args.label ? ` label="${args.label}"` : '',
		' onValueChange={handleValueChange}'
	].join('');

	const imports = variant === 'labels' ? 'DvToggleGroup, DvToggleGroupItem' : 'DvToggleGroup, DvToggleGroupItem, DvIcon';

	let items: string;
	if (variant === 'icons') {
		items = `      <DvToggleGroupItem value="bar" label="Bar">
        <DvIcon slot="startIcon" name="bars" />
      </DvToggleGroupItem>
      <DvToggleGroupItem value="line" label="Line">
        <DvIcon slot="startIcon" name="list" />
      </DvToggleGroupItem>
      <DvToggleGroupItem value="pie" label="Pie">
        <DvIcon slot="startIcon" name="grid" />
      </DvToggleGroupItem>`;
	} else if (variant === 'icon-only') {
		items = `      <DvToggleGroupItem value="bar" aria-label="Bar chart">
        <DvIcon slot="startIcon" name="bars" />
      </DvToggleGroupItem>
      <DvToggleGroupItem value="line" aria-label="Line chart">
        <DvIcon slot="startIcon" name="list" />
      </DvToggleGroupItem>
      <DvToggleGroupItem value="pie" aria-label="Pie chart">
        <DvIcon slot="startIcon" name="grid" />
      </DvToggleGroupItem>`;
	} else {
		items = `      <DvToggleGroupItem value="day" label="Day" />
      <DvToggleGroupItem value="week" label="Week" />
      <DvToggleGroupItem value="month" label="Month" `;
	}

	return `import { ${imports} } from '@dv-uikit/react';

function App() {
  const handleValueChange = (event) => {};

  return (
    <DvToggleGroup${props}>
${items}
    </DvToggleGroup>
  );
}`;
};

const buildVueSnippet = (args: ToggleGroupArgs, variant: Variant) => {
	const props = [
		args.size && args.size !== 'md' ? ` size="${args.size}"` : '',
		args.value ? ` value="${args.value}"` : '',
		args.label ? ` label="${args.label}"` : '',
		' @value-change="handleValueChange"'
	].join('');

	const imports = variant === 'labels' ? 'DvToggleGroup, DvToggleGroupItem' : 'DvToggleGroup, DvToggleGroupItem, DvIcon';

	let items: string;
	if (variant === 'icons') {
		items = `    <dv-toggle-group-item value="bar" label="Bar">
      <template #startIcon>
        <dv-icon name="bars" />
      </template>
    </dv-toggle-group-item>
    <dv-toggle-group-item value="line" label="Line">
      <template #startIcon>
        <dv-icon name="list" />
      </template>
    </dv-toggle-group-item>
    <dv-toggle-group-item value="pie" label="Pie">
      <template #startIcon>
        <dv-icon name="grid" />
      </template>
    </dv-toggle-group-item>`;
	} else if (variant === 'icon-only') {
		items = `    <dv-toggle-group-item value="bar" aria-label="Bar chart">
      <template #startIcon>
        <dv-icon name="bars" />
      </template>
    </dv-toggle-group-item>
    <dv-toggle-group-item value="line" aria-label="Line chart">
      <template #startIcon>
        <dv-icon name="list" />
      </template>
    </dv-toggle-group-item>
    <dv-toggle-group-item value="pie" aria-label="Pie chart">
      <template #startIcon>
        <dv-icon name="grid" />
      </template>
    </dv-toggle-group-item>`;
	} else {
		items = `    <dv-toggle-group-item value="day" label="Day" />
    <dv-toggle-group-item value="week" label="Week" />
    <dv-toggle-group-item value="month" label="Month" />`;
	}

	return `<template>
  <dv-toggle-group${props}>
${items}
  </dv-toggle-group>
</template>

<script setup>
import { ${imports} } from '@dv-uikit/vue';

const handleValueChange = (event) => {};
</script>`;
};

const { argTypes } = getStoryHelpers<ToggleGroupArgs>('dv-toggle-group', {
	excludeCategories: ['properties']
});

const meta: Meta<ToggleGroupArgs> = {
	title: 'Components/Toggle Group',
	component: 'dv-toggle-group',
	tags: ['autodocs'],
	decorators: [(story) => html`<div style="width: 300px; margin: 0 auto;">${story()}</div>`],
	parameters: {
		componentSubtitle: '<DvToggleGroup> | <dv-toggle-group>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: ToggleGroupArgs; id?: string }) => {
					const args = storyContext.args;
					const variant = getVariant(storyContext.id);
					return buildMultiFrameworkSource(buildReactSnippet(args, variant), buildVueSnippet(args, variant));
				}
			}
		}
	},
	argTypes,
	args: {
		size: 'md',
		value: '',
		label: 'Time range'
	}
};

export default meta;
type Story = StoryObj<ToggleGroupArgs>;

function renderGroup(args: ToggleGroupArgs) {
	return html`
		<dv-toggle-group size=${args.size} value=${args.value ?? ''} label=${args.label ?? ''}>
			<dv-toggle-group-item value="day" label="Day"></dv-toggle-group-item>
			<dv-toggle-group-item value="week" label="Week"></dv-toggle-group-item>
			<dv-toggle-group-item value="month" label="Month"></dv-toggle-group-item>
		</dv-toggle-group>
	`;
}

function renderGroupWithIcons(args: ToggleGroupArgs) {
	return html`
		<dv-toggle-group size=${args.size} value=${args.value ?? ''} label=${args.label ?? ''}>
			<dv-toggle-group-item value="bar" label="Bar">
				<dv-icon slot="startIcon" name="bars"></dv-icon>
			</dv-toggle-group-item>
			<dv-toggle-group-item value="line" label="Line">
				<dv-icon slot="startIcon" name="list"></dv-icon>
			</dv-toggle-group-item>
			<dv-toggle-group-item value="pie" label="Pie">
				<dv-icon slot="startIcon" name="grid"></dv-icon>
			</dv-toggle-group-item>
		</dv-toggle-group>
	`;
}

function renderIconOnly(args: ToggleGroupArgs) {
	return html`
		<dv-toggle-group size=${args.size} value=${args.value ?? ''} label=${args.label ?? ''}>
			<dv-toggle-group-item value="bar" aria-label="Bar chart">
				<dv-icon slot="startIcon" name="bars"></dv-icon>
			</dv-toggle-group-item>
			<dv-toggle-group-item value="line" aria-label="Line chart">
				<dv-icon slot="startIcon" name="list"></dv-icon>
			</dv-toggle-group-item>
			<dv-toggle-group-item value="pie" aria-label="Pie chart">
				<dv-icon slot="startIcon" name="grid"></dv-icon>
			</dv-toggle-group-item>
		</dv-toggle-group>
	`;
}

export const Playground: Story = {
	args: { value: 'day' },
	render: (args) => renderGroup(args)
};

export const SmallSize: Story = {
	args: { size: 'sm' },
	parameters: {
		docs: {
			description: { story: 'The <strong>small</strong> size variant for compact layouts.' }
		}
	},
	render: (args) => renderGroup(args)
};

export const WithIcons: Story = {
	args: { value: 'bar', label: 'Chart type' },
	parameters: {
		docs: {
			description: { story: 'Segments with a <strong>start icon</strong> and a label.' }
		}
	},
	render: (args) => renderGroupWithIcons(args)
};

export const WithIconsSmall: Story = {
	args: { size: 'sm', value: 'bar', label: 'Chart type' },
	parameters: {
		docs: {
			description: { story: 'Icon and label segments in the <strong>small</strong> size.' }
		}
	},
	render: (args) => renderGroupWithIcons(args)
};

export const IconOnly: Story = {
	args: { value: 'bar', label: 'Chart type' },
	parameters: {
		docs: {
			description: {
				story:
					'Segments with an <strong>icon only</strong> — no label text. Each item declares an <code>aria-label</code> so assistive technologies still announce a name.'
			}
		}
	},
	render: (args) => renderIconOnly(args)
};


