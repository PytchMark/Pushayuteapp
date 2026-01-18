'use client';

import { cn } from '../lib/utils';

interface MarqueeProps {
  items: string[];
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
}

const Marquee = ({ items, reverse, className, itemClassName }: MarqueeProps) => {
  const doubled = [...items, ...items];
  return (
    <div
      className={cn(
        reverse ? 'animate-marquee-reverse' : 'animate-marquee',
        'whitespace-nowrap flex gap-8',
        className
      )}
    >
      {doubled.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className={cn(
            'bg-zinc-900/80 backdrop-blur-md px-10 py-4 rounded-full border border-white/10 text-zinc-300 font-black text-xs uppercase tracking-[0.4em]',
            itemClassName
          )}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default Marquee;
