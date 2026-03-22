import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SupportPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        Support & Ticketing
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>User Support Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will feature an integrated helpdesk to manage user issues, categorized tickets, and response templates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
