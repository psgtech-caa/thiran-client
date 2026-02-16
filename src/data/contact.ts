import { Mail, Phone, MapPin, Instagram, Youtube } from 'lucide-react';

// Team members displayed in the single contact box
export interface TeamMember {
  name: string;
  role: string;
  phone: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: 'Barath Vikraman',
    role: 'Joint Secretary',
    phone: '+91 98765 43210',
  },
  {
    name: 'Swarna',
    role: 'Joint Treasurer',
    phone: '+91 98765 43210',
  },
];

export const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'thiran2k26@gmail.com',
    href: 'mailto:thiran2k26@gmail.com',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'K Block, 4th floor, PSG College of Technology, Coimbatore',
    href: '#',
  },
];

export const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram', color: 'cosmic-pink' },
  { icon: Youtube, href: '#', label: 'YouTube', color: 'cosmic-pink' },
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
    { name: 'FAQs', href: '#' },
    { name: 'Contact', href: '#contact' },
  ],
};
