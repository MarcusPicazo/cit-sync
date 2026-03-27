import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useI18n } from '../../../contexts/I18nContext';
import { parseDateObj, formatTime } from '../../../utils/dates';
import { getResourceIcon, formatUserName } from '../../../utils/formatters';

export default function VisualTimeline({ reservations, resources }) {
  const startHour = 7; 
  const endHour = 19; 
  const totalHours = endHour - startHour;
  const activeResources = resources.filter(r => r.category === 'equipment' || r.category === 'space');
  const { t, lang } = useI18n();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getNowPosition = () => {
    const h = now.getHours() + now.getMinutes() / 60;
    if (h < startHour || h > endHour) return -1;
    return ((h - startHour) / totalHours) * 100;
  };

  const nowPos = getNowPosition();
  const hourLabels = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 text-white">
        <h3 className="text-lg font-bold flex items-center leading-none tracking-tight">
          <CalendarIcon className="mr-2 text-blue-500" size={20}/> {String(t('timeline_title'))}
        </h3>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-800 bg-opacity-50 px-3 py-1.5 rounded-lg border border-slate-700">
          {String(t('timeline_subtitle'))}
        </span>
      </div>

      <div className="flex-1 rounded-2xl border border-slate-600 border-opacity-50 bg-slate-900 bg-opacity-30 shadow-inner overflow-hidden flex flex-col relative timeline-outer cursor-default">
        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar relative">
          <div className="min-w-[750px] h-full flex flex-col relative">
            <div className="timeline-header flex sticky top-0 bg-slate-950 bg-opacity-90 backdrop-blur z-30 border-b border-slate-600 h-10 items-end pb-1">
              <div className="w-24 sm:w-32 shrink-0 border-r border-slate-600"></div>
              <div className="flex-1 relative h-full">
                {hourLabels.map(h => (
                  <div key={h} className="absolute border-l border-slate-600 border-opacity-50 h-full flex flex-col justify-end" style={{ left: `${((h - startHour)/totalHours)*100}%` }}>
                    <span className="text-[9px] text-slate-400 ml-1.5 font-bold mb-1">{h}:00</span>
                  </div>
                ))}
                {nowPos >= 0 && (
                  <div className="absolute h-full z-40" style={{ left: `${nowPos}%` }}>
                    <div className="absolute bottom-1.5 -translate-x-1/2 now-indicator-badge bg-red-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-[0_0_10px_rgba(239,68,68,0.6)] whitespace-nowrap tracking-wide">
                      {formatTime(now, lang)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 relative pb-2">
              <div className="absolute inset-0 flex ml-24 sm:ml-32">
                <div className="flex-1 relative">
                  {hourLabels.map(h => (
                    <div key={`bg-${h}`} className="absolute border-l border-slate-700 border-opacity-30 h-full pointer-events-none" style={{ left: `${((h - startHour)/totalHours)*100}%` }}></div>
                  ))}
                  {nowPos >= 0 && (
                    <div className="absolute border-l-2 border-red-500 border-opacity-60 now-indicator-line h-full z-20 pointer-events-none shadow-[0_0_5px_rgba(239,68,68,0.4)]" style={{ left: `${nowPos}%` }}></div>
                  )}
                </div>
              </div>

              <div className="relative z-10">
                {activeResources.map((res, index) => {
                  const resv = reservations.filter(r => r.resourceId === res.id && r.status === 'approved');
                  const isEven = index % 2 === 0;
                  return (
                    <div key={res.id} className={`timeline-row-hover flex min-h-[56px] border-b border-slate-700 border-opacity-50 hover:bg-slate-700 hover:bg-opacity-40 transition-colors ${isEven ? 'bg-slate-800 bg-opacity-30' : 'bg-transparent'}`}>
                      <div className="timeline-row-bg w-24 sm:w-32 shrink-0 p-3 flex flex-col justify-center border-r border-slate-600 border-opacity-50 bg-slate-900 bg-opacity-40 backdrop-blur-sm">
                        <div className="flex items-center text-slate-300 mb-1">
                          {getResourceIcon(res.id, 14, "mr-2 shrink-0 text-blue-400")}
                          <span className="text-[10px] font-bold truncate tracking-wide">{t('res_' + res.id) || String(res.name)}</span>
                        </div>
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest">{res.category === 'equipment' ? t('cat_equip') : t('cat_space')}</span>
                      </div>
                      
                      <div className="flex-1 relative">
                        {resv.map(r => {
                          const startD = parseDateObj(r.startTime);
                          const endD = parseDateObj(r.endTime);
                          const s = Math.max(startHour, startD.getHours() + startD.getMinutes()/60);
                          const e = Math.min(endHour, endD.getHours() + endD.getMinutes()/60);
                          const left = ((s - startHour)/totalHours)*100;
                          const width = ((e - s)/totalHours)*100;
                          const isMobile = res.category === 'equipment';
                          
                          return (
                            <div key={r.id} className={`absolute top-2 bottom-2 rounded-lg border shadow-md animate-slide-up flex flex-col justify-center overflow-hidden group z-10 hover:z-30 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl ${isMobile ? 'bg-emerald-500 bg-opacity-80 hover:bg-emerald-500 border-emerald-400 shadow-emerald-500/20' : 'bg-blue-500 bg-opacity-80 hover:bg-blue-500 border-blue-400 shadow-blue-500/20'}`} style={{ left: `${left}%`, width: `${width}%` }}>
                              <div className="px-2 truncate">
                                <span className="text-[9px] font-bold text-white block truncate drop-shadow-md">{t('subj_' + String(r.subject).toLowerCase()) || String(r.subject)}</span>
                                <span className="text-[8px] text-white/90 font-medium hidden sm:block truncate drop-shadow-md">{formatUserName(r.userName, t)}</span>
                              </div>
                              <div className="absolute inset-0 bg-slate-900 bg-opacity-95 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1 text-center backdrop-blur-md">
                                <span className="text-[9px] text-white font-bold mb-0.5">{formatTime(r.startTime, lang)} - {formatTime(r.endTime, lang)}</span>
                                <span className="text-[8px] text-slate-300 truncate w-full">{formatUserName(r.userName, t)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}