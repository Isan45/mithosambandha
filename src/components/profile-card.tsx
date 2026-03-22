
import type { UserProfile } from '@/types';
import { Link } from '@/i18n/routing';
import { MembershipBadge } from '@/components/premium/membership-badge';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Cake } from 'lucide-react';

type ProfileCardProps = {
  profile: UserProfile;
};

const calculateAge = (dob: string | undefined): number | null => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export function ProfileCard({ profile }: ProfileCardProps) {
  const p = (profile as any).profile || {};
  const photoUrl = p.profilePhoto || 'https://placehold.co/800x600.png';
  const bio = p.bio || "This user has not written a bio yet.";
  const age = calculateAge(p.dob);
  const location = p.currentLocation || 'Unknown';

  return (
    <Card className="flex h-full flex-col overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-64 w-full">
          <Image
            src={photoUrl}
            alt={profile.fullName}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
            data-ai-hint="portrait person"
          />
          {profile.membership && (
            <div className="absolute top-3 right-3 z-10">
              <MembershipBadge tier={profile.membership} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 md:p-6">
        <CardTitle className="font-headline mb-2 text-2xl">
          {profile.fullName}
        </CardTitle>
        <div className="space-y-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Cake className="h-4 w-4" />
            <span>{age ? `${age} years old` : 'Age not specified'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <p className="pt-2 text-foreground/80 line-clamp-3 h-[60px]">{bio}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 md:p-6">
        <Button asChild className="w-full">
          <Link href={`/profiles/${profile.uid}`}>View Full Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
