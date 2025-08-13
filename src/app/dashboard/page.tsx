
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
import type { Metadata } from 'next';


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

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
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
  }, [user, toast]);


  useEffect(() => {
    if (user) {
        fetchProfile();
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
  const pp = p.partnerPreferences;
  const profilePhotoUrl = p?.profilePhoto || 'https://placehold.co/800x600.png';
  
  // Calculate profile completeness
  const totalFields = 20; // Approx number of fields we ask for
  let completedFields = 0;
  if (p.bio) completedFields++;
  if (p.gender) completedFields++;
  if (p.dob) completedFields++;
  if (p.height) completedFields++;
  if (p.maritalStatus) completedFields++;
  if (p.currentLocation) completedFields++;
  if (p.education?.highestEducation) completedFields++;
  if (p.career?.profession) completedFields++;
  if (p.galleryPhotos?.length > 0) completedFields+=p.galleryPhotos.length;
  // Add more checks for other fields to get a more accurate percentage
  const profileCompleteness = Math.min(100, Math.round((completedFields / totalFields) * 100));


  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

        {/* Main Profile Card (Merged Design) */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Side: Photo & Verification */}
              <div className="md:col-span-4 lg:col-span-3 space-y-4">
                <Image
                  src={profilePhotoUrl}
                  alt="Profile Photo"
                  width={400}
                  height={400}
                  className="aspect-square w-full rounded-lg object-cover shadow-md"
                  data-ai-hint="person portrait"
                />
                <div className="space-y-1">
                  <DetailItem
                    icon={Mail}
                    label="Email"
                    value={profile.email}
                    action={<VerificationStatus verified={user?.emailVerified} />}
                  />
                  <DetailItem
                    icon={Phone}
                    label="Phone"
                    value={p.phoneNumber}
                    action={<VerificationStatus verified={!!p.phoneNumber} />}
                  />
                  <DetailItem
                    icon={ShieldCheck}
                    label="ID"
                    value={p.idVerified ? 'Verified' : 'Not Verified'}
                    action={
                      !p.idVerified && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                        >
                          <Link href="/onboarding/photos">Upload ID</Link>
                        </Button>
                      )
                    }
                  />
                </div>
              </div>

              {/* Right Side: Details & Actions */}
              <div className="md:col-span-8 lg:col-span-9 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h1 className="font-headline text-4xl font-bold">
                      {profile.fullName}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      ID: {user.uid.substring(0, 8).toUpperCase()} | Member
                      since:{' '}
                      {profile.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-base font-semibold">
                        {p.membership || 'Free Membership'}
                      </Badge>
                      <Button
                        asChild
                        variant="link"
                        size="sm"
                        className="p-0 h-auto"
                      >
                        <Link href="/pricing">Upgrade Plan</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
                    <Button asChild size="lg" className="w-full sm:w-auto">
                      <Link href="/search">
                        <Search className="mr-2 h-4 w-4" />
                        Find Matches
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/onboarding/create-profile">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Profile Completeness */}
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

                <Separator />

                {/* Bio */}
                <div>
                  <h4 className="font-semibold text-primary text-lg">
                    About Me
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {p.bio ||
                      'No bio provided. Complete your profile to get better matches!'}
                  </p>
                </div>

                <Separator />

                {/* Personal Details Pills */}
                <div>
                  <h4 className="font-semibold text-primary text-lg mb-3">
                    Personal Details
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <InfoPill label="Gender" value={p.gender} />
                    <InfoPill
                      label="Age"
                      value={
                        p.dob
                          ? `${
                              new Date().getFullYear() - new Date(p.dob).getFullYear()
                            } yrs`
                          : null
                      }
                    />
                    <InfoPill
                      label="Height"
                      value={
                        p.height ? `${p.height.feet}' ${p.height.inches}"` : null
                      }
                    />
                    <InfoPill label="Religion" value={p.religion} />
                    <InfoPill label="Location" value={p.currentLocation} />
                    <InfoPill label="Profession" value={p.career?.profession} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {/* Photo Gallery Section */}
            <ProfileSection
              title="Photo Gallery"
              icon={ImageIcon}
              editPath="/onboarding/photos"
            >
              {p.galleryPhotos && p.galleryPhotos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {p.galleryPhotos.map((photo, index) => (
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
      </div>
    </div>
  );

    
