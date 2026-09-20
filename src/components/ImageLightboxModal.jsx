import React, { useEffect, useRef, useState } from 'react';
import { X, Sparkles, Download, RotateCw, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Premium Orange + White Antigravity Lightbox Modal
 * 
 * Fixes:
 * - Solved React memory cache bug where `onLoad` doesn't fire for cached images.
 * - Added `imgRef` check for `complete` & `naturalWidth` so cached banner photos render instantly.
 * - Guaranteed crisp, sharp, uncropped image presentation without blank opacity traps.
 * - Absolutely NO black background anywhere.
 * - Glassmorphic white + light-orange backdrop overlay with blur.
 * - Animated Antigravity Particle & Lightwave Canvas Effect.
 * - Prev/Next navigation support for multi-item image carousels.
 * - Keyboard Escape key, backdrop click, and mobile touch support.
 */
export default function ImageLightboxModal({
  isOpen,
  onClose,
  imageSrc,
  title,
  subtitle,
  category,
  date,
  caption,
  number,
  downloadUrl,
  downloadFilename,
  actionButton,
  onPrev,
  onNext,
  hasMultiple = false
}) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check image loading / cache state safely on modal mount or src change
  useEffect(() => {
    if (!isOpen) return;

    setHasError(false);

    // If image is already completed in browser cache, render immediately
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoading(false);
    }
  }, [isOpen, imageSrc]);

  useEffect(() => {
    if (!isOpen) return;

    // Keyboard controls
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);

    // Canvas Antigravity Animation
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = 0;
    let height = 0;

    const particleColors = [
      { r: 255, g: 122, b: 0 },   // #FF7A00 Orange
      { r: 240, g: 90,  b: 0 },   // #F05A00 Deep Orange
      { r: 255, g: 244, b: 232 }, // Light Orange
      { r: 255, g: 255, b: 255 }, // White
      { r: 251, g: 146, b: 60 }   // Orange-400
    ];

    let particles = [];
    let orbs = [];

    const initCanvas = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;

      particles = [];
      const count = window.innerWidth < 768 ? 20 : 35;
      for (let i = 0; i < count; i++) {
        const color = particleColors[Math.floor(Math.random() * particleColors.length)];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.35 - Math.random() * 0.45,
          radius: 2 + Math.random() * 4,
          color: color,
          alpha: 0.25 + Math.random() * 0.45,
          angle: Math.random() * Math.PI * 2,
          speed: 0.01 + Math.random() * 0.02
        });
      }

      orbs = [];
      const orbCount = window.innerWidth < 768 ? 4 : 6;
      for (let i = 0; i < orbCount; i++) {
        const color = particleColors[i % particleColors.length];
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -0.15 - Math.random() * 0.25,
          radius: 30 + Math.random() * 40,
          color: color,
          alpha: 0.12 + Math.random() * 0.15,
          pulse: Math.random() * Math.PI * 2
        });
      }
    };

    window.addEventListener('resize', initCanvas);
    initCanvas();

    let time = 0;
    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Lightwave Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#FFFFFF');
      bgGrad.addColorStop(0.5, '#FFF7ED');
      bgGrad.addColorStop(1, '#FFEACC');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Soft Orbs
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        orb.y += orb.vy;
        orb.x += orb.vx;
        orb.pulse += 0.02;

        if (orb.y < -orb.radius * 2) orb.y = height + orb.radius * 2;
        if (orb.x < -orb.radius * 2) orb.x = width + orb.radius * 2;
        if (orb.x > width + orb.radius * 2) orb.x = -orb.radius * 2;

        const currentRadius = orb.radius + Math.sin(orb.pulse) * 5;
        const orbGrad = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, currentRadius * 1.8
        );
        const { r, g, b } = orb.color;
        orbGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${orb.alpha})`);
        orbGrad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${orb.alpha * 0.3})`);
        orbGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, currentRadius * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Connecting Lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.15;
            ctx.strokeStyle = `rgba(255, 122, 0, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Render Floating Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed;
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.angle) * 0.4;

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        const pGrad = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius * 2.2
        );
        const { r, g, b } = p.color;
        pGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.alpha})`);
        pGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.4})`);
        pGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 1.2})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', initCanvas);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-fade-in bg-[#FFF7ED]/95 backdrop-blur-md text-left selection:bg-[#FF7A00] selection:text-white"
      onClick={onClose}
    >
      {/* Container Card */}
      <div
        className="relative max-w-5xl w-full bg-white/95 rounded-3xl overflow-hidden shadow-2xl border-2 border-orange-200/90 my-auto flex flex-col max-h-[94vh] shadow-orange-500/20 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Antigravity Canvas Background Effect behind Content */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
        />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between p-3.5 px-5 sm:px-6 bg-white/90 border-b border-orange-100 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FFF7ED] text-[#F05A00] border border-orange-200 shadow-2xs">
              <Sparkles className="w-4.5 h-4.5 text-[#FF7A00]" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-gray-900 leading-tight">
                {title || caption || "Standard Naukri Mahotsav 2026"}
              </h4>
              <p className="text-xs text-[#F05A00] font-bold">
                {subtitle || (number ? `Official Photo #${number}` : "अधिकृत फोटो गॅलरी व उपक्रम")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={downloadFilename || "naukri-mahotsav-photo.jpg"}
                className="size-9 rounded-full bg-[#FFF7ED] hover:bg-[#FF7A00] text-[#F05A00] hover:text-white border border-orange-200 transition-colors grid place-items-center cursor-pointer shadow-2xs"
                title="Download Photo"
              >
                <Download className="size-4.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="size-9 rounded-full bg-[#FFF7ED] hover:bg-red-500 text-gray-700 hover:text-white border border-orange-200 transition-colors grid place-items-center cursor-pointer shadow-2xs"
              title="Close Image Viewer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Main Image Display Box */}
        <div className="relative z-10 p-3 sm:p-6 overflow-auto flex items-center justify-center bg-gradient-to-b from-[#FFF7ED]/70 via-white to-[#FFF7ED]/70 min-h-[320px] sm:min-h-[420px]">
          
          {/* Navigation Controls (If multiple images exist) */}
          {hasMultiple && onPrev && (
            <button
              onClick={onPrev}
              className="absolute left-3 sm:left-5 z-20 size-10 sm:size-12 rounded-full bg-white/90 hover:bg-[#FF7A00] text-gray-800 hover:text-white border border-orange-200 transition-all grid place-items-center shadow-lg cursor-pointer"
              title="Previous Photo"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          {/* Loading Spinner (Only shown when image is actively downloading) */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 backdrop-blur-xs">
              <RotateCw className="w-9 h-9 text-[#FF7A00] animate-spin mb-2" />
              <p className="text-xs font-bold text-gray-700">फोटो लोड होत आहे...</p>
            </div>
          )}

          {/* Error Fallback */}
          {hasError ? (
            <div className="p-8 text-center bg-orange-50/80 rounded-2xl border border-orange-200 max-w-md my-auto">
              <AlertTriangle className="w-10 h-10 text-[#F05A00] mx-auto mb-2" />
              <h5 className="text-sm font-bold text-gray-900">प्रतिमा दाखवता आली नाही</h5>
              <p className="text-xs text-gray-600 mt-1 mb-4">चित्र लोड करताना त्रुटी आली किंवा लिंक अद्याप उपलब्ध नाही.</p>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setHasError(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#FF7A00] text-white text-xs font-bold hover:bg-[#F05A00]"
              >
                पुन्हा प्रयत्न करा (Retry)
              </button>
            </div>
          ) : (
            /* Image Frame - Always crisp and fully visible */
            <div className="relative p-2 sm:p-3 bg-white rounded-2xl border-2 border-orange-200/90 shadow-xl shadow-orange-500/10 max-w-full drop-shadow-[0_0_20px_rgba(255,122,0,0.15)]">
              <img
                ref={imgRef}
                src={imageSrc}
                alt={title || caption || "Standard Naukri Mahotsav Image"}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
                className="max-h-[66vh] w-auto max-w-full object-contain rounded-xl block mx-auto transition-opacity duration-200 opacity-100"
                style={{ objectFit: 'contain', display: 'block' }}
              />
            </div>
          )}

          {hasMultiple && onNext && (
            <button
              onClick={onNext}
              className="absolute right-3 sm:right-5 z-20 size-10 sm:size-12 rounded-full bg-white/90 hover:bg-[#FF7A00] text-gray-800 hover:text-white border border-orange-200 transition-all grid place-items-center shadow-lg cursor-pointer"
              title="Next Photo"
            >
              <ChevronRight className="size-6" />
            </button>
          )}
        </div>

        {/* Modal Footer Info */}
        <div className="relative z-10 p-4 px-5 sm:px-6 bg-white/95 border-t border-orange-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-sm overflow-y-auto max-h-[25vh]">
          <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed flex-1">
            {title && <p className="font-extrabold text-gray-900 text-sm mb-1">{title}</p>}
            {category && (
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFF7ED] text-[#F05A00] border border-orange-200 font-extrabold text-[11px] mb-1">
                {category}
              </span>
            )}
            {date && <span className="ml-2 text-xs font-semibold text-gray-500">📅 {date}</span>}
            {caption && <div className="text-gray-700 font-medium mt-1 pl-2 border-l-2 border-[#FF7A00]/40">{caption}</div>}
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            {actionButton}
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FFF7ED] hover:bg-orange-100 text-[#F05A00] border border-orange-300 text-xs font-extrabold transition-all cursor-pointer text-center"
            >
              बंद करा (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
