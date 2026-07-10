import type { Meta, StoryObj } from '@storybook/web-components-vite';

type DvSkeletonArgs = {
  label: string;
};

const meta: Meta<DvSkeletonArgs> = {
  title: 'Components/Skeleton',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' }
  },
  args: {
    label: 'DvSkeleton'
  },
  render: ({ label }) => `<dv-skeleton label="${label}"></dv-skeleton>`
};

export default meta;

type Story = StoryObj<DvSkeletonArgs>;

export const Default: Story = {
  args: {}
};
