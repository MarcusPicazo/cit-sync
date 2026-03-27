import React, { useState } from 'react';
import { Activity, Map as MapIcon, Search, ChevronRight } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { checkOverlap, parseDateObj, toISOStringLocal } from '../../utils/dates';
import { getResourceIcon } from '../../utils/formatters';
import CustomDatePicker from '../../shared/ui/CustomDatePicker';
import CustomTimePicker from '../../shared/ui/CustomTimePicker';
import VisualTimeline from './components/VisualTimeline';
import BookingModal from './components/BookingModal';
import MaintenanceModal from './components/MaintenanceModal';

export default function DashboardView({ resources, reservations, userRole, userId, navigateToMap }) {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [filterDate, setFilterDate] = useState(toISOStringLocal(new Date()).split('T')[0]);
  const [filterStart, setFilterStart] = useState('08:00');
  const [filterEnd, setFilterEnd] = useState('10:00');
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [currentTime] = useState(new Date());
  
  const { t } = useI18n();
  const mobileEquipment = resources.filter(r => r.category === 'equipment');
  
  const todaysReservations = reservations.filter(r => {
    const d = parseDateObj(r.startTime);
    return d.toDateString() === new Date().toDateString();
  }).sort((a,b) => parseDateObj(a.startTime) - parseDateObj(b.startTime));

  const getUsage = (resId) => {
    const fS = new Date(`${filterDate}T${filterStart}`);
    const fE = new Date(`${filterDate}T${filterEnd}`);
    
    const filterFn = isFilterActive 
      ? (r) => checkOverlap(fS, fE, parseDateObj(r.startTime), parseDateObj(r.endTime)) 
      : (r) => parseDateObj(r.startTime) <= currentTime && parseDateObj(r.endTime) >= currentTime;
      
    return reservations
      .filter(r => r.resourceId === resId && r.status === 'approved' && filterFn(r))
      .reduce((acc, r) => acc + (parseInt(r.quantity) || 1), 0);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header del Dashboard */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-700 border-opacity-50 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div>
            <span className="px-2 py-0.5 rounded-full bg-blue-500 bg-opacity-20 text-blue-500 text-[10px] font-bold uppercase tracking-widest border border-blue-500 border-opacity-30 mb-2 inline-flex items-center">
              <Activity size={12} className="mr-1"/> {t('dash_os')}
            </span>
            <h2 className="text-3xl font-bold mb-2 tracking-tight">{String(t('dash_title'))}</h2>
            <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">{String(t('dash_subtitle'))}</p>
          </div>
          <div className="bg-slate-800 bg-opacity-80 p-5 rounded-2xl border border-slate-700 cursor-pointer hover:border-blue-500 transition-all shadow-xl group" onClick={navigateToMap}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-slate-900 rounded-xl text-blue-400 group-hover:scale-110 transition-transform"><MapIcon size={24}/></div>
              <div className="pr-4">
                <h3 className="text-sm font-bold">{String(t('nav_map'))}</h3>
                <p className="text-[11px] text-slate-500 font-medium">{t('dash_book_lab')}</p>
              </div>
              <ChevronRight className="text-slate-600 group-hover:text-blue-500 transition-colors"/>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          
          {/* Barra de Filtros */}
          <div className="bg-slate-900 bg-opacity-60 p-4 rounded-2xl border border-slate-700 border-opacity-50 flex flex-wrap gap-4 items-center shadow-lg backdrop-blur-md relative z-50">
            <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest px-2"><Search size={16}/> {String(t('dash_search'))}</div>
            <div className="w-36 relative z-50">
              <CustomDatePicker value={filterDate} onChange={setFilterDate} className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none hover:border-slate-500 transition-colors cursor-pointer" />
            </div>
            <div className="flex items-center gap-2 relative z-50">
              <div className="w-24">
                <CustomTimePicker value={filterStart} onChange={setFilterStart} className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none hover:border-slate-500 transition-colors cursor-pointer" />
              </div>
              <span className="text-slate-600 font-bold">-</span>
              <div className="w-24">
                <CustomTimePicker value={filterEnd} onChange={setFilterEnd} className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none hover:border-slate-500 transition-colors cursor-pointer" />
              </div>
            </div>
            <button onClick={()=>setIsFilterActive(!isFilterActive)} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer ${isFilterActive ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
              {isFilterActive ? String(t('dash_clear')) : String(t('dash_filter'))}
            </button>
          </div>

          {/* Grid de Equipos (Laptops, Tablets, etc.) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {mobileEquipment.map(res => {
              const used = getUsage(res.id); 
              const avail = res.quantity - used;
              return (
                <div key={res.id} className="bg-slate-900 bg-opacity-60 border border-slate-700 border-opacity-50 p-6 rounded-3xl flex flex-col justify-between hover:border-emerald-500 hover:border-opacity-40 transition-all shadow-lg relative overflow-hidden group animate-slide-up">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-slate-800 border border-slate-700 text-emerald-500 rounded-xl shadow-inner">{getResourceIcon(res.id, 24)}</div>
                      <div>
                        <h4 className="font-bold text-white leading-tight">{t('res_' + res.id) || String(res.name)}</h4>
                        <span className={`text-[10px] font-bold uppercase ${avail > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {avail > 0 ? `${String(t('status_avail'))} (${avail})` : String(t('status_out'))}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6 relative z-10">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-widest">
                      <span>{t('dash_usage')}</span><span>{used}/{res.quantity}</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.4)]" style={{width: `${(used/res.quantity)*100}%`}}></div>
                    </div>
                  </div>

                  {(() => {
                    const canRequest = userRole === 'profesor' || userRole === 'admin';
                    const isDisabled = !canRequest || avail <= 0;
                    let btnText = t('dash_req_internal');
                    let btnClass = "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 border-opacity-30";
                    
                    if (canRequest) {
                      if (avail > 0) {
                        btnText = t('btn_request');
                        btnClass = "bg-blue-600 text-white hover:bg-blue-500 shadow-lg cursor-pointer";
                      } else {
                        btnText = t('status_out');
                        btnClass = "bg-red-500 bg-opacity-10 text-red-400 cursor-not-allowed border border-red-500 border-opacity-20";
                      }
                    }
                    return (
                      <button disabled={isDisabled} onClick={() => { setSelectedResource(res); setShowBookingModal(true); }} className={`w-full py-3 rounded-xl text-xs font-bold transition-all relative z-10 uppercase tracking-widest ${btnClass}`}>
                        {btnText}
                      </button>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>

        {/* Línea de Tiempo */}
        <div className="bg-slate-900 bg-opacity-60 p-6 rounded-3xl border border-slate-700 border-opacity-50 shadow-2xl h-[500px] backdrop-blur-md">
          <VisualTimeline reservations={todaysReservations} resources={resources} />
        </div>
      </div>

      {/* Renderizado de Modales */}
      {showBookingModal && (
        <BookingModal 
          onClose={() => {setShowBookingModal(false); setSelectedResource(null);}} 
          resources={resources} 
          reservations={reservations} 
          userId={userId} 
          userRole={userRole} 
          initialResource={selectedResource} 
        />
      )}
      
      {showMaintenanceModal && (
        <MaintenanceModal 
          onClose={() => {setShowMaintenanceModal(false); setSelectedResource(null);}} 
          resource={selectedResource} 
        />
      )}
    </div>
  );
}