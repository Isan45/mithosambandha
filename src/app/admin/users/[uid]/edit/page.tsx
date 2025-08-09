import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditUserPage({ params }: { params: { uid: string } }) {
  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        Edit User Profile
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Editing Profile: {params.uid}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page will contain a form for admins to edit a user's profile information.</p>
        </CardContent>
      </Card>
    </div>
  );
}
