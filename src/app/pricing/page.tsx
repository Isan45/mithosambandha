import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CheckCircle2, XCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const features = [
    { text: 'Profile Creation', free: true, gold: true, platinum: true },
    { text: 'Admin Verification', free: true, gold: true, platinum: true },
    { text: 'View Profile Details', free: 'Basic Details', gold: 'Full Details (with consent)', platinum: 'Unlimited Full Details' },
    { text: 'Contact and Chat with New Members', free: false, gold: 'Up to 10/month', platinum: 'Unlimited' },
    { text: 'Direct Messaging', free: false, gold: 'Limited', platinum: 'Unlimited' },
    { text: 'View Contact Information (Phone/Email)', free: false, gold: false, platinum: true },
    { text: 'Photo Requests', free: false, gold: false, platinum: 'Unlimited' },
    { text: '24/7 Priority Support', free: false, gold: false, platinum: true },
    { text: 'Profile Visibility Boost', free: false, gold: false, platinum: true },
    { text: 'Access to All Features', free: false, gold: false, platinum: true },
    { text: 'Unlimited Admin Support', free: false, gold: false, platinum: true },
];

const PlanCard = ({
  plan,
  price,
  description,
  features,
  isPopular = false,
}: {
  plan: string;
  price: string;
  description: string;
  features: React.ReactNode[];
  isPopular?: boolean;
}) => (
  <Card className={cn("flex flex-col", isPopular && "border-2 border-primary shadow-2xl relative")}>
    {isPopular && (
      <div className="absolute top-0 right-4 -translate-y-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
        Most Popular
      </div>
    )}
    <CardHeader className="text-center">
      <CardTitle className="font-headline text-3xl">{plan}</CardTitle>
      <CardDescription className="text-lg font-semibold">{price}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
        <p className="text-center text-muted-foreground mb-6">{description}</p>
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0">
                {typeof feature === 'string' || (feature as any).props.children.some((c:any) => c.type === XCircle) ? 
                    <XCircle className="h-5 w-5 text-muted-foreground" /> :
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                }
            </div>
            <span className="text-sm text-foreground">{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button asChild size="lg" className="w-full" variant={isPopular ? 'default' : 'outline'}>
        <Link href="/join">{plan === "Free" ? "Sign Up" : "Upgrade Now"}</Link>
      </Button>
    </CardFooter>
  </Card>
);

const LadiesPromo = () => (
    <li className="flex items-start gap-3 p-4 rounded-lg bg-primary/10">
        <Star className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
            <span className="text-sm font-semibold text-primary">Promotion for Ladies</span>
            <p className="text-xs text-muted-foreground">Free 6-month membership on all plans</p>
        </div>
    </li>
)


export default function PricingPage() {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Select the plan that best suits your journey to finding a life
            partner. We offer flexible options to meet your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            {/* Free Plan */}
            <PlanCard 
                plan="Free"
                price="Free"
                description="Get started and create your profile for our admins to see."
                features={[
                    <LadiesPromo key="promo"/>,
                    <><b>Profile Creation:</b> Always included</>,
                    <><b>Admin Verification:</b> Always included</>,
                    <><b>View Profile Details:</b> Basic Details Only</>,
                    <><b>Contact & Chat:</b> Not Included <XCircle className="inline-block h-4 w-4 ml-1" /></>,
                    <><b>Direct Messaging:</b> Not Included <XCircle className="inline-block h-4 w-4 ml-1" /></>,
                    <><b>View Contact Info:</b> Not Included <XCircle className="inline-block h-4 w-4 ml-1" /></>,
                    <><b>Photo Requests:</b> Not Included <XCircle className="inline-block h-4 w-4 ml-1" /></>,
                    <><b>Priority Support:</b> Not Included <XCircle className="inline-block h-4 w-4 ml-1" /></>,
                    <><b>Profile Boost:</b> Not Included <XCircle className="inline-block h-4 w-4 ml-1" /></>,
                ]}
            />
             {/* Gold Plan */}
            <PlanCard 
                plan="Gold"
                price="₹1000/mo or ₹6000/yr"
                description="Unlock more features to enhance your search."
                features={[
                    <LadiesPromo key="promo"/>,
                    <><b>Profile Creation:</b> Always included</>,
                    <><b>Admin Verification:</b> Always included</>,
                    <><b>View Profile Details:</b> Full Details (with consent)</>,
                    <><b>Contact & Chat:</b> Up to 10 new members/month</>,
                    <><b>Direct Messaging:</b> Limited Access</>,
                    <><b>View Contact Info:</b> Not Included <XCircle className="inline-block h-4 w-4 ml-1" /></>,
                    <><b>Photo Requests:</b> Not Included <XCircle className="inline-block h-4 w-4 ml-1" /></>,
                    <><b>Priority Support:</b> Not Included <XCircle className="inline-block h-4 w-4 ml-1" /></>,
                    <><b>Profile Boost:</b> Not Included <XCircle className="inline-block h-4 w-4 ml-1" /></>,
                ]}
            />
             {/* Platinum Plan */}
            <PlanCard 
                plan="Platinum"
                price="₹2500/mo or ₹15000/yr"
                description="The ultimate experience with full access and priority support."
                isPopular={true}
                features={[
                    <LadiesPromo key="promo"/>,
                    <><b>Profile Creation:</b> Always included</>,
                    <><b>Admin Verification:</b> Always included</>,
                    <><b>View Profile Details:</b> Unlimited Full Details</>,
                    <><b>Contact & Chat:</b> Unlimited</>,
                    <><b>Direct Messaging:</b> Unlimited</>,
                    <><b>View Contact Info:</b> Full Access</>,
                    <><b>Photo Requests:</b> Unlimited</>,
                    <><b>24/7 Priority Support:</b> Included</>,
                    <><b>Profile Visibility Boost:</b> Included</>,
                    <><b>Unlimited Admin Support:</b> Included</>,
                ]}
            />
        </div>
      </div>
    </div>
  );
}
