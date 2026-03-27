import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, placeholder, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption && selectedOption.value !== "" ? selectedOption.label : placeholder;

  return (
    <div className="relative w-full text-left" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-800 border border-slate-700 text-white outline-none flex justify-between items-center cursor-pointer transition-all ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg bg-slate-900' : 'hover:border-slate-500'} ${className}`}
      >
        <span className={`truncate ${!selectedOption || selectedOption.value === "" ? 'text-slate-500' : 'text-white'}`}>{displayLabel}</span>
        <ChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ml-2 ${isOpen ? 'rotate-90' : ""}`} />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl overflow-hidden z-[100] animate-slide-up max-h-60 overflow-y-auto custom-scrollbar flex flex-col">
          {options.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`px-4 py-3 text-sm transition-colors cursor-pointer border-b border-slate-700 border-opacity-50 last:border-0 ${value === opt.value ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}