
'use server';

import { adminDb } from '@/lib/firebase-admin';
import type { UserProfile } from '@/types';

export async function getUsers(): Promise<UserProfile[]> {
  try {
    const snapshot = await adminDb.collection('users').get();
    if (snapshot.empty) {
      return [];
    }
    
    const users: UserProfile[] = [];
    snapshot.forEach(doc => {
      // Basic validation to ensure it's a UserProfile-like object
      const data = doc.data();
      if (data.uid && data.displayName) {
          users.push({
            ...data,
            // Ensure dates are serializable
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
            lastActiveAt: data.lastActiveAt?.toDate ? data.lastActiveAt.toDate().toISOString() : null,
          } as UserProfile);
      }
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    // In a real app, you might want to throw a more specific error
    // or return a result object with an error field.
    return [];
  }
}
