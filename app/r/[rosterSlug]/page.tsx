'use client';

import { useSearchParams } from 'next/navigation';
import TalentCard from '../../../components/TalentCard';
import { demoTalents } from '../../../lib/demoTalents';

const PrivateRosterPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const isValidToken = token === 'vip-2024-client';

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center p-10 border border-zinc-900 bg-zinc-950 max-w-md">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">
            Restricted <span className="text-brand-red">Access</span>
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed mb-8 uppercase tracking-widest font-bold">
            This curated selection is private. Please provide a valid access token.
          </p>
          <input
            type="password"
            placeholder="ACCESS TOKEN"
            className="w-full bg-black border border-zinc-800 p-4 text-center text-sm outline-none focus:border-brand-red mb-4"
          />
          <button className="w-full bg-brand-red text-white py-4 font-black uppercase tracking-widest">
            Enter Vault
          </button>
        </div>
      </div>
    );
  }

  const mockPrivateTalents = demoTalents.slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <header className="mb-16 border-l-4 border-brand-red pl-8">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
          Private <span className="text-brand-red">Selection.</span>
        </h1>
        <p className="text-zinc-500 uppercase tracking-widest text-xs font-black">
          Curated for: Barclays Global Summit 2024
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {mockPrivateTalents.map((talent) => (
          <div key={talent.id} className="space-y-4">
            <TalentCard talent={talent} />
            <div className="bg-zinc-900 p-6 border border-zinc-800">
              <h4 className="text-xs font-black uppercase text-brand-red tracking-widest mb-2">
                Agent Note
              </h4>
              <p className="text-zinc-400 text-sm italic">
                "Highly recommended for the opening night gala. Clean performance with massive
                energy."
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivateRosterPage;
