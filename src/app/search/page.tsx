
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
  const allUsers = await getUsers(searchParams);
  
  const approvedProfiles = allUsers.filter(
    (user) => user.profileStatus === 'approved'
  );

  const filteredProfiles = approvedProfiles.filter(profile => {
    const p = (profile as any).profile || {};
    const age = calculateAge(p.dob);
    
    if (searchParams?.minAge && age < Number(searchParams.minAge)) return false;
    if (searchParams?.maxAge && age > Number(searchParams.maxAge)) return false;
    if (searchParams?.location && typeof searchParams.location === 'string' && p.currentLocation && !p.currentLocation.toLowerCase().includes(searchParams.location.toLowerCase())) return false;
    if (searchParams?.religion && typeof searchParams.religion === 'string' && p.religion && p.religion.toLowerCase() !== searchParams.religion.toLowerCase()) return false;
    if (searchParams?.caste && typeof searchParams.caste === 'string' && p.caste && !p.caste.toLowerCase().includes(searchParams.caste.toLowerCase())) return false;
    if (searchParams?.education && typeof searchParams.education === 'string' && p.education?.highestEducation && p.education.highestEducation !== searchParams.education) return false;
    if (searchParams?.maritalStatus && typeof searchParams.maritalStatus === 'string' && p.maritalStatus && p.maritalStatus !== searchParams.maritalStatus) return false;
    
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
