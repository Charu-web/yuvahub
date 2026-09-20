import React, { useState } from 'react';
import { Maximize2, ArrowRight } from 'lucide-react';
import ImageLightboxModal from './ImageLightboxModal';

export default function Hero() {
  // Single Official Yavatmal–Washim Banner Slide
  const slides = [
    {
      id: 1,
      src: '/Slider.jpg',
      alt: 'भव्य नोकरी महोत्सव २०२६ - यवतमाळ वाशिम लोकसभा मतदारसंघ Banner',
      title: 'भव्य नोकरी महोत्सव २०२६ - यवतमाळ वाशिम लोकसभा मतदारसंघ अधिकृत बॅनर'
    }
  ];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const currentSlide = slides[0];

  return (
    <section 
      id="hero" 
      aria-label="Homepage Hero Banner"
      className="w-full pt-20 sm:pt-24 pb-0 select-none scroll-mt-20"
    >
      <div className="w-[94%] max-w-[1600px] mx-auto px-1 sm:px-4">
        {/* Premium Responsive Hero Container */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl shadow-lg border border-orange-200/80 overflow-hidden bg-white group">
          
          {/* Main Slide Image Display (No hover tooltip) */}
          <div className="relative w-full">
            <div 
              className="w-full cursor-pointer relative"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={currentSlide.src}
                alt={currentSlide.alt}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/Slider.jpg';
                }}
                className="w-full h-auto block mx-auto transition-transform duration-200 group-hover:scale-[1.001]"
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

              {/* Top-Right Zoom Badge */}
              <div className="absolute top-3 right-3 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxOpen(true);
                  }}
                  className="bg-[#FF7A00] hover:bg-[#F05A00] text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md backdrop-blur-xs transition-transform hover:scale-105 cursor-pointer border border-white/20"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">झूम करा (Zoom Banner)</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Image Lightbox Modal */}
      <ImageLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageSrc={currentSlide.src}
        title={currentSlide.alt}
        downloadUrl={currentSlide.src}
        downloadFilename="Yavatmal-Washim-Naukri-Mahotsav-Banner.jpg"
        hasMultiple={false}
        actionButton={
          <a
            href="#nondani"
            onClick={() => setLightboxOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#F05A00] text-white text-xs font-extrabold transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm text-center"
          >
            <span>आताच नोंदणी करा (Register Now)</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        }
      />
    </section>
  );
}
