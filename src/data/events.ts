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
}

export const events: Event[] = [
  {
    id: 1,
    name: 'HackTheBox',
    category: 'Technical',
    description: 'An intense cybersecurity and ethical hacking challenge. Break into virtual machines, solve CTF puzzles, and test your penetration testing skills in a timed competition.',
    date: 'February 23, 2026',
    time: '04:00 PM',
    venue: 'MCA Lab',
    teamSize: '2',
    prizePool: '₹3,500',
    image: 'https://media.licdn.com/dms/image/v2/C4D16AQGZ3_juPBxqmw/profile-displaybackgroundimage-shrink_200_800/profile-displaybackgroundimage-shrink_200_800/0/1663496420391?e=2147483647&v=beta&t=75BUUkMv4BHCJIF2JAE5tJgQrO52yICPknPrJBT7rFY',
  },
  {
    id: 2,
    name: 'Blind Coding',
    category: 'Technical',
    description: 'Blind Coding — write code without seeing your screen! Test your muscle memory, logic, and coding intuition in this uniquely challenging programming event.',
    date: 'February 23, 2026',
    time: '11:30 AM',
    venue: 'MCA Block, Lab 2',
    teamSize: '1',
    prizePool: '₹3,500',
    image: 'https://technoutsav.wordpress.com/wp-content/uploads/2018/01/blind-coding.png?w=640',
  },
  {
    id: 3,
    name: 'WittyMinds',
    category: 'Non-Technical',
    description: 'A fun-filled quiz and brain teaser competition that tests your general knowledge, logical reasoning, and quick-thinking abilities across multiple rounds.',
    date: 'February 23, 2026',
    time: '2:00 PM',
    venue: 'MCA Block, Seminar Hall',
    teamSize: '2-3',
    prizePool: '₹3,000',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 4,
    name: 'BrandSprint',
    category: 'Non-Technical',
    description: 'A fast-paced branding and marketing challenge where teams create a complete brand identity — logo, tagline, pitch deck — for a fictional startup within a time limit.',
    date: 'February 23, 2026',
    time: '3:30 PM',
    venue: 'MCA Block, Seminar Hall',
    teamSize: '2-4',
    prizePool: '₹3,000',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 5,
    name: 'Star of Thiran',
    category: 'Flagship',
    description: 'The ultimate championship showdown! This prestigious flagship event is exclusively for the winners of all four events. Compete against the best to claim the crown of "Star of Thiran" and prove you are the ultimate champion.',
    date: 'February 23, 2026',
    time: '5:00 PM',
    venue: 'MCA Block, Main Auditorium',
    teamSize: 'Winners Only',
    prizePool: '₹2,000',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&auto=format&fit=crop&q=60',
    isRegistrationOpen: false,
    specialNote: 'Exclusive for winners of HackTheBox, CodeBlack, WittyMinds & BrandSprint',
  },
];

export const categoryColors = {
  Technical: 'from-cosmic-purple to-cosmic-pink',
  'Non-Technical': 'from-cosmic-pink to-cosmic-cyan',
  'Flagship': 'from-yellow-500 to-orange-500',
};
