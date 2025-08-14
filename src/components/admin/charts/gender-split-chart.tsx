
'use client';

import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export function GenderSplitChart({ data }: { data?: Record<string, number> }) {
  
  const chartData = data ? Object.entries(data).map(([gender, users]) => ({ gender, users })) : [];

  if (!chartData || chartData.length === 0) {
    return <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground">No gender data available</div>
  }

  const chartConfig = {
    users: {
      label: 'Users',
    },
    ...chartData.reduce((acc, item, index) => {
      acc[item.gender] = {
        label: item.gender.charAt(0).toUpperCase() + item.gender.slice(1),
        color: COLORS[index % COLORS.length],
      };
      return acc;
    }, {} as any),
  };
  
  return (
     <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
            <PieChart>
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="gender"/>}
                />
                 <Pie
                    data={chartData}
                    dataKey="users"
                    nameKey="gender"
                    innerRadius={60}
                    strokeWidth={5}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartConfig[entry.gender]?.color} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
}
