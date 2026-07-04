import { useState } from 'react';

interface TopAppBarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenSOSReport: () => void;
}

export default function TopAppBar({ activeTab, onNavigate, onOpenSOSReport }: TopAppBarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleMenuClick = (tab: string) => {
    onNavigate(tab);
    setIsDrawerOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 w-full absolute top-0 left-0 right-0 z-50 h-16">
        <div className="max-w-5xl mx-auto w-full h-full flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDrawer}
              className="text-primary hover:bg-gray-100 transition-colors p-2 rounded-full active:scale-95 duration-100 flex items-center justify-center cursor-pointer"
              aria-label="Menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="text-xl font-bold text-primary tracking-tight">SOS Moçambique</h1>
          </div>
          <button
            onClick={onOpenSOSReport}
            className="text-primary hover:bg-gray-100 transition-colors p-2 rounded-full active:scale-95 duration-100 flex items-center justify-center cursor-pointer animate-pulse"
            aria-label="Emergência Imediata"
          >
            <span className="material-symbols-outlined text-red-600" style={{ fontVariationSettings: "'FILL' 1" }}>
              emergency
            </span>
          </button>
        </div>
      </header>

      {/* Navigation Drawer */}
      <aside
        className={`absolute inset-y-0 left-0 z-[60] w-80 max-w-[85%] bg-white flex flex-col p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-6 border-b pb-4 border-gray-100">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">emergency_home</span>
            Menu de Emergência
          </h2>
          <button
            onClick={toggleDrawer}
            className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 cursor-pointer"
            aria-label="Fechar Menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex flex-col space-y-2">
          <button
            onClick={() => handleMenuClick('dashboard')}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all text-left cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/10 scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-50 hover:text-red-600 font-medium'
            }`}
          >
            <span className={`material-symbols-outlined transition-colors ${activeTab === 'dashboard' ? 'text-white' : 'text-gray-400'}`}>dashboard</span>
            Painel Principal
          </button>
          <button
            onClick={() => handleMenuClick('request-help')}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all text-left cursor-pointer ${
              activeTab === 'request-help'
                ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/10 scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-50 hover:text-red-600 font-medium'
            }`}
          >
            <span className={`material-symbols-outlined transition-colors ${activeTab === 'request-help' ? 'text-white' : 'text-gray-400'}`}>handshake</span>
            Solicitar Ajuda Essencial
          </button>
          <button
            onClick={() => handleMenuClick('report-isolated')}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all text-left cursor-pointer ${
              activeTab === 'report-isolated'
                ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/10 scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-50 hover:text-red-600 font-medium'
            }`}
          >
            <span className={`material-symbols-outlined transition-colors ${activeTab === 'report-isolated' ? 'text-white' : 'text-gray-400'}`}>person_pin_circle</span>
            Reportar Pessoa Isolada
          </button>
          <button
            onClick={() => handleMenuClick('family')}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all text-left cursor-pointer ${
              activeTab === 'family'
                ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/10 scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-50 hover:text-red-600 font-medium'
            }`}
          >
            <span className={`material-symbols-outlined transition-colors ${activeTab === 'family' ? 'text-white' : 'text-gray-400'}`}>group</span>
            Reencontro de Famílias
          </button>

          <button
            onClick={() => handleMenuClick('admin')}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all text-left cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/10 scale-[1.02]'
                : 'text-slate-700 hover:bg-red-50 hover:text-red-700 font-bold border border-dashed border-red-100'
            }`}
          >
            <span className={`material-symbols-outlined transition-colors ${activeTab === 'admin' ? 'text-white' : 'text-red-500 animate-pulse'}`}>admin_panel_settings</span>
            Painel Administrador
          </button>
          
          <div className="border-t border-gray-100 my-4 pt-4">
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Informações Úteis</h3>
            <a
              href="tel:112"
              className="flex items-center gap-4 p-4 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium cursor-pointer"
            >
              <span className="material-symbols-outlined text-red-600">call</span>
              Linha Direta: 112
            </a>
          </div>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          <p>© 2026 INGD Moçambique</p>
          <p className="mt-1">Serviço de Emergência Humanitária</p>
        </div>
      </aside>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          onClick={toggleDrawer}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs z-55 transition-opacity duration-300"
          aria-hidden="true"
        ></div>
      )}
    </>
  );
}
