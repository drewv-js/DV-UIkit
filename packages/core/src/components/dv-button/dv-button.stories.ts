import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { buildMultiFrameworkSource, getStoryHelpers } from '../../internal/storybook-helpers';

type ButtonArgs = Omit<Components.DvButton, 'isButtonGroup' | 'setFocus' | 'variant' | 'size'> & {
	variant: NonNullable<Components.DvButton['variant']>;
	size: NonNullable<Components.DvButton['size']>;
};

type ButtonSnippetOptions = {
	withStartIcon?: boolean;
	withEndIcon?: boolean;
};

const getButtonSnippetOptions = (storyId?: string): ButtonSnippetOptions => ({
	withStartIcon: storyId === 'components-button--start-icon' || storyId === 'components-button--start-and-end-icon',
	withEndIcon: storyId === 'components-button--end-icon' || storyId === 'components-button--start-and-end-icon'
});

const buildReactButtonSnippet = (args: ButtonArgs, options: ButtonSnippetOptions = {}) => {
	const imports = ['DvButton'];
	const variant = args.variant ?? 'primary';

	if (options.withStartIcon || options.withEndIcon) {
		imports.push('DvIcon');
	}

	const props = [
		variant !== 'primary' ? ` variant="${variant}"` : '',
		args.disabled ? ' disabled' : '',
		args.loading ? ' loading' : '',
		args.fullWidth ? ' fullWidth' : '',
		args.size !== 'md' ? ` size="${args.size}"` : '',
		args.type !== 'submit' ? ` type="${args.type}"` : '',
		' onClick={handleClick}'
	].join('');

	const content = [
		options.withStartIcon ? '      <DvIcon slot="startIcon" name="plus" />' : '',
		'      Button Text',
		options.withEndIcon ? '      <DvIcon slot="endIcon" name="plus" />' : ''
	]
		.filter(Boolean)
		.join('\n');

	return `import { ${imports.join(', ')} } from '@dv-uikit/react';

function App() {
  const handleClick = () => {};

  return (
    <DvButton${props}>
${content}
    </DvButton>
  );
}`;
};

const buildVueButtonSnippet = (args: ButtonArgs, options: ButtonSnippetOptions = {}) => {
	const imports = ['DvButton'];
	const variant = args.variant ?? 'primary';

	if (options.withStartIcon || options.withEndIcon) {
		imports.push('DvIcon');
	}

	const props = [
		variant !== 'primary' ? ` variant="${variant}"` : '',
		args.disabled ? ' disabled' : '',
		args.loading ? ' loading' : '',
		args.fullWidth ? ' full-width' : '',
		args.size !== 'md' ? ` size="${args.size}"` : '',
		args.type !== 'submit' ? ` type="${args.type}"` : '',
		' @click="handleClick"'
	].join('');

	const content = [
		options.withStartIcon ? '    <template #startIcon>\n      <dv-icon name="plus" />\n    </template>' : '',
		'    Button Text',
		options.withEndIcon ? '    <template #endIcon>\n      <dv-icon name="plus" />\n    </template>' : ''
	]
		.filter(Boolean)
		.join('\n');

	return `<template>
  <dv-button${props}>
${content}
  </dv-button>
</template>

<script setup>
import { ${imports.join(', ')} } from '@dv-uikit/vue';

const handleClick = () => {};
</script>`;
};

const { argTypes } = getStoryHelpers<ButtonArgs>('dv-button', {
	excludeCategories: ['properties']
});

const meta: Meta<ButtonArgs> = {
	title: 'Components/Button',
	component: 'dv-button',
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		componentSubtitle: '<DvButton> | <dv-button>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: ButtonArgs; id?: string }) => {
					const args = storyContext.args;
					const options = getButtonSnippetOptions(storyContext.id);
					return buildMultiFrameworkSource(
						buildReactButtonSnippet(args, options),
						buildVueButtonSnippet(args, options)
					);
				}
			}
		}
	},
	argTypes: {
		...argTypes
	},
	args: {
		variant: 'primary',
		disabled: false,
		loading: false,
		fullWidth: false,
		size: 'md',
		type: 'submit'
	}
};

export default meta;
type Story = StoryObj<ButtonArgs>;

function renderButton(args: ButtonArgs, withStartIcon = false, withEndIcon = false) {
	return html`<div style="width: 100%; text-align: center;">
		<dv-button
			variant=${args.variant ?? 'primary'}
			?disabled=${args.disabled}
			?loading=${args.loading}
			?full-width=${args.fullWidth}
			size=${args.size ?? 'md'}
			type=${args.type}
		>
			${withStartIcon ? html`<dv-icon name="plus" slot="startIcon"></dv-icon>` : null} Button Text
			${withEndIcon ? html`<dv-icon name="plus" slot="endIcon"></dv-icon>` : null}
		</dv-button>
	</div>`;
}

export const Playground: Story = {
	render: (args) => renderButton(args)
};

export const Secondary: Story = {
	args: { variant: 'secondary' },
	parameters: {
		docs: { description: { story: 'A <strong>Secondary</strong> Button. Used as the alternative button on a page.' } }
	},
	render: (args) => renderButton(args)
};

export const Text: Story = {
	args: { variant: 'text' },
	parameters: { docs: { description: { story: 'A <strong>Link</strong> Button used for Links.' } } },
	render: (args) => renderButton(args)
};

export const SmallPrimary: Story = {
	args: { size: 'sm' },
	parameters: {
		docs: {
			description: { story: 'A <strong>small</strong> primary button. Used as the main button on a page.' }
		}
	},
	render: (args) => renderButton(args)
};

export const SmallSecondary: Story = {
	args: { variant: 'secondary', size: 'sm' },
	parameters: {
		docs: {
			description: { story: 'A <strong>small</strong> secondary button. Used as the alternative button on a page.' }
		}
	},
	render: (args) => renderButton(args)
};

export const SmallText: Story = {
	args: { variant: 'text', size: 'sm' },
	parameters: {
		docs: {
			description: { story: 'A <strong>small</strong> text button.' }
		}
	},
	render: (args) => renderButton(args)
};

export const Disabled: Story = {
	args: { disabled: true },
	parameters: { docs: { description: { story: 'A <strong>Disabled</strong> Button.' } } },
	render: (args) => renderButton(args)
};

export const FullWidthPrimary: Story = {
	args: { fullWidth: true },
	parameters: { docs: { description: { story: 'A <strong>Full-width</strong> Primary Button.' } } },
	render: (args) => renderButton(args)
};

export const FullWidthSecondary: Story = {
	args: { variant: 'secondary', fullWidth: true },
	parameters: { docs: { description: { story: 'A <strong>Full-width</strong> Secondary Button.' } } },
	render: (args) => renderButton(args)
};

export const LoadingPrimary: Story = {
	args: { loading: true },
	parameters: { docs: { description: { story: 'A <strong>Loading</strong> Primary Button.' } } },
	render: (args) => renderButton(args)
};

export const LoadingSecondary: Story = {
	args: { variant: 'secondary', loading: true },
	parameters: { docs: { description: { story: 'A <strong>Loading</strong> Secondary Button.' } } },
	render: (args) => renderButton(args)
};

export const StartIcon: Story = {
	parameters: { docs: { description: { story: 'A <strong>Start icon</strong> tag applied to a Primary Button.' } } },
	render: (args) => renderButton(args, true, false)
};

export const EndIcon: Story = {
	args: { variant: 'secondary' },
	parameters: {
		docs: { description: { story: 'An <strong>end icon</strong> applied to a <strong>secondary</strong> button.' } }
	},
	render: (args) => renderButton(args, false, true)
};

export const StartAndEndIcon: Story = {
	args: { variant: 'text' },
	parameters: {
		docs: { description: { story: 'A <strong>start and end icon</strong> applied to a <strong>text</strong> button.' } }
	},
	render: (args) => renderButton(args, true, true)
};
