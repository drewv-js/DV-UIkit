import type { Meta, StoryObj } from '@storybook/web-components-vite';

type DvDropdownArgs = {
  label: string;
};

const meta: Meta<DvDropdownArgs> = {
  title: 'Components/Dropdown',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' }
  },
  args: {
    label: 'DvDropdown'
  },
  render: ({ label }) => `<dv-dropdown label="${label}"></dv-dropdown>`
};

export default meta;

type Story = StoryObj<DvDropdownArgs>;

export const Default: Story = {
  args: {}
};
