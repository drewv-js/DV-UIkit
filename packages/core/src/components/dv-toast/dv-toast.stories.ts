import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';
import { getColorGroups } from '../../internal/color';

const statusColors = getColorGroups(['status']);
const availableVariants = Object.keys(statusColors);

type ToastArgs = Omit<Components.DvToast, 'toast' | 'toastHide' | 'toastShow'>;

const toastSnippets: ComponentSnippets<ToastArgs> = {
	react: (args) => `import { useState } from 'react';
import { DvButton, DvToast } from '@dv-uikit/react';

function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DvButton onClick={() => setOpen(true)}>
        Show ${args.color.charAt(0).toUpperCase() + args.color.slice(1)} Toast
      </DvButton>
      <DvToast
        color="${args.color}"
        closable={${args.closable}}
        duration={${args.duration}}
        open={open}
        onHide={() => setOpen(false)}
      >
        <strong>A ${args.color.charAt(0).toUpperCase() + args.color.slice(1)} Toast.</strong>
        <div>This is information for the ${args.color} toast.</div>
      </DvToast>
    </>
  );
}`,
	vue: (args) => `<template>
  <dv-button @click="open = true">
    Show ${args.color.charAt(0).toUpperCase() + args.color.slice(1)} Toast
  </dv-button>
  <dv-toast
    color="${args.color}"
    :closable="${args.closable}"
    :duration="${args.duration}"
    :open="open"
    @hide="open = false"
  >
    <strong>A ${args.color.charAt(0).toUpperCase() + args.color.slice(1)} Toast.</strong>
    <div>This is information for the ${args.color} toast.</div>
  </dv-toast>
</template>

<script setup>
import { ref } from 'vue';

const open = ref(false);
</script>`
};

const { argTypes } = getStoryHelpers<ToastArgs>('dv-toast', {
	excludeCategories: ['properties']
});
const colorArgType = argTypes['color'] as any;

const meta: Meta<ToastArgs> = {
	title: 'Components/Toast',
	component: 'dv-toast',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvToast> | <dv-toast>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: ToastArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(toastSnippets.react(args), toastSnippets.vue(args));
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
				...(colorArgType?.table ?? {}),
				defaultValue: { summary: 'info' }
			}
		},
		duration: {
			control: { type: 'number' },
			table: {
				category: 'props',
				defaultValue: { summary: '3000' }
			}
		}
	},
	args: {
		open: false,
		closable: true,
		color: 'info',
		duration: 3000
	}
};

export default meta;
type Story = StoryObj<ToastArgs>;

function showToast(args: ToastArgs) {
	const toast = document.createElement('dv-toast');
	toast.color = args.color;
	toast.closable = args.closable;
	toast.duration = args.duration;
	setToastMessage(
		toast,
		`<strong>A ${args.color.charAt(0).toUpperCase() + args.color.slice(1)} Toast.</strong><div>This is information for the ${args.color} toast.</div>`
	);
	document.body.append(toast);
	void (toast as HTMLDvToastElement).toastShow();
}

function renderToast(args: ToastArgs) {
	const colorLabel = args.color.charAt(0).toUpperCase() + args.color.slice(1);

	return html` <dv-button @click=${() => showToast(args)}>Show ${colorLabel} Toast</dv-button> `;
}

function setToastMessage(toastElement: HTMLElement, message: string) {
	const parser = new DOMParser();
	const parsedDocument = parser.parseFromString(message, 'text/html');
	const nodes = Array.from(parsedDocument.body.childNodes).map((node) => node.cloneNode(true));
	toastElement.replaceChildren(...nodes);
}

export const Playground: Story = {
	render: (args) => renderToast(args)
};

export const InfoToast: Story = {
	args: { color: 'info' },
	parameters: {
		docs: { description: { story: 'An info toast — used to display important information.' } }
	},
	render: (args) => renderToast(args)
};

export const SuccessToast: Story = {
	args: { color: 'success' },
	parameters: {
		docs: { description: { story: 'A success toast — used to indicate successful actions.' } }
	},
	render: (args) => renderToast(args)
};

export const WarningToast: Story = {
	args: { color: 'warning' },
	parameters: {
		docs: { description: { story: 'A warning toast — used to indicate potential issues.' } }
	},
	render: (args) => renderToast(args)
};

export const ErrorToast: Story = {
	args: { color: 'error' },
	parameters: {
		docs: { description: { story: 'An error toast — used to indicate an error or critical issue.' } }
	},
	render: (args) => renderToast(args)
};

export const NeutralToast: Story = {
	args: { color: 'neutral' },
	parameters: {
		docs: { description: { story: 'A neutral toast — used to provide general information.' } }
	},
	render: (args) => renderToast(args)
};

export const NonClosableToast: Story = {
	args: { color: 'success', closable: false },
	parameters: {
		docs: {
			description: {
				story: 'A non-closable toast that cannot be dismissed by the user.'
			}
		}
	},
	render: (args) => renderToast(args)
};


