
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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';
import { useRouter } from '@/i18n/routing';
import Image from 'next/image';

const step1Schema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'A valid email is required.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  onboardingReason: z.enum(
    ['life-partner', 'for-someone-else', 'browsing'],
    { required_error: 'Please select a reason for joining.' }
  ),
});

export default function JoinPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof step1Schema>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: values.email,
        fullName: values.fullName,
        onboardingReason: values.onboardingReason,
        profileStatus: 'incomplete',
        role: 'user',
        profileCompletion: 0.1,
        createdAt: new Date(),
      });

      toast({
        title: 'Account Created!',
        description: "Let's continue building your profile.",
      });

      router.push('/onboarding/create-profile');
    } catch (error: any) {
      console.error('Signup Error:', error);
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description:
          error.code === 'auth/email-already-in-use'
            ? 'This email is already registered.'
            : 'An unexpected error occurred. Please try again.',
      });
    }
  }

  return (
    <div className="flex min-h-full flex-col justify-center py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="mx-auto grid max-w-4xl grid-cols-1 overflow-hidden shadow-lg md:grid-cols-2">
          <div className="relative hidden md:block">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/mitho-sambandha-c4959.firebasestorage.app/o/mitho-sambandha-4.avif?alt=media&token=d2fd5406-7175-419e-be6d-7da8c856f5db"
              alt="Happy couple celebrating their union"
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint="happy couple"
            />
          </div>
          <div className="flex flex-col justify-center p-6 md:p-8">
            <CardHeader className="p-0 text-center">
              <CardTitle className="font-headline text-3xl">
                Join Our Community
              </CardTitle>
              <CardDescription className="mt-2 text-muted-foreground">
                Let's get started. A complete profile gets seen more.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-6 p-0">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
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
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="onboardingReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>I am here to...</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a reason..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="life-partner">
                              Find a life partner for myself
                            </SelectItem>
                            <SelectItem value="for-someone-else">
                              Create a profile for someone else
                            </SelectItem>
                            <SelectItem value="browsing">
                              Just browsing
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
                    {form.formState.isSubmitting ? (
                      'Creating Account...'
                    ) : (
                      <>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
