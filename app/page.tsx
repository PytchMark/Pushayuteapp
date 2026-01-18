'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import TalentCard from '../components/TalentCard';
import Marquee from '../components/Marquee';
import GlowButton from '../components/GlowButton';
import { featuredTalents } from '../lib/demoTalents';
import { useEntryModal } from '../components/EntryModal';

const HomePage = () => {
  const [showAutoPrompt, setShowAutoPrompt] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const { openModal } = useEntryModal();

  useEffect(() => {
    const timer = setTimeout(() => setShowAutoPrompt(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showAutoPrompt) {
      openModal('book');
      setShowAutoPrompt(false);
    }
  }, [showAutoPrompt, openModal]);

  const eventTypes = [
    'Festivals',
    'Corporate',
    'Weddings',
    'Brand Activations',
    'Private Parties',
    'Nightlife',
    'Hotels/Resorts',
    'Conferences',
    'Cultural Showcases',
    'Campus Events',
  ];

  const artistNames = [
    'DJ PHANTOM',
    'BLAZE REBEL',
    'RHYTHM COLLECTIVE',
    'MC HYPE',
    'ZARA VIBES',
    'KNG SLY',
    'THE PROPHET',
    'MISTY BLUE',
  ];

  return (
    <div className="relative overflow-hidden bg-black selection:bg-brand-red selection:text-white">
      <section className="relative h-screen flex items-center justify-center px-6 overflow-hidden">
        <motion.div style={{ opacity }} className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover grayscale brightness-[0.2]"
          >
            <source
              src="https://storage.googleapis.com/samplemedia1/12100535_3840_2160_24fps.mp4"
              type="video/mp4"
            />
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
              Curated roster powered by Push-A-Yute. Represented professionally.{' '}
              <br className="hidden md:block" /> Booked properly. No DM gymnastics.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/roster"
                className="w-full sm:w-auto bg-brand-red text-white px-14 py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(226,29,29,0.4)]"
              >
                View The Roster
              </Link>
              <button
                type="button"
                onClick={() => openModal('book')}
                className="w-full sm:w-auto bg-white/5 backdrop-blur-xl border border-white/20 text-white px-14 py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] hover:bg-white hover:text-black transition-all hover:scale-105 active:scale-95"
              >
                Request Talent
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-40 bg-black relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6"
            >
              Booked for the <span className="text-brand-red">moments that matter.</span>
            </motion.h2>
            <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">
              Tell us the event. We’ll match the talent.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {eventTypes.map((type) => (
              <motion.div
                key={type}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl text-center hover:border-brand-red/50 transition-colors cursor-default"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                  {type}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <GlowButton className="inline-block">
              <button
                type="button"
                onClick={() => openModal('book')}
                className="inline-block bg-brand-red text-white px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:shadow-[0_0_40px_rgba(226,29,29,0.3)] transition-all"
              >
                Request Talent
              </button>
            </GlowButton>
          </div>
        </div>
        <div className="absolute top-1/2 left-0 w-full opacity-[0.03] pointer-events-none -translate-y-1/2">
          <div className="animate-marquee whitespace-nowrap text-[15rem] font-black uppercase">
            {eventTypes.join(' • ')} • {eventTypes.join(' • ')}
          </div>
        </div>
      </section>

      <section className="py-40 bg-zinc-950 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                Featured <span className="text-brand-red">Curations.</span>
              </h2>
              <p className="text-zinc-500 mt-4 font-bold uppercase tracking-widest text-[10px]">
                Hand-picked for immediate booking
              </p>
            </div>
            <Link
              href="/roster"
              className="hidden md:block text-xs font-black uppercase tracking-widest text-brand-red border-b-2 border-brand-red pb-1"
            >
              Browse Full Roster
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredTalents.map((talent) => (
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

      <section className="py-40 bg-black relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-brand-red/5 blur-[120px]"></div>
        <div className="relative z-10 text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Talent already <span className="text-brand-red italic">moving with us.</span>
          </h2>
          <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">
            If you’re ready for real bookings, apply below.
          </p>
        </div>

        <div className="space-y-8 relative z-10">
          <Marquee items={artistNames} />
          <Marquee
            items={[...artistNames].reverse()}
            reverse
            itemClassName="text-brand-red border-brand-red/20"
          />
        </div>

        <div className="mt-24 text-center relative z-10">
          <button
            type="button"
            onClick={() => openModal('join')}
            className="inline-block px-12 py-5 rounded-2xl border-2 border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-red hover:border-brand-red transition-all"
          >
            Join the Roster
          </button>
        </div>
      </section>

      <section className="py-40 bg-zinc-950 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12">
              Book talent the <span className="text-brand-red">professional way.</span>
            </h2>
            <div className="space-y-10">
              {[
                {
                  step: '01',
                  title: 'Submit Request',
                  desc: 'Fill out the high-level details of your event and talent needs.',
                },
                {
                  step: '02',
                  title: 'Review Terms',
                  desc: 'Our agents confirm availability, riders, and logistical requirements.',
                },
                {
                  step: '03',
                  title: 'Get The Show',
                  desc: 'Contract finalized. Talent arrives. Professional delivery guaranteed.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-8 group">
                  <span className="text-brand-red font-black text-2xl tracking-tighter opacity-30 group-hover:opacity-100 transition-opacity">
                    {item.step}
                  </span>
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
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-brand-red"></div>
                ))}
              </div>
              <p className="text-xs uppercase font-black tracking-[0.4em] text-zinc-500">
                Verified & Represented
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} className="relative group inline-block w-full">
              <div className="absolute -inset-1 bg-brand-red rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <button
                type="button"
                onClick={() => openModal('book')}
                className="relative block w-full bg-brand-red text-white py-8 rounded-2xl text-2xl font-black uppercase tracking-[0.2em] shadow-2xl"
              >
                BOOK NOW
              </button>
            </motion.div>
            <p className="mt-8 text-zinc-600 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
              Trusted by the world's leading brands and festival organizers. <br /> No middleman
              friction.
            </p>
          </div>
        </div>
      </section>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => openModal('book')}
        className="fixed bottom-10 right-10 z-[150] w-16 h-16 bg-brand-red rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(226,29,29,0.5)] border border-white/20"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </motion.button>

    </div>
  );
};

export default HomePage;
