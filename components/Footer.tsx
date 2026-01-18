'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/5 py-32 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
        <div className="max-w-sm">
          <Link href="/" className="text-2xl font-black tracking-tighter block mb-6">
            BOOK-A-YUTE
          </Link>
          <p className="text-zinc-500 text-sm leading-relaxed mb-8 font-medium">
            Representing the elite in performance talent. Powered by{' '}
            <span className="text-white font-bold">Pytch Marketing</span>. Exclusivity isn't a
            buzzword; it's our operating system.
          </p>
          <div className="flex gap-4">
            {['IG', 'TW', 'YT'].map((social) => (
              <span
                key={social}
                className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center hover:bg-brand-red transition-all cursor-pointer text-[10px] font-black group"
              >
                <span className="group-hover:scale-110 transition-transform">{social}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-16 text-sm">
          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-[10px] text-zinc-400">Roster</h4>
            <div className="space-y-3 font-bold uppercase text-[11px] tracking-widest">
              <Link href="/roster" className="block text-zinc-600 hover:text-brand-red transition-colors">
                The Roster
              </Link>
              <Link href="/roster" className="block text-zinc-600 hover:text-brand-red transition-colors">
                DJs
              </Link>
              <Link href="/roster" className="block text-zinc-600 hover:text-brand-red transition-colors">
                Performance Bands
              </Link>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-[10px] text-zinc-400">Talent</h4>
            <div className="space-y-3 font-bold uppercase text-[11px] tracking-widest">
              <Link href="/login" className="block text-zinc-600 hover:text-brand-red transition-colors">
                Member Portal
              </Link>
              <Link href="/apply" className="block text-zinc-600 hover:text-brand-red transition-colors">
                Apply For Representation
              </Link>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-[10px] text-zinc-400">Agency</h4>
            <div className="space-y-3 font-bold uppercase text-[11px] tracking-widest text-zinc-600">
              <span className="block">Contact Agent</span>
              <span className="block">Privacy &amp; Ethics</span>
              <span className="block">Terms of Booking</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-[0.4em] font-black text-zinc-700">
        <p>&copy; 2025 Push-A-Yute. All Rights Reserved.</p>
        <p className="mt-4 md:mt-0 italic">Built for the top 1%.</p>
      </div>
    </footer>
  );
};

export default Footer;
