
import { getUser } from '@/lib/server-actions/users';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Cake, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { Metadata } from 'next';

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

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await getUser(params.id);

  if (!user) {
    return {
      title: 'Profile Not Found',
    };
  }
  
  const p = (user as any).profile || {};

  return {
    title: `${user.fullName}'s Profile`,
    description: `View the profile of ${user.fullName}. Age: ${calculateAge(
      p.dob
    )}, Location: ${p.currentLocation}.`,
  };
}


export default async function ProfilePage({ params: { id } }: { params: { id: string }}) {
  const user = await getUser(id);

  if (!user || user.profileStatus !== 'approved') {
    notFound();
  }
  
  const profile = (user as any).profile || {};
  const age = calculateAge(profile.dob);
  const location = profile.currentLocation || 'N/A';
  const bio = profile.bio || 'No bio provided.';
  const partnerPreferences = profile.partnerPreferences?.general || 'No preferences specified.';
  const galleryPhotos = profile.galleryPhotos || [];
  const profilePhoto = profile.profilePhoto;
  
  const allPhotos = profilePhoto ? [profilePhoto, ...galleryPhotos] : galleryPhotos;


  return (
    <div className="bg-secondary py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="mx-auto max-w-4xl overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 md:p-8 md:order-2">
                <div className="mb-4 flex flex-col justify-between md:flex-row md:items-center">
                  <CardTitle className="font-headline text-4xl">
                    {user.fullName}
                  </CardTitle>
                  <div className="mt-2 flex items-center gap-4 text-muted-foreground md:mt-0">
                    <div className="flex items-center gap-2">
                      <Cake className="h-5 w-5" />
                      <span>{age ? `${age} years` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      <span>{location}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-headline mb-3 text-2xl">About Me</h3>
                  <p className="text-lg leading-relaxed text-foreground/90">
                    {bio}
                  </p>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-headline mb-3 flex items-center gap-2 text-2xl">
                    <Heart className="text-primary" />
                    Looking For
                  </h3>
                  <p className="text-lg leading-relaxed text-foreground/90">
                    {partnerPreferences}
                  </p>
                </div>
              </div>

              <div className="relative min-h-[400px] p-4 md:p-8 md:order-1">
                {allPhotos.length > 0 ? (
                    <Carousel className="w-full">
                    <CarouselContent>
                        {allPhotos.map((photo: string, index: number) => (
                        <CarouselItem key={index}>
                            <div className="relative aspect-square w-full">
                            <Image
                                src={photo}
                                alt={`${user.fullName}'s photo ${index + 1}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-lg"
                                data-ai-hint="portrait person"
                            />
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                    </Carousel>
                ) : (
                     <div className="relative aspect-square w-full">
                        <Image
                            src={'https://placehold.co/800x600.png'}
                            alt={`Placeholder for ${user.fullName}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-lg"
                            data-ai-hint="placeholder person"
                        />
                    </div>
                )}
              </div>
            </div>
            <Separator />
            <div className="p-6 text-center md:p-8">
              <h3 className="font-headline mb-4 text-2xl">Interested?</h3>
              <p className="mb-4 text-muted-foreground">
                Create your profile to get started on your journey.
              </p>
              <Button size="lg" asChild>
                <Link href="/join">Join Mitho Sambandha</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
