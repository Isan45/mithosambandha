
// src/app/api/admin/recent-users/route.ts
import { NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase-admin';
import type { NextRequest } from 'next/server';

async function verifyAdminFromHeader(authorizationHeader?: string) {
  if (!authorizationHeader) throw new Error('Missing Authorization header');
  const match = authorizationHeader.match(/^Bearer (.+)$/);
  if (!match) throw new Error('Invalid Authorization header');
  const idToken = match[1];
  const decoded = await auth.verifyIdToken(idToken);
  if (!decoded || !(decoded.admin || decoded.role === 'admin')) {
    throw new Error('Not an admin');
  }
  return decoded.uid;
}

export async function GET(req: NextRequest) {
  try {
    const adminHeader = req.headers.get('authorization') || undefined;
    await verifyAdminFromHeader(adminHeader);

    const usersRef = db.collection('users').orderBy('createdAt', 'desc').limit(50);
    const snap = await usersRef.get();
    const users = snap.docs.map((d) => ({ uid: d.id, ...(d.data() as any) }));
    return NextResponse.json({ users });
  } catch (err: any) {
    console.error('recent-users error', err);
    return NextResponse.json({ error: err.message || 'error' }, { status: 500 });
  }
}
