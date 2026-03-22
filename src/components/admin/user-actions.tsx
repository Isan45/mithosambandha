'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { approveProfile, rejectProfile, suspendUser, unsuspendUser } from '@/lib/server-actions/users';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, Ban, Loader2 } from 'lucide-react';

interface UserActionsProps {
  uid: string;
  currentStatus: string;
}

export function UserActions({ uid, currentStatus }: UserActionsProps) {
  const [isPending, setIsPending] = useState(false);
  const [dialogType, setDialogType] = useState<'reject' | 'suspend' | 'unsuspend' | null>(null);
  const [reason, setReason] = useState('');
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsPending(true);
    try {
      await approveProfile(uid);
      toast({ title: 'Profile Approved', description: 'The user profile is now live.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to approve profile.' });
    } finally {
      setIsPending(false);
    }
  };

  const handleActionWithReason = async () => {
    if (!reason.trim()) {
      toast({ variant: 'destructive', title: 'Reason Required', description: 'Please provide a reason for this action.' });
      return;
    }
    setIsPending(true);
    try {
      if (dialogType === 'reject') {
        await rejectProfile(uid, reason);
        toast({ title: 'Profile Rejected', description: 'The user has been notified.' });
      } else if (dialogType === 'suspend') {
        await suspendUser(uid, reason);
        toast({ title: 'User Suspended', description: 'The user account has been disabled.' });
      } else if (dialogType === 'unsuspend') {
        await unsuspendUser(uid, reason);
        toast({ title: 'User Unsuspended', description: 'The user account has been re-enabled.' });
      }
      setDialogType(null);
      setReason('');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: `Failed to ${dialogType} user.` });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        {currentStatus !== 'approved' && (
          <Button 
            className="bg-green-600 hover:bg-green-700" 
            onClick={handleApprove} 
            disabled={isPending}
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle2 className="mr-2 h-4 w-4"/> }
            Approve
          </Button>
        )}
        {currentStatus !== 'rejected' && (
          <Button 
            variant="outline" 
            className="text-orange-600 border-orange-200 hover:bg-orange-50" 
            onClick={() => setDialogType('reject')}
            disabled={isPending}
          >
            <XCircle className="mr-2 h-4 w-4"/> Reject
          </Button>
        )}
        {currentStatus !== 'suspended' && (
          <Button 
            variant="destructive" 
            onClick={() => setDialogType('suspend')}
            disabled={isPending}
          >
            <Ban className="mr-2 h-4 w-4"/> Suspend
          </Button>
        )}
        {currentStatus === 'suspended' && (
          <Button 
            variant="outline"
            className="border-green-200 text-green-600 hover:bg-green-50"
            onClick={() => setDialogType('unsuspend')}
            disabled={isPending}
          >
            <CheckCircle2 className="mr-2 h-4 w-4"/> Unsuspend
          </Button>
        )}
      </div>

      <Dialog open={dialogType !== null} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'reject' ? 'Reject Profile' : dialogType === 'suspend' ? 'Suspend User' : 'Unsuspend User'}
            </DialogTitle>
            <DialogDescription>
              Please provide a reason. This will be logged and may be shown to the user.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter reason here..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)} disabled={isPending}>Cancel</Button>
            <Button 
              variant={dialogType === 'suspend' ? 'destructive' : 'default'}
              onClick={handleActionWithReason}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
              Confirm {dialogType === 'reject' ? 'Rejection' : dialogType === 'suspend' ? 'Suspension' : 'Unsuspension'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
