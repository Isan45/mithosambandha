
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export type NotificationType = 
  | 'MATCH_FOUND'
  | 'PROFILE_APPROVED'
  | 'PROFILE_REJECTED'
  | 'MESSAGE_RECEIVED'
  | 'ACCOUNT_SUSPENDED';

interface SendNotificationParams {
  recipientUid: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  sendEmail?: boolean;
}

/**
 * Centralized service to handle all platform notifications.
 * Currently supports Firestore-based notification logs. 
 * Can be extended to support real-time pushes or emails (e.g. via Resend/SendGrid).
 */
export async function sendNotification({
  recipientUid,
  type,
  title,
  body,
  data = {},
  sendEmail = false
}: SendNotificationParams) {
  if (!db) {
    console.error('Firebase Admin SDK not initialized. Cannot send notification.');
    return;
  }

  try {
    const notificationData = {
      recipientUid,
      type,
      title,
      body,
      data,
      read: false,
      createdAt: FieldValue.serverTimestamp(),
    };

    // 1. Store in Firestore for in-app notification center (Phase 3+)
    await db.collection('notifications').add(notificationData);

    // 2. Handle Email Notification
    if (sendEmail) {
      await sendEmailNotification(recipientUid, title, body);
    }

    console.log(`Notification sent to ${recipientUid}: ${title}`);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

async function sendEmailNotification(uid: string, title: string, body: string) {
  // Placeholder for Email Service integration (Resend, SendGrid, etc.)
  // In a real implementation, you'd fetch the user's email first.
  console.log(`[Email Placeholder] To: ${uid}, Subject: ${title}, Body: ${body}`);
  
  // Example integration with Firestore-triggered emails (e.g. Firebase Extension)
  // await db.collection('mail').add({
  //   toUids: [uid],
  //   message: {
  //     subject: title,
  //     text: body,
  //   }
  // });
}
