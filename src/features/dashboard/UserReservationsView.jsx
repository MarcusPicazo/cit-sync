import React from 'react';
import { Clock, BookOpen, Trash2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useI18n } from '../../contexts/I18nContext';
import { deleteDoc, doc } from 'firebase/firestore';
import { publicPath } from '../../config/firebase';

// Utilidades locales para evitar errores de fechas
const parseDateObj = (val) => {
  if (!val) return new Date();
  if (typeof val.toDate === 'function') return val.toDate();
  return new Date(val);
};

const formatDate = (date, lang = 'es') => {
  if (!date) return '';
  const d = parseDateObj(date);
  return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
};

const formatTime = (date, lang = 'es') => {
  if (!date) return '';
  const d = parseDateObj(date);
  return d.toLocaleTimeString(lang === 'en' ? 'en-US' : 'es-MX', { hour: '2-digit', minute: '2-digit' });
};

export default function UserReservationsView({ reservations, userId, resources }) {
  const { t, lang } = useI18n();
  const { showToast } = useToast();

  const my = reservations
    .filter(r => r.userId === userId)
    .sort((a,b) => parseDateObj(b.startTime) - parseDateObj(a.startTime));

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(publicPath('reservations'), id));
      showToast(t('toast_res_cancel') === 'toast_res_cancel' ? "Reserva cancelada." : t('toast_res_cancel'), "success");
    } catch {
      showToast(t('toast_err') === 'toast_err' ? "Error." : t('toast_err'), "error");
    }
  };

  // Función de traducción a prueba de balas (Fallback)
  const safeTranslate = (key, fallback) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-8 cursor-default pb-10">
      
      {/* HEADER DE LA SECCIÓN */}
      <header className="border-b border-slate-800/50 pb-6 flex items-end justify-between text-white">
        <h2 className="text-3xl font-bold leading-none tracking-tight drop-shadow-md">
          {safeTranslate('res_my', 'Mis Reservas')}
        </h2>
        <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
          {my.length} {safeTranslate('res_records', 'registros')}
        </span>
      </header>

      {/* LISTA DE RESERVAS */}
      <div className="space-y-5">
        {my.length === 0 ? (
          <div className="py-24 text-center text-slate-500 font-bold uppercase tracking-[0.3em] opacity-50 font-sans">
            {safeTranslate('res_empty', 'Sin reservas activas')}
          </div>
        ) : (
          my.map(r => {
            // Identificar nombre del recurso
            const rawResName = resources?.find(res => res.id === r.resourceId)?.name || 'Recurso CIT';
            const resourceName = safeTranslate('res_' + r.resourceId, rawResName);

            // Identificar color de estado
            const statusColor = r.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                                r.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                                'bg-amber-500/10 text-amber-500 border-amber-500/30';

            return (
              <div key={r.id} className="bg-[#0a0f1c] p-6 rounded-3xl border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between group shadow-xl transition-all hover:border-slate-500 hover:shadow-2xl">
                <div className="flex-1">
                  
                  {/* Fila superior: Badge de Estado y Fecha */}
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase border tracking-wider ${statusColor}`}>
                      {safeTranslate('req_status_' + r.status, r.status)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold font-mono tracking-tighter">
                      {formatDate(r.startTime, lang)}
                    </span>
                  </div>

                  {/* Título de la reserva */}
                  <h4 className="font-bold text-white text-xl leading-tight mb-2">{resourceName}</h4>

                  {/* Fila inferior: Horario y Materia */}
                  <div className="flex flex-wrap items-center gap-4 font-medium text-slate-400">
                    <span className="text-xs flex items-center">
                      <Clock size={14} className="mr-1.5 text-slate-500"/>
                      {formatTime(r.startTime, lang)} - {formatTime(r.endTime, lang)}
                    </span>
                    <span className="text-xs flex items-center uppercase tracking-widest text-blue-400/80">
                      <BookOpen size={14} className="mr-1.5 text-slate-500"/>
                      {safeTranslate('subj_' + String(r.subject).toLowerCase(), r.subject)}
                    </span>
                  </div>
                </div>

                {/* Botón de eliminar */}
                <button
                  onClick={() => handleDelete(r.id)}
                  className="mt-4 sm:mt-0 p-3.5 text-slate-500 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-2xl cursor-pointer border border-transparent hover:border-red-500/20"
                  title="Cancelar Reserva"
                >
                  <Trash2 size={20}/>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}