
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import TalentCard from '../components/TalentCard';
import { Talent, TalentStatus, SubscriptionTier } from '../types';

const MOCK_FEATURED: Talent[] = [
  { id: '1', slug: 'dj-phantom-kingston', stage_name: 'DJ Phantom', bio: '...', city: 'Kingston', country: 'Jamaica', categories: ['DJ'], genres: ['Dancehall'], status: TalentStatus.APPROVED, visibility: true, featured: true, subscription_tier: SubscriptionTier.PRO },
  { id: '3', slug: 'rhythm-collective-nyc', stage_name: 'The Rhythm Collective', bio: '...', city: 'New York', country: 'USA', categories: ['Band'], genres: ['Jazz'], status: TalentStatus.APPROVED, visibility: true, featured: true, subscription_tier: SubscriptionTier.ELITE },
  { id: '2', slug: 'blaze-rebel-london', stage_name: 'Blaze Rebel', bio: '...', city: 'London', country: 'UK', categories: ['Poet'], genres: ['Spoken Word'], status: TalentStatus.APPROVED, visibility: true, featured: false, subscription_tier: SubscriptionTier.ELITE },
];

const HomePage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const eventTypes = [
    "Festivals", "Corporate", "Weddings", "Brand Activations", 
    "Private Parties", "Nightlife", "Hotels/Resorts", "Conferences", 
    "Cultural Showcases", "Campus Events"
  ];

  const artistNames = [
    "DJ PHANTOM", "BLAZE REBEL", "RHYTHM COLLECTIVE", "MC HYPE", 
    "ZARA VIBES", "KNG SLY", "THE PROPHET", "MISTY BLUE"
  ];

  return (
    <div className="relative overflow-hidden bg-black selection:bg-brand-red selection:text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-6 overflow-hidden">
        <motion.div style={{ opacity }} className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover grayscale brightness-[0.2]">
            <source src="https://storage.googleapis.com/samplemedia1/12100535_3840_2160_24fps.mp4" type="video/mp4" />
          </video>
        </motion.div>
        
        <div className="relative z-10 max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block border border-white/20 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8 bg-white/5 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              Exclusive Agency Representation
            </span>
            <h1 className="text-6xl md:text-[11rem] font-black tracking-tighter uppercase mb-8 leading-[0.82] drop-shadow-2xl">
              BOOK-A-<span className="text-brand-red">YUTE.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 font-light mb-12 max-w-2xl mx-auto tracking-wide leading-relaxed">
              Curated roster powered by Push-A-Yute. Represented professionally. <br className="hidden md:block" /> Booked properly. No DM gymnastics.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/roster" className="w-full sm:w-auto bg-brand-red text-white px-14 py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(226,29,29,0.4)]">
                View The Roster
              </Link>
              <Link to="/roster" className="w-full sm:w-auto bg-white/5 backdrop-blur-xl border border-white/20 text-white px-14 py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] hover:bg-white hover:text-black transition-all hover:scale-105 active:scale-95">
                Request Talent
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 1) EVENTS WE COVER */}
      <section className="py-40 bg-black relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6"
            >
              Booked for the <span className="text-brand-red">moments that matter.</span>
            </h2 >
            <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Tell us the event. We’ll match the talent.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {eventTypes.map((type, i) => (
              <motion.div 
                key={type}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl text-center hover:border-brand-red/50 transition-colors cursor-default"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{type}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link to="/roster" className="inline-block bg-brand-red text-white px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:shadow-[0_0_40px_rgba(226,29,29,0.3)] transition-all">
              Request Talent
            </Link>
          </div>
        </div>
        {/* Subtle Marquee Overlay */}
        <div className="absolute top-1/2 left-0 w-full opacity-[0.03] pointer-events-none -translate-y-1/2">
           <div className="animate-marquee whitespace-nowrap text-[15rem] font-black uppercase">
             {eventTypes.join(" • ")} • {eventTypes.join(" • ")}
           </div>
        </div>
      </section>

      {/* 2) FEATURED ARTISTS */}
      <section className="py-40 bg-zinc-950 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Featured <span className="text-brand-red">Curations.</span></h2>
              <p className="text-zinc-500 mt-4 font-bold uppercase tracking-widest text-[10px]">Hand-picked for immediate booking</p>
            </div>
            <Link to="/roster" className="hidden md:block text-xs font-black uppercase tracking-widest text-brand-red border-b-2 border-brand-red pb-1">Browse Full Roster</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {MOCK_FEATURED.map(talent => (
              <div key={talent.id} className="perspective-1000">
                <motion.div
                  whileHover={{ rotateY: 5, rotateX: -5, y: -10 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <TalentCard talent={talent} />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3) ALREADY SIGNED MARQUEE */}
      <section className="py-40 bg-black relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-brand-red/5 blur-[120px]"></div>
        <div className="relative z-10 text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Talent already <span className="text-brand-red italic">moving with us.</span></h2>
          <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">If you’re ready for real bookings, apply below.</p>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="animate-marquee whitespace-nowrap flex gap-8">
            {[...artistNames, ...artistNames].map((name, i) => (
              <div key={i} className="bg-zinc-900/80 backdrop-blur-md px-10 py-4 rounded-full border border-white/10 text-zinc-300 font-black text-xs uppercase tracking-[0.4em]">
                {name}
              </div>
            ))}
          </div>
          <div className="animate-marquee-reverse whitespace-nowrap flex gap-8">
            {[...artistNames, ...artistNames].reverse().map((name, i) => (
              <div key={i} className="bg-zinc-900/80 backdrop-blur-md px-10 py-4 rounded-full border border-brand-red/20 text-brand-red font-black text-xs uppercase tracking-[0.4em]">
                {name}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 text-center relative z-10">
          <Link to="/login" className="inline-block px-12 py-5 rounded-2xl border-2 border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-red hover:border-brand-red transition-all">
            Join the Roster
          </Link>
        </div>
      </section>

      {/* 4) BOOK WITH US (CLOSER) */}
      <section className="py-40 bg-zinc-950 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12">Book talent the <span className="text-brand-red">professional way.</span></h2>
            <div className="space-y-10">
              {[
                { step: "01", title: "Submit Request", desc: "Fill out the high-level details of your event and talent needs." },
                { step: "02", title: "Review Terms", desc: "Our agents confirm availability, riders, and logistical requirements." },
                { step: "03", title: "Get The Show", desc: "Contract finalized. Talent arrives. Professional delivery guaranteed." }
              ].map((item) => (
                <div key={item.step} className="flex gap-8 group">
                  <span className="text-brand-red font-black text-2xl tracking-tighter opacity-30 group-hover:opacity-100 transition-opacity">{item.step}</span>
                  <div>
                    <h4 className="text-xl font-bold uppercase tracking-tight mb-2">{item.title}</h4>
                    <p className="text-zinc-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-zinc-900/50 border border-white/10 p-12 rounded-[3rem] text-center shadow-3xl">
            <div className="mb-10 space-y-4">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-brand-red"></div>)}
              </div>
              <p className="text-xs uppercase font-black tracking-[0.4em] text-zinc-500">Verified & Represented</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative group inline-block w-full"
            >
              <div className="absolute -inset-1 bg-brand-red rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <Link to="/roster" className="relative block w-full bg-brand-red text-white py-8 rounded-2xl text-2xl font-black uppercase tracking-[0.2em] shadow-2xl">
                BOOK NOW
              </Link>
            </motion.div>
            <p className="mt-8 text-zinc-600 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
              Trusted by the world's leading brands and festival organizers. <br/> No middleman friction.
            </p>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-10 right-10 z-[150] w-16 h-16 bg-brand-red rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(226,29,29,0.5)] border border-white/20"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </motion.button>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center px-6 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20, rotate: -1 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              className="bg-zinc-900 border border-white/10 p-12 rounded-[2.5rem] max-w-lg w-full text-center shadow-[0_0_100px_rgba(0,0,0,0.8)] relative"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round"/></svg>
              </button>

              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 italic text-brand-red">Welcome.</h2>
              <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-10">Choose your entry point</p>
              
              <div className="space-y-4">
                <Link 
                  to="/roster"
                  onClick={() => setShowModal(false)}
                  className="block w-full py-6 rounded-2xl bg-brand-red text-white font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-[0_0_30px_rgba(226,29,29,0.2)]"
                >
                  Book an Artist
                </Link>
                <Link 
                  to="/login"
                  onClick={() => setShowModal(false)}
                  className="block w-full py-6 rounded-2xl border border-white/10 bg-black/50 text-white font-black uppercase tracking-widest text-xs hover:border-brand-red transition-all"
                >
                  Join the Roster
                </Link>
              </div>
              
              <p className="mt-10 text-[9px] uppercase font-bold text-zinc-600 tracking-[0.4em]">Represented by Push-A-Yute</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-reverse {
          display: flex;
          width: 200%;
          animation: marquee-reverse 30s linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
