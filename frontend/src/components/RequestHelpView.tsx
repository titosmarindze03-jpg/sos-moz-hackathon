import React, { useState, useEffect } from 'react';
import { emergencyService } from '../services/emergency.service';

interface RequestHelpViewProps {
  initialCategory?: string;
  onNavigateHome: () => void;
}

export default function RequestHelpView({ initialCategory, onNavigateHome }: RequestHelpViewProps) {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [waterQty, setWaterQty] = useState(1); // in Liters
  const [shelterQty, setShelterQty] = useState(1); // in Persons
  const [urgency, setUrgency] = useState<'low' | 'med' | 'high' | null>(null);
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Auto-select category if passed from Dashboard
  useEffect(() => {
    if (initialCategory) {
      const catMap: Record<string, string> = {
        'Água': 'Água Potável',
        'Comida': 'Alimentos',
        'Abrigo': 'Abrigo Temporário',
        'Medicamentos': 'Medicamentos'
      };
      const translated = catMap[initialCategory] || initialCategory;
      setSelectedCategories(new Set([translated]));
    }
  }, [initialCategory]);

  const toggleCategory = (category: string) => {
    const next = new Set(selectedCategories);
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
    }
    setSelectedCategories(next);
  };

  const handleQtyChange = (type: 'water' | 'shelter', delta: number) => {
    if (type === 'water') {
      setWaterQty(prev => Math.max(1, prev + delta));
    } else {
      setShelterQty(prev => Math.max(1, prev + delta));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.size === 0) {
      alert('Por favor, selecione pelo menos uma categoria de necessidade.');
      return;
    }
    if (!urgency) {
      alert('Por favor, indique o nível de urgência.');
      return;
    }

    setLoading(true);
    
    // Simulate API request delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Save Help Request in Service
      emergencyService.saveHelpRequest({
        categories: Array.from(selectedCategories),
        urgency: urgency,
        description: description,
        contactNumber: contactNumber,
        quantities: {
          water: selectedCategories.has('Água Potável') ? waterQty : undefined,
          shelter: selectedCategories.has('Abrigo Temporário') ? shelterQty : undefined,
          medicine: selectedCategories.has('Medicamentos') ? 'Geral' : undefined,
          food: selectedCategories.has('Alimentos') ? 'Rações' : undefined
        }
      });
    }, 1500);
  };

  const resetForm = () => {
    setSelectedCategories(new Set());
    setWaterQty(1);
    setShelterQty(1);
    setUrgency(null);
    setDescription('');
    setContactNumber('');
    setSuccess(false);
    onNavigateHome();
  };

  return (
    <div className="space-y-6 pb-24">
      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title block */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Solicitar Ajuda Essencial</h2>
            <p className="text-sm text-gray-500 mt-1">
              Selecione os itens necessários e informe a urgência do seu agregado. O seu pedido será partilhado com a rede de apoio de proximidade do INGD.
            </p>
          </section>

          {/* 1. Categorias de Necessidade */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              1. Categorias de Necessidade
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Água Card */}
              <div
                onClick={() => toggleCategory('Água Potável')}
                className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col items-start gap-2 select-none ${
                  selectedCategories.has('Água Potável')
                    ? 'border-primary bg-red-50/50 shadow-xs'
                    : 'border-gray-100 bg-white hover:bg-gray-50'
                }`}
              >
                <span className="material-symbols-outlined text-blue-500 text-3xl">water_drop</span>
                <span className="font-bold text-xs text-gray-800">Água Potável</span>
                {selectedCategories.has('Água Potável') && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full flex items-center justify-between bg-white border border-gray-100 p-2 rounded-xl mt-2 shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => handleQtyChange('water', -1)}
                      className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center font-bold text-gray-500 hover:bg-gray-50 cursor-pointer text-sm"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs text-gray-700">{waterQty}L</span>
                    <button
                      type="button"
                      onClick={() => handleQtyChange('water', 1)}
                      className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center font-bold text-gray-500 hover:bg-gray-50 cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* Abrigo Card */}
              <div
                onClick={() => toggleCategory('Abrigo Temporário')}
                className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col items-start gap-2 select-none ${
                  selectedCategories.has('Abrigo Temporário')
                    ? 'border-primary bg-red-50/50 shadow-xs'
                    : 'border-gray-100 bg-white hover:bg-gray-50'
                }`}
              >
                <span className="material-symbols-outlined text-emerald-500 text-3xl">home</span>
                <span className="font-bold text-xs text-gray-800">Abrigo Temporário</span>
                {selectedCategories.has('Abrigo Temporário') && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full flex items-center justify-between bg-white border border-gray-100 p-2 rounded-xl mt-2 shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => handleQtyChange('shelter', -1)}
                      className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center font-bold text-gray-500 hover:bg-gray-50 cursor-pointer text-sm"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs text-gray-700">
                      {shelterQty} {shelterQty === 1 ? 'Pessoa' : 'Pessoas'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQtyChange('shelter', 1)}
                      className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center font-bold text-gray-500 hover:bg-gray-50 cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* Medicamentos Card */}
              <div
                onClick={() => toggleCategory('Medicamentos')}
                className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col items-start gap-2 select-none ${
                  selectedCategories.has('Medicamentos')
                    ? 'border-primary bg-red-50/50 shadow-xs'
                    : 'border-gray-100 bg-white hover:bg-gray-50'
                }`}
              >
                <span className="material-symbols-outlined text-red-500 text-3xl">medical_services</span>
                <span className="font-bold text-xs text-gray-800">Medicamentos</span>
              </div>

              {/* Alimentos Card */}
              <div
                onClick={() => toggleCategory('Alimentos')}
                className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col items-start gap-2 select-none ${
                  selectedCategories.has('Alimentos')
                    ? 'border-primary bg-red-50/50 shadow-xs'
                    : 'border-gray-100 bg-white hover:bg-gray-50'
                }`}
              >
                <span className="material-symbols-outlined text-amber-500 text-3xl">restaurant</span>
                <span className="font-bold text-xs text-gray-800">Alimentos</span>
              </div>
            </div>
          </div>

          {/* 2. Detalhes e Urgência */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              2. Detalhes e Urgência
            </label>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-gray-600 block">Nível de Urgência</span>
              <div className="flex gap-2">
                {[
                  { id: 'low', label: 'Baixa', color: 'bg-emerald-500 text-white border-transparent' },
                  { id: 'med', label: 'Média', color: 'bg-amber-500 text-white border-transparent' },
                  { id: 'high', label: 'Crítica', color: 'bg-red-600 text-white border-transparent' }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setUrgency(btn.id as any)}
                    className={`flex-1 py-3 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      urgency === btn.id
                        ? btn.color + ' ring-2 ring-offset-1 ring-gray-300 scale-102'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50 bg-white'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 block" htmlFor="details">
                Descrição Adicional (Opcional)
              </label>
              <textarea
                id="details"
                placeholder="Ex: Família com 2 crianças e 1 idoso..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-200 rounded-xl bg-white p-3.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 block" htmlFor="contact">
                O Seu Contacto Telefónico (Obrigatório)
              </label>
              <input
                id="contact"
                type="tel"
                required
                placeholder="Ex: +258 84 123 4567"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full border border-gray-200 rounded-xl bg-white p-3.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-md hover:bg-red-700 active:scale-95 transition-all flex justify-center items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-lg">send</span>
            )}
            {loading ? 'PROCESSANDO...' : 'ENVIAR PEDIDO'}
          </button>
        </form>
      ) : (
        /* Success Screen */
        <div className="flex flex-col items-center text-center py-10 space-y-6">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-xs animate-bounce">
            <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800">Pedido Enviado com Sucesso!</h2>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed mx-auto">
              As equipas de ajuda humanitária e os voluntários na sua área foram notificados. Por favor, mantenha o seu telefone ligado e fique numa zona segura.
            </p>
          </div>

          <div className="w-full space-y-3">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left max-w-sm mx-auto shadow-2xs">
              <span className="material-symbols-outlined text-sky-500 text-2xl">share_location</span>
              <div>
                <p className="font-bold text-xs text-gray-800">Localização GPS Partilhada</p>
                <p className="text-[10px] text-gray-400">O seu sinal GPS está ativo para as equipas de resgate do distrito.</p>
              </div>
            </div>

            {contactNumber && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-left max-w-sm mx-auto shadow-2xs">
                <span className="material-symbols-outlined text-emerald-600 text-2xl">phone_in_talk</span>
                <div>
                  <p className="font-bold text-xs text-emerald-800">Contacto Registado</p>
                  <p className="text-[10px] text-emerald-700/80">O contacto <span className="font-bold text-slate-900">{contactNumber}</span> foi anexado para contacto urgente.</p>
                </div>
              </div>
            )}

            <button
              onClick={resetForm}
              className="w-full max-w-sm border-2 border-primary text-primary py-3.5 rounded-xl font-bold hover:bg-red-50 transition-colors text-sm cursor-pointer"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
