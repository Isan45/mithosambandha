import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignupsChart } from '@/components/admin/charts/signups-chart';
import { AgeDistributionChart } from '@/components/admin/charts/age-distribution-chart';
import { GenderSplitChart } from '@/components/admin/charts/gender-split-chart';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 p-4 md:p-8">
      <h1 className="font-headline text-3xl font-bold">Analytics</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Sign-ups</CardTitle>
            <CardDescription>
              User sign-ups over the last 10 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupsChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>
              Ratio of male to female users on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GenderSplitChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Age Distribution</CardTitle>
          <CardDescription>
            The breakdown of users by age groups.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AgeDistributionChart />
        </CardContent>
      </Card>
    </div>
  );
}
