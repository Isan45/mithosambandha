
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateMembership } from '@/lib/server-actions/users';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from '@/i18n/routing';
import { Loader2 } from 'lucide-react';

interface MembershipSelectorProps {
  uid: string;
  currentTier: 'Free' | 'Gold' | 'Platinum';
}

export function MembershipSelector({ uid, currentTier }: MembershipSelectorProps) {
  const [tier, setTier] = React.useState<string>(currentTier);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateMembership(uid, tier as any);
      toast({
        title: 'Membership Updated',
        description: `User is now a ${tier} member.`,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Could not update membership status.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={tier} onValueChange={setTier}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select Tier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Free">Free / Standard</SelectItem>
          <SelectItem value="Gold">Gold</SelectItem>
          <SelectItem value="Platinum">Platinum</SelectItem>
        </SelectContent>
      </Select>
      <Button 
        onClick={handleUpdate} 
        disabled={loading || tier === currentTier}
        size="sm"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Tier'}
      </Button>
    </div>
  );
}
