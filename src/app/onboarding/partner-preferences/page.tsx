
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function PartnerPreferencesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [formState, setFormState] = useState({
    minAge: '',
    maxAge: '',
    minHeight: '',
    maxHeight: '',
    religion: '',
    caste: '',
    education: '',
    profession: '',
    general: '',
  });

  useEffect(() => {
    async function fetchProfileData() {
      if (!user) return;
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const prefs = docSnap.data().profile?.partnerPreferences || {};
          setFormState({
            minAge: prefs.minAge?.toString() || '',
            maxAge: prefs.maxAge?.toString() || '',
            minHeight: prefs.minHeight?.toString() || '',
            maxHeight: prefs.maxHeight?.toString() || '',
            religion: prefs.religion?.join(', ') || '',
            caste: prefs.caste?.join(', ') || '',
            education: prefs.education?.join(', ') || '',
            profession: prefs.profession?.join(', ') || '',
            general: prefs.general || '',
          });
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
        toast({ variant: 'destructive', title: 'Failed to load data' });
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchProfileData();
  }, [user, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const parseStringToArray = (str: string) => str ? str.split(',').map(item => item.trim()).filter(Boolean) : [];

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
          partnerPreferences: {
            minAge: Number(formState.minAge) || null,
            maxAge: Number(formState.maxAge) || null,
            minHeight: Number(formState.minHeight) || null,
            maxHeight: Number(formState.maxHeight) || null,
            religion: parseStringToArray(formState.religion),
            caste: parseStringToArray(formState.caste),
            education: parseStringToArray(formState.education),
            profession: parseStringToArray(formState.profession),
            general: formState.general,
          },
        },
        profileStatus: 'in-progress-photos',
      }, { merge: true });

      toast({
        title: 'Preferences Saved!',
        description: "Let's add some photos to your profile.",
      });
      router.push('/onboarding/photos');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save your preferences.',
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
                Step 3: Partner Preferences
              </CardTitle>
              <CardDescription>
                Describe what you are looking for in a partner. This helps us
                find better matches for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Basics</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <Label htmlFor="minAge">Min Age</Label>
                       <Input id="minAge" name="minAge" type="number" placeholder="e.g. 25" value={formState.minAge} onChange={handleChange} />
                     </div>
                     <div>
                       <Label htmlFor="maxAge">Max Age</Label>
                       <Input id="maxAge" name="maxAge" type="number" placeholder="e.g. 32" value={formState.maxAge} onChange={handleChange} />
                     </div>
                  </div>
                  {/* Height preference can be added here similarly */}
                </div>
                <Separator />
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">Community & Background</h3>
                    <p className="text-sm text-muted-foreground">Enter multiple values separated by commas (e.g. Hindu, Buddhist).</p>
                    <div>
                        <Label htmlFor="religion">Religion</Label>
                        <Input id="religion" name="religion" placeholder="e.g. Hindu, Buddhist" value={formState.religion} onChange={handleChange} />
                    </div>
                     <div>
                        <Label htmlFor="caste">Caste / Community</Label>
                        <Input id="caste" name="caste" placeholder="e.g. Brahmin, Chhetri" value={formState.caste} onChange={handleChange} />
                    </div>
                </div>
                <Separator />
                 <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">Education & Career</h3>
                     <p className="text-sm text-muted-foreground">Enter multiple values separated by commas.</p>
                    <div>
                        <Label htmlFor="education">Education Level</Label>
                        <Input id="education" name="education" placeholder="e.g. Bachelors, Masters" value={formState.education} onChange={handleChange} />
                    </div>
                     <div>
                        <Label htmlFor="profession">Profession</Label>
                        <Input id="profession" name="profession" placeholder="e.g. Engineer, Doctor" value={formState.profession} onChange={handleChange} />
                    </div>
                </div>

                <Separator />
                <div>
                  <Label htmlFor="general">About Your Ideal Partner</Label>
                  <Textarea
                    id="general"
                    name="general"
                    placeholder="Describe other qualities, values, or interests you're looking for..."
                    className="mt-2 min-h-[120px]"
                    value={formState.general}
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

