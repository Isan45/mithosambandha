
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';


const PartnerPreferencesPage = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for all form fields, initialized with empty strings
    const [formState, setFormState] = useState({
        partnerAgeMin: '',
        partnerAgeMax: '',
        partnerHeightFtMin: '',
        partnerHeightInMin: '',
        partnerHeightFtMax: '',
        partnerHeightInMax: '',
        partnerWantsKids: '',
        partnerRelocate: '',
        partnerEarning: '',
        partnerFamilyType: '',
        partnerEducation: '',
        partnerOccupation: '',
        partnerReligion: '',
        partnerCaste: '',
        partnerDietaryHabits: '',
        partnerSmokingHabits: '',
        partnerDrinkingHabits: '',
        partnerCurrentLocation: '',
        additionalPreferences: '',
    });
    
    // State for validation errors
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        async function fetchPreferences() {
            if (!user) return;
            const userDocRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists() && docSnap.data().profile?.partnerPreferences) {
                const pp = docSnap.data().profile.partnerPreferences;
                setFormState({
                    partnerAgeMin: pp.age?.min?.toString() || '',
                    partnerAgeMax: pp.age?.max?.toString() || '',
                    partnerHeightFtMin: pp.height?.minFt?.toString() || '',
                    partnerHeightInMin: pp.height?.minIn?.toString() || '',
                    partnerHeightFtMax: pp.height?.maxFt?.toString() || '',
                    partnerHeightInMax: pp.height?.maxIn?.toString() || '',
                    partnerWantsKids: pp.wantsKids || '',
                    partnerRelocate: pp.relocate || '',
                    partnerEarning: pp.earning || '',
                    partnerFamilyType: pp.familyType || '',
                    partnerEducation: pp.education || '',
                    partnerOccupation: pp.occupation || '',
                    partnerReligion: pp.religion || '',
                    partnerCaste: pp.caste || '',
                    partnerDietaryHabits: pp.dietaryHabits || '',
                    partnerSmokingHabits: pp.smokingHabits || '',
                    partnerDrinkingHabits: pp.drinkingHabits || '',
                    partnerCurrentLocation: pp.currentLocation || '',
                    additionalPreferences: pp.additionalPreferences || '',
                });
            }
        }
        fetchPreferences();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        const ageMin = parseInt(formState.partnerAgeMin, 10);
        const ageMax = parseInt(formState.partnerAgeMax, 10);
        if ((formState.partnerAgeMin && formState.partnerAgeMax) && ageMin > ageMax) {
            newErrors.partnerAge = 'Minimum age cannot be greater than maximum age.';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fix the form errors.' });
            return;
        }
        
        if (!user) {
            toast({ variant: 'destructive', title: 'Not Authenticated', description: 'You must be logged in to update your profile.' });
            return;
        }

        setIsSubmitting(true);
        
        const partnerPreferences = {
            age: {
              min: formState.partnerAgeMin !== '' ? parseInt(formState.partnerAgeMin, 10) : null,
              max: formState.partnerAgeMax !== '' ? parseInt(formState.partnerAgeMax, 10) : null
            },
            height: {
              minFt: formState.partnerHeightFtMin !== '' ? parseInt(formState.partnerHeightFtMin, 10) : null,
              minIn: formState.partnerHeightInMin !== '' ? parseInt(formState.partnerHeightInMin, 10) : null,
              maxFt: formState.partnerHeightFtMax !== '' ? parseInt(formState.partnerHeightFtMax, 10) : null,
              maxIn: formState.partnerHeightInMax !== '' ? parseInt(formState.partnerHeightInMax, 10) : null
            },
            wantsKids: formState.partnerWantsKids,
            relocate: formState.partnerRelocate,
            earning: formState.partnerEarning,
            familyType: formState.partnerFamilyType,
            education: formState.partnerEducation,
            occupation: formState.partnerOccupation,
            religion: formState.partnerReligion,
            caste: formState.partnerCaste,
            dietaryHabits: formState.partnerDietaryHabits,
            smokingHabits: formState.partnerSmokingHabits,
            drinkingHabits: formState.partnerDrinkingHabits,
            currentLocation: formState.partnerCurrentLocation,
            additionalPreferences: formState.additionalPreferences,
        };
        
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                'profile.partnerPreferences': partnerPreferences,
                profileStatus: 'in-progress-photos',
            }, { merge: true });

            toast({
                title: 'Preferences Saved!',
                description: "Now, let's add some photos.",
            });
            router.push('/onboarding/photos');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to save your preferences.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mx-auto max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">Step 4: Your Partner Preferences</CardTitle>
                            <CardDescription>
                                Help us understand what you're looking for in a life partner. The more details you provide, the better the matches.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={onSubmit} className="space-y-8">
                                <div>
                                    <Label>Age Range</Label>
                                    <div className="mt-2 grid grid-cols-2 gap-4">
                                        <Input type="number" name="partnerAgeMin" placeholder="Min Age" value={formState.partnerAgeMin} onChange={handleChange} />
                                        <Input type="number" name="partnerAgeMax" placeholder="Max Age" value={formState.partnerAgeMax} onChange={handleChange} />
                                    </div>
                                    {errors.partnerAge && <p className="mt-1 text-sm text-destructive">{errors.partnerAge}</p>}
                                </div>

                                <div>
                                    <Label>Height Range</Label>
                                    <div className="mt-2 grid grid-cols-2 gap-4">
                                        <Input type="number" name="partnerHeightFtMin" placeholder="Min Feet" value={formState.partnerHeightFtMin} onChange={handleChange} />
                                        <Input type="number" name="partnerHeightInMin" placeholder="Min Inches" value={formState.partnerHeightInMin} onChange={handleChange} />
                                    </div>
                                    <div className="mt-2 grid grid-cols-2 gap-4">
                                        <Input type="number" name="partnerHeightFtMax" placeholder="Max Feet" value={formState.partnerHeightFtMax} onChange={handleChange} />
                                        <Input type="number" name="partnerHeightInMax" placeholder="Max Inches" value={formState.partnerHeightInMax} onChange={handleChange} />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <Label>Willingness to Relocate</Label>
                                        <RadioGroup name="partnerRelocate" value={formState.partnerRelocate} onValueChange={(value) => handleSelectChange('partnerRelocate', value)} className="mt-2">
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="r-relocate-yes" /><Label htmlFor="r-relocate-yes">Yes</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="r-relocate-no" /><Label htmlFor="r-relocate-no">No</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="discuss" id="r-relocate-discuss" /><Label htmlFor="r-relocate-discuss">Open to Discuss</Label></div>
                                        </RadioGroup>
                                    </div>
                                    <div>
                                        <Label>Wants Kids</Label>
                                        <RadioGroup name="partnerWantsKids" value={formState.partnerWantsKids} onValueChange={(value) => handleSelectChange('partnerWantsKids', value)} className="mt-2">
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="r-kids-yes" /><Label htmlFor="r-kids-yes">Yes</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="r-kids-no" /><Label htmlFor="r-kids-no">No</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="undecided" id="r-kids-undecided" /><Label htmlFor="r-kids-undecided">Undecided</Label></div>
                                        </RadioGroup>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <Label>Family Type</Label>
                                         <RadioGroup name="partnerFamilyType" value={formState.partnerFamilyType} onValueChange={(value) => handleSelectChange('partnerFamilyType', value)} className="mt-2">
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="joint" id="r-fam-joint" /><Label htmlFor="r-fam-joint">Joint</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="nuclear" id="r-fam-nuclear" /><Label htmlFor="r-fam-nuclear">Nuclear</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="any" id="r-fam-any" /><Label htmlFor="r-fam-any">Any</Label></div>
                                        </RadioGroup>
                                    </div>
                                    <div>
                                        <Label>Annual Earning (Optional)</Label>
                                        <Select
                                          name="partnerEarning"
                                          value={formState.partnerEarning}
                                          onValueChange={(value) => handleSelectChange('partnerEarning', value)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select an income range" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="any">Any</SelectItem>
                                            <SelectItem value="<2L">Less than 2 lakhs</SelectItem>
                                            <SelectItem value="2L-3L">2 lakhs - 3 lakhs</SelectItem>
                                            <SelectItem value="3L-4L">3 lakhs - 4 lakhs</SelectItem>
                                            <SelectItem value="4L-5L">4 lakhs - 5 lakhs</SelectItem>
                                            <SelectItem value=">5L">More than 5 lakhs</SelectItem>
                                          </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Education Level (Optional)</Label>
                                        <Input name="partnerEducation" placeholder="e.g. Bachelor's Degree" value={formState.partnerEducation} onChange={handleChange}/>
                                    </div>
                                    <div>
                                        <Label>Occupation Field (Optional)</Label>
                                        <Input name="partnerOccupation" placeholder="e.g. Healthcare, IT" value={formState.partnerOccupation} onChange={handleChange}/>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Religion (Optional)</Label>
                                        <Input name="partnerReligion" placeholder="e.g. Hindu" value={formState.partnerReligion} onChange={handleChange}/>
                                    </div>
                                    <div>
                                        <Label>Caste (Optional)</Label>
                                        <Input name="partnerCaste" placeholder="e.g. Brahmin" value={formState.partnerCaste} onChange={handleChange}/>
                                    </div>
                                </div>

                                <div>
                                    <Label>Preferred Location (Optional)</Label>
                                    <Input name="partnerCurrentLocation" placeholder="e.g. Kathmandu, Nepal" value={formState.partnerCurrentLocation} onChange={handleChange}/>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label>Dietary Habits</Label>
                                        <Select name="partnerDietaryHabits" value={formState.partnerDietaryHabits} onValueChange={(value) => handleSelectChange('partnerDietaryHabits', value)}>
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="any">Any</SelectItem>
                                                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                                <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                                                <SelectItem value="eggetarian">Eggetarian</SelectItem>
                                                <SelectItem value="vegan">Vegan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Smoking Habits</Label>
                                        <Select name="partnerSmokingHabits" value={formState.partnerSmokingHabits} onValueChange={(value) => handleSelectChange('partnerSmokingHabits', value)}>
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="any">Any</SelectItem>
                                                <SelectItem value="no">No</SelectItem>
                                                <SelectItem value="occasionally">Occasionally</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Drinking Habits</Label>
                                        <Select name="partnerDrinkingHabits" value={formState.partnerDrinkingHabits} onValueChange={(value) => handleSelectChange('partnerDrinkingHabits', value)}>
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="any">Any</SelectItem>
                                                <SelectItem value="no">No</SelectItem>
                                                <SelectItem value="occasionally">Occasionally</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label>Anything Else? (Optional)</Label>
                                    <Textarea
                                        name="additionalPreferences"
                                        placeholder="Describe any other important qualities, values, or deal-breakers."
                                        className="min-h-[100px]"
                                        value={formState.additionalPreferences}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
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

export default PartnerPreferencesPage;

    