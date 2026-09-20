import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, PhoneCall, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'मुखपृष्ठ', href: '#hero', active: true },
    { name: 'नोकरी महोत्सव २०२६', href: '#standard-naukri-mahotsav', active: false },
    { name: 'कंपन्या व पदभरती', href: '#niyokta', active: false },
    { name: 'गॅलरी व व्हिडिओ', href: '#success-stories', active: false },
    { name: 'महत्त्वाच्या सूचना', href: '#suchana', active: false },
    { name: 'माहिती व डाउनलोड्स', href: '#downloads', active: false },
    { name: 'उमेदवार नोंदणी', href: '#nondani', active: false },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-orange-100 py-3' : 'bg-white/80 backdrop-blur-sm py-4 md:py-5 border-b border-orange-100/50'
        }`}
      >
        <div className="mx-auto max-w-[1600px] px-3 sm:px-6 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/logo3.png"
                alt="खासदार संजय देशमुख (मामा)"
                className="h-11 md:h-14 w-auto object-contain drop-shadow-sm rounded-full border-2 border-primary transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logo2.png';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base md:text-lg font-black text-gray-900 leading-tight">
                खासदार संजय देशमुख
              </span>
              <span className="text-[11px] sm:text-xs font-extrabold text-primary flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-orange-500 inline" />
                यवतमाळ - वाशिम लोकसभा मतदारसंघ
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 font-mr text-[15px] text-gray-800">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className={`transition-colors relative font-extrabold hover:text-primary ${
                  link.active ? 'text-primary' : 'text-gray-700'
                }`}
              >
                {link.name}
                {link.active && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-primary rounded-full animate-pulse"></span>
                )}
              </a>
            ))}
          </nav>

          {/* CTA Action & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="#nondani"
              className="hidden md:inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all px-5 py-2.5 font-mr text-xs sm:text-sm font-black active:scale-95"
            >
              <span>उमेदवार नोंदणी करा</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl border border-orange-200 bg-white/90 backdrop-blur-sm grid place-items-center text-gray-800 shadow-xs hover:border-primary transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-[340px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col p-6 overflow-y-auto ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="flex justify-between items-center pb-5 border-b border-orange-100">
            <div className="flex items-center gap-3">
              <img
                src="/logo3.png"
                alt="खासदार संजय देशमुख"
                className="h-11 w-auto object-contain rounded-full border-2 border-primary"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-tight">
                  खासदार संजय देशमुख
                </span>
                <span className="text-[11px] font-semibold text-primary">
                  यवतमाळ - वाशिम
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full border border-gray-200 grid place-items-center text-gray-500 hover:text-primary hover:bg-orange-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <nav className="flex flex-col gap-3 py-6 font-mr text-base text-gray-800 font-bold">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2.5 px-3.5 rounded-xl transition-all flex items-center justify-between ${
                  link.active
                    ? 'bg-orange-50 text-primary font-black border-l-4 border-primary pl-4'
                    : 'hover:bg-gray-50 hover:text-primary'
                }`}
              >
                <span>{link.name}</span>
                {link.active && <span className="w-2 h-2 rounded-full bg-primary"></span>}
              </a>
            ))}
          </nav>

          {/* Drawer Footer CTA */}
          <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-3">
            <a
              href="#nondani"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex w-full justify-center items-center gap-2 rounded-xl bg-primary text-white shadow-lg px-5 py-3.5 font-mr text-sm font-black hover:bg-primary-hover active:scale-95 transition-all"
            >
              <span>उमेदवार नोंदणी करा</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600 font-bold">
              <PhoneCall className="w-3.5 h-3.5 text-primary" />
              <span>हेल्पलाइन: <strong className="text-primary">7391966295</strong></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
