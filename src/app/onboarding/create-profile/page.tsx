
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - 18 - i);
const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));


const personalInfoSchema = z.object({
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select your gender.',
  }),
  dob_day: z.string({ required_error: 'Day is required.' }),
  dob_month: z.string({ required_error: 'Month is required.' }),
  dob_year: z.string({ required_error: 'Year is required.' }),
  height_ft: z.coerce.number().int().min(3, "Invalid feet value").max(7, "Invalid feet value"),
  height_in: z.coerce.number().int().min(0, "Invalid inches value").max(11, "Invalid inches value"),
  nationality: z.string().optional(),
  currentLocation: z.string().min(2, 'Please enter a valid location.'),
  permanentAddress: z.string().optional(),
  caste: z.string().optional(),
  religion: z.string().optional(),
  complexion: z.string().optional(),
  dietaryHabits: z.string().optional(),
  smokingHabits: z.string().optional(),
  drinkingHabits: z.string().optional(),
}).refine(data => {
    const { dob_year, dob_month, dob_day } = data;
    const date = new Date(`${dob_year}-${dob_month}-${dob_day}`);
    return date.getDate() === parseInt(dob_day, 10);
}, {
    message: "The selected date is invalid.",
    path: ["dob_day"],
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export default function CreateProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      currentLocation: '',
      permanentAddress: '',
      nationality: '',
      caste: '',
      religion: '',
      complexion: '',
      dietaryHabits: '',
      smokingHabits: '',
      drinkingHabits: '',
      height_ft: undefined,
      height_in: undefined,
    },
  });

  async function onSubmit(values: PersonalInfoFormValues) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to create a profile.',
      });
      return;
    }
    
    const { dob_day, dob_month, dob_year, height_ft, height_in, ...restOfValues } = values;
    const dob = new Date(`${dob_year}-${dob_month}-${dob_day}`).toISOString();
    const height = { feet: height_ft, inches: height_in };

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        ...restOfValues,
        dob,
        height,
        profileStatus: 'in-progress-personal',
      });

      toast({
        title: 'Personal Info Saved!',
        description: "Let's move to the next step.",
      });
      router.push('/onboarding/education');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save your personal information.',
      });
    }
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="font-headline text-3xl font-bold md:text-4xl">
              Build Your Profile
            </h1>
            <p className="mt-2 text-muted-foreground">
              Let's start with the basics. This information helps us find you
              better matches.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Step 1: Personal Information
              </CardTitle>
              <CardDescription>
                Tell us a little more about yourself.
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
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="male" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Male
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="female" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Female
                              </FormLabel>
                            </FormItem>
                             <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="other" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Other
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                     <FormLabel>Date of birth</FormLabel>
                    <div className="mt-2 grid grid-cols-3 gap-4">
                       <FormField
                        control={form.control}
                        name="dob_day"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Day" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {days.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="dob_month"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {months.map(month => <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                             <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dob_year"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Year" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {years.map(year => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <FormLabel>Height</FormLabel>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="height_ft"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" placeholder="Feet" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="height_in"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" placeholder="Inches" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Nepali" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <FormField
                    control={form.control}
                    name="currentLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Kathmandu, Nepal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                      control={form.control}
                      name="permanentAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Permanent Address (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Pokhara, Nepal" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="caste"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Caste (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Brahmin" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="religion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Religion (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Hindu" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                      control={form.control}
                      name="complexion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complexion (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Fair, Wheatish" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="dietaryHabits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dietary Habits (Optional)</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="vegetarian">Vegetarian</SelectItem>
                              <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                              <SelectItem value="eggetarian">Eggetarian</SelectItem>
                              <SelectItem value="vegan">Vegan</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                   <div className="grid grid-cols-2 gap-4">
                     <FormField
                      control={form.control}
                      name="smokingHabits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Smoking Habits (Optional)</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="occasionally">Occasionally</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="drinkingHabits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Drinking Habits (Optional)</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                               <SelectItem value="no">No</SelectItem>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="occasionally">Occasionally</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>


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
