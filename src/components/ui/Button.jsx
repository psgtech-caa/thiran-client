import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const buttonVariants = {
  primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:from-purple-500 hover:to-pink-500 border-0',
  secondary: 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-sm',
  outline: 'border-2 border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10 text-white transition-all',
  ghost: 'text-gray-400 hover:text-white hover:bg-white/5 transition-colors',
  glass: 'bg-white/5 backdrop-blur-lg border border-white/10 text-white hover:bg-white/10 hover:border-white/20 shadow-xl',
};

const buttonSizes = {
  sm: 'h-9 px-4 text-sm rounded-lg',
  md: 'h-10 px-5 text-sm rounded-xl',
  lg: 'h-12 px-8 text-base rounded-xl',
  xl: 'h-14 px-10 text-lg rounded-2xl',
  icon: 'h-10 w-10 p-0 rounded-xl',
};

const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  asChild = false,
  children,
  ...props 
}, ref) => {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        'inline-flex items-center justify-center gap-2.5 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
