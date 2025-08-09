
'use client';

import { Line, LineChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { date: '2024-07-01', signups: 22 },
  { date: '2024-07-02', signups: 25 },
  { date: '2024-07-03', signups: 20 },
  { date: '2024-07-04', signups: 28 },
  { date: '2024-07-05', signups: 30 },
  { date: '2024-07-06', signups: 26 },
  { date: '2024-07-07', signups: 32 },
  { date: '2024-07-08', signups: 35 },
  { date: '2024-07-09', signups: 31 },
  { date: '2024-07-10', signups: 29 },
];

const chartConfig = {
  signups: {
    label: 'Sign-ups',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function SignupsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
             const date = new Date(value);
             return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                 return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }}
            />
          }
        />
        <Line
          dataKey="signups"
          type="natural"
          stroke="var(--color-signups)"
          strokeWidth={2}
          dot={true}
        />
      </LineChart>
    </ChartContainer>
  );
}
