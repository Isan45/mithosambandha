// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  // Initialize with service account JSON stored in env (recommended)
  // On Vercel use VERCEl env variables or use Workload Identity; never commit service account file.
  const cert = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
    ? JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString())
    : undefined;

  admin.initializeApp({
    credential: cert ? admin.credential.cert(cert) : admin.credential.applicationDefault(),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
    projectId: 'mitho-sambandha-c4959', // Forcing the correct project ID
  });
}

export default admin;
export const db = admin.firestore();
export const auth = admin.auth();
