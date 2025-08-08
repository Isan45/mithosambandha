import type { SuccessStory } from '@/types';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Star } from 'lucide-react';

type SuccessStoryCardProps = {
  story: SuccessStory;
};

export function SuccessStoryCard({ story }: SuccessStoryCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full">
          <Image
            src={story.photo}
            alt={`Photo of ${story.names}`}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
            data-ai-hint="couple portrait"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 md:p-6">
        <CardTitle className="font-headline mb-2 text-2xl text-primary">
          {story.names}
        </CardTitle>
        <p className="text-muted-foreground line-clamp-4">{story.story}</p>
      </CardContent>
      <CardFooter className="flex items-center gap-1 p-4 pt-0 text-amber-500 md:p-6">
        <Star className="h-4 w-4 fill-current" />
        <Star className="h-4 w-4 fill-current" />
        <Star className="h-4 w-4 fill-current" />
        <Star className="h-4 w-4 fill-current" />
        <Star className="h-4 w-4 fill-current" />
      </CardFooter>
    </Card>
  );
}
