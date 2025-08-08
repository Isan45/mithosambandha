
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

  if (loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  const getProgress = () => {
    switch (profile?.profileStatus) {
      case 'incomplete':
        return 20;
      case 'in-progress-education':
        return 40;
      case 'in-progress-career':
        return 60;
      case 'in-progress-partner-preferences':
        return 80;
      case 'pending-review':
      case 'approved':
        return 100;
      default:
        return 10;
    }
  };
  
  const progress = getProgress();
  const steps = [
    { name: 'Create Account', completed: true },
    { name: 'Personal Information', completed: progress >= 40 },
    { name: 'Education & Career', completed: progress >= 60 },
    { name: 'Partner Preferences', completed: progress >= 80 },
    { name: 'Profile Submitted for Review', completed: progress === 100 },
  ];

  const getContinueLink = () => {
    switch (profile?.profileStatus) {
      case 'incomplete':
        return '/onboarding/create-profile';
      case 'in-progress-education':
        return '/onboarding/education';
      case 'in-progress-career':
        return '/onboarding/career';
      case 'in-progress-partner-preferences':
        return '/onboarding/partner-preferences';
      case 'pending-review':
      case 'approved':
        return '/dashboard'; // Stay on dashboard if complete
      default:
        return '/join';
    }
  }

  const continueLink = getContinueLink();

  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-2 text-3xl font-bold">
        Welcome, {profile?.fullName || user.email}!
      </h1>
      <p className="mb-6 text-muted-foreground">
        {progress === 100 ? "Your profile is under review." : "Let's complete your profile to start your journey."}
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Profile Progress</CardTitle>
          <CardDescription>
            {progress === 100 ? "Thank you for completing your profile. We will notify you once it's approved." : "A complete profile is key to finding the best matches."}
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
             {progress === 100 ? (
                <div className="text-center font-semibold text-green-600 rounded-md border border-green-200 bg-green-50 p-4">
                  <p>Your profile is complete and under review!</p>
                  <p className="text-sm font-normal text-green-700 mt-1">Our team will verify your details and you'll be notified upon approval.</p>
                </div>
              ) : (
                <Button asChild>
                  <Link href={continueLink}>Continue Building Profile</Link>
                </Button>
             )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
