import { mockProfiles } from '@/lib/mock-data';
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

export default function ProfilePage({ params }: { params: { id: string } }) {
  const profile = mockProfiles.find(
    p => p.id === params.id && p.status === 'approved'
  );

  if (!profile) {
    notFound();
  }

  return (
    <div className="bg-secondary py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="mx-auto max-w-4xl overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 md:p-8">
                <div className="mb-4 flex flex-col justify-between md:flex-row md:items-center">
                  <CardTitle className="font-headline text-4xl">
                    {profile.name}
                  </CardTitle>
                  <div className="mt-2 flex items-center gap-4 text-muted-foreground md:mt-0">
                    <div className="flex items-center gap-2">
                      <Cake className="h-5 w-5" />
                      <span>{profile.age} years</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      <span>{profile.location}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-headline mb-3 text-2xl">About Me</h3>
                  <p className="text-lg leading-relaxed text-foreground/90">
                    {profile.bio}
                  </p>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-headline mb-3 flex items-center gap-2 text-2xl">
                    <Heart className="text-primary" />
                    Looking For
                  </h3>
                  <p className="text-lg leading-relaxed text-foreground/90">
                    {profile.partnerPreferences}
                  </p>
                </div>
              </div>

              <div className="relative min-h-[400px] p-4 md:p-8">
                <Carousel className="w-full">
                  <CarouselContent>
                    {profile.photos.map((photo, index) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-square w-full">
                          <Image
                            src={photo}
                            alt={`${profile.name}'s photo ${index + 1}`}
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
