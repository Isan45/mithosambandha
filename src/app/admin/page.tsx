
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { UserPlus, Users, FileText, DollarSign, LineChart as LineChartIcon, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { SignupsChart } from '@/components/admin/charts/signups-chart';
import { GenderSplitChart } from '@/components/admin/charts/gender-split-chart';
import { AgeDistributionChart } from '@/components/admin/charts/age-distribution-chart';

// Correctly defined as a standalone functional component
const DashboardCard = ({ title, value, icon: Icon, description, href, cta }: {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
}) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <Link href={href} className='text-sm font-bold text-primary pt-2 block hover:underline'>
          {cta}
        </Link>
      </CardContent>
    </Card>
);

export default function AdminDashboardPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">Admin Mission Control</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Users"
          value="1,254"
          icon={Users}
          description="+20.1% from last month"
          href="/admin/users"
          cta="Manage Users"
        />
        <DashboardCard
          title="Pending Verifications"
          value="12"
          icon={UserPlus}
          description="ID & photo checks needed"
          href="/admin/moderation/verify"
          cta="Go to Queue"
        />
        <DashboardCard
          title="Open Moderation Reports"
          value="3"
          icon={FileText}
          description="User-submitted conduct reports"
          href="/admin/moderation"
          cta="Review Reports"
        />
         <DashboardCard
          title="Total Revenue"
          value="₹45,231"
          icon={DollarSign}
          description="+180.1% from last month"
          href="/admin/analytics"
          cta="View Analytics"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <LineChartIcon />
              Sign-ups This Month
            </CardTitle>
             <CardDescription>
              A visual representation of new user growth over the past 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent className='pl-2'>
            <SignupsChart />
          </CardContent>
        </Card>
         <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <PieChartIcon />
                Gender Distribution
            </CardTitle>
            <CardDescription>
                The gender split of all approved users on the platform.
            </CardDescription>
          </Header>
          <CardContent>
             <GenderSplitChart />
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <BarChart3 />
                    Age Distribution
                </CardTitle>
                <CardDescription>
                    A breakdown of the user base by age groups.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <AgeDistributionChart />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
