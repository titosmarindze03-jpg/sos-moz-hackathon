import { useState, useEffect } from 'react';
import { emergencyService } from '../services/emergency.service';
import { mapService } from '../services/map.service';
import { Alert, SafeZone } from '../models';

interface DashboardViewProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [showDirectSOSModal, setShowDirectSOSModal] = useState(false);
  const [sosSuccess, setSosSuccess] = useState(false);
  const [loadingSOS, setLoadingSOS] = useState(false);

  useEffect(() => {
    // Initial fetch
    setAlerts(emergencyService.getAlerts());
    setSafeZones(mapService.getSafeZones().slice(0, 3));

    // Subscribe to services
    const unsubEmergency = emergencyService.subscribe(() => {
      setAlerts(emergencyService.getAlerts());
    });
    const unsubMap = mapService.subscribe(() => {
      setSafeZones(mapService.getSafeZones().slice(0, 3));
    });

    return () => {
      unsubEmergency();
      unsubMap();
    };
  }, []);

  const handleReportEmergency = () => {
    setShowDirectSOSModal(true);
  };

  const triggerDirectSOS = () => {
    setLoadingSOS(true);
    setTimeout(() => {
      setLoadingSOS(false);
      setSosSuccess(true);
      // Save direct rescue report in backend service
      emergencyService.saveRescueReport({
        locationType: 'gps',
        referencePoint: 'Sinal SOS Direto via Painel Principal',
        peopleCount: 1,
        healthCondition: 'critico',
        needs: ['Resgate imediato']
      });
    }, 1500);
  };

  const handleHelpCategoryClick = (category: string) => {
    onNavigate('request-help', { selectedCategory: category });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Emergency Section */}
      <section className="bg-red-600 p-6 rounded-2xl border border-red-700 text-white shadow-md flex flex-col items-center text-center">
        <span className="material-symbols-outlined text-5xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
          warning
        </span>
        <h2 className="text-xl font-bold mb-1 tracking-tight">Perigo Imediato?</h2>
        <p className="text-sm mb-4 opacity-90 max-w-sm">
          Use este botão apenas em caso de risco de vida. A sua localização será enviada para o INGD para resgate imediato.
        </p>
        <button
          onClick={handleReportEmergency}
          className="bg-white text-red-600 font-bold py-4 px-8 rounded-full w-full max-w-xs active:scale-95 transition-transform shadow-lg text-sm uppercase tracking-wider cursor-pointer"
        >
          REPORTAR EMERGÊNCIA
        </button>
      </section>

      {/* Main Grid Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Solicitar Ajuda Card */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Solicitar Ajuda</h3>
            <p className="text-sm text-gray-500 mb-4">Escolha o que necessita com urgência:</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Água', icon: 'water_drop', color: 'text-blue-500' },
              { label: 'Comida', icon: 'restaurant', color: 'text-amber-500' },
              { label: 'Abrigo', icon: 'home', color: 'text-emerald-500' },
              { label: 'Medicamentos', icon: 'medical_services', color: 'text-red-500' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => handleHelpCategoryClick(item.label)}
                className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
              >
                <span className={`material-symbols-outlined ${item.color} text-2xl mb-1`}>{item.icon}</span>
                <span className="text-xs font-semibold text-gray-700">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Buscar Família Card */}
        <div className="bg-blue-600 border border-blue-700 p-5 rounded-2xl text-white flex flex-col justify-between shadow-xs overflow-hidden relative min-h-[220px]">
          <div className="z-10 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-bold mb-1">Buscar Família</h3>
              <p className="text-sm opacity-90 mb-6 max-w-xs">
                Encontre familiares desaparecidos ou reporte alguém que localizou.
              </p>
            </div>
            <button
              onClick={() => onNavigate('family')}
              className="bg-white text-blue-600 font-bold py-3 px-6 rounded-xl w-full active:scale-95 transition-all text-center text-sm cursor-pointer shadow-md"
            >
              Iniciar Busca
            </button>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-15 pointer-events-none">
            <span className="material-symbols-outlined text-[140px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              family_restroom
            </span>
          </div>
        </div>
      </div>

      {/* Map Summary Card */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 flex justify-between items-center bg-gray-50 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-base">Mapa de Áreas Seguras</h3>
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-tight flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
            Atualizado: Agora
          </span>
        </div>
        <div className="h-48 w-full relative">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM7NOsoZA00EDL8YTXPpnBPn1-NlmBVT-t-J4jVdPwcnoi8T4nGhZE5nsrhmmt9Np3BUAO8BGcacZ-341FYIJ8FWFfwDQvnQlLpWwbzNNPZpc0ECqIm16azyqj1fGPipfrBdYXZT-nQUQX5Ag8OkXGX6uE6KTvbyAzuGIufwHNz0f5tg-YmWjOsU-hy8lWP-allC1uWYTfc_pDvgbEf2CbWQ8rS5DXXGIQWSnINkUEYEFGa0Kh4h2H"
            alt="Mapa topográfico de Moçambique com zonas seguras e de risco"
            className="w-full h-full object-cover brightness-95"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <button
              onClick={() => onNavigate('map')}
              className="bg-red-600 text-white font-bold py-2.5 px-5 rounded-full shadow-lg flex items-center gap-2 hover:bg-red-700 active:scale-95 transition-all text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">map</span>
              Abrir Mapa Completo
            </button>
          </div>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4 border-t border-gray-50">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <div>
              <p className="font-semibold text-xs text-gray-800 leading-tight">Escola Primária EPC</p>
              <p className="text-[10px] text-gray-400">Lotação: 60% • Abrigo Seguro</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-red-600 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
            <div>
              <p className="font-semibold text-xs text-gray-800 leading-tight">Zona Ribeirinha</p>
              <p className="text-[10px] text-red-500 font-medium">Risco: Elevado • Inundação</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Alerts Feed */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">campaign</span>
            Últimos Alertas
          </h4>
          <span className="text-xs text-gray-400">Arraste para atualizar</span>
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex gap-3.5 items-start shadow-xs hover:border-gray-200 transition-colors">
              <div className={`p-2.5 rounded-full ${alert.type === 'critical' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                <span className="material-symbols-outlined text-xl flex items-center justify-center">
                  {alert.type === 'critical' ? 'campaign' : 'info'}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm leading-tight mb-1">{alert.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{alert.description}</p>
                <p className="text-[10px] text-gray-400 mt-2 font-medium">{alert.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Direct SOS Modal */}
      {showDirectSOSModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowDirectSOSModal(false)}></div>
          <div className="bg-white relative z-10 w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-red-100">
            {!sosSuccess ? (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-4xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                    emergency
                  </span>
                </div>
                <h3 className="text-lg font-bold text-red-600 mb-2 uppercase tracking-wide">Confirmar SOS de Resgate?</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Será enviado um sinal GPS direto para o Centro de Coordenação de Salvamento (INGD) com as suas coordenadas aproximadas.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowDirectSOSModal(false)}
                    className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={triggerDirectSOS}
                    disabled={loadingSOS}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 cursor-pointer text-sm flex items-center justify-center gap-2"
                  >
                    {loadingSOS ? (
                      <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                    ) : null}
                    {loadingSOS ? 'Enviando...' : 'Confirmar'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <h3 className="text-lg font-bold text-emerald-600 mb-2">GPS SOS Enviado!</h3>
                <p className="text-sm text-gray-500 mb-6">
                  O sinal foi registado com sucesso e os voluntários de proximidade foram notificados. Permaneça num local seguro e evite usar a internet para poupar a bateria do telemóvel.
                </p>
                <button
                  onClick={() => {
                    setShowDirectSOSModal(false);
                    setSosSuccess(false);
                  }}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
