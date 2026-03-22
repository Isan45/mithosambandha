import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MatchesPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        Match Engine
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Match Analytics & Control</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page will contain tools to analyze, trigger, and export matches.</p>
        </CardContent>
      </Card>
    </div>
  );
}
