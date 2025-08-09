
import { getUsers } from '@/lib/server-actions/users';
import type { UserProfile } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Cake, MapPin, Hash, UserCircle, Images } from 'lucide-react';
import Image from 'next/image';

function calculateAge(dob?: string) {
  if (!dob) return 'N/A';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default async function VerificationPage() {
  const allUsers = await getUsers();
  const pendingProfiles = allUsers.filter(
    (user) => user.profileStatus === 'pending-review'
  );

  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        Verification Queue
      </h1>

      {pendingProfiles.length > 0 ? (
        <div className="space-y-6">
          {pendingProfiles.map((profile) => (
            <Card key={profile.uid}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-headline text-2xl">
                      {profile.displayName}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-sm">
                       <span className="flex items-center gap-1.5">
                        <Hash className="h-4 w-4" /> {profile.uid}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Cake className="h-4 w-4" />{' '}
                        {calculateAge(profile.basic?.dob)} years old
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />{' '}
                        {profile.basic?.city || 'N/A'}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">Pending Review</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div>
                  <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><UserCircle /> Profile Photo</h4>
                   <div className="flex gap-4">
                    {profile.photos?.find(p => p.id === 'profile-photo') ? (
                       <div className="relative h-40 w-40">
                          <Image
                            src={profile.photos.find(p => p.id === 'profile-photo')!.url}
                            alt="Profile Photo"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-md border-2 border-primary"
                          />
                        </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No profile photo uploaded.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><Images /> Gallery Photos</h4>
                  <div className="flex flex-wrap gap-4">
                    {profile.photos && profile.photos.filter(p => p.id !== 'profile-photo').length > 0 ? (
                      profile.photos.filter(p => p.id !== 'profile-photo').map((photo, index) => (
                        <div key={index} className="relative h-32 w-32">
                          <Image
                            src={photo.url}
                            alt={`Gallery photo ${index + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-md"
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

                 <div>
                  <h4 className="font-semibold text-lg mb-2">ID Document</h4>
                   <div className="flex gap-4">
                    {/* Placeholder for ID document - assuming it's stored differently or not displayed directly */}
                     <p className="text-sm text-muted-foreground">
                        ID Verification feature to be implemented.
                      </p>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-4">
                  <Button
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled
                  >
                    <X className="mr-2 h-4 w-4" /> Reject
                  </Button>
                  <Button
                    className="bg-green-600 text-white hover:bg-green-700"
                    disabled
                  >
                    <Check className="mr-2 h-4 w-4" /> Approve
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <CardHeader>
            <CardTitle>All Caught Up!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              There are no pending profile submissions to review.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
