'use client';

import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface SectionProps {
  className?: string;
  children: React.ReactNode;
}

const Section = ({ className, children }: SectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn('relative', className)}
    >
      {children}
    </motion.section>
  );
};

export default Section;
