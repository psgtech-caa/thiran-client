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

/**
 * Parse user profile from PSG Tech email.
 * 
 * Email format: <year><dept_code><roll_number>@psgtech.ac.in
 * Examples:
 *   25mx336@psgtech.ac.in  → Year: 1, Dept: MX
 *   25ece312@psgtech.ac.in → Year: 1, Dept: ECE
 *   24cs101@psgtech.ac.in  → Year: 2, Dept: CS
 * 
 * The department is the raw letters extracted from the email (uppercased).
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

  // Extract department letters (all letters between the year digits and roll number digits)
  const deptMatch = rollNumber.match(/^\d{2}([A-Z]+)/);
  if (!deptMatch) return null;

  const department = deptMatch[1]; // Raw letters uppercased, e.g. ECE, MX, CS

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
