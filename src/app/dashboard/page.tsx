
'use client';

import { useAuth } from '@/hooks/use-auth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        Welcome, {user.displayName || user.email}!
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Profile</CardTitle>
          <CardDescription>
            Complete your profile to start connecting with others.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Your profile is the first thing potential matches will see. Make it
            shine!
          </p>
          <Button asChild>
            <Link href="/onboarding/create-profile">
              Continue to Profile Builder
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
