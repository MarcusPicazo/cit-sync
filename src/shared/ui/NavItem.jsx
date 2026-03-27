import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function NavItem({ icon, label, active, onClick, highlight, externalUrl }) {
  if (externalUrl) {
    return (
      <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-bold text-slate-400 hover:bg-slate-800 hover:bg-opacity-50 hover:text-slate-200 border border-transparent cursor-pointer">
        <div className="group-hover:scale-110 transition-transform duration-200">{icon}</div>
        <span>{label}</span>
        <ExternalLink size={14} className="ml-auto opacity-50"/>
      </a>
    );
  }
  return (
    <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-bold cursor-pointer ${active ? 'bg-blue-500 bg-opacity-20 text-blue-500 border border-blue-500 border-opacity-30 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]' : highlight ? 'text-slate-200 bg-slate-800 bg-opacity-40 border border-slate-700 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-800 hover:bg-opacity-50 hover:text-slate-200 border border-transparent'}`}>
      <div className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-200`}>{icon}</div>
      <span>{label}</span>
    </button>
  );
}