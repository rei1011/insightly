import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { RankingTable } from './RankingTable';

const meta = {
  title: 'Components/RankingTable',
  component: RankingTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RankingTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = Array.from({ length: 10 }, (_, i) => ({
  rank: i + 1,
  companyName: `株式会社サンプル${String.fromCharCode(65 + i)}`,
  avgSalary: 1200 - i * 80,
  count: 50 - i * 3,
}));

export const Default: Story = {
  args: {
    data: sampleData,
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
};

export const EmptyWithCustomMessage: Story = {
  args: {
    data: [],
    emptyMessage: '該当するデータが見つかりませんでした',
  },
};
