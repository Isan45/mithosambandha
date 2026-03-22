
import React from 'react';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  User,
  HeartHandshake,
  Search,
  CheckCircle,
  Heart,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getUsers } from '@/lib/server-actions/users';
import { ProfileCard } from '@/components/profile-card';
import { SuccessStoryCard } from '@/components/success-story-card';
import { mockSuccessStories } from '@/lib/mock-data';
import { SearchForm } from '@/components/search/search-form';
import { getSuccessStories } from '@/lib/server-actions/stories';

const HowItWorksStep = ({
  icon: Icon,
  step,
  title,
  description,
}: {
  icon: React.ElementType;
  step: string;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center p-4 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
      <Icon className="h-8 w-8" />
    </div>
    <div className="mb-2 text-xl font-bold">{step}</div>
    <h3 className="mb-2 text-xl font-headline">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const Section = ({
  id,
  children,
  className = '',
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section id={id} className={`py-16 md:py-24 ${className}`}>
    {children}
  </section>
);

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  const allUsers = await getUsers();
  const approvedProfiles = allUsers.filter(
    user => user.profileStatus === 'approved'
  );

  const featuredProfiles = approvedProfiles.slice(0, 4);
  
  const realStories = await getSuccessStories();
  const featuredStories = realStories.length > 0 ? realStories : mockSuccessStories.slice(0, 3);

  return (
    <div className="font-body text-foreground bg-background">
      {/* Hero Section */}
      <Section id="home" className="pt-12 md:pt-20">
        <div className="container mx-auto flex flex-col items-center gap-12 px-4 md:px-8 md:flex-row">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="tracking-tighter text-4xl font-bold leading-tight md:text-6xl font-headline">
              {t('title')}
            </h1>
            <p className="mx-auto max-w-lg text-lg text-muted-foreground md:mx-0 md:text-xl">
              {t('subtitle')}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
              <Button
                asChild
                size="lg"
                className="w-full transform rounded-full font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 sm:w-auto bg-primary hover:bg-primary/90"
              >
                <Link href="/join">{t('cta')}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full transform rounded-full font-bold transition-all duration-300 hover:scale-105 sm:w-auto"
              >
                <Link href="/search">{t('viewProfiles')}</Link>
              </Button>
            </div>
          </div>
          <div className="flex w-full flex-1 justify-center md:justify-end">
            <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:scale-105 md:max-w-xl">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/mitho-sambandha-c4959.firebasestorage.app/o/mitho-sambandha-hero.avif?alt=media&token=8e9e757c-f045-4b21-a077-94a55383f1d8"
                alt="A happily married Nepali couple"
                width={1000}
                height={800}
                className="h-full w-full object-cover"
                priority
                data-ai-hint="happy couple"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Search Section */}
      <Section id="search" className="bg-secondary/50">
        <div className="container mx-auto px-4 text-center md:px-8">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl font-headline">
            Find Your Mitho Sambandha
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Take the first step towards finding your special someone using our detailed search.
          </p>
          <div className="mx-auto max-w-5xl">
            <SearchForm />
          </div>
        </div>
      </Section>

      {/* How It Works Section */}
      <Section id="how-it-works" className="bg-background">
        <div className="container mx-auto px-4 text-center md:px-8">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl font-headline">
            How It Works
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
            Our simple and secure process helps you find your life partner with
            ease and confidence.
          </p>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <HowItWorksStep
              icon={User}
              step="1"
              title="Create Your Profile"
              description="Fill out your details and preferences to begin your journey."
            />
            <HowItWorksStep
              icon={Search}
              step="2"
              title="Find Your Match"
              description="Browse through thousands of verified profiles that match your criteria."
            />
            <HowItWorksStep
              icon={HeartHandshake}
              step="3"
              title="Connect Securely"
              description="Send interests and chat with potential partners in a safe environment."
            />
            <HowItWorksStep
              icon={CheckCircle}
              step="4"
              title="Begin Your Journey"
              description="Meet your match and take the first step towards a happy life."
            />
          </div>
        </div>
      </Section>

      <Separator />

      {/* Featured Profiles Section */}
      <Section id="profiles" className="bg-secondary/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold md:text-4xl font-headline">
              Featured Profiles
            </h2>
            <Button
              asChild
              variant="link"
              className="transition-colors text-primary hover:text-primary/80"
            >
              <Link href="/search">View All Profiles</Link>
            </Button>
          </div>
          {featuredProfiles.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProfiles.map(profile => (
                <ProfileCard key={profile.uid} profile={profile} />
              ))}
            </div>
          ) : (
            <Card className="col-span-full">
              <CardContent className="rounded-lg border-2 border-dashed p-12 text-center">
                <h3 className="text-2xl font-headline">
                  No Featured Profiles Yet
                </h3>
                <p className="mt-2 text-muted-foreground">
                  As our community grows, featured profiles of approved members
                  will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </Section>

      <Separator />

      {/* Success Stories Section */}
      <Section id="reviews">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl font-headline">
              Stories of Sweet Union
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              We are honored to have played a part in so many beautiful love
              stories.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredStories.map(story => (
              <SuccessStoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </Section>

      {/* Call to Action Section */}
      <Section
        id="cta"
        className="bg-gradient-to-r from-primary via-primary/90 to-accent/80 text-center text-primary-foreground"
      >
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="mb-4 text-3xl font-bold md:text-5xl font-headline">
            Your Journey Begins Here.
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-lg font-light text-primary-foreground/90 md:text-xl">
            Join thousands of individuals finding their perfect match on a
            platform built on trust, security, and a shared understanding.
          </p>
          <Button
            asChild
            size="lg"
            className="transform rounded-full font-bold text-primary shadow-xl transition-all duration-300 hover:scale-105 bg-background hover:bg-background/90"
          >
            <Link href="/join">Create Your Free Profile</Link>
          </Button>
        </div>
      </Section>
    </div>
  );
}
