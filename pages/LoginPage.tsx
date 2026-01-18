
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-black">
      <div className="w-full max-w-md space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Talent <span className="text-brand-red">Portal</span></h1>
          <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">Secure Access for Roster Members Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500">Corporate Email</label>
            <input type="email" required className="w-full bg-zinc-900 border border-zinc-800 p-4 focus:border-brand-red outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500">Secure Password</label>
            <input type="password" required className="w-full bg-zinc-900 border border-zinc-800 p-4 focus:border-brand-red outline-none transition-all" />
          </div>
          <button type="submit" className="w-full bg-brand-red text-white py-5 font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg">
            Login to Roster
          </button>
        </form>

        <div className="text-center pt-8 border-t border-zinc-900">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold mb-4">Not on the roster yet?</p>
          <button className="text-white hover:text-brand-red transition-colors text-xs font-black uppercase tracking-widest">
            Request Representation
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
