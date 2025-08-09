
'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';

const chartData = [
  { gender: 'female', users: 68, fill: 'var(--color-female)' },
  { gender: 'male', users: 32, fill: 'var(--color-male)' },
];

const chartConfig = {
  users: {
    label: 'Users',
  },
  male: {
    label: 'Male',
    color: 'hsl(var(--chart-1))',
  },
  female: {
    label: 'Female',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function GenderSplitChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="users"
          nameKey="gender"
          innerRadius={60}
          strokeWidth={5}
        />
      </PieChart>
    </ChartContainer>
  );
}
