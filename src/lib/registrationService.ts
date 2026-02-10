import { collection, doc, setDoc, getDoc, getDocs, query, where, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event } from '@/data/events';
import { toast } from 'sonner';

export interface EventRegistration {
  userId: string;
  eventId: number;
  eventName: string;
  userRoll: string;
  userName: string;
  userEmail: string;
  userMobile: string;
  department: string;
  year: number;
  registeredAt: Timestamp;
}

export async function registerForEvent(
  userId: string,
  event: Event,
  userProfile: { rollNumber: string; name: string; email: string; mobile?: string; department: string; year: number }
): Promise<boolean> {
  if (!userProfile.mobile) {
    toast.error('Please add your mobile number before registering');
    return false;
  }

  const registrationRef = doc(db, 'registrations', `${userId}_${event.id}`);
  
  try {
    const existingReg = await getDoc(registrationRef);
    if (existingReg.exists()) {
      toast.error('You are already registered for this event');
      return false;
    }

    const registration: EventRegistration = {
      userId,
      eventId: event.id,
      eventName: event.name,
      userRoll: userProfile.rollNumber,
      userName: userProfile.name,
      userEmail: userProfile.email,
      userMobile: userProfile.mobile,
      department: userProfile.department,
      year: userProfile.year,
      registeredAt: Timestamp.now(),
    };

    await setDoc(registrationRef, registration);
    toast.success(`Successfully registered for ${event.name}!`);
    return true;
  } catch (error: any) {
    console.error('Registration error:', error);
    toast.error(error.message || 'Failed to register for event');
    return false;
  }
}

export async function getUserRegistrations(userId: string): Promise<EventRegistration[]> {
  try {
    const q = query(collection(db, 'registrations'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as EventRegistration);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return [];
  }
}

export async function getEventRegistrations(eventId: number): Promise<EventRegistration[]> {
  try {
    const q = query(collection(db, 'registrations'), where('eventId', '==', eventId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as EventRegistration);
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    return [];
  }
}

export async function checkIfRegistered(userId: string, eventId: number): Promise<boolean> {
  try {
    const registrationRef = doc(db, 'registrations', `${userId}_${eventId}`);
    const registration = await getDoc(registrationRef);
    return registration.exists();
  } catch (error) {
    console.error('Error checking registration:', error);
    return false;
  }
}
