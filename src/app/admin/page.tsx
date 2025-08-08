
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Profile } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserCheck, UserPlus, BrainCircuit, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    total: 0,
    approved: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileCounts() {
      try {
        const profilesCollection = collection(db, 'users');
        
        // Using getDocs to fetch all and then filter client-side
        // This is less efficient for large datasets but simpler for now.
        // For production, you might use separate queries or a summary document.
        const querySnapshot = await getDocs(profilesCollection);
        
        let approvedCount = 0;
        let pendingCount = 0;
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.profileStatus === 'approved') {
            approvedCount++;
          } else if (data.profileStatus === 'pending-review') {
            pendingCount++;
          }
        });

        setCounts({
          total: querySnapshot.size,
          approved: approvedCount,
          pending: pendingCount,
        });

      } catch (error) {
        console.error("Error fetching profile counts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileCounts();
  }, []);

  const DashboardCard = ({ title, value, icon: Icon, description, isLoading }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-1/2" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Total Profiles" 
          value={counts.total}
          icon={Users}
          description="All user accounts created"
          isLoading={loading}
        />
        <DashboardCard 
          title="Approved Profiles" 
          value={counts.approved}
          icon={UserCheck}
          description="Live on the public site"
          isLoading={loading}
        />
        <DashboardCard 
          title="Pending Submissions" 
          value={counts.pending}
          icon={UserPlus}
          description="Awaiting review"
          isLoading={loading}
        />
        <DashboardCard 
          title="AI Matchmaker" 
          value="Ready"
          icon={BrainCircuit}
          description="Generate suggestions"
          isLoading={false} // AI status is not fetched
        />
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Welcome, Admin!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Use the navigation on the left to manage profile submissions and
              use the matchmaking tools. The AI Match Suggestions can help you
              find compatible pairs quickly.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
