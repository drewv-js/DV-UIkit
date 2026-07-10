import type { Meta, StoryObj } from '@storybook/web-components-vite';

type DvSidebarArgs = {
  label: string;
};

const meta: Meta<DvSidebarArgs> = {
  title: 'Components/Sidebar',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' }
  },
  args: {
    label: 'DvSidebar'
  },
  render: ({ label }) => `<dv-sidebar label="${label}"></dv-sidebar>`
};

export default meta;

type Story = StoryObj<DvSidebarArgs>;

export const Default: Story = {
  args: {}
};
