// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  // The service account key must be set as a Base64-encoded environment variable.
  // This is the only way to ensure the correct project is used in the deployed environment.
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is not set.');
  }

  const cert = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString()
  );

  admin.initializeApp({
    credential: admin.credential.cert(cert),
    projectId: 'mitho-sambandha-c4959',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'mitho-sambandha-c4959.appspot.com',
  });
}

export default admin;
export const db = admin.firestore();
export const auth = admin.auth();
