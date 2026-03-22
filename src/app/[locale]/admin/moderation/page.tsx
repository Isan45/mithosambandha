import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ModerationPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        Moderation Queue
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>User Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page will contain a queue of user-submitted reports for review.</p>
        </CardContent>
      </Card>
    </div>
  );
}
