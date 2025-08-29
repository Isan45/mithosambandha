import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles, advice, and stories related to relationships, culture, and matchmaking in the Nepali community.',
};

const blogPosts = [
    {
        slug: 'finding-love-in-digital-age',
        title: 'Finding Love in the Digital Age: A Guide for the Nepali Diaspora',
        description: 'Navigating the world of online matchmaking can be daunting. Here are some tips to help you on your journey.',
        image: 'https://picsum.photos/600/400',
        dataAiHint: 'couple laptop',
    },
    {
        slug: 'first-meeting-tips',
        title: 'Making a Great First Impression: Tips for Your First Meeting',
        description: 'The first meeting is crucial. Discover our top tips for making it a memorable and successful one.',
        image: 'https://picsum.photos/600/400',
        dataAiHint: 'couple cafe',
    },
    {
        slug: 'cultural-expectations',
        title: 'Balancing Tradition and Modernity in Nepali Relationships',
        description: 'Explore how modern Nepali couples are navigating cultural expectations while building a life together.',
        image: 'https://picsum.photos/600/400',
        dataAiHint: 'traditional modern',
    }
]

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold">From Our Blog</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Articles, advice, and stories related to relationships, culture, and matchmaking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map(post => (
            <Card key={post.slug} className="overflow-hidden flex flex-col">
                <div className="relative h-48 w-full">
                    <Image src={post.image} alt={post.title} fill style={{objectFit: 'cover'}} data-ai-hint={post.dataAiHint} />
                </div>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <CardDescription>{post.description}</CardDescription>
                </CardContent>
                <div className="p-6 pt-0">
                    <Button asChild variant="link" className="p-0">
                        <Link href={`/blog/${post.slug}`}>
                            Read More
                        </Link>
                    </Button>
                </div>
            </Card>
        ))}
      </div>
       <div className="text-center mt-16">
            <h2 className="text-2xl font-bold font-headline">Have a story to share?</h2>
            <p className="text-muted-foreground mt-2">We'd love to hear from you. Contact us to be featured.</p>
            <Button asChild className="mt-4">
                <Link href="/contact">Get in Touch</Link>
            </Button>
        </div>
    </div>
  );
}
