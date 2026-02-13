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
    description: 'A battle of wits and logic! Test your critical thinking, riddle-solving abilities, and teamwork in this fast-paced non-technical showdown. Expect the unexpected as you navigate through mind-bending puzzles.',
    date: 'February 23, 2026',
    time: '04:00 PM - 6:30 PM',
    venue: 'MCA Block, Seminar Hall',
    teamSize: '2',
    prizePool: '₹3,000',
    image: 'https://thumbs.dreamstime.com/b/brain-training-games-vector-illustration-featuring-people-having-fun-riddles-crosswords-logic-game-puzzle-solving-397605106.jpg',
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
    venue: 'MCA Lab',
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
    description: 'Unleash your inner marketer! In this high-pressure challenge, teams must conceptualize and pitch a brand strategy for a surprise product. Creativity, spontaneity, and persuasion are your best weapons.',
    date: 'February 25, 2026',
    time: '04:00 PM - 6:30 PM',
    venue: 'MCA Block, Seminar Hall',
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
    venue: 'MCA Block, Lab 2',
    teamSize: 'Individual',
    prizePool: '₹3,500',
    image: 'https://www.hp.com/us-en/shop/app/assets/images/uploads/prod/5%20Best%20Coding%20Programs%20for%20Aspiring%20Programmers1650304687858345.jpg',
    coordinators: [
      { name: 'Nitheesh', phone: '9944725360' },
      { name: 'Chinnaza', phone: '8056576531' }
    ]
  },
  {
    id: 5,
    name: 'Star of Thiran',
    category: 'Flagship',
    description: 'The ultimate glory awaits! Winners and runners-up from all events face off in a grueling multi-round stage test. Only the most versatile and sharpest mind will be crowned the Star of Thiran.',
    date: 'March 6, 2026',
    time: '02:00 PM - 4:00 PM',
    venue: 'MCA Block, Main Auditorium',
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
