import React from 'react';
import { CheckSquare } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { useI18n } from '../../../contexts/I18nContext';
import { doc, updateDoc } from 'firebase/firestore';
import { publicPath } from '../../../config/firebase';
import { formatDate } from '../../../utils/dates';

export default function AppRequestsList({ requests, userRole, lang }) {
  const { showToast } = useToast();
  const { t } = useI18n();

  const updateStatus = async (id, status) => { 
    try { 
      await updateDoc(doc(publicPath('app_requests'), id), { status }); 
      showToast(t('toast_status_upd'), 'success'); 
    } catch { 
      showToast(t('toast_err_upd'), 'error'); 
    } 
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in text-white cursor-default">
      {requests.length === 0 ? (
        <div className="col-span-full py-24 text-center text-slate-700 font-bold uppercase tracking-[0.3em] opacity-40">{t('fact_empty')}</div>
      ) : requests.map(req => (
        <div key={req.id} className="bg-slate-900 bg-opacity-60 p-6 rounded-3xl border border-slate-700 border-opacity-50 flex flex-col justify-between shadow-xl backdrop-blur-md hover:border-indigo-500 hover:border-opacity-30 transition-all">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase border ${req.status==='completed'?'bg-emerald-500 bg-opacity-10 text-emerald-500 border-emerald-500 border-opacity-30': 'bg-amber-500 bg-opacity-10 text-amber-500 border-amber-500 border-opacity-30'}`}>{t('req_status_' + req.status)}</span>
              <span className="text-[10px] text-slate-500 font-bold font-mono tracking-tighter">{formatDate(req.createdAt, lang)}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1 leading-tight">{String(req.projectName)}</h3>
            <p className="text-xs text-indigo-400 mb-4 font-bold uppercase tracking-widest">{t(String(req.experienceType))}</p>
            
            {req.experienceType === 'Examen con IA' && (
              <div className="mb-4 bg-slate-800 bg-opacity-50 p-3 rounded-xl border border-slate-700 border-opacity-50 text-xs text-slate-300 space-y-1.5">
                {req.aiFeedback && <p className="text-indigo-400 font-bold flex items-center"><CheckSquare size={12} className="mr-1.5"/> {t('fact_ai_feedback')}</p>}
                <p><span className="text-slate-500">{t('fact_grade')}</span> {t(String(req.academicGrade || 'N/A'))}</p>
                <p><span className="text-slate-500">{t('fact_theme')}</span> {String(req.visualTheme || 'N/A')}</p>
                <p className="truncate"><span className="text-slate-500">{t('fact_types')}</span> {req.questionTypes ? req.questionTypes.map(qt => t(qt)).join(', ') : 'N/A'}</p>
              </div>
            )}
            <p className="text-sm text-slate-400 line-clamp-3 mb-6 font-medium leading-relaxed">{String(req.description)}</p>
          </div>
          
          {userRole === 'admin' && (
            <div className="pt-4 border-t border-slate-800 flex gap-2">
              <button onClick={()=>updateStatus(req.id, 'in_development')} className="flex-1 py-2 bg-indigo-500 bg-opacity-20 text-indigo-400 text-[10px] font-bold rounded-lg border border-indigo-500 border-opacity-30 hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest cursor-pointer">{t('fact_btn_dev')}</button>
              <button onClick={()=>updateStatus(req.id, 'completed')} className="flex-1 py-2 bg-emerald-500 bg-opacity-20 text-emerald-500 text-[10px] font-bold rounded-lg border border-emerald-500 border-opacity-30 hover:bg-emerald-600 hover:text-white transition-all uppercase tracking-widest cursor-pointer">{t('fact_btn_comp')}</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}