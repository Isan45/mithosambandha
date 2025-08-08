import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-4xl">Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            Welcome to the Mitho Sambandha blog. Share articles, advice, and
            stories related to relationships, culture, and matchmaking.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
