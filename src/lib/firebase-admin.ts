import admin from 'firebase-admin';

// Ensure the service account details are provided
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Check if all required service account properties are available
const hasCredentials = serviceAccount.projectId && serviceAccount.privateKey && serviceAccount.clientEmail;

if (!admin.apps.length) {
  if (hasCredentials) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
      });
    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
    }
  } else {
    // We are logging this on the server, so it's fine.
    console.log('Firebase admin credentials not provided. Admin features will be disabled.');
  }
}


// Export initialized services only if the app was initialized
export const adminDb = admin.apps.length > 0 ? admin.firestore() : null;
export const adminAuth = admin.apps.length > 0 ? admin.auth() : null;
