import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

export default function CustomTimePicker({ value, onChange, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const times = [];
  for(let h=7; h<=19; h++) {
    const hh = ('0'+h).slice(-2);
    times.push(`${hh}:00`);
    if (h<19) times.push(`${hh}:30`);
  }

  return (
    <div className="relative w-full text-left" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center cursor-pointer transition-all ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg bg-slate-900' : ""} ${className}`}
      >
        <span className="truncate">{value || '--:--'}</span>
        <Clock size={14} className="text-slate-400 shrink-0 ml-2" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full min-w-[100px] mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl z-[100] max-h-48 overflow-y-auto custom-scrollbar animate-slide-up flex flex-col">
          {times.map(t => (
            <div
              key={t}
              onClick={() => { onChange(t); setIsOpen(false); }}
              className={`px-4 py-2.5 text-sm cursor-pointer border-b border-slate-700 border-opacity-50 last:border-0 transition-colors text-center ${value === t ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
            >
              {t}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}   