
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import { format } from 'date-fns';

interface ProfileBadgesProps {
  idVerified?: boolean;
  verificationTier?: 'email' | 'id';
  verifiedAt?: any;
  seriousnessScore?: number;
}

export function ProfileBadges({ idVerified, verificationTier, verifiedAt, seriousnessScore }: ProfileBadgesProps) {
  const formattedDate = verifiedAt?.toDate ? format(verifiedAt.toDate(), 'MMM yyyy') : null;

  return (
    <div className="flex flex-wrap gap-2">
      {idVerified && (
        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 px-3 py-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ID Verified</span>
          {formattedDate && <span className="text-[10px] opacity-70 ml-1">({formattedDate})</span>}
        </Badge>
      )}
      
      {seriousnessScore && seriousnessScore > 80 && (
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 px-3 py-1">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>Serious Profile</span>
        </Badge>
      )}

      {!idVerified && verificationTier === 'email' && (
        <Badge variant="outline" className="text-muted-foreground gap-1 px-3 py-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Email Verified</span>
        </Badge>
      )}
    </div>
  );
}
