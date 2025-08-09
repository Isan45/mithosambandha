import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        Admin Settings
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page will contain settings for admin roles, API keys, and feature flags.</p>
        </CardContent>
      </Card>
    </div>
  );
}
