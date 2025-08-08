
'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc } from 'firebase/firestore';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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


export default function CreateProfilePage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for all form fields, initialized with empty strings
    const [formState, setFormState] = useState({
        gender: '',
        dob_day: '',
        dob_month: '',
        dob_year: '',
        height_ft: '',
        height_in: '',
        phoneNumber: '',
        nationality: '',
        currentLocation: '',
        permanentAddress: '',
        caste: '',
        religion: '',
        complexion: '',
        dietaryHabits: '',
        smokingHabits: '',
        drinkingHabits: '',
    });

    const [errors, setErrors] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors: any = {};
        if (!formState.gender) newErrors.gender = 'Please select your gender.';
        if (!formState.dob_day || !formState.dob_month || !formState.dob_year) {
          newErrors.dob = 'Date of birth is required.';
        } else {
          const date = new Date(`${formState.dob_year}-${formState.dob_month}-${formState.dob_day}`);
          if (date.getDate() !== parseInt(formState.dob_day, 10)) {
            newErrors.dob = 'The selected date is invalid.';
          }
        }
        if (!formState.currentLocation) newErrors.currentLocation = 'Please enter a valid location.';
    
        const feet = parseInt(formState.height_ft, 10);
        const inches = parseInt(formState.height_in, 10);
    
        if (formState.height_ft && (isNaN(feet) || feet < 3 || feet > 7)) {
            newErrors.height_ft = "Invalid feet value (3-7)";
        }
        if (formState.height_in && (isNaN(inches) || inches < 0 || inches > 11)) {
            newErrors.height_in = "Invalid inches value (0-11)";
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validateForm()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fix the errors before continuing.' });
            return;
        }

        if (!user) {
            toast({
                variant: 'destructive',
                title: 'Not Authenticated',
                description: 'You must be logged in to create a profile.',
            });
            return;
        }
        
        setIsSubmitting(true);
        const dob = new Date(`${formState.dob_year}-${formState.dob_month}-${formState.dob_day}`).toISOString();
        const height = formState.height_ft || formState.height_in ? { feet: parseInt(formState.height_ft) || 0, inches: parseInt(formState.height_in) || 0 } : null;
        
        const profileData = { ...formState, dob, height };
        // remove dob parts from profile data
        delete (profileData as any).dob_day;
        delete (profileData as any).dob_month;
        delete (profileData as any).dob_year;
        delete (profileData as any).height_ft;
        delete (profileData as any).height_in;


        try {
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                profile: profileData,
                profileStatus: 'in-progress-personal',
            }, { merge: true });

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
        } finally {
            setIsSubmitting(false);
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
                            <form
                                onSubmit={onSubmit}
                                className="space-y-8"
                            >
                                <div>
                                    <Label>Gender</Label>
                                    <RadioGroup
                                        name="gender"
                                        value={formState.gender}
                                        onValueChange={(value) => handleSelectChange('gender', value)}
                                        className="flex flex-col space-y-1 mt-2"
                                    >
                                        <div className="flex items-center space-x-3 space-y-0">
                                            <RadioGroupItem value="male" />
                                            <Label className="font-normal">Male</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 space-y-0">
                                            <RadioGroupItem value="female" />
                                            <Label className="font-normal">Female</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 space-y-0">
                                            <RadioGroupItem value="other" />
                                            <Label className="font-normal">Other</Label>
                                        </div>
                                    </RadioGroup>
                                    {errors.gender && <p className="mt-1 text-sm text-destructive">{errors.gender}</p>}
                                </div>

                                <div>
                                    <Label>Date of birth</Label>
                                    <div className="mt-2 grid grid-cols-3 gap-4">
                                        <Select name="dob_day" value={formState.dob_day} onValueChange={(value) => handleSelectChange('dob_day', value)}>
                                            <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
                                            <SelectContent>
                                                {days.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <Select name="dob_month" value={formState.dob_month} onValueChange={(value) => handleSelectChange('dob_month', value)}>
                                            <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                                            <SelectContent>
                                                {months.map(month => <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <Select name="dob_year" value={formState.dob_year} onValueChange={(value) => handleSelectChange('dob_year', value)}>
                                            <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                                            <SelectContent>
                                                {years.map(year => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {errors.dob && <p className="mt-1 text-sm text-destructive">{errors.dob}</p>}
                                </div>

                                <div>
                                    <Label>Height</Label>
                                    <div className="mt-2 grid grid-cols-2 gap-4">
                                        <div>
                                            <Input type="number" name="height_ft" placeholder="Feet" value={formState.height_ft} onChange={handleChange} />
                                            {errors.height_ft && <p className="mt-1 text-sm text-destructive">{errors.height_ft}</p>}
                                        </div>
                                        <div>
                                            <Input type="number" name="height_in" placeholder="Inches" value={formState.height_in} onChange={handleChange} />
                                            {errors.height_in && <p className="mt-1 text-sm text-destructive">{errors.height_in}</p>}
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <Label>Phone Number (Optional)</Label>
                                    <Input type="tel" name="phoneNumber" placeholder="e.g. +1 123 456 7890" value={formState.phoneNumber} onChange={handleChange} />
                                </div>

                                <div>
                                    <Label>Nationality (Optional)</Label>
                                    <Input name="nationality" placeholder="e.g. Nepali" value={formState.nationality} onChange={handleChange} />
                                </div>

                                <div>
                                    <Label>Current Location</Label>
                                    <Input name="currentLocation" placeholder="e.g. Kathmandu, Nepal" value={formState.currentLocation} onChange={handleChange} />
                                    {errors.currentLocation && <p className="mt-1 text-sm text-destructive">{errors.currentLocation}</p>}
                                </div>

                                <div>
                                    <Label>Permanent Address (Optional)</Label>
                                    <Input name="permanentAddress" placeholder="e.g. Pokhara, Nepal" value={formState.permanentAddress} onChange={handleChange} />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Caste (Optional)</Label>
                                        <Input name="caste" placeholder="e.g. Brahmin" value={formState.caste} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label>Religion (Optional)</Label>
                                        <Input name="religion" placeholder="e.g. Hindu" value={formState.religion} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Complexion (Optional)</Label>
                                        <Input name="complexion" placeholder="e.g. Fair, Wheatish" value={formState.complexion} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label>Dietary Habits (Optional)</Label>
                                        <Select name="dietaryHabits" value={formState.dietaryHabits} onValueChange={(value) => handleSelectChange('dietaryHabits', value)}>
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                                <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                                                <SelectItem value="eggetarian">Eggetarian</SelectItem>
                                                <SelectItem value="vegan">Vegan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Smoking Habits (Optional)</Label>
                                        <Select name="smokingHabits" value={formState.smokingHabits} onValueChange={(value) => handleSelectChange('smokingHabits', value)}>
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="no">No</SelectItem>
                                                <SelectItem value="yes">Yes</SelectItem>
                                                <SelectItem value="occasionally">Occasionally</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Drinking Habits (Optional)</Label>
                                        <Select name="drinkingHabits" value={formState.drinkingHabits} onValueChange={(value) => handleSelectChange('drinkingHabits', value)}>
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="no">No</SelectItem>
                                                <SelectItem value="yes">Yes</SelectItem>
                                                <SelectItem value="occasionally">Occasionally</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save & Continue'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
