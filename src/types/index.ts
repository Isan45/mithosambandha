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

export type SuccessStory = {
  id: string;
  names: string;
  story: string;
  photo: string;
};
