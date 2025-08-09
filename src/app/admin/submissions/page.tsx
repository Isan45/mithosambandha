
'use client';

import { useState, useEffect } from 'react';
import type { UserProfile } from '@/types';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Cake, MapPin, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function SubmissionsPage() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPendingProfiles() {
      setIsLoading(true);
      try {
        const profilesCollection = collection(db, 'users');
        const q = query(
          profilesCollection,
          where('profileStatus', '==', 'pending-review')
        );
        const querySnapshot = await getDocs(q);
        const pendingProfiles = querySnapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data(),
        })) as UserProfile[];
        setProfiles(pendingProfiles);
      } catch (error) {
        console.error('Error fetching pending profiles:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch pending submissions.',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPendingProfiles();
  }, [toast]);

  const handleDecision = async (
    profileId: string,
    newStatus: 'approved' | 'rejected'
  ) => {
    try {
      const userDocRef = doc(db, 'users', profileId);
      await updateDoc(userDocRef, {
        profileStatus: newStatus,
      });

      setProfiles(currentProfiles =>
        currentProfiles.filter(p => p.uid !== profileId)
      );

      toast({
        title: 'Success!',
        description: `Profile has been ${newStatus}.`,
      });
    } catch (error) {
      console.error(`Error updating profile to ${newStatus}:`, error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update the profile status.',
      });
    }
  };

  const calculateAge = (dobString?: string) => {
    if (!dobString) return 'N/A';
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        Profile Submissions
      </h1>
      {profiles.length > 0 ? (
        <div className="space-y-6">
          {profiles.map(profile => (
            <Card key={profile.uid}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-headline text-2xl">
                      {profile.fullName}
                    </CardTitle>
                    <CardDescription>
                      <span className="mt-1 flex items-center gap-2">
                        <Cake className="h-4 w-4" />{' '}
                        {calculateAge(profile.profile?.dob)} years old
                        <span className="mx-1">·</span>
                        <MapPin className="h-4 w-4" />{' '}
                        {profile.profile?.currentLocation || 'N/A'}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">Pending Review</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold">Bio</h4>
                  <p className="text-sm text-muted-foreground">
                    {profile.profile?.bio || 'No bio provided.'}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Partner Preferences</h4>
                  <p className="text-sm text-muted-foreground">
                    {profile.profile?.partnerPreferences
                      ?.additionalPreferences || 'No preferences specified.'}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Photos</h4>
                  <div className="flex gap-4">
                    {profile.profile?.galleryPhotos?.length ? (
                      profile.profile.galleryPhotos.map((photo, index) => (
                        <div key={index} className="relative h-32 w-32">
                          <Image
                            src={photo}
                            alt={`photo ${index + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-md"
                            data-ai-hint="portrait person"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No gallery photos uploaded.
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDecision(profile.uid, 'rejected')}
                    className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="mr-2 h-4 w-4" /> Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDecision(profile.uid, 'approved')}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Check className="mr-2 h-4 w-4" /> Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <CardTitle className="font-headline">All Caught Up!</CardTitle>
          <CardDescription className="mt-2">
            There are no pending profile submissions to review.
          </CardDescription>
        </Card>
      )}
    </div>
  );
}
