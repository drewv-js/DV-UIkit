import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { Components } from '../../components';
import { html } from 'lit';
import { getStoryHelpers, buildMultiFrameworkSource } from '../../internal/storybook-helpers';

type BreadcrumbArgs = Components.DvBreadcrumb;

const buildReactBreadcrumbSnippet = (args: BreadcrumbArgs) => {
	const label = args.label !== 'Breadcrumb' ? ` label="${args.label}"` : '';
	const size = args.size !== 'md' ? ` size="${args.size}"` : '';

	return `import { DvBreadcrumb, DvBreadcrumbItem } from '@dv-uikit/react';

function App() {
  const handleBreadcrumbItemClick = (event) => {
    const breadcrumbItem = event.target;
    // Navigate using your router here (e.g. navigate(breadcrumbItem.href))
  };

  return (
    <DvBreadcrumb${label}${size}>
      <DvBreadcrumbItem href="/#" onBreadcrumbItemClick={handleBreadcrumbItemClick}>Home</DvBreadcrumbItem>
      <DvBreadcrumbItem href="/#" onBreadcrumbItemClick={handleBreadcrumbItemClick}>Products</DvBreadcrumbItem>
      <DvBreadcrumbItem href="/#" onBreadcrumbItemClick={handleBreadcrumbItemClick}>Category</DvBreadcrumbItem>
      <DvBreadcrumbItem href="/#" onBreadcrumbItemClick={handleBreadcrumbItemClick}>Subcategory</DvBreadcrumbItem>
      <DvBreadcrumbItem href="/#" onBreadcrumbItemClick={handleBreadcrumbItemClick}>Item</DvBreadcrumbItem>
      <DvBreadcrumbItem active>Current Page</DvBreadcrumbItem>
    </DvBreadcrumb>
  );
}`;
};

const buildVueBreadcrumbSnippet = (args: BreadcrumbArgs) => {
	const label = args.label !== 'Breadcrumb' ? ` label="${args.label}"` : '';
	const size = args.size !== 'md' ? ` size="${args.size}"` : '';

	return `<template>
  <dv-breadcrumb${label}${size}>
    <dv-breadcrumb-item href="/#" @breadcrumb-item-click="handleBreadcrumbItemClick">Home</dv-breadcrumb-item>
    <dv-breadcrumb-item href="/#" @breadcrumb-item-click="handleBreadcrumbItemClick">Products</dv-breadcrumb-item>
    <dv-breadcrumb-item href="/#" @breadcrumb-item-click="handleBreadcrumbItemClick">Category</dv-breadcrumb-item>
    <dv-breadcrumb-item href="/#" @breadcrumb-item-click="handleBreadcrumbItemClick">Subcategory</dv-breadcrumb-item>
    <dv-breadcrumb-item href="/#" @breadcrumb-item-click="handleBreadcrumbItemClick">Item</dv-breadcrumb-item>
    <dv-breadcrumb-item active>Current Page</dv-breadcrumb-item>
  </dv-breadcrumb>
</template>

<script setup>
import { DvBreadcrumb, DvBreadcrumbItem } from '@dv-uikit/vue';

const handleBreadcrumbItemClick = (event) => {
  const breadcrumbItem = event.target;
  // Navigate using your router here (e.g. router.push(breadcrumbItem.href))
};
</script>`;
};

const { argTypes } = getStoryHelpers<BreadcrumbArgs>('dv-breadcrumb', {
	excludeCategories: ['properties']
});

const meta: Meta<BreadcrumbArgs> = {
	title: 'Components/Breadcrumb',
	component: 'dv-breadcrumb',
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		componentSubtitle: '<DvBreadcrumb> | <dv-breadcrumb>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: BreadcrumbArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(buildReactBreadcrumbSnippet(args), buildVueBreadcrumbSnippet(args));
				}
			}
		}
	},
	argTypes: {
		...argTypes
	},
	args: {
		label: 'Breadcrumb',
		size: 'md'
	}
};

export default meta;
type Story = StoryObj<BreadcrumbArgs>;

function renderBreadcrumb(args: BreadcrumbArgs) {
	return html`
		<dv-breadcrumb label=${args.label} size=${args.size}>
			<dv-breadcrumb-item href="/#">Home</dv-breadcrumb-item>
			<dv-breadcrumb-item href="/#">Products</dv-breadcrumb-item>
			<dv-breadcrumb-item href="/#">Category</dv-breadcrumb-item>
			<dv-breadcrumb-item active>Current Page</dv-breadcrumb-item>
		</dv-breadcrumb>
	`;
}

export const Playground: Story = {
	render: (args) => renderBreadcrumb(args)
};

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A breadcrumb trail with four items. The last item represents the current page and is not interactive.'
			}
		}
	},
	render: (args) => renderBreadcrumb(args)
};

export const LongBreadcrumbTrail: Story = {
	name: 'Long Breadcrumb Trail',
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				story:
					'When many items are present and the container is too narrow to display them all, middle items collapse into a ••• button. Clicking it reveals a dropdown with the hidden items. Resize the browser to see the behaviour.'
			}
		}
	},
	render: (args) => html`
		<dv-breadcrumb label=${args.label} size=${args.size}>
			<dv-breadcrumb-item href="/#">Home</dv-breadcrumb-item>
			<dv-breadcrumb-item href="/#">Products</dv-breadcrumb-item>
			<dv-breadcrumb-item href="/#">Category</dv-breadcrumb-item>
			<dv-breadcrumb-item href="/#">Subcategory</dv-breadcrumb-item>
			<dv-breadcrumb-item href="/#">Item</dv-breadcrumb-item>
			<dv-breadcrumb-item active>Current Page</dv-breadcrumb-item>
		</dv-breadcrumb>
	`
};

export const WithDropdown: Story = {
	name: 'With Dropdown',
	parameters: {
		docs: {
			description: {
				story:
					'When the breadcrumb trail overflows its container, middle items collapse into a dropdown menu accessible via the ellipsis (•••) button. This example constrains the container width to force the collapse. The dropdown supports full keyboard navigation with arrow keys, Enter, and Escape.'
			}
		}
	},
	render: (args) => html`
		<div style="max-width: 320px; border: 1px dashed #ccc; padding: 4px;">
			<dv-breadcrumb label=${args.label} size=${args.size}>
				<dv-breadcrumb-item href="/#">Home</dv-breadcrumb-item>
				<dv-breadcrumb-item href="/#">Products</dv-breadcrumb-item>
				<dv-breadcrumb-item href="/#">Category</dv-breadcrumb-item>
				<dv-breadcrumb-item href="/#">Subcategory</dv-breadcrumb-item>
				<dv-breadcrumb-item href="/#">Item</dv-breadcrumb-item>
				<dv-breadcrumb-item active>Current Page</dv-breadcrumb-item>
			</dv-breadcrumb>
		</div>
	`
};


