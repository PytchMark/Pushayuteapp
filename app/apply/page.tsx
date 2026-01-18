const ApplyPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-32">
      <header className="mb-16">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
          Join the <span className="text-brand-red">Roster</span>
        </h1>
        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">
          Verified talent only. Tell us who you are.
        </p>
      </header>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
            Stage Name
          </label>
          <input
            required
            type="text"
            className="w-full bg-zinc-900 border border-zinc-800 p-4 focus:border-brand-red outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
            Primary Category
          </label>
          <input
            required
            type="text"
            placeholder="DJ, Band, Poet, etc."
            className="w-full bg-zinc-900 border border-zinc-800 p-4 focus:border-brand-red outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
            City
          </label>
          <input
            required
            type="text"
            className="w-full bg-zinc-900 border border-zinc-800 p-4 focus:border-brand-red outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
            Country
          </label>
          <input
            required
            type="text"
            className="w-full bg-zinc-900 border border-zinc-800 p-4 focus:border-brand-red outline-none transition-all"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
            Short Bio
          </label>
          <textarea
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-800 p-4 focus:border-brand-red outline-none transition-all"
            placeholder="Tell us about your signature sound, clients, or notable bookings."
          ></textarea>
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
            Showcase Links
          </label>
          <input
            required
            type="text"
            placeholder="YouTube / Instagram / Press Kit URL"
            className="w-full bg-zinc-900 border border-zinc-800 p-4 focus:border-brand-red outline-none transition-all"
          />
        </div>

        <div className="md:col-span-2 pt-6">
          <button
            type="submit"
            className="w-full bg-brand-red text-white py-6 text-xl font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all active:scale-[0.98]"
          >
            Submit Application
          </button>
          <p className="mt-6 text-center text-zinc-500 text-xs italic font-medium uppercase tracking-widest">
            A representative will review your submission within 48 hours.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ApplyPage;
