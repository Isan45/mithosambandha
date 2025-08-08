
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

const step1Schema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters.' }),
  onboardingReason: z.enum(
    ['life-partner', 'for-someone-else', 'browsing'],
    { required_error: 'Please select a reason for joining.' }
  ),
});

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      fullName: '',
    },
  });

  async function onSubmit(values: z.infer<typeof step1Schema>) {
    console.log(values);
    // Here you would save the initial data and navigate to the next step
    toast({
      title: 'Step 1 Complete!',
      description: 'Let\'s continue building your profile.',
    });
    setStep(2); // For now, we'll just move to a placeholder "next step"
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
                Step 1: Welcome!
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
                      'Saving...'
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

          {/* This is a placeholder for subsequent steps */}
          {step > 1 && (
            <div className="mt-8 text-center text-muted-foreground">
              <p>Next steps would appear here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
