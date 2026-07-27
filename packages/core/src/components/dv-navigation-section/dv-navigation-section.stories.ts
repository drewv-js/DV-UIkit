import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { Components } from '../../components';
import { html } from 'lit';
import { getStoryHelpers, buildMultiFrameworkSource } from '../../internal/storybook-helpers';

type NavigationSectionArgs = Components.DvNavigationSection;

type NavigationSectionSnippetOptions = {
	withLabel?: boolean;
	multiple?: boolean;
};

const getNavigationSectionSnippetOptions = (storyId?: string): NavigationSectionSnippetOptions => ({
	withLabel: storyId !== 'components-navigation-section--without-label',
	multiple: storyId === 'components-navigation-section--multiple-sections'
});

const buildReactNavigationSectionSnippet = (
	args: NavigationSectionArgs,
	options: NavigationSectionSnippetOptions = {}
) => {
	const label = options.withLabel && args.label ? ` label="${args.label}"` : '';

	if (options.multiple) {
		return `import { DvNavigationSection, DvNavigationItem } from '@dv-uikit/react';

function App() {
  return (
    <>
      <DvNavigationSection label="Section 1">
        <DvNavigationItem href="/Item1">Item 1</DvNavigationItem>
        <DvNavigationItem href="/Item2">Item 2</DvNavigationItem>
      </DvNavigationSection>
      <DvNavigationSection label="Section 2">
        <DvNavigationItem href="/Item3">Item 3</DvNavigationItem>
        <DvNavigationItem href="/Item4">Item 4</DvNavigationItem>
      </DvNavigationSection>
    </>
  );
}`;
	}

	return `import { DvNavigationSection, DvNavigationItem } from '@dv-uikit/react';

function App() {
  return (
    <DvNavigationSection${label}>
      <DvNavigationItem href="/Item1">Item 1</DvNavigationItem>
      <DvNavigationItem href="/Item1">Item 2</DvNavigationItem>
    </DvNavigationSection>
  );\n}`;
};

const buildVueNavigationSectionSnippet = (
	args: NavigationSectionArgs,
	options: NavigationSectionSnippetOptions = {}
) => {
	const label = options.withLabel && args.label ? ` label="${args.label}"` : '';

	if (options.multiple) {
		return `<template>
  <dv-navigation-section label="Section 1">
    <dv-navigation-item href="/Item1">Item 1</dv-navigation-item>
    <dv-navigation-item href="/Item2">Item 2</dv-navigation-item>
  </dv-navigation-section>
  <dv-navigation-section label="Section 2">
    <dv-navigation-item href="/Item3">Item 3</dv-navigation-item>
    <dv-navigation-item href="/Item4">Item 4</dv-navigation-item>
  </dv-navigation-section>
</template>

<script setup>
import { DvNavigationSection, DvNavigationItem } from '@dv-uikit/vue';
</script>`;
	}

	return `<template>
  <dv-navigation-section${label}>
    <dv-navigation-item href="/Item1">Item 1</dv-navigation-item>
    <dv-navigation-item href="/Item2">Item 2</dv-navigation-item>
  </dv-navigation-section>
</template>

<script setup>
import { DvNavigationSection, DvNavigationItem } from '@dv-uikit/vue';
</script>`;
};

const { argTypes } = getStoryHelpers<NavigationSectionArgs>('dv-navigation-section', {
	excludeCategories: ['properties']
});

const meta: Meta<NavigationSectionArgs> = {
	title: 'Components/Navigation/Navigation Section',
	component: 'dv-navigation-section',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvNavigationSection> | <dv-navigation-section>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: NavigationSectionArgs; id?: string }) => {
					const args = storyContext.args;
					const options = getNavigationSectionSnippetOptions(storyContext.id);
					return buildMultiFrameworkSource(
						buildReactNavigationSectionSnippet(args, options),
						buildVueNavigationSectionSnippet(args, options)
					);
				}
			}
		}
	},
	argTypes: {
		...argTypes,
		size: {
			table: {
				disable: true
			}
		}
	},
	args: {
		label: 'Menu Items'
	}
};

export default meta;
type Story = StoryObj<NavigationSectionArgs>;

function renderNavigationSection(args: NavigationSectionArgs) {
	return html`
		<div style="width: 16rem;">
			<dv-navigation-section label=${args.label}>
				<dv-navigation-item href="/Item1">Item 1</dv-navigation-item>
				<dv-navigation-item href="/Item2">Item 2</dv-navigation-item>
				<dv-navigation-item href="/Item3">Item 3</dv-navigation-item>
			</dv-navigation-section>
		</div>
	`;
}

export const Playground: Story = {
	render: (args) => renderNavigationSection(args)
};

export const WithLabel: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A navigation section with a label header that groups related items.'
			}
		}
	},
	render: (args) => renderNavigationSection(args)
};

export const WithoutLabel: Story = {
	args: {
		label: ''
	},
	parameters: {
		docs: {
			description: {
				story: 'A navigation section without a label header, useful for simple groupings.'
			}
		}
	},
	render: (args) => renderNavigationSection(args)
};

export const MultipleSections: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Multiple sections automatically render dividers between them (except after the last section).'
			}
		}
	},
	render: (args) => html`
		<div style="width: 16rem;">
			<dv-navigation-section label="Section 1">
				<dv-navigation-item href="/Item1">Item 1</dv-navigation-item>
				<dv-navigation-item href="/Item2">Item 2</dv-navigation-item>
			</dv-navigation-section>
			<dv-navigation-section label="Section 2">
				<dv-navigation-item href="/Item3">Item 3</dv-navigation-item>
				<dv-navigation-item href="/Item4">Item 4</dv-navigation-item>
			</dv-navigation-section>
			<dv-navigation-section label="Section 3">
				<dv-navigation-item href="/Item5">Item 5</dv-navigation-item>
				<dv-navigation-item href="/Item6">Item 6</dv-navigation-item>
			</dv-navigation-section>
		</div>
	`
};


