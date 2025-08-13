
// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import admin, { db, auth } from '@/lib/firebase-admin';
import type { NextRequest } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';

async function verifyAdminFromHeader(authorizationHeader?: string) {
  if (!auth) throw new Error('Firebase Admin SDK not initialized.');
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

function startOfDay(ts: Date) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return Timestamp.fromDate(d);
}
function startOfWeek(ts: Date) {
  const d = new Date(ts);
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return Timestamp.fromDate(monday);
}
function startOfMonth(ts: Date) {
  const d = new Date(ts);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return Timestamp.fromDate(d);
}

export async function GET(req: NextRequest) {
  try {
    if (!db || !auth) {
        throw new Error('Firebase Admin SDK has not been initialized. Please set the FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable.');
    }
    const authHeader = req.headers.get('authorization') || undefined;
    await verifyAdminFromHeader(authHeader);

    const now = new Date();
    const dayStart = startOfDay(now);
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);

    const usersCol = db.collection('users');

    // Total users
    const totalUsersSnap = await usersCol.count().get();
    const totalUsers = totalUsersSnap.data().count;

    // Users this month / week / day
    const usersThisMonthSnap = await usersCol.where('createdAt', '>=', monthStart).count().get();
    const usersThisMonth = usersThisMonthSnap.data().count;
    const usersThisWeekSnap = await usersCol.where('createdAt', '>=', weekStart).count().get();
    const usersThisWeek = usersThisWeekSnap.data().count;
    const usersTodaySnap = await usersCol.where('createdAt', '>=', dayStart).count().get();
    const usersToday = usersTodaySnap.data().count;
    
    // For simplicity, we assume premium and revenue are not yet implemented.
    const totalPremium = 0;
    const premiumThisMonth = 0;
    const premiumToday = 0;
    const totalRevenue = 0;
    const revenueMonth = 0;
    const revenueDay = 0;


    // Signins by country & gender (from profile.currentLocation & profile.gender)
    const countryCounts: Record<string, number> = {};
    const genderCounts: Record<string, number> = {};
    const allProfilesSnap = await usersCol.select('profile.currentLocation', 'profile.gender').get();
    allProfilesSnap.forEach((d) => {
      const data = d.data() as any;
      const country = data?.profile?.currentLocation?.split(',').pop()?.trim() || 'Unknown';
      const gender = data?.profile?.gender || 'Unknown';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    });

    // Active users last 7 days (lastActiveAt)
    const last7 = Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const active7Snap = await usersCol.where('lastActiveAt', '>=', last7).count().get();
    const activeLast7Days = active7Snap.data().count;

    // Profile completion distribution
    const completionBuckets: Record<string, number> = { '0-25': 0, '26-50': 0, '51-75': 0, '76-100': 0 };
    const completionSnap = await usersCol.select('profileCompletion').get();
    completionSnap.forEach((d) => {
      const c = (d.data() as any).profileCompletion || 0;
      const pct = Math.round(Number(c) * 100);
      if (pct <= 25) completionBuckets['0-25']++;
      else if (pct <= 50) completionBuckets['26-50']++;
      else if (pct <= 75) completionBuckets['51-75']++;
      else completionBuckets['76-100']++;
    });

    const payload = {
      totals: {
        totalUsers,
        usersThisMonth,
        usersThisWeek,
        usersToday,
        totalPremium,
        premiumThisMonth,
        premiumToday,
        totalRevenue,
        revenueMonth,
        revenueDay,
        activeLast7Days,
      },
      breakdowns: {
        byCountry: countryCounts,
        byGender: genderCounts,
        profileCompletionBuckets: completionBuckets,
      },
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload);
  } catch (err: any) {
    console.error('admin/stats error', err);
    return NextResponse.json({ error: err.message || 'error' }, { status: 500 });
  }
}
