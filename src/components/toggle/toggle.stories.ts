import type { Meta, StoryObj } from '@storybook/web-components-vite';

type DvToggleArgs = {
  label: string;
};

const meta: Meta<DvToggleArgs> = {
  title: 'Components/Toggle',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' }
  },
  args: {
    label: 'DvToggle'
  },
  render: ({ label }) => `<dv-toggle label="${label}"></dv-toggle>`
};

export default meta;

type Story = StoryObj<DvToggleArgs>;

export const Default: Story = {
  args: {}
};
