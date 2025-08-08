import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProfileCard } from '@/components/profile-card';
import { mockProfiles, mockSuccessStories } from '@/lib/mock-data';
import type { Profile, SuccessStory } from '@/types';
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
import { SuccessStoryCard } from '@/components/success-story-card';

export default function Home() {
  const approvedProfiles = mockProfiles.filter(p => p.status === 'approved');
  const featuredStories = mockSuccessStories.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full flex items-center justify-center bg-secondary/50 text-foreground">
        <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-2 md:px-6 md:py-20">
          <div className="text-center md:text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Finding Your Forever in the Nepali Way.
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground md:text-xl">
              The most trusted matrimonial platform for the Nepali community
              worldwide.
            </p>
            <div className="mt-8 flex justify-center md:justify-start">
              <Button size="lg" asChild>
                <Link href="/join">Join Now</Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-2xl">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/mitho-sambandha-c4959.firebasestorage.app/o/Mithi%20sambandha%20Hero%20Image%20.png?alt=media&token=276a0e88-fe36-47e1-b00a-fc414b3c87a9"
              alt="Joyful Nepali couple"
              width={1200}
              height={800}
              className="h-auto w-full rounded-lg object-contain shadow-xl"
              priority
            />
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
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="font-headline text-2xl">1</span>
              </div>
              <h3 className="font-headline text-xl">Submit Your Profile</h3>
              <p className="mt-2 text-muted-foreground">
                Fill out our comprehensive form to begin your journey.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="font-headline text-2xl">2</span>
              </div>
              <h3 className="font-headline text-xl">Search Profiles</h3>
              <p className="mt-2 text-muted-foreground">
                Browse through verified profiles to find someone special.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="font-headline text-2xl">3</span>
              </div>
              <h3 className="font-headline text-xl">Get Matched</h3>
              <p className="mt-2 text-muted-foreground">
                Our team assists in connecting you with potential partners.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="font-headline text-xl">Happy Mitho Sambandha</h3>
              <p className="mt-2 text-muted-foreground">
                Start your new chapter with the perfect partner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="container mx-auto px-4 text-center md:px-6">
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
