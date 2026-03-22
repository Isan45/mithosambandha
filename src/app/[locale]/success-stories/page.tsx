import { mockSuccessStories } from '@/lib/mock-data';
import type { SuccessStory } from '@/types';
import { SuccessStoryCard } from '@/components/success-story-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Success Stories',
  description: 'Read the stories of couples who found their life partner through Mitho Sambandha.',
};

export default function SuccessStoriesPage() {
  return (
    <div className="bg-background">
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h1 className="font-headline text-4xl font-bold md:text-5xl">
              Stories of Sweet Union
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              We are honored to have played a part in so many beautiful love
              stories. Here are just a few of the couples who found their perfect
              match through Mitho Sambandha.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mockSuccessStories.map((story: SuccessStory) => (
              <SuccessStoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
         <div className="container mx-auto px-4 md:px-6">
            <div className="text-center rounded-lg bg-primary/10 p-8 md:p-12 border border-primary/20">
                <h2 className="font-headline text-3xl text-primary">Ready to Start Your Own Story?</h2>
                <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                    Join our community today and take the first step towards finding your life partner. Your success story could be next.
                </p>
                <div className="mt-6">
                    <Button size="lg" asChild>
                    <Link href="/join">Join Our Community</Link>
                    </Button>
                </div>
            </div>
         </div>
      </section>
    </div>
  );
}
