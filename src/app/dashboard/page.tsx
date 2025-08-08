
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfile {
  fullName?: string;
  profileStatus?: string;
  onboardingReason?: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setLoadingProfile(false);
        }
      }
    }
    fetchProfile();
  }, [user]);

  if (!user || loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  const getProgress = () => {
    switch (profile?.profileStatus) {
      case 'incomplete':
        return 10;
      case 'in-progress-personal':
        return 25;
      // Add more cases as onboarding progresses
      default:
        return 10;
    }
  };
  
  const progress = getProgress();
  const steps = [
    { name: 'Create Account', completed: true },
    { name: 'Personal Information', completed: progress > 10 },
    { name: 'Education & Career', completed: progress > 25 },
    { name: 'About You & Preferences', completed: progress > 50 },
    { name: 'Upload Photos', completed: progress > 75 },
  ];


  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-2 text-3xl font-bold">
        Welcome, {profile?.fullName || user.email}!
      </h1>
      <p className="mb-6 text-muted-foreground">
        Let's complete your profile to start your journey.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Profile Progress</CardTitle>
          <CardDescription>
            A complete profile is key to finding the best matches.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <Progress value={progress} className="w-full" />
            <span className="text-lg font-bold text-primary">{progress}%</span>
          </div>
          
          <div className="mt-6 space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <span className={cn(step.completed ? 'text-foreground' : 'text-muted-foreground')}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button asChild>
              <Link href="/onboarding/create-profile">
                {progress === 100 ? 'View My Profile' : 'Continue Building Profile'}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
