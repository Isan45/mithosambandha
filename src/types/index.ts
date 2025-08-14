
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
  profileCompletion: number;
  visibility: 'public' | 'private' | 'verified-only';
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

  basic?: {
    gender?: string;
    dob?: string; // Stored as ISO string
    heightCm?: number;
    city?: string;
    country?: string;
  };

  education?: {
    level?: string;
    field?: string;
    institution?: string;
  };

  work?: {
    occupation?: string;
    employer?: string;
    incomeMonthly?: number;
  };

  family?: {
    familyType?: string;
    parentsOccupation?: string;
    siblings?: string;
  };

  preferences?: {
    age?: { min?: number; max?: number };
    height?: {
      minFt?: number;
      minIn?: number;
      maxFt?: number;
      maxIn?: number;
    };
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
    additionalPreferences?: string;
  };

  photos?: Array<{
    id: string;
    url: string;
    thumb?: string;
    status: 'pending' | 'approved' | 'rejected';
    uploadedAt: any; // Firebase Timestamp
  }>;

  verification?: {
    phoneVerified: boolean;
    idVerified: {
      status: 'pending' | 'approved' | 'rejected' | 'none';
      adminId?: string;
      note?: string;
      at?: any; // Firebase Timestamp
    };
    photoVerified: {
      status: 'pending' | 'approved' | 'rejected' | 'none';
      adminId?: string;
      at?: any; // Firebase Timestamp
    };
  };

  activityStats?: {
    profileViews: number;
    messagesSent: number;
    interestsSent: number;
  };
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
