
export type Profile = {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  partnerPreferences: string;
  photos: string[];
  status: 'approved' | 'pending' | 'rejected';
};

export type UserProfile = {
  uid: string;
  email: string;
  fullName: string;
  onboardingReason: 'life-partner' | 'for-someone-else' | 'browsing';
  profileStatus:
    | 'incomplete'
    | 'in-progress-personal'
    | 'in-progress-education'
    | 'in-progress-career'
    | 'in-progress-partner-preferences'
    | 'in-progress-photos'
    | 'pending-review'
    | 'approved'
    | 'rejected';
  createdAt: any; // Using `any` for Firebase Timestamp for simplicity
};

export type SuccessStory = {
  id: string;
  names: string;
  story: string;
  photo: string;
};
