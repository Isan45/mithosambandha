import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, HeartHandshake, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn the story behind Mitho Sambandha, our mission, and our commitment to the Nepali community.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <h1 className="font-headline text-4xl font-bold md:text-5xl">
                Our Story: A Vision of Sweet Union
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Mitho Sambandha was born from a simple yet powerful idea: to
                create a trusted space for the Nepali community worldwide to
                find their life partner. We understood the importance of
                authenticity, cultural values, and a genuine connection. This
                isn't just a platform; it's a community built on trust.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/mitho-sambandha-c4959.firebasestorage.app/o/Mitho-sambandha-Abous-us-Photo-.avif?alt=media&token=07a66754-88f1-4216-b230-f0ba9449c04c"
                alt="Mitho Sambandha Team"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                data-ai-hint="team portrait"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Founding Story Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">
            From a Community Need to a Global Platform
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
            Our journey began with the realization that a trusted matrimonial
            service, deeply rooted in Nepali culture, was missing. We saw
            friends and family struggling with impersonal apps and unverified
            profiles. We believe that finding a partner should be a joyful,
            secure experience, and so Mitho Sambandha was created to fill that
            gap. We're a team of individuals who believe in the power of genuine
            connection and are dedicated to helping you find yours.
          </p>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              What We Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardContent className="p-8">
                <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="font-headline mb-2 text-2xl">
                  Trust & Authenticity
                </h3>
                <p className="text-muted-foreground">
                  Our promise is a community built on trust. Every profile is
                  manually reviewed and verified by our team, ensuring you
                  connect with real people.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-8">
                <Globe className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="font-headline mb-2 text-2xl">
                  Cultural Heritage
                </h3>
                <p className="text-muted-foreground">
                  We honor and understand the unique traditions and values of
                  the Nepali community. Our platform is designed to celebrate
                  our shared heritage.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-8">
                <HeartHandshake className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="font-headline mb-2 text-2xl">A Human Touch</h3>
                <p className="text-muted-foreground">
                  We believe in personal connection. Our admin team provides a
                  curated experience, going beyond algorithms to help you find
                  your perfect match.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-8">
                <HeartHandshake className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="font-headline mb-2 text-2xl">A Human Touch</h3>
                <p className="text-muted-foreground">
                  We believe in personal connection. Our admin team provides a
                  curated experience, going beyond algorithms to help you find
                  your perfect match.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-background py-16 text-foreground md:py-24">
        <div className="container mx-auto px-4 text-center md:px-6">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">
            Ready to Begin Your Journey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            We are more than just a matrimonial service; we are your partners in
            this beautiful journey. Join a community that values authenticity
            and cultural connection as much as you do.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/join">Join Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
