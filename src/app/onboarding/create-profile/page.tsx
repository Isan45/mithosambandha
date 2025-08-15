
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { doc, setDoc, getDoc } from 'firebase/firestore';
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
import { Textarea } from '@/components/ui/textarea';
import { generateBio } from '@/ai/flows/generate-bio';
import { Wand2, Loader2, User, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
    const [isGeneratingBio, setIsGeneratingBio] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [formState, setFormState] = useState({
        fullName: '',
        email: '',
        gender: '',
        dob_day: '',
        dob_month: '',
        dob_year: '',
        height_ft: '',
        height_in: '',
        bodyType: '',
        maritalStatus: '',
        motherTongue: '',
        familyType: '',
        familyValues: '',
        canRelocate: '',
        wantsKids: '',
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
        bio: '',
    });

    useEffect(() => {
      async function fetchProfileData() {
        if (!user) return;
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            
            const profile = data.profile || {};
            const dob = profile.dob ? new Date(profile.dob) : null;

            setFormState(prev => ({
              ...prev,
              fullName: data.fullName || '',
              email: data.email || '',
              gender: profile.gender || '',
              dob_day: dob ? String(dob.getUTCDate()).padStart(2, '0') : '',
              dob_month: dob ? String(dob.getUTCMonth() + 1).padStart(2, '0') : '',
              dob_year: dob ? String(dob.getUTCFullYear()) : '',
              height_ft: profile.height?.feet?.toString() || '',
              height_in: profile.height?.inches?.toString() || '',
              bodyType: profile.bodyType || '',
              maritalStatus: profile.maritalStatus || '',
              motherTongue: profile.motherTongue || '',
              familyType: profile.familyType || '',
              familyValues: profile.familyValues || '',
              canRelocate: profile.canRelocate || '',
              wantsKids: profile.wantsKids || '',
              phoneNumber: profile.phoneNumber || '',
              nationality: profile.nationality || '',
              currentLocation: profile.currentLocation || '',
              permanentAddress: profile.permanentAddress || '',
              caste: profile.caste || '',
              religion: profile.religion || '',
              complexion: profile.complexion || '',
              dietaryHabits: profile.dietaryHabits || '',
              smokingHabits: profile.smokingHabits || '',
              drinkingHabits: profile.drinkingHabits || '',
              bio: profile.bio || '',
            }));
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
          toast({ variant: 'destructive', title: 'Failed to load data', description: 'Could not fetch your saved data.' });
        } finally {
          setIsLoadingData(false);
        }
      }
      fetchProfileData();
    }, [user, toast]);


    const [errors, setErrors] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors: any = {};
        if (!formState.fullName) newErrors.fullName = "Full name is required.";
        if (!formState.email || !/^\S+@\S+\.\S+$/.test(formState.email)) newErrors.email = "A valid email is required.";
        if (!formState.gender) newErrors.gender = 'Please select your gender.';
        if (!formState.dob_day || !formState.dob_month || !formState.dob_year) {
          newErrors.dob = 'Date of birth is required.';
        } else {
          const date = new Date(Date.UTC(Number(formState.dob_year), Number(formState.dob_month) - 1, Number(formState.dob_day)));
          if (isNaN(date.getTime()) || date.getUTCDate() !== parseInt(formState.dob_day, 10)) {
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
    
    const handleGenerateBio = async () => {
        setIsGeneratingBio(true);
        if (!user) {
            toast({ variant: 'destructive', title: 'Not Authenticated' });
            setIsGeneratingBio(false);
            return;
        }

        try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            const existingData = userDoc.exists() ? userDoc.data() : {};
            
            const dob = new Date(Date.UTC(Number(formState.dob_year), Number(formState.dob_month) - 1, Number(formState.dob_day)));
            const ageDiffMs = Date.now() - dob.getTime();
            const ageDate = new Date(ageDiffMs);
            const age = Math.abs(ageDate.getUTCFullYear() - 1970);

            const bioInput = {
                age,
                gender: formState.gender,
                location: formState.currentLocation,
                education: existingData.profile?.education?.highestEducation || '',
                profession: existingData.profile?.career?.profession || '',
            };
            
            const result = await generateBio(bioInput);
            setFormState(prev => ({ ...prev, bio: result.bio }));

        } catch (error) {
            console.error("Error generating bio:", error);
            toast({ variant: 'destructive', title: 'Bio Generation Failed', description: 'Could not generate a bio at this time.' });
        } finally {
            setIsGeneratingBio(false);
        }
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
        const dob = new Date(Date.UTC(Number(formState.dob_year), Number(formState.dob_month) - 1, Number(formState.dob_day))).toISOString();
        
        const height = formState.height_ft || formState.height_in ? { feet: parseInt(formState.height_ft) || 0, inches: parseInt(formState.height_in) || 0 } : null;
        
        const { fullName, email, ...profileDataFields } = formState;

        const profileData = { 
            ...profileDataFields, 
            dob, 
            height 
        };

        delete (profileData as any).dob_day;
        delete (profileData as any).dob_month;
        delete (profileData as any).dob_year;
        delete (profileData as any).height_ft;
        delete (profileData as any).height_in;


        try {
            const userDocRef = doc(db, 'users', user.uid);
            // Fetch existing doc to merge with
            const docSnap = await getDoc(userDocRef);
            const existingData = docSnap.exists() ? docSnap.data() : {};
            
            const updatedProfileData = {
                ...existingData.profile,
                ...profileData,
            };

            await setDoc(userDocRef, {
                fullName: formState.fullName,
                email: formState.email, 
                profile: updatedProfileData,
                profileStatus: existingData.profileStatus === 'incomplete' ? 'in-progress-education' : existingData.profileStatus,
            }, { merge: true });

            toast({
                title: 'Personal Info Saved!',
                description: "Let's move to the next step.",
            });
            router.push('/onboarding/education-career');
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

    if (isLoadingData) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      );
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
                                <div className="space-y-4">
                                     <h3 className="text-lg font-semibold text-primary">Account Details</h3>
                                    <div>
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input id="fullName" name="fullName" value={formState.fullName} onChange={handleChange} />
                                        {errors.fullName && <p className="mt-1 text-sm text-destructive">{errors.fullName}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" name="email" type="email" value={formState.email} onChange={handleChange} />
                                        {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
                                        <p className="text-xs text-muted-foreground mt-1">Note: Changing this does not change your login email.</p>
                                    </div>
                                </div>
                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-primary">Basic Details</h3>
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
                                        <Label>Body Type (Optional)</Label>
                                        <Select name="bodyType" value={formState.bodyType} onValueChange={(value) => handleSelectChange('bodyType', value)}>
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="slim">Slim</SelectItem>
                                                <SelectItem value="athletic">Athletic</SelectItem>
                                                <SelectItem value="average">Average</SelectItem>
                                                <SelectItem value="heavy">Heavy</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Marital Status</Label>
                                        <Select name="maritalStatus" value={formState.maritalStatus} onValueChange={(value) => handleSelectChange('maritalStatus', value)}>
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="never-married">Never Married</SelectItem>
                                                <SelectItem value="divorced">Divorced</SelectItem>
                                                <SelectItem value="widowed">Widowed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                </div>
                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-primary">Community & Location</h3>
                                    
                                    <div>
                                        <Label>Mother Tongue</Label>
                                        <Input name="motherTongue" placeholder="e.g. Nepali" value={formState.motherTongue} onChange={handleChange} />
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
                                </div>
                                <Separator />
                                
                                <div className="space-y-4">
                                     <h3 className="text-lg font-semibold text-primary">Lifestyle & Family</h3>
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
                                    
                                     <div>
                                        <Label>Family Type</Label>
                                        <Select name="familyType" value={formState.familyType} onValueChange={(value) => handleSelectChange('familyType', value)}>
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="joint">Joint</SelectItem>
                                                <SelectItem value="nuclear">Nuclear</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div>
                                        <Label>Family Values</Label>
                                        <Select name="familyValues" value={formState.familyValues} onValueChange={(value) => handleSelectChange('familyValues', value)}>
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="traditional">Traditional</SelectItem>
                                                <SelectItem value="moderate">Moderate</SelectItem>
                                                <SelectItem value="liberal">Liberal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-primary">Future Plans</h3>

                                    <div>
                                        <Label>Are you willing to relocate?</Label>
                                         <RadioGroup name="canRelocate" value={formState.canRelocate} onValueChange={(value) => handleSelectChange('canRelocate', value)} className="mt-2">
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="yes" /><Label className="font-normal">Yes</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="no" /><Label className="font-normal">No</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="maybe" /><Label className="font-normal">Maybe</Label></div>
                                        </RadioGroup>
                                    </div>
                                    
                                     <div>
                                        <Label>Do you want children?</Label>
                                        <RadioGroup name="wantsKids" value={formState.wantsKids} onValueChange={(value) => handleSelectChange('wantsKids', value)} className="mt-2">
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="yes" /><Label className="font-normal">Yes</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="no" /><Label className="font-normal">No</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="undecided" /><Label className="font-normal">Undecided</Label></div>
                                        </RadioGroup>
                                    </div>
                                </div>
                                <Separator />

                                 <div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="bio">About You / Bio</Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleGenerateBio}
                                            disabled={isGeneratingBio}
                                        >
                                            {isGeneratingBio ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Wand2 className="mr-2 h-4 w-4" />
                                            )}
                                            Generate with AI
                                        </Button>
                                    </div>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        placeholder="Tell us about yourself. You can generate a draft with AI."
                                        className="mt-2 min-h-[120px]"
                                        value={formState.bio}
                                        onChange={handleChange}
                                    />
                                    <p className="text-sm text-muted-foreground mt-2">
                                        This will be the main summary on your profile.
                                    </p>
                                </div>


                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full"
                                    disabled={isSubmitting || isLoadingData}
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

