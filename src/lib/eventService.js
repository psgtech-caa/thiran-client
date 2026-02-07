import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Register user for an event
export const registerForEvent = async (eventId, userId, userData) => {
  try {
    // Ensure eventId is a string
    const eventIdStr = String(eventId);
    
    // Create participant document
    const participantRef = doc(db, `events/${eventIdStr}/participants`, userId);
    
    const participantData = {
      userId,
      name: userData.name || '',
      email: userData.email || '',
      rollNumber: userData.rollNumber || '',
      mobileNumber: userData.mobileNumber || '',
      photoURL: userData.photoURL || null,
      registeredAt: Timestamp.now(),
      status: 'registered'
    };

    await setDoc(participantRef, participantData);

    // Also update user's events list
    const userEventRef = doc(db, `users/${userId}/events`, eventIdStr);
    await setDoc(userEventRef, {
      eventId: eventIdStr,
      registeredAt: Timestamp.now(),
      status: 'registered'
    });

    return { success: true, data: participantData };
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

// Check if user is registered for an event
export const isUserRegistered = async (eventId, userId) => {
  try {
    const eventIdStr = String(eventId);
    const participantRef = doc(db, `events/${eventIdStr}/participants`, userId);
    const participantDoc = await getDoc(participantRef);
    return participantDoc.exists();
  } catch (error) {
    console.error('Error checking registration:', error);
    return false;
  }
};

// Get all events user is registered for
export const getUserEvents = async (userId) => {
  try {
    const eventsRef = collection(db, `users/${userId}/events`);
    const eventsSnapshot = await getDocs(eventsRef);
    
    return eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user events:', error);
    return [];
  }
};

// Get all participants for an event
export const getEventParticipants = async (eventId) => {
  try {
    const eventIdStr = String(eventId);
    const participantsRef = collection(db, `events/${eventIdStr}/participants`);
    const participantsSnapshot = await getDocs(participantsRef);
    
    return participantsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching event participants:', error);
    return [];
  }
};

// Get participant count for an event
export const getEventParticipantCount = async (eventId) => {
  try {
    const eventIdStr = String(eventId);
    const participantsRef = collection(db, `events/${eventIdStr}/participants`);
    const participantsSnapshot = await getDocs(participantsRef);
    return participantsSnapshot.size;
  } catch (error) {
    console.error('Error fetching participant count:', error);
    return 0;
  }
};

// Unregister from event
export const unregisterFromEvent = async (eventId, userId) => {
  try {
    const eventIdStr = String(eventId);
    const participantRef = doc(db, `events/${eventIdStr}/participants`, userId);
    const userEventRef = doc(db, `users/${userId}/events`, eventIdStr);
    
    await deleteDoc(participantRef);
    await deleteDoc(userEventRef);
    
    return { success: true };
  } catch (error) {
    console.error('Error unregistering from event:', error);
    throw error;
  }
};
