import React, { useState } from 'react';
import { Plus, LayoutDashboard } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import AppRequestForm from './components/AppRequestForm';
import AppRequestsList from './components/AppRequestsList';

export default function AppFactoryView({ appRequests, userId, userRole }) {
  const { t, lang } = useI18n();
  const [viewMode, setViewMode] = useState('list');
  
  const visibleRequests = userRole === 'admin' ? appRequests : appRequests.filter(req => req.userId === userId);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="bg-slate-900 border border-slate-700 border-opacity-50 p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-white">
          <h2 className="text-3xl font-bold mb-1 leading-tight">{t('factory_title')}</h2>
          <p className="text-slate-400 text-sm font-medium">{t('factory_subtitle')}</p>
        </div>
        <button 
          onClick={() => setViewMode(viewMode === 'list' ? 'new' : 'list')} 
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center shrink-0 cursor-pointer"
        >
          {viewMode === 'list' ? (
            <><Plus size={20} className="mr-2"/>{t('factory_new')}</>
          ) : (
            <><LayoutDashboard size={20} className="mr-2"/>{t('factory_list')}</>
          )}
        </button>
      </div>

      {viewMode === 'new' ? (
        <AppRequestForm userId={userId} userRole={userRole} onSuccess={() => setViewMode('list')} />
      ) : (
        <AppRequestsList requests={visibleRequests} userRole={userRole} lang={lang} />
      )}
    </div>
  );
}