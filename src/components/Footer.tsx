import { motion } from 'framer-motion';
import {
  Sparkles,
  Heart
} from 'lucide-react';
import { socialLinks, footerLinks } from '@/data/contact';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-cosmic-surface to-background" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cosmic-purple/10 rounded-full blur-[50px] animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cosmic-pink/10 rounded-full blur-[50px] animate-float" />

      {/* Massive Background Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 whitespace-nowrap opacity-[0.03] select-none pointer-events-none">
        <span className="text-[5rem] md:text-[15rem] lg:text-[20rem] font-black tracking-tighter">THIRAN</span>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Main Footer */}
        <div className="py-12 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
            {/* Brand - Full Width on Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="col-span-2 md:col-span-2 lg:col-span-2"
            >
              <motion.a
                href="#home"
                className="flex items-center gap-2 mb-4 md:mb-6 group"
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center gap-2 group perspective-container">
                  <span
                    className="text-xl md:text-2xl font-bold tracking-tight"
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--silver)), hsl(var(--glossy-blue)))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Thiran
                  </span>
                  <motion.span
                    className="text-sm md:text-base font-bold px-2 py-0.5 rounded-md border border-cosmic-cyan/50 text-cosmic-cyan"
                    animate={{
                      boxShadow: [
                        '0 0 5px hsl(187 94% 55% / 0.3)',
                        '0 0 15px hsl(187 94% 55% / 0.5)',
                        '0 0 5px hsl(187 94% 55% / 0.3)',
                      ],
                      borderColor: [
                        'hsl(187 94% 55% / 0.5)',
                        'hsl(187 94% 55% / 0.8)',
                        'hsl(187 94% 55% / 0.5)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    2k26
                  </motion.span>
                </div>
              </motion.a>
              <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6 max-w-sm leading-relaxed">
                Thiran is an intracollege event conducted by the Department of Computer Applications.
                <br />
                Join us for an extraordinary celebration of technology and creativity.
              </p>

              {/* Social Links */}
              <div className="flex gap-2 md:gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      className="w-9 h-9 md:w-10 md:h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-all duration-300"
                      aria-label={social.label}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Links - Hidden on Mobile, Visible on Tablet+ */}
            {Object.entries(footerLinks).map(([title, links], sectionIndex) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                className="hidden md:block"
              >
                <h4 className="text-xs md:text-sm font-semibold mb-3 md:mb-4 gradient-text uppercase tracking-wide">{title}</h4>
                <ul className="space-y-2 md:space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <motion.a
                        href={link.href}
                        className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1 group"
                        whileHover={{ x: 5 }}
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-cosmic transition-all duration-300" />
                        {link.name}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Mobile Quick Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:hidden mt-8 pt-8 border-t border-white/10"
          >
            <h4 className="text-sm font-semibold mb-4 gradient-text uppercase tracking-wide">Quick Links</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(footerLinks).map(([_, links]) =>
                links.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300 p-2 rounded-lg hover:bg-white/5"
                    whileHover={{ x: 3 }}
                  >
                    {link.name}
                  </motion.a>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 md:py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          <motion.p
            className="text-xs md:text-sm text-muted-foreground flex items-center gap-1 text-center md:text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Department of Computer Applications MCA © 2026
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
