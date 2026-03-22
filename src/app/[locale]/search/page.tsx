
import { getUsers } from '@/lib/server-actions/users';
import type { UserProfile } from '@/types';
import { ProfileCard } from '@/components/profile-card';
import { SearchForm } from '@/components/search/search-form';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sParams = await searchParams;
  const filteredProfiles = await getUsers(sParams);
  
  const hasSearched = Object.keys(sParams).length > 0;

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
