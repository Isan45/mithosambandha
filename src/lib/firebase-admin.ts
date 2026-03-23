
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
        console.log(`[Firebase Admin] Base64 string length: ${base64.length}`);
        console.log(`[Firebase Admin] Base64 starts with: ${base64.substring(0, 10)}...`);
        const decoded = Buffer.from(base64, 'base64').toString();
        return JSON.parse(decoded);
    } catch (e: any) {
        console.error('[Firebase Admin] Decoding/Parsing FAILED:', e.message);
        return null;
    }
};

const serviceAccount = getServiceAccount();

let app: admin.app.App | null = null;

try {
    if (admin.apps.length > 0) {
        app = admin.apps[0]!;
    } else if (serviceAccount) {
        app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: 'mitho-sambandha-c4959',
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'mitho-sambandha-c4959.appspot.com',
        });
        console.log('[Firebase Admin] InitializeApp success');
    } else {
        console.warn('[Firebase Admin] Initialization skipped - no valid credentials');
    }
} catch (error: any) {
    console.error('[Firebase Admin] Initialization FAILED during initializeApp:', error.message);
}

export const db = admin.apps.length > 0 ? admin.firestore() : null;
export const auth = admin.apps.length > 0 ? admin.auth() : null;
export default admin;
