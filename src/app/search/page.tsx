
import { getUsers } from '@/lib/server-actions/users';
import type { UserProfile } from '@/types';
import { ProfileCard } from '@/components/profile-card';
import { SearchForm } from '@/components/search/search-form';

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

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const allUsers = await getUsers();
  const approvedProfiles = allUsers.filter(
    (user) => user.profileStatus === 'approved'
  );

  const { minAge, maxAge, location, religion, caste, education, maritalStatus } = searchParams || {};

  const filteredProfiles = approvedProfiles.filter(profile => {
    // The profile structure from Firestore is nested under a `profile` object
    const p = (profile as any).profile || {};
    const age = calculateAge(p.dob);
    
    if (minAge && age < Number(minAge)) return false;
    if (maxAge && age > Number(maxAge)) return false;
    if (location && typeof location === 'string' && p.currentLocation && !p.currentLocation.toLowerCase().includes(location.toLowerCase())) return false;
    if (religion && typeof religion === 'string' && p.religion && p.religion.toLowerCase() !== religion.toLowerCase()) return false;
    if (caste && typeof caste === 'string' && p.caste && !p.caste.toLowerCase().includes(caste.toLowerCase())) return false;
    if (education && typeof education === 'string' && p.education?.highestEducation && p.education.highestEducation !== education) return false;
    if (maritalStatus && typeof maritalStatus === 'string' && p.maritalStatus && p.maritalStatus !== maritalStatus) return false;
    
    return true;
  });
  
  const hasSearched = Object.keys(searchParams || {}).length > 0;


  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        Find your Mitho Sambandha
      </h1>

      <SearchForm />

      <div className="mt-8">
        <h2 className="font-headline mb-4 text-2xl font-bold">
          {hasSearched ? `Search Results (${filteredProfiles.length})` : 'Browse Profiles'}
        </h2>

        {filteredProfiles.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed rounded-lg">
            <h3 className="font-headline text-2xl">No Matches Found</h3>
            <p className="mt-2 text-muted-foreground">
              Try broadening your search criteria to find more profiles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProfiles.map(profile => (
              <ProfileCard key={profile.uid} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
