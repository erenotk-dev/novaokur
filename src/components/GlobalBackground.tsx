import React, { useEffect, useRef } from 'react';
import '../styles/globals.css';

const GlobalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number, y: number, radius: number, vx: number, vy: number, alpha: number }[] = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 10000); // Yoğunluk
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2.0 + 1.0, // Altın yıldız boyutu
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.4 - 0.3, // Yavaşça yukarı doğru süzülüş
          alpha: Math.random() * 0.6 + 0.3
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Ekrandan çıkınca döngüye al
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`; // Altın rengi stardust
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(255, 215, 0, ${p.alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0; // Diğer çizimleri bozmamak için sıfırla
      });
      
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="global-bg-overlay"></div>
      <canvas ref={canvasRef} className="stardust-canvas-global" />
    </>
  );
};

export default GlobalBackground;
