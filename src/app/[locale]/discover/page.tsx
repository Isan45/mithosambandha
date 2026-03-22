
import { getUsers } from '@/lib/server-actions/users';
import { DiscoverClient } from '@/components/discover/discover-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover Matches',
  description: 'Swipe through potential matches and find your special someone.',
};

export default async function DiscoverPage() {
  const allUsers = await getUsers();
  const approvedProfiles = allUsers.filter(u => u.profileStatus === 'approved');

  return <DiscoverClient initialProfiles={approvedProfiles} />;
}
