
'use client';

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
import { SearchIcon, PlusCircle, MinusCircle, XCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';


// ✅ Expanded schema (future-proof: added gender, occupation, height)
const searchSchema = z.object({
  minAge: z.string().optional(),
  maxAge: z.string().optional(),
  location: z.string().optional(),
  maritalStatus: z.string().optional(),
  religion: z.string().optional(),
  education: z.string().optional(),
  caste: z.string().optional(),
  gender: z.string().optional(),
  occupation: z.string().optional(),
  minHeight: z.string().optional(),
  maxHeight: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [advancedOpen, setAdvancedOpen] = useState(
    !!(
      searchParams.get('religion') ||
      searchParams.get('education') ||
      searchParams.get('caste') ||
      searchParams.get('occupation')
    )
  );

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      minAge: searchParams.get('minAge') || '',
      maxAge: searchParams.get('maxAge') || '',
      location: searchParams.get('location') || '',
      maritalStatus: searchParams.get('maritalStatus') || '',
      religion: searchParams.get('religion') || '',
      education: searchParams.get('education') || '',
      caste: searchParams.get('caste') || '',
      gender: searchParams.get('gender') || '',
      occupation: searchParams.get('occupation') || '',
      minHeight: searchParams.get('minHeight') || '',
      maxHeight: searchParams.get('maxHeight') || '',
    },
  });

  const onSubmit = (data: SearchFormValues) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(data).forEach(([key, value]) => {
      if (value && value !== 'Any' && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/search?${params.toString()}`);
  };

  const onClear = () => {
    router.push('/search');
    form.reset({
        minAge: '',
        maxAge: '',
        location: '',
        maritalStatus: '',
        religion: '',
        education: '',
        caste: '',
        gender: '',
        occupation: '',
        minHeight: '',
        maxHeight: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refine Your Search</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 🔹 Quick Filters */}
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
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Any">Any</SelectItem>
                        <SelectItem value="never-married">Never Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* 🔹 Advanced Filters */}
            <Accordion
              type="single"
              collapsible
              defaultValue={advancedOpen ? 'advanced-search' : undefined}
              onValueChange={(value) => setAdvancedOpen(!!value)}
            >
              <AccordionItem value="advanced-search">
                <AccordionTrigger>
                  <span className="flex items-center gap-2 font-semibold">
                    {advancedOpen ? (
                      <MinusCircle className="h-4 w-4" />
                    ) : (
                      <PlusCircle className="h-4 w-4" />
                    )}
                    Advanced Search
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="religion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Religion</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
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
                              <SelectItem value="Muslim">Muslim</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Any" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Any">Any</SelectItem>
                              <SelectItem value="high-school">High School</SelectItem>
                              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                              <SelectItem value="masters">Master's Degree</SelectItem>
                              <SelectItem value="phd">PhD / Doctorate</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="caste"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Caste</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Brahmin" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Engineer" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Any" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Any">Any</SelectItem>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* 🔹 Action buttons */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClear}
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Clear Filters
              </Button>
              <Button type="submit">
                <SearchIcon className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
