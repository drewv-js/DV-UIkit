import type { Meta, StoryObj } from '@storybook/web-components-vite';

type AppBarArgs = {
  label: string;
  variant: 'primary' | 'secondary' | 'danger';
  disabled: boolean;
};

const meta: Meta<AppBarArgs> = {
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

type Story = StoryObj<AppBarArgs>;

export const Primary: Story = {
  args: {
  }
};
