const TalentDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <header className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
          Member <span className="text-brand-red">Dashboard</span>
        </h1>
        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">
          Status: <span className="text-green-500">Active Roster Member</span>
        </p>
      </header>

      <div className="grid md:grid-cols-4 gap-8">
        <aside className="space-y-2">
          {['Roster Profile', 'Media Assets', 'Booking Inquiries', 'Subscription'].map((item) => (
            <button
              key={item}
              className="w-full text-left p-4 text-xs font-black uppercase tracking-widest border border-zinc-900 hover:border-brand-red hover:bg-zinc-900 transition-all"
            >
              {item}
            </button>
          ))}
        </aside>

        <div className="md:col-span-3 space-y-8">
          <section className="bg-zinc-950 border border-zinc-900 p-8">
            <h3 className="text-xl font-bold uppercase mb-6 tracking-tight">Active Representation</h3>
            <div className="flex items-center gap-6 p-6 bg-zinc-900">
              <div className="w-20 h-20 bg-brand-red/10 border border-brand-red/30 flex items-center justify-center">
                <span className="text-brand-red font-black text-2xl">P.A.Y</span>
              </div>
              <div>
                <p className="font-bold text-white uppercase text-sm">Push A Yute Entertainment</p>
                <p className="text-zinc-500 text-xs mt-1">Primary Agent: Marcus Thorne</p>
                <p className="text-zinc-400 text-xs mt-2 underline cursor-pointer">
                  Contact Representative
                </p>
              </div>
            </div>
          </section>

          <section className="bg-zinc-950 border border-zinc-900 p-8">
            <h3 className="text-xl font-bold uppercase mb-6 tracking-tight">Recent Inquiries</h3>
            <div className="space-y-4">
              {[
                { date: 'Oct 12', event: 'Reggae Sumfest', status: 'Negotiating' },
                { date: 'Oct 15', event: 'Corporate Gala - Kingston', status: 'Contacted' },
              ].map((q, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-zinc-900 border border-zinc-800">
                  <div>
                    <p className="text-white font-bold text-sm uppercase">{q.event}</p>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold mt-1">{q.date}</p>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-3 py-1 bg-zinc-800 ${
                      q.status === 'Negotiating' ? 'text-brand-red' : 'text-zinc-400'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-zinc-500 text-[10px] uppercase tracking-widest font-bold italic">
              *All negotiations are handled by Push A Yute on your behalf.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TalentDashboard;
