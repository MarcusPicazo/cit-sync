import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';

export default function CustomDatePicker({ value, onChange, min, placeholder, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value + 'T12:00:00') : new Date());
  const dropdownRef = useRef(null);
  const { lang } = useI18n();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const handlePrevMonth = (e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); };
  const handleNextMonth = (e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)); };

  const selectDate = (day) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const z = n => ('0'+n).slice(-2);
    const dateString = `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}`;
    if (min && dateString < min) return;
    onChange(dateString);
    setIsOpen(false);
  };

  const monthNames = lang === 'es'
    ? ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = lang === 'es' ? ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const displayDate = value ? new Date(value + 'T12:00:00').toLocaleDateString(lang === 'en' ? 'en-US' : 'es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' }) : (placeholder || '--/--/----');

  return (
    <div className="relative w-full text-left" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center cursor-pointer transition-all ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg bg-slate-900' : ""} ${className}`}
      >
        <span className="truncate">{displayDate}</span>
        <CalendarIcon size={14} className="text-slate-400 shrink-0 ml-2" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl z-[100] w-64 animate-slide-up cursor-default">
          <div className="flex justify-between items-center mb-3">
            <button type="button" onClick={handlePrevMonth} className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"><ChevronLeft size={16}/></button>
            <span className="text-white font-bold text-sm">{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
            <button type="button" onClick={handleNextMonth} className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"><ChevronRight size={16}/></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {dayNames.map(d => <div key={d} className="text-[10px] text-slate-400 font-bold">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({length: firstDay}).map((_, i) => <div key={`empty-${i}`}/>)}
            {Array.from({length: daysInMonth}).map((_, i) => {
              const day = i + 1;
              const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
              const z = n => ('0'+n).slice(-2);
              const dateString = `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}`;
              const isSelected = value === dateString;
              const isDisabled = min && dateString < min;
              return (
                <button
                  type="button"
                  key={day}
                  disabled={isDisabled}
                  onClick={() => selectDate(day)}
                  className={`p-1.5 text-xs rounded-lg transition-colors ${isDisabled ? 'text-slate-600 cursor-not-allowed opacity-50' : isSelected ? 'bg-blue-600 text-white font-bold cursor-pointer' : 'text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer'}`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
}