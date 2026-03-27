import React, { useState } from 'react';
import { AlertTriangle, Trash2, CalendarDays } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useI18n } from '../../contexts/I18nContext';
import { parseDateObj, formatDate, formatTime } from '../../utils/dates';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { publicPath } from '../../config/firebase';
import CustomSelect from '../../shared/ui/CustomSelect';

export default function AdminPanelView({ resources, reservations }) {
  const pending = reservations.filter(r => r.status === 'pending').sort((a,b) => parseDateObj(a.startTime) - parseDateObj(b.startTime));
  const { showToast } = useToast();
  const { t, lang } = useI18n();

  const updateStatus = async (id, status) => { 
      try { 
          await updateDoc(doc(publicPath('reservations'), id), { status }); 
          showToast(t('toast_status_upd'), 'success'); 
      } catch { 
          showToast(t('toast_err_upd'), "error"); 
      } 
  };

  const handleDelete = async (id) => {
      try {
        await deleteDoc(doc(publicPath('reservations'), id));
        showToast(t('toast_res_cancel'), 'success');
      } catch {
        showToast(t('toast_err'), 'error');
      }
  };

  return (
    <div className="animate-fade-in grid grid-cols-1 xl:grid-cols-3 gap-8 text-white cursor-default">
      
      {/* PANEL DE SOLICITUDES */}
      <div className="xl:col-span-1 bg-slate-900 bg-opacity-60 p-6 rounded-3xl border border-slate-700 border-opacity-50 shadow-xl h-[700px] flex flex-col backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-amber-500 flex items-center leading-none tracking-tight uppercase">
                <AlertTriangle className="mr-2" size={24}/> {t('admin_reqs')} ({pending.length})
            </h3>
        </div>

        <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
          {pending.length === 0 ? (
              <div className="py-24 text-center text-slate-700 font-bold uppercase tracking-widest opacity-40 font-sans">{t('admin_clean')}</div>
          ) : pending.map(r => (
            <div key={r.id} className="bg-slate-800 bg-opacity-80 p-5 rounded-2xl border border-slate-700 border-opacity-50 space-y-4 shadow-lg animate-slide-up">
              <div>
                <h4 className="font-bold text-white text-base leading-tight">{t('res_' + r.resourceId) || String (resources.find(res=>res.id===r.resourceId)?.name)}</h4>
                <p className="text-[10px] text-slate-500 font-bold mt-1 font-mono tracking-tighter">{formatDate(r.startTime, lang)} | {formatTime(r.startTime, lang)} - {formatTime(r.endTime, lang)}</p>
                <div className="mt-3 p-3 bg-slate-950 bg-opacity-50 rounded-xl border border-slate-700 border-opacity-50">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('admin_applicant')} <span className="text-white">{formatUserName(r.userName, t)}</span></p>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">{t('admin_subject')} <span className="text-blue-400">{t('subj_' + String(r.subject).toLowerCase()) || String(r.subject)}</span></p>
                </div>
              </div>
              <div className="flex gap-2">
                  <button onClick={()=>updateStatus(r.id, 'approved')} className="flex-1 py-2.5 bg-emerald-500 bg-opacity-20 text-emerald-500 rounded-xl text-[10px] font-bold border border-emerald-500 border-opacity-30 hover:bg-emerald-600 hover:text-white transition-all uppercase tracking-widest cursor-pointer">{t('admin_approve')}</button>
                  <button onClick={()=>updateStatus(r.id, 'rejected')} className="flex-1 py-2.5 bg-red-500 bg-opacity-20 text-red-500 rounded-xl text-[10px] font-bold border border-red-500 border-opacity-30 hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest cursor-pointer">{t('admin_reject')}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CUADRÍCULA SEMANAL */}
      <div className="xl:col-span-2 h-[700px] shadow-2xl backdrop-blur-sm">
          <WeeklyCalendarGrid reservations={reservations} resources={resources} />
      </div>
    </div>
  );
}

// COMPONENTE: CUADRÍCULA SEMANAL
function WeeklyCalendarGrid({ reservations, resources }) {
  const [sel, setSel] = useState(resources[0]?.id || '');
  const {t} = useI18n();
  const days = [t('day_mon'), t('day_tue'), t('day_wed'), t('day_thu'), t('day_fri')];
  const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  // Forzar actualización si resources cambia y sel está vacío
  React.useEffect(() => {
      if (!sel && resources.length > 0) setSel(resources[0].id);
  }, [resources, sel]);

  return (
    <div className="bg-slate-900 bg-opacity-60 p-6 sm:p-8 rounded-3xl border border-slate-700 border-opacity-50 h-full flex flex-col animate-fade-in shadow-2xl relative overflow-hidden backdrop-blur-md text-white cursor-default">
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-white"><CalendarDays size={200}/></div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-50">
        <div>
            <h3 className="text-xl font-bold text-white flex items-center leading-none tracking-tight uppercase"><CalendarDays className="mr-2.5 text-purple-500" size={24}/> {t('grid_week')}</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-[0.2em]">{t('grid_planner')}</p>
        </div>
        <div className="w-64">
            <CustomSelect
                value={sel}
                onChange={val => setSel(val)}
                options={resources.map(r => ({value: r.id, label: t('res_' + r.id) || String(r.name)}))}
                className="py-2.5 rounded-xl font-bold shadow-xl text-xs"
            />
        </div>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar border border-slate-700 border-opacity-30 rounded-2xl bg-slate-950 bg-opacity-30 relative z-10 shadow-inner">
        <div className="min-w-[700px] h-full grid grid-cols-6 divide-x divide-slate-800 border-opacity-50 font-sans">
          <div className="border-b border-slate-800 bg-slate-900 bg-opacity-80 sticky top-0 z-20"></div>
          {days.map(d=><div key={d} className="border-b border-slate-800 p-4 text-center text-[10px] font-bold text-slate-400 bg-slate-900 bg-opacity-80 sticky top-0 z-20 uppercase tracking-[0.2em]">{d}</div>)}
          {hours.map(h=>(
              <React.Fragment key={h}>
                  <div className="border-b border-slate-800 border-opacity-30 p-3 text-right text-[10px] font-mono text-slate-600 pr-6 bg-slate-900 bg-opacity-20 font-bold">{h}:00</div>
                  {days.map((_,di)=>{
                    const slotRes = reservations.filter(r=>{
                        const sd = parseDateObj(r.startTime);
                        return r.resourceId===sel && (sd.getDay()-1)===di && h===sd.getHours() && r.status === 'approved';
                    });
                    return (
                        <div key={di} className="border-b border-slate-800 border-opacity-30 p-1.5 relative min-h-[50px] hover:bg-slate-800 hover:bg-opacity-20 transition-colors">
                            {slotRes.map((occ,oi)=>(
                                <div key={oi} className="absolute inset-1.5 rounded-lg bg-purple-500 bg-opacity-10 border border-purple-500 border-opacity-40 p-2 overflow-hidden shadow-lg animate-slide-up hover:bg-purple-500 hover:bg-opacity-20 transition-all cursor-default">
                                    <p className="text-[9px] font-bold text-purple-300 leading-tight truncate uppercase tracking-tighter">{t('subj_' + String(occ.subject).toLowerCase()) || String(occ.subject)}</p>
                                </div>
                            ))}
                        </div>
                    );
                  })}
              </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// Utilidad auxiliar para el nombre
function formatUserName(name, t) {
    if (!name) return '';
    let str = String(name);
    if (str.startsWith('Usuario ')) {
        const role = str.split(' ')[1];
        return `${t('role_user')} ${String(t('role_' + role)).toLowerCase()}`;
    }
    return str;
}