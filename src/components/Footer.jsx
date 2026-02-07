import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
  FaStar,
} from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';

function Footer() {
  const footerRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Events', href: '/events' },
        { name: 'Register', href: '/register' },
      ],
    },
    {
      title: 'Events',
      links: [
        { name: 'Code Sprint', href: '/events/code-sprint' },
        { name: 'RoboWars', href: '/events/robowars' },
        { name: 'Hackathon', href: '/events/hackathon' },
        { name: 'Tech Quiz', href: '/events/tech-quiz' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { name: 'thiran@psgtech.ac.in', href: 'mailto:thiran@psgtech.ac.in', icon: FaEnvelope },
        { name: 'PSG Tech, Coimbatore', href: '#', icon: FaMapMarkerAlt },
        { name: 'thirancaa', href: '#', icon: FaInstagram },
      ],
    },
  ];

  const socialLinks = [
    { icon: FaInstagram, href: 'https://instagram.com/psgtech', label: 'Instagram' },
    { icon: FaTwitter, href: 'https://twitter.com/psgtech', label: 'Twitter' },
    { icon: FaLinkedin, href: 'https://linkedin.com/school/psg-college-of-technology', label: 'LinkedIn' },
    { icon: FaYoutube, href: 'https://youtube.com/@psgtech', label: 'YouTube' },
  ];

  return (
    <footer
      ref={footerRef}
      style={{
        padding: '40px 15px 30px', // much smaller vertical space
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Hero / CTA - smaller */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          style={{
            textAlign: 'center',
            marginBottom: '40px',
            padding: '30px 20px',
            background: 'rgba(10,10,15,0.45)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(168,85,247,0.22)',
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 12, -12, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.25)',
              boxShadow: '0 0 20px rgba(168,85,247,0.5)',
            }}
          >
            <FaStar color="#fff" size={24} />
          </motion.div>

          <h2 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: 'clamp(1.8rem, 5vw, 3rem)', // much smaller
            fontWeight: 900,
            background: 'linear-gradient(90deg, #ff69b4, #ff1493, #c71585, #a855f7)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '0.8rem',
            textShadow: '0 0 25px rgba(255,105,180,0.6)',
            letterSpacing: '-0.8px',
          }}>
            Ready to Make Your Mark?
          </h2>

          <p style={{
            fontSize: '0.95rem', // smaller
            color: 'rgba(255,255,255,0.78)',
            maxWidth: '580px',
            margin: '0 auto 1.5rem',
            lineHeight: '1.4',
          }}>
            Join hundreds of students competing for glory at Thiran 2026. Don't miss your chance to showcase your skills!
          </p>

          <motion.a
            href="/register"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168,85,247,0.65)' }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 28px', // smaller button
              background: 'linear-gradient(135deg, #7c3aed, #db2777)',
              color: 'white',
              fontWeight: 600,
              borderRadius: '10px',
              textDecoration: 'none',
              boxShadow: '0 8px 25px rgba(168,85,247,0.45)',
              fontSize: '0.9rem', // smaller text
            }}
          >
            Register Now
            <FiArrowUpRight size={14} />
          </motion.a>
        </motion.div>

        {/* Links Cards - smaller */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.18 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            margin: '0 0 50px 0',
          }}
        >
          {footerLinks.map((section, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                padding: '18px', // smaller
                background: hoveredCard === i
                  ? 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(236,72,153,0.08))'
                  : 'rgba(10,10,15,0.48)',
                border: '1px solid rgba(168,85,247,0.28)',
                borderRadius: '10px',
                backdropFilter: 'blur(10px)',
                boxShadow: hoveredCard === i
                  ? '0 15px 30px -8px rgba(168, 85, 247, 0.35)'
                  : '0 4px 15px rgba(0,0,0,0.25)',
                transition: 'all 0.35s ease',
              }}
            >
              <h4 style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: '1.2rem', // smaller
                fontWeight: 900,
                background: 'linear-gradient(90deg, #ff69b4, #ff1493, #c71585, #a855f7)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                marginBottom: '0.9rem',
                letterSpacing: '0.6px',
                textShadow: '0 0 15px rgba(255,105,180,0.5)',
              }}>
                {section.title}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {section.links.map((link, j) => (
                  <motion.a
                    key={j}
                    href={link.href}
                    whileHover={{
                      x: 5,
                      color: '#ffffff',
                      textShadow: '0 0 10px rgba(236,72,153,0.7)',
                    }}
                    style={{
                      color: 'rgba(255,255,255,0.84)',
                      textDecoration: 'none',
                      fontSize: '0.85rem', // smaller
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    {link.icon && <link.icon size={13} />}
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Brand & Social + Bottom - smaller */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          style={{
            textAlign: 'center',
            padding: '30px 20px', // smaller
            background: 'rgba(10,10,15,0.42)',
            borderRadius: '12px',
            border: '1px solid rgba(168,85,247,0.25)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 12, -12, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.25)',
              boxShadow: '0 0 20px rgba(168,85,247,0.5)',
            }}
          >
            <FaStar color="#fff" size={24} />
          </motion.div>

          <h3 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: '2.2rem', // smaller
            fontWeight: 900,
            background: 'linear-gradient(90deg, #ff69b4, #ff1493, #c71585, #a855f7)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '0.8rem',
            textShadow: '0 0 25px rgba(255,105,180,0.7)',
            letterSpacing: '-0.8px',
          }}>
            THIRAN'26
          </h3>

          <p style={{
            fontSize: '0.9rem', // smaller
            color: 'rgba(255,255,255,0.78)',
            marginBottom: '2rem',
            maxWidth: '520px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            PSG College of Technology's premier intra-college technical festival. Where innovation meets competition.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}>
            {socialLinks.map((s, i) => (
              <motion.a
                key={i}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                whileHover={{
                  y: -6,
                  scale: 1.2,
                  rotate: 8,
                  boxShadow: '0 0 20px rgba(168,85,247,0.7)',
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 14 }}
                style={{
                  width: '44px',
                  height: '44px',
                  background: 'rgba(168,85,247,0.15)',
                  color: '#ffffff',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(168,85,247,0.4)',
                  fontSize: '1.2rem',
                  boxShadow: '0 0 10px rgba(168,85,247,0.35)',
                }}
              >
                <s.icon />
              </motion.a>
            ))}
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.8rem',
            fontSize: '0.75rem', // smaller
            color: 'rgba(255,255,255,0.75)',
            paddingTop: '1.5rem',
          }}>
            <div>© Thiran 2026. PSG College of Technology. All rights reserved.</div>

            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ec4899' }}
            >
              Made with <FaHeart size={12} />
            </motion.div>
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
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;