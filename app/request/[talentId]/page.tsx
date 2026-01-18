'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const BookingRequestPage = () => {
  const params = useParams<{ talentId: string }>();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-xl text-center">
          <div className="bg-brand-red w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Request Received.</h1>
          <p className="text-zinc-400 text-lg leading-relaxed mb-10">
            Our coordination team has been notified. We will review availability and logistics for
            your event and contact you within 24 hours.
          </p>
          <button
            onClick={() => router.push('/roster')}
            className="bg-white text-black px-10 py-4 font-black uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all"
          >
            Return to Roster
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <header className="mb-16 border-b border-zinc-800 pb-10">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
          Booking <span className="text-brand-red">Request</span>
        </h1>
        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">
          Professional Coordination for Professional Events
        </p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <input type="hidden" value={params?.talentId ?? ''} readOnly />
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
            Contact Name
          </label>
          <input
            required
            type="text"
            className="w-full bg-zinc-900 border border-zinc-800 p-4 focus:border-brand-red outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
            Contact Email
          </label>
          <input
            required
            type="email"
            className="w-full bg-zinc-900 border border-zinc-800 p-4 focus:border-brand-red outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
            Event Type
          </label>
          <select className="w-full bg-zinc-900 border border-zinc-800 p-4 focus:border-brand-red outline-none transition-all appearance-none">
            <option>Festival</option>
            <option>Corporate Event</option>
            <option>Wedding</option>
            <option>Private Party</option>
            <option>Brand Activation</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
            Event Date
          </label>
          <input
            required
            type="date"
            className="w-full bg-zinc-900 border border-zinc-800 p-4 focus:border-brand-red outline-none transition-all text-white invert-calendar"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
            Venue &amp; Location
          </label>
          <input
            required
            type="text"
            placeholder="e.g. O2 Indigo, London"
            className="w-full bg-zinc-900 border border-zinc-800 p-4 focus:border-brand-red outline-none transition-all"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
            Additional Notes / Logistics
          </label>
          <textarea
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-800 p-4 focus:border-brand-red outline-none transition-all"
            placeholder="Tell us about the technical requirements, budget range, or specific needs."
          ></textarea>
        </div>

        <div className="md:col-span-2 pt-10">
          <button
            type="submit"
            className="w-full bg-brand-red text-white py-6 text-xl font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all active:scale-[0.98]"
          >
            Submit Inquiry
          </button>
          <p className="mt-6 text-center text-zinc-500 text-xs italic font-medium uppercase tracking-widest">
            Submission implies agreement to our professional terms of service.
          </p>
        </div>
      </form>
    </div>
  );
};

export default BookingRequestPage;
