
'use client';

import { useState } from 'react';
import type { UserProfile } from '@/types';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Heart, MapPin, Cake, Undo2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface DiscoverClientProps {
  initialProfiles: UserProfile[];
}

export function DiscoverClient({ initialProfiles }: DiscoverClientProps) {
  const [profiles, setProfiles] = useState<UserProfile[]>(initialProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<'like' | 'pass' | null>(null);

  const handleNextProfile = (action: 'like' | 'pass') => {
    setLastAction(action);
    setTimeout(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % (profiles.length || 1));
      setLastAction(null);
    }, 300);
  };
  
  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  const currentProfile = profiles[currentIndex];

  const cardVariants = {
    initial: { opacity: 0, y: 50, scale: 0.9, rotate: 0 },
    animate: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { duration: 0.3 } },
    exit: {
      opacity: 0,
      x: lastAction === 'like' ? 300 : -300,
      rotate: lastAction === 'like' ? 15 : -15,
      transition: { duration: 0.3 }
    }
  };

  if (!currentProfile || profiles.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-secondary text-center p-4">
        <h2 className="font-headline text-3xl">All Out of Profiles!</h2>
        <p className="mt-2 text-muted-foreground">
          Check back later for new members in your community.
        </p>
      </div>
    );
  }

  // Calculate age
  const calculateAge = (dob?: string) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(currentProfile.profile?.dob);
  const photo = currentProfile.profile?.profilePhoto || '/images/placeholder-profile.jpg';

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-secondary/50 p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProfile.uid}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Card className="w-full max-w-sm overflow-hidden rounded-2xl shadow-xl bg-background">
            <CardContent className="p-0">
              <div className="relative h-96 w-full">
                <Image
                  src={photo}
                  alt={currentProfile.fullName}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
              <div className="p-6">
                <CardTitle className="font-headline text-3xl">
                  {currentProfile.fullName}
                </CardTitle>
                <div className="mt-2 flex items-center gap-4 text-muted-foreground">
                  {age && (
                    <span className="flex items-center gap-1.5">
                      <Cake className="h-4 w-4" /> {age}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {currentProfile.profile?.currentLocation || 'Nepal'}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/80 line-clamp-4">
                  {currentProfile.profile?.bio || 'No bio provided.'}
                </p>
              </div>
            </CardContent>
            <CardFooter className="grid grid-cols-3 items-center gap-4 bg-muted/30 p-4">
              <Button
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500/10 hover:text-amber-600"
                onClick={() => handleNextProfile('pass')}
              >
                <X className="h-8 w-8" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-muted-foreground text-muted-foreground"
                onClick={handleUndo}
                disabled={currentIndex === 0}
              >
                <Undo2 className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-full border-2 border-rose-500 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                onClick={() => handleNextProfile('like')}
              >
                <Heart className="h-8 w-8" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
