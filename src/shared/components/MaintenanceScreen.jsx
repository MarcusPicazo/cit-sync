import React from 'react';
import { Wrench } from 'lucide-react';
import EdTechLogo from './EdTechLogo';

export default function MaintenanceScreen() {
  return (
    <div className="min-h-screen w-full bg-[#0a0f1c] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden font-sans cursor-default animate-fade-in">
      {/* Luces Neón de fondo */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-amber-500/10 rounded-full blur-[200px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-orange-600/10 rounded-full blur-[200px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)] mb-8 border border-amber-500/30">
          <Wrench size={48} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
          Plataforma en Mantenimiento
        </h1>
        
        <p className="text-slate-400 max-w-md text-lg font-medium leading-relaxed">
          Estamos realizando actualizaciones en el servidor del Centro de Innovación Tecnológica. Estaremos de vuelta muy pronto.
        </p>
        
        <div className="mt-16 flex items-center space-x-3 opacity-60">
          <EdTechLogo size={24} />
          <span className="text-white font-bold tracking-widest text-xs uppercase">CIT-Sync EBVG</span>
        </div>
      </div>
    </div>
  );
}