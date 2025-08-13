
// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

let app: admin.app.App;

if (!admin.apps.length) {
  try {
    // The service account key must be set as a Base64-encoded environment variable.
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is not set.');
    }

    const cert = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString()
    );

    app = admin.initializeApp({
      credential: admin.credential.cert(cert),
      projectId: 'mitho-sambandha-c4959',
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'mitho-sambandha-c4959.appspot.com',
    });
  } catch (error: any) {
    console.warn(
      `[Firebase Admin] Initialization failed: ${error.message}. Backend services requiring admin privileges will not be available.`
    );
  }
} else {
  app = admin.app();
}

// We check if `app` is defined before exporting the services.
// This prevents crashes if initialization failed.
export const db = app! ? admin.firestore() : null;
export const auth = app! ? admin.auth() : null;
export default admin;
