import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Menu, X, PhoneCall, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);

  // Scroll listener for compact header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Auto-close on viewport resize to desktop (lg breakpoint >= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { name: 'मुखपृष्ठ', href: '#hero', active: true },
    { name: 'नोकरी महोत्सव २०२६', href: '#standard-naukri-mahotsav', active: false },
    { name: 'नवीनतम माहिती', href: '#updates', active: false },
    { name: 'कंपन्या व पदभरती', href: '#niyokta', active: false },
    { name: 'महत्त्वाच्या सूचना', href: '#suchana', active: false },
    { name: 'माहिती व डाउनलोड्स', href: '#downloads', active: false },
    { name: 'उमेदवार नोंदणी', href: '#nondani', active: false },
  ];

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-orange-100 py-3'
            : 'bg-white/90 backdrop-blur-sm py-3.5 md:py-4 border-b border-orange-100/60'
        }`}
      >
        <div className="mx-auto max-w-[1600px] px-3 sm:px-6 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative shrink-0">
              <img
                src="/logo3.png"
                alt="खासदार ओमराजे निंबाळकर"
                className="h-10 sm:h-12 md:h-13 w-auto object-contain drop-shadow-sm rounded-full border-2 border-primary transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logo2.png';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base md:text-lg font-black text-gray-900 leading-tight">
                खासदार ओमराजे निंबाळकर
              </span>
              <span className="text-[11px] sm:text-xs font-extrabold text-primary flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-orange-500 inline" />
                धाराशिव लोकसभा मतदारसंघ
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
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden w-10 h-10 rounded-xl border border-orange-200 bg-white/90 grid place-items-center text-gray-800 shadow-xs hover:border-primary hover:text-primary transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Clean Dropdown Menu (Mounted ONLY when mobileMenuOpen === true) */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden absolute top-full left-0 right-0 w-full bg-white shadow-2xl border-b border-orange-200 z-50 animate-fade-in"
            role="menu"
          >
            <div className="max-w-[1600px] mx-auto px-4 py-3 sm:px-6 flex flex-col gap-1.5 max-h-[calc(100vh-80px)] overflow-y-auto">
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  role="menuitem"
                  className={`py-2.5 px-3.5 rounded-xl font-mr text-sm sm:text-base font-bold transition-all flex items-center justify-between ${
                    link.active
                      ? 'bg-orange-50 text-primary border-l-4 border-primary pl-4 font-black'
                      : 'text-gray-800 hover:bg-orange-50/70 hover:text-primary'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.active && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                </a>
              ))}

              <div className="pt-3 mt-2 border-t border-orange-100 flex flex-col gap-2.5">
                <a
                  href="#nondani"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex w-full justify-center items-center gap-2 rounded-xl bg-primary text-white shadow-md hover:bg-primary-hover px-5 py-3 font-mr text-sm font-black active:scale-95 transition-all"
                >
                  <span>उमेदवार नोंदणी करा</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600 font-bold py-1">
                  <PhoneCall className="w-3.5 h-3.5 text-primary" />
                  <span>हेल्पलाइन: <strong className="text-primary">7391966295</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Dimmed backdrop (Mounted ONLY when mobileMenuOpen === true) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/25 lg:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
