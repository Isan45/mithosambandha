// This component is no longer used in the new onboarding flow.
// It is kept for reference but can be deleted.
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { FileUp, PartyPopper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  age: z.coerce
    .number()
    .int()
    .min(18, { message: 'You must be at least 18 years old.' })
    .max(100),
  location: z.string().min(3, { message: 'Please enter a valid location.' }),
  bio: z
    .string()
    .min(100, { message: 'Bio must be at least 100 characters.' })
    .max(1000),
  partnerPreferences: z
    .string()
    .min(50, { message: 'Preferences must be at least 50 characters.' })
    .max(1000),
  photos: z
    .any()
    .refine(files => files?.length >= 3, 'At least 3 photos are required.'),
});

export function ProfileForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      age: 18,
      location: '',
      bio: '',
      partnerPreferences: '',
      photos: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    // In a real app, you would upload files and send data to your server.
    console.log(values);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    toast({
      title: 'Profile Submitted!',
      description: 'Your profile is now pending review by our admin team.',
    });
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <Card className="p-8 text-center md:p-12">
        <PartyPopper className="mx-auto h-16 w-16 text-accent" />
        <h2 className="font-headline mt-4 text-3xl">Thank You!</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Your profile has been successfully submitted for review. Our team will
          get back to you soon.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Your Details</CardTitle>
        <CardDescription>
          Please fill out the form carefully. This information will be used to
          create your public profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City & Country</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Kathmandu, Nepal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your personality, lifestyle, hobbies, and values..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Minimum 100 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="partnerPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner Preferences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you're looking for in a partner..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Minimum 50 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Photos</FormLabel>
                  <FormControl>
                    <div className="flex w-full items-center justify-center">
                      <label
                        htmlFor="dropzone-file"
                        className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-secondary hover:bg-muted"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileUp className="mb-4 h-8 w-8 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            At least 3 high-quality photos (PNG, JPG)
                          </p>
                        </div>
                        <Input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          multiple
                          {...form.register('photos')}
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? 'Submitting...'
                : 'Submit for Review'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
