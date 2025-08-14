
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  users: {
    label: 'Users',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function AgeDistributionChart({ data }: { data?: {ageGroup: string, users: number}[] }) {
  if (!data || data.length === 0) {
    return <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">No age data available</div>
  }
  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <BarChart
                accessibilityLayer
                data={data}
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
                <Bar dataKey="users" fill="hsl(var(--primary))" radius={4} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
}
