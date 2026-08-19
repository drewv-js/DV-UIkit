import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { Components } from '../../components';
import { html } from 'lit';
import { getStoryHelpers, buildMultiFrameworkSource } from '../../internal/storybook-helpers';

type NavigationArgs = Components.DvNavigation;

type NavigationSnippetOptions = {
	singleSection?: boolean;
	withSupportingTextAndIcon?: boolean;
};

const getNavigationSnippetOptions = (storyId?: string): NavigationSnippetOptions => ({
	singleSection: storyId === 'components-navigation--single-section',
	withSupportingTextAndIcon: storyId === 'components-navigation--with-supporting-text-and-icon'
});

const buildReactNavigationSnippet = (args: NavigationArgs, options: NavigationSnippetOptions = {}) => {
	const label = args.label !== 'Secondary navigation' ? ` label="${args.label}"` : '';
	const size = args.size && args.size !== 'md' ? ` size="${args.size}"` : '';

	if (options?.singleSection) {
		return `import { DvNavigation, DvNavigationSection, DvNavigationItem } from '@dv-uikit/react';

function App() {
  return (
    <DvNavigation${label}${size}>
      <DvNavigationSection label="Menu">
        <DvNavigationItem href="#">Item 1</DvNavigationItem>
        <DvNavigationItem href="#">Item 2</DvNavigationItem>
        <DvNavigationItem href="#">Item 3</DvNavigationItem>
      </DvNavigationSection>
    </DvNavigation>
  );
}`;
	}

	if (options?.withSupportingTextAndIcon) {
		return `import { DvNavigation, DvNavigationSection, DvNavigationItem, DvIcon } from '@dv-uikit/react';

function App() {
  return (
    <DvNavigation${label}${size}>
      <DvNavigationSection label="Main">
        <DvNavigationItem href="/dashboard" active supportingText="View analytics and metrics">
          <DvIcon slot="startIcon" name="home" />
          Dashboard
        </DvNavigationItem>
        <DvNavigationItem href="/projects" supportingText="Manage your projects">
          <DvIcon slot="startIcon" name="scroll" />
          Projects
        </DvNavigationItem>
        <DvNavigationItem href="/team" supportingText="Collaborate with teammates">
          <DvIcon slot="startIcon" name="people-arrows" />
          Team
        </DvNavigationItem>
        <DvNavigationItem href="/reports" supportingText="Generate and view reports">
          <DvIcon slot="startIcon" name="chart-column" />
          Reports
        </DvNavigationItem>
      </DvNavigationSection>
    </DvNavigation>
  );
}`;
	}

	return `import { DvNavigation, DvNavigationSection, DvNavigationItem } from '@dv-uikit/react';

function App() {
  return (
    <DvNavigation${label}${size}>
      <DvNavigationSection label="Main Menu">
        <DvNavigationItem href="/home">Home</DvNavigationItem>
        <DvNavigationItem href="/dashboard">Dashboard</DvNavigationItem>
        <DvNavigationItem href="/products">Products</DvNavigationItem>
      </DvNavigationSection>
      <DvNavigationSection label="Settings">
        <DvNavigationItem href="/profile">Profile</DvNavigationItem>
        <DvNavigationItem href="/preferences">Preferences</DvNavigationItem>
      </DvNavigationSection>
      <DvNavigationSection label="More Info">
        <DvNavigationItem href="/help">Help</DvNavigationItem>
        <DvNavigationItem href="/logout">Logout</DvNavigationItem>
      </DvNavigationSection>
    </DvNavigation>
  );
}`;
};

const buildVueNavigationSnippet = (args: NavigationArgs, options: NavigationSnippetOptions = {}) => {
	const label = args.label !== 'Secondary navigation' ? ` label="${args.label}"` : '';
	const size = args.size && args.size !== 'md' ? ` size="${args.size}"` : '';

	if (options?.singleSection) {
		return `<template>
  <dv-navigation${label}${size}>
    <dv-navigation-section label="Menu">
      <dv-navigation-item href="#">Item 1</dv-navigation-item>
      <dv-navigation-item href="#">Item 2</dv-navigation-item>
      <dv-navigation-item href="#">Item 3</dv-navigation-item>
    </dv-navigation-section>
  </dv-navigation>
</template>

<script setup>
import { DvNavigation, DvNavigationSection, DvNavigationItem } from '@dv-uikit/vue';
</script>`;
	}

	if (options?.withSupportingTextAndIcon) {
		return `<template>
  <dv-navigation${label}${size}>
    <dv-navigation-section label="Main">
      <dv-navigation-item href="/dashboard" active supporting-text="View analytics and metrics">
        <dv-icon slot="startIcon" name="home" />
        Dashboard
      </dv-navigation-item>
      <dv-navigation-item href="/projects" supporting-text="Manage your projects">
        <dv-icon slot="startIcon" name="scroll" />
        Projects
      </dv-navigation-item>
      <dv-navigation-item href="/team" supporting-text="Collaborate with teammates">
        <dv-icon slot="startIcon" name="people-arrows" />
        Team
      </dv-navigation-item>
      <dv-navigation-item href="/reports" supporting-text="Generate and view reports">
        <dv-icon slot="startIcon" name="chart-column" />
        Reports
      </dv-navigation-item>
    </dv-navigation-section>
  </dv-navigation>
</template>

<script setup>
import { DvNavigation, DvNavigationSection, DvNavigationItem, DvIcon } from '@dv-uikit/vue';
</script>`;
	}

	return `<template>
  <dv-navigation${label}${size}>
    <dv-navigation-section label="Main Menu">
      <dv-navigation-item href="/home">Home</dv-navigation-item>
      <dv-navigation-item href="/dashboard">Dashboard</dv-navigation-item>
      <dv-navigation-item href="/products">Products</dv-navigation-item>
    </dv-navigation-section>
    <dv-navigation-section label="Settings">
      <dv-navigation-item href="/profile">Profile</dv-navigation-item>
      <dv-navigation-item href="/preferences">Preferences</dv-navigation-item>
    </dv-navigation-section>
    <dv-navigation-section label="More Info">
      <dv-navigation-item href="/help">Help</dv-navigation-item>
      <dv-navigation-item href="/logout">Logout</dv-navigation-item>
    </dv-navigation-section>
  </dv-navigation>
</template>

<script setup>
import { DvNavigation, DvNavigationSection, DvNavigationItem } from '@dv-uikit/vue';
</script>`;
};

const { argTypes } = getStoryHelpers<NavigationArgs>('dv-navigation', {
	excludeCategories: ['properties']
});

const meta: Meta<NavigationArgs> = {
	title: 'Components/Navigation',
	component: 'dv-navigation',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvNavigation> | <dv-navigation>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: NavigationArgs; id?: string }) => {
					const args = storyContext.args;
					const options = getNavigationSnippetOptions(storyContext.id);
					return buildMultiFrameworkSource(
						buildReactNavigationSnippet(args, options),
						buildVueNavigationSnippet(args, options)
					);
				}
			}
		}
	},
	argTypes: {
		...argTypes,
		size: {
			...argTypes['size'],
			control: 'select',
			options: ['sm', 'md']
		}
	},
	args: {
		label: 'Secondary navigation',
		size: 'md'
	}
};

export default meta;
type Story = StoryObj<NavigationArgs>;

function renderNavigation(args: NavigationArgs) {
	return html`
		<dv-navigation label=${args.label} size=${args.size}>
			<dv-navigation-section label="Main Menu">
				<dv-navigation-item href="/home">Home</dv-navigation-item>
				<dv-navigation-item href="/dashboard">Dashboard</dv-navigation-item>
				<dv-navigation-item href="/products">Products</dv-navigation-item>
			</dv-navigation-section>
			<dv-navigation-section label="Settings">
				<dv-navigation-item href="/profile">Profile</dv-navigation-item>
				<dv-navigation-item href="/preferences">Preferences</dv-navigation-item>
			</dv-navigation-section>
			<dv-navigation-section label="More Info">
				<dv-navigation-item href="/help">Help</dv-navigation-item>
				<dv-navigation-item href="/logout">Logout</dv-navigation-item>
			</dv-navigation-section>
		</dv-navigation>
	`;
}

export const Playground: Story = {
	render: (args) => renderNavigation(args)
};

export const SingleSection: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A navigation with a single section (no dividers).'
			}
		}
	},
	render: (args) => html`
		<dv-navigation label=${args.label} size=${args.size}>
			<dv-navigation-section label="Menu">
				<dv-navigation-item href="#">Item 1</dv-navigation-item>
				<dv-navigation-item href="#">Item 2</dv-navigation-item>
				<dv-navigation-item href="#">Item 3</dv-navigation-item>
			</dv-navigation-section>
		</dv-navigation>
	`
};

export const MultipleSections: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A vertical navigation with multiple sections, labels, and automatic dividers between sections.'
			}
		}
	},
	render: (args) => renderNavigation(args)
};

export const WithSupportingTextAndIcon: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Navigation items can include optional start icons and supporting text. Supporting text provides additional context and is displayed below the main label.'
			}
		}
	},
	render: (args) => html`
		<dv-navigation label=${args.label} size=${args.size}>
			<dv-navigation-section label="Main">
				<dv-navigation-item href="/dashboard" active supporting-text="View analytics and metrics">
					<dv-icon slot="startIcon" name="home"></dv-icon>
					Dashboard
				</dv-navigation-item>
				<dv-navigation-item href="/projects" supporting-text="Manage your projects">
					<dv-icon slot="startIcon" name="scroll"></dv-icon>
					Projects
				</dv-navigation-item>
				<dv-navigation-item href="/team" supporting-text="Collaborate with teammates">
					<dv-icon slot="startIcon" name="people-arrows"></dv-icon>
					Team
				</dv-navigation-item>
				<dv-navigation-item href="/reports" supporting-text="Generate and view reports">
					<dv-icon slot="startIcon" name="chart-column"></dv-icon>
					Reports
				</dv-navigation-item>
			</dv-navigation-section>
		</dv-navigation>
	`
};


