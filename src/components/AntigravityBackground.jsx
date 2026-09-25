import React, { useEffect, useRef, useState } from 'react';

/**
 * Premium Antigravity Interactive Background Layer
 * 
 * Features:
 * - 50 Floating Particles (2px - 7px) with clear, vivid opacity (0.35 - 0.85).
 * - 10 Large Soft Glowing Orbs (35px - 90px diameter) floating in zero-gravity.
 * - Sinusoidal horizontal drift + continuous upward motion.
 * - Interactive Mouse Repulsion: particles move away gently from cursor.
 * - Dynamic connecting energy filaments between nearby nodes.
 * - Blue, Cyan, Indigo & Amber color palette.
 * - 800ms smooth fade-in on mount.
 * - pointer-events: none, z-index: 0 fixed viewport layer.
 */
export default function AntigravityBackground() {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = 0;
    let height = 0;

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 180,
      active: false
    };

    // Color Palette: Electric Blue, Vivid Cyan, Indigo, Bright Turquoise, Accent Gold
    const colors = [
      { r: 6,   g: 182, b: 212 }, // Cyan-500 (#06b6d4)
      { r: 59,  g: 130, b: 246 }, // Blue-500 (#3b82f6)
      { r: 99,  g: 102, b: 241 }, // Indigo-500 (#6366f1)
      { r: 45,  g: 212, b: 191 }, // Teal-400 (#2dd4bf)
      { r: 249, g: 115, b: 22  }  // Soft Primary Orange (#f97316)
    ];

    let particles = [];
    let orbs = [];

    const PARTICLE_COUNT = window.innerWidth < 768 ? 30 : 55;
    const ORB_COUNT = window.innerWidth < 768 ? 5 : 10;

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      // 1. Initialize 50 Particles (2px to 7px)
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 2 + Math.random() * 5; // 2px to 7px
        const alpha = 0.35 + Math.random() * 0.45; // 0.35 to 0.80

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.35 - Math.random() * 0.55, // Upward float velocity
          radius: size,
          color: color,
          alpha: alpha,
          orbitAngle: Math.random() * Math.PI * 2,
          orbitSpeed: 0.008 + Math.random() * 0.015,
          orbitRadius: 15 + Math.random() * 25,
          repelX: 0,
          repelY: 0
        });
      }

      // 2. Initialize 10 Large Soft Glowing Orbs (35px to 90px diameter)
      orbs = [];
      for (let i = 0; i < ORB_COUNT; i++) {
        const color = colors[i % colors.length];
        const radius = 18 + Math.random() * 27; // 18px to 45px radius (36px to 90px dia)
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vy: -0.15 - Math.random() * 0.25,
          vx: (Math.random() - 0.5) * 0.2,
          radius: radius,
          color: color,
          alpha: 0.12 + Math.random() * 0.18,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.01 + Math.random() * 0.02
        });
      }
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    init();

    let time = 0;
    const render = () => {
      time += 0.016;

      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      if (!prefersReduced) {
        // 1. Render Large Soft Glowing Orbs (Floating & Pulsing)
        for (let i = 0; i < orbs.length; i++) {
          const orb = orbs[i];
          orb.y += orb.vy;
          orb.x += orb.vx;
          orb.pulse += orb.pulseSpeed;

          if (orb.y < -orb.radius * 2) orb.y = height + orb.radius * 2;
          if (orb.x < -orb.radius * 2) orb.x = width + orb.radius * 2;
          if (orb.x > width + orb.radius * 2) orb.x = -orb.radius * 2;

          const currentRadius = orb.radius + Math.sin(orb.pulse) * 4;
          const orbGrad = ctx.createRadialGradient(
            orb.x, orb.y, 0,
            orb.x, orb.y, currentRadius * 2
          );
          const { r, g, b } = orb.color;
          orbGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${orb.alpha})`);
          orbGrad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${orb.alpha * 0.4})`);
          orbGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.fillStyle = orbGrad;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, currentRadius * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Render Connecting Lines Between Nearby Particles
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 130;

            if (dist < maxDist) {
              const lineAlpha = (1 - dist / maxDist) * 0.18;
              ctx.strokeStyle = `rgba(59, 130, 246, ${lineAlpha})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

        // 3. Render Floating Particles & Mouse Reaction
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Upward movement & sinusoidal drift
          p.orbitAngle += p.orbitSpeed;
          const driftX = Math.sin(p.orbitAngle + time) * p.orbitRadius;

          p.baseY += p.vy;
          p.baseX += p.vx;

          if (p.baseY < -20) {
            p.baseY = height + 20;
            p.baseX = Math.random() * width;
          }
          if (p.baseX < -20) p.baseX = width + 20;
          if (p.baseX > width + 20) p.baseX = -20;

          let targetX = p.baseX + driftX;
          let targetY = p.baseY;

          // Mouse repulsion interaction (particles push away gently)
          if (mouse.active) {
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mdist < mouse.radius && mdist > 0) {
              const force = (1 - mdist / mouse.radius) * 45;
              const angle = Math.atan2(mdy, mdx);
              p.repelX += Math.cos(angle) * force * 0.15;
              p.repelY += Math.sin(angle) * force * 0.15;
            } else {
              p.repelX *= 0.88;
              p.repelY *= 0.88;
            }
          } else {
            p.repelX *= 0.88;
            p.repelY *= 0.88;
          }

          p.x = targetX + p.repelX;
          p.y = targetY + p.repelY;

          // Particle outer radial glow
          const pGrad = ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, p.radius * 2.4
          );
          const { r, g, b } = p.color;
          pGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.alpha})`);
          pGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.4})`);
          pGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.4, 0, Math.PI * 2);
          ctx.fill();

          // Particle bright center core
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, p.alpha * 1.2)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-800 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
      aria-hidden="true"
    />
  );
}
