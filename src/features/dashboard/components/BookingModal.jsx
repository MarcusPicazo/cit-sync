import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { publicPath } from '../../../config/firebase'; 
import { useToast } from '../../../contexts/ToastContext';
import { useI18n } from '../../../contexts/I18nContext';
import CustomDatePicker from '../../../shared/ui/CustomDatePicker';
import CustomTimePicker from '../../../shared/ui/CustomTimePicker';
import CustomSelect from '../../../shared/ui/CustomSelect';

export default function BookingModal({ onClose, resources, reservations, userId, userRole, initialResource, preselectedSeats = [], defaultDate, defaultStart, defaultEnd }) {
  const { showToast } = useToast();
  const { t } = useI18n();
  
  // NUEVO: Oyente para la tecla ESC (Cerrar modal)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const isMobile = initialResource && initialResource.category === 'equipment';
  const derivedId = preselectedSeats.length > 0 ? (preselectedSeats[0].startsWith('office') ? 'sala-respaldo' : 'salon-principal') : (initialResource?.id || "");
  
  const [form, setForm] = useState({ 
    resourceId: derivedId, 
    date: defaultDate || new Date().toISOString().split('T')[0], 
    start: defaultStart || '08:00', 
    end: defaultEnd || '10:00', 
    subject: 'Matemáticas', 
    quantity: 1, 
    location: "", 
    matricula: "", 
    numeroEmpleado: "" 
  });

  const handleSave = async (e) => {
    e.preventDefault();
    const sTime = new Date(`${form.date}T${form.start}:00`); 
    const eTime = new Date(`${form.date}T${form.end}:00`);
    if (eTime <= sTime) { showToast(t('toast_end_after_start'), "error"); return; }
    if (userRole === 'alumno' && !form.matricula) { showToast(t('toast_mat_req'), "error"); return; }
    if (userRole === 'profesor' && !form.numeroEmpleado) { showToast(t('toast_emp_req'), "error"); return; }
    try {
      await setDoc(doc(publicPath('reservations'), crypto.randomUUID()), { 
        ...form, 
        startTime: sTime, 
        endTime: eTime, 
        seatIds: preselectedSeats.length > 0 ? preselectedSeats : ['all'],
        userId, 
        userName: userRole, 
        status: userRole === 'admin' ? 'approved' : 'pending', 
        createdAt: new Date() 
      });
      showToast(t('toast_req_sent'), "success");
      onClose();
    } catch { 
        showToast(t('toast_err_save'), "error"); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in text-white cursor-default">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className={`p-6 border-b border-slate-700 flex justify-between items-center ${isMobile?'bg-emerald-900 bg-opacity-20': 'bg-blue-900 bg-opacity-20'}`}>
          <h3 className="font-bold text-xl leading-none uppercase tracking-widest">{t('modal_book_title')}</h3>
          <button onClick={onClose} className="p-1 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors cursor-pointer"><XCircle size={24}/></button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-visible custom-scrollbar text-sm pb-32">
          {userRole === 'alumno' && <div className="space-y-1.5"><label className="text-[10px] uppercase font-bold text-slate-500 ml-1">{t('modal_book_mat')}</label><input type="text" placeholder={t('modal_book_mat_ph')} value={form.matricula} onChange={e=>setForm({...form, matricula: e.target.value})} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 text-white outline-none focus:border-blue-500 font-medium cursor-text"/></div>}
          {userRole === 'profesor' && <div className="space-y-1.5"><label className="text-[10px] uppercase font-bold text-slate-500 ml-1">{t('modal_book_emp')}</label><input type="text" placeholder={t('modal_book_emp_ph')} value={form.numeroEmpleado} onChange={e=>setForm({...form, numeroEmpleado: e.target.value})} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 text-white outline-none focus:border-indigo-500 font-medium cursor-text"/></div>}
          <div className="grid grid-cols-2 gap-4 relative z-50">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">{t('modal_book_date')}</label>
              <CustomDatePicker value={form.date} onChange={val=>setForm({...form, date: val})} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 text-white outline-none font-medium hover:border-slate-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">{t('modal_book_subj')}</label>
              <CustomSelect value={form.subject} onChange={val => setForm({...form, subject: val})} options={['Matemáticas', 'Programación', 'Física'].map(sbj => ({value: sbj, label: t('subj_' + sbj.toLowerCase()) || sbj}))} className="p-3 rounded-xl font-medium" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 relative z-40">
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">{t('modal_book_start')}</label>
              <CustomTimePicker value={form.start} onChange={val=>setForm({...form, start: val})} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 text-white outline-none font-medium hover:border-slate-500" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">{t('modal_book_end')}</label>
              <CustomTimePicker value={form.end} onChange={val=>setForm({...form, end: val})} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 text-white outline-none font-medium hover:border-slate-500" />
            </div>
          </div>
          {isMobile && <div className="grid grid-cols-2 gap-4"><div className="space-y-1.5"><label className="text-[10px] uppercase font-bold text-slate-500 ml-1">{t('modal_book_qty')}</label><input type="number" min="1" value={form.quantity} onChange={e=>setForm({...form, quantity: e.target.value})} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 text-white outline-none font-medium cursor-text"/><p className="text-[9px] text-slate-500 italic ml-1">{t('modal_max')} {initialResource ? initialResource.quantity: ""}</p></div><div className="space-y-1.5"><label className="text-[10px] uppercase font-bold text-slate-500 ml-1">{t('modal_book_loc')}</label><input type="text" placeholder={t('modal_book_loc_ph')} value={form.location} onChange={e=>setForm({...form, location: e.target.value})} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 text-white outline-none font-medium cursor-text"/></div></div>}
          <button type="submit" className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-white hover:bg-blue-500 shadow-xl mt-4 uppercase tracking-widest transition-all cursor-pointer">{t('modal_book_submit')}</button>
        </form>
      </div>
    </div>
  );
}