import React, { useRef, useEffect } from 'react';

export default function AnimatedBackground({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let tubes = [];
    const colorsDark = ['#3b82f6', '#8b5cf6', '#06b6d4', '#a855f7'];
    const colorsLight = ['#0284c7', '#7c3aed', '#0ea5e9', '#4f46e5'];

    class FlowingTube {
      constructor(index, canvasWidth, canvasHeight, totalTubes) {
        this.index = index;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.totalTubes = totalTubes;
        this.points = [];
        this.generatePath();
        this.progress = -(Math.random() * 0.6 + 0.1) * index;
        this.tubeLength = Math.random() * 0.3 + 0.3;
        this.speed = Math.random() * 0.0006 + 0.0003;
      }

      generatePath() {
        this.points = [];
        this.lineWidth = Math.random() * 20 + 15;
        const laneWidth = this.canvasWidth / this.totalTubes;
        const centerX = (this.index + 0.5) * laneWidth;
        const startX = centerX;
        const startY = -200;
        const endX = centerX;
        const endY = this.canvasHeight + 200;
        const maxDeviation = laneWidth * 0.35;
        const loopRadius = Math.random() * (maxDeviation * 0.4) + (maxDeviation * 0.1);
        const loopCenter = Math.random() * 0.4 + 0.3;
        const loopDuration = 0.08;
        const loopDir = Math.random() > 0.5 ? 1 : -1;
        const swayFrequency = Math.random() * 1.5 + 0.8;
        const swayAmplitude = Math.random() * (maxDeviation * 0.4) + (maxDeviation * 0.1);
        const numSteps = 800;

        for (let i = 0; i <= numSteps; i++) {
          const t = i / numSteps;
          let linearX = startX + (endX - startX) * t;
          const linearY = startY + (endY - startY) * t;
          const swayX = Math.sin(t * Math.PI * 2 * swayFrequency) * swayAmplitude;
          let loopX = 0;
          let loopY = 0;
          const tDist = t - loopCenter;

          if (Math.abs(tDist) < loopDuration) {
            const loopProgress = (tDist + loopDuration) / (2 * loopDuration);
            const angle = loopProgress * Math.PI * 2;
            const env = Math.sin(loopProgress * Math.PI);
            loopX = Math.sin(angle) * loopRadius * env * loopDir;
            const flowDistanceDuringLoop = (endY - startY) * (2 * loopDuration);
            loopY = (1 - Math.cos(angle)) * (flowDistanceDuringLoop * 0.55 + loopRadius) * env;
          }

          const naturalCurve = Math.cos(t * Math.PI) * (maxDeviation * 0.1);
          const ptX = linearX + swayX + loopX + naturalCurve;
          const ptY = linearY + loopY;

          if (!isNaN(ptX) && !isNaN(ptY)) {
            this.points.push({ x: ptX, y: ptY });
          }
        }
      }

      draw(ctx, themeColors, isDark) {
        if (!this.points || this.points.length === 0) return;
        const color = themeColors[this.index % themeColors.length];
        let headT = Math.min(1, Math.max(0, this.progress));
        let tailT = Math.min(1, Math.max(0, this.progress - this.tubeLength));

        if (headT <= tailT && headT > 0) {
          this.progress += this.speed;
          if (this.progress - this.tubeLength > 1.2) {
            this.generatePath();
            this.progress = -0.2;
            return;
          }
        }

        const headIdx = Math.max(0, Math.min(this.points.length - 1, Math.floor(headT * (this.points.length - 1))));
        const tailIdx = Math.max(0, Math.min(this.points.length - 1, Math.floor(tailT * (this.points.length - 1))));

        if (headIdx <= tailIdx) {
          this.progress += this.speed;
          return;
        }

        const startPt = this.points[tailIdx];
        if (!startPt || typeof startPt.x === 'undefined' || typeof startPt.y === 'undefined') {
          this.progress += this.speed;
          return;
        }

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = isDark ? 0.15 : 0.08;
        ctx.moveTo(startPt.x, startPt.y);

        for (let i = tailIdx + 1; i <= headIdx; i++) {
          const pt = this.points[i];
          if (pt && typeof pt.x !== 'undefined' && typeof pt.y !== 'undefined') {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        this.progress += this.speed;
      }
    }

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const totalTubes = 3;
    tubes = [];
    for (let i = 0; i < totalTubes; i++) {
      tubes.push(new FlowingTube(i, window.innerWidth, window.innerHeight, totalTubes));
    }

    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = theme === 'dark';
      const currentColors = isDark ? colorsDark : colorsLight;
      tubes.forEach(tube => tube.draw(ctx, currentColors, isDark));
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none animated-bg-canvas" />;
}