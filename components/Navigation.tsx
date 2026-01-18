
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-6 pointer-events-none">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ 
          y: [0, -2, 0],
          opacity: 1 
        }}
        transition={{ 
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }}
        className="max-w-7xl mx-auto h-16 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-between px-8 pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(226,29,29,0.05)] relative overflow-hidden"
      >
        {/* Subtle internal glow */}
        <div className="absolute inset-0 bg-brand-red/5 pointer-events-none blur-2xl"></div>
        
        <Link to="/" className="text-xl font-extrabold tracking-tighter flex items-center gap-3 relative z-10">
          <motion.span 
            animate={{ 
              scale: [1, 1.3, 1],
              boxShadow: ["0 0 0px #E21D1D", "0 0 15px #E21D1D", "0 0 0px #E21D1D"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="bg-brand-red w-2.5 h-2.5 rounded-full"
          ></motion.span>
          BOOK-A-YUTE <span className="font-light text-zinc-500 hidden sm:inline tracking-widest text-[10px] ml-1">PUSH-A-YUTE</span>
        </Link>
        
        <div className="flex items-center gap-6 md:gap-10 text-[10px] font-bold tracking-[0.25em] uppercase relative z-10">
          <Link to="/roster" className="hover:text-brand-red transition-colors hidden sm:block">Roster</Link>
          <Link to="/login" className="hover:text-brand-red transition-colors">Portal</Link>
          <Link 
            to="/roster" 
            className="bg-white text-black px-6 py-2.5 rounded-xl hover:bg-brand-red hover:text-white transition-all active:scale-95 text-[9px] shadow-lg shadow-white/5"
          >
            Book Talent
          </Link>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navigation;
