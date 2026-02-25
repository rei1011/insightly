import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import type { CompensationRecord } from './CompensationTable';
import { CompensationTable } from './CompensationTable';

const meta = {
  title: 'Components/CompensationTable',
  component: CompensationTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CompensationTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData: CompensationRecord[] = [
  {
    id: 'salary-1',
    companyName: '株式会社サンプルA',
    jobTitle: 'ソフトウェアエンジニア',
    age: 32,
    grade: 'シニア',
    avgOvertimeHours: 20,
    annualSalary: 800,
    baseSalary: 600,
    bonusIncentive: 150,
    rsu: 50,
    stockOptions: null,
  },
  {
    id: 'salary-2',
    companyName: '株式会社サンプルB',
    jobTitle: 'プロダクトマネージャー',
    age: 38,
    grade: 'スタッフ',
    avgOvertimeHours: 35,
    annualSalary: 1200,
    baseSalary: 900,
    bonusIncentive: 200,
    rsu: 100,
    stockOptions: 50,
  },
  {
    id: 'salary-3',
    companyName: '株式会社サンプルC',
    jobTitle: 'データサイエンティスト',
    age: 28,
    grade: 'ミドル',
    avgOvertimeHours: 15,
    annualSalary: 650,
    baseSalary: 500,
    bonusIncentive: null,
    rsu: null,
    stockOptions: null,
  },
];

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

const manyRowsData: CompensationRecord[] = Array.from({ length: 20 }, (_, i) => ({
  id: `salary-${i + 1}`,
  companyName: `株式会社サンプル${String.fromCharCode(65 + (i % 5))}`,
  jobTitle: ['ソフトウェアエンジニア', 'プロダクトマネージャー', 'データサイエンティスト', 'デザイナー', 'QAエンジニア'][i % 5],
  age: 25 + (i % 20),
  grade: ['ジュニア', 'ミドル', 'シニア', 'スタッフ', 'リード'][i % 5],
  avgOvertimeHours: 10 + (i % 40),
  annualSalary: 500 + i * 50,
  baseSalary: 400 + i * 40,
  bonusIncentive: i % 3 === 0 ? null : 100 + i * 5,
  rsu: i % 4 === 0 ? null : 50 + i * 2,
  stockOptions: i % 5 === 0 ? null : 30 + i,
}));

export const ManyRows: Story = {
  args: {
    data: manyRowsData,
  },
};
