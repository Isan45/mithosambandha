import type { Profile } from '@/types';
import Link from 'next/link';
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
  profile: Profile;
};

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-64 w-full">
          <Image
            src={profile.photos[0]}
            alt={profile.name}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
            data-ai-hint="portrait person"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 md:p-6">
        <CardTitle className="font-headline mb-2 text-2xl">
          {profile.name}
        </CardTitle>
        <div className="space-y-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Cake className="h-4 w-4" />
            <span>{profile.age} years old</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{profile.location}</span>
          </div>
          <p className="pt-2 text-foreground/80 line-clamp-3">{profile.bio}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 md:p-6">
        <Button asChild className="w-full">
          <Link href={`/profiles/${profile.id}`}>View Full Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
