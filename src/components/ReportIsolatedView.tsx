import React, { useState } from 'react';
import { emergencyService } from '../services/emergency.service';

interface ReportIsolatedViewProps {
  onNavigateHome: () => void;
}

export default function ReportIsolatedView({ onNavigateHome }: ReportIsolatedViewProps) {
  const [locationType, setLocationType] = useState<'gps' | 'manual'>('gps');
  const [referencePoint, setReferencePoint] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);
  const [healthCondition, setHealthCondition] = useState<'stable' | 'injured' | 'critico'>('stable');
  const [needs, setNeeds] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const increment = () => setPeopleCount(prev => prev + 1);
  const decrement = () => setPeopleCount(prev => Math.max(1, prev - 1));

  const handleNeedChange = (need: string) => {
    setNeeds(prev =>
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referencePoint.trim()) {
      alert('Por favor, forneça os detalhes de localização ou pontos de referência.');
      return;
    }

    // Save Rescue Report in Emergency Service
    emergencyService.saveRescueReport({
      locationType,
      referencePoint,
      peopleCount,
      healthCondition,
      needs
    });

    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    onNavigateHome();
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header Info */}
      <section>
        <div className="flex items-center gap-2 text-primary mb-1">
          <span className="material-symbols-outlined font-medium" style={{ fontVariationSettings: "'FILL' 1" }}>
            person_pin_circle
          </span>
          <span className="text-xs font-bold uppercase tracking-wider">Novo Relato</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Reportar Pessoa Isolada</h2>
        <p className="text-sm text-gray-500 mt-1">
          Forneça detalhes precisos para agilizar o salvamento pelas equipas aéreas e aquáticas do INGD. Priorize a segurança ao preencher este formulário.
        </p>
      </section>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Localização Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            LOCALIZAÇÃO
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setLocationType('gps')}
              className={`flex flex-col items-center justify-center p-4 border rounded-2xl active:scale-95 transition-all cursor-pointer ${
                locationType === 'gps'
                  ? 'border-primary text-primary bg-red-50/50 font-bold'
                  : 'border-gray-100 text-gray-500 bg-white hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined mb-1">my_location</span>
              <span className="text-xs font-semibold">Usar GPS</span>
            </button>
            <button
              type="button"
              onClick={() => setLocationType('manual')}
              className={`flex flex-col items-center justify-center p-4 border rounded-2xl active:scale-95 transition-all cursor-pointer ${
                locationType === 'manual'
                  ? 'border-primary text-primary bg-red-50/50 font-bold'
                  : 'border-gray-100 text-gray-500 bg-white hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined mb-1">map</span>
              <span className="text-xs font-semibold">Manual</span>
            </button>
          </div>
          <div className="relative">
            <textarea
              required
              rows={3}
              placeholder="Descreva pontos de referência próximos (ex: telhado da escola, árvore grande ao lado, cor da casa, coordenadas se souber)..."
              value={referencePoint}
              onChange={(e) => setReferencePoint(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl font-medium text-sm bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none shadow-2xs"
            />
          </div>
        </div>

        {/* Número de Pessoas */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            NÚMERO DE PESSOAS ISOLADAS
          </label>
          <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-2 shadow-2xs">
            <button
              type="button"
              onClick={decrement}
              className="p-3 text-primary hover:bg-gray-50 rounded-lg font-bold cursor-pointer transition-colors active:opacity-50"
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <input
              type="number"
              readOnly
              value={peopleCount}
              className="w-full text-center border-none focus:ring-0 font-bold text-xl text-gray-800 bg-transparent"
            />
            <button
              type="button"
              onClick={increment}
              className="p-3 text-primary hover:bg-gray-50 rounded-lg font-bold cursor-pointer transition-colors active:opacity-50"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>

        {/* Condição de Saúde */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            CONDIÇÃO DE SAÚDE
          </label>
          <div className="flex flex-col gap-2">
            {[
              {
                id: 'stable',
                label: 'Estável (Sem ferimentos graves)',
                color: 'border-emerald-500 bg-emerald-50/25 text-emerald-800'
              },
              {
                id: 'injured',
                label: 'Ferido (Requer cuidados médicos)',
                color: 'border-blue-500 bg-blue-50/25 text-blue-800'
              },
              {
                id: 'critico',
                label: 'Crítico (Urgência Imediata)',
                color: 'border-red-600 bg-red-50/40 text-red-700 font-bold'
              }
            ].map((cond) => {
              const isChecked = healthCondition === cond.id;
              return (
                <label
                  key={cond.id}
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all bg-white shadow-2xs ${
                    isChecked ? cond.color + ' ring-1 ring-offset-0 ring-gray-100' : 'border-gray-100 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="condition"
                    checked={isChecked}
                    onChange={() => setHealthCondition(cond.id as any)}
                    className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="ml-3 text-xs font-semibold leading-none">{cond.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Necessidades Imediatas */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            NECESSIDADES IMEDIATAS
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Água', 'Comida', 'Medicação', 'Abrigo'].map((need) => {
              const isChecked = needs.includes(need);
              return (
                <label
                  key={need}
                  className={`flex items-center p-3 border rounded-xl bg-white shadow-2xs cursor-pointer select-none transition-colors ${
                    isChecked ? 'border-primary bg-red-50/20' : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleNeedChange(need)}
                    className="w-5 h-5 text-primary rounded-sm border-gray-300 focus:ring-primary"
                  />
                  <span className="ml-2.5 text-xs font-semibold text-gray-700">{need}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 bg-primary text-white font-bold rounded-xl text-sm shadow-md hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              send
            </span>
            Enviar Pedido de Resgate
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-2 font-medium">
            O seu sinal de GPS será enviado automaticamente em anexo a este pedido.
          </p>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={handleCloseModal}></div>
          <div className="bg-white relative z-10 w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-emerald-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <h3 className="text-lg font-bold text-emerald-600 mb-2">Pedido Enviado</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                As equipas de salvamento e proteção civil do INGD foram notificadas. Mantenha-se num local seguro, visível do céu, e poupe a bateria do telemóvel.
              </p>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm cursor-pointer shadow-md hover:bg-emerald-700 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
