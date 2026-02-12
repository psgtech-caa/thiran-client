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
    name: 'Hack-The-Box',
    category: 'Technical',
    description: 'Solving complex problems with innovative algorithms under time constraints. An intense challenge to test your problem-solving abilities and coding expertise.',
    date: 'February 24, 2026',
    time: '04:00 PM - 6:30 PM',
    venue: 'MCA Lab',
    teamSize: '2',
    prizePool: '₹3,500',
    image: 'https://media.licdn.com/dms/image/v2/C4D16AQGZ3_juPBxqmw/profile-displaybackgroundimage-shrink_200_800/profile-displaybackgroundimage-shrink_200_800/0/1663496420391?e=2147483647&v=beta&t=75BUUkMv4BHCJIF2JAE5tJgQrO52yICPknPrJBT7rFY',
  },
  {
    id: 2,
    name: 'Blind Coding',
    category: 'Technical',
    description: 'Blind coding is writing code without seeing the output or running it, relying purely on logic and understanding. Test your coding intuition and problem-solving skills without visual feedback.',
    date: 'February 26, 2026',
    time: '04:00 PM - 6:30 PM',
    venue: 'MCA Block, Lab 2',
    teamSize: 'Individual',
    prizePool: '₹3,500',
    image: 'https://www.hp.com/us-en/shop/app/assets/images/uploads/prod/5%20Best%20Coding%20Programs%20for%20Aspiring%20Programmers1650304687858345.jpg',
  },
  {
    id: 3,
    name: 'Witty Mindz',
    category: 'Non-Technical',
    description: 'A fast-paced battle of brains where logic, creativity, and quick thinking come together to challenge your mind and teamwork skills. Compete in a series of mind-bending puzzles and riddles.',
    date: 'February 23, 2026',
    time: '04:00 PM - 6:30 PM',
    venue: 'MCA Block, Seminar Hall',
    teamSize: '2',
    prizePool: '₹3,000',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 4,
    name: 'Brand Sprint',
    category: 'Non-Technical',
    description: 'A fast paced team challenge where each member builds on the previous one\'s work to transform a surprise product into a completed brand without any discussion. Collaboration at its finest!',
    date: 'February 25, 2026',
    time: '04:00 PM - 6:30 PM',
    venue: 'MCA Block, Seminar Hall',
    teamSize: '3',
    prizePool: '₹3,000',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 5,
    name: 'Star of Thiran',
    category: 'Flagship',
    description: 'Flagship event - Answer thought provoking questions and participate in stage test with 2 rounds. This prestigious event is for individual performance with winners and runners of other events competing for the ultimate title.',
    date: 'March 6, 2026',
    time: '02:00 PM - 4:00 PM',
    venue: 'MCA Block, Main Auditorium',
    teamSize: 'Individual (Winners & Runners)',
    prizePool: '₹5,000',
    image: 'https://media.istockphoto.com/id/166272870/photo/racers-cheering-on-track.jpg?s=612x612&w=0&k=20&c=7eOo7eOxdwfNR-B0dPNSZe5kkXiyIcvAwv21KxAyCnY=',
    isRegistrationOpen: false,
    specialNote: 'For winners and runners of all other events only. 2-round stage test with thought-provoking questions.',
  },
];

export const categoryColors = {
  Technical: 'from-cosmic-purple to-cosmic-pink',
  'Non-Technical': 'from-cosmic-pink to-cosmic-cyan',
  'Flagship': 'from-yellow-500 to-orange-500',
};
