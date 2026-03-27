import React from 'react';
import { Wrench } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { publicPath } from '../../../config/firebase';
import { useToast } from '../../../contexts/ToastContext';
import { useI18n } from '../../../contexts/I18nContext';

export default function MaintenanceModal({ onClose, resource }) {
  const { showToast } = useToast();
  const { t } = useI18n();

  const handleFix = async () => {
    try { 
      await updateDoc(doc(publicPath('resources'), resource.id), { status: 'maintenance' });
      showToast(t('toast_req_block'), "warning"); 
      onClose(); 
    } catch { 
      showToast(t('toast_err_rep'), "error"); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in text-white cursor-default">
      <div className="bg-slate-900 border border-amber-500 border-opacity-30 w-full max-w-md rounded-3xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-amber-500 bg-opacity-20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500 border-opacity-30 shadow-inner">
          <Wrench size={32}/>
        </div>
        <h3 className="text-xl font-bold mb-2 leading-tight uppercase tracking-widest">{t('modal_maint_title')}</h3>
        <p className="text-sm text-slate-400 mb-8 font-medium">
          {t('modal_maint_desc')} <br/>
          <span className="text-amber-500 font-bold">{t('res_' + resource?.id) || resource?.name}</span>?
        </p>
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 text-slate-400 font-bold hover:text-white transition-colors border border-slate-700 rounded-2xl cursor-pointer">
            {t('btn_cancel')}
          </button>
          <button onClick={handleFix} className="flex-1 py-3 bg-amber-600 text-white rounded-2xl font-bold shadow-lg uppercase text-xs tracking-widest hover:bg-amber-500 transition-colors cursor-pointer">
            {t('btn_confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}