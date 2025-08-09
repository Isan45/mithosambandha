
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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';


const PartnerPreferencesPage = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State for all form fields, including new ones from your list
    const [formState, setFormState] = useState({
        partnerAgeMin: '',
        partnerAgeMax: '',
        partnerHeightFtMin: '',
        partnerHeightInMin: '', 
        partnerHeightFtMax: '',
        partnerHeightInMax: '',
        partnerMaritalStatus: '',
        partnerReligion: '',
        partnerCaste: '',
        partnerMotherTongue: '',
        partnerEducation: '',
        partnerOccupation: '',
        partnerEmploymentStatus: '',
        partnerMinIncome: '',
        partnerWorkLocation: '',
        partnerDietaryHabits: '',
        partnerDrinkingHabits: '',
        partnerSmokingHabits: '',
        partnerReligiousBeliefs: '',
        partnerAstrology: '',
        partnerFamilyType: '',
        partnerRelocate: '',
        partnerLocation: '',
        partnerPersonality: '',
        partnerHobbies: '',
        partnerWantsKids: '',
        partnerMarriageTimeline: '',
        additionalPreferences: '',
    });
    
    // State for validation errors
    const [errors, setErrors] = useState({});

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
                    partnerMaritalStatus: pp.maritalStatus || '',
                    partnerReligion: pp.religion || '',
                    partnerCaste: pp.caste || '',
                    partnerMotherTongue: pp.motherTongue || '',
                    partnerEducation: pp.education || '',
                    partnerOccupation: pp.occupation || '',
                    partnerEmploymentStatus: pp.employmentStatus || '',
                    partnerMinIncome: pp.minIncome || '',
                    partnerWorkLocation: pp.workLocation || '',
                    partnerDietaryHabits: pp.dietaryHabits || '',
                    partnerDrinkingHabits: pp.drinkingHabits || '',
                    partnerSmokingHabits: pp.smokingHabits || '',
                    partnerReligiousBeliefs: pp.religiousBeliefs || '',
                    partnerAstrology: pp.astrology || '',
                    partnerFamilyType: pp.familyType || '',
                    partnerRelocate: pp.relocate || '',
                    partnerLocation: pp.location || '',
                    partnerPersonality: pp.personality || '',
                    partnerHobbies: pp.hobbies || '',
                    partnerWantsKids: pp.wantsKids || '',
                    partnerMarriageTimeline: pp.marriageTimeline || '',
                    additionalPreferences: pp.additionalPreferences || '',
                });
            }
        }
        if (user) {
          fetchPreferences();
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        const ageMin = parseInt(formState.partnerAgeMin, 10);
        const ageMax = parseInt(formState.partnerAgeMax, 10);
        if ((formState.partnerAgeMin && formState.partnerAgeMax) && ageMin > ageMax) {
            newErrors.partnerAge = 'Minimum age cannot be greater than maximum age.';
        }

        const heightMinFt = parseInt(formState.partnerHeightFtMin, 10);
        const heightMinIn = parseInt(formState.partnerHeightInMin, 10);
        const heightMaxFt = parseInt(formState.partnerHeightFtMax, 10);
        const heightMaxIn = parseInt(formState.partnerHeightInMax, 10);

        if (heightMinFt && heightMaxFt && (heightMinFt > heightMaxFt || (heightMinFt === heightMaxFt && heightMinIn > heightMaxIn))) {
            newErrors.partnerHeight = 'Minimum height cannot be greater than maximum height.';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async (e) => {
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
              maxIn: formState.partnerHeightInMax !== '' ? parseInt(formState.partnerHeightInMax, 10) : null,
            },
            maritalStatus: formState.partnerMaritalStatus,
            religion: formState.partnerReligion,
            caste: formState.partnerCaste,
            motherTongue: formState.partnerMotherTongue,
            education: formState.partnerEducation,
            occupation: formState.partnerOccupation,
            employmentStatus: formState.partnerEmploymentStatus,
            minIncome: formState.partnerMinIncome,
            workLocation: formState.partnerWorkLocation,
            dietaryHabits: formState.partnerDietaryHabits,
            drinkingHabits: formState.partnerDrinkingHabits,
            smokingHabits: formState.partnerSmokingHabits,
            religiousBeliefs: formState.partnerReligiousBeliefs,
            astrology: formState.partnerAstrology,
            familyType: formState.partnerFamilyType,
            relocate: formState.partnerRelocate,
            location: formState.partnerLocation,
            personality: formState.partnerPersonality,
            hobbies: formState.partnerHobbies,
            wantsKids: formState.partnerWantsKids,
            marriageTimeline: formState.partnerMarriageTimeline,
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
                                {/* Basic Profile Preferences */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">1. Basic Profile Preferences</h3>
                                    <div className="space-y-4">
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
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                                                <Label className="text-sm text-muted-foreground col-span-2">Minimum Height</Label>
                                                <Input type="number" name="partnerHeightFtMin" placeholder="Feet" value={formState.partnerHeightFtMin} onChange={handleChange} />
                                                <Input type="number" name="partnerHeightInMin" placeholder="Inches" value={formState.partnerHeightInMin} onChange={handleChange} />
                                                <Label className="text-sm text-muted-foreground col-span-2">Maximum Height</Label>
                                                <Input type="number" name="partnerHeightFtMax" placeholder="Feet" value={formState.partnerHeightFtMax} onChange={handleChange} />
                                                <Input type="number" name="partnerHeightInMax" placeholder="Inches" value={formState.partnerHeightInMax} onChange={handleChange} />
                                            </div>
                                            {errors.partnerHeight && <p className="mt-1 text-sm text-destructive">{errors.partnerHeight}</p>}
                                        </div>
                                        
                                        <div>
                                            <Label>Marital Status</Label>
                                            <Select
                                                name="partnerMaritalStatus"
                                                value={formState.partnerMaritalStatus}
                                                onValueChange={(value) => handleSelectChange('partnerMaritalStatus', value)}
                                            >
                                                <SelectTrigger><SelectValue placeholder="Select Marital Status" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="any">Any</SelectItem>
                                                    <SelectItem value="never-married">Never Married</SelectItem>
                                                    <SelectItem value="divorced">Divorced</SelectItem>
                                                    <SelectItem value="widowed">Widowed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div>
                                            <Label>Religion</Label>
                                            <Input name="partnerReligion" placeholder="e.g. Hindu" value={formState.partnerReligion} onChange={handleChange}/>
                                        </div>
                                        
                                        <div>
                                            <Label>Caste / Ethnicity (Optional)</Label>
                                            <Input name="partnerCaste" placeholder="e.g. Brahmin" value={formState.partnerCaste} onChange={handleChange}/>
                                        </div>
                                        
                                        <div>
                                            <Label>Mother Tongue</Label>
                                            <Input name="partnerMotherTongue" placeholder="e.g. Nepali" value={formState.partnerMotherTongue} onChange={handleChange}/>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Education & Career */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">2. Education & Career</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Minimum Education Level</Label>
                                            <Select
                                                name="partnerEducation"
                                                value={formState.partnerEducation}
                                                onValueChange={(value) => handleSelectChange('partnerEducation', value)}
                                            >
                                                <SelectTrigger><SelectValue placeholder="Select Education Level" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="any">Any</SelectItem>
                                                    <SelectItem value="high-school">High School</SelectItem>
                                                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                                                    <SelectItem value="masters">Master's Degree</SelectItem>
                                                    <SelectItem value="phd">PhD</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div>
                                            <Label>Employment Status</Label>
                                            <Select
                                                name="partnerEmploymentStatus"
                                                value={formState.partnerEmploymentStatus}
                                                onValueChange={(value) => handleSelectChange('partnerEmploymentStatus', value)}
                                            >
                                                <SelectTrigger><SelectValue placeholder="Select Employment Status" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="any">Any</SelectItem>
                                                    <SelectItem value="employed">Employed</SelectItem>
                                                    <SelectItem value="self-employed">Self-employed</SelectItem>
                                                    <SelectItem value="student">Student</SelectItem>
                                                    <SelectItem value="not-working">Not Working</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Preferred Profession</Label>
                                            <Input name="partnerOccupation" placeholder="e.g. Software Engineer" value={formState.partnerOccupation} onChange={handleChange}/>
                                        </div>
                                        
                                        <div>
                                            <Label>Minimum Annual Income (NPR)</Label>
                                            <Select
                                                name="partnerMinIncome"
                                                value={formState.partnerMinIncome}
                                                onValueChange={(value) => handleSelectChange('partnerMinIncome', value)}
                                            >
                                                <SelectTrigger><SelectValue placeholder="Select Annual Income" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="any">Any</SelectItem>
                                                    <SelectItem value="<2L">Less than 2 Lakhs</SelectItem>
                                                    <SelectItem value="2L-5L">2 - 5 Lakhs</SelectItem>
                                                    <SelectItem value="5L-10L">5 - 10 Lakhs</SelectItem>
                                                    <SelectItem value=">10L">More than 10 Lakhs</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div>
                                            <Label>Work Location Preference</Label>
                                            <Input name="partnerWorkLocation" placeholder="e.g. Domestic, UAE" value={formState.partnerWorkLocation} onChange={handleChange}/>
                                        </div>
                                    </div>
                                </div>
                                
                                <Separator />

                                {/* Lifestyle & Values */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">3. Lifestyle & Values</h3>
                                    <div className="space-y-4">
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
                                            <Label>Drinking Habits</Label>
                                            <Select name="partnerDrinkingHabits" value={formState.partnerDrinkingHabits} onValueChange={(value) => handleSelectChange('partnerDrinkingHabits', value)}>
                                                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="any">Any</SelectItem>
                                                    <SelectItem value="no">No</SelectItem>
                                                    <SelectItem value="occasionally">Occasionally</SelectItem>
                                                    <SelectItem value="regularly">Regularly</SelectItem>
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
                                                    <SelectItem value="regularly">Regularly</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div>
                                            <Label>Religious Beliefs</Label>
                                            <Select
                                                name="partnerReligiousBeliefs"
                                                value={formState.partnerReligiousBeliefs}
                                                onValueChange={(value) => handleSelectChange('partnerReligiousBeliefs', value)}
                                            >
                                                <SelectTrigger><SelectValue placeholder="Select Religious Beliefs" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="any">Any</SelectItem>
                                                    <SelectItem value="strictly-religious">Strictly Religious</SelectItem>
                                                    <SelectItem value="moderately-religious">Moderately Religious</SelectItem>
                                                    <SelectItem value="not-religious">Not Religious</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div>
                                            <Label>Astrological Preference</Label>
                                            <Input name="partnerAstrology" placeholder="e.g. No Mangal Dosh" value={formState.partnerAstrology} onChange={handleChange}/>
                                        </div>
                                    </div>
                                </div>
                                
                                <Separator />

                                {/* Family & Social Background */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">4. Family & Social Background</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Family Type Preference</Label>
                                            <RadioGroup name="partnerFamilyType" value={formState.partnerFamilyType} onValueChange={(value) => handleSelectChange('partnerFamilyType', value)} className="mt-2">
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="joint" id="r-fam-joint" /><Label htmlFor="r-fam-joint">Joint</Label></div>
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="nuclear" id="r-fam-nuclear" /><Label htmlFor="r-fam-nuclear">Nuclear</Label></div>
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="either" id="r-fam-either" /><Label htmlFor="r-fam-either">Either</Label></div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                {/* Location & Migration */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">5. Location & Migration</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Preferred Location</Label>
                                            <Input name="partnerLocation" placeholder="e.g. Kathmandu, Nepal" value={formState.partnerLocation} onChange={handleChange}/>
                                        </div>
                                        
                                        <div>
                                            <Label>Willingness to Relocate</Label>
                                            <RadioGroup name="partnerRelocate" value={formState.partnerRelocate} onValueChange={(value) => handleSelectChange('partnerRelocate', value)} className="mt-2">
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="r-relocate-yes" /><Label htmlFor="r-relocate-yes">Yes</Label></div>
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="r-relocate-no" /><Label htmlFor="r-relocate-no">No</Label></div>
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="maybe" id="r-relocate-maybe" /><Label htmlFor="r-relocate-maybe">Maybe</Label></div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                {/* Personality & Hobbies */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">6. Personality & Hobbies</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Preferred Personality Traits</Label>
                                            <Input name="partnerPersonality" placeholder="e.g. Fun-loving, Spiritual" value={formState.partnerPersonality} onChange={handleChange}/>
                                        </div>
                                        
                                        <div>
                                            <Label>Shared Interests / Hobbies</Label>
                                            <Input name="partnerHobbies" placeholder="e.g. Travel, Cooking" value={formState.partnerHobbies} onChange={handleChange}/>
                                        </div>
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                {/* Dealbreakers / Must-Haves */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">7. Dealbreakers / Must-Haves</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Important Life Goals</Label>
                                            <RadioGroup name="partnerWantsKids" value={formState.partnerWantsKids} onValueChange={(value) => handleSelectChange('partnerWantsKids', value)} className="mt-2">
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="r-kids-yes" /><Label htmlFor="r-kids-yes">Wants kids</Label></div>
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="r-kids-no" /><Label htmlFor="r-kids-no">Does not want kids</Label></div>
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="undecided" id="r-kids-undecided" /><Label htmlFor="r-kids-undecided">Undecided</Label></div>
                                            </RadioGroup>
                                        </div>
                                        
                                        <div>
                                            <Label>Marriage Timeline</Label>
                                            <Input name="partnerMarriageTimeline" placeholder="e.g. Within 1 year" value={formState.partnerMarriageTimeline} onChange={handleChange}/>
                                        </div>
                                    </div>
                                </div>
                                <Separator />

                                {/* Additional Preferences */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">8. Additional Preferences</h3>
                                     <div>
                                        <Label>Anything else?</Label>
                                        <Textarea name="additionalPreferences" value={formState.additionalPreferences} onChange={handleChange} placeholder="Please describe any other preferences you have for your partner. This will be shown to the admin to help find a better match."/>
                                    </div>
                                </div>
                                
                                <Button type="submit" size="lg" className="w-full mt-8" disabled={isSubmitting}>
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
