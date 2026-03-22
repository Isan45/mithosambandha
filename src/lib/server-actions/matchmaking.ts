
'use server';

import { db } from '@/lib/firebase-admin';
import { suggestMatches, SuggestMatchesInput } from '@/ai/flows/suggest-matches';
import type { UserProfile } from '@/types';

export async function getAIRecommendationsForAdmin(): Promise<any[]> {
  if (!db) return [];

  try {
    // 1. Fetch some approved profiles to analyze
    // In a real app, we'd filter by recent or specific criteria
    const snapshot = await db.collection('users')
      .where('profileStatus', '==', 'approved')
      .limit(20)
      .get();

    const profiles = snapshot.docs.map(doc => {
      const data = doc.data() as UserProfile;
      const p = data.profile || {};
      return {
        id: doc.id,
        name: data.fullName,
        gender: p.gender || 'Unknown',
        age: calculateAge(p.dob),
        location: p.currentLocation || 'Unknown',
        education: p.education?.highestEducation,
        profession: p.career?.profession,
        visaStatus: p.visaStatus,
        bio: p.bio || '',
        partnerPreferences: p.partnerPreferences?.general || ''
      };
    });

    if (profiles.length < 2) return [];

    // 2. Call AI Flow
    const matches = await suggestMatches(profiles as SuggestMatchesInput);

    return matches;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    return [];
  }
}

export async function recommendMatch(
  uid1: string,
  uid2: string,
  reason: string,
  adminUid: string
) {
  if (!db) throw new Error('DB not initialized');
  
  const recommendation = {
    uids: [uid1, uid2],
    reason,
    recommendedBy: adminUid,
    createdAt: new Date(), // Using native Date for simpler mock/initial impl if serverTimestamp is tricky in certain contexts, but usually preferred.
    status: 'pending'
  };

  await db.collection('manualRecommendations').add(recommendation);
  return { success: true };
}

function calculateAge(dob?: string) {
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
