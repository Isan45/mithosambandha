
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type MembershipTier = 'Free' | 'Gold' | 'Platinum';

interface MembershipBadgeProps {
  tier: MembershipTier;
  className?: string;
  showIcon?: boolean;
}

export function MembershipBadge({ tier, className, showIcon = true }: MembershipBadgeProps) {
  const getTierStyles = (tier: MembershipTier) => {
    switch (tier) {
      case 'Platinum':
        return {
          bg: 'bg-gradient-to-r from-slate-900 to-slate-700 text-white border-none shadow-sm',
          icon: <Crown className="h-3 w-3 mr-1" />,
          label: 'Platinum'
        };
      case 'Gold':
        return {
          bg: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 border-none shadow-sm',
          icon: <Star className="h-3 w-3 mr-1" />,
          label: 'Gold'
        };
      case 'Free':
      default:
        return {
          bg: 'bg-secondary text-secondary-foreground',
          icon: <ShieldCheck className="h-3 w-3 mr-1" />,
          label: 'Standard'
        };
    }
  };

  const styles = getTierStyles(tier);

  return (
    <Badge className={cn("font-semibold px-2 py-0.5 flex items-center w-fit", styles.bg, className)}>
      {showIcon && styles.icon}
      {styles.label}
    </Badge>
  );
}
