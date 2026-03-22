'use server';

import { getUsers } from './users';
import { suggestMatches } from '@/ai/flows/suggest-matches';

export async function getAiSuggestionsAction() {
  const allUsers = await getUsers();
  const approvedUsers = allUsers.filter(user => user.profileStatus === 'approved');

  // Map UserProfile to the enhanced format expected by the AI flow
  const profilesForAI = approvedUsers.map(user => {
    const p = (user as any).profile || {};
    return {
      id: user.uid,
      name: user.fullName,
      gender: p.gender || 'Not specified',
      age: p.dob ? new Date().getFullYear() - new Date(p.dob).getFullYear() : 0,
      location: p.currentLocation || 'N/A',
      bio: p.bio || '',
      education: p.education?.highestEducation || 'N/A',
      profession: p.career?.profession || 'N/A',
      visaStatus: p.visaStatus || 'N/A',
      partnerPreferences: p.partnerPreferences?.general || '',
    };
  });
  
  if (profilesForAI.length < 2) {
    throw new Error("Not enough approved profiles to generate matches.");
  }

  const result = await suggestMatches(profilesForAI as any);
  return result;
}
