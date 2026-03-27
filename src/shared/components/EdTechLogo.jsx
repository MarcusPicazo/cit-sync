import React from 'react';
import { BookOpen, Atom } from 'lucide-react';

export default function EdTechLogo({ size = 24, className = "" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Definición del gradiente vectorial (SVG) que desvanece de blanco a azul a morado */}
      <svg width="0" height="0" className="absolute">
        <linearGradient id="edTechGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#ffffff" offset="0%" />
          <stop stopColor="#93c5fd" offset="40%" />
          <stop stopColor="#d8b4fe" offset="100%" />
        </linearGradient>
      </svg>
      {/* Libro Abierto como núcleo base de la educación */}
      <BookOpen size={size * 0.8} stroke="url(#edTechGrad)" strokeWidth={2} className="relative z-10 drop-shadow-md" />
      {/* Átomo científico girando suavemente detrás para representar tecnología */}
      <Atom size={size * 1.5} stroke="url(#edTechGrad)" strokeWidth={1.5} className="absolute animate-spin-slow opacity-70" />
    </div>
  );
}