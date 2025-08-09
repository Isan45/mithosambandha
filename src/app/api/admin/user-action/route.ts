
// src/app/api/admin/user-action/route.ts
import { NextResponse } from 'next/server';
import admin, { db, auth } from '@/lib/firebase-admin';
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

export async function POST(req: NextRequest) {
  try {
    const adminAuthHeader = req.headers.get('authorization') || undefined;
    const adminUid = await verifyAdminFromHeader(adminAuthHeader);

    const body = await req.json();
    const { targetUid, action, reason } = body as { targetUid: string; action: string; reason?: string };

    if (!targetUid || !action) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }

    const profileRef = db.collection('users').doc(targetUid);
    const profileSnap = await profileRef.get();
    if (!profileSnap.exists) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // actions: ban / unban / verifyId
    let update: any = {};
    let audit: any = {
      action: action.toUpperCase(),
      adminUid,
      targetUid,
      reason: reason || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (action === 'ban') {
      update = { 'profileStatus': 'suspended' };
      await auth.updateUser(targetUid, { disabled: true });
    } else if (action === 'unban') {
      update = { 'profileStatus': 'approved' };
       await auth.updateUser(targetUid, { disabled: false });
    } else if (action === 'verifyId') {
      update = { 
        'profile.idVerified': true, 
        'verification.idVerified.status': 'approved', 
        'verification.idVerified.adminUid': adminUid, 
        'verification.idVerified.at': admin.firestore.FieldValue.serverTimestamp() 
      };
    } else {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    await profileRef.update(update);
    await db.collection('auditLogs').add(audit);

    if (action === 'ban') {
      try {
        await auth.revokeRefreshTokens(targetUid);
      } catch (e) {
        console.warn('Failed to revoke tokens', e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('admin/user-action error', err);
    return NextResponse.json({ error: err.message || 'error' }, { status: 500 });
  }
}
