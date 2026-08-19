import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ref } from 'lit/directives/ref.js';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

const withFixedHeight = (heightPx: number) => (storyFn: () => unknown) => {
	return html` <div style="height: ${heightPx}px;">${storyFn()}</div> `;
};

type DrawerArgs = Omit<Components.DvDrawer, 'drawerHide' | 'drawerShow'>;

const drawerSnippets: ComponentSnippets<DrawerArgs> = {
	react: (args) => {
		const reactNoClose = args.noClose ? ' noClose' : '';
		return `import { useState } from 'react';
import { DvDrawer, DvButton } from '@dv-uikit/react';

function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DvButton variant="primary" onClick={() => setOpen(true)}>
        Open Drawer
      </DvButton>
      <DvDrawer
        open={open}
        label="${args.label}"${reactNoClose}
        onShow={handleShow}
        onHide={() => setOpen(false)}
        onRequestClose={handleRequestClose}
      >
        Drawer content goes here.
        <div slot="footer">
          <DvButton variant="secondary" onClick={() => setOpen(false)}>Close</DvButton>
          <DvButton variant="primary" onClick={() => setOpen(false)}>Submit</DvButton>
        </div>
      </DvDrawer>
    </>
  );
}`;
	},
	vue: (args) => {
		const vueNoClose = args.noClose ? ' no-close' : '';
		return `<template>
  <dv-button variant="primary" @click="open = true">Open Drawer</dv-button>
  <dv-drawer
    :open="open"
    label="${args.label}"${vueNoClose}
    @show="handleShow"
    @hide="open = false"
    @request-close="handleRequestClose"
  >
    Drawer content goes here.
    <template #footer>
      <dv-button variant="secondary" @click="open = false">Close</dv-button>
      <dv-button variant="primary" @click="open = false">Submit</dv-button>
    </template>
  </dv-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { DvDrawer, DvButton } from '@dv-uikit/vue';

const open = ref(false);
const handleShow = () => {};
const handleRequestClose = (event) => {};
</script>`;
	}
};

const { argTypes } = getStoryHelpers<DrawerArgs>('dv-drawer', {
	excludeCategories: ['properties']
});

const meta: Meta<DrawerArgs> = {
	title: 'Components/Drawer',
	component: 'dv-drawer',
	tags: ['autodocs'],
	decorators: [withFixedHeight(400)],
	parameters: {
		layout: 'fullscreen',
		componentSubtitle: '<DvDrawer> | <dv-drawer>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: DrawerArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(drawerSnippets.react(args), drawerSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		open: false,
		label: 'Drawer Title',
		noClose: false
	}
};

export default meta;
type Story = StoryObj<DrawerArgs>;

function renderDrawer(
	args: DrawerArgs,
	options?: { scrollContent?: boolean; useTitle?: boolean; useActions?: boolean }
) {
	let drawerEl: { drawerShow?: () => void; drawerHide?: () => void } | null = null;

	const handleDrawerRef = (el: Element | undefined) => {
		drawerEl = (el as typeof drawerEl) ?? null;
	};

	function openDrawer() {
		drawerEl?.drawerShow?.();
	}

	function closeDrawer() {
		drawerEl?.drawerHide?.();
	}

	function handleShow() {
		document.body.style.overflow = '';
	}

	const loremBlock = html`<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at sodales diam. Pellentesque volutpat, ante at
		sodales elementum, erat urna interdum turpis, vel ullamcorper arcu nunc ut nisi. Suspendisse potenti. Maecenas
		varius vehicula ligula non tristique.
	</p>`;

	return html`
		<dv-button variant="primary" @click=${openDrawer}>Open Drawer</dv-button>

		<dv-drawer
			?open=${args.open}
			label=${args.label}
			?no-close=${args.noClose}
			@show=${handleShow}
			${ref(handleDrawerRef)}
		>
			${options?.useTitle ? html`<div slot="title"><span>Drawer Title</span></div>` : ''}
			${
				options?.useActions
					? html`<div slot="actions" style="display: flex; gap: 8px">
							<dv-icon name="pen-to-square" size="xs"></dv-icon>
							<dv-icon name="link" size="xs"></dv-icon>
						</div>`
					: ''
			}

			<div>
				${loremBlock} ${options?.scrollContent ? html`${loremBlock}${loremBlock}${loremBlock}${loremBlock}` : ''}
			</div>

			<div slot="footer" style="display:flex">
				<dv-button variant="secondary" style="margin-right: 10px" @click=${closeDrawer}>Close</dv-button>
				<dv-button variant="primary" @click=${closeDrawer}>Submit</dv-button>
			</div>
		</dv-drawer>
	`;
}

export const Playground: Story = {
	render: (args) => renderDrawer(args)
};

export const Default: Story = {
	parameters: {
		docs: { description: { story: 'A default drawer that opens when the button is clicked.' } }
	},
	render: (args) => renderDrawer(args)
};

export const Scroll: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A drawer that demonstrates scrolling behavior when content exceeds the available height.'
			}
		}
	},
	render: (args) => renderDrawer(args, { scrollContent: true })
};

export const NoCloseButton: Story = {
	args: { noClose: true },
	parameters: {
		docs: {
			description: {
				story:
					'A drawer with the noClose property set to true, hiding the built-in close button and requiring alternative ways to close it.'
			}
		}
	},
	render: (args) => renderDrawer(args)
};

export const Title: Story = {
	parameters: {
		docs: {
			description: { story: 'A drawer with a title.' }
		}
	},
	render: (args) => renderDrawer(args, { useTitle: true })
};

export const Actions: Story = {
	parameters: {
		docs: {
			description: { story: 'A drawer with action icons in the header.' }
		}
	},
	render: (args) => renderDrawer(args, { useActions: true })
};


