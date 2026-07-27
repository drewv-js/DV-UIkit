import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ref } from 'lit/directives/ref.js';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

const withTooltipPadding = (storyFn: () => unknown) => {
	return html`
		<div style="height: 200px; padding-top: 80px; padding-left: 80px; padding-right: 80px">${storyFn()}</div>
	`;
};

type TooltipArgs = Omit<Components.DvTooltip, 'tooltipHide' | 'tooltipShow'>;

const tooltipSnippets: ComponentSnippets<TooltipArgs> = {
	react: (args) => {
		const boolProps = [args.disabled ? ' disabled' : '', args.hoist ? ' hoist' : ''].join('');
		const placement = args.placement !== 'top' ? `\n      placement="${args.placement}"` : '';
		const trigger = args.trigger !== 'hover focus' ? `\n      trigger="${args.trigger}"` : '';
		const maxWidth = args.maxWidth ? `\n      maxWidth={${args.maxWidth}}` : '';
		return `import { DvTooltip, DvButton } from '@dv-uikit/react';

function App() {
  return (
    <DvTooltip
      content="${args.content}"${placement}${trigger}${maxWidth}${boolProps}
      onShow={handleShow}
      onHide={handleHide}
    >
      <DvButton>Target</DvButton>
    </DvTooltip>
  );
}`;
	},
	vue: (args) => {
		const boolAttrs = [args.disabled ? ' disabled' : '', args.hoist ? ' hoist' : ''].join('');
		const placement = args.placement !== 'top' ? `\n    placement="${args.placement}"` : '';
		const trigger = args.trigger !== 'hover focus' ? `\n    trigger="${args.trigger}"` : '';
		const maxWidth = args.maxWidth ? `\n    :max-width="${args.maxWidth}"` : '';
		return `<template>
  <dv-tooltip
    content="${args.content}"${placement}${trigger}${maxWidth}${boolAttrs}
    @show="handleShow"
    @hide="handleHide"
  >
    <dv-button>Target</dv-button>
  </dv-tooltip>
</template>

<script setup>
import { DvTooltip, DvButton } from '@dv-uikit/vue';

const handleShow = () => {};
const handleHide = () => {};
</script>`;
	}
};

const { argTypes } = getStoryHelpers<TooltipArgs>('dv-tooltip', {
	excludeCategories: ['properties']
});

const meta: Meta<TooltipArgs> = {
	title: 'Components/Tooltip',
	component: 'dv-tooltip',
	tags: ['autodocs'],
	decorators: [withTooltipPadding],
	parameters: {
		componentSubtitle: '<DvTooltip> | <dv-tooltip>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: TooltipArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(tooltipSnippets.react(args), tooltipSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		content: 'This is a tooltip!',
		placement: 'top',
		open: false,
		disabled: false,
		hoist: false,
		trigger: 'hover focus',
		maxWidth: 20
	}
};

export default meta;
type Story = StoryObj<TooltipArgs>;

function renderTooltip(args: TooltipArgs) {
	return html`
		<dv-tooltip
			content=${args.content}
			placement=${args.placement}
			?open=${args.open}
			?disabled=${args.disabled}
			?hoist=${args.hoist}
			trigger=${args.trigger}
			max-width=${args.maxWidth}
		>
			<dv-button>Target</dv-button>
		</dv-tooltip>
	`;
}

export const Playground: Story = {
	render: (args) => renderTooltip(args)
};

export const DefaultTooltip: Story = {
	parameters: {
		docs: { description: { story: 'A tooltip that displays when hovered or focused.' } }
	},
	render: (args) => renderTooltip(args)
};

export const DisabledTooltip: Story = {
	args: { disabled: true },
	parameters: {
		docs: { description: { story: 'A disabled tooltip, which prevents the tooltip from opening.' } }
	},
	render: (args) => renderTooltip(args)
};

export const MaxWidth: Story = {
	args: {
		content: 'This is a long tooltip. A very long tooltip with a lot of content.',
		maxWidth: 10
	},
	parameters: {
		docs: {
			description: {
				story: 'A tooltip with a maximum width, allowing the contents to wrap onto multiple lines.'
			}
		}
	},
	render: (args) => renderTooltip(args)
};

export const ClickTrigger: Story = {
	args: { trigger: 'click' },
	parameters: {
		docs: { description: { story: 'A tooltip with a click trigger.' } }
	},
	render: (args) => renderTooltip(args)
};

export const ManualTrigger: Story = {
	args: { trigger: 'manual' },
	parameters: {
		docs: { description: { story: 'A tooltip with a manual trigger.' } }
	},
	render: (args) => {
		let tooltipEl: { tooltipShow?: () => void } | null = null;

		const handleTooltipRef = (el: Element | undefined) => {
			tooltipEl = (el as typeof tooltipEl) ?? null;
		};

		function showTooltip() {
			tooltipEl?.tooltipShow?.();
		}

		return html`
			<div style="display:flex">
				<dv-button style="margin-right: 100px" @click=${showTooltip}>Click for Tooltip</dv-button>
				<dv-tooltip
					content=${args.content}
					placement=${args.placement}
					?open=${args.open}
					?disabled=${args.disabled}
					?hoist=${args.hoist}
					trigger=${args.trigger}
					max-width=${args.maxWidth}
					${ref(handleTooltipRef)}
				>
					<dv-icon name="circle-info" size="md"></dv-icon>
				</dv-tooltip>
			</div>
		`;
	}
};


