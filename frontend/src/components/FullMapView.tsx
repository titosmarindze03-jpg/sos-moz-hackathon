import { useState, useEffect } from 'react';
import { mapService } from '../services/map.service';
import { SafeZone } from '../models';

export default function FullMapView() {
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<SafeZone | null>(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'shelter' | 'distribution' | 'hazard'>('all');
  const [routeActiveFor, setRouteActiveFor] = useState<string | null>(null);

  useEffect(() => {
    setSafeZones(mapService.getSafeZones());
    const unsub = mapService.subscribe(() => {
      setSafeZones(mapService.getSafeZones());
    });
    return unsub;
  }, []);

  const filteredZones = safeZones.filter(zone => {
    if (activeTypeFilter === 'all') return true;
    return zone.type === activeTypeFilter;
  });

  return (
    <div className="space-y-4 pb-24">
      {/* Title block */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Mapa de Áreas Seguras</h2>
        <p className="text-sm text-gray-500 mt-1">
          Explore abrigos ativos, pontos de mantimentos e áreas de perigo crítico atualizados em tempo real pela Proteção Civil.
        </p>
      </section>

      {/* Map Filter Tabs */}
      <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: 'Todos', icon: 'layers' },
          { id: 'shelter', label: 'Abrigos', icon: 'gite' },
          { id: 'distribution', label: 'Suprimentos', icon: 'inventory_2' },
          { id: 'hazard', label: 'Zonas de Risco', icon: 'warning' },
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => {
              setActiveTypeFilter(filter.id as any);
              setSelectedZone(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeTypeFilter === filter.id
                ? 'bg-primary text-white'
                : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>

      {/* Simulated Interactive Map Display */}
      <div className="relative bg-white border border-gray-100 rounded-2xl h-80 overflow-hidden shadow-xs">
        {/* Map Image Background */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM7NOsoZA00EDL8YTXPpnBPn1-NlmBVT-t-J4jVdPwcnoi8T4nGhZE5nsrhmmt9Np3BUAO8BGcacZ-341FYIJ8FWFfwDQvnQlLpWwbzNNPZpc0ECqIm16azyqj1fGPipfrBdYXZT-nQUQX5Ag8OkXGX6uE6KTvbyAzuGIufwHNz0f5tg-YmWjOsU-hy8lWP-allC1uWYTfc_pDvgbEf2CbWQ8rS5DXXGIQWSnINkUEYEFGa0Kh4h2H"
          alt="Mapa de Moçambique"
          className="w-full h-full object-cover opacity-85"
          referrerPolicy="no-referrer"
        />

        {/* Dynamic Markers */}
        {filteredZones.map((zone, index) => {
          // Absolute mock positions overlaying the map image nicely
          const positions = [
            { top: '35%', left: '42%' }, // EPC Primary School
            { top: '22%', left: '55%' }, // Samora Machel shelter
            { top: '65%', left: '38%' }, // River Zone hazard
            { top: '50%', left: '50%' }, // Praça do Município
            { top: '15%', left: '25%' }, // Búzi
          ];
          const pos = positions[index % positions.length];

          const colorMap = {
            shelter: 'bg-emerald-600 border-emerald-200',
            distribution: 'bg-blue-600 border-blue-200',
            hazard: 'bg-red-600 border-red-200'
          };
          const iconMap = {
            shelter: 'gite',
            distribution: 'inventory_2',
            hazard: 'warning'
          };

          return (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              style={{ top: pos.top, left: pos.left }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 border-2 rounded-full cursor-pointer shadow-md text-white transition-transform hover:scale-115 active:scale-95 flex items-center justify-center animate-bounce ${colorMap[zone.type]}`}
              title={zone.name}
            >
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {iconMap[zone.type]}
              </span>
            </button>
          );
        })}

        {/* Legend overlays */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-gray-100 text-[10px] space-y-1 text-gray-600 shadow-xs pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="font-semibold">Abrigo Ativo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="font-semibold">Ponto de Distribuição</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span className="font-semibold">Perigo de Inundação</span>
          </div>
        </div>
      </div>

      {/* Marker Details Drawer */}
      {selectedZone ? (
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-md space-y-3 animate-fade-in">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight text-white ${
                    selectedZone.type === 'shelter'
                      ? 'bg-emerald-600'
                      : selectedZone.type === 'distribution'
                      ? 'bg-blue-600'
                      : 'bg-red-600'
                  }`}
                >
                  {selectedZone.type === 'shelter'
                    ? 'Abrigo'
                    : selectedZone.type === 'distribution'
                    ? 'Suprimentos'
                    : 'Risco Elevado'}
                </span>
                {selectedZone.capacity && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    Lotação: {selectedZone.capacity}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-gray-800 text-base mt-1.5">{selectedZone.name}</h3>
            </div>
            <button
              onClick={() => setSelectedZone(null)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
          
          <p className="text-xs text-gray-500 leading-relaxed">{selectedZone.details}</p>
          
          {routeActiveFor === selectedZone.id && (
            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-xs font-bold flex items-center gap-2 text-emerald-700 animate-pulse">
              <span className="material-symbols-outlined text-sm text-emerald-600">navigation</span>
              <span>GPS: Rota ativa! Siga as coordenadas aproximadas.</span>
            </div>
          )}
          
          <div className="pt-2 flex gap-2">
            <a
              href={`tel:112`}
              className="flex-1 py-2.5 bg-gray-50 border border-gray-200 text-gray-600 font-bold rounded-xl text-center text-xs hover:bg-gray-100 cursor-pointer"
            >
              Ligar Centro
            </a>
            <button
              onClick={() => {
                setRouteActiveFor(selectedZone.id);
                setTimeout(() => setRouteActiveFor(null), 5000);
              }}
              className="flex-1 py-2.5 bg-primary text-white font-bold rounded-xl text-center text-xs hover:bg-red-700 cursor-pointer shadow-2xs"
            >
              Traçar Rota
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-dashed border-gray-200 p-5 rounded-2xl text-center text-xs text-gray-400">
          Clique num marcador no mapa para ver detalhes da localização.
        </div>
      )}

      {/* Safe Zones List Explorer */}
      <div className="space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Lista de Pontos Importantes</h4>
        <div className="space-y-2">
          {filteredZones.map((zone) => (
            <div
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className="p-3.5 bg-white border border-gray-100 rounded-xl flex justify-between items-center cursor-pointer hover:border-gray-200 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`p-2 rounded-full text-white flex items-center justify-center ${
                    zone.type === 'shelter'
                      ? 'bg-emerald-50 text-emerald-600'
                      : zone.type === 'distribution'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {zone.type === 'shelter' ? 'gite' : zone.type === 'distribution' ? 'inventory_2' : 'warning'}
                  </span>
                </span>
                <div>
                  <p className="font-bold text-xs text-gray-800">{zone.name}</p>
                  <p className="text-[10px] text-gray-400">
                    {zone.type === 'shelter'
                      ? `Abrigo Ativo • Lotação: ${zone.capacity || 'N/A'}`
                      : zone.type === 'distribution'
                      ? 'Posto de Ajuda Alimentícia'
                      : 'Área com Evacuação em Curso'}
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-300 text-sm">chevron_right</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
