
'use server';

import { db, auth } from '@/lib/firebase-admin';
import type { UserProfile } from '@/types';
import { logAdminAction } from './audit';

export async function getUsers(): Promise<UserProfile[]> {
  try {
    const snapshot = await db.collection('users').get();
    if (snapshot.empty) {
      return [];
    }

    const users: UserProfile[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // Basic validation to ensure it's a UserProfile-like object
      if (data.uid) {
        users.push({
          ...data,
          // Ensure dates are serializable
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate().toISOString()
            : null,
          lastActiveAt: data.lastActiveAt?.toDate
            ? data.lastActiveAt.toDate().toISOString()
            : null,
        } as UserProfile);
      }
    });

    return users;
  } catch (error: any) {
    // This allows the app to run even if the admin SDK isn't configured.
    // The missing FIREBASE_SERVICE_ACCOUNT_BASE64 env var will cause an error here.
    console.error('Error fetching users (likely due to missing admin credentials):', error.message);
    return [];
  }
}

export async function suspendUser(uid: string, reason: string): Promise<void> {
  if (!db || !auth) {
    console.error('Firebase Admin SDK not initialized. Cannot suspend user.');
    throw new Error('Admin services not available.');
  }
  try {
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User not found.');
    }

    const oldStatus = userDoc.data()?.profileStatus;

    // Set the user's profile status to suspended in Firestore
    await userRef.update({ profileStatus: 'suspended' });

    // Disable the user in Firebase Auth
    await auth.updateUser(uid, { disabled: true });

    // Log the action
    await logAdminAction({
      action: 'USER_SUSPEND',
      targetUid: uid,
      reason: reason,
      changes: {
        oldValue: oldStatus,
        newValue: 'suspended',
      },
    });
  } catch (error) {
    console.error(`Failed to suspend user ${uid}:`, error);
    throw new Error('Could not suspend user.');
  }
}

export async function approveProfile(uid: string): Promise<void> {
  if (!db || !auth) {
    console.error('Firebase Admin SDK not initialized. Cannot approve profile.');
    throw new Error('Admin services not available.');
  }
  try {
    const userRef = db.collection('users').doc(uid);
    await userRef.update({ profileStatus: 'approved' });

    await logAdminAction({
      action: 'VERIFICATION_APPROVE',
      targetUid: uid,
      reason: 'Profile approved from verification queue.',
    });
  } catch (error) {
    console.error(`Failed to approve profile ${uid}:`, error);
    throw new Error('Could not approve profile.');
  }
}

export async function rejectProfile(uid: string, reason: string): Promise<void> {
  if (!db || !auth) {
    console.error('Firebase Admin SDK not initialized. Cannot reject profile.');
    throw new Error('Admin services not available.');
  }
  try {
    const userRef = db.collection('users').doc(uid);
    await userRef.update({ profileStatus: 'rejected' });

    await logAdminAction({
      action: 'VERIFICATION_REJECT',
      targetUid: uid,
      reason: `Profile rejected from verification queue: ${reason}`,
    });
  } catch (error) {
    console.error(`Failed to reject profile ${uid}:`, error);
    throw new Error('Could not reject profile.');
  }
}
