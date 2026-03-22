
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
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function EducationCareerPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [formState, setFormState] = useState({
    highestEducation: '',
    fieldOfStudy: '',
    college: '',
    profession: '',
    company: '',
    income: '',
  });

  useEffect(() => {
    async function fetchProfileData() {
      if (!user) return;
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const profile = docSnap.data().profile || {};
          const education = profile.education || {};
          const career = profile.career || {};

          setFormState({
            highestEducation: education.highestEducation || '',
            fieldOfStudy: education.fieldOfStudy || '',
            college: education.college || '',
            profession: career.profession || '',
            company: career.company || '',
            income: career.income || '',
          });
        }
      } catch (error) {
        console.error("Error fetching education/career data:", error);
        toast({ variant: 'destructive', title: 'Failed to load data' });
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchProfileData();
  }, [user, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(userDocRef, {
        profile: {
          ...existingData.profile,
          education: {
            highestEducation: formState.highestEducation,
            fieldOfStudy: formState.fieldOfStudy,
            college: formState.college,
          },
          career: {
            profession: formState.profession,
            company: formState.company,
            income: formState.income,
          },
        },
        profileStatus: 'in-progress-partner-preferences',
      }, { merge: true });

      toast({
        title: 'Education & Career Info Saved!',
        description: "Let's detail your partner preferences.",
      });
      router.push('/onboarding/partner-preferences');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save your information.',
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
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Step 2: Education & Career
              </CardTitle>
              <CardDescription>
                Tell us about your professional and academic background.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Education</h3>
                  <div>
                    <Label>Highest Education</Label>
                    <Select
                      name="highestEducation"
                      value={formState.highestEducation}
                      onValueChange={(value) => handleSelectChange('highestEducation', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your education level..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                        <SelectItem value="masters">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD / Doctorate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fieldOfStudy">Field of Study</Label>
                    <Input id="fieldOfStudy" name="fieldOfStudy" placeholder="e.g. Computer Science" value={formState.fieldOfStudy} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="college">College / University</Label>
                    <Input id="college" name="college" placeholder="e.g. Tribhuvan University" value={formState.college} onChange={handleChange} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Career</h3>
                  <div>
                    <Label htmlFor="profession">Profession</Label>
                    <Input id="profession" name="profession" placeholder="e.g. Software Engineer" value={formState.profession} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input id="company" name="company" placeholder="e.g. ABC Tech" value={formState.company} onChange={handleChange} />
                  </div>
                  <div>
                    <Label>Annual Income (Optional)</Label>
                    <Select
                      name="income"
                      value={formState.income}
                      onValueChange={(value) => handleSelectChange('income', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select income range..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<5LPA">Less than 5 LPA</SelectItem>
                        <SelectItem value="5-10LPA">5-10 LPA</SelectItem>
                        <SelectItem value="10-20LPA">10-20 LPA</SelectItem>
                        <SelectItem value="20-50LPA">20-50 LPA</SelectItem>
                        <SelectItem value=">50LPA">More than 50 LPA</SelectItem>
                        <SelectItem value="undisclosed">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
