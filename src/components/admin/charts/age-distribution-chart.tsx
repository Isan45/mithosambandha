
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { ageGroup: '18-24', users: 186 },
  { ageGroup: '25-34', users: 305 },
  { ageGroup: '35-44', users: 237 },
  { ageGroup: '45-54', users: 73 },
  { ageGroup: '55+', users: 20 },
];

const chartConfig = {
  users: {
    label: 'Users',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function AgeDistributionChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="ageGroup"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
            />
          }
        />
        <Bar dataKey="users" fill="var(--color-users)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
