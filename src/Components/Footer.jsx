import React from 'react';
import { ArrowUp, Mail, Linkedin } from 'lucide-react';
import GlassSurface from './GlassSurface';

const Footer = ({ setActivePage }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full flex justify-center pb-6 px-4 mt-auto relative z-40 font-['Love_Ya_Like_A_Sister']">
      {/* Import Font locally for this component just in case */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Love+Ya+Like+A+Sister&display=swap');
      `}</style>

      <div className="w-full max-w-7xl">
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={24}
          className="shadow-2xl"
          blur={20}
          borderWidth={0.05}
          opacity={0.6}
          brightness={40} // Slightly darker for footer
        >
          <div className="w-full px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left: Logo & Copyright */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-3">
                {/* Logo Box */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFFDD0] to-[#421F16] flex items-center justify-center shadow-lg">
                  <span className="text-[#421F16] font-bold text-lg">AT</span>
                </div>
                <span className="text-[#FFFDD0] text-xl font-bold">Portfolio</span>
              </div>
              <p className="text-[#FFFDD0]/60 text-xs font-sans tracking-wide">
                © 2025 All rights reserved.
              </p>
            </div>

            {/* Center: Navigation */}
            <nav className="flex items-center gap-8">
              {['Home', 'Projects', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => setActivePage(item.toLowerCase())}
                  className="text-[#FFFDD0]/80 hover:text-[#FFFDD0] text-lg transition-colors font-medium"
                >
                  {item}
                </button>
              ))}
            </nav>

            {/* Right: Socials & Scroll Top */}
            <div className="flex items-center gap-4">
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/anshuman-tyagi-955455315/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#FFFDD0]/10 hover:bg-[#FFFDD0]/20 flex items-center justify-center transition-all border border-[#FFFDD0]/10 group"
              >
                <Linkedin className="w-5 h-5 text-[#FFFDD0] group-hover:scale-110 transition-transform" />
              </a>

              {/* Email */}
              <a 
                href="mailto:anshumantyagi20@gmail.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#FFFDD0]/10 hover:bg-[#FFFDD0]/20 flex items-center justify-center transition-all border border-[#FFFDD0]/10 group"
              >
                <Mail className="w-5 h-5 text-[#FFFDD0] group-hover:scale-110 transition-transform" />
              </a>

              {/* Scroll to Top */}
              <button 
                onClick={scrollToTop}
                className="w-10 h-10 rounded-full bg-[#FFFDD0] hover:bg-white flex items-center justify-center transition-all shadow-lg group"
              >
                <ArrowUp className="w-5 h-5 text-[#421F16] group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>

          </div>
        </GlassSurface>
      </div>
    </footer>
  );
};

export default Footer;