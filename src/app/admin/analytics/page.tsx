import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        Analytics
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Platform Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page will contain charts and exports for KPIs.</p>
        </CardContent>
      </Card>
    </div>
  );
}
