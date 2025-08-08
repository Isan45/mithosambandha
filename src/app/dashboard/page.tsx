
'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import {
  Loader2,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building,
  GraduationCap,
  Heart,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Eye,
  HeartHandshake,
  Users,
} from 'lucide-react';
import type { UserProfile } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ProfileSection } from '@/components/dashboard/profile-section';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const DetailItem = ({ icon: Icon, label, value, action }: any) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-4">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || 'N/A'}</p>
      </div>
    </div>
    {action}
  </div>
);

const VerificationStatus = ({ verified, onVerify }: { verified?: boolean; onVerify?: () => void; }) =>
  verified ? (
    <span className="flex items-center gap-1 text-xs text-green-600">
      <CheckCircle className="h-4 w-4" /> Verified
    </span>
  ) : (
    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onVerify}>
      Verify Now
    </Button>
  );

const AnalyticsCard = ({ icon: Icon, value, title, period }: { icon: React.ElementType, value: string, title: string, period: string }) => (
    <Card>
        <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
                <span>{title}</span>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold">{value}</CardTitle>
        </CardHeader>
        <CardContent>
             <p className="text-xs text-muted-foreground">{period}</p>
        </CardContent>
    </Card>
)

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProfile() {
      if (authLoading) return;
      if (user) {
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
      } else {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user, authLoading, toast]);

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

  const isSectionIncomplete = (section: string) => {
    // A more robust check based on your profileStatus logic
    return profile.profileStatus?.includes(section);
  };
  
  const pp = p.partnerPreferences;

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="font-headline text-4xl font-bold">
            Welcome, {profile.fullName}
          </h1>
          <p className="text-muted-foreground">
            This is your personal dashboard. Let's find your Mitho Sambandha.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
                 {/* Main Profile Card */}
                <Card>
                    <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="md:col-span-1">
                        <Image
                            src={profilePhotoUrl}
                            alt="Profile Photo"
                            width={400}
                            height={400}
                            className="aspect-square w-full rounded-lg object-cover shadow-md"
                            data-ai-hint="person portrait"
                        />
                         <div className="mt-4 space-y-1">
                           <DetailItem icon={Mail} label="Email" value={profile.email} action={<VerificationStatus verified={user?.emailVerified} />} />
                           <DetailItem icon={Phone} label="Phone" value={p.phoneNumber} action={<VerificationStatus verified={!!p.phoneNumber} />} />
                           <DetailItem icon={ShieldCheck} label="ID" value={p.idVerified ? "Verified" : "Not Verified"} action={!p.idVerified && <Button asChild variant="outline" size="sm" className="h-7 text-xs"><Link href="/onboarding/photos">Upload ID</Link></Button>} />
                         </div>
                        </div>

                        <div className="space-y-4 md:col-span-2">
                        <h3 className="font-headline text-2xl font-bold">
                            {profile.fullName}
                        </h3>
                        <p className="text-muted-foreground">
                            Lives in {p.currentLocation || 'N/A'}
                        </p>
                        <Separator />
                        <div>
                            <h4 className="font-semibold">About Me</h4>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {p.bio || 'No bio provided.'}
                            </p>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <p><strong>Nationality:</strong> {p.nationality || 'N/A'}</p>
                            <p><strong>Age:</strong> {p.dob ? new Date().getFullYear() - new Date(p.dob).getFullYear() : 'N/A'}</p>
                            <p><strong>Religion:</strong> {p.religion || 'N/A'}</p>
                            <p><strong>Caste:</strong> {p.caste || 'N/A'}</p>
                             <p><strong>Height:</strong> {p.height ? `${p.height.feet}' ${p.height.inches}"` : 'N/A'}</p>
                             <p><strong>Diet:</strong> {p.dietaryHabits || 'N/A'}</p>
                        </div>
                        </div>
                    </div>
                    </CardContent>
                </Card>

                {/* Education Section */}
                <ProfileSection title="Education & Career" icon={GraduationCap} isIncomplete={isSectionIncomplete('education') || isSectionIncomplete('career')} editPath="/onboarding/education">
                    <p><strong>Highest Education:</strong> {p.education?.highestEducation || 'N/A'}</p>
                    <p><strong>College/University:</strong> {p.education?.college || 'N/A'}</p>
                    <p><strong>Profession:</strong> {p.career?.profession || 'N/A'}</p>
                    <p><strong>Income:</strong> {p.career?.income ? `NPR ${p.career.income}` : 'N/A'}</p>
                </ProfileSection>

                {/* Partner Preferences Section */}
                <ProfileSection title="Partner Preferences" icon={Heart} isIncomplete={!p.partnerPreferences} editPath="/onboarding/partner-preferences">
                    {!p.partnerPreferences && (
                        <div className="flex items-center gap-3 rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-amber-700">
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <p className="text-sm font-medium">Please complete this section so that we can find your perfect match.</p>
                        </div>
                    )}
                    {pp && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                             <p><strong>Age Range:</strong> {pp.age?.min && pp.age?.max ? `${pp.age.min} - ${pp.age.max} years` : 'Any'}</p>
                             <p><strong>Height Range:</strong> {pp.height?.minFt && pp.height?.maxFt ? `${pp.height.minFt}'${pp.height.minIn}" - ${pp.height.maxFt}'${pp.height.maxIn}"` : 'Any'}</p>
                             <p><strong>Desired Location:</strong> {pp.currentLocation || 'Any'}</p>
                             <p><strong>Religion / Caste:</strong> {pp.religion || 'Any'} / {pp.caste || 'Any'}</p>
                             <p><strong>Education:</strong> {pp.education || 'Any'}</p>
                             <p><strong>Occupation:</strong> {pp.occupation || 'Any'}</p>
                             <p><strong>Wants Kids:</strong> {pp.wantsKids || 'Any'}</p>
                             <p><strong>Dietary Habits:</strong> {pp.dietaryHabits || 'Any'}</p>
                         </div>
                    )}
                </ProfileSection>
                
                 {/* Gallery Section */}
                <ProfileSection title="Photo Gallery" icon={ImageIcon} isIncomplete={!p.galleryPhotos || p.galleryPhotos.length < 1} editPath="/onboarding/photos">
                    {p.galleryPhotos && p.galleryPhotos.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {p.galleryPhotos.map((photo, index) => (
                                <div key={index} className="relative aspect-square w-full overflow-hidden rounded-lg">
                                    <Image src={photo} alt={`Gallery photo ${index + 1}`} fill style={{objectFit: 'cover'}} data-ai-hint="person portrait" />
                                </div>
                            ))}
                        </div>
                    ): (
                        <p className="text-muted-foreground">No gallery photos uploaded.</p>
                    )}
                </ProfileSection>
            </div>

             {/* Right Column */}
            <div className="lg:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {profile.profileStatus === 'approved' ? (
                             <div className="flex items-center gap-3 rounded-md bg-green-500/10 p-4 text-green-700">
                                <CheckCircle className="h-6 w-6" />
                                <div>
                                    <h4 className="font-semibold">Your Profile is Live!</h4>
                                    <p className="text-sm">Your profile is approved and visible to others.</p>
                                </div>
                            </div>
                        ) : (
                             <div className="flex items-center gap-3 rounded-md bg-amber-500/10 p-4 text-amber-700">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <div>
                                    <h4 className="font-semibold">Pending Review</h4>
                                    <p className="text-sm">Our team is reviewing your profile. You'll be notified upon approval.</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <AnalyticsCard icon={HeartHandshake} value="12" title="New Matches" period="+3 this week" />
                    <AnalyticsCard icon={Eye} value="152" title="Profile Views" period="+20% this month" />
                    <AnalyticsCard icon={Users} value="8" title="Interests Received" period="+1 this week" />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Latest Matches</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="flex items-center gap-4">
                           <Avatar><AvatarImage src="https://placehold.co/100x100.png" /><AvatarFallback>SN</AvatarFallback></Avatar>
                           <div>
                               <p className="font-semibold">Sunita Nepali</p>
                               <p className="text-sm text-muted-foreground">Matched 2 days ago</p>
                           </div>
                           <Button size="sm" variant="outline" className="ml-auto">View</Button>
                       </div>
                       <div className="flex items-center gap-4">
                           <Avatar><AvatarImage src="https://placehold.co/100x100.png" /><AvatarFallback>RG</AvatarFallback></Avatar>
                           <div>
                               <p className="font-semibold">Ramesh Gurung</p>
                               <p className="text-sm text-muted-foreground">Matched 1 week ago</p>
                           </div>
                           <Button size="sm" variant="outline" className="ml-auto">View</Button>
                       </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
