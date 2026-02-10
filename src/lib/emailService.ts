import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Queues a confirmation email by writing to the Firestore `mail` collection.
 * The Firebase "Trigger Email from Firestore" extension picks up these docs
 * and sends them via SMTP (Gmail / SendGrid / any provider).
 *
 * Setup once: Firebase Console → Extensions → "Trigger Email from Firestore"
 * Gmail SMTP: ~500 emails/day. SendGrid free: 100/day.
 */
export async function sendRegistrationEmail(params: {
  userName: string;
  userEmail: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  rollNumber: string;
}): Promise<boolean> {
  try {
    await addDoc(collection(db, 'mail'), {
      to: params.userEmail,
      message: {
        subject: `Thiran 2k26 — You're registered for ${params.eventName}!`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e2e2e2; border-radius: 16px; overflow: hidden; border: 1px solid #1a1a2e;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #7c3aed, #ec4899, #06b6d4); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; color: #fff; font-weight: 800; letter-spacing: -0.5px;">Thiran 2k26</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Intra-Collegiate Tech Fest — PSG College of Technology</p>
            </div>

            <!-- Body -->
            <div style="padding: 32px 24px;">
              <h2 style="color: #a78bfa; margin: 0 0 8px; font-size: 20px;">Registration Confirmed! ✅</h2>
              <p style="margin: 0 0 24px; color: #a1a1aa; font-size: 15px; line-height: 1.6;">
                Hey <strong style="color: #e2e2e2;">${params.userName}</strong>, you're all set for <strong style="color: #a78bfa;">${params.eventName}</strong>!
              </p>

              <!-- Event Details Card -->
              <div style="background: #111119; border: 1px solid #1e1e2e; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px; font-size: 22px; color: #a78bfa;">${params.eventName}</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 13px; width: 90px; vertical-align: top;">📅 Date</td>
                    <td style="padding: 10px 0; color: #e2e2e2; font-size: 14px; font-weight: 600;">${params.eventDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 13px; vertical-align: top;">🕐 Time</td>
                    <td style="padding: 10px 0; color: #e2e2e2; font-size: 14px; font-weight: 600;">${params.eventTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 13px; vertical-align: top;">📍 Venue</td>
                    <td style="padding: 10px 0; color: #e2e2e2; font-size: 14px; font-weight: 600;">${params.eventVenue}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-size: 13px; vertical-align: top;">🎓 Roll No</td>
                    <td style="padding: 10px 0; color: #e2e2e2; font-size: 14px; font-weight: 600;">${params.rollNumber}</td>
                  </tr>
                </table>
              </div>

              <!-- Reminder -->
              <div style="background: #7c3aed15; border: 1px solid #7c3aed30; border-radius: 10px; padding: 14px 16px; margin-bottom: 16px;">
                <p style="margin: 0; color: #c4b5fd; font-size: 13px;">📌 <strong>Remember:</strong> Carry your college ID card on the event day. No separate entry pass required.</p>
              </div>

              <p style="color: #6b7280; font-size: 13px; margin: 0; text-align: center;">See you at the event! 🚀</p>
            </div>

            <!-- Footer -->
            <div style="background: #060609; padding: 20px 24px; text-align: center; border-top: 1px solid #1a1a2e;">
              <p style="margin: 0; color: #4b5563; font-size: 12px;">Department of Computer Applications</p>
              <p style="margin: 4px 0 0; color: #4b5563; font-size: 12px;">PSG College of Technology, Coimbatore</p>
            </div>
          </div>
        `,
      },
    });
    return true;
  } catch (error) {
    console.error('Failed to queue confirmation email:', error);
    return false;
  }
}
