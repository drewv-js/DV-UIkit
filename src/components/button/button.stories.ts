import type { Meta, StoryObj } from '@storybook/web-components-vite';

type ButtonArgs = {
  label: string;
  variant: 'primary' | 'secondary' | 'danger';
  disabled: boolean;
};

const meta: Meta<ButtonArgs> = {
  title: 'Components/Button',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger']
    },
    disabled: { control: 'boolean' }
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
  }
};

export const Secondary: Story = {
  args: {
    label: 'Cancel',
    variant: 'secondary'
  }
};

export const Danger: Story = {
  args: {
    label: 'Delete',
    variant: 'danger'
  }
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    variant: 'primary',
    disabled: true
  }
};
