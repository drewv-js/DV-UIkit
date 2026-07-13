import type { Meta, StoryObj } from '@storybook/web-components-vite';

type ButtonArgs = {
  label: string;
  variant: 'primary' | 'secondary' | 'text';
  disabled: boolean;
};

const meta: Meta<ButtonArgs> = {
  title: 'Components/Button',
  component: 'dv-button',
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible text content shown inside the button.'
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'text'],
      description: 'Visual emphasis style of the button.'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interactions and updates visual state.'
    }
  },
  args: {
    label: 'Button',
    variant: 'primary',
    disabled: false
  },
  render: ({ label, variant, disabled }) =>
    `<dv-button variant="${variant}" ${disabled ? 'disabled' : ''}>${label}</dv-button>`
};

export default meta;

type Story = StoryObj<ButtonArgs>;

export const Primary: Story = {
  args: {
    label: 'Save',
    variant: 'primary'
  },
  parameters: {
    docs: {
      description: {
        story: 'High-emphasis action used for the main task on a screen.'
      }
    }
  }
};

export const Secondary: Story = {
  args: {
    label: 'Cancel',
    variant: 'secondary'
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium-emphasis action used alongside a primary action.'
      }
    }
  }
};

export const Text: Story = {
  args: {
    label: 'Text Button',
    variant: 'text'
  },
  parameters: {
    docs: {
      description: {
        story: 'Low-emphasis action used for optional or tertiary interactions.'
      }
    }
  }
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    variant: 'primary',
    disabled: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state showing non-interactive behavior and reduced visual prominence.'
      }
    }
  }
};
