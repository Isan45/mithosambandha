
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Loader2, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { suspendUser } from '@/lib/server-actions/users';
import { revalidatePath } from 'next/cache';

type StatsPayload = {
  totals: {
    totalUsers: number;
    usersThisMonth: number;
    usersThisWeek: number;
    usersToday: number;
    totalPremium: number;
    premiumThisMonth: number;
    premiumToday: number;
    totalRevenue: number;
    revenueMonth: number;
    revenueDay: number;
    activeLast7Days: number;
  };
  breakdowns: {
    byCountry: Record<string, number>;
    byGender: Record<string, number>;
    profileCompletionBuckets: Record<string, number>;
  };
};

type ProfileRow = {
  uid: string;
  displayName?: string;
  email?: string;
  createdAt?: { _seconds: number };
  membership?: string;
  profileStatus?: string;
  account?: { suspended?: boolean; restricted?: boolean };
  verification?: any;
  basic?: any;
};

const FIREBASE_ADMIN_ERROR_MSG = 'Firebase Admin SDK has not been initialized';

export default function AdminDashboardPage() {
  const { user, getIdToken } = useAuth();
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!getIdToken) return;
    setLoading(true);
    try {
      const idToken = await getIdToken();
      if (!idToken) throw new Error('Could not get ID token.');
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to fetch stats');
      setStats(json);
    } catch (err: any) {
      console.error('fetchStats', err);
      if (err.message?.includes(FIREBASE_ADMIN_ERROR_MSG)) {
        setBackendError(err.message);
      } else {
        alert(`Error fetching stats: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  const fetchRecentUsers = useCallback(async () => {
    if (!getIdToken) return;
    try {
      const idToken = await getIdToken();
      if (!idToken) throw new Error('Could not get ID token.');
      const res = await fetch('/api/admin/recent-users', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to fetch users');
      setUsers(json.users || []);
    } catch (err: any)
    {
      console.error('fetchRecentUsers error:', err);
      if (err.message?.includes(FIREBASE_ADMIN_ERROR_MSG)) {
        setBackendError(err.message);
      } else {
        alert(`Error fetching users: ${err.message}`);
      }
    }
  }, [getIdToken]);

  useEffect(() => {
    if (user && getIdToken) {
      fetchStats();
      fetchRecentUsers();
    }
  }, [user, getIdToken, fetchStats, fetchRecentUsers]);

  async function runUserAction(targetUid: string, action: string) {
    if (!getIdToken) return;
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      setBusy(true);
      const idToken = await getIdToken();
      if (!idToken) throw new Error('Could not get ID token.');
      const res = await fetch('/api/admin/user-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ targetUid, action }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Action failed');
      alert('Done');
      fetchStats();
      fetchRecentUsers();
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes(FIREBASE_ADMIN_ERROR_MSG)) {
        setBackendError(err.message);
      } else {
        alert(err.message || 'Error');
      }
    } finally {
      setBusy(false);
    }
  }

  const handleSuspend = async (formData: FormData) => {
    'use server';
    const uid = formData.get('uid') as string;
    if (uid) {
      await suspendUser(uid, 'Suspended by admin from dashboard.');
      revalidatePath('/admin');
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
         <Button onClick={() => { setBackendError(null); fetchStats(); fetchRecentUsers(); }} disabled={loading || busy}>
            { (loading || busy) ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null }
            Refresh Data
          </Button>
      </div>
      
       {backendError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Backend Configuration Error</AlertTitle>
          <AlertDescription>
            The admin dashboard cannot fetch live data. Please ensure the `FIREBASE_SERVICE_ACCOUNT_BASE64` environment variable is set correctly on the server.
            <pre className="mt-2 bg-black/20 p-2 rounded-md text-xs whitespace-pre-wrap">{backendError}</pre>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '—' : stats?.totals.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.totals.usersThisWeek} this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '—' : stats?.totals.activeLast7Days}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? '—' : `${(
                ((stats?.totals.activeLast7Days || 0) /
                  (stats?.totals.totalUsers || 1)) *
                100
              ).toFixed(1)}% of total users`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signups by Gender</CardTitle>
          </CardHeader>
          <CardContent>
             {loading ? <p>—</p> : (
              <div className="space-y-1 text-sm">
                {Object.entries(stats?.breakdowns.byGender || {}).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span>{k}</span><span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signups by Country</CardTitle>
          </CardHeader>
          <CardContent>
           {!stats || loading ? <p>—</p> : (
              <div className="space-y-1">
                {Object.entries(stats.breakdowns.byCountry).slice(0, 3).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span>{k}</span><span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 && !loading && (
                  <TableRow><TableCell colSpan={4} className="text-center">No recent users</TableCell></TableRow>
                )}
                 {loading && users.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin"/></TableCell></TableRow>
                )}
                {users.map(u => (
                  <TableRow key={u.uid}>
                    <TableCell>
                      <div className="font-medium">{u.displayName || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">{u.email}</div>
                    </TableCell>
                    <TableCell>{u.createdAt ? new Date(u.createdAt._seconds * 1000).toLocaleDateString() : '—'}</TableCell>
                    <TableCell>{u.profileStatus}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm"><Link href={`/admin/users/${u.uid}`}>Inspect</Link></Button>
                         <form action={handleSuspend} className="inline-block">
                           <input type="hidden" name="uid" value={u.uid} />
                           <Button type="submit" variant="destructive" size="sm">Suspend</Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
