
// This is a simplified version for mock data and public profiles
export type Profile = {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  partnerPreferences: string;
  photos: string[]; // gallery photos
  status: 'approved' | 'pending' | 'rejected';
  profilePhoto?: string; // Main profile photo
};

// This is the detailed user profile stored in Firestore
export type UserProfile = {
  uid: string;
  email: string;
  fullName: string;
  onboardingReason: 'life-partner' | 'for-someone-else' | 'browsing';
  createdAt: any; // Firebase Timestamp
  profileStatus:
    | 'incomplete'
    | 'in-progress-education'
    | 'in-progress-career'
    | 'in-progress-partner-preferences'
    | 'in-progress-photos'
    | 'pending-review'
    | 'approved'
    | 'rejected';
  profile?: {
    gender?: string;
    dob?: string;
    height?: { feet: number; inches: number };
    phoneNumber?: string;
    nationality?: string;
    currentLocation?: string;
    permanentAddress?: string;
    caste?: string;
    religion?: string;
    complexion?: string;
    dietaryHabits?: string;
    smokingHabits?: string;
    drinkingHabits?: string;
    bio?: string;
    education?: {
      highestEducation: string;
      college: string;
      fieldOfStudy: string;
    };
    career?: {
      profession: string;
      company?: string;
      workDetails?: string;
      income?: string;
    };
    partnerPreferences?: {
      age?: { min?: number; max?: number };
      height?: { minFt?: number; minIn?: number; maxFt?: number; maxIn?: number };
      wantsKids?: string;
      relocate?: string;
      earning?: string;
      familyType?: string;
      education?: string;
      occupation?: string;
      religion?: string;
      caste?: string;
      dietaryHabits?: string;
      smokingHabits?: string;
      drinkingHabits?: string;
      currentLocation?: string;
      additionalPreferences?: string;
    };
    profilePhoto?: string;
    galleryPhotos?: string[];
    idDocument?: string;
    idVerified?: boolean;
  };
};

export type SuccessStory = {
  id: string;
  names: string;
  story: string;
  photo: string;
};

    