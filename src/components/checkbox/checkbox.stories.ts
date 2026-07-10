import type { Meta, StoryObj } from '@storybook/web-components-vite';

type DvCheckboxArgs = {
  label: string;
};

const meta: Meta<DvCheckboxArgs> = {
  title: 'Components/Checkbox',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' }
  },
  args: {
    label: 'DvCheckbox'
  },
  render: ({ label }) => `<dv-checkbox label="${label}"></dv-checkbox>`
};

export default meta;

type Story = StoryObj<DvCheckboxArgs>;

export const Default: Story = {
  args: {}
};
