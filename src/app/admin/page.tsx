
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import {
  Loader2,
  AlertTriangle,
  Users,
  Activity,
  DollarSign,
  UserCheck,
  HeartHandshake,
  Wand2,
  ShieldAlert,
} from 'lucide-react';
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
import { SignupsChart } from '@/components/admin/charts/signups-chart';
import { AgeDistributionChart } from '@/components/admin/charts/age-distribution-chart';
import { GenderSplitChart } from '@/components/admin/charts/gender-split-chart';

type StatsPayload = {
  totals: {
    totalUsers: number;
    activeLast7Days: number;
    totalRevenue: number;
    pendingVerifications: number;
    totalPremiumUsers: number;
    revenueThisWeek: number;
    revenueThisMonth: number;
  };
  breakdowns: {
    byGender: Record<string, number>;
  };
  charts: {
    signupsLast10Days: { date: string; signups: number }[];
    ageDistribution: { ageGroup: string; users: number }[];
  };
};

type ProfileRow = {
  uid: string;
  fullName?: string;
  email?: string;
  createdAt?: { _seconds: number; _nanoseconds: number };
  profileStatus?: string;
};

const FIREBASE_ADMIN_ERROR_MSG = 'Firebase Admin SDK has not been initialized';

export default function AdminDashboardPage() {
  const { user, getIdToken } = useAuth();
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!getIdToken) return;
    setLoading(true);
    setBackendError(null);
    try {
      const idToken = await getIdToken();
      if (!idToken) throw new Error('Could not get ID token.');

      // Fetch stats and users in parallel
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${idToken}` },
        }),
        fetch('/api/admin/recent-users', {
          headers: { Authorization: `Bearer ${idToken}` },
        }),
      ]);

      const statsJson = await statsRes.json();
      if (!statsRes.ok)
        throw new Error(statsJson?.error || 'Failed to fetch stats');
      setStats(statsJson);

      const usersJson = await usersRes.json();
      if (!usersRes.ok)
        throw new Error(usersJson?.error || 'Failed to fetch users');
      setUsers(usersJson.users || []);
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      if (err.message?.includes(FIREBASE_ADMIN_ERROR_MSG)) {
        setBackendError(err.message);
      } else {
        setBackendError('An unknown error occurred while fetching data.');
      }
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    if (user && getIdToken) {
      fetchDashboardData();
    }
  }, [user, getIdToken, fetchDashboardData]);

  const handleSuspend = async (formData: FormData) => {
    const uid = formData.get('uid') as string;
    if (uid) {
      try {
        await suspendUser(uid, 'Suspended by admin from dashboard.');
        await fetchDashboardData(); // Refetch all data
      } catch (error: any) {
        alert(`Failed to suspend user: ${error.message}`);
      }
    }
  };

  const MetricCard = ({ title, value, icon, description, children }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? '...' : value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {children}
      </CardContent>
    </Card>
  );

  const premiumPercentage = stats?.totals.totalUsers 
    ? ((stats.totals.totalPremiumUsers / stats.totals.totalUsers) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
        <Button
          onClick={() => {
            fetchDashboardData();
          }}
          disabled={loading || busy}
        >
          {loading || busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Refresh Data
        </Button>
      </div>

      {backendError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Backend Configuration Error</AlertTitle>
          <AlertDescription>
            The admin dashboard cannot fetch live data. Please ensure the
            `FIREBASE_SERVICE_ACCOUNT_BASE64` environment variable is set
            correctly on the server.
            <pre className="mt-2 bg-black/20 p-2 rounded-md text-xs whitespace-pre-wrap">
              {backendError}
            </pre>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={stats?.totals.totalUsers ?? '0'}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        >
          <p className="text-xs text-muted-foreground">
            {stats ? `${stats.totals.totalPremiumUsers} premium (${premiumPercentage}%)` : '...'}
          </p>
        </MetricCard>
        <MetricCard
          title="Active Users (7d)"
          value={stats?.totals.activeLast7Days ?? '0'}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        >
             <p className="text-xs text-muted-foreground">
                {stats ? `${stats.breakdowns.byGender['male'] || 0} M / ${stats.breakdowns.byGender['female'] || 0} F` : '...'}
             </p>
        </MetricCard>
        <MetricCard
          title="Total Revenue"
          value={`$${stats?.totals.totalRevenue ?? '0'}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        >
            <p className="text-xs text-muted-foreground">
                {stats ? `$${stats.totals.revenueThisWeek} this week / $${stats.totals.revenueThisMonth} this month` : '...'}
            </p>
        </MetricCard>
        <MetricCard
          title="Pending Verifications"
          value={stats?.totals.pendingVerifications ?? '0'}
          icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
          description={
            <Link
              href="/admin/moderation/verify"
              className="text-primary hover:underline"
            >
              Review now
            </Link>
          }
        />
      </div>
      
       <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <MetricCard title="Match Success" icon={<HeartHandshake className="h-4 w-4 text-muted-foreground" />}>
          <p className="text-sm text-muted-foreground">Metrics on matches made, success stories, and churn rate will appear here.</p>
        </MetricCard>
        <MetricCard title="AI Insights" icon={<Wand2 className="h-4 w-4 text-muted-foreground" />}>
           <p className="text-sm text-muted-foreground">Predictive trends and churn alerts generated by AI will be displayed here.</p>
        </MetricCard>
        <MetricCard title="Fraud Alerts" icon={<ShieldAlert className="h-4 w-4 text-muted-foreground" />}>
            <p className="text-sm text-muted-foreground">Alerts for suspicious IPs, duplicate accounts, and abnormal activity will show here.</p>
        </MetricCard>
      </div>


      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Sign-ups</CardTitle>
            <CardDescription>User sign-ups over the last 10 days.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[250px] w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <SignupsChart data={stats?.charts.signupsLast10Days} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>Ratio of male to female users.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[250px] w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <GenderSplitChart data={stats?.breakdowns.byGender} />
            )}
          </CardContent>
        </Card>
      </div>
      
       <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
         <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>User Age Distribution</CardTitle>
              <CardDescription>Breakdown of users by age groups.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                <div className="h-[300px] w-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
                ) : (
                <AgeDistributionChart data={stats?.charts.ageDistribution} />
                )}
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recently Joined</CardTitle>
            <CardDescription>
              The last 5 users to sign up.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No recent users
                    </TableCell>
                  </TableRow>
                )}
                {loading && users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    </TableCell>
                  </TableRow>
                )}
                {users.slice(0, 5).map(u => (
                  <TableRow
                    key={u.uid}
                    className={
                      u.profileStatus === 'suspended' ? 'bg-destructive/10' : ''
                    }
                  >
                    <TableCell>
                      <div className="font-medium">{u.fullName || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {u.email}
                      </div>
                    </TableCell>
                    <TableCell>{u.profileStatus}</TableCell>
                    <TableCell className="text-right">
                       <Button asChild variant="outline" size="sm">
                         <Link href={`/admin/users/${u.uid}`}>Inspect</Link>
                       </Button>
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
