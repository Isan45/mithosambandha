import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-4xl">Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            This is the pricing page. You can detail your membership plans and
            the services included in each tier here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
