'use client';

import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface GlowButtonProps {
  className?: string;
  children: React.ReactNode;
}

const GlowButton = ({ className, children }: GlowButtonProps) => {
  return (
    <motion.div
      animate={{
        boxShadow: [
          '0 0 0px rgba(226, 29, 29, 0.2)',
          '0 0 35px rgba(226, 29, 29, 0.6)',
          '0 0 0px rgba(226, 29, 29, 0.2)',
        ],
      }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      className={cn('rounded-2xl', className)}
    >
      {children}
    </motion.div>
  );
};

export default GlowButton;
