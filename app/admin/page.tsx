const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
            Agency <span className="text-brand-red">Admin</span>
          </h1>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest italic">
            Quality Control &amp; Pipeline Management
          </p>
        </div>
        <button className="bg-brand-red text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all">
          Invite New Talent
        </button>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-6">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Talent Pipeline</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-bold uppercase">
              <span className="text-zinc-300">Pending Review</span>
              <span className="bg-brand-red w-6 h-6 rounded-full flex items-center justify-center text-[10px]">
                3
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold uppercase">
              <span className="text-zinc-300">Approved Artists</span>
              <span className="text-zinc-500">12</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 p-8">
            <h3 className="text-xl font-bold uppercase mb-8 tracking-tight">Active Booking Pipeline</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-900">
                    <th className="pb-4 text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                      Talent
                    </th>
                    <th className="pb-4 text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                      Client
                    </th>
                    <th className="pb-4 text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                      Status
                    </th>
                    <th className="pb-4 text-[10px] uppercase tracking-widest text-zinc-500 font-black text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {[
                    { talent: 'DJ Phantom', client: 'Sumfest Org', status: 'Negotiating' },
                    { talent: 'Blaze Rebel', client: 'Google UK', status: 'New Request' },
                    { talent: 'MC Hype', client: 'RBC Royal Bank', status: 'Booked' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="py-6 font-bold uppercase text-sm">{row.talent}</td>
                      <td className="py-6 text-zinc-400 text-sm">{row.client}</td>
                      <td className="py-6">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-1 rounded-sm ${
                            row.status === 'Booked'
                              ? 'bg-green-900/50 text-green-400'
                              : 'bg-brand-red/10 text-brand-red'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-6 text-right">
                        <button className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
