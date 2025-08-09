import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserInspectorPage({ params }: { params: { uid: string } }) {
  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        User Inspector
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Viewing Profile: {params.uid}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page will display the full details for a single user, with tabs for different sections like photos, activity, and audit logs.</p>
        </CardContent>
      </Card>
    </div>
  );
}
