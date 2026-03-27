import React from 'react';
import { SearchX, ArrowLeft } from 'lucide-react';

export default function NotFoundScreen({ onBack }) {
  return (
    <div className="w-full h-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center relative animate-fade-in z-10 cursor-default">
      <div className="w-24 h-24 rounded-3xl bg-blue-500/10 text-blue-500 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)] mb-8 border border-blue-500/20">
        <SearchX size={48} />
      </div>
      
      <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-2 tracking-tighter drop-shadow-lg">
        404
      </h1>
      
      <h2 className="text-2xl font-bold text-slate-200 mb-4 tracking-tight">
        Página no encontrada
      </h2>
      
      <p className="text-slate-400 max-w-sm mb-10 font-medium">
        Parece que te has perdido en el ecosistema. La sección que buscas no existe o no tienes los permisos para verla.
      </p>
      
      <button 
        onClick={onBack} 
        className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all border border-slate-700 hover:border-slate-500 shadow-lg group cursor-pointer"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span>Volver al inicio</span>
      </button>
    </div>
  );
}