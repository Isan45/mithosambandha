// This file is for client-side Firebase initialization
'use client';

import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBV_UssbqWWweViiyDR9Rp8M9mGKR5fHMc",
  authDomain: "mitho-sambandha-c4959.firebaseapp.com",
  projectId: "mitho-sambandha-c4959",
  storageBucket: "mitho-sambandha-c4959.appspot.com",
  messagingSenderId: "943158816698",
  appId: "1:943158816698:web:565f4c1deb6161ee507783",
  measurementId: "G-4VC7T24F14"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
