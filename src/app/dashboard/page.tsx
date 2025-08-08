
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Loader2,
  Edit,
  User,
  Heart,
  MessageSquare,
  Users,
  Eye,
  Camera,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import type { UserProfile } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const StatCard = ({ icon: Icon, value, label, isLoading }: any) => (
  <Card className="text-center">
    <CardContent className="p-4">
      {isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-12 animate-pulse rounded-md bg-muted" />
        </div>
      ) : (
        <>
          <Icon className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-2 text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </>
      )}
    </CardContent>
  </Card>
);

const ProfileDetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) => {
  if (!value) return null;
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-base">{value}</p>
    </div>
  );
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProfile() {
      // Only fetch if auth is complete and we have a user
      if (!authLoading && user) {
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
          // This will always run, preventing the loading state from getting stuck
          setLoading(false);
        }
      } else if (!authLoading && !user) {
        // Auth is complete, but there is no user
        setLoading(false);
        setProfile(null);
      }
    }
    fetchProfile();
  }, [user, authLoading, toast]);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to upload a photo.',
      });
      return;
    }

    setIsUploading(true);
    const storage = getStorage();
    const filePath = `user-photos/${user.uid}/profile-photo`;
    const storageRef = ref(storage, filePath);
    const userDocRef = doc(db, 'users', user.uid);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(userDocRef, {
        'profile.profilePhoto': downloadURL,
      });

      setProfile(
        prevProfile =>
          prevProfile
            ? ({
                ...prevProfile,
                profile: { ...prevProfile.profile, profilePhoto: downloadURL },
              } as UserProfile)
            : null
      );

      toast({
        title: 'Success!',
        description: 'Your profile photo has been updated.',
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description:
          error.code === 'storage/unauthorized'
            ? 'Permission denied. Please check your Firebase Storage security rules.'
            : 'There was an error updating your photo. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };


  const p = profile?.profile;
  const profilePhotoUrl = p?.profilePhoto || 'https://placehold.co/800x600.png';
  const galleryPhotos = p?.galleryPhotos?.length
    ? p.galleryPhotos
    : ['https://placehold.co/800x600.png'];

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile || !p) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg text-muted-foreground">
          Welcome! Let's get your profile started.
        </p>
        <Button onClick={() => (window.location.href = '/onboarding/create-profile')}>
          Create Your Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* My Profile Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-2xl">
                  My Profile
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-md">
                    <Image
                      src={profilePhotoUrl}
                      alt="Profile Photo"
                      fill
                      style={{ objectFit: 'cover' }}
                      data-ai-hint="person portrait"
                      unoptimized // Bypasses Next.js image optimization, helps with external URLs
                    />
                    <div className="absolute top-2 right-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg"
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={handleCameraClick}
                        disabled={isUploading || authLoading}
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="font-headline text-2xl font-bold">
                      {profile.fullName}
                    </h3>
                    <p className="text-muted-foreground">
                      {p.currentLocation}
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">About Me</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {p.bio || 'No bio provided.'}
                    </p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <ProfileDetailItem
                      label="Age"
                      value={
                        p.dob
                          ? new Date().getFullYear() -
                            new Date(p.dob).getFullYear()
                          : undefined
                      }
                    />
                    <ProfileDetailItem
                      label="Profession"
                      value={p.career?.profession}
                    />
                    <ProfileDetailItem
                      label="Education"
                      value={p.education?.highestEducation}
                    />
                    <ProfileDetailItem label="Religion" value={p.religion} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Responses Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Pending Responses
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>You have no pending interest requests.</p>
                <Button variant="link" className="mt-2">
                  View All
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Profile Status */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">
                  Profile Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.profileStatus === 'approved' ? (
                  <div className="flex items-center gap-3 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <p className="font-semibold">
                      Your profile is approved and live.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-amber-600">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-semibold">
                      Your profile is pending review.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Summary */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={Heart}
                value={12}
                label="New Matches"
                isLoading={false}
              />
              <StatCard
                icon={MessageSquare}
                value={3}
                label="Interests"
                isLoading={false}
              />
              <StatCard
                icon={Eye}
                value={45}
                label="Profile Views"
                isLoading={false}
              />
              <StatCard
                icon={Users}
                value={8}
                label="Shortlisted"
                isLoading={false}
              />
            </div>

            {/* Latest Matches Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">
                  Latest Matches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Placeholder for matched profiles */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-muted">
                    <Image
                      src="https://placehold.co/100x100.png"
                      width={100}
                      height={100}
                      alt="match"
                      className="rounded-lg"
                      data-ai-hint="person portrait"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">Sarita K.</p>
                    <p className="text-xs text-muted-foreground">
                      28 yrs, Pokhara
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-muted">
                    <Image
                      src="https://placehold.co/100x100.png"
                      width={100}
                      height={100}
                      alt="match"
                      className="rounded-lg"
                      data-ai-hint="person portrait"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">Rina T.</p>
                    <p className="text-xs text-muted-foreground">
                      29 yrs, Lalitpur
                    </p>
                  </div>
                </div>
                <Button className="mt-4 w-full">View All Matches</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
