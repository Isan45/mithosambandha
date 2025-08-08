
'use client';

import React, { useState, useEffect } from 'react';
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
  Search,
  MessageCircle,
  Crown,
  Trophy,
  Sparkles,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { mockProfiles } from '@/lib/mock-data';

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

// MOCK DATA FOR NEW SECTIONS
const MOCK_ACTIVITY_DATA = {
  profileViews: { total: 125, daily: 5 },
  messagesReceived: 8,
  interestsSent: 15,
  interestsReceived: 12,
  pendingRequests: 3,
  streak: 7,
  badges: ['First Message Sent', 'Popular Member'],
};

const MOCK_MATCHES = mockProfiles.filter(p => p.status === 'approved').slice(0, 4);
const MOCK_ONLINE_USERS = mockProfiles.filter(p => p.onlineStatus);
const MOCK_SMART_MATCH = mockProfiles.find(p => p.id === '2');


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
  const pp = p.partnerPreferences;
  const profilePhotoUrl = p?.profilePhoto || 'https://placehold.co/800x600.png';
  const profileCompleteness = 75; // Mock data for now

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* "Your Activity" section as KPI cards */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-4 font-headline">
            Your Activity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-5 rounded-2xl shadow-md flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">
                  {MOCK_ACTIVITY_DATA.profileViews.total}
                </p>
                <p className="text-xs text-green-500">
                  +{MOCK_ACTIVITY_DATA.profileViews.daily} today
                </p>
              </div>
              <Eye className="w-8 h-8 text-primary/60" />
            </Card>
            <Card className="p-5 rounded-2xl shadow-md flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Interests Received
                </p>
                <p className="text-2xl font-bold">
                  {MOCK_ACTIVITY_DATA.interestsReceived}
                </p>
              </div>
              <MessageCircle className="w-8 h-8 text-primary/60" />
            </Card>
            <Card className="p-5 rounded-2xl shadow-md flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Interests Sent</p>
                <p className="text-2xl font-bold">
                  {MOCK_ACTIVITY_DATA.interestsSent}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-primary/60" />
            </Card>
            <Card className="p-5 rounded-2xl shadow-md flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                <p className="text-2xl font-bold">
                  {MOCK_ACTIVITY_DATA.badges.length}
                </p>
              </div>
              <Crown className="w-8 h-8 text-primary/60" />
            </Card>
          </div>
        </div>

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
        
        {/* Online Now Section */}
        <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4 font-headline">Online Now</h2>
            <div className="flex space-x-4 overflow-x-auto pb-4 -m-4 p-4">
                {MOCK_ONLINE_USERS.map((onlineUser) => (
                    <Link key={onlineUser.id} href={`/profiles/${onlineUser.id}`} className="flex flex-col items-center space-y-2 flex-shrink-0 w-24">
                        <div className="relative">
                            <Avatar className="w-20 h-20 border-2 border-accent">
                                <AvatarImage src={onlineUser.profilePhoto} alt={onlineUser.name} />
                                <AvatarFallback>{onlineUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-500 ring-2 ring-background" />
                        </div>
                        <p className="text-sm font-medium text-center truncate w-full">{onlineUser.name}</p>
                    </Link>
                ))}
            </div>
        </div>

        {/* Smart Match Section */}
        {MOCK_SMART_MATCH && (
            <div>
                 <h2 className="text-xl md:text-2xl font-bold mb-4 font-headline flex items-center gap-2">
                    <Sparkles className="text-primary"/>
                    Smart Match
                </h2>
                <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                        <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                           <AvatarImage src={MOCK_SMART_MATCH.profilePhoto} alt={MOCK_SMART_MATCH.name}/>
                           <AvatarFallback>{MOCK_SMART_MATCH.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left flex-grow">
                            <CardTitle className="font-headline text-2xl">{MOCK_SMART_MATCH.name}, {MOCK_SMART_MATCH.age}</CardTitle>
                            <CardDescription className="mt-1">Based on your preferences, we think you'll get along!</CardDescription>
                             <p className="text-sm mt-2 line-clamp-2 text-muted-foreground">{MOCK_SMART_MATCH.bio}</p>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button asChild>
                            <Link href={`/profiles/${MOCK_SMART_MATCH.id}`}>View Profile</Link>
                          </Button>
                          <Button variant="outline">Send Interest</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}

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

            {/* Education Section */}
            <ProfileSection
              title="Education & Career"
              icon={GraduationCap}
              editPath="/onboarding/education"
            >
              <p>
                <strong>Highest Education:</strong>{' '}
                {p.education?.highestEducation || 'N/A'}
              </p>
              <p>
                <strong>College/University:</strong> {p.education?.college || 'N/A'}
              </p>
              <p>
                <strong>Profession:</strong> {p.career?.profession || 'N/A'}
              </p>
              <p>
                <strong>Company:</strong> {p.career?.company || 'N/A'}
              </p>
              <p>
                <strong>Work Details:</strong> {p.career?.workDetails || 'N/A'}
              </p>
              <p>
                <strong>Income:</strong>{' '}
                {p.career?.income ? `NPR ${p.career.income}` : 'N/A'}
              </p>
            </ProfileSection>
          </div>

          <div className="space-y-8">
            {/* Partner Preferences Section */}
            <ProfileSection
              title="Partner Preferences"
              icon={HeartHandshake}
              editPath="/onboarding/partner-preferences"
            >
              {!p.partnerPreferences && (
                <div className="flex items-center gap-3 rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-amber-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">
                    Please complete this section so that we can find your perfect
                    match.
                  </p>
                </div>
              )}
              {pp && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <p>
                    <strong>Age Range:</strong>{' '}
                    {pp.age?.min && pp.age?.max
                      ? `${pp.age.min} - ${pp.age.max} years`
                      : 'Any'}
                  </p>
                  <p>
                    <strong>Height Range:</strong>{' '}
                    {pp.height?.minFt && pp.height?.maxFt
                      ? `${pp.height.minFt}'${pp.height.minIn}" - ${pp.height.maxFt}'${pp.height.maxIn}"`
                      : 'Any'}
                  </p>
                  <p>
                    <strong>Desired Location:</strong> {pp.currentLocation || 'Any'}
                  </p>
                  <p>
                    <strong>Religion / Caste:</strong> {pp.religion || 'Any'} /{' '}
                    {pp.caste || 'Any'}
                  </p>
                  <p>
                    <strong>Education:</strong> {pp.education || 'Any'}
                  </p>
                  <p>
                    <strong>Occupation:</strong> {pp.occupation || 'Any'}
                  </p>
                </div>
              )}
            </ProfileSection>
          </div>
        </div>

        {/* "Latest Matches" Carousel */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold font-headline">
              Latest Matches
            </h2>
            <Button variant="link" asChild className="text-primary p-0 h-auto">
              <Link href="/search">See More</Link>
            </Button>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-4 -m-4 p-4">
            {MOCK_MATCHES.map(match => (
              <Card
                key={match.id}
                className="min-w-[250px] w-64 rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105"
              >
                <div className="relative h-48">
                  <Image
                    src={match.photos[0]}
                    alt={match.name}
                    fill
                    className="w-full h-full object-cover"
                    data-ai-hint="portrait person"
                  />
                </div>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      {match.name}, {match.age}
                    </CardTitle>
                    <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {match.location}
                  </p>
                  <p className="text-xs italic text-foreground/80 line-clamp-2">
                    "{match.bio}"
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full text-xs"
                    >
                      View Profile
                    </Button>
                    <Button size="sm" className="flex-1 rounded-full text-xs">
                      Send Interest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
