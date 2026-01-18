'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import GlowButton from './GlowButton';

export type EntryMode = 'book' | 'join';

interface EntryModalContextValue {
  openModal: (mode?: EntryMode) => void;
  closeModal: () => void;
}

const EntryModalContext = createContext<EntryModalContextValue | null>(null);

export const useEntryModal = () => {
  const context = useContext(EntryModalContext);
  if (!context) {
    throw new Error('useEntryModal must be used within EntryModalProvider');
  }
  return context;
};

const EntryModal = ({ isOpen, mode, onClose }: { isOpen: boolean; mode: EntryMode; onClose: () => void }) => {
  const [activeMode, setActiveMode] = useState<EntryMode>(mode);

  useEffect(() => {
    setActiveMode(mode);
  }, [mode]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-6 bg-black/90 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, rotate: -1 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="bg-zinc-900 border border-white/10 p-12 rounded-[2.5rem] max-w-xl w-full text-center shadow-[0_0_100px_rgba(0,0,0,0.8)] relative"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>

            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 italic text-brand-red">
              Welcome.
            </h2>
            <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-10">
              Choose your entry point
            </p>

            <div className="flex items-center justify-center gap-4 mb-10">
              {(['book', 'join'] as EntryMode[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveMode(tab)}
                  className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.4em] font-black transition-all ${
                    activeMode === tab
                      ? 'bg-brand-red text-white shadow-[0_0_30px_rgba(226,29,29,0.35)]'
                      : 'bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab === 'book' ? 'Book' : 'Join'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <GlowButton className="shadow-[0_0_30px_rgba(226,29,29,0.2)]">
                <Link
                  href="/roster"
                  onClick={onClose}
                  className="block w-full py-6 rounded-2xl bg-brand-red text-white font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all"
                >
                  Book an Artist
                </Link>
              </GlowButton>
              <GlowButton className="shadow-[0_0_20px_rgba(255,255,255,0.06)]">
                <Link
                  href="/apply"
                  onClick={onClose}
                  className={`block w-full py-6 rounded-2xl border border-white/10 bg-black/50 text-white font-black uppercase tracking-widest text-xs transition-all ${
                    activeMode === 'join' ? 'hover:border-brand-red' : 'hover:border-white/40'
                  }`}
                >
                  Join the Roster
                </Link>
              </GlowButton>
            </div>

            <p className="mt-10 text-[9px] uppercase font-bold text-zinc-600 tracking-[0.4em]">
              Represented by Push-A-Yute
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const EntryModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<EntryMode>('book');

  const openModal = useCallback((nextMode: EntryMode = 'book') => {
    setMode(nextMode);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  const value = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);

  return (
    <EntryModalContext.Provider value={value}>
      {children}
      <EntryModal isOpen={isOpen} mode={mode} onClose={closeModal} />
    </EntryModalContext.Provider>
  );
};
