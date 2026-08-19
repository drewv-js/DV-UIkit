import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { Canvas, Controls, Description, Stories, Subtitle, Title } from '@storybook/addon-docs/blocks';
import { html } from 'lit';
import { createElement, Fragment } from 'react';
import type { Components } from '../../components';
import { getColorGroups } from '../../internal/color';
import { getAllIconNames } from '../../internal/icon-registry';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type IconArgs = Components.DvIcon;
type IconStoryVariant =
	| 'primary'
	| 'all-icons'
	| 'sizing'
	| 'inheriting-from-parent'
	| 'explicit-color-override'
	| 'multiple-icons-inheriting';

const statusColors = getColorGroups(['status']);
const statusVariants = Object.keys(statusColors);
const iconNames = getAllIconNames();

const getIconStoryVariant = (storyId?: string): IconStoryVariant => {
	switch (storyId) {
		case 'components-icon--all-icons':
			return 'all-icons';
		case 'components-icon--sizing':
			return 'sizing';
		case 'components-icon--inheriting-from-parent':
			return 'inheriting-from-parent';
		case 'components-icon--explicit-color-override':
			return 'explicit-color-override';
		case 'components-icon--multiple-icons-inheriting':
			return 'multiple-icons-inheriting';
		default:
			return 'primary';
	}
};

const getIconName = (args: IconArgs, fallback = 'house') => String(args.name ?? fallback);
const getIconColor = (args: IconArgs) => (args.color != null ? String(args.color) : undefined);

const buildReactPrimarySnippet = (args: IconArgs) => {
	const props = [
		` name="${getIconName(args)}"`,
		args.size && args.size !== 'sm' ? ` size="${args.size}"` : '',
		getIconColor(args) ? ` color="${getIconColor(args)}"` : ''
	].join('');

	return `import { DvIcon } from '@dv-uikit/react';

function App() {
  return <DvIcon${props} />;
}`;
};

const buildVuePrimarySnippet = (args: IconArgs) => {
	const props = [
		` name="${getIconName(args)}"`,
		args.size && args.size !== 'sm' ? ` size="${args.size}"` : '',
		getIconColor(args) ? ` color="${getIconColor(args)}"` : ''
	].join('');

	return `<template>
  <dv-icon${props} />
</template>

<script setup>
import { DvIcon } from '@dv-uikit/vue';
</script>`;
};

const buildReactSizingSnippet = (args: IconArgs) => {
	const iconName = getIconName(args);
	const color = getIconColor(args);
	const colorProp = color ? ` color="${color}"` : '';

	return `import { DvIcon } from '@dv-uikit/react';

function App() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
      <DvIcon name="${iconName}" size="xs"${colorProp} />
      <DvIcon name="${iconName}" size="sm"${colorProp} />
      <DvIcon name="${iconName}" size="md"${colorProp} />
      <DvIcon name="${iconName}" size="lg"${colorProp} />
      <DvIcon name="${iconName}" size="xl"${colorProp} />
    </div>
  );
}`;
};

const buildVueSizingSnippet = (args: IconArgs) => {
	const iconName = getIconName(args);
	const color = getIconColor(args);
	const colorProp = color ? ` color="${color}"` : '';

	return `<template>
  <div style="display: flex; align-items: flex-end; gap: 1rem;">
    <dv-icon name="${iconName}" size="xs"${colorProp} />
    <dv-icon name="${iconName}" size="sm"${colorProp} />
    <dv-icon name="${iconName}" size="md"${colorProp} />
    <dv-icon name="${iconName}" size="lg"${colorProp} />
    <dv-icon name="${iconName}" size="xl"${colorProp} />
  </div>
</template>

<script setup>
import { DvIcon } from '@dv-uikit/vue';
</script>`;
};

const buildReactInheritingSnippet = () => `import { DvIcon } from '@dv-uikit/react';

function App() {
  return (
    <div style={{ color: '#1dbf72', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <DvIcon name="gear" size="lg" />
    </div>
  );
}`;

const buildVueInheritingSnippet = () => `<template>
  <div style="color: #1dbf72; display: flex; align-items: center; gap: 0.5rem;">
    <dv-icon name="gear" size="lg" />
  </div>
</template>

<script setup>
import { DvIcon } from '@dv-uikit/vue';
</script>`;

const buildReactExplicitColorSnippet = () => `import { DvIcon } from '@dv-uikit/react';

function App() {
  return (
    <div style={{ color: '#1dbf72', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <DvIcon name="gear" size="lg" color="error" />
    </div>
  );
}`;

const buildVueExplicitColorSnippet = () => `<template>
  <div style="color: #1dbf72; display: flex; align-items: center; gap: 0.5rem;">
    <dv-icon name="gear" size="lg" color="error" />
  </div>
</template>

<script setup>
import { DvIcon } from '@dv-uikit/vue';
</script>`;

const buildReactMultipleIconsSnippet = () => `import { DvIcon } from '@dv-uikit/react';

function App() {
  return (
    <div style={{ color: '#1b9dd9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <DvIcon name="circle-info" size="md" />
      <DvIcon name="circle-check" size="md" />
      <DvIcon name="circle-xmark" size="md" />
    </div>
  );
}`;

const buildVueMultipleIconsSnippet = () => `<template>
  <div style="color: #1b9dd9; display: flex; align-items: center; gap: 1rem;">
    <dv-icon name="circle-info" size="md" />
    <dv-icon name="circle-check" size="md" />
    <dv-icon name="circle-xmark" size="md" />
  </div>
</template>

<script setup>
import { DvIcon } from '@dv-uikit/vue';
</script>`;

const iconSnippets: ComponentSnippets<IconArgs> = {
	react: buildReactPrimarySnippet,
	vue: buildVuePrimarySnippet
};

const buildIconStorySource = (args: IconArgs, storyId?: string) => {
	switch (getIconStoryVariant(storyId)) {
		case 'sizing':
			return buildMultiFrameworkSource(buildReactSizingSnippet(args), buildVueSizingSnippet(args));
		case 'inheriting-from-parent':
			return buildMultiFrameworkSource(buildReactInheritingSnippet(), buildVueInheritingSnippet());
		case 'explicit-color-override':
			return buildMultiFrameworkSource(buildReactExplicitColorSnippet(), buildVueExplicitColorSnippet());
		case 'multiple-icons-inheriting':
			return buildMultiFrameworkSource(buildReactMultipleIconsSnippet(), buildVueMultipleIconsSnippet());
		case 'all-icons':
		case 'primary':
		default:
			return buildMultiFrameworkSource(iconSnippets.react(args), iconSnippets.vue(args));
	}
};

const { argTypes } = getStoryHelpers<IconArgs>('dv-icon', {
	excludeCategories: ['properties']
});

function renderDocsPage() {
	const h = createElement as any;

	return h(
		Fragment as any,
		null,
		h(Title as any),
		h(Subtitle as any),
		h(Description as any),
		h('div', { style: { marginTop: '4rem' } }),
		h(Canvas as any, { of: AllIcons, sourceState: 'none' }),
		h('div', { style: { marginTop: '4rem' } }),
		h(Controls as any),
		h('div', { style: { marginTop: '2rem' } }),
		h(Stories as any, { includePrimary: false })
	);
}

const meta: Meta<IconArgs> = {
	title: 'Components/Icon',
	component: 'dv-icon',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvIcon> | <dv-icon>',
		docs: {
			page: renderDocsPage as any,
			source: {
				transform: (_code: string, storyContext: { args: IconArgs; id?: string }) => {
					const args = storyContext.args;
					return buildIconStorySource(args, storyContext.id);
				}
			}
		}
	},
	argTypes: {
		...argTypes,
		color: {
			...argTypes['color'],
			control: 'select',
			options: statusVariants
		}
	},
	args: {
		name: 'house',
		size: 'md'
	}
};

export default meta;
type Story = StoryObj<IconArgs>;

export const Playground: Story = {
	render: (args) => html`<dv-icon name=${args.name} size=${args.size} color=${args.color || undefined}></dv-icon>`
};

export const Sizing: Story = {
	parameters: { docs: { description: { story: 'Displays all supported icon sizes side-by-side.' } } },
	render: (args) => html`
		<div style="display: flex; align-items: flex-end; gap: 1rem;">
			<dv-icon name=${args.name} size="xs" color=${args.color || undefined}></dv-icon>
			<dv-icon name=${args.name} size="sm" color=${args.color || undefined}></dv-icon>
			<dv-icon name=${args.name} size="md" color=${args.color || undefined}></dv-icon>
			<dv-icon name=${args.name} size="lg" color=${args.color || undefined}></dv-icon>
			<dv-icon name=${args.name} size="xl" color=${args.color || undefined}></dv-icon>
		</div>
	`
};

export const AllIcons: StoryObj = {
	tags: ['!autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				story: 'All icons from the free Font Awesome Solid set with search, hover tooltip, and click-to-copy functionality.'
			}
		}
	},
	render: () => {
		const container = document.createElement('div');
		container.className = 'icon-container';

		const searchInput = document.createElement('input');
		searchInput.type = 'text';
		searchInput.placeholder = 'Search icons...';
		searchInput.className = 'search-input';

		const iconGrid = document.createElement('div');
		iconGrid.className = 'icon-grid';

		const copyToClipboard = async (text: string) => {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(text);
				return;
			}

			const tempInput = document.createElement('input');
			tempInput.value = text;
			document.body.appendChild(tempInput);
			tempInput.select();
			document.execCommand('copy');
			document.body.removeChild(tempInput);
		};

		const showNotification = (message: string) => {
			const existingNotification = container.querySelector('.notification');
			existingNotification?.remove();

			const notification = document.createElement('div');
			notification.className = 'notification';
			notification.textContent = message;
			container.appendChild(notification);

			window.setTimeout(() => {
				notification.remove();
			}, 1500);
		};

		const renderIcons = (filteredNames: string[]) => {
			iconGrid.innerHTML = '';
			filteredNames.forEach((iconName) => {
				const iconItem = document.createElement('div');
				iconItem.className = 'icon-item';

				const iconElement = document.createElement('dv-icon');
				iconElement.setAttribute('name', iconName);
				iconElement.setAttribute('size', 'md');

				const iconLabel = document.createElement('span');
				iconLabel.className = 'icon-label';
				iconLabel.textContent = iconName;

				const tooltip = document.createElement('div');
				tooltip.className = 'tooltip';
				tooltip.textContent = iconName;

				iconItem.addEventListener('click', async () => {
					await copyToClipboard(iconName);
					showNotification(`Copied: ${iconName}`);
				});

				iconItem.addEventListener('mouseenter', () => {
					tooltip.style.display = 'block';
				});

				iconItem.addEventListener('mouseleave', () => {
					tooltip.style.display = 'none';
				});

				iconItem.appendChild(iconElement);
				iconItem.appendChild(iconLabel);
				iconItem.appendChild(tooltip);
				iconGrid.appendChild(iconItem);
			});
		};

		renderIcons(iconNames);
		searchInput.addEventListener('input', (event) => {
			const searchQuery = (event.target as HTMLInputElement).value.toLowerCase();
			renderIcons(iconNames.filter((iconName) => iconName.toLowerCase().includes(searchQuery)));
		});

		const style = document.createElement('style');
		style.textContent = `
			.css-s230ta:has(#story--components-icon--all-icons) {
				box-shadow: none;
				border: 1px solid #ddd;
				padding: 1rem;
			}
			.icon-container {
				font-family: "Nunito Sans", -apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
				width: 98%;
			}
			.search-input {
				margin-bottom: 16px;
				width: 98%;
				border-radius: .5rem;
				border: 1px solid rgb(191, 196, 205);
				font-size: .875rem;
				line-height: 1.25rem;
				box-shadow: 1px 1px 5px #eae5e5;
				color: #1f2937;
				padding: .5rem .75rem;
			}
			.search-input:focus-within {
				outline: none;
				border: 1px solid #03A9F4;
			}
			.icon-grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
				gap: 16px;
				justify-items: center;
			}
			.icon-item {
				position: relative;
				text-align: center;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 8px;
				padding: 10px;
				border-radius: .4em;
				cursor: pointer;
				transition: background-color 0.3s;
			}
			.icon-item:hover {
				background-color: rgba(0, 0, 0, 0.05);
			}
			.icon-label {
				font-size: 0.75rem;
				line-height: 1rem;
				color: #374151;
				word-break: break-word;
			}
			.tooltip {
				display: none;
				position: absolute;
				top: -0.5rem;
				left: 50%;
				transform: translate(-50%, -100%);
				background-color: #333;
				color: #fff;
				padding: 5px 8px;
				border-radius: 4px;
				font-size: 0.75rem;
				white-space: nowrap;
				z-index: 10;
			}
			.notification {
				position: fixed;
				bottom: 20px;
				right: 20px;
				background-color: #4caf50;
				color: white;
				padding: 10px;
				border-radius: 5px;
				transition: opacity 0.5s;
				z-index: 1000;
			}
    `;

		container.appendChild(searchInput);
		container.appendChild(iconGrid);
		container.appendChild(style);

		const toggleButton = document.querySelector('.docblock-code-toggle') as HTMLElement | null;
		if (toggleButton) {
			toggleButton.style.display = 'none';
		}

		return container;
	}
};

export const InheritingFromParent: Story = {
	render: () => html`
		<div style="color: #1dbf72; display: flex; align-items: center; gap: 0.5rem;">
			<dv-icon name="gear" size="lg"></dv-icon>
		</div>
	`,
	argTypes: {
		color: { control: false },
		size: { control: false },
		name: { control: false }
	},
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				story: 'When no color prop is provided, icons inherit the color from their parent element.'
			}
		}
	}
};

export const ExplicitColorOverride: Story = {
	render: () => html`
		<div style="color: #1dbf72; display: flex; align-items: center; gap: 0.5rem;">
			<dv-icon name="gear" size="lg" color="error"></dv-icon>
		</div>
	`,
	argTypes: {
		color: { control: false },
		size: { control: false },
		name: { control: false }
	},
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				story: 'When a color prop is explicitly provided, it overrides any inherited color from the parent element.'
			}
		}
	}
};

export const MultipleIconsInheriting: Story = {
	render: () => html`
		<div style="color: #1b9dd9; display: flex; align-items: center; gap: 1rem;">
			<dv-icon name="circle-info" size="md"></dv-icon>
			<dv-icon name="circle-check" size="md"></dv-icon>
			<dv-icon name="circle-xmark" size="md"></dv-icon>
		</div>
	`,
	argTypes: {
		color: { control: false },
		size: { control: false },
		name: { control: false }
	},
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				story:
					'Multiple icons placed within the same parent container will all inherit the same color, making it easy to apply consistent styling.'
			}
		}
	}
};


