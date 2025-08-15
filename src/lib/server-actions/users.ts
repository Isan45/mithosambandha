
'use server';

import { db, auth } from '@/lib/firebase-admin';
import type { UserProfile } from '@/types';
import { logAdminAction } from './audit';
import { revalidatePath } from 'next/cache';
import type * as admin from 'firebase-admin';

export async function getUsers(filters?: { [key: string]: any }): Promise<UserProfile[]> {
  if (!db) {
    console.warn('[getUsers] Firebase Admin is not initialized. Returning empty array.');
    return [];
  }
  try {
    let query: admin.firestore.Query<admin.firestore.DocumentData> = db.collection('users');

    // Server-side filtering for indexed fields
    if (filters?.status && filters.status !== 'all') {
      query = query.where('profileStatus', '==', filters.status);
    }
    if (filters?.role && filters.role !== 'all') {
      query = query.where('role', '==', filters.role);
    }
    if (filters?.religion && filters.religion !== 'Any') {
      query = query.where('profile.religion', '==', filters.religion);
    }
     if (filters?.maritalStatus && filters.maritalStatus !== 'Any') {
      query = query.where('profile.maritalStatus', '==', filters.maritalStatus);
    }
     if (filters?.education && filters.education !== 'Any') {
      query = query.where('profile.education.highestEducation', '==', filters.education);
    }

    query = query.orderBy('createdAt', 'desc');
    const snapshot = await query.get();
    
    if (snapshot.empty) {
      return [];
    }

    let users: UserProfile[] = [];
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

    // Manual filtering for fields that aren't indexed or require partial matching.
    if (filters) {
      users = users.filter(user => {
        const profile = (user as any).profile || {};
        
        if (filters.query) {
          const queryLower = filters.query.toLowerCase();
          const nameMatch = user.fullName?.toLowerCase().includes(queryLower);
          const emailMatch = user.email?.toLowerCase().includes(queryLower);
          const uidMatch = user.uid?.toLowerCase().includes(queryLower);
          if (!nameMatch && !emailMatch && !uidMatch) {
            return false;
          }
        }
        if (filters.location) {
          const locationLower = filters.location.toLowerCase();
          if (!profile?.currentLocation?.toLowerCase().includes(locationLower)) {
            return false;
          }
        }
        if (filters.caste) {
            const casteLower = filters.caste.toLowerCase();
            if (!profile?.caste?.toLowerCase().includes(casteLower)) {
                return false;
            }
        }
        return true;
      });
    }


    return users;
  } catch (error: any) {
    console.error('Error fetching users (likely due to missing admin credentials or composite index):', error.message);
    // It's possible a query fails due to a missing composite index.
    // In a production app, you'd log this and create the index in Firestore.
    // For this environment, we'll return an empty array on failure.
    return [];
  }
}

export async function getUser(uid: string): Promise<UserProfile | null> {
    if (!db) {
      console.warn(`[getUser] Firebase Admin is not initialized. Cannot fetch user ${uid}.`);
      return null;
    }
    try {
        const docRef = db.collection('users').doc(uid);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return null;
        }

        const data = docSnap.data();
        if (!data) return null;
        
        const profile = data.profile || {};

        return {
          ...data,
          // Ensure nested profile object exists
          profile: {
             ...profile,
             profileCompletion: profile.profileCompletion || data.profileCompletion || 0,
          },
          // Ensure dates are serializable
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate().toISOString()
            : null,
          lastActiveAt: data.lastActiveAt?.toDate
            ? data.lastActiveAt.toDate().toISOString()
            : null,
        } as UserProfile;

    } catch (error: any) {
        console.error(`Error fetching user ${uid} (likely due to missing admin credentials):`, error.message);
        return null;
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
    
    // Revoke their session tokens to log them out
    await auth.revokeRefreshTokens(uid);

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

export async function updateUser(uid: string, data: { fullName: string; role: 'user' | 'admin' | 'moderator' }): Promise<void> {
  if (!db) {
    console.error('Firebase Admin SDK not initialized. Cannot update user.');
    throw new Error('Admin services not available.');
  }
  try {
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) throw new Error("User not found.");

    const oldData = { fullName: userDoc.data()?.fullName, role: userDoc.data()?.role };

    await userRef.update(data);
    
    await logAdminAction({
      action: 'PROFILE_EDIT',
      targetUid: uid,
      changes: { oldValue: oldData, newValue: data },
      reason: 'Admin updated user from edit page.'
    });

    revalidatePath(`/admin/users`);
    revalidatePath(`/admin/users/${uid}`);
  } catch (error: any) {
    console.error(`Failed to update user ${uid}:`, error);
    throw new Error(`Could not update user: ${error.message}`);
  }
}
