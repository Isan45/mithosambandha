
import { getUser } from '@/lib/server-actions/users';
import { notFound } from 'next/navigation';
import { EditUserForm } from '@/components/admin/edit-user-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default async function EditUserPage({ 
  params 
}: { 
  params: Promise<{ uid: string }> 
}) {
  const { uid } = await params;
  const user = await getUser(uid);
  if (!user) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        Edit User Profile
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Editing: {user.fullName}</CardTitle>
          <CardDescription>UID: {user.uid}</CardDescription>
        </CardHeader>
        <CardContent>
          <EditUserForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
