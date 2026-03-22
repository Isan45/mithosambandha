
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from '@/i18n/routing';
import { updateMembership } from '@/lib/server-actions/users';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CheckoutButtonProps {
  plan: 'Gold' | 'Platinum';
  price: string;
}

export function CheckoutButton({ plan, price }: CheckoutButtonProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      // Mock payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await updateMembership(user.uid, plan);
      
      toast({
        title: "Success!",
        description: `You are now a ${plan} member. Enjoy your new features!`,
      });
      setOpen(false);
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <Button disabled className="w-full">Loading...</Button>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          {user ? 'Upgrade Now' : 'Sign In to Upgrade'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Your Plan</DialogTitle>
          <DialogDescription>
            You are upgrading to the <strong>{plan}</strong> plan for <strong>{price}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-muted/30">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground italic">Mock Payment Gateway Enabled</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleUpgrade} disabled={loading} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Pay & Upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
