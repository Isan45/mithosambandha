
'use server';

import { adminDb } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';

export type AdminAction =
  | 'USER_SUSPEND'
  | 'USER_UNSUSPEND'
  | 'VERIFICATION_APPROVE'
  | 'VERIFICATION_REJECT'
  | 'PROFILE_EDIT';

// This function assumes you have a way to get the current admin's UID.
// In a real app, this would come from the server session.
// For now, we'll simulate it. In a real scenario, you'd replace 'SIMULATED_ADMIN_UID'
// with the actual UID from your authentication middleware.
async function getCurrentAdminUid() {
    // In a proper setup, you'd get this from the session.
    // As a placeholder, let's find our default admin user.
    try {
        const adminUser = await getAuth().getUserByEmail('admin@mithosambandha.com');
        return adminUser.uid;
    } catch (error) {
        console.error("Could not find admin user for audit log, using placeholder.");
        return 'UNKNOWN_ADMIN';
    }
}


export async function logAdminAction({
  action,
  targetUid,
  changes,
  reason,
}: {
  action: AdminAction;
  targetUid: string;
  changes?: { oldValue: any; newValue: any };
  reason?: string;
}) {
  try {
    const adminUid = await getCurrentAdminUid();

    const logEntry = {
      action,
      adminUid,
      targetUid,
      timestamp: FieldValue.serverTimestamp(),
      changes: changes || null,
      reason: reason || null,
    };

    await adminDb.collection('auditLogs').add(logEntry);
  } catch (error) {
    console.error('Failed to write to audit log:', error);
    // Depending on the severity, you might want to throw the error
    // or send an alert to an admin monitoring service.
  }
}
