
import { db } from '@/lib/firebase-admin';
import type { SuccessStory } from '@/types';

export async function getSuccessStories(): Promise<SuccessStory[]> {
  if (!db) return [];

  try {
    const snapshot = await db.collection('successStories')
      .orderBy('createdAt', 'desc')
      .limit(6)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SuccessStory[];
  } catch (error) {
    console.error('Error fetching success stories:', error);
    return [];
  }
}
