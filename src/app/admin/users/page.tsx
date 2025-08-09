
import { getUsers } from '@/lib/server-actions/users';
import type { UserProfile } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye, Ban } from 'lucide-react';

function getPhotoUrl(user: UserProfile) {
    if (user.photos && user.photos.length > 0) {
        const approvedPhoto = user.photos.find(p => p.status === 'approved');
        return approvedPhoto?.thumb || approvedPhoto?.url || user.photos[0].url;
    }
    return 'https://placehold.co/40x40.png';
}

function getAge(dob?: string) {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="p-4 md:p-8">
        <h1 className="font-headline mb-6 text-3xl font-bold">User Management</h1>
        <Card>
            <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Browse, inspect, and manage user profiles.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Completion</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                        <TableRow key={user.uid}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={getPhotoUrl(user)}
                                        alt={user.displayName}
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-medium">{user.displayName}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{user.basic?.city || 'N/A'}</TableCell>
                            <TableCell>{(user.profileCompletion * 100).toFixed(0)}%</TableCell>
                            <TableCell>
                                <Badge variant={user.profileStatus === 'approved' ? 'default' : 'secondary'}>
                                    {user.profileStatus}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button asChild variant="outline" size="icon">
                                        <Link href={`/admin/users/${user.uid}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="destructive" size="icon">
                                        <Ban className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}

