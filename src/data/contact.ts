import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

export const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'thiran2k26@gmail.com',
    href: 'mailto:thiran2k26@gmail.com',
    color: 'purple' as const,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
    color: 'pink' as const,
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'K Block, 4th floor, PSG College of Technology, Coimbatore',
    href: '#',
    color: 'cyan' as const,
  },
];

export const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram', color: 'cosmic-pink' },
  { icon: Twitter, href: '#', label: 'Twitter', color: 'cosmic-purple' },
  { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'cosmic-cyan' },
  { icon: Youtube, href: '#', label: 'YouTube', color: 'cosmic-pink' },
];

export const footerLinks = {
  'Quick Links': [
    { name: 'Home', href: '#home' },
    { name: 'Events', href: '#events' },
    { name: 'Why Thiran', href: '#why-thiran' },
    { name: 'Contact', href: '#contact' },
  ],
  'Events': [
    { name: 'Technical', href: '#events' },
    { name: 'Non-Technical', href: '#events' },
    { name: 'Workshops', href: '#events' },
    { name: 'Gaming', href: '#events' },
  ],
  'Support': [
    { name: 'FAQs', href: '#' },
    { name: 'Guidelines', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ],
};
