
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Talent } from '../types';

interface TalentCardProps {
  talent: Talent;
}

const TalentCard: React.FC<TalentCardProps> = ({ talent }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <Link 
        to={`/talent/${talent.slug}`}
        className="group relative block bg-zinc-900 rounded-3xl overflow-hidden aspect-[3/4]"
      >
        <motion.img 
          src={talent.hero_image || `https://picsum.photos/seed/${talent.id}/800/1000`} 
          alt={talent.stage_name}
          className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>
        
        <div className="absolute top-6 right-6">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-[8px] uppercase font-bold tracking-widest"
           >
             {talent.categories[0]}
           </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 p-8 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="text-3xl font-bold uppercase tracking-tighter mb-1 leading-none">{talent.stage_name}</h3>
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest mb-6 font-bold">{talent.city} &bull; {talent.country}</p>
          
          <motion.div 
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          >
            <span className="inline-block bg-brand-red text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
              Request Booking
            </span>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TalentCard;
