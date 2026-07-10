import type { Meta, StoryObj } from '@storybook/web-components-vite';

type DvRadioArgs = {
  label: string;
};

const meta: Meta<DvRadioArgs> = {
  title: 'Components/Radio',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' }
  },
  args: {
    label: 'DvRadio'
  },
  render: ({ label }) => `<dv-radio label="${label}"></dv-radio>`
};

export default meta;

type Story = StoryObj<DvRadioArgs>;

export const Default: Story = {
  args: {}
};
