
'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { Lock, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ContactAccessGuardProps {
  children: React.ReactNode;
  requiredTier?: 'Gold' | 'Platinum';
}

export function ContactAccessGuard({ children, requiredTier = 'Gold' }: ContactAccessGuardProps) {
  const { user, membership, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="p-6 text-center">
          <Lock className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
          <p className="text-sm font-medium mb-4">Login to view contact details</p>
          <Button asChild size="sm">
            <Link href="/login">Login Now</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isPlatinum = membership === 'Platinum';
  const isGold = membership === 'Gold';

  const hasAccess = isPlatinum || (requiredTier === 'Gold' && isGold);

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-6 text-center">
        <Crown className="mx-auto h-8 w-8 mb-2 text-primary" />
        <h4 className="font-bold text-lg mb-1">Upgrade Required</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Viewing contact information and starting chats is a premium feature.
        </p>
        <div className="flex flex-col gap-2">
          <Button asChild className="bg-primary">
            <Link href="/pricing">View Plans</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
