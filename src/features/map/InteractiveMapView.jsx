import React, { useState } from 'react';
import { Monitor, Check, Laptop, Wand2, Calendar, Clock } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useI18n } from '../../contexts/I18nContext';
import BookingModal from '../dashboard/components/BookingModal';
import CustomDatePicker from '../../shared/ui/CustomDatePicker';
import CustomTimePicker from '../../shared/ui/CustomTimePicker';

const parseDateObj = (val) => {
  if (!val) return new Date();
  if (typeof val.toDate === 'function') return val.toDate();
  return new Date(val);
};

const checkOverlap = (start1, end1, start2, end2) => start1 < end2 && start2 < end1;

export default function InteractiveMapView({ resources, reservations, userRole, userId }) {
  const { showToast } = useToast();
  const { t } = useI18n();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStart, setFilterStart] = useState('08:00');
  const [filterEnd, setFilterEnd] = useState('10:00');
  const [autoCount, setAutoCount] = useState(1);

  const getSeatStatus = (rId, sId) => {
    const res = resources?.find(r => r.id === rId);
    if (res && res.status === 'maintenance') return 'maintenance';

    const checkStart = new Date(`${filterDate}T${filterStart}:00`);
    const checkEnd = new Date(`${filterDate}T${filterEnd}:00`);

    const isOccupied = reservations?.some(r => {
      if (r.resourceId !== rId || r.status !== 'approved') return false;
      if (!r.seatIds?.includes('all') && !r.seatIds?.includes(sId)) return false;

      const rStart = parseDateObj(r.startTime);
      const rEnd = parseDateObj(r.endTime);

      return checkOverlap(checkStart, checkEnd, rStart, rEnd);
    });

    return isOccupied ? 'occupied' : 'available';
  };

  const handleSeatClick = (sId) => {
    const isOff = sId.startsWith('office');
    const rId = isOff ? 'sala-respaldo' : 'salon-principal';

    if (getSeatStatus(rId, sId) !== 'available') return;

    if (selectedSeats.length > 0) {
        const isCurrentlyOff = selectedSeats[0].startsWith('office');
        if (isCurrentlyOff !== isOff) {
            showToast(t('map_mix_warning'), "warning");
            return;
        }
    }

    if (userRole === 'alumno') {
        if (!isOff) {
            showToast(t('map_office_warning'), "warning");
            return;
        }
        if (!selectedSeats.includes(sId) && selectedSeats.length >= 1) {
            showToast(t('map_limit_warning'), "error");
            return;
        }
    } else if (userRole === 'profesor') {
        if (isOff) {
            showToast(t('map_lab_warning'), "warning");
            return;
        }
    }

    setSelectedSeats(prev => prev.includes(sId) ? prev.filter(x => x !== sId) : [...prev, sId]);
  };

  const handleAutoAssign = () => {
      if (autoCount < 1) return;

      let available = [];
      for (let r = 1; r <= 4; r++) {
         for (let c = 0; c < 8; c++) {
            const sId = `row${r}-${c}`;
            if (getSeatStatus('salon-principal', sId) === 'available') {
                available.push(sId);
            }
         }
      }

      if (autoCount > available.length) {
          showToast(t('map_avail_error'), "error");
          return;
      }

      setSelectedSeats(available.slice(0, autoCount));
      showToast(t('map_auto_success'), "success");
  };

  const renderSeat = (rId, sId) => {
    const st = getSeatStatus(rId, sId);
    const isSel = selectedSeats.includes(sId);

    const colors = {
        available: 'bg-slate-800 text-slate-500 hover:text-blue-400 border-slate-700 cursor-pointer hover:bg-slate-700',
        occupied: 'bg-red-500 bg-opacity-20 text-red-500 border-red-500 border-opacity-30 cursor-not-allowed',
        maintenance: 'bg-amber-500 bg-opacity-10 text-amber-500 border-amber-500 border-opacity-30 cursor-not-allowed'
    };

    return (
        <div
            key={sId}
            onClick={() => handleSeatClick(sId)}
            className={`h-11 w-11 rounded-lg border flex items-center justify-center transition-all ${isSel ? 'bg-blue-600 border-blue-400 text-white ring-2 ring-blue-500/50 scale-110 shadow-lg shadow-blue-500/20 cursor-pointer' : colors[st]}`}
        >
            <Monitor size={18}/>
        </div>
    );
  };

  return (
    <div className="animate-fade-in space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6 text-white">
            <h2 className="text-2xl font-bold leading-tight uppercase tracking-widest">
                {t('map_title')} <span className="text-blue-500">CIT</span>
            </h2>
        </div>

        <div className="bg-[#0a0f1c] border border-slate-700 p-6 rounded-3xl shadow-xl flex flex-wrap items-end gap-6 relative z-30">
            <div className="space-y-2 relative z-50">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center">
                    <Calendar size={12} className="mr-1"/> {t('modal_book_date')}
                </label>
                <div className="w-40">
                  <CustomDatePicker value={filterDate} onChange={(val) => { setFilterDate(val); setSelectedSeats([]); }} className="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl py-2.5 px-4 outline-none focus:border-blue-500 hover:border-slate-500 transition-colors shadow-inner" />
                </div>
            </div>

            <div className="space-y-2 relative z-40">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center">
                    <Clock size={12} className="mr-1"/> {t('modal_book_start')}
                </label>
                <div className="w-32">
                  <CustomTimePicker value={filterStart} onChange={(val) => { setFilterStart(val); setSelectedSeats([]); }} className="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl py-2.5 px-4 outline-none focus:border-blue-500 hover:border-slate-500 transition-colors shadow-inner" />
                </div>
            </div>

            <div className="space-y-2 relative z-30">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center">
                    <Clock size={12} className="mr-1"/> {t('modal_book_end')}
                </label>
                <div className="w-32">
                  <CustomTimePicker value={filterEnd} onChange={(val) => { setFilterEnd(val); setSelectedSeats([]); }} className="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl py-2.5 px-4 outline-none focus:border-blue-500 hover:border-slate-500 transition-colors shadow-inner" />
                </div>
            </div>

            {(userRole === 'profesor' || userRole === 'admin') && (
                <div className="space-y-2 border-l border-slate-700 pl-6 ml-2">
                    <label className="text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center">
                        <Wand2 size={12} className="mr-1"/> {t('map_auto')}
                    </label>
                    <div className="flex items-center gap-2">
                        <input type="number" min="1" max="32" value={autoCount} onChange={(e) => setAutoCount(Number(e.target.value))} className="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 w-20 outline-none focus:border-blue-500 hover:border-slate-500 transition-colors text-center shadow-inner cursor-text" />
                        <button onClick={handleAutoAssign} className="bg-slate-700 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg transition-colors cursor-pointer border border-slate-600 hover:border-blue-400">
                            {t('map_assign')}
                        </button>
                    </div>
                </div>
            )}

            <div className="ml-auto">
                <button disabled={selectedSeats.length === 0} onClick={() => setShowBookingModal(true)} className={`px-8 py-3.5 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 ${selectedSeats.length > 0 ? 'bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer animate-solid-pulse' : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'}`}>
                    <Check size={18}/>
                    {t('btn_confirm')} {selectedSeats.length > 0 ? `(${selectedSeats.length})` : ''}
                </button>
            </div>
        </div>

        <div className="bg-slate-900 bg-opacity-60 p-6 sm:p-10 rounded-3xl border border-slate-700 border-opacity-50 overflow-x-auto custom-scrollbar flex justify-center shadow-2xl backdrop-blur-md">
            {/* AQUÍ SE CORRIGE EL AMONTONAMIENTO (p-12 pt-16) */}
            <div className="flex gap-10 min-w-max border border-slate-800 p-12 pt-16 rounded-3xl bg-[#0a0f1c] relative cursor-default shadow-inner">
                
                <div className="flex flex-col gap-10 items-center justify-center">
                    <div className="w-12 xl:w-16 h-64 xl:h-80 rounded-full border-2 border-cyan-400 border-opacity-80 bg-cyan-500 bg-opacity-10 flex items-center justify-center relative shadow-[0_0_20px_rgba(34,211,238,0.2)] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 to-transparent rounded-full pointer-events-none"></div>
                        <div className="flex flex-col items-center gap-4">
                            <Monitor size={20} className="text-cyan-300" />
                            <span className="text-[11px] sm:text-xs text-cyan-300 font-bold tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                                {t('map_smartboard')}
                            </span>
                        </div>
                    </div>
                    <div className="h-20 w-20 bg-slate-800 border-2 border-blue-900 rounded-xl flex items-center justify-center text-blue-500 shadow-xl shadow-blue-500/10">
                        <Laptop size={28}/>
                    </div>
                </div>

                {/* El texto ahora tiene un absolute superior (-top-10) para no chocar */}
                <div className="grid grid-rows-4 gap-14 relative">
                    <span className="absolute -top-10 left-0 text-[10px] text-blue-500 font-bold uppercase tracking-widest">{t('map_lab')}</span>
                    {[0, 1, 2, 3].map(r => (
                        <div key={r} className="flex gap-5">
                            {Array.from({ length: 8 }).map((_, c) => renderSeat('salon-principal', `row${r + 1}-${c}`))}
                        </div>
                    ))}
                </div>

                <div className="border-l-4 border-slate-800 pl-10 flex flex-col justify-between relative">
                    <span className="absolute -top-10 left-10 text-[10px] text-purple-400 font-bold uppercase tracking-widest">{t('map_office')}</span>
                    <div className="grid grid-cols-2 gap-5">
                        {Array.from({ length: 8 }).map((_, i) => renderSeat('sala-respaldo', `office-${i}`))}
                    </div>
                    <div className="h-16 w-16 bg-slate-800 border-2 border-purple-500 border-opacity-30 rounded-xl flex items-center justify-center text-purple-400 shadow-xl shadow-purple-500/10">
                        <Laptop size={28}/>
                    </div>
                </div>
            </div>
        </div>

        {showBookingModal && (
            <BookingModal
                onClose={() => { setShowBookingModal(false); setSelectedSeats([]); }}
                resources={resources} reservations={reservations} userId={userId} userRole={userRole}
                preselectedSeats={selectedSeats} defaultDate={filterDate} defaultStart={filterStart} defaultEnd={filterEnd}
            />
        )}
    </div>
  );
}