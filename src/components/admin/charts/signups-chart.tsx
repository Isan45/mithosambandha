
'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  signups: {
    label: 'Sign-ups',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function SignupsChart({ data }: { data?: {date: string, signups: number}[] }) {
   if (!data || data.length === 0) {
    return <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground">No sign-up data available</div>
  }
  return (
    <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
            <LineChart
                accessibilityLayer
                data={data}
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
                <YAxis />
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
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={true}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
}
