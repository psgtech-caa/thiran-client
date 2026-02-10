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

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Main Footer */}
        <div className="py-16 md:py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <motion.a 
                href="#home" 
                className="flex items-center gap-2 mb-6 group"
                whileHover={{ x: 5 }}
              >
                
                <span className="text-2xl font-bold gradient-text">THIRAN 2026</span>
              </motion.a>
              <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
                Thiran is the ultimate tech symposium where innovation meets excellence. 
                Join us for an extraordinary celebration of technology and creativity.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-all duration-300"
                      aria-label={social.label}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Links */}
            {Object.entries(footerLinks).map(([title, links], sectionIndex) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              >
                <h4 className="font-semibold mb-4 gradient-text">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <motion.a
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1 group"
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
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p 
            className="text-sm text-muted-foreground flex items-center gap-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Made with <Heart className="w-4 h-4 text-cosmic-pink fill-cosmic-pink animate-pulse" /> by Thiran Team © 2026
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
