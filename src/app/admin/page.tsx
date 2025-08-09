'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

export default function AdminDashboardPage() {
  const { user, getIdToken } = useAuth();
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [busy, setBusy] = useState(false);

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
      alert(`Error fetching stats: ${err.message}`);
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
      alert(`Error fetching users: ${err.message}`);
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
      alert(err.message || 'Error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-secondary/30">
       <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-headline">Admin Control Center</h1>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">Go to site</Link>
          <Button onClick={() => { fetchStats(); fetchRecentUsers(); }} disabled={loading || busy}>
            { (loading || busy) ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null }
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card><CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Total Users</div>
          <div className="text-2xl font-bold">{loading ? '—' : stats?.totals.totalUsers}</div>
          <div className="text-xs text-muted-foreground mt-1">This month: {loading ? '—' : stats?.totals.usersThisMonth} • Today: {loading ? '—' : stats?.totals.usersToday}</div>
        </CardContent></Card>

        <Card><CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Premium Members</div>
          <div className="text-2xl font-bold">{loading ? '—' : stats?.totals.totalPremium}</div>
          <div className="text-xs text-muted-foreground mt-1">This month: {loading ? '—' : stats?.totals.premiumThisMonth} • Today: {loading ? '—' : stats?.totals.premiumToday}</div>
        </CardContent></Card>

        <Card><CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Total Revenue</div>
          <div className="text-2xl font-bold">₹ {loading ? '—' : (stats?.totals.totalRevenue || 0)}</div>
          <div className="text-xs text-muted-foreground mt-1">Month: ₹ {loading ? '—' : stats?.totals.revenueMonth} • Today: ₹ {loading ? '—' : stats?.totals.revenueDay}</div>
        </CardContent></Card>

        <Card><CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Active (7d)</div>
          <div className="text-2xl font-bold">{loading ? '—' : stats?.totals.activeLast7Days}</div>
          <div className="text-xs text-muted-foreground mt-1">Profiles by completion: {loading ? '—' : Object.values(stats?.breakdowns.profileCompletionBuckets || {}).join(', ')}</div>
        </CardContent></Card>
      </div>

      {/* Breakdown charts (simple lists) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card><CardHeader><CardTitle>Signups by Country</CardTitle></CardHeader>
          <CardContent>
            {!stats ? <p>—</p> : (
              <div className="space-y-1">
                {Object.entries(stats.breakdowns.byCountry).slice(0, 20).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span>{k}</span><span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card><CardHeader><CardTitle>Signups by Gender</CardTitle></CardHeader>
          <CardContent>
            {!stats ? <p>—</p> : (
              <div className="space-y-1">
                {Object.entries(stats.breakdowns.byGender).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span>{k}</span><span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card><CardHeader><CardTitle>Profile Completion</CardTitle></CardHeader>
          <CardContent>
            {!stats ? <p>—</p> : (
              <div className="space-y-1">
                {Object.entries(stats.breakdowns.profileCompletionBuckets).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span>{k}%</span><span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent users & controls */}
      <Card>
        <CardHeader><CardTitle>Recent Users</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="p-4 text-center text-sm text-muted-foreground">No recent users</TableCell></TableRow>
                )}
                {users.map(u => (
                  <TableRow key={u.uid}>
                    <TableCell>{u.displayName || u.uid}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                    <TableCell className="text-sm">{u.createdAt ? new Date(u.createdAt._seconds * 1000).toLocaleDateString() : '—'}</TableCell>
                    <TableCell className="text-sm">{u.membership || 'Free'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 items-center">
                        <Button size="sm" onClick={() => runUserAction(u.uid, u.account?.suspended ? 'unban' : 'ban')} disabled={busy}>{u.account?.suspended ? 'Unban' : 'Ban'}</Button>
                        <Button size="sm" variant="outline" onClick={() => runUserAction(u.uid, 'verifyId')} disabled={busy}>Verify ID</Button>
                        <Button size="sm" variant="link" asChild><Link href={`/admin/users/${u.uid}`}>Inspect</Link></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
