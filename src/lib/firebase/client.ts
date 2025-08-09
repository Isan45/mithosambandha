
// This file is for client-side Firebase initialization
'use client';

import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: "YOUR_API_KEY",
  authDomain: "mitho-sambandha-c4959.firebaseapp.com",
  projectId: "mitho-sambandha-c4959",
  storageBucket: "mitho-sambandha-c4959.appspot.com",
  messagingSenderId: "107491337536",
  appId: "1:107491337536:web:65a08234c2b53b5e47852e",
  measurementId: "G-9XG01W0C69"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
