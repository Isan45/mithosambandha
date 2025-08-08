
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Loader2, Edit, Settings, Upload, UserCheck } from 'lucide-react';
import type { UserProfile } from '@/types';

// Mock handler for button clicks until they are implemented
const handleAction = (action: string) => {
  alert(`Action: ${action} not implemented yet!`);
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            // This case might happen if the user document is not created yet
            // Redirecting to onboarding might be an option here
            console.log("No profile document found for user.");
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // No user, stop loading
      }
    }
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Could not load your profile. Please try again later.</p>
      </div>
    );
  }

  const photos = profile.profile?.galleryPhotos?.length > 0 ? profile.profile.galleryPhotos : ['https://placehold.co/800x600/E5E7EB/4B5563?text=Photo+1'];
  
  const goToNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const goToPrevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };
  
  const p = profile.profile; // shorthand

  return (
    <div className="min-h-screen bg-secondary/30 p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-background rounded-2xl shadow-xl overflow-hidden">
          
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold font-headline text-foreground leading-tight">
                Welcome, {profile.fullName}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                This is your personal dashboard.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex-shrink-0 flex space-x-3">
              <button
                onClick={() => handleAction('Edit Profile')}
                className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition duration-300"
              >
                <Edit size={18} className="mr-2" />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
              <button
                onClick={() => handleAction('Manage Preferences')}
                className="flex items-center px-4 py-2 bg-muted text-muted-foreground rounded-full shadow-lg hover:bg-muted/80 transition duration-300"
              >
                <Settings size={18} className="mr-2" />
                <span className="hidden sm:inline">Preferences</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
            <div>
              <div className="relative rounded-xl overflow-hidden shadow-lg h-96">
                <img
                  src={photos[currentPhotoIndex]}
                  alt={`User photo ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-500"
                  data-ai-hint="person portrait"
                />
                
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevPhoto}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                    >
                      &#9664;
                    </button>
                    <button
                      onClick={goToNextPhoto}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                    >
                      &#9654;
                    </button>
                  </>
                )}
                
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  {p?.idDocument && (
                    <div className="flex items-center bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                      <UserCheck size={16} className="mr-1" />
                      Govt Verified
                    </div>
                  )}
                </div>

                <button
                    onClick={() => handleAction('Upload Photo')}
                    className="absolute top-4 right-4 bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-200 transition"
                >
                    <Upload size={20} />
                </button>

              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold font-headline mb-2">My Bio</h2>
                <p className="text-muted-foreground leading-relaxed">{p?.bio || "No bio provided."}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-bold font-headline mb-2">My Details</h2>
                <div className="bg-muted/50 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Age</p>
                    <p className="mt-1 text-base">{p?.dob ? new Date().getFullYear() - new Date(p.dob).getFullYear() : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="mt-1 text-base">{p?.currentLocation || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Wants Kids</p>
                    <p className="mt-1 text-base capitalize">{p?.partnerPreferences?.wantsKids || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Family Type</p>
                    <p className="mt-1 text-base capitalize">{p?.partnerPreferences?.familyType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Education</p>
                    <p className="mt-1 text-base">{p?.education?.highestEducation || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Religion</p>
                    <p className="mt-1 text-base">{p?.religion || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
