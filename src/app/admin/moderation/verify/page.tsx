

import { getUsers, approveProfile, rejectProfile } from '@/lib/server-actions/users';
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
import { Check, X, Cake, MapPin, Hash, UserCircle, Images, FileText, Heart } from 'lucide-react';
import Image from 'next/image';
import { revalidatePath } from 'next/cache';
import { Separator } from '@/components/ui/separator';

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

  const handleApprove = async (formData: FormData) => {
    'use server';
    const uid = formData.get('uid') as string;
    await approveProfile(uid);
    revalidatePath('/admin/moderation/verify');
  };

  const handleReject = async (formData: FormData) => {
    'use server';
    const uid = formData.get('uid') as string;
    // In a real app, you'd have a dialog to collect the reason
    const reason = "Information incomplete or does not meet guidelines."; 
    await rejectProfile(uid, reason);
    revalidatePath('/admin/moderation/verify');
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        Verification Queue
      </h1>

      {pendingProfiles.length > 0 ? (
        <div className="space-y-6">
          {pendingProfiles.map((user) => {
            const profile = (user as any).profile || {};
            return (
            <Card key={user.uid}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-headline text-2xl">
                      {user.fullName}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-sm">
                       <span className="flex items-center gap-1.5">
                        <Hash className="h-4 w-4" /> {user.uid}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Cake className="h-4 w-4" />{' '}
                        {calculateAge(profile.dob)} years old
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />{' '}
                        {profile.currentLocation || 'N/A'}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">Pending Review</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                         <div>
                          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><UserCircle /> Bio</h4>
                           <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md border">
                            {profile.bio || "No bio provided."}
                           </p>
                        </div>
                         <div>
                          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><Heart /> Partner Preferences</h4>
                           <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md border">
                            {profile.partnerPreferences?.additionalPreferences || "No specific preferences provided."}
                           </p>
                        </div>
                    </div>
                     <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><UserCircle /> Profile Photo</h4>
                            <div className="flex gap-4">
                                {profile.profilePhoto ? (
                                <div className="relative h-40 w-40">
                                    <Image
                                        src={profile.profilePhoto}
                                        alt="Profile Photo"
                                        width={160}
                                        height={160}
                                        className="rounded-md border-2 border-primary object-cover"
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
                            <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><FileText /> ID Document</h4>
                            <div className="flex gap-4">
                                {profile.idDocument ? (
                                    <div className="relative h-32 w-48">
                                    <Image
                                        src={profile.idDocument}
                                        alt="ID Document"
                                        width={192}
                                        height={128}
                                        className="rounded-md border p-2 object-contain"
                                    />
                                    </div>
                                ) : (
                                <p className="text-sm text-muted-foreground">
                                    No ID document uploaded.
                                </p>
                                )}
                            </div>
                        </div>
                     </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><Images /> Gallery Photos</h4>
                  <div className="flex flex-wrap gap-4">
                    {profile.galleryPhotos && profile.galleryPhotos.length > 0 ? (
                      profile.galleryPhotos.map((photo: string, index: number) => (
                        <div key={index} className="relative h-32 w-32">
                          <Image
                            src={photo}
                            alt={`Gallery photo ${index + 1}`}
                            width={128}
                            height={128}
                            className="rounded-md object-cover"
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

              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-4">
                  <form action={handleReject}>
                    <input type="hidden" name="uid" value={user.uid} />
                    <Button
                        type="submit"
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                        <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  </form>
                   <form action={handleApprove}>
                    <input type="hidden" name="uid" value={user.uid} />
                    <Button
                        type="submit"
                        className="bg-green-600 text-white hover:bg-green-700"
                    >
                        <Check className="mr-2 h-4 w-4" /> Approve
                    </Button>
                  </form>
              </CardFooter>
            </Card>
          )})}
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
