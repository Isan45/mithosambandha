import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function MonitoringPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        System Monitoring
      </h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Health & Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This page will display server uptime, performance metrics, and fraud detection alerts.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Administrative Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Activity history</div>
            <p className="text-xs text-muted-foreground">Track all administrative actions across the platform.</p>
            <Link href="/admin/monitoring/audit-logs" className="mt-4 block text-sm font-semibold text-primary hover:underline">
              View Audit Logs &rarr;
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
