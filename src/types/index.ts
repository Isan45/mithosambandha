

import type { AdminAction } from '@/lib/server-actions/audit';

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
  phone?: string;
  createdAt: any; // Firebase Timestamp
  lastActiveAt?: any; // Firebase Timestamp
  role: 'user' | 'admin' | 'moderator';
  profileStatus:
    | 'incomplete'
    | 'in-progress-education'
    | 'in-progress-career'
    | 'in-progress-partner-preferences'
    | 'in-progress-photos'
    | 'pending-review'
    | 'approved'
    | 'rejected'
    | 'suspended';
  onboardingReason?: 'life-partner' | 'for-someone-else' | 'browsing';
  profileCompletion: number;
  profile?: {
    gender?: string;
    dob?: string; // Stored as ISO string
    height?: {
      feet?: number;
      inches?: number;
    };
    bodyType?: string;
    maritalStatus?: 'never-married' | 'divorced' | 'widowed';
    motherTongue?: string;
    familyType?: 'joint' | 'nuclear';
    familyValues?: 'traditional' | 'moderate' | 'liberal';
    canRelocate?: 'yes' | 'no' | 'maybe';
    wantsKids?: 'yes' | 'no' | 'undecided';
    phoneNumber?: string;
    nationality?: string;
    currentLocation?: string;
    permanentAddress?: string;
    caste?: string;
    religion?: string;
    complexion?: string;
    dietaryHabits?: 'vegetarian' | 'non-vegetarian' | 'eggetarian' | 'vegan';
    smokingHabits?: 'no' | 'yes' | 'occasionally';
    drinkingHabits?: 'no' | 'yes' | 'occasionally';
    bio?: string;
    profilePhoto?: string;
    galleryPhotos?: string[];
    idDocument?: string;
    idVerified?: boolean;
    membership?: 'Free' | 'Gold' | 'Platinum';
    
    education?: {
      highestEducation?: string;
      fieldOfStudy?: string;
      college?: string;
    };
    
    career?: {
        profession?: string;
        company?: string;
        income?: string;
    };
    
    partnerPreferences?: {
        general?: string;
        minAge?: number;
        maxAge?: number;
        minHeight?: number;
        maxHeight?: number;
        maritalStatus?: string[];
        religion?: string[];
        caste?: string[];
        education?: string[];
        profession?: string[];
        location?: string[];
    }
  }
};

export type SuccessStory = {
  id: string;
  names: string;
  story: string;
  photo: string;
};

export type AuditLog = {
  id: string;
  action: AdminAction;
  adminUid: string;
  targetUid: string;
  timestamp: any; // Firebase Timestamp
  changes?: {
    oldValue: any;
    newValue: any;
  };
  reason?: string;
};
