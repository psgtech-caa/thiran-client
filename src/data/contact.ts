import { Mail, Phone, MapPin, Instagram, Youtube } from 'lucide-react';

// Team members displayed in the single contact box
export interface TeamMember {
  name: string;
  role: string;
  phone: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: 'BarathVikraman',
    role: 'Joint Secretary',
    phone: '+91 81482 51567',
  },
  {
    name: 'Swarna Rathna',
    role: 'Joint Treasurer',
    phone: '+91 99528 73426',
  },
];

export const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'login@psgtech.ac.in',
    href: 'mailto:login@psgtech.ac.in',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'K Block, 4th floor, PSG College of Technology, Coimbatore',
    href: '#',
  },
];

export const socialLinks = [
  { icon: Instagram, href: 'https://www.instagram.com/thiran_psgtech', label: 'Instagram', color: 'cosmic-pink' },
  { icon: Youtube, href: 'https://www.youtube.com/@thiran_psgtech', label: 'YouTube', color: 'cosmic-pink' },
];

export const footerLinks = {
  'Quick Links': [
    { name: 'Home', href: '#home' },
    { name: 'Events', href: '#events' },
    { name: 'Why Thiran', href: '#why-thiran' },
  ],
  'Events': [
    { name: 'Technical', href: '#events' },
    { name: 'Non-Technical', href: '#events' },
  ],
  'Support': [
    { name: 'FAQs', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ],
};
