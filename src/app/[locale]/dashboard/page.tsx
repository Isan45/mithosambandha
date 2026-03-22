
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import {
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  ImageIcon,
  CheckCircle,
  AlertCircle,
  Edit,
  Search,
  Gem,
} from 'lucide-react';
import type { UserProfile } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ProfileSection } from '@/components/dashboard/profile-section';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';

const DetailItem = ({ icon: Icon, label, value, action }: any) => (
  <div className="flex items-start justify-between py-3 border-b border-border/50">
    <div className="flex items-center gap-4">
      <Icon className="h-6 w-6 text-muted-foreground" />
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-muted-foreground">{value || 'N/A'}</p>
      </div>
    </div>
    <div className="flex-shrink-0">{action}</div>
  </div>
);

const InfoPill = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground">
    <span className="font-semibold">{label}:</span>
    <span>{value || 'N/A'}</span>
  </div>
);

const VerificationStatus = ({
  verified,
  onVerify,
}: {
  verified?: boolean;
  onVerify?: () => void;
}) =>
  verified ? (
    <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
      <CheckCircle className="h-4 w-4" /> Verified
    </span>
  ) : (
    <Button
      variant="outline"
      size="sm"
      className="h-8 text-xs"
      onClick={onVerify}
    >
      Verify Now
    </Button>
  );

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = useCallback(async (uid: string) => {
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not load your profile.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);


  useEffect(() => {
    if (user) {
        fetchProfile(user.uid);
    }
  }, [user, fetchProfile]);

  if (loading || authLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg text-muted-foreground">
          Please log in to view your dashboard.
        </p>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }
  
  if (profile?.profileStatus === 'rejected') {
    return (
        <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4 text-center">
            <AlertCircle className="w-16 h-16 text-destructive"/>
            <h1 className="text-2xl font-bold font-headline">Profile Rejected</h1>
            <p className="text-lg text-muted-foreground max-w-md">
            Unfortunately, your profile submission did not meet our guidelines. Please review our terms and contact support if you believe this is an error.
            </p>
            <Button asChild variant="outline">
                <Link href="/contact">Contact Support</Link>
            </Button>
        </div>
    )
  }

  if (profile?.profileStatus === 'pending-review') {
    return (
        <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-600"/>
            <h1 className="text-2xl font-bold font-headline">Profile Submitted</h1>
            <p className="text-lg text-muted-foreground">
             Your profile is under review by our team. We'll notify you once it's approved.
            </p>
        </div>
    )
  }

  if (!profile || !profile.profile) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg text-muted-foreground">
          Welcome! Let's get your profile started.
        </p>
        <Button asChild>
          <Link href="/onboarding/create-profile">Create Your Profile</Link>
        </Button>
      </div>
    );
  }

  const p = profile.profile;
  const profilePhotoUrl = p?.profilePhoto || 'https://placehold.co/800x600.png';
  
  const profileCompleteness = profile.profileCompletion ? Math.round(profile.profileCompletion * 100) : 0;


  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

        <Card>
           <CardHeader>
             <CardTitle className="font-headline text-2xl">Welcome to your Dashboard, {profile.fullName}!</CardTitle>
             <CardDescription>This is your central hub for managing your profile and finding matches.</CardDescription>
           </CardHeader>
           <CardContent>
                <div>
                  <Label htmlFor="profile-completeness">
                    Profile Completeness
                  </Label>
                  <Progress
                    value={profileCompleteness}
                    id="profile-completeness"
                    className="mt-2 h-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {profileCompleteness}% complete.{' '}
                    <Link
                      href="/onboarding/create-profile"
                      className="font-semibold text-primary hover:underline"
                    >
                      Complete now
                    </Link>{' '}
                    for better matches.
                  </p>
                </div>
                 <div className="mt-6 flex flex-wrap gap-4">
                    <Button asChild size="lg" className="w-full sm:w-auto">
                      <Link href="/discover">
                        <Search className="mr-2 h-4 w-4" />
                        Discover Matches
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/onboarding/create-profile">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Link>
                    </Button>
                    <Button
                        asChild
                        variant="link"
                        size="lg"
                      >
                        <Link href="/pricing"><Gem className="mr-1 h-3 w-3"/>Upgrade Plan</Link>
                      </Button>
                 </div>
           </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                 <CardHeader>
                    <CardTitle className="font-headline text-xl">Activity Feed</CardTitle>
                    <CardDescription>Recent likes and views on your profile.</CardDescription>
                 </CardHeader>
                 <CardContent className="text-center text-muted-foreground">
                    <p>Activity feed will be displayed here.</p>
                 </CardContent>
            </Card>
             <Card>
                 <CardHeader>
                    <CardTitle className="font-headline text-xl">Messages</CardTitle>
                    <CardDescription>Your recent conversations.</CardDescription>
                 </CardHeader>
                 <CardContent className="text-center text-muted-foreground">
                    <p>Recent messages will be displayed here.</p>
                 </CardContent>
            </Card>
        </div>

        <ProfileSection
            title="Photo Gallery"
            icon={ImageIcon}
            editPath="/onboarding/photos"
        >
            {p.galleryPhotos && p.galleryPhotos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {p.galleryPhotos.slice(0, 4).map((photo: string, index: number) => (
                <div key={index} className="relative aspect-square w-full">
                    <Image
                    src={photo}
                    alt={`Gallery photo ${index + 1}`}
                    fill
                    className="rounded-md object-cover"
                    data-ai-hint="person gallery"
                    />
                </div>
                ))}
            </div>
            ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                <ImageIcon className="h-10 w-10 mb-2" />
                <p>Your photo gallery is empty.</p>
                <p className="text-sm">
                Add more photos to get more attention.
                </p>
            </div>
            )}
        </ProfileSection>

      </div>
    </div>
  );
}
