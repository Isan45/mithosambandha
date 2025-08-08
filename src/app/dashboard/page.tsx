
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
  Edit,
  MapPin,
  Cake,
  Briefcase,
  Globe,
  Soup,
  Cigarette,
  GlassWater,
  Sparkles,
  Award,
  BookUser,
  Scale,
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


const InfoPill = ({ label, value }: { label: string, value: string | number | null | undefined }) => (
    <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground">
      <span className="font-semibold">{label}:</span>
      <span>{value || 'N/A'}</span>
    </div>
  );


const VerificationStatus = ({ verified, onVerify }: { verified?: boolean; onVerify?: () => void; }) =>
  verified ? (
    <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
      <CheckCircle className="h-4 w-4" /> Verified
    </span>
  ) : (
    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onVerify}>
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
      // For now, always allow editing as per the new request.
      // This logic can be expanded later if needed.
      return true;
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
                        <div className="md:col-span-1 space-y-4">
                          <Image
                            src={profilePhotoUrl}
                            alt="Profile Photo"
                            width={400}
                            height={400}
                            className="aspect-square w-full rounded-lg object-cover shadow-md"
                            data-ai-hint="person portrait"
                          />
                          <div className="space-y-1">
                           <DetailItem icon={Mail} label="Email" value={profile.email} action={<VerificationStatus verified={user?.emailVerified} />} />
                           <DetailItem icon={Phone} label="Phone" value={p.phoneNumber} action={<VerificationStatus verified={!!p.phoneNumber} />} />
                           <DetailItem icon={ShieldCheck} label="ID" value={p.idVerified ? "Verified" : "Not Verified"} action={!p.idVerified && <Button asChild variant="outline" size="sm" className="h-8 text-xs"><Link href="/onboarding/photos">Upload ID</Link></Button>} />
                         </div>
                        </div>

                        <div className="space-y-6 md:col-span-2">
                           <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-headline text-3xl font-bold">
                                    {profile.fullName}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-base font-semibold">{p.membership || 'Free Membership'}</Badge>
                                    <Button asChild variant="link" size="sm" className="p-0 h-auto">
                                        <Link href="/pricing">Upgrade Plan</Link>
                                    </Button>
                                </div>
                              </div>
                              <Button asChild variant="outline">
                                <Link href="/onboarding/create-profile"><Edit className="mr-2 h-4 w-4" />Edit Profile</Link>
                              </Button>
                           </div>

                          <div>
                            <h4 className="font-semibold text-primary text-lg">About Me</h4>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {p.bio || 'No bio provided. Complete your profile to get better matches!'}
                            </p>
                          </div>
                          
                          <Separator/>

                          <div>
                              <h4 className="font-semibold text-primary text-lg mb-3">Personal Details</h4>
                              <div className="flex flex-wrap gap-2">
                                <InfoPill label="Gender" value={p.gender} />
                                <InfoPill label="Age" value={p.dob ? `${new Date().getFullYear() - new Date(p.dob).getFullYear()} yrs` : null} />
                                <InfoPill label="Height" value={p.height ? `${p.height.feet}' ${p.height.inches}"` : null} />
                                <InfoPill label="Religion" value={p.religion} />
                                <InfoPill label="Complexion" value={p.complexion} />
                                <InfoPill label="Location" value={p.currentLocation} />
                                <InfoPill label="Nationality" value={p.nationality} />
                                <InfoPill label="Profession" value={p.career?.profession} />
                                <InfoPill label="Diet" value={p.dietaryHabits} />
                                <InfoPill label="Smoking" value={p.smokingHabits} />
                                <InfoPill label="Drinking" value={p.drinkingHabits} />
                              </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                </Card>

                {/* Photo Gallery Section */}
                <ProfileSection title="Photo Gallery" icon={ImageIcon} editPath="/onboarding/photos">
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
                           <ImageIcon className="h-10 w-10 mb-2"/>
                           <p>Your photo gallery is empty.</p>
                           <p className="text-sm">Add more photos to get more attention.</p>
                        </div>
                    )}
                </ProfileSection>

                {/* Education Section */}
                <ProfileSection title="Education & Career" icon={GraduationCap} editPath="/onboarding/education">
                    <p><strong>Highest Education:</strong> {p.education?.highestEducation || 'N/A'}</p>
                    <p><strong>College/University:</strong> {p.education?.college || 'N/A'}</p>
                    <p><strong>Profession:</strong> {p.career?.profession || 'N/A'}</p>
                    <p><strong>Company:</strong> {p.career?.company || 'N/A'}</p>
                    <p><strong>Work Details:</strong> {p.career?.workDetails || 'N/A'}</p>
                    <p><strong>Income:</strong> {p.career?.income ? `NPR ${p.career.income}` : 'N/A'}</p>
                </ProfileSection>

                {/* Partner Preferences Section */}
                <ProfileSection title="Partner Preferences" icon={HeartHandshake} editPath="/onboarding/partner-preferences">
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
                         </div>
                    )}
                </ProfileSection>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <AnalyticsCard icon={HeartHandshake} value="12" title="New Matches" period="in the last 30 days" />
                        <AnalyticsCard icon={Eye} value="150" title="Profile Views" period="in the last 7 days" />
                        <AnalyticsCard icon={Users} value="5" title="Interests Received" period="this week" />
                    </CardContent>
                </Card>

                <Card>
                     <CardHeader>
                        <CardTitle>Pending Responses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">You have 3 interests awaiting your response.</p>
                        <Button className="w-full mt-4">View Interests</Button>
                    </CardContent>
                </Card>

                 <Card>
                     <CardHeader>
                        <CardTitle>Latest Matches</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                           <Avatar>
                               <AvatarImage src="https://placehold.co/100x100.png" />
                               <AvatarFallback>SN</AvatarFallback>
                           </Avatar>
                           <div>
                                <p className="font-semibold">Sarita Neupane</p>
                                <p className="text-xs text-muted-foreground">Matched 2 days ago</p>
                           </div>
                           <Button variant="outline" size="sm" className="ml-auto">View</Button>
                        </div>
                         <div className="flex items-center gap-4">
                           <Avatar>
                               <AvatarImage src="https://placehold.co/100x100.png" />
                               <AvatarFallback>RG</AvatarFallback>
                           </Avatar>
                           <div>
                                <p className="font-semibold">Rohan Ghimire</p>
                                <p className="text-xs text-muted-foreground">Matched 5 days ago</p>
                           </div>
                           <Button variant="outline" size="sm" className="ml-auto">View</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
