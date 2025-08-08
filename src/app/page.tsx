import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProfileCard } from '@/components/profile-card';
import { mockProfiles } from '@/lib/mock-data';
import type { Profile } from '@/types';

export default function Home() {
  const approvedProfiles = mockProfiles.filter(p => p.status === 'approved');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex h-[60vh] w-full items-center justify-center text-center text-white md:h-[70vh]">
        <div className="absolute inset-0 z-10 bg-black/50"></div>
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Happy couple"
          fill
          style={{ objectFit: 'cover' }}
          className="z-0"
          priority
          data-ai-hint="happy couple wedding"
        />
        <div className="relative z-20 container mx-auto px-4 md:px-6">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-shadow-lg md:text-6xl lg:text-7xl">
            Find Your{' '}
            <span className="text-primary-foreground/80">Mitho Sambandha</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/90 text-shadow md:text-xl">
            A trusted platform for building meaningful, lifelong partnerships.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/join">Create Your Profile</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="#featured">See Our Members</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Profiles Section */}
      <section id="featured" className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              Featured Profiles
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Get to know some of our wonderful members.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {approvedProfiles.map((profile: Profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
