import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ref } from 'lit/directives/ref.js';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';
import type { RequestCloseEventDetail } from '../../events';

const withFixedHeight = (heightPx: number) => (storyFn: () => unknown) => {
	return html` <div style="height: ${heightPx}px;">${storyFn()}</div> `;
};

type DialogArgs = Omit<Components.DvDialog, 'dialogHide' | 'dialogShow' | 'size' | 'closable'> & {
	label: NonNullable<Components.DvDialog['label']>;
	subtitle: NonNullable<Components.DvDialog['subtitle']>;
	size: NonNullable<Components.DvDialog['size']>;
	closable: NonNullable<Components.DvDialog['closable']>;
};

const dialogSnippets: ComponentSnippets<DialogArgs> = {
	react: (args) => {
		// Prefer the new `closable` prop in snippets; only emit `noClose` if user toggled it.
		const reactClosable = args.closable === false ? ' closable={false}' : '';
		const reactNoClose = args.noClose ? ' noClose' : '';
		const reactSize = args.size !== 'md' ? ` size="${args.size}"` : '';
		const reactSubtitle = args.subtitle ? ` subtitle="${args.subtitle}"` : '';
		return `import { useState } from 'react';
import { DvDialog, DvButton } from '@dv-uikit/react';

function App() {
	const [open, setOpen] = useState(${args.open});

  return (
    <>
      <DvButton variant="primary" onClick={() => setOpen(true)}>
		Open dialog
      </DvButton>
      <DvDialog
        label="${args.label}"${reactSubtitle}${reactSize}${reactClosable}${reactNoClose}
		open={open}
		onShow={() => setOpen(true)}
        onHide={() => setOpen(false)}
        onRequestClose={handleRequestClose}
      >
        <div>Dialog content goes here.</div>
        <div slot="footer">
          <DvButton variant="primary" onClick={() => setOpen(false)}>
            Close
          </DvButton>
        </div>
      </DvDialog>
    </>
  );
}`;
	},

	vue: (args) => {
		const vueClosable = args.closable === false ? ' :closable="false"' : '';
		const vueNoClose = args.noClose ? ' no-close' : '';
		const vueSize = args.size !== 'md' ? ` size="${args.size}"` : '';
		const vueSubtitle = args.subtitle ? ` subtitle="${args.subtitle}"` : '';
		return `<template>
  <dv-button variant="primary" @click="open = true">Open dialog</dv-button>
  <dv-dialog label="${args.label}"${vueSubtitle}${vueSize}${vueClosable}${vueNoClose} 
  	:open="open" 
  	@show="open = true" 
  	@hide="open = false" 
  	@request-close="handleRequestClose">
    <div>Dialog content goes here.</div>
    <template #footer>
      <dv-button variant="primary" @click="open = false">Close</dv-button>
    </template>
  </dv-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { DvButton, DvDialog } from '@dv-uikit/vue';

const open = ref(${args.open});
</script>`;
	}
};

const { argTypes } = getStoryHelpers('dv-dialog', {
	excludeCategories: ['properties']
});

const meta: Meta<DialogArgs> = {
	title: 'Components/Dialog',
	component: 'dv-dialog',
	tags: ['autodocs'],
	decorators: [withFixedHeight(680)],
	parameters: {
		layout: 'fullscreen',
		componentSubtitle: '<DvDialog> | <dv-dialog>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: DialogArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(dialogSnippets.react(args), dialogSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		open: false,
		label: 'Dialog Title',
		subtitle: '',
		closable: true,
		noClose: false,
		size: 'md'
	}
};

export default meta;

type Story = StoryObj<DialogArgs>;

function renderDialog(
	args: DialogArgs,
	options?: {
		preventOverlayAndKeyboardClose?: boolean;
		hideHeader?: boolean;
		longContent?: boolean;
	}
) {
	// useArgs() is NOT used here because in Storybook Docs mode, updateArgs() does not
	// trigger re-renders for non-primary embedded stories. Direct element method calls
	// via a ref work correctly in both Canvas mode and Docs mode.
	let dialogEl: { dialogShow?: () => void; dialogHide?: () => void } | null = null;

	const handleDialogRef = (el: Element | undefined) => {
		dialogEl = (el as typeof dialogEl) ?? null;
	};

	function openDialog() {
		dialogEl?.dialogShow?.();
	}

	function closeDialog() {
		dialogEl?.dialogHide?.();
	}

	// Storybook renders stories inside an iframe whose body is small.
	// dialogShow() sets document.body.style.overflow = 'hidden', which blocks
	// the Docs page from scrolling between stories. Restore it on show.
	function handleShow() {
		document.body.style.overflow = '';
	}

	function handleRequestClose(event: CustomEvent<RequestCloseEventDetail>) {
		if (!options?.preventOverlayAndKeyboardClose) return;

		if (event.detail.source === 'overlay' || event.detail.source === 'keyboard') {
			event.preventDefault();
		}
	}

	const label = options?.hideHeader ? '' : args.label;
	const subtitle = options?.hideHeader ? '' : args.subtitle;
	const noClose = options?.hideHeader ? true : args.noClose;
	const closable = options?.hideHeader ? false : (args.closable ?? true);

	const bodyContent = options?.longContent
		? html`${Array.from({ length: 13 }).map(
				(_, i) =>
					html`<p class="mb-4">
						Paragraph ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua.
					</p>`
			)}`
		: html`<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>`;

	return html`
		<dv-button variant="primary" @click=${openDialog}>Open Dialog</dv-button>

		<dv-dialog
			?open=${args.open}
			label=${label}
			subtitle=${subtitle}
			size=${args.size ?? 'md'}
			?closable=${closable}
			?no-close=${noClose}
			@show=${handleShow}
			@requestClose=${handleRequestClose}
			${ref(handleDialogRef)}
		>
			${bodyContent}

			<div slot="footer">
				<dv-button variant="primary" @click=${closeDialog}
					>${options?.preventOverlayAndKeyboardClose ? 'Submit' : 'Close'}</dv-button
				>
			</div>
		</dv-dialog>
	`;
}

/**
 * Render variant for stories that should not include a footer slot.
 * Kept as a separate function so the `<div slot="footer">` markup is never emitted.
 */
function renderDialogWithoutFooter(args: DialogArgs, options?: { hideHeader?: boolean }) {
	let dialogEl: { dialogShow?: () => void; dialogHide?: () => void } | null = null;

	const handleDialogRef = (el: Element | undefined) => {
		dialogEl = (el as typeof dialogEl) ?? null;
	};

	function openDialog() {
		dialogEl?.dialogShow?.();
	}

	function handleShow() {
		document.body.style.overflow = '';
	}

	const label = options?.hideHeader ? '' : args.label;
	const subtitle = options?.hideHeader ? '' : args.subtitle;
	const noClose = options?.hideHeader ? true : args.noClose;
	const closable = options?.hideHeader ? false : (args.closable ?? true);

	return html`
		<dv-button variant="primary" @click=${openDialog}>Open Dialog</dv-button>

		<dv-dialog
			?open=${args.open}
			label=${label}
			subtitle=${subtitle}
			size=${args.size ?? 'md'}
			?closable=${closable}
			?no-close=${noClose}
			@show=${handleShow}
			${ref(handleDialogRef)}
		>
			<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
		</dv-dialog>
	`;
}

export const Playground: Story = {
	render: (args) => renderDialog(args)
};

export const Default: Story = {
	args: {
		closable: true
	},
	parameters: {
		docs: {
			description: {
				story: 'A default medium (43.75rem) dialog that opens when the button is clicked.'
			}
		}
	},
	render: (args) => renderDialog(args)
};

export const Small: Story = {
	args: {
		closable: true,
		size: 'sm'
	},
	parameters: {
		docs: {
			description: {
				story: 'A small (31.25rem) dialog. Width is fixed and cannot be overridden.'
			}
		}
	},
	render: (args) => renderDialog(args)
};

export const WithSubtitle: Story = {
	args: {
		closable: true,
		subtitle: 'A short description below the title.'
	},
	parameters: {
		docs: {
			description: {
				story: 'A dialog with a label and optional subtitle in the header.'
			}
		}
	},
	render: (args) => renderDialog(args)
};

export const NotClosable: Story = {
	args: {
		closable: false,
		noClose: true
	},
	parameters: {
		docs: {
			description: {
				story:
					'A dialog with `closable={false}`, hiding the built-in close button and requiring alternative ways to close it.'
			}
		}
	},
	render: (args) => renderDialog(args)
};

export const PreventOverlay: Story = {
	args: {
		closable: true
	},
	parameters: {
		docs: {
			description: {
				story:
					'A dialog that prevents closing via overlay click and keyboard escape, demonstrating the dv-request-close event handling.'
			}
		}
	},
	render: (args) => renderDialog(args, { preventOverlayAndKeyboardClose: true })
};

export const NoHeader: Story = {
	args: {
		label: '',
		subtitle: '',
		closable: false
	},
	parameters: {
		docs: {
			description: {
				story:
					'A dialog with no header — label/subtitle empty and `closable={false}` so no close button renders. Requires programmatic dismissal.'
			}
		}
	},
	render: (args) => renderDialog(args, { hideHeader: true })
};

export const NoFooter: Story = {
	args: {
		closable: true
	},
	parameters: {
		docs: {
			description: {
				story:
					'A dialog without a footer slot — only the header and body render. The close button in the header remains the primary dismissal control.'
			}
		}
	},
	render: (args) => renderDialogWithoutFooter(args)
};

export const LongContent: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'A dialog with content that exceeds the available height. The body becomes scrollable while the header and footer remain fixed.'
			}
		}
	},
	render: (args) => renderDialog(args, { longContent: true })
};


