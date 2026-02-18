export interface Event {
  id: number;
  name: string;
  category: 'Technical' | 'Non-Technical' | 'Flagship';
  description: string;
  date: string;
  time: string;
  venue: string;
  teamSize: string;
  prizePool: string;
  image: string;
  isRegistrationOpen?: boolean;
  specialNote?: string;
  coordinators?: { name: string; phone: string }[];
}

export const events: Event[] = [
  {
    id: 3,
    name: 'Witty Mindz',
    category: 'Non-Technical',
    description: 'Witty Mindz is a high-intensity team competition that challenges mental agility, coordination, and creative thinking across three escalating rounds. From solving logical puzzles and recalling critical details to decoding clues and presenting with impact, participants must adapt quickly and communicate effectively. Only the sharpest and most synchronized teams will rise to the top.',
    date: 'February 23, 2026',
    time: '04:00 PM - 6:30 PM',
    venue: 'K503',
    teamSize: '2',
    prizePool: '₹3,000',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2070&auto=format&fit=crop',
    coordinators: [
      { name: 'Vishaly', phone: '9976477887' },
      { name: 'Thamizhthilaga', phone: '7825007711' }
    ]
  },
  {
    id: 1,
    name: 'Hack-The-Box',
    category: 'Technical',
    description: 'Determine to dominate the digital realm? Engage in an intense capture-the-flag style coding competition. Solve algorithmic challenges, crack ciphers, and debug your way to victory in this test of pure technical prowess.',
    date: 'February 24, 2026',
    time: '04:00 PM - 6:30 PM',
    venue: 'CAT Lab',
    teamSize: '2',
    prizePool: '₹3,500',
    image: 'https://media.licdn.com/dms/image/v2/C4D16AQGZ3_juPBxqmw/profile-displaybackgroundimage-shrink_200_800/profile-displaybackgroundimage-shrink_200_800/0/1663496420391?e=2147483647&v=beta&t=75BUUkMv4BHCJIF2JAE5tJgQrO52yICPknPrJBT7rFY',
    coordinators: [
      { name: 'Dayananda', phone: '9524785141' },
      { name: 'Induja', phone: '9791868857' }
    ]
  },
  {
    id: 4,
    name: 'Brand Sprint',
    category: 'Non-Technical',
    description: 'Brand Sprint is a fast-paced, offline relay challenge that tests creativity, intuition, and branding instincts under pressure. One member sketches a logo without words, another crafts a tagline without knowing the product, and the final member delivers a complete pitch based only on those clues. With strict time limits and accuracy-based evaluation, teams must think quickly, collaborate seamlessly, and sell their ideas with confidence.',
    date: 'February 25, 2026',
    time: '04:00 PM - 6:30 PM',
    venue: 'K504',
    teamSize: '3',
    prizePool: '₹3,000',
    image: 'https://cdn.prod.website-files.com/646cb2a160bc4ae7a0eb728e/6745bbd9f6b066834ca1d384_Frame%203.png',
    coordinators: [
      { name: 'Dheepthi', phone: '7339140106' },
      { name: 'Kaavya', phone: '6382760741' }
    ]
  },
  {
    id: 2,
    name: 'Blind Coding',
    category: 'Technical',
    description: 'Code in the dark! Trust your fingers and your logic as you write code without seeing the screen. A true test of syntax mastery and mental visualization for the bravest coders.',
    date: 'February 26, 2026',
    time: '04:00 PM - 6:30 PM',
    venue: 'CAT Lab',
    teamSize: 'Individual (1 member)',
    prizePool: '₹3,500',
    image: 'https://www.hp.com/us-en/shop/app/assets/images/uploads/prod/5%20Best%20Coding%20Programs%20for%20Aspiring%20Programmers1650304687858345.jpg',
    coordinators: [
      { name: 'Nitheesh', phone: '9944725360' },
      { name: 'Chinnaya', phone: '8056576531' }
    ]
  },
  {
    id: 5,
    name: 'Star of Thiran',
    category: 'Flagship',
    description: 'Star of Thiran 2026 is the flagship individual championship that seeks the most adaptable, intelligent, and confident participant of the fest. Beginning with a strategic brainstorming round and culminating in a live on-stage challenge, the competition tests creativity, clarity, composure, and stage presence under pressure. In the end, only one will claim the title.',
    date: 'Feb 27, 2026',
    time: '03:00 PM - 6:30 PM',
    venue: 'D-Block',
    teamSize: 'Individual',
    prizePool: '₹5,000',
    image: 'https://img.freepik.com/premium-vector/three-athletes-stand-proudly-podium-holding-their-medals-paralympic-sports-event-customizable-cartoon-illustration-paralympic-boccia_585735-37611.jpg',
    isRegistrationOpen: false,
    specialNote: 'Exclusive for Winners & Runners of other events.',
    coordinators: [
      { name: 'Mithulesh', phone: '9488893193' },
      { name: 'Nandithasri', phone: '6380916334' }
    ]
  },
];

export const categoryColors = {
  Technical: 'from-cosmic-purple to-cosmic-pink',
  'Non-Technical': 'from-cosmic-pink to-cosmic-cyan',
  'Flagship': 'from-yellow-500 to-orange-500',
};

/**
 * Check if an event date has passed.
 * Parses the "February 23, 2026" format and compares with current date.
 */
export function isEventPast(event: Event): boolean {
  try {
    const eventDate = new Date(event.date);
    if (isNaN(eventDate.getTime())) return false;
    // Set to end of event day (11:59 PM)
    eventDate.setHours(23, 59, 59, 999);
    return new Date() > eventDate;
  } catch {
    return false;
  }
}

/**
 * Check if registration is currently open for an event.
 * Returns false if: explicitly closed, or event date has passed.
 */
export function isRegistrationOpen(event: Event): boolean {
  if (event.isRegistrationOpen === false) return false;
  if (isEventPast(event)) return false;
  return true;
}
