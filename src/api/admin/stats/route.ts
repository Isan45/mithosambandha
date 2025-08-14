
// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import admin, { db, auth } from '@/lib/firebase-admin';
import type { NextRequest } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
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

const calculateAge = (dobString?: string) => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// Helper to get the start of the week (Monday)
const getStartOfWeek = (d: Date) => {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};


export async function GET(req: NextRequest) {
  try {
    if (!db || !auth) {
        throw new Error('Firebase Admin SDK has not been initialized. Please set the FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable.');
    }
    const authHeader = req.headers.get('authorization') || undefined;
    await verifyAdminFromHeader(authHeader);

    const usersCol = db.collection('users');
    const allUsersSnap = await usersCol.get();
    const allUsersData = allUsersSnap.docs.map(doc => doc.data());

    // Total Users
    const totalUsers = allUsersSnap.size;

    // Premium Users (assuming a 'membership' field)
    const totalPremiumUsers = allUsersData.filter(u => u.profile?.membership === 'Platinum' || u.profile?.membership === 'Gold').length;

    // Active Users (last 7 days)
    const sevenDaysAgo = Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const activeLast7Days = allUsersData.filter(u => u.lastActiveAt && u.lastActiveAt >= sevenDaysAgo).length;

    // For simplicity, we assume revenue is not yet implemented and will be zero.
    const totalRevenue = 0;
    const revenueThisWeek = 0;
    const revenueThisMonth = 0;
    
    // Pending Verifications
    const pendingVerifications = allUsersData.filter(u => u.profileStatus === 'pending-review').length;
    
    // Gender Breakdown for all users
    const genderCounts: Record<string, number> = {};
    allUsersData.forEach((u) => {
        const gender = u.profile?.gender || 'Unknown';
        genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    });

    // Age Distribution
    const ageBuckets: Record<string, number> = { '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55+': 0, 'Unknown': 0 };
    allUsersData.forEach((u) => {
        const age = calculateAge(u.profile?.dob);
        if (age >= 18 && age <= 24) ageBuckets['18-24']++;
        else if (age >= 25 && age <= 34) ageBuckets['25-34']++;
        else if (age >= 35 && age <= 44) ageBuckets['35-44']++;
        else if (age >= 45 && age <= 54) ageBuckets['45-54']++;
        else if (age >= 55) ageBuckets['55+']++;
        else ageBuckets['Unknown']++;
    });
    const ageDistribution = Object.entries(ageBuckets).map(([ageGroup, users]) => ({ ageGroup, users }));


    // Signups Last 10 Days
    const signupsLast10Days: { date: string, signups: number }[] = [];
    const dateCounts: Record<string, number> = {};
    for (let i = 0; i < 10; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateString = d.toISOString().split('T')[0];
        dateCounts[dateString] = 0;
    }
    allUsersData.forEach(u => {
        if (u.createdAt) {
            const signupDate = u.createdAt.toDate().toISOString().split('T')[0];
            if (dateCounts[signupDate] !== undefined) {
                dateCounts[signupDate]++;
            }
        }
    });
    for (const date in dateCounts) {
        signupsLast10Days.push({ date, signups: dateCounts[date] });
    }
    signupsLast10Days.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    

    const payload = {
      totals: {
        totalUsers,
        totalPremiumUsers,
        activeLast7Days,
        totalRevenue,
        revenueThisWeek,
        revenueThisMonth,
        pendingVerifications
      },
      breakdowns: {
        byGender: genderCounts,
      },
      charts: {
        signupsLast10Days,
        ageDistribution
      },
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload);
  } catch (err: any) {
    console.error('admin/stats error', err);
    return NextResponse.json({ error: err.message || 'error' }, { status: 500 });
  }
}
