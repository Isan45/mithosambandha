
// src/app/api/admin/recent-users/route.ts
import { NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase-admin';
import type { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';

async function verifyAdminFromHeader(authorizationHeader?: string) {
  const _auth = auth || getAuth();
  if (!_auth) throw new Error('Firebase Admin SDK not initialized.');
  if (!authorizationHeader) throw new Error('Missing Authorization header');
  const match = authorizationHeader.match(/^Bearer (.+)$/);
  if (!match) throw new Error('Invalid Authorization header');
  const idToken = match[1];
  const decoded = await _auth.verifyIdToken(idToken);
  if (!decoded || !(decoded.admin || decoded.role === 'admin')) {
    throw new Error('Not an admin');
  }
  return decoded.uid;
}

export async function GET(req: NextRequest) {
  try {
    if (!db || !auth) {
        throw new Error('Firebase Admin SDK has not been initialized. Please set the FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable.');
    }
    const adminHeader = req.headers.get('authorization') || undefined;
    await verifyAdminFromHeader(adminHeader);

    const usersRef = db.collection('users').orderBy('createdAt', 'desc').limit(10);
    const snap = await usersRef.get();
    const users = snap.docs.map((d) => {
      const data = d.data();
      return { 
        uid: d.id, 
        displayName: data.fullName,
        email: data.email,
        createdAt: data.createdAt,
        profileStatus: data.profileStatus || 'incomplete'
      }
    });
    return NextResponse.json({ users });
  } catch (err: any) {
    console.error('recent-users error', err);
    return NextResponse.json({ error: err.message || 'error' }, { status: 500 });
  }
}
