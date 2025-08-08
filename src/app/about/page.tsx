import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-4xl">About Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            This is the About Us page for Mitho Sambandha. Here you can share
            your story, mission, and the values that drive your matchmaking
            service.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
