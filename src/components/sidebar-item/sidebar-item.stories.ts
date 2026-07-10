import type { Meta, StoryObj } from '@storybook/web-components-vite';

type DvSidebarItemArgs = {
  label: string;
};

const meta: Meta<DvSidebarItemArgs> = {
  title: 'Components/SidebarItem',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' }
  },
  args: {
    label: 'DvSidebarItem'
  },
  render: ({ label }) => `<dv-sidebar-item label="${label}"></dv-sidebar-item>`
};

export default meta;

type Story = StoryObj<DvSidebarItemArgs>;

export const Default: Story = {
  args: {}
};
