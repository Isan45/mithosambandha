import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { CheckCircle2, XCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import React from 'react';
import Image from 'next/image';

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
  <Card
    className={cn(
      'flex flex-col',
      isPopular && 'border-2 border-primary shadow-2xl relative'
    )}
  >
    {isPopular && (
      <div className="absolute top-0 right-4 -translate-y-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
        Most Popular
      </div>
    )}
    <CardHeader className="text-center">
      <CardTitle className="font-headline text-3xl">{plan}</CardTitle>
      <CardDescription className="text-lg font-semibold text-foreground">
        {price}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-center text-muted-foreground mb-6">{description}</p>
      <ul className="space-y-4">
        {features.map((feature, index) => {
          const isExcluded = React.isValidElement(feature)
            ? (feature.props.children as React.ReactNode[])?.some?.(child =>
                React.isValidElement(child) && child.type === XCircle
              )
            : false;
          return (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {React.isValidElement(feature) &&
                (feature.props.children as React.ReactNode[])?.some?.(
                  child =>
                    React.isValidElement(child) && child.type === Star
                ) ? (
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                ) : isExcluded ? (
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
              </div>
              <span className="text-sm text-foreground">{feature}</span>
            </li>
          );
        })}
      </ul>
    </CardContent>
    <CardFooter>
      <Button
        asChild
        size="lg"
        className="w-full"
        variant={plan === 'Free' ? 'outline' : 'default'}
      >
        <Link href="/join">
          {plan === 'Free' ? 'Sign Up' : 'Upgrade Now'}
        </Link>
      </Button>
    </CardFooter>
  </Card>
);

const LadiesPromo = () => (
  <div>
    <span className="text-sm font-semibold text-primary">
      Promotion for Ladies
    </span>
    <p className="text-xs text-muted-foreground">
      Free 6-month membership on all plans
    </p>
  </div>
);

export default function PricingPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
            <div className="text-center md:text-left">
              <h1 className="font-headline text-4xl font-bold md:text-5xl text-primary">
                Invest in Your Forever
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose a plan that aligns with your commitment to finding a
                meaningful, lasting relationship. Your journey to a sweet union
                starts here.
              </p>
            </div>
            <div className="relative h-80 w-full rounded-lg shadow-xl overflow-hidden">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/mitho-sambandha-c4959.firebasestorage.app/o/mitho-sambandha-2.avif?alt=media&token=14b88d3a-ca2f-4078-b20d-e460edaaa7a4"
                alt="Happy couple smiling"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
                data-ai-hint="happy couple"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl text-primary">
              Choose Your Plan
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Select the plan that best suits your journey to finding a life
              partner. We offer flexible options to meet your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            <PlanCard
              plan="Free"
              price="Free"
              description="Get started and create your profile for our admins to see."
              features={[
                <>
                  <Star className="hidden" />
                  <LadiesPromo />
                </>,
                <><b>Profile Creation:</b> Always included</>,
                <><b>Admin Verification:</b> Always included</>,
                <><b>View Profile Details:</b> Basic Details Only</>,
                <><b>Contact & Chat:</b> <XCircle className="inline-block h-4 w-4 ml-1" /> Not Included</>,
                <><b>Direct Messaging:</b> <XCircle className="inline-block h-4 w-4 ml-1" /> Not Included</>,
                <><b>View Contact Info:</b> <XCircle className="inline-block h-4 w-4 ml-1" /> Not Included</>,
                <><b>Photo Requests:</b> <XCircle className="inline-block h-4 w-4 ml-1" /> Not Included</>,
                <><b>Priority Support:</b> <XCircle className="inline-block h-4 w-4 ml-1" /> Not Included</>,
                <><b>Profile Boost:</b> <XCircle className="inline-block h-4 w-4 ml-1" /> Not Included</>,
              ]}
            />
            <PlanCard
              plan="Gold"
              price="₹1000/mo or ₹6000/yr"
              description="Unlock more features to enhance your search."
              features={[
                 <>
                  <Star className="hidden" />
                  <LadiesPromo />
                </>,
                <><b>Profile Creation:</b> Always included</>,
                <><b>Admin Verification:</b> Always included</>,
                <><b>View Profile Details:</b> Full Details (with consent)</>,
                <><b>Contact & Chat:</b> Up to 10 new members/month</>,
                <><b>Direct Messaging:</b> Limited Access</>,
                <><b>View Contact Info:</b> <XCircle className="inline-block h-4 w-4 ml-1" /> Not Included</>,
                <><b>Photo Requests:</b> <XCircle className="inline-block h-4 w-4 ml-1" /> Not Included</>,
                <><b>Priority Support:</b> <XCircle className="inline-block h-4 w-4 ml-1" /> Not Included</>,
                <><b>Profile Boost:</b> <XCircle className="inline-block h-4 w-4 ml-1" /> Not Included</>,
              ]}
            />
            <PlanCard
              plan="Platinum"
              price="₹2500/mo or ₹15000/yr"
              description="The ultimate experience with full access and priority support."
              isPopular={true}
              features={[
                <>
                  <Star className="hidden" />
                  <LadiesPromo />
                </>,
                <><b>Profile Creation:</b> Always included</>,
                <><b>Admin Verification:</b> Always included</>,
                <><b>View Profile Details:</b> Unlimited Full Details</>,
                <><b>Contact & Chat:</b> Unlimited</>,
                <><b>Direct Messaging:</b> Unlimited</>,
                <><b>View Contact Info:</b> Full Access</>,
                <><b>Photo Requests:</b> Unlimited</>,
                <><b>24/7 Priority Support:</b> Included</>,
                <><b>Profile Visibility Boost:</b> Included</>,
                <><b>Access to All Features:</b> Included</>,
                <><b>Unlimited Admin Support:</b> Included</>,
              ]}
            />
          </div>
        </div>
      </div>

      <section className="bg-secondary rounded-lg p-8 md:p-12 mb-12 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center md:text-left">
          <div className="max-w-3xl mx-auto md:max-w-none">
            <h2 className="font-headline text-3xl font-bold text-primary">
              Our Commitment to Your Journey
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We believe that investing in your search for a life partner is
              one of the most important decisions you can make. Our plans are
              designed to provide you with the tools and support you need, but
              our real commitment is to help you find a genuine, lasting
              connection. We're here for you every step of the way.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
          <div className="relative h-80 w-full rounded-lg shadow-md overflow-hidden">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/mitho-sambandha-c4959.firebasestorage.app/o/mitho-sambandha-2.avif?alt=media&token=14b88d3a-ca2f-4078-b20d-e460edaaa7a4"
              alt="Happy couple"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
              data-ai-hint="happy couple"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
