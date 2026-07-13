import type { Meta, StoryObj } from '@storybook/web-components-vite';

type DvToggleArgs = {
  label: string;
  checked: boolean;
  disabled: boolean;
};

const meta: Meta<DvToggleArgs> = {
  title: 'Components/Toggle',
  component: 'dv-toggle',
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible text label for the toggle.'
    },
    checked: {
      control: 'boolean',
      description: 'Whether the toggle starts in the on state.'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables user interaction when true.'
    }
  },
  args: {
    label: 'Enable notifications',
    checked: false,
    disabled: false
  },
  render: ({ label, checked, disabled }) =>
    `<dv-toggle label="${label}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}></dv-toggle>`
};

export default meta;

type Story = StoryObj<DvToggleArgs>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default toggle in the unchecked state.'
      }
    }
  }
};

export const Checked: Story = {
  args: {
    checked: true
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};
