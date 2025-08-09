
// This file is for client-side Firebase initialization
'use client';

import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyChI2xnoM5a_Afg56r5Y5-n16TCEtFp86E',
  authDomain: 'monospace-9.firebaseapp.com',
  projectId: 'monospace-9',
  storageBucket: 'monospace-9.appspot.com',
  messagingSenderId: '943158816698',
  appId: '1:943158816698:web:565f4c1deb6161ee507783',
  measurementId: 'G-4VC7T24F14',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
