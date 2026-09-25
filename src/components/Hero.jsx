import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, ArrowRight, ChevronLeft, ChevronRight, CreditCard, Sparkles } from 'lucide-react';
import ImageLightboxModal from './ImageLightboxModal';

export default function Hero() {
  const slides = [
    {
      id: 1,
      src: '/naukri-mahotsav-dharashiv-2026.jpg',
      alt: 'खासदार नोकरी महोत्सव २०२६ - मा. ओमराजे निंबाळकर, धाराशिव मतदारसंघ अधिकृत बॅनर',
      title: 'खासदार नोकरी महोत्सव २०२६ - धाराशिव',
      subtitle: 'महाराष्ट्रातील ५० राष्ट्रीय व आंतरराष्ट्रीय नामांकित कंपन्यांचा सहभाग',
      badge: 'मुख्य बॅनर • 25 ऑक्टोबर २०२६',
      actionLabel: 'आताच नोंदणी करा (Register Now)',
      actionHref: '#nondani'
    },
    {
      id: 2,
      src: '/dharashiv-job-card-banner.jpg',
      alt: 'JOB CARD - नोकरी मार्गदर्शन कार्ड - धाराशिव मतदारसंघ',
      title: 'विशेष युवा रोजगार JOB CARD',
      subtitle: 'निवड न झालेल्या सर्व उमेदवारांना थेट कंपनी मार्गदर्शन व सहकार्य',
      badge: 'अधिकृत जॉब कार्ड वाटप',
      actionLabel: 'जॉब कार्ड माहिती (Job Card Details)',
      actionHref: '/job-card'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-play interval with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  const currentSlide = slides[currentIndex];

  return (
    <section 
      id="hero" 
      aria-label="Naukri Mahotsav 2026 Hero Banner"
      className="w-full pt-20 sm:pt-24 pb-0 select-none scroll-mt-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-[94%] max-w-[1600px] mx-auto px-1 sm:px-4">
        
        {/* Responsive Hero Slider Container */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl shadow-xl border border-orange-200/90 overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FFF8F3] to-[#FFF4EC] group">
          
          {/* Main Slide Image Display */}
          <div 
            className="relative w-full cursor-pointer overflow-hidden"
            onClick={() => setLightboxOpen(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full transition-opacity duration-500 ease-in-out">
              <img
                src={currentSlide.src}
                alt={currentSlide.alt}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/Slider.jpg';
                }}
                className="w-full h-auto block mx-auto transition-transform duration-300 group-hover:scale-[1.002]"
                loading="eager"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
              />
            </div>

            {/* Top Bar Badges */}
            <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 z-20 flex items-center gap-2">
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-white/30 backdrop-blur-xs">
                <Sparkles className="w-3 h-3 text-amber-200 animate-pulse" />
                <span>{currentSlide.badge}</span>
              </span>
            </div>

            {/* Top-Right Zoom Badge */}
            <div className="absolute top-2.5 sm:top-4 right-2.5 sm:right-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="bg-black/60 hover:bg-black/80 text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md backdrop-blur-md transition-all hover:scale-105 cursor-pointer border border-white/20"
                title="मोठ्या आकारात पहा (Zoom View)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">झूम करा (Zoom)</span>
              </button>
            </div>

            {/* Slider Navigation Arrows (Desktop & Tablet) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              aria-label="Previous Slide"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 size-9 sm:size-11 rounded-full bg-white/90 hover:bg-white text-gray-900 border border-orange-200 shadow-lg flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next Slide"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 size-9 sm:size-11 rounded-full bg-white/90 hover:bg-white text-gray-900 border border-orange-200 shadow-lg flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </button>
          </div>

          {/* Slider Bottom Bar: Indicators & Quick Action CTAs */}
          <div className="bg-white/95 border-t border-orange-100 px-3 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">
            
            {/* Slide Indicators / Dots */}
            <div className="flex items-center gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all rounded-full ${
                    currentIndex === idx 
                      ? 'w-7 sm:w-8 h-2.5 bg-gradient-to-r from-orange-500 to-amber-500 shadow-xs' 
                      : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}: ${s.title}`}
                />
              ))}
              <span className="text-[11px] sm:text-xs text-gray-500 font-bold ml-2">
                स्लाईड {currentIndex + 1} / {slides.length}
              </span>
            </div>

            {/* Slide Action CTAs */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={currentSlide.actionHref}
                className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-black transition-all inline-flex items-center gap-1.5 shadow-sm hover:shadow active:scale-95"
              >
                <span>{currentSlide.actionLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {currentIndex === 0 ? (
                <a
                  href="/job-card"
                  className="hidden sm:inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-950 text-xs sm:text-sm font-bold transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5 text-primary" />
                  <span>जॉब कार्ड पहा</span>
                </a>
              ) : (
                <a
                  href="#nondani"
                  className="hidden sm:inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-950 text-xs sm:text-sm font-bold transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  <span>थेट नोंदणी करा</span>
                </a>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* High-Resolution Image Lightbox Modal */}
      <ImageLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageSrc={currentSlide.src}
        title={currentSlide.alt}
        downloadUrl={currentSlide.src}
        downloadFilename={`Dharashiv-Naukri-Mahotsav-2026-Slide-${currentSlide.id}.jpg`}
        hasMultiple={true}
        onNext={goToNext}
        onPrev={goToPrev}
        currentIndex={currentIndex}
        totalImages={slides.length}
        actionButton={
          <a
            href={currentSlide.actionHref}
            onClick={() => setLightboxOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm text-center"
          >
            <span>{currentSlide.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        }
      />
    </section>
  );
}
