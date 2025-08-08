
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
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';

const aboutSchema = z.object({
  bio: z
    .string()
    .min(100, { message: 'Bio must be at least 100 characters.' })
    .max(1000, { message: 'Bio cannot exceed 1000 characters.' }),
  partnerPreferences: z
    .string()
    .min(50, { message: 'Preferences must be at least 50 characters.' })
    .max(1000, { message: 'Preferences cannot exceed 1000 characters.' }),
});

export default function AboutPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof aboutSchema>>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      bio: '',
      partnerPreferences: '',
    },
  });

  async function onSubmit(values: z.infer<typeof aboutSchema>) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to update your profile.',
      });
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        'profile.bio': values.bio,
        'profile.partnerPreferences': values.partnerPreferences,
        profileStatus: 'in-progress-photos', // Next step is photos
      }, { merge: true });

      toast({
        title: 'Profile Details Saved!',
        description: "Just one more step to go!",
      });
      router.push('/dashboard'); // Temporarily redirect to dashboard
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save your information.',
      });
    }
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Step 4: About You & Your Preferences
              </CardTitle>
              <CardDescription>
                This is the heart of your profile. Take your time to express yourself.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your personality, lifestyle, values, and what makes you unique."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This helps us understand who you are. (Min 100 characters)
                        </FormDescription>
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
                            placeholder="Describe what you are looking for in a life partner. Be specific about qualities, values, and lifestyle."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          What are the most important things you're looking for? (Min 50 characters)
                        </FormDescription>
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
                      ? 'Saving...'
                      : 'Save & Continue'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
