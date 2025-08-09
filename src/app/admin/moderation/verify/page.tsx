import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerificationPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        Verification Queue
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>ID & Photo Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page will contain a queue of user-submitted documents and photos for manual verification.</p>
        </CardContent>
      </Card>
    </div>
  );
}
