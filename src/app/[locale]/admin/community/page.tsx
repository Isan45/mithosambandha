import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CommunityPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        Community Features
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Groups & Events Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will contain tools to manage community groups, forums, events, and moderate user interactions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
