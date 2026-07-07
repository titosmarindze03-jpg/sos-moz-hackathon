import React, { useState, useEffect } from 'react';
import { familyService } from '../services/family.service';
import { Person } from '../models';

export default function FamilyView() {
  const [people, setPeople] = useState<Person[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'missing' | 'found'>('all');
  
  // Modals state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<Person | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  
  // Registration Form state
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState('Masculino');
  const [regStatus, setRegStatus] = useState<'missing' | 'found_shelter'>('missing');
  const [regLocation, setRegLocation] = useState('');
  const [regDate, setRegDate] = useState('');
  const [regDesc, setRegDesc] = useState('');
  const [regContact, setRegContact] = useState('');

  // Chat message simulation state
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: 'Olá! Sou o assistente SOS de Reencontro Familiar. Se tem informações sobre alguém desaparecido ou encontrou alguém perdido, diga-me o nome ou localidade para eu ajudar a cruzar as bases de dados.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    setPeople(familyService.getAll());
    const unsub = familyService.subscribe(() => {
      setPeople(familyService.getAll());
    });
    return unsub;
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regLocation || !regDate) {
      alert('Por favor, preencha o nome, localidade e data.');
      return;
    }

    // Default image if none provided
    const randomSeed = Math.floor(Math.random() * 100);
    const defaultImage = `https://picsum.photos/seed/face-${randomSeed}/400/400`;

    familyService.save({
      name: regName,
      status: regStatus,
      location: regLocation,
      lastSeenDate: regDate,
      imageUrl: defaultImage,
      description: regDesc,
      age: regAge ? parseInt(regAge) : undefined,
      gender: regGender,
      contactNumber: regContact,
    });

    // Reset Form
    setRegName('');
    setRegAge('');
    setRegStatus('missing');
    setRegLocation('');
    setRegDate('');
    setRegDesc('');
    setRegContact('');
    setShowRegisterModal(false);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    // Simulated reply based on search query match
    setTimeout(() => {
      const query = userMsg.toLowerCase();
      const matched = people.filter(p => p.name.toLowerCase().includes(query) || p.location.toLowerCase().includes(query));
      
      let botResponse = '';
      if (matched.length > 0) {
        botResponse = `Encontrei ${matched.length} registo(s) correspondente(s) na nossa base de dados:\n\n` + 
          matched.map(p => `• ${p.name} (${p.status === 'missing' ? 'Desaparecido(a)' : 'Encontrado(a) em Abrigo'}) - Última localização: ${p.location}`).join('\n') + 
          `\n\nPor favor, verifique os detalhes na listagem principal.`;
      } else {
        botResponse = `Agradeço o contacto. Não encontrei correspondência imediata para "${userMsg}" na nossa base de dados pública. Os nossos voluntários de campo foram avisados para estarem atentos. Deseja registar esta pessoa oficialmente?`;
      }
      
      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 1000);
  };

  const filteredPeople = people.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'missing') return p.status === 'missing';
    if (activeFilter === 'found') return p.status === 'found_shelter';
    return true;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Action Button */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Reencontro de Famílias</h2>
          <p className="text-sm text-gray-500 mt-1">
            Procure por entes queridos ou registe alguém que está desaparecido no distrito afectado.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Nome ou localidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl font-medium text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-xs"
            />
          </div>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="h-12 px-5 bg-primary text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Cadastrar Registro
          </button>
        </div>
      </section>

      {/* Category Toggle Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'missing', label: 'Pessoas Desaparecidas' },
          { id: 'found', label: 'Pessoas Encontradas' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-all ${
              activeFilter === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {filteredPeople.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredPeople.map((person) => (
            <div
              key={person.id}
              className={`bg-white border rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between ${
                person.status === 'found_shelter' ? 'border-emerald-200' : 'border-gray-100'
              }`}
            >
              <div className="relative h-48 bg-gray-50 overflow-hidden">
                <img
                  src={person.imageUrl}
                  alt={person.name}
                  className="w-full h-full object-cover object-center hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm ${
                    person.status === 'missing'
                      ? 'bg-red-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {person.status === 'missing' ? 'warning' : 'verified'}
                  </span>
                  {person.status === 'missing' ? 'Desaparecido' : 'Encontrado em Abrigo'}
                </span>
              </div>
              
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-800 leading-snug">{person.name}</h3>
                  <div className="space-y-1.5 mt-2">
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-gray-400 text-sm">location_on</span>
                      {person.location}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-gray-400 text-sm">calendar_today</span>
                      Visto em: {person.lastSeenDate}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowDetailModal(person)}
                  className={`w-full py-2.5 border rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    person.status === 'found_shelter'
                      ? 'bg-emerald-600 text-white border-transparent hover:bg-emerald-700'
                      : 'border-primary text-primary hover:bg-red-50'
                  }`}
                >
                  {person.status === 'found_shelter' ? 'Entrar em Contacto' : 'Ver Detalhes'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
          <span className="material-symbols-outlined text-5xl text-gray-300">person_search</span>
          <p className="text-gray-500 text-sm mt-2 font-medium">Nenhum registro encontrado.</p>
        </div>
      )}

      {/* Bento info block */}
      <div className="bg-sky-500 text-white p-5 rounded-2xl flex flex-col justify-between items-start space-y-4 shadow-sm relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <h3 className="text-lg font-bold">Sabe de algo?</h3>
          <p className="text-sm opacity-90 max-w-lg leading-relaxed">
            Se tiver informações sobre qualquer pessoa listada, ou se encontrou alguém que não consegue contactar a família, por favor informe o INGD ou use o Chat de Ajuda.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 z-10 w-full">
          <a
            href="tel:112"
            className="bg-white text-sky-600 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">call</span>
            Ligar 112
          </a>
          <button
            onClick={() => setShowChatModal(true)}
            className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer hover:bg-red-700"
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            Chat de Ajuda
          </button>
        </div>
        <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[120px]">help</span>
        </div>
      </div>

      {/* Register Person Modal */}
      {showRegisterModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowRegisterModal(false)}></div>
          <div className="bg-white relative z-10 w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person_add</span>
                Cadastrar Pessoa
              </h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João Baptista"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Idade (Opcional)</label>
                  <input
                    type="number"
                    placeholder="Ex: 34"
                    value={regAge}
                    onChange={(e) => setRegAge(e.target.value)}
                    className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Gênero</label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                    className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-gray-50"
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Estado</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRegStatus('missing')}
                    className={`flex-1 py-2.5 border rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      regStatus === 'missing'
                        ? 'bg-red-50 border-red-500 text-red-600'
                        : 'bg-white border-gray-200 text-gray-500'
                    }`}
                  >
                    Desaparecido
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegStatus('found_shelter')}
                    className={`flex-1 py-2.5 border rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      regStatus === 'found_shelter'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                        : 'bg-white border-gray-200 text-gray-500'
                    }`}
                  >
                    Encontrado em Abrigo
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Localidade / Distrito *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Búzi, Sofala"
                  value={regLocation}
                  onChange={(e) => setRegLocation(e.target.value)}
                  className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Visto por último em *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 14 de Março ou Escola EPC"
                  value={regDate}
                  onChange={(e) => setRegDate(e.target.value)}
                  className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Contacto para Informações</label>
                <input
                  type="tel"
                  placeholder="Ex: +258 84 123 4567"
                  value={regContact}
                  onChange={(e) => setRegContact(e.target.value)}
                  className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Descrição Física / Detalhes</label>
                <textarea
                  placeholder="Descreva roupas, características, sinais especiais..."
                  rows={2}
                  value={regDesc}
                  onChange={(e) => setRegDesc(e.target.value)}
                  className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-gray-50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-primary text-white font-bold rounded-xl text-sm active:scale-95 transition-all cursor-pointer shadow-md"
              >
                Submeter Registro
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Person Detail Modal */}
      {showDetailModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowDetailModal(null)}></div>
          <div className="bg-white relative z-10 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative h-56 bg-gray-100">
              <img
                src={showDetailModal.imageUrl}
                alt={showDetailModal.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setShowDetailModal(null)}
                className="absolute top-3 right-3 bg-black/40 text-white hover:bg-black/60 p-2 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <span
                className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm ${
                  showDetailModal.status === 'missing' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {showDetailModal.status === 'missing' ? 'Desaparecido' : 'Encontrado(a) em Abrigo'}
              </span>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 leading-tight">{showDetailModal.name}</h3>
                {showDetailModal.age && (
                  <p className="text-xs text-gray-400 font-semibold mt-1">
                    {showDetailModal.age} Anos • Gênero {showDetailModal.gender}
                  </p>
                )}
              </div>

              <div className="space-y-2 border-t border-b py-3 border-gray-100 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-400 text-lg">location_on</span>
                  <span className="font-medium">Localidade:</span> {showDetailModal.location}
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-400 text-lg">calendar_today</span>
                  <span className="font-medium">Visto em:</span> {showDetailModal.lastSeenDate}
                </p>
                {showDetailModal.contactNumber && (
                  <p className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400 text-lg">call</span>
                    <span className="font-medium">Contacto:</span> {showDetailModal.contactNumber}
                  </p>
                )}
              </div>

              {showDetailModal.description && (
                <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-500 leading-relaxed">
                  <p className="font-semibold text-gray-600 mb-0.5">Descrição/Detalhes:</p>
                  {showDetailModal.description}
                </div>
              )}

              <div className="flex gap-2">
                <a
                  href={`tel:${showDetailModal.contactNumber || '112'}`}
                  className="flex-1 py-3 bg-secondary text-white font-bold rounded-xl text-center text-xs shadow-xs hover:bg-blue-700 cursor-pointer"
                >
                  Telefonar
                </a>
                <button
                  onClick={() => {
                    setShowDetailModal(null);
                    setShowChatModal(true);
                  }}
                  className="flex-grow py-3 border border-primary text-primary font-bold rounded-xl text-xs hover:bg-red-50 cursor-pointer"
                >
                  Enviar Pista
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Helper Chat Modal */}
      {showChatModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowChatModal(false)}></div>
          <div className="bg-white relative z-10 w-full max-w-sm rounded-2xl flex flex-col shadow-2xl h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="bg-primary text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">forum</span>
                <div>
                  <h3 className="font-bold text-sm">Assistente SOS Reencontros</h3>
                  <p className="text-[10px] text-red-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                    Atendente Virtual INGD
                  </p>
                </div>
              </div>
              <button onClick={() => setShowChatModal(false)} className="text-white/80 hover:text-white cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Message Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input message */}
            <div className="p-3 bg-white border-t flex gap-2">
              <input
                type="text"
                placeholder="Introduza a sua pista ou pergunta..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border rounded-xl px-4 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={handleSendMessage}
                className="bg-primary text-white p-2.5 rounded-xl cursor-pointer hover:bg-red-700 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
