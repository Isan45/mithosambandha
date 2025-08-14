
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterIcon } from 'lucide-react';

const filterSchema = z.object({
  status: z.string().optional(),
  role: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

export function UserFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      status: searchParams.get('status') || 'all',
      role: searchParams.get('role') || 'all',
    },
  });

  const onSubmit = (data: FilterFormValues) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(data).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending-review">Pending Review</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="incomplete">Incomplete</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by role..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button type="submit">
            <FilterIcon className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </form>
    </Form>
  );
}
