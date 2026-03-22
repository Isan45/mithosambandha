
'use server';

import { db } from '@/lib/firebase-admin';
import { AdminAction } from './audit';

export interface AuditLogEntry {
  id: string;
  action: AdminAction;
  adminUid: string;
  targetUid: string;
  timestamp: string;
  changes: { oldValue: any; newValue: any } | null;
  reason: string | null;
}

export async function getAuditLogs(limit: number = 20, targetUid?: string) {
  if (!db) {
    throw new Error('Firebase Admin SDK not initialized.');
  }

  try {
    let query: any = db.collection('auditLogs')
      .orderBy('timestamp', 'desc');

    if (targetUid) {
      query = query.where('targetUid', '==', targetUid);
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    
    const logs: AuditLogEntry[] = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        action: data.action,
        adminUid: data.adminUid,
        targetUid: data.targetUid,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : new Date().toISOString(),
        changes: data.changes || null,
        reason: data.reason || null,
      };
    });

    return logs;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw new Error('Failed to fetch audit logs.');
  }
}
