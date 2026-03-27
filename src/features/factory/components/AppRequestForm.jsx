import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2, UploadCloud, Rocket, Brain, Info, Check, Sparkles, Palette, GraduationCap } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { publicPath } from '../../../config/firebase';
import { useToast } from '../../../contexts/ToastContext';
import { useI18n } from '../../../contexts/I18nContext';
import { appRequestSchema } from '../../../schemas/appRequest';
import CustomSelect from '../../../shared/ui/CustomSelect';
import CustomDatePicker from '../../../shared/ui/CustomDatePicker';

// Función auxiliar para el min del calendario
const getOneWeekFromToday = () => {
  const d = new Date(); d.setDate(d.getDate() + 7);
  const z = n => ('0' + n).slice(-2);
  return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
};

export default function AppRequestForm({ userId, userRole, onSuccess }) {
  const { showToast } = useToast();
  const { t } = useI18n();
  
  const { register, control, handleSubmit, watch, setValue, formState: { errors }} = useForm({
    resolver: zodResolver(appRequestSchema),
    defaultValues: { topicsMethod: 'manual', topics: [{ question: "", answer: ""}]}
  });
  
  const { fields, append, remove } = useFieldArray({ control, name: 'topics' });
  const method = watch('topicsMethod');
  const type = watch('experienceType');

  const onSubmit = async (data) => {
    try {
      await setDoc(doc(publicPath('app_requests'), crypto.randomUUID()), { 
        ...data, userId, userName: userRole, status: 'pending_review', createdAt: new Date() 
      });
      showToast(t('toast_proj_sent'), 'success'); 
      onSuccess();
    } catch { 
      showToast(t('toast_err_proc'), 'error'); 
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-900 bg-opacity-60 p-8 rounded-3xl border border-slate-700 border-opacity-50 shadow-2xl animate-slide-up space-y-8 max-w-4xl mx-auto backdrop-blur-md text-white cursor-default pb-40">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-500 block tracking-widest">{t('form_proj_name')}</label>
          <input {...register('projectName')} placeholder={t('form_proj_ph')} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-white outline-none focus:border-indigo-500 transition-all font-medium shadow-inner cursor-text"/>
          {errors.projectName && <p className="text-[10px] text-red-500 font-bold">{errors.projectName.message}</p>}
        </div>
        <div className="space-y-2 relative z-50">
          <label className="text-[10px] uppercase font-bold text-slate-500 block tracking-widest">{t('form_exp_type')}</label>
          <CustomSelect
            value={watch('experienceType')}
            onChange={val => setValue('experienceType', val, { shouldValidate: true })}
            options={['Web Interactiva / Dashboard', 'Minijuego / Gamificación', 'Simulador 3D', 'Realidad Aumentada (AR)', 'Realidad Virtual (VR)', 'Examen con IA', 'Otra'].map(opt => ({value: opt, label: t(opt)}))}
            className="p-3.5 rounded-xl font-medium"
          />
        </div>
      </div>

      {type === 'Examen con IA' && (
        <div className="p-6 bg-indigo-900 bg-opacity-10 border border-indigo-500 border-opacity-30 rounded-2xl space-y-5 animate-fade-in relative overflow-hidden">
          <Brain className="absolute -right-5 -bottom-5 text-indigo-500 opacity-5" size={120}/>
          <div className="bg-indigo-500 bg-opacity-10 border border-indigo-500 border-opacity-20 p-4 rounded-xl flex items-start relative z-10">
            <Info className="text-indigo-400 mr-3 shrink-0 mt-0.5" size={20}/>
            <p className="text-sm text-indigo-200/80 leading-relaxed">
              <strong className="text-indigo-300">{t('form_format_inst')} </strong>{t('form_format_desc')}
            </p>
          </div>
          
          <label className="flex items-start space-x-3 cursor-pointer group relative z-10 bg-slate-900 bg-opacity-50 p-4 rounded-xl border border-slate-700 border-opacity-50 hover:border-indigo-500 hover:border-opacity-50 transition-all">
            <div className="relative flex items-center justify-center mt-0.5 shrink-0">
              <input type="checkbox" {...register('aiFeedback')} className="peer appearance-none w-5 h-5 border-2 border-slate-600 rounded bg-slate-800 checked:bg-indigo-500 checked:border-indigo-500 transition-all cursor-pointer"/>
              <Check size={14} className="text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none"/>
            </div>
            <div>
              <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center"><Sparkles size={14} className="mr-1.5 text-indigo-400"/> {t('form_ai_integ')}</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t('form_ai_desc')}</p>
            </div>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-40">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 flex items-center tracking-widest"><Palette size={14} className="mr-1.5"/> {t('form_visuals')}</label>
              <input {...register('visualTheme')} placeholder={t('form_visuals_ph')} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 transition-all text-sm cursor-text"/>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 flex items-center tracking-widest"><GraduationCap size={14} className="mr-1.5"/> {t('form_grade_label')}</label>
              <CustomSelect
                value={watch('academicGrade')}
                onChange={val => setValue('academicGrade', val, { shouldValidate: true })}
                placeholder={t('form_grade_sel')}
                options={[{value: "", label: t('form_grade_sel')}, {value: 'Preescolar', label: t('opt_preescolar')}, {value: '1ro a 3ro de Primaria', label: t('opt_grade_1')}, {value: '4to a 6to de Primaria', label: t('opt_grade_2')}, {value: 'Secundaria', label: t('opt_grade_3')}, {value: 'Preparatoria', label: t('opt_grade_4')}]}
                className="p-3 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-slate-700 border-opacity-50">
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-widest">{t('form_q_types')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Opción Múltiple', 'Imágenes', 'Ordenar Oraciones', 'Conectar Cables', 'Completar Texto', 'Selección Dinámica'].map(qt => (
                <label key={qt} className="flex items-center space-x-2.5 cursor-pointer bg-slate-800 bg-opacity-50 p-3 rounded-xl border border-slate-700 hover:border-indigo-500 hover:border-opacity-40 transition-colors group">
                  <div className="relative flex items-center justify-center shrink-0">
                    <input type="checkbox" value={qt} {...register('questionTypes')} className="peer appearance-none w-4 h-4 border border-slate-500 rounded bg-slate-900 checked:bg-indigo-500 checked:border-indigo-500 transition-all cursor-pointer"/>
                    <Check size={10} className="text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none"/>
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 leading-tight group-hover:text-white transition-colors">{t(qt)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-30">
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-500 block tracking-widest">{t('form_target_aud')}</label>
          <CustomSelect
            value={watch('targetAudience')}
            onChange={val => setValue('targetAudience', val, { shouldValidate: true })}
            options={['Preescolar', 'Primaria', 'Secundaria', 'Preparatoria', 'Universidad'].map(opt => ({value: opt, label: t('opt_' + opt.toLowerCase())}))}
            className="p-3.5 rounded-xl font-medium"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-500 block tracking-widest mb-1">{t('form_date_des')}</label>
          <CustomDatePicker
            value={watch('deliveryDate') || ""}
            onChange={val => setValue('deliveryDate', val, { shouldValidate: true })}
            min={getOneWeekFromToday()}
            className="p-3.5 rounded-xl font-medium cursor-pointer w-full bg-slate-800 border border-slate-700 hover:border-slate-500 text-white outline-none"
          />
          <p className="text-[10px] text-indigo-400 mt-1 italic font-medium">{t('form_date_min')}</p>
          {errors.deliveryDate && <p className="text-[10px] text-red-500 font-bold">{errors.deliveryDate.message}</p>}
        </div>
      </div>

      <div className="space-y-2 relative z-20">
        <label className="text-[10px] uppercase font-bold text-slate-500 block tracking-widest">{t('form_desc_gen')}</label>
        <textarea {...register('description')} rows="3" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-white outline-none focus:border-indigo-500 resize-none font-medium shadow-inner cursor-text" placeholder={t('form_desc_ph')}/>
        {errors.description && <p className="text-[10px] text-red-500 font-bold">{errors.description.message}</p>}
      </div>

      <div className="bg-slate-800 bg-opacity-40 p-6 rounded-2xl border border-slate-700 border-opacity-50 shadow-inner relative z-10">
        <div className="flex space-x-6 border-b border-slate-800 mb-6">
          <button type="button" onClick={()=>setValue('topicsMethod', 'manual')} className={`text-xs font-bold pb-3 uppercase tracking-widest transition-all cursor-pointer ${method==='manual'?'text-indigo-400 border-b-2 border-indigo-400':'text-slate-500 hover:text-slate-300'}`}>{t('form_cap_man')}</button>
          <button type="button" onClick={()=>setValue('topicsMethod', 'file')} className={`text-xs font-bold pb-3 uppercase tracking-widest transition-all cursor-pointer ${method==='file'?'text-cyan-400 border-b-2 border-cyan-400':'text-slate-500 hover:text-slate-300'}`}>{t('form_up_doc')}</button>
        </div>
        
        {method === 'manual' ? (
          <div className="space-y-4">
            {fields.map((f, i) => (
              <div key={f.id} className="flex flex-col sm:flex-row gap-3 items-start animate-fade-in">
                <div className="w-8 h-10 shrink-0 flex items-center justify-center bg-slate-900 border border-slate-700 rounded-lg text-slate-500 text-[10px] font-bold shadow-inner">{i+1}</div>
                <input {...register(`topics.${i}.question`)} placeholder={t('form_q_theme')} className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500 shadow-inner cursor-text"/>
                <input {...register(`topics.${i}.answer`)} placeholder={t('form_a_concept')} className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500 shadow-inner cursor-text"/>
                <button type="button" onClick={()=>remove(i)} className="p-3 text-slate-500 hover:text-red-500 transition-colors bg-slate-900 bg-opacity-50 rounded-xl cursor-pointer"><Trash2 size={18}/></button>
              </div>
            ))}
            <button type="button" onClick={()=>append({question:"", answer:""})} className="px-5 py-2.5 bg-indigo-500 bg-opacity-10 text-indigo-400 border border-indigo-500 border-opacity-30 rounded-xl text-[10px] font-bold hover:bg-indigo-500 hover:bg-opacity-20 transition-all shadow-md cursor-pointer">{t('form_add_row')}</button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-700 p-12 text-center rounded-2xl hover:border-cyan-500 transition-all group bg-slate-900 bg-opacity-30 cursor-pointer">
            <UploadCloud size={40} className="mx-auto text-slate-500 group-hover:text-cyan-400 transition-colors mb-3 group-hover:scale-110"/>
            <h5 className="text-white font-bold text-sm">{t('form_drag_plan')}</h5>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">{t('form_formats')}</p>
          </div>
        )}
      </div>

      <button type="submit" className="w-full py-4 bg-indigo-600 rounded-2xl font-bold text-white hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30 uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 cursor-pointer"><Rocket size={20}/> {t('form_submit_dev')}</button>
    </form>
  );
}