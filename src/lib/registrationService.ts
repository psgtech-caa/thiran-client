import { collection, doc, setDoc, getDoc, getDocs, query, where, deleteDoc, Timestamp, updateDoc } from 'firebase/firestore';
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
  attended?: boolean;
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

export async function removeRegistration(userId: string, eventId: number): Promise<boolean> {
  try {
    const registrationRef = doc(db, 'registrations', `${userId}_${eventId}`);
    await deleteDoc(registrationRef);
    return true;
  } catch (error) {
    console.error('Error removing registration:', error);
    return false;
  }
}

export async function markAttendance(userId: string, eventId: number, attended: boolean): Promise<boolean> {
  try {
    const registrationRef = doc(db, 'registrations', `${userId}_${eventId}`);
    await updateDoc(registrationRef, { attended });
    return true;
  } catch (error) {
    console.error('Error marking attendance:', error);
    return false;
  }
}

export async function markBulkAttendance(eventId: number, userIds: string[], attended: boolean): Promise<boolean> {
  try {
    const promises = userIds.map(userId => {
      const registrationRef = doc(db, 'registrations', `${userId}_${eventId}`);
      return updateDoc(registrationRef, { attended });
    });
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Error marking bulk attendance:', error);
    return false;
  }
}

export async function getAllRegistrations(): Promise<EventRegistration[]> {
  try {
    const registrationRef = collection(db, 'registrations');
    const snapshot = await getDocs(registrationRef);
    return snapshot.docs.map(doc => doc.data() as EventRegistration);
  } catch (error) {
    console.error('Error fetching all registrations:', error);
    return [];
  }
}

/**
 * Admin-only: Add a registration for a user who hasn't signed up themselves.
 * Uses the roll number as a pseudo-userId since the user may not have a Firebase account.
 */
export async function adminAddRegistration(
  event: Event,
  userData: {
    rollNumber: string;
    name: string;
    email: string;
    mobile: string;
    department: string;
    year: number;
  }
): Promise<boolean> {
  const pseudoUserId = `manual_${userData.rollNumber.toLowerCase()}`;
  const registrationRef = doc(db, 'registrations', `${pseudoUserId}_${event.id}`);

  try {
    const existingReg = await getDoc(registrationRef);
    if (existingReg.exists()) {
      toast.error(`${userData.rollNumber} is already registered for ${event.name}`);
      return false;
    }

    const registration: EventRegistration = {
      userId: pseudoUserId,
      eventId: event.id,
      eventName: event.name,
      userRoll: userData.rollNumber.toUpperCase(),
      userName: userData.name,
      userEmail: userData.email.toLowerCase(),
      userMobile: userData.mobile,
      department: userData.department.toUpperCase(),
      year: userData.year,
      registeredAt: Timestamp.now(),
    };

    await setDoc(registrationRef, registration);
    toast.success(`Added ${userData.name} (${userData.rollNumber}) to ${event.name}`);
    return true;
  } catch (error: any) {
    console.error('Admin add registration error:', error);
    toast.error(error.message || 'Failed to add user');
    return false;
  }
}

export async function deleteUserByRoll(rollNumber: string): Promise<boolean> {
  try {
    const q = query(collection(db, 'registrations'), where('userRoll', '==', rollNumber));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return false;

    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

export async function updateUserDetails(
  rollNumber: string,
  updates: {
    name?: string;
    email?: string;
    mobile?: string;
    department?: string;
    year?: number
  }
): Promise<boolean> {
  try {
    const q = query(collection(db, 'registrations'), where('userRoll', '==', rollNumber));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return false;

    const updatePromises = snapshot.docs.map(doc => {
      const data: any = {};
      if (updates.name) data.userName = updates.name;
      if (updates.email) data.userEmail = updates.email;
      if (updates.mobile) data.userMobile = updates.mobile;
      if (updates.department) data.department = updates.department;
      if (updates.year) data.year = updates.year;

      return updateDoc(doc.ref, data);
    });

    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    console.error('Error updating user details:', error);
    return false;
  }
}
