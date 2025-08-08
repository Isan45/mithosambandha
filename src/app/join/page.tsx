
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
import { ArrowRight, PartyPopper } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';
import { useRouter } from 'next/navigation';

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
      // Step 1: Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      // Step 2: Save initial user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: values.email,
        fullName: values.fullName,
        onboardingReason: values.onboardingReason,
        profileStatus: 'incomplete',
        createdAt: new Date(),
      });

      toast({
        title: 'Account Created!',
        description: "Let's continue building your profile.",
      });

      setIsSubmitted(true);
      // We can redirect to the next step of the profile builder here
      // For now, we'll just show a success message.
      // router.push('/onboarding/step-2');
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

  if (isSubmitted) {
    return (
      <div className="py-12 md:py-20">
        <div className="container mx-auto max-w-xl px-4 md:px-6">
          <Card className="p-8 text-center md:p-12">
            <PartyPopper className="mx-auto h-16 w-16 text-accent" />
            <h2 className="font-headline mt-4 text-3xl">Welcome!</h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Your account has been created. The next steps will guide you
              through building your profile to find the best matches.
            </p>
            <Button
              className="mt-6"
              onClick={() => router.push('/admin')}
            >
              Continue to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-xl">
          <div className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold md:text-5xl">
              Join Our Community
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Let's get started. A complete profile gets seen more.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Step 1: Create Your Account
              </CardTitle>
              <CardDescription>
                First, let us know who you are and why you're here.
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
          </Card>
        </div>
      </div>
    </div>
  );
}
