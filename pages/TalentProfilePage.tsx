
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { TalentStatus, SubscriptionTier } from '../types';

const TalentProfilePage: React.FC = () => {
  const { slug } = useParams();

  // Mock finding talent by slug
  const talent = {
    id: '1',
    slug: 'dj-phantom-kingston',
    stage_name: 'DJ Phantom',
    bio: 'Renowned for his surgical precision on the decks and an unmatched library of rare dubplates, DJ Phantom has dominated the Kingston scene for over a decade. Represented exclusively by Push A Yute, he brings professional-grade energy to festivals, private events, and high-profile brand activations worldwide.',
    city: 'Kingston',
    country: 'Jamaica',
    categories: ['DJ'],
    genres: ['Dancehall', 'Reggae', 'Hip-Hop'],
    status: TalentStatus.APPROVED,
    visibility: true,
    featured: true,
    subscription_tier: SubscriptionTier.PRO,
    ideal_for: ['Festivals', 'Corporate Events', 'Premium Club Nights', 'Brand Launches']
  };

  return (
    <div className="bg-black min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${slug}/1920/1080`} 
          alt={talent.stage_name}
          className="w-full h-full object-cover grayscale brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-10 md:p-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-brand-red text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5">
              Verified Artist
            </span>
            <span className="text-zinc-300 text-[10px] font-bold uppercase tracking-[0.2em]">
              {talent.categories[0]}
            </span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-4">
            {talent.stage_name}
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 font-light tracking-wide uppercase">
            {talent.city}, {talent.country}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-16">
        <div className="md:col-span-2 space-y-16">
          <section>
            <h2 className="text-xs font-black text-brand-red uppercase tracking-[0.3em] mb-6">Representation</h2>
            <div className="bg-zinc-900 border-l-4 border-brand-red p-8">
              <p className="text-lg leading-relaxed text-zinc-300">
                {talent.stage_name} is represented and coordinated through the Push A Yute team. All booking inquiries, technical riders, and logistical requirements are handled by our designated agents to ensure professional delivery.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mb-6">Biography</h2>
            <p className="text-2xl font-light text-white leading-relaxed tracking-tight">
              {talent.bio}
            </p>
          </section>

          <section>
            <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mb-6">Curation & Expertise</h2>
            <div className="flex flex-wrap gap-10">
              <div>
                <h4 className="text-zinc-500 text-xs font-bold uppercase mb-4">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {talent.genres.map(g => (
                    <span key={g} className="border border-zinc-800 px-4 py-2 text-sm uppercase">{g}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-zinc-500 text-xs font-bold uppercase mb-4">Ideal For</h4>
                <div className="flex flex-wrap gap-2">
                  {talent.ideal_for.map(i => (
                    <span key={i} className="bg-zinc-900 px-4 py-2 text-sm uppercase">{i}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <div className="bg-zinc-900 p-10 border border-zinc-800 sticky top-32">
            <h3 className="text-2xl font-bold uppercase mb-2 tracking-tighter">Booking Inquiry</h3>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
              Our team responds to serious inquiries within 24 hours. No public rates. No direct DMs.
            </p>
            <Link 
              to={`/request/${talent.id}`}
              className="block w-full bg-brand-red text-white py-5 text-center font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl"
            >
              Request Booking
            </Link>
            <div className="mt-8 pt-8 border-t border-zinc-800 space-y-4">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                <span>Availability</span>
                <span className="text-green-500">Open</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                <span>Travel</span>
                <span>Worldwide</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TalentProfilePage;
