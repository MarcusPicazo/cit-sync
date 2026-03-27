import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, X, Compass, Globe, Palette, Clover, Joystick, Bot, Cpu, Eye } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';

export default function AppCatalogView({ onPreviewChange }) {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [previewApp, setPreviewApp] = useState(null);

  const realApps = [
    { id: 1, title: t('cat_app1_title'), category: t('subj_física') || 'Exploración', desc: t('cat_app1_desc'), icon: Globe, color: 'from-blue-500 to-indigo-600', url: 'https://solarsystem-marcoescalona.netlify.app/' },
    { id: 2, title: t('cat_app2_title'), category: 'Museo Virtual', desc: t('cat_app2_desc'), icon: Palette, color: 'from-amber-500 to-orange-600', url: 'https://renaissancegallery-marcoescalona.netlify.app/' },
    { id: 3, title: t('cat_app3_title'), category: 'Historia 3D', desc: t('cat_app3_desc'), icon: Compass, color: 'from-yellow-500 to-gold-600', url: 'https://marcuspicazo.github.io/egypt-ebvg/' },
    { id: 4, title: t('cat_app4_title'), category: 'Biología', desc: t('cat_app4_desc'), icon: Bot, color: 'from-green-500 to-emerald-600', url: 'https://dna-marcoescalona.netlify.app/' },
    { id: 5, title: t('cat_app5_title'), category: 'Idiomas', desc: t('cat_app5_desc'), icon: Bot, color: 'from-purple-500 to-pink-600', multiLink: true, links: [
      { label: `${t('cat_level')} A2`, url: "https://wolfiwolfa2-marcusescalona.netlify.app/" },
      { label: `${t('cat_level')} B2`, url: "https://wolfiwolfb2-marcusescalona.netlify.app/" },
      { label: `${t('cat_level')} C2`, url: "https://wolfiwolfc2-marcusescalona.netlify.app/" }
    ]},
    { id: 6, title: t('cat_app6_title'), category: 'Creatividad', desc: t('cat_app6_desc'), icon: Palette, color: 'from-pink-500 to-rose-600', url: 'https://artstudio-marcoescalona.netlify.app/' },
    { id: 7, title: t('cat_app7_title'), category: 'Geografía', desc: t('cat_app7_desc'), icon: Globe, color: 'from-cyan-500 to-sky-600', url: 'https://marcuspicazo.github.io/atlas-ebvg/' },
    { id: 8, title: t('cat_app8_title'), category: 'Festividades', desc: t('cat_app8_desc'), icon: Clover, color: 'from-emerald-600 to-green-700', url: 'https://marcuspicazo.github.io/san-patricio-ebvg/' },
    { id: 9, title: t('cat_app9_title'), category: 'Parkour', desc: t('cat_app9_desc'), icon: Joystick, color: 'from-orange-500 to-red-600', url: 'https://marcuspicazo.github.io/lava-parkour-game-EBVG/' }
  ];

  const filteredApps = realApps.filter(app => 
    app.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (onPreviewChange) onPreviewChange(!!previewApp);
  }, [previewApp, onPreviewChange]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && previewApp) setPreviewApp(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [previewApp]);

  return (
    <div className="relative w-full animate-fade-in">
      <div className={`transition-all duration-[800ms] ease-in-out transform origin-top ${previewApp ? 'opacity-0 blur-xl scale-95 absolute inset-x-0 pointer-events-none' : 'opacity-100 blur-none scale-100 relative space-y-8'}`}>
        <div className="bg-[#0a0f1c] border border-slate-800/80 p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
              <Compass size={28} className="mr-3 text-blue-500"/> {t('catalog_title')}
            </h2>
            <p className="text-slate-400 text-sm font-medium">{t('cat_explore')}</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={18}/>
            <input 
              type="text" 
              placeholder={t('cat_search')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0d1324] border border-slate-700/80 text-white pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredApps.map(app => {
            const Icon = app.icon;
            return (
              <div key={app.id} className="group relative overflow-hidden bg-[#0a0f1c] border border-slate-800/80 hover:border-blue-500/50 rounded-3xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] flex flex-col">
                <div className={`h-2 w-full bg-gradient-to-r ${app.color}`}></div>
                
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg transition-transform duration-300`}>
                      <Icon size={24} className="text-white"/>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-300">{app.title}</h3>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{app.category}</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-8 flex-1 leading-relaxed">{app.desc}</p>

                  <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-slate-800/50">
                    {app.multiLink ? (
                      <div className="flex flex-col gap-2">
                         <div className="grid grid-cols-3 gap-2">
                           {app.links.map(link => (
                             <button key={link.label} onClick={() => setPreviewApp({ title: app.title, url: link.url, color: app.color, icon: app.icon })} className="bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-blue-500 hover:bg-slate-800 py-3 rounded-lg text-xs font-bold text-center transition-all cursor-pointer shadow-inner">
                               <Eye size={14} className="mx-auto mb-1 text-blue-400"/>
                               {link.label}
                             </button>
                           ))}
                         </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button onClick={() => setPreviewApp(app)} className="flex-1 bg-slate-800/40 hover:bg-blue-600 text-slate-300 hover:text-white py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center border border-transparent hover:border-blue-500/50 cursor-pointer">
                          {t('btn_preview')}
                        </button>
                        <a href={app.url} target="_blank" rel="noopener noreferrer" className="bg-slate-800/40 hover:bg-slate-700 text-slate-400 hover:text-white py-3 px-5 rounded-xl transition-all duration-200 flex items-center justify-center border border-transparent cursor-pointer">
                          <ExternalLink size={18}/>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {previewApp && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col p-4 sm:p-8 animate-fade-in cursor-default">
          <div className="flex justify-between items-center mb-4 shrink-0 max-w-7xl mx-auto w-full">
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center">
              <Eye className="mr-3 text-cyan-400"/> {t('btn_preview')}: {previewApp.title}
            </h3>
            
            <div className="flex items-center gap-4">
              <a href={previewApp.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 cursor-pointer">
                {t('catalog_visit')} <ExternalLink size={16}/>
              </a>
              <button onClick={() => setPreviewApp(null)} className="text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full border border-slate-700 shadow-xl">
                <X size={28}/>
              </button>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-7xl mx-auto bg-[#050810] border border-slate-700 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Cpu className="text-blue-500 animate-pulse opacity-50 mb-4" size={48} />
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">{t('loading_env')}</span>
            </div>

            <iframe
              src={previewApp.url}
              className="w-full h-full relative z-10 border-0 bg-transparent rounded-3xl animate-fade-in"
              title={previewApp.title}
              allow="autoplay; fullscreen"
            />
          </div>
        </div>
      )}
    </div>
  );
}