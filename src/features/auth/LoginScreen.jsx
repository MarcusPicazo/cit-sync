import React from 'react';
import { Monitor, Rocket, Layers, Lock, AlertTriangle, ArrowRight } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { useAuthLogic } from './useAuthLogic';
import AnimatedBackground from '../../shared/components/AnimatedBackground';
import EdTechLogo from '../../shared/components/EdTechLogo';

export default function LoginScreen({ onLoginSuccess }) {
  const { t } = useI18n();
  const {
    accessCode,
    setAccessCode,
    codeError,
    authError,
    handleGuestLogin,
    handleGoogleLogin
  } = useAuthLogic(onLoginSuccess);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleGuestLogin();
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-950 font-sans overflow-hidden animate-fade-in relative">
      <AnimatedBackground theme="dark" />
      
      {/* Left Side - Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-slate-900 bg-opacity-60 backdrop-blur-xl border-r border-slate-800 z-10 shadow-2xl">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600 bg-opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600 bg-opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)]"></div>
        
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <EdTechLogo size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">CIT-Sync</h1>
            <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">{t('brand_eco')}</p>
          </div>
        </div>

        <div className="relative z-10 mb-10">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 leading-tight mb-6" dangerouslySetInnerHTML={{ __html: t('hero_title') }} />
          <p className="text-lg text-slate-400 max-w-md font-medium leading-relaxed">{t('hero_desc')}</p>
          <div className="flex flex-wrap gap-3 mt-10">
            <span className="px-4 py-2 rounded-full bg-slate-800 bg-opacity-80 border border-slate-700 text-xs font-bold text-slate-300 flex items-center"><Monitor size={14} className="mr-2 text-cyan-400"/> {t('tag_labs')}</span>
            <span className="px-4 py-2 rounded-full bg-slate-800 bg-opacity-80 border border-slate-700 text-xs font-bold text-slate-300 flex items-center"><Rocket size={14} className="mr-2 text-purple-400"/> {t('tag_factory')}</span>
            <span className="px-4 py-2 rounded-full bg-slate-800 bg-opacity-80 border border-slate-700 text-xs font-bold text-slate-300 flex items-center"><Layers size={14} className="mr-2 text-emerald-400"/> {t('tag_loans')}</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative p-6 sm:p-12 z-10">
        <div className="max-w-md w-full relative z-10 bg-slate-900 bg-opacity-80 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none p-8 lg:p-0 rounded-3xl border border-slate-700 lg:border-none shadow-2xl lg:shadow-none">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center justify-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
              <EdTechLogo size={34} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">CIT-Sync</h1>
            <p className="text-sm text-blue-400 font-bold uppercase tracking-widest">{t('brand_eco')}</p>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">{t('login_welcome')}</h2>
            <p className="text-slate-400 text-sm">{t('login_desc')}</p>
          </div>

          <div className="space-y-6">
            <button onClick={handleGoogleLogin} className="w-full bg-white text-slate-900 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center hover:bg-slate-200 hover:scale-[1.02] transition-all shadow-lg group cursor-pointer">
              <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('login_google')}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">{t('auth_guest')}</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2 block">{t('login_temp_code')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={16} className="text-slate-500" />
                  </div>
                  <input
                    type="password"
                    placeholder={t('login_ph_code')}
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`w-full bg-slate-900 bg-opacity-50 border rounded-xl pl-11 pr-4 py-3.5 text-white text-sm outline-none transition-all placeholder:text-slate-600 font-mono tracking-[0.3em] cursor-text ${codeError ? 'border-red-500 border-opacity-50 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-slate-700 focus:border-blue-500 focus:bg-slate-900 shadow-inner'}`}
                    maxLength={4}
                  />
                </div>
                {codeError && <p className="text-[10px] text-red-400 font-bold text-left flex items-center mt-2 animate-fade-in"><AlertTriangle size={12} className="mr-1"/>{codeError}</p>}
              </div>

              <button onClick={handleGuestLogin} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all border border-slate-600 hover:border-slate-500 text-sm flex items-center justify-center group cursor-pointer">
                {t('auth_btn')} <ArrowRight size={16} className="ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"/>
              </button>
            </div>
          </div>

          {authError && (
            <div className="mt-6 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 text-red-400 p-4 rounded-xl text-xs font-medium flex items-start text-left leading-relaxed animate-fade-in">
              <AlertTriangle size={18} className="mr-3 shrink-0 mt-0.5"/>
              <p>{authError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}