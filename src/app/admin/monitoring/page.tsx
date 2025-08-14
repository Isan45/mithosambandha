import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MonitoringPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        System Monitoring
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Platform Health & Security</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will display server uptime, performance metrics, fraud detection alerts, and audit logs for admin actions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
