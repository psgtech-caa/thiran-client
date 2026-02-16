export type UserRole = 'admin' | 'event_coordinator' | 'student_coordinator' | 'student';

export interface UserProfile {
  rollNumber: string;
  name: string;
  department: string;
  year: number;
  email: string;
  mobile?: string;
  photoURL?: string;
  role?: UserRole;
  assignedEvents?: number[]; // Event IDs that coordinators manage
  profileComplete?: boolean;
}

// Admin emails from environment variable
const getAdminEmails = (): string[] => {
  const emails = import.meta.env.VITE_ADMIN_EMAILS;
  if (!emails) return [];
  return emails.split(',').map((email: string) => email.trim().toLowerCase());
};

// Event coordinator emails from environment variable
const getEventCoordinatorEmails = (): string[] => {
  const emails = import.meta.env.VITE_EVENT_COORDINATOR_EMAILS;
  if (!emails) return [];
  return emails.split(',').map((email: string) => email.trim().toLowerCase());
};

// Student coordinator emails from environment variable
const getStudentCoordinatorEmails = (): string[] => {
  const emails = import.meta.env.VITE_STUDENT_COORDINATOR_EMAILS;
  if (!emails) return [];
  return emails.split(',').map((email: string) => email.trim().toLowerCase());
};

export const ADMIN_EMAILS = getAdminEmails();
export const EVENT_COORDINATOR_EMAILS = getEventCoordinatorEmails();
export const STUDENT_COORDINATOR_EMAILS = getStudentCoordinatorEmails();

// Department map supports both 2-letter and 3-letter codes
// e.g. 24mx336 → MX → MCA, 24ece321 → ECE → Electronics and Communication
const DEPARTMENT_MAP: Record<string, string> = {
  // 2-letter codes
  'MX': 'MCA',
  'CA': 'MCA',
  'ME': 'Mechanical Engineering',
  'EE': 'Electrical Engineering',
  'EC': 'Electronics and Communication',
  'CS': 'Computer Science',
  'IT': 'Information Technology',
  'CE': 'Civil Engineering',
  'CH': 'Chemical Engineering',
  'AE': 'Aerospace Engineering',
  'AU': 'Automobile Engineering',
  'BM': 'Biomedical Engineering',
  'IE': 'Industrial Engineering',
  'PE': 'Production Engineering',
  'TX': 'Textile Engineering',
  'MT': 'Metallurgical Engineering',
  'RO': 'Robotics and Automation',
  'FT': 'Fashion Technology',
  'AP': 'Applied Sciences',
  'BA': 'Business Administration',
  // 3-letter codes
  'ECE': 'Electronics and Communication',
  'CSE': 'Computer Science',
  'MCA': 'MCA',
  'MBA': 'Business Administration',
  'EEE': 'Electrical Engineering',
  'BME': 'Biomedical Engineering',
  'CHE': 'Chemical Engineering',
  'CIV': 'Civil Engineering',
  'MEC': 'Mechanical Engineering',
  'AER': 'Aerospace Engineering',
  'AUT': 'Automobile Engineering',
  'IND': 'Industrial Engineering',
  'PRO': 'Production Engineering',
  'TEX': 'Textile Engineering',
  'MET': 'Metallurgical Engineering',
  'ROB': 'Robotics and Automation',
};

/**
 * Parse user profile from PSG Tech email.
 * 
 * Email format: <year><dept_code><roll_number>@psgtech.ac.in
 * Examples:
 *   24mx336@psgtech.ac.in  → Year: 2, Dept: MCA (MX = 2-char code)
 *   24ece321@psgtech.ac.in → Year: 2, Dept: Electronics and Communication (ECE = 3-char code)
 *   23cs101@psgtech.ac.in  → Year: 3, Dept: Computer Science (CS = 2-char code)
 * 
 * The function tries 3-letter dept codes first, then falls back to 2-letter codes.
 */
export function parseUserProfile(email: string, displayName: string | null): UserProfile | null {
  if (!email.endsWith('@psgtech.ac.in')) {
    return null;
  }

  const rollNumber = email.split('@')[0].toUpperCase();

  // Extract year prefix (first 2 digits)
  const yearMatch = rollNumber.match(/^(\d{2})/);
  if (!yearMatch) return null;

  const yearPrefix = parseInt(yearMatch[1]);
  const currentYear = new Date().getFullYear() % 100;
  const year = currentYear - yearPrefix;

  // Try 3-letter department code first, then 2-letter
  let department = '';
  const dept3Match = rollNumber.match(/^\d{2}([A-Z]{3})/);
  const dept2Match = rollNumber.match(/^\d{2}([A-Z]{2})/);

  if (dept3Match && DEPARTMENT_MAP[dept3Match[1]]) {
    department = DEPARTMENT_MAP[dept3Match[1]];
  } else if (dept2Match && DEPARTMENT_MAP[dept2Match[1]]) {
    department = DEPARTMENT_MAP[dept2Match[1]];
  } else if (dept3Match) {
    department = dept3Match[1]; // Use raw 3-letter code as fallback
  } else if (dept2Match) {
    department = dept2Match[1]; // Use raw 2-letter code as fallback
  } else {
    return null;
  }

  let name = '';
  if (displayName) {
    const nameParts = displayName.split(' - ');
    name = nameParts.length > 1 ? nameParts[1].trim() : displayName.trim();
  }

  return {
    rollNumber,
    name,
    department,
    year,
    email,
  };
}

export function getUserRole(email: string): UserRole {
  const normalizedEmail = email.toLowerCase();
  if (ADMIN_EMAILS.includes(normalizedEmail)) return 'admin';
  if (EVENT_COORDINATOR_EMAILS.includes(normalizedEmail)) return 'event_coordinator';
  if (STUDENT_COORDINATOR_EMAILS.includes(normalizedEmail)) return 'student_coordinator';
  return 'student';
}

export function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function isCoordinator(email: string): boolean {
  const normalizedEmail = email.toLowerCase();
  return ADMIN_EMAILS.includes(normalizedEmail) ||
    EVENT_COORDINATOR_EMAILS.includes(normalizedEmail) ||
    STUDENT_COORDINATOR_EMAILS.includes(normalizedEmail);
}

export function hasRole(email: string, ...roles: UserRole[]): boolean {
  const userRole = getUserRole(email);
  return roles.includes(userRole);
}

/**
 * Check if a user can manage a specific event.
 * - Admins can manage all events.
 * - Event coordinators can manage their assigned events.
 * - Student coordinators can view but not modify.
 */
export function canManageEvent(role: UserRole, eventId: number, assignedEvents?: number[]): boolean {
  if (role === 'admin') return true;
  if (role === 'event_coordinator' && assignedEvents?.includes(eventId)) return true;
  return false;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  event_coordinator: 'Event Coordinator',
  student_coordinator: 'Student Coordinator',
  student: 'Student',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'from-red-500 to-orange-500',
  event_coordinator: 'from-cosmic-purple to-cosmic-pink',
  student_coordinator: 'from-cosmic-cyan to-blue-500',
  student: 'from-gray-500 to-gray-600',
};
