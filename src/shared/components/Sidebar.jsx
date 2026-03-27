import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Map, CalendarCheck, Compass, ShieldCheck, LogOut, 
  Moon, Sun, Languages, Lock, X, ChevronRight, Layers, Monitor, ExternalLink, Code, Zap
} from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import EdTechLogo from './EdTechLogo';

export default function Sidebar({ userRole, setUserRole, activeView, setActiveView, onLogout, theme, setTheme, isMobileMenuOpen, setIsMobileMenuOpen, isPreviewMode }) {
  const { t, lang, setLang } = useI18n();
  
  const [showPwdPrompt, setShowPwdPrompt] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);
  const [pwd, setPwd] = useState('');
  const [pwdError, setPwdError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showPwdPrompt) {
        setShowPwdPrompt(false);
        setPwdError(false);
        setPwd('');
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showPwdPrompt]);

  const navSections = [
    {
      title: null,
      roles: ['alumno', 'profesor', 'admin'],
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: t('nav_loans'), roles: ['alumno', 'profesor', 'admin'] },
        { id: 'map', icon: Map, label: t('nav_map'), roles: ['alumno', 'profesor', 'admin'] },
        { id: 'reservations', icon: CalendarCheck, label: t('nav_reservations'), roles: ['alumno', 'profesor', 'admin'] },
      ]
    },
    {
      title: `< > ${t('nav_dev').toUpperCase()}`,
      roles: ['alumno', 'profesor', 'admin'],
      items: [
        { id: 'app-catalog', icon: Compass, label: t('nav_catalog'), roles: ['profesor', 'admin'] },
        { id: 'app-factory', icon: Code, label: t('nav_factory'), roles: ['profesor', 'admin'] },
        { isDivider: true, roles: ['profesor', 'admin'] },
        { isExternal: true, href: 'https://ebvg-hoot.netlify.app', icon: Zap, label: t('nav_hoot'), roles: ['alumno', 'profesor', 'admin'] },
        { isExternal: true, href: 'https://ebvgboard-marcoescalona.netlify.app/', icon: Monitor, label: t('nav_board'), roles: ['alumno', 'profesor', 'admin'] },
      ]
    },
    {
      title: t('nav_admin_title').toUpperCase(),
      roles: ['admin'],
      items: [
        { id: 'admin', icon: Layers, label: t('nav_admin'), roles: ['admin'] }
      ]
    }
  ];

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    if (newRole === 'profesor' || newRole === 'admin') {
      setPendingRole(newRole);
      setShowPwdPrompt(true);
    } else {
      setUserRole(newRole);
      if(['admin', 'app-factory', 'app-catalog'].includes(activeView)) setActiveView('dashboard');
    }
  };

  const submitPwd = () => {
    if (pwd === '1234') {
      setUserRole(pendingRole);
      setShowPwdPrompt(false);
      setPwd('');
      setPwdError(false);
      if (pendingRole === 'admin') setActiveView('admin');
    } else {
      setPwdError(true);
      setPwd('');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const getAvatarText = () => {
    if (userRole === 'admin') return 'AD';
    if (userRole === 'profesor') return 'PR';
    return 'AL';
  };

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isPreviewMode ? 'md:-translate-x-full md:-ml-72 md:opacity-0 md:pointer-events-none' : 'md:translate-x-0 md:ml-0 md:opacity-100'} md:relative transition-all duration-[800ms] ease-in-out z-40 w-72 bg-[#0a0f1c] border-r border-slate-800/80 flex flex-col`}>
        
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <EdTechLogo size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">CIT-Sync</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">EBVG</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar pb-6 pt-2">
          {navSections.map((section, idx) => {
            const hasAccess = section.roles.includes(userRole);
            if (!hasAccess) return null;

            return (
              <div key={idx} className="mb-2">
                {section.title && (
                  <>
                    <hr className="border-slate-800/50 my-5 mx-6" />
                    <h3 className="text-[10px] uppercase font-bold text-blue-500/80 tracking-[0.2em] mb-4 px-6 flex items-center">
                      {section.title}
                    </h3>
                  </>
                )}
                
                <div className="space-y-1">
                  {section.items.map((item, itemIdx) => {
                    if (!item.roles.includes(userRole)) return null;
                    if (item.isDivider) return <hr key={`div-${itemIdx}`} className="border-slate-800/50 my-3 mx-6" />;

                    const Icon = item.icon;
                    if (item.isExternal) {
                      return (
                        <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="w-full flex items-center space-x-4 py-3.5 pl-6 pr-4 transition-all cursor-pointer text-slate-400 hover:bg-slate-900/50 hover:text-slate-200 font-medium group">
                          <Icon size={20} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
                          <span className="flex-1">{item.label}</span>
                          <ExternalLink size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </a>
                      );
                    }

                    const isActive = activeView === item.id;
                    return (
                      <button key={item.id} onClick={() => { setActiveView(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center space-x-4 py-3.5 pl-6 pr-4 transition-all cursor-pointer relative ${isActive ? 'bg-gradient-to-r from-transparent via-blue-900/10 to-blue-600/20 text-blue-400 font-bold' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200 font-medium'}`}>
                        <Icon size={20} className={isActive ? "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" : "text-slate-500"} />
                        <span className={isActive ? "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : ""}>{item.label}</span>
                        {isActive && <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-full shadow-[0_0_10px_rgba(59,130,246,1)]"></div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-5 border-t border-slate-800/80 bg-[#070b14]">
          <div className="mb-5 bg-[#0d1324] p-4 rounded-xl border border-slate-700/50 shadow-inner">
            <label className="text-[11px] font-medium text-slate-400 mb-3 flex items-center">
              <ShieldCheck size={14} className="mr-2 opacity-70"/> {t('role_sim')}
            </label>
            <div className="relative">
              <select value={userRole} onChange={handleRoleChange} className="w-full bg-[#0a0f1c] text-slate-200 font-medium text-sm px-4 py-3 rounded-lg border border-slate-700/80 outline-none cursor-pointer hover:border-slate-500 transition-colors appearance-none">
                <option value="alumno">{t('role_alumno')}</option>
                <option value="profesor">{t('role_profesor')}</option>
                <option value="admin">{t('role_admin')}</option>
              </select>
              <ChevronRight size={16} className="absolute right-3 top-3.5 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-6 px-2">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center font-bold text-slate-300 shadow-inner">
              {getAvatarText()}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{t('session_current')}</p>
              <p className="text-sm font-bold text-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.4)]">{t('role_' + userRole)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="flex items-center justify-center py-2.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors cursor-pointer text-xs font-bold uppercase tracking-widest"><Languages size={14} className="mr-2"/> {lang}</button>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="flex items-center justify-center py-2.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors cursor-pointer text-xs font-bold uppercase tracking-widest">{theme === 'dark' ? <><Sun size={14} className="mr-2"/> Light</> : <><Moon size={14} className="mr-2"/> Dark</>}</button>
          </div>

          <button onClick={onLogout} className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-slate-900 border border-slate-800/50 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-colors cursor-pointer font-bold text-sm">
            <LogOut size={16} /> <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {showPwdPrompt && (
        <div className="fixed inset-0 z-[100] bg-[#0a0f1c]/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className={`bg-[#0d1324] border border-slate-700/80 p-8 rounded-3xl w-full max-w-sm shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-transform ${isShaking ? 'animate-shake' : ''}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-xl flex items-center drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"><Lock size={22} className="mr-3 text-blue-500"/> Autorización</h3>
              <button onClick={() => {setShowPwdPrompt(false); setPwdError(false); setPwd('');}} className="text-slate-500 hover:text-white cursor-pointer transition-colors"><X size={24}/></button>
            </div>
            <p className="text-sm text-slate-400 mb-8 font-medium">{t('pwd_desc')} <strong className="text-white capitalize">{t('role_' + pendingRole)}</strong>.</p>
            
            {/* CORRECCIÓN DEFINITIVA DE CURSOR */}
            <input 
              type="password" 
              value={pwd} 
              onChange={(e) => {setPwd(e.target.value); setPwdError(false);}} 
              placeholder="••••" 
              className={`w-full bg-[#0a0f1c] border ${pwdError ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-slate-700 focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)]'} rounded-xl py-4 text-center text-white outline-none mb-3 font-mono text-3xl tracking-[0.4em] indent-[0.4em] placeholder:text-slate-600 focus:placeholder-transparent transition-all`} 
              onKeyDown={(e) => e.key === 'Enter' && submitPwd()} 
              autoFocus 
            />
            
            {pwdError && <p className="text-xs text-red-500 font-bold mb-4 text-center animate-fade-in">{t('pwd_incorrect')}</p>}
            <button onClick={submitPwd} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all cursor-pointer mt-4 shadow-[0_0_15px_rgba(59,130,246,0.4)]">Verificar</button>
          </div>
        </div>
      )}
    </>
  );
}