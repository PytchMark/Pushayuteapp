
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TalentCard from '../components/TalentCard';
import { Talent, TalentStatus, SubscriptionTier } from '../types';

const MOCK_TALENTS: Talent[] = [
  { id: '1', slug: 'dj-phantom-kingston', stage_name: 'DJ Phantom', bio: 'The heavy hitter of Kingston night life.', city: 'Kingston', country: 'Jamaica', categories: ['DJ'], genres: ['Dancehall', 'Reggae'], status: TalentStatus.APPROVED, visibility: true, featured: true, subscription_tier: SubscriptionTier.PRO },
  { id: '2', slug: 'blaze-rebel-london', stage_name: 'Blaze Rebel', bio: 'Spoken word that hits like a freight train.', city: 'London', country: 'UK', categories: ['Poet'], genres: ['Spoken Word'], status: TalentStatus.APPROVED, visibility: true, featured: false, subscription_tier: SubscriptionTier.ELITE },
  { id: '3', slug: 'rhythm-collective-nyc', stage_name: 'The Rhythm Collective', bio: 'A world-class band for high-tier corporate events.', city: 'New York', country: 'USA', categories: ['Band'], genres: ['Jazz', 'Fusion'], status: TalentStatus.APPROVED, visibility: true, featured: true, subscription_tier: SubscriptionTier.ELITE },
  { id: '4', slug: 'mc-hype-toronto', stage_name: 'MC Hype', bio: 'Energetic hosting that keeps the crowd engaged.', city: 'Toronto', country: 'Canada', categories: ['Host'], genres: ['Hip-Hop'], status: TalentStatus.APPROVED, visibility: true, featured: false, subscription_tier: SubscriptionTier.PRO },
];

const RosterPage: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'DJ', 'Band', 'Singer', 'Host', 'Poet', 'Dancer'];

  const filteredTalents = filter === 'All' 
    ? MOCK_TALENTS 
    : MOCK_TALENTS.filter(t => t.categories.includes(filter));

  return (
    <div className="max-w-7xl mx-auto px-6 py-40">
      <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none"
          >
            The <span className="text-brand-red italic">Roster.</span>
          </motion.h1>
          <p className="text-zinc-500 text-lg md:text-xl font-light tracking-wide leading-relaxed">
            Our talent roster is a curated list of performers represented through Pytch Marketing. Every artist here is professionally vetted for the stage.
          </p>
        </div>
        <div className="flex flex-col gap-4 bg-zinc-900/50 p-6 rounded-3xl border border-white/5 md:w-80">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-red">How it works</span>
          <p className="text-[11px] text-zinc-400 font-bold uppercase leading-relaxed tracking-wider">
            1. Select Talent <br/> 
            2. Submit Request <br/> 
            3. Our Agent Coordinates
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-20">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              filter === cat 
              ? 'bg-brand-red text-white shadow-xl scale-105' 
              : 'bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
      >
        {filteredTalents.map(talent => (
          <TalentCard key={talent.id} talent={talent} />
        ))}
      </motion.div>

      {filteredTalents.length === 0 && (
        <div className="py-40 text-center">
          <p className="text-xl uppercase tracking-[0.3em] font-black text-zinc-700">Category currently empty.</p>
        </div>
      )}
    </div>
  );
};

export default RosterPage;
