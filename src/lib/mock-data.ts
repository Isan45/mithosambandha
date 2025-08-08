import type { Profile, SuccessStory } from '@/types';

export const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Anjali Sharma',
    age: 28,
    location: 'Kathmandu, Nepal',
    bio: "I'm a software engineer with a passion for trekking in the Himalayas and exploring new cultures. I enjoy reading, painting, and trying out new recipes in my free time. Looking for a partner who is kind, ambitious, and shares a love for adventure and learning.",
    partnerPreferences:
      'Seeking a well-educated professional, aged 28-34, who is family-oriented, has a good sense of humor, and is open to travel. Someone who values honesty, communication, and mutual respect in a relationship.',
    photos: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    profilePhoto: 'https://placehold.co/600x400.png',
    status: 'approved',
    onlineStatus: true,
  },
  {
    id: '2',
    name: 'Bikram Thapa',
    age: 32,
    location: 'Pokhara, Nepal',
    bio: "I run a small trekking agency and love everything about the outdoors. When I'm not guiding, you can find me playing my guitar, practicing photography, or volunteering at a local animal shelter. I believe in living a balanced life with a focus on experiences over material things.",
    partnerPreferences:
      'Looking for a compassionate and independent woman (27-33) who appreciates nature and has a positive outlook on life. Someone who is adventurous, but also enjoys quiet evenings at home. A love for dogs is a big plus!',
    photos: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    profilePhoto: 'https://placehold.co/600x400.png',
    status: 'approved',
    onlineStatus: false,
  },
  {
    id: '3',
    name: 'Sita Gurung',
    age: 29,
    location: 'Lalitpur, Nepal',
    bio: "A graphic designer and artist, I find beauty in the little things. My perfect weekend involves visiting art galleries, sipping coffee at a cozy cafe, and working on my pottery. I'm a good listener and value deep, meaningful conversations.",
    partnerPreferences:
      "Hoping to meet a creative and thoughtful man (30-36) who is emotionally intelligent and can communicate openly. A shared interest in arts and culture would be wonderful, but I'm most interested in finding a genuine connection.",
    photos: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    profilePhoto: 'https://placehold.co/600x400.png',
    status: 'approved',
    onlineStatus: true,
  },
  {
    id: '4',
    name: 'Rohan Joshi',
    age: 31,
    location: 'Bhaktapur, Nepal',
    bio: "I'm a doctor specializing in pediatrics. My work is demanding but incredibly rewarding. In my downtime, I decompress by playing basketball, watching classic movies, and spending quality time with my family. I am looking for a serious, long-term relationship.",
    partnerPreferences:
      'I am interested in a partner (28-32) who is patient, understanding of my career, and has strong family values. She should be educated, have her own passions, and be ready to build a life together.',
    photos: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    profilePhoto: 'https://placehold.co/600x400.png',
    status: 'approved',
    onlineStatus: true,
  },
  {
    id: '5',
    name: 'Priya Manandhar',
    age: 26,
    location: 'Kathmandu, Nepal',
    bio: "I'm a recent business school graduate, currently working in marketing. I'm energetic, optimistic, and love socializing. My hobbies include dancing, exploring street food, and planning weekend getaways with friends.",
    partnerPreferences:
      'Looking for an ambitious and fun-loving partner (26-32) who can keep up with my energy. He should be confident, respectful, and have a great circle of friends. Someone who is as excited about building a future as I am.',
    photos: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    profilePhoto: 'https://placehold.co/600x400.png',
    status: 'pending',
    onlineStatus: false,
  },
  {
    id: '6',
    name: 'Samir Shrestha',
    age: 34,
    location: 'Pokhara, Nepal',
    bio: 'Architect by profession, philosopher by heart. I enjoy designing sustainable buildings and am deeply interested in Eastern philosophy and meditation. I spend my free time reading, sketching, and taking long walks by the lake.',
    partnerPreferences:
      'Seeking a mature and introspective partner (29-35) who values peace and intellectual stimulation. Someone who is kind, has a spiritual side, and is looking for a deep, soulful connection rather than a superficial one.',
    photos: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    profilePhoto: 'https://placehold.co/600x400.png',
    status: 'pending',
    onlineStatus: true,
  },
];

export const mockSuccessStories: SuccessStory[] = [
  {
    id: '1',
    names: 'Asha & Ravi',
    story:
      "We found each other through Mitho Sambandha and it felt like destiny. The platform's focus on genuine intentions made all the difference. We're now happily married and so grateful for this amazing service!",
    photo: 'https://placehold.co/800x600.png',
  },
  {
    id: '2',
    names: 'Nisha & Suman',
    story:
      'Neither of us thought we would find love online, but Mitho Sambandha proved us wrong. The personal touch and careful vetting process helped us connect on a deeper level. We tied the knot last spring!',
    photo: 'https://placehold.co/800x600.png',
  },
  {
    id: '3',
    names: 'Sunita & Pradip',
    story:
      "Our journey started with a simple profile view and ended in a beautiful wedding. The platform made it easy to find someone with shared values. Thank you, Mitho Sambandha, for bringing us together.",
    photo: 'https://placehold.co/800x600.png',
  },
  {
    id: '4',
    names: 'Diya & Anup',
    story:
      'We lived in different continents but shared the same cultural roots. Mitho Sambandha bridged the distance and helped us build a connection that felt like home. We are now happily settled and planning our future.',
    photo: 'https://placehold.co/800x600.png',
  },
  {
    id: '5',
    names: 'Kiran & Mohan',
    story:
      "The admin team's dedication to creating a safe community is what drew us to Mitho Sambandha. It led us to find not just a partner, but a soulmate. We couldn't be happier.",
    photo: 'https://placehold.co/800x600.png',
  },
];
