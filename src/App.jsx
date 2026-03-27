import React, { useState } from 'react';
import { I18nProvider } from './contexts/I18nContext';
import { ToastProvider } from './contexts/ToastContext';
import { useAuth } from './hooks/useAuth';
import { useFirestoreCollection } from './hooks/useFirestoreCollection';
import CustomCursor from './shared/components/CustomCursor';
import Sidebar from './shared/components/Sidebar';
import EdTechLogo from './shared/components/EdTechLogo';
import MaintenanceScreen from './shared/components/MaintenanceScreen';
import NotFoundScreen from './shared/components/NotFoundScreen';
import { Cpu, Menu } from 'lucide-react';

import LoginScreen from './features/auth/LoginScreen';
import DashboardView from './features/dashboard/DashboardView';
import UserReservationsView from './features/dashboard/UserReservationsView';
import InteractiveMapView from './features/map/InteractiveMapView';
import AppFactoryView from './features/factory/AppFactoryView';
import AppCatalogView from './features/catalog/AppCatalogView';
import AdminPanelView from './features/admin/AdminPanelView';

function SkeletonDashboard() {
  return (
    <div className="p-8 space-y-8 animate-pulse">
      <div className="h-32 w-full bg-slate-800 bg-opacity-50 rounded-3xl"></div>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 h-96 bg-slate-800 bg-opacity-50 rounded-3xl"></div>
        <div className="h-96 bg-slate-800 bg-opacity-50 rounded-3xl"></div>
      </div>
    </div>
  );
}

function MainApp() {
  const { user, isAuthenticating } = useAuth();
  const { data: resources, loading: loadingResources } = useFirestoreCollection('resources');
  const { data: reservations, loading: loadingReservations } = useFirestoreCollection('reservations');
  const { data: appRequests, loading: loadingRequests } = useFirestoreCollection('app_requests');
  
  const [hasPassedLogin, setHasPassedLogin] = useState(false);
  const [userRole, setUserRole] = useState('alumno');
  const [activeView, setActiveView] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // INTERRUPTOR MAESTRO DE MANTENIMIENTO: Cambia a 'true' para bloquear toda la plataforma
  const isMaintenanceMode = false; 

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setHasPassedLogin(true);
  };

  if (isAuthenticating) return <div className="h-screen w-full bg-slate-950 flex items-center justify-center"><Cpu className="text-blue-500 animate-pulse" size={48}/></div>;
  
  // Si el modo mantenimiento está activo, mostramos la pantalla y bloqueamos el resto
  if (isMaintenanceMode) return <MaintenanceScreen />;
  
  if (!hasPassedLogin) return <LoginScreen onLoginSuccess={handleLoginSuccess} />;

  const isDataLoaded = !loadingResources && !loadingReservations && !loadingRequests;
  
  // Lista de vistas válidas para controlar el Error 404
  const validViews = ['dashboard', 'map', 'reservations', 'app-catalog', 'app-factory', 'admin'];

  return (
    <div className={`h-screen w-full font-sans overflow-hidden flex transition-all duration-[800ms] ease-in-out cursor-default ${theme === 'dark' ? 'bg-slate-950 text-slate-200' : 'light-mode'}`}>
      
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />}

      <Sidebar 
        userRole={userRole} 
        setUserRole={setUserRole} 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={() => setHasPassedLogin(false)}
        theme={theme}
        setTheme={setTheme}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isPreviewMode={isPreviewMode} 
      />

      <main className={`flex-1 relative h-full overflow-y-auto custom-scrollbar flex flex-col ${isPreviewMode ? 'z-[100]' : 'z-10'}`}>
        
        <div className={`md:hidden flex items-center justify-between p-4 border-b border-slate-700 border-opacity-50 bg-slate-900 bg-opacity-50 backdrop-blur-md transition-all duration-[800ms] ease-in-out ${isPreviewMode ? '-translate-y-full opacity-0 absolute pointer-events-none w-full' : 'translate-y-0 opacity-100 relative w-full'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md shrink-0"><EdTechLogo size={18} /></div>
            <span className="font-bold text-white tracking-tight">CIT-Sync</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-300 hover:text-white p-1 cursor-pointer"><Menu size={28} /></button>
        </div>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full flex-1 transition-all duration-[800ms]">
          {!isDataLoaded ? <SkeletonDashboard /> : (
            <>
              {activeView === 'dashboard' && <DashboardView resources={resources} reservations={reservations} userRole={userRole} userId={user?.uid} navigateToMap={() => setActiveView('map')} />}
              {activeView === 'map' && <InteractiveMapView resources={resources} reservations={reservations} userRole={userRole} userId={user?.uid} />}
              {activeView === 'reservations' && <UserReservationsView reservations={reservations} userId={user?.uid} resources={resources} />}
              
              {activeView === 'app-catalog' && (userRole === 'profesor' || userRole === 'admin') && (
                <AppCatalogView onPreviewChange={setIsPreviewMode} />
              )}
              
              {activeView === 'app-factory' && (userRole === 'profesor' || userRole === 'admin') && <AppFactoryView appRequests={appRequests} userId={user?.uid} userRole={userRole} />}
              {activeView === 'admin' && userRole === 'admin' && <AdminPanelView resources={resources} reservations={reservations} />}
              
              {/* REGLA DEL ERROR 404 */}
              {!validViews.includes(activeView) && (
                <NotFoundScreen onBack={() => setActiveView('dashboard')} />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <ToastProvider>
        <CustomCursor />
        <MainApp />
      </ToastProvider>
    </I18nProvider>
  );
}