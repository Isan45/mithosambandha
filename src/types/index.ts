

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
  onlineStatus?: boolean;
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
    bodyType?: string;
    maritalStatus?: string;
    motherTongue?: string;
    familyType?: string;
    familyValues?: string;
    canRelocate?: string;
    wantsKids?: string;
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
    membership?: 'Free Membership' | 'Gold Membership' | 'Platinum Membership';
    onlineStatus?: boolean;
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
      maritalStatus?: string;
      religion?: string;
      caste?: string;
      motherTongue?: string;
      education?: string;
      occupation?: string;
      employmentStatus?: string;
      minIncome?: string;
      workLocation?: string;
      dietaryHabits?: string;
      drinkingHabits?: string;
      smokingHabits?: string;
      religiousBeliefs?: string;
      astrology?: string;
      familyType?: string;
      relocate?: string;
      location?: string;
      personality?: string;
      hobbies?: string;
      wantsKids?: string;
      marriageTimeline?: string;
      additionalPreferences?: string; // Add this field
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
