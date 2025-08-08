
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockProfiles } from '@/lib/mock-data';
import type { Profile } from '@/types';
import { ProfileCard } from '@/components/profile-card';
import { SearchIcon } from 'lucide-react';

const searchSchema = z.object({
  minAge: z.string().optional(),
  maxAge: z.string().optional(),
  location: z.string().optional(),
  education: z.string().optional(),
  religion: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      minAge: '',
      maxAge: '',
      location: '',
      education: '',
      religion: '',
    },
  });

  const onSubmit = (data: SearchFormValues) => {
    const { minAge, maxAge, location, religion } = data;
    
    const results = mockProfiles.filter(profile => {
      let isMatch = true;

      if (minAge && profile.age < parseInt(minAge, 10)) {
        isMatch = false;
      }
      if (maxAge && profile.age > parseInt(maxAge, 10)) {
        isMatch = false;
      }
      if (location && !profile.location.toLowerCase().includes(location.toLowerCase())) {
        isMatch = false;
      }
      // This is a simplification. A real app would have structured education data.
      if (religion && profile.bio.toLowerCase().includes('hindu') && religion !== 'Hindu') {
          isMatch = false;
      }


      return isMatch && profile.status === 'approved';
    });

    setSearchResults(results);
    setHasSearched(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">Search for a Partner</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Refine Your Search</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <FormField
                  control={form.control}
                  name="minAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 25" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 32" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City or Country" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="religion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Religion</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Any" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Any">Any</SelectItem>
                          <SelectItem value="Hindu">Hindu</SelectItem>
                          <SelectItem value="Buddhist">Buddhist</SelectItem>
                          <SelectItem value="Christian">Christian</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">
                  <SearchIcon className="mr-2" />
                  Search
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-headline mb-4 text-2xl font-bold">
          {hasSearched ? 'Search Results' : 'Featured Profiles'}
        </h2>
        
        {hasSearched && searchResults.length === 0 ? (
           <Card className="p-12 text-center">
             <CardTitle className="font-headline">No Matches Found</CardTitle>
             <p className="mt-2 text-muted-foreground">
               Try broadening your search criteria to find more profiles.
             </p>
           </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(hasSearched ? searchResults : mockProfiles.filter(p => p.status === 'approved')).map(profile => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
