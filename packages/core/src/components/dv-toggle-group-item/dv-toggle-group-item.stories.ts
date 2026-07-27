import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type ToggleGroupItemArgs = Omit<Components.DvToggleGroupItem, 'setFocus'>;

type ItemSnippetOptions = {
	withStartIcon?: boolean;
	iconOnly?: boolean;
};

const getItemSnippetOptions = (storyId?: string): ItemSnippetOptions => ({
	withStartIcon: storyId === 'components-toggle-group-toggle-group-item--with-icon',
	iconOnly: storyId === 'components-toggle-group-toggle-group-item--icon-only'
});

const buildReactSnippet = (args: ToggleGroupItemArgs, options: ItemSnippetOptions = {}) => {
	const useIcon = options.withStartIcon || options.iconOnly;
	const imports = useIcon ? 'DvToggleGroup, DvToggleGroupItem, DvIcon' : 'DvToggleGroup, DvToggleGroupItem';

	// Size and active state are managed by the parent group, so map them onto
	// <DvToggleGroup> rather than the item directly.
	const groupProps = [
		args.size === 'sm' ? ' size="sm"' : '',
		args.active && args.value ? ` value="${args.value}"` : ''
	].join('');

	const itemProps = [
		` value="${args.value ?? ''}"`,
		!options.iconOnly && args.label ? ` label="${args.label}"` : '',
		options.iconOnly ? ' aria-label="Bar chart"' : ''
	].join('');

	const itemBody = useIcon
		? `<DvToggleGroupItem${itemProps}>
        <DvIcon slot="startIcon" name="bars" />
      </DvToggleGroupItem>`
		: `<DvToggleGroupItem${itemProps} />`;

	return `import { ${imports} } from '@dv-uikit/react';

function App() {
  return (
    <DvToggleGroup${groupProps}>
      ${itemBody}
    </DvToggleGroup>
  );
}`;
};

const buildVueSnippet = (args: ToggleGroupItemArgs, options: ItemSnippetOptions = {}) => {
	const useIcon = options.withStartIcon || options.iconOnly;
	const imports = useIcon ? 'DvToggleGroup, DvToggleGroupItem, DvIcon' : 'DvToggleGroup, DvToggleGroupItem';

	const groupProps = [
		args.size === 'sm' ? ' size="sm"' : '',
		args.active && args.value ? ` value="${args.value}"` : ''
	].join('');

	const itemProps = [
		` value="${args.value ?? ''}"`,
		!options.iconOnly && args.label ? ` label="${args.label}"` : '',
		options.iconOnly ? ' aria-label="Bar chart"' : ''
	].join('');

	const itemBody = useIcon
		? `<dv-toggle-group-item${itemProps}>
        <template #startIcon>
          <dv-icon name="bars" />
        </template>
      </dv-toggle-group-item>`
		: `<dv-toggle-group-item${itemProps} />`;

	return `<template>
  <dv-toggle-group${groupProps}>
    ${itemBody}
  </dv-toggle-group>
</template>

<script setup>
import { ${imports} } from '@dv-uikit/vue';
</script>`;
};

// Keep the type around for IDE autocomplete on `snippets.react/vue` if anyone wants it,
// even though variant-specific story IDs drive the actual transform.
const _snippets: ComponentSnippets<ToggleGroupItemArgs> = {
	react: (args) => buildReactSnippet(args),
	vue: (args) => buildVueSnippet(args)
};
void _snippets;

const { argTypes } = getStoryHelpers<ToggleGroupItemArgs>('dv-toggle-group-item', {
	excludeCategories: ['properties']
});

const meta: Meta<ToggleGroupItemArgs> = {
	title: 'Components/Toggle Group/Toggle Group Item',
	component: 'dv-toggle-group-item',
	tags: ['autodocs'],
	decorators: [(story) => html`<div style="width: 100px; margin: 0 auto;">${story()}</div>`],
	parameters: {
		layout: 'padded',
		componentSubtitle: '<DvToggleGroupItem> | <dv-toggle-group-item>',
		docs: {
			source: {
				transform: (_code: string, ctx: { args: ToggleGroupItemArgs; id?: string }) => {
					const args = ctx.args;
					const options = getItemSnippetOptions(ctx.id);
					return buildMultiFrameworkSource(buildReactSnippet(args, options), buildVueSnippet(args, options));
				}
			}
		}
	},
	argTypes,
	args: {
		value: 'day',
		label: 'Day',
		active: false,
		size: 'md'
	}
};

export default meta;
type Story = StoryObj<ToggleGroupItemArgs>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Single standalone toggle group item driven by Storybook controls.'
			}
		}
	},
	render: (args) => html`
		<dv-toggle-group-item
			value=${args.value ?? ''}
			label=${args.label ?? ''}
			?active=${args.active ?? false}
			size=${args.size ?? 'md'}
		></dv-toggle-group-item>
	`
};

export const Active: Story = {
	args: { active: true },
	parameters: {
		docs: {
			description: {
				story: 'Item with the <code>active</code> state.'
			}
		}
	},
	render: (args) => html`
		<dv-toggle-group-item
			value=${args.value ?? ''}
			label=${args.label ?? ''}
			?active=${args.active ?? false}
			size=${args.size ?? 'md'}
		></dv-toggle-group-item>
	`
};

export const SmallSize: Story = {
	args: { size: 'sm' },
	parameters: {
		docs: {
			description: { story: 'The <strong>small</strong> size variant for compact layouts.' }
		}
	},
	render: (args) => html`
		<dv-toggle-group-item
			value=${args.value ?? ''}
			label=${args.label ?? ''}
			?active=${args.active ?? false}
			size=${args.size ?? 'md'}
		></dv-toggle-group-item>
	`
};

export const WithIcon: Story = {
	parameters: {
		docs: {
			description: { story: 'Item with a <strong>start icon</strong> and a label.' }
		}
	},
	render: (args) => html`
		<dv-toggle-group-item
			value=${args.value ?? ''}
			label=${args.label ?? ''}
			?active=${args.active ?? false}
			size=${args.size ?? 'md'}
		>
			<dv-icon slot="startIcon" name="bars"></dv-icon>
		</dv-toggle-group-item>
	`
};

export const IconOnly: Story = {
	args: { label: '' },
	parameters: {
		docs: {
			description: {
				story:
					'Item with an <strong>icon only</strong> — no label text. Set <code>aria-label</code> on the element so assistive technologies announce a name.'
			}
		}
	},
	render: (args) => html`
		<dv-toggle-group-item
			value=${args.value ?? ''}
			aria-label="Bar chart"
			?active=${args.active ?? false}
			size=${args.size ?? 'md'}
		>
			<dv-icon slot="startIcon" name="bars"></dv-icon>
		</dv-toggle-group-item>
	`
};


