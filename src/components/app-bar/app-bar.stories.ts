import type { Meta, StoryObj } from '@storybook/web-components-vite';

type AppBarArgs = {
  label: string;
  leftContent: string;
  centerContent: string;
  rightContent: string;
};

const meta: Meta<AppBarArgs> = {
  title: 'Components/AppBar',
  component: 'dv-app-bar',
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Accessible label announced for the app bar header region.'
    },
    leftContent: {
      control: 'text',
      description: 'HTML content rendered inside the left named slot.'
    },
    centerContent: {
      control: 'text',
      description: 'HTML content rendered inside the center named slot.'
    },
    rightContent: {
      control: 'text',
      description: 'HTML content rendered inside the right named slot.'
    }
  },
  args: {
    label: 'Main application navigation',
    leftContent: '<strong>DV UI Kit</strong>',
    centerContent: '<span>Dashboard</span>',
    rightContent: '<dv-button variant="text">Help</dv-button>'
  },
  render: ({ label, leftContent, centerContent, rightContent }) => `
    <dv-app-bar label="${label}">
      <div slot="left">${leftContent}</div>
      <div slot="center">${centerContent}</div>
      <div slot="right">${rightContent}</div>
    </dv-app-bar>
  `
};

export default meta;

type Story = StoryObj<AppBarArgs>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default app bar composition with branding, page title, and a right-side utility action.'
      }
    }
  }
};

export const ProductHeader: Story = {
  args: {
    label: 'Product workspace navigation',
    leftContent: '<strong>DV Suite</strong>',
    centerContent: '<span>Projects</span>',
    rightContent: '<dv-button variant="secondary">Invite</dv-button>'
  },
  parameters: {
    docs: {
      description: {
        story: 'Product-focused variation that emphasizes page context and a primary secondary action.'
      }
    }
  }
};

export const CenterOnly: Story = {
  args: {
    leftContent: '',
    centerContent: '<span>Standalone Title</span>',
    rightContent: ''
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal layout that uses only the center slot for a single title-focused app bar.'
      }
    }
  }
};
