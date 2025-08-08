import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProfileCard } from '@/components/profile-card';
import { mockProfiles } from '@/lib/mock-data';
import type { Profile } from '@/types';
import {
  ShieldCheck,
  Search,
  Users,
  HeartHandshake,
  Star,
  Globe,
  Heart,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  const approvedProfiles = mockProfiles.filter(p => p.status === 'approved');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex h-[60vh] w-full items-center justify-center text-center text-white md:h-[70vh]">
        <div className="absolute inset-0 z-10 bg-black/60"></div>
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Joyful Nepali bride and groom in traditional attire"
          fill
          style={{ objectFit: 'cover' }}
          className="z-0"
          priority
          data-ai-hint="nepali wedding"
        />
        <div className="relative z-20 container mx-auto px-4 md:px-6">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-shadow-lg md:text-6xl lg:text-7xl">
            Finding Your Forever in the Nepali Way.
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-primary-foreground/90 text-shadow md:text-xl">
            The most trusted matrimonial platform for the Nepali community
            worldwide.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/join">Join Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Promise of Trust Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              A Foundation Built on Trust
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We are committed to creating a safe and authentic community. Every
              profile on Mitho Sambandha is manually reviewed and verified by
              our dedicated admin team to ensure you connect with genuine
              individuals who are serious about finding a life partner.
            </p>
            <div className="mt-8 flex justify-center gap-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-accent" />
                <span className="font-semibold">Verified Profiles</span>
              </div>
              <div className="flex items-center gap-3">
                <Search className="h-8 w-8 text-accent" />
                <span className="font-semibold">Manual Review</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto">
                <span className="font-headline text-2xl">1</span>
              </div>
              <h3 className="font-headline text-2xl">Submit Your Profile</h3>
              <p className="mt-2 text-muted-foreground">
                Fill out our comprehensive form to begin your journey.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto">
                <span className="font-headline text-2xl">2</span>
              </div>
              <h3 className="font-headline text-2xl">Search Profiles</h3>
              <p className="mt-2 text-muted-foreground">
                Browse through verified profiles to find someone who matches
                your preferences.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto">
                <span className="font-headline text-2xl">3</span>
              </div>
              <h3 className="font-headline text-2xl">Get Matched</h3>
              <p className="mt-2 text-muted-foreground">
                Our team assists in connecting you with potential life
                partners.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground mx-auto">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="font-headline text-2xl">Happy Mitho Sambandha</h3>
              <p className="mt-2 text-muted-foreground">
                Start your new chapter with the perfect partner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              Why Choose Us?
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="font-headline text-2xl">
                  Curated Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We focus on quality over quantity. Our admin-driven model
                  ensures a community of serious, authentic members.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <HeartHandshake className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="font-headline text-2xl">
                  Personal Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Experience the human touch of a manual matchmaking process,
                  where we personally assist in finding your match.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="font-headline text-2xl">
                  Cultural Connection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Designed for the Nepali community, with a deep understanding
                  of shared values, traditions, and family expectations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Profiles Section */}
      <section id="featured" className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              Meet Our Members
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

      {/* Final CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">
            Your Journey Begins Here.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/90">
            Join hundreds of like-minded individuals finding their perfect match
            on a platform built on trust and cultural understanding.
          </p>
          <div className="mt-8">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/join">Join Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
