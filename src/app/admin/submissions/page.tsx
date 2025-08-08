'use client'; // This page needs client-side state management

import { useState, useEffect } from 'react';
import type { Profile } from '@/types';
import { mockProfiles } from '@/lib/mock-data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Cake, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function SubmissionsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    // In a real app, you'd fetch this from an API.
    setProfiles(mockProfiles.filter(p => p.status === 'pending'));
  }, []);

  const handleDecision = (
    profileId: string,
    newStatus: 'approved' | 'rejected'
  ) => {
    // In a real app, this would be an API call to update the profile status.
    setProfiles(currentProfiles =>
      currentProfiles.filter(p => p.id !== profileId)
    );
    console.log(`Profile ${profileId} has been ${newStatus}.`);
    // You could also show a toast notification here.
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        Profile Submissions
      </h1>
      {profiles.length > 0 ? (
        <div className="space-y-6">
          {profiles.map(profile => (
            <Card key={profile.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-headline text-2xl">
                      {profile.name}
                    </CardTitle>
                    <CardDescription>
                      <span className="mt-1 flex items-center gap-2">
                        <Cake className="h-4 w-4" /> {profile.age} years old
                        <span className="mx-1">·</span>
                        <MapPin className="h-4 w-4" /> {profile.location}
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
                    {profile.bio}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Partner Preferences</h4>
                  <p className="text-sm text-muted-foreground">
                    {profile.partnerPreferences}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Photos</h4>
                  <div className="flex gap-4">
                    {profile.photos.map((photo, index) => (
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
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDecision(profile.id, 'rejected')}
                    className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="mr-2 h-4 w-4" /> Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDecision(profile.id, 'approved')}
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
