export interface UserProfile {
  rollNumber: string;
  name: string;
  department: string;
  year: number;
  email: string;
  mobile?: string;
  photoURL?: string;
}

// Admin emails from environment variable
const getAdminEmails = (): string[] => {
  const emails = import.meta.env.VITE_ADMIN_EMAILS;
  if (!emails) return [];
  return emails.split(',').map((email: string) => email.trim().toLowerCase());
};

export const ADMIN_EMAILS = getAdminEmails();

const DEPARTMENT_MAP: Record<string, string> = {
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
};

export function parseUserProfile(email: string, displayName: string | null): UserProfile | null {
  if (!email.endsWith('@psgtech.ac.in')) {
    return null;
  }

  const rollNumber = email.split('@')[0].toUpperCase();
  
  const yearMatch = rollNumber.match(/^(\d{2})/);
  if (!yearMatch) return null;
  
  const yearPrefix = parseInt(yearMatch[1]);
  const currentYear = new Date().getFullYear() % 100;
  // For 25MX114 in 2026: 26 - 25 = 1 (first year)
  const year = currentYear - yearPrefix;

  const deptMatch = rollNumber.match(/^\d{2}([A-Z]{2})/);
  if (!deptMatch) return null;
  
  const deptCode = deptMatch[1];
  const department = DEPARTMENT_MAP[deptCode] || deptCode;

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

export function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
