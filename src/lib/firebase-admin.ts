
// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

// This safely decodes your base64 string
const getServiceAccount = () => {
    const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (!base64) {
        console.warn('[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_BASE64 is missing');
        return null;
    }
    try {
        return JSON.parse(Buffer.from(base64, 'base64').toString());
    } catch (e) {
        console.error('[Firebase Admin] Failed to parse Service Account Base64');
        return null;
    }
};

const serviceAccount = getServiceAccount();

let app: admin.app.App;

if (admin.apps.length > 0) {
    app = admin.apps[0]!;
} else if (serviceAccount) {
    app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'mitho-sambandha-c4959',
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'mitho-sambandha-c4959.appspot.com',
    });
} else {
    console.warn('[Firebase Admin] Initialization skipped - no valid credentials');
}

export const db = admin.apps.length > 0 ? admin.firestore() : null;
export const auth = admin.apps.length > 0 ? admin.auth() : null;
export default admin;
