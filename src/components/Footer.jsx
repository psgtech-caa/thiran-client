import { motion } from 'framer-motion';
import { Sparkles, Mail, MapPin, Phone, Instagram, Twitter, Linkedin, Youtube, ArrowUpRight } from 'lucide-react';
import { Button } from './ui/Button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Events', href: '#events' },
        { name: 'Register', href: '#events' },
      ],
    },
    {
      title: 'Events',
      links: [
        { name: 'Code Sprint', href: '#events' },
        { name: 'RoboWars', href: '#events' },
        { name: 'Hackathon', href: '#events' },
        { name: 'Tech Quiz', href: '#events' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { name: 'thiran@psgtech.ac.in', href: 'mailto:thiran@psgtech.ac.in', icon: Mail },
        { name: 'PSG Tech, Coimbatore', href: '#', icon: MapPin },
        { name: '+91 98765 43210', href: 'tel:+919876543210', icon: Phone },
      ],
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer id="contact" className="relative pt-20 sm:pt-32 pb-8 sm:pb-12 overflow-hidden border-t border-white/5 bg-[#050508]">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-2 lg:col-span-1">
            <a href="#home" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="font-display text-2xl font-bold tracking-wide">
                <span className="text-white">THIRAN</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">'26</span>
              </div>
            </a>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Empowering the next generation of innovators and creators. Join us at PSG Tech for an unforgettable tech fest experience.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500/20 transition-all duration-300 border border-white/5 hover:border-purple-500/30"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((column, idx) => (
            <div key={idx} className="flex flex-col gap-6">
              <h3 className="font-display text-lg font-semibold text-white">{column.title}</h3>
              <ul className="flex flex-col gap-4">
                {column.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a 
                      href={link.href} 
                      className="group flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      {link.icon && <link.icon size={16} className="text-gray-500 group-hover:text-purple-400 transition-colors" />}
                      <span className="text-sm">{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {currentYear} Thiran. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
