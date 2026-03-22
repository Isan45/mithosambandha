
'use server';

import { db, auth } from '@/lib/firebase-admin';
import type { UserProfile } from '@/types';
import { logAdminAction } from './audit';
import { sendNotification } from '../notifications';
import { revalidatePath } from 'next/cache';
import type * as admin from 'firebase-admin';

// Helper to calculate age from DOB string
function calculateAge(dob?: string): number {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export async function getUsers(filters?: { [key: string]: any }): Promise<UserProfile[]> {
  if (!db) {
    console.warn('[getUsers] Firebase Admin is not initialized. Returning empty array.');
    return [];
  }
  try {
    let query: admin.firestore.Query<admin.firestore.DocumentData> = db.collection('users');

    // Default filter for public searches is 'approved' users
    if (filters && Object.keys(filters).length > 0) {
        if (!filters.status) {
             query = query.where('profileStatus', '==', 'approved');
        }
    } else if (!filters?.status) {
        query = query.where('profileStatus', '==', 'approved');
    }

    // Server-side filtering for indexed fields
    if (filters?.status && filters.status !== 'all' && filters.status !== 'Any') {
      query = query.where('profileStatus', '==', filters.status);
    }
    if (filters?.role && filters.role !== 'all' && filters.role !== 'Any') {
      query = query.where('role', '==', filters.role);
    }
     if (filters?.gender && filters.gender !== 'all' && filters.gender !== 'Any') {
      query = query.where('profile.gender', '==', filters.gender);
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

    // Always sort to ensure consistent results, especially for pagination later
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

    // Manual client-side style filtering for non-indexed fields or complex logic
    if (filters && Object.keys(filters).length > 0) {
      users = users.filter(user => {
        const profile = (user as any).profile || {};
        const age = calculateAge(profile.dob);

        if (filters.minAge && age < Number(filters.minAge)) return false;
        if (filters.maxAge && age > Number(filters.maxAge)) return false;

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
         if (filters.occupation) {
            const occupationLower = filters.occupation.toLowerCase();
            if (!profile?.career?.profession?.toLowerCase().includes(occupationLower)) {
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

    // Send Notification
    await sendNotification({
      recipientUid: uid,
      type: 'ACCOUNT_SUSPENDED',
      title: 'Your account has been suspended',
      body: `Reason: ${reason}. Please contact support for more information.`,
      sendEmail: true
    });
  } catch (error) {
    console.error(`Failed to suspend user ${uid}:`, error);
    throw new Error('Could not suspend user.');
  }
}

export async function updateMembership(
  uid: string, 
  plan: 'Free' | 'Gold' | 'Platinum',
  months: number = 1
): Promise<void> {
  if (!db) {
    console.error('Firebase Admin SDK not initialized.');
    throw new Error('Admin services not available.');
  }

  try {
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) throw new Error("User not found.");

    const oldPlan = userDoc.data()?.membership || 'Free';
    
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + months);

    // Default quotas based on plan
    const matchesRemaining = plan === 'Platinum' ? 999 : (plan === 'Gold' ? 10 : 0);

    const updateData = {
      membership: plan,
      membershipExpiresAt: expiryDate,
      matchesRemaining: matchesRemaining
    };

    await userRef.update(updateData);

    await logAdminAction({
      action: 'PROFILE_EDIT',
      targetUid: uid,
      changes: { oldValue: { membership: oldPlan }, newValue: updateData },
      reason: `Membership upgraded to ${plan} for ${months} months.`
    });

    // Notify user
    await sendNotification({
      recipientUid: uid,
      type: 'PROFILE_APPROVED', // Reuse type or add new one
      title: 'Membership Upgraded!',
      body: `Your account has been upgraded to ${plan}. Validity: ${expiryDate.toLocaleDateString()}.`,
      sendEmail: true
    });

  } catch (error) {
    console.error(`Failed to update membership for ${uid}:`, error);
    throw new Error('Could not update membership.');
  }
}

/**
 * Helper to check if a user has access to a specific feature based on their membership.
 */
export async function checkFeatureAccess(uid: string, feature: 'CHAT' | 'CONTACT_INFO' | 'AI_SUGGESTIONS'): Promise<boolean> {
  if (!db) return false;

  const userDoc = await db.collection('users').doc(uid).get();
  if (!userDoc.exists) return false;

  const userData = userDoc.data();
  const plan = userData?.membership || 'Free';
  const expiresAt = userData?.membershipExpiresAt?.toDate();

  // Check for expiration
  if (expiresAt && expiresAt < new Date()) {
    return false;
  }

  switch (feature) {
    case 'CHAT':
      return plan === 'Gold' || plan === 'Platinum';
    case 'CONTACT_INFO':
    case 'AI_SUGGESTIONS':
      return plan === 'Platinum';
    default:
      return false;
  }
}

export async function updateLastActive(uid: string): Promise<void> {
    if (!db) return;
    try {
        await db.collection('users').doc(uid).update({
            lastActiveAt: new Date(),
        });
    } catch (error) {
        console.error(`Failed to update last active for user ${uid}:`, error);
    }
}

export async function unsuspendUser(uid: string, reason: string): Promise<void> {
  if (!db || !auth) {
    console.error('Firebase Admin SDK not initialized. Cannot unsuspend user.');
    throw new Error('Admin services not available.');
  }
  try {
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User not found.');
    }

    const oldStatus = userDoc.data()?.profileStatus;

    // Set the user's profile status back to approved in Firestore
    await userRef.update({ profileStatus: 'approved' });

    // Enable the user in Firebase Auth
    await auth.updateUser(uid, { disabled: false });
    
    // Log the action
    await logAdminAction({
      action: 'USER_UNSUSPEND',
      targetUid: uid,
      reason: reason,
      changes: {
        oldValue: oldStatus,
        newValue: 'approved',
      },
    });

    // Send Notification
    await sendNotification({
        recipientUid: uid,
        type: 'PROFILE_APPROVED',
        title: 'Account Unsuspended',
        body: 'Your account has been re-enabled. You can now login and explore matches.',
        sendEmail: true
    });
  } catch (error) {
    console.error(`Failed to unsuspend user ${uid}:`, error);
    throw new Error('Could not unsuspend user.');
  }
}

export async function approveProfile(uid: string): Promise<void> {
  if (!db || !auth) {
    console.error('Firebase Admin SDK not initialized. Cannot approve profile.');
    throw new Error('Admin services not available.');
  }
  try {
    const userRef = db.collection('users').doc(uid);
    await userRef.update({ 
      profileStatus: 'approved',
      'profile.idVerified': true
    });

    await logAdminAction({
      action: 'VERIFICATION_APPROVE',
      targetUid: uid,
      reason: 'Profile approved from verification queue.',
    });

    // Send Notification
    await sendNotification({
        recipientUid: uid,
        type: 'PROFILE_APPROVED',
        title: 'Profile Approved!',
        body: 'Congratulations! Your profile has been approved and is now visible on Mitho Sambandha.',
        sendEmail: true
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

    // Send Notification
    await sendNotification({
        recipientUid: uid,
        type: 'PROFILE_REJECTED',
        title: 'Profile Update Required',
        body: `Unfortunately, your profile could not be approved at this time. Reason: ${reason}. Please update your details and resubmit.`,
        sendEmail: true
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

export function calculateSeriousnessScore(user: UserProfile): number {
  let score = 0;
  
  // 1. Profile Completeness (up to 40 points)
  score += (user.profileCompletion || 0) * 0.4;
  
  // 2. Photos (up to 20 points)
  const photoCount = (user.profile?.galleryPhotos?.length || 0) + (user.profile?.profilePhoto ? 1 : 0);
  score += Math.min(photoCount * 5, 20);
  
  // 3. Verification (up to 30 points)
  if (user.profile?.idVerified) {
    score += 30;
  } else if (user.profile?.verificationTier === 'email') {
    score += 10;
  }
  
  // 4. Bio length (up to 10 points)
  const bioLength = user.profile?.bio?.length || 0;
  score += Math.min(Math.floor(bioLength / 20), 10);
  
  return Math.min(score, 100);
}
