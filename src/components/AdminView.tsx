import React, { useState, useEffect } from 'react';
import { familyService } from '../services/family.service';
import { emergencyService } from '../services/emergency.service';
import { mapService } from '../services/map.service';
import { Person, Alert, SafeZone, HelpRequest, RescueReport } from '../models';

export default function AdminView() {
  const [activeAdminTab, setActiveAdminTab] = useState<'people' | 'help' | 'rescue' | 'alerts_zones'>('people');

  // Lists state
  const [people, setPeople] = useState<Person[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [zones, setZones] = useState<SafeZone[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [rescueReports, setRescueReports] = useState<RescueReport[]>([]);

  // Selected item for edit
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [editingZone, setEditingZone] = useState<SafeZone | null>(null);

  // Modal controls
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);

  // Form states
  const [personForm, setPersonForm] = useState<Omit<Person, 'id'>>({
    name: '',
    status: 'missing',
    location: '',
    lastSeenDate: '',
    imageUrl: '',
    description: '',
    age: 30,
    gender: 'Masculino',
    contactNumber: ''
  });

  const [alertForm, setAlertForm] = useState<Omit<Alert, 'id' | 'timeAgo'>>({
    title: '',
    description: '',
    type: 'info'
  });

  const [zoneForm, setZoneForm] = useState<Omit<SafeZone, 'id'>>({
    name: '',
    type: 'shelter',
    capacity: '',
    riskLevel: 'low',
    details: ''
  });

  // Load and subscribe
  useEffect(() => {
    const loadAll = () => {
      setPeople(familyService.getAll());
      setAlerts(emergencyService.getAlerts());
      setZones(mapService.getSafeZones());
      setHelpRequests(emergencyService.getHelpRequests());
      setRescueReports(emergencyService.getRescueReports());
    };

    loadAll();

    const unsubFamily = familyService.subscribe(loadAll);
    const unsubEmergency = emergencyService.subscribe(loadAll);
    const unsubMap = mapService.subscribe(loadAll);

    return () => {
      unsubFamily();
      unsubEmergency();
      unsubMap();
    };
  }, []);

  // --- Handlers for Persons ---
  const handleOpenAddPerson = () => {
    setEditingPerson(null);
    setPersonForm({
      name: '',
      status: 'missing',
      location: '',
      lastSeenDate: 'Hoje',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqU8hicpM13G_RC56bUf2JB0Y_Y1a6McGTu9vemVsRbnKZPgRQl2-0U48v9DQ3f5bJeBdtURKe95Kh39YVsUUjuxz50Naa3yq7KZfzGdRS16UQYp02auYua8u5bYpgYgCVBJoC7Tos_Bd4xdsTw2W_K3az0LRPtYftQiu4zkOkJv-qIMTMiw4U6NZaubhJDx4rC6ywZMRFShSyLSf36eok_2aV6p_0MprEzklJglk62f5oco0cAG2j',
      description: '',
      age: 25,
      gender: 'Masculino',
      contactNumber: ''
    });
    setShowPersonModal(true);
  };

  const handleOpenEditPerson = (person: Person) => {
    setEditingPerson(person);
    setPersonForm({
      name: person.name,
      status: person.status,
      location: person.location,
      lastSeenDate: person.lastSeenDate,
      imageUrl: person.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqU8hicpM13G_RC56bUf2JB0Y_Y1a6McGTu9vemVsRbnKZPgRQl2-0U48v9DQ3f5bJeBdtURKe95Kh39YVsUUjuxz50Naa3yq7KZfzGdRS16UQYp02auYua8u5bYpgYgCVBJoC7Tos_Bd4xdsTw2W_K3az0LRPtYftQiu4zkOkJv-qIMTMiw4U6NZaubhJDx4rC6ywZMRFShSyLSf36eok_2aV6p_0MprEzklJglk62f5oco0cAG2j',
      description: person.description || '',
      age: person.age || 30,
      gender: person.gender || 'Masculino',
      contactNumber: person.contactNumber || ''
    });
    setShowPersonModal(true);
  };

  const handleSavePerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personForm.name || !personForm.location) {
      alert('Por favor, preencha o Nome e a Localização.');
      return;
    }

    if (editingPerson) {
      familyService.update({
        ...personForm,
        id: editingPerson.id
      });
    } else {
      familyService.save(personForm);
    }
    setShowPersonModal(false);
  };

  const handleDeletePerson = (id: string) => {
    if (confirm('Tem a certeza de que deseja remover este registo de pessoa?')) {
      familyService.delete(id);
    }
  };

  // --- Handlers for Alerts ---
  const handleOpenAddAlert = () => {
    setEditingAlert(null);
    setAlertForm({
      title: '',
      description: '',
      type: 'info'
    });
    setShowAlertModal(true);
  };

  const handleOpenEditAlert = (alertItem: Alert) => {
    setEditingAlert(alertItem);
    setAlertForm({
      title: alertItem.title,
      description: alertItem.description,
      type: alertItem.type
    });
    setShowAlertModal(true);
  };

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertForm.title || !alertForm.description) return;

    if (editingAlert) {
      emergencyService.updateAlert({
        ...editingAlert,
        title: alertForm.title,
        description: alertForm.description,
        type: alertForm.type
      });
    } else {
      emergencyService.saveAlert(alertForm);
    }
    setShowAlertModal(false);
  };

  const handleDeleteAlert = (id: string) => {
    if (confirm('Deseja eliminar este alerta?')) {
      emergencyService.deleteAlert(id);
    }
  };

  // --- Handlers for Zones ---
  const handleOpenAddZone = () => {
    setEditingZone(null);
    setZoneForm({
      name: '',
      type: 'shelter',
      capacity: '0%',
      riskLevel: 'low',
      details: ''
    });
    setShowZoneModal(true);
  };

  const handleOpenEditZone = (zone: SafeZone) => {
    setEditingZone(zone);
    setZoneForm({
      name: zone.name,
      type: zone.type,
      capacity: zone.capacity || '0%',
      riskLevel: zone.riskLevel || 'low',
      details: zone.details || ''
    });
    setShowZoneModal(true);
  };

  const handleSaveZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneForm.name) return;

    if (editingZone) {
      mapService.updateZone({
        ...zoneForm,
        id: editingZone.id
      });
    } else {
      mapService.addZone(zoneForm);
    }
    setShowZoneModal(false);
  };

  const handleDeleteZone = (id: string) => {
    if (confirm('Deseja remover este ponto/área segura?')) {
      mapService.deleteZone(id);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Title block */}
      <section className="bg-slate-900 text-white p-4 -mx-4 -mt-4 mb-4 rounded-b-2xl shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-widest mb-1">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Painel de Administração (Acesso Civil / INGD)
        </div>
        <h2 className="text-xl font-black tracking-tight">Consola de Gestão de Crise</h2>
        <p className="text-[11px] text-gray-300 mt-1">
          Adicione/edite dados do mapa, alertas críticos, relatórios de resgate e registos de cidadãos em tempo real.
        </p>
      </section>

      {/* Admin Tabs */}
      <div className="flex gap-1.5 pb-1 overflow-x-auto scrollbar-none border-b border-gray-100">
        {[
          { id: 'people', label: 'Pessoas', icon: 'person_search' },
          { id: 'help', label: 'Pedidos', icon: 'handshake' },
          { id: 'rescue', label: 'Resgates', icon: 'helicopter' },
          { id: 'alerts_zones', label: 'Alertas/Mapas', icon: 'campaign' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeAdminTab === tab.id
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white border border-gray-150 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="material-symbols-outlined text-xs">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        {/* TAB 1: PEOPLE */}
        {activeAdminTab === 'people' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-xs">Pessoas Registadas ({people.length})</h3>
              <button
                onClick={handleOpenAddPerson}
                className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">add</span> Registar Nova
              </button>
            </div>

            <div className="space-y-2">
              {people.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400 bg-white border border-dashed rounded-xl">
                  Nenhuma pessoa registada.
                </div>
              ) : (
                people.map(person => (
                  <div key={person.id} className="p-3 bg-white border border-gray-100 rounded-xl flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={person.imageUrl}
                        alt={person.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-150"
                        onError={(e) => {
                          (e.target as any).src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqU8hicpM13G_RC56bUf2JB0Y_Y1a6McGTu9vemVsRbnKZPgRQl2-0U48v9DQ3f5bJeBdtURKe95Kh39YVsUUjuxz50Naa3yq7KZfzGdRS16UQYp02auYua8u5bYpgYgCVBJoC7Tos_Bd4xdsTw2W_K3az0LRPtYftQiu4zkOkJv-qIMTMiw4U6NZaubhJDx4rC6ywZMRFShSyLSf36eok_2aV6p_0MprEzklJglk62f5oco0cAG2j';
                        }}
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-black text-xs text-gray-800">{person.name}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 font-bold rounded-full text-white uppercase ${
                            person.status === 'missing'
                              ? 'bg-red-500'
                              : person.status === 'found_shelter'
                              ? 'bg-emerald-500'
                              : 'bg-blue-500'
                          }`}>
                            {person.status === 'missing' ? 'Desaparecido' : person.status === 'found_shelter' ? 'No Abrigo' : 'Reencontrado'}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400">
                          Visto: {person.lastSeenDate} • {person.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenEditPerson(person)}
                        className="p-1.5 bg-gray-50 text-gray-600 border border-gray-150 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center justify-center"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeletePerson(person.id)}
                        className="p-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 cursor-pointer flex items-center justify-center"
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-xs">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: HELP REQUESTS */}
        {activeAdminTab === 'help' && (
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 text-xs">Pedidos de Ajuda Recebidos ({helpRequests.length})</h3>
            
            <div className="space-y-2">
              {helpRequests.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400 bg-white border border-dashed rounded-xl">
                  Nenhum pedido de ajuda pendente.
                </div>
              ) : (
                helpRequests.map(req => (
                  <div key={req.id} className="p-3.5 bg-white border border-gray-100 rounded-xl space-y-2 shadow-2xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex gap-1.5 flex-wrap">
                          {req.categories.map(cat => (
                            <span key={cat} className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">
                              {cat}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">ID: {req.id} • Recebido às {req.timestamp}</p>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 font-bold rounded-full text-white uppercase ${
                        req.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}>
                        {req.status === 'resolved' ? 'Resolvido' : 'Pendente'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg leading-relaxed">
                      {req.description || 'Sem descrição adicional.'}
                    </p>

                    {req.contactNumber && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-150 rounded-lg text-slate-700 text-xs font-semibold">
                        <span className="material-symbols-outlined text-sm text-slate-500">phone</span>
                        <span>Contacto: <span className="font-bold text-slate-900">{req.contactNumber}</span></span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-1 border-t border-gray-50">
                      <div className="text-[9px] text-red-600 font-bold uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">priority_high</span>
                        Urgência: {req.urgency}
                      </div>

                      <div className="flex gap-1.5">
                        <button
                          onClick={() => emergencyService.deleteHelpRequest(req.id)}
                          className="px-2 py-1 bg-red-50 text-red-600 rounded text-[9px] font-bold border border-red-100 hover:bg-red-100 cursor-pointer"
                        >
                          Apagar
                        </button>
                        <button
                          onClick={() => emergencyService.updateHelpRequestStatus(
                            req.id, 
                            req.status === 'resolved' ? 'pending' : 'resolved'
                          )}
                          className={`px-3 py-1 rounded text-[9px] font-bold cursor-pointer transition-all ${
                            req.status === 'resolved' 
                              ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {req.status === 'resolved' ? 'Marcar Pendente' : 'Marcar Resolvido'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: RESCUE REPORTS */}
        {activeAdminTab === 'rescue' && (
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 text-xs">Sinais de Resgate / SOS ({rescueReports.length})</h3>

            <div className="space-y-2">
              {rescueReports.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400 bg-white border border-dashed rounded-xl">
                  Nenhum sinal de resgate ativo.
                </div>
              ) : (
                rescueReports.map(report => (
                  <div key={report.id} className="p-3.5 bg-white border border-gray-150 rounded-xl space-y-2 shadow-2xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-gray-800">
                            {report.peopleCount} Cidadãos Isolados
                          </span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-black text-white ${
                            report.healthCondition === 'critico' ? 'bg-red-600' : report.healthCondition === 'injured' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}>
                            {report.healthCondition.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">ID: {report.id} • Enviado às {report.timestamp}</p>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 font-bold rounded-full text-white uppercase ${
                        report.status === 'completed'
                          ? 'bg-emerald-500'
                          : report.status === 'dispatched'
                          ? 'bg-blue-500'
                          : 'bg-red-500 animate-pulse'
                      }`}>
                        {report.status === 'completed' ? 'Completo' : report.status === 'dispatched' ? 'Enviado' : 'Pendente'}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <p><strong>Ponto de Refêrencia:</strong> {report.referencePoint}</p>
                      <p><strong>Necessidades Urgentes:</strong> {report.needs.join(', ') || 'Nenhuma informada'}</p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <button
                        onClick={() => emergencyService.deleteRescueReport(report.id)}
                        className="px-2 py-1 bg-red-50 text-red-600 rounded text-[9px] font-bold border border-red-100 hover:bg-red-100 cursor-pointer"
                      >
                        Apagar
                      </button>

                      <div className="flex gap-1">
                        <button
                          onClick={() => emergencyService.updateRescueReportStatus(report.id, 'pending')}
                          className={`px-2 py-1 rounded text-[9px] font-bold cursor-pointer ${
                            report.status === 'pending' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Pendente
                        </button>
                        <button
                          onClick={() => emergencyService.updateRescueReportStatus(report.id, 'dispatched')}
                          className={`px-2 py-1 rounded text-[9px] font-bold cursor-pointer ${
                            report.status === 'dispatched' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Despachado
                        </button>
                        <button
                          onClick={() => emergencyService.updateRescueReportStatus(report.id, 'completed')}
                          className={`px-2 py-1 rounded text-[9px] font-bold cursor-pointer ${
                            report.status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Concluído
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ALERTS AND SAFE ZONES */}
        {activeAdminTab === 'alerts_zones' && (
          <div className="space-y-4">
            {/* ALERTS SECTION */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-xs">Alertas de Civil Ativos ({alerts.length})</h3>
                <button
                  onClick={handleOpenAddAlert}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">add</span> Novo Alerta
                </button>
              </div>

              <div className="space-y-2">
                {alerts.map(a => (
                  <div key={a.id} className="p-3 bg-white border border-gray-100 rounded-xl flex items-start justify-between shadow-2xs gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-black text-white ${
                          a.type === 'critical' ? 'bg-red-600' : a.type === 'flood' ? 'bg-blue-600' : 'bg-slate-500'
                        }`}>
                          {a.type.toUpperCase()}
                        </span>
                        <h4 className="font-bold text-xs text-gray-800">{a.title}</h4>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed">{a.description}</p>
                      <p className="text-[9px] text-gray-400">Tempo: {a.timeAgo}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEditAlert(a)}
                        className="p-1 bg-gray-50 text-gray-600 border border-gray-150 rounded-lg hover:bg-gray-100 cursor-pointer"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteAlert(a.id)}
                        className="p-1 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 cursor-pointer"
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-xs">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SAFE ZONES MAP MARKERS SECTION */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-xs">Áreas e Abrigos no Mapa ({zones.length})</h3>
                <button
                  onClick={handleOpenAddZone}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">add</span> Novo Ponto
                </button>
              </div>

              <div className="space-y-2">
                {zones.map(z => (
                  <div key={z.id} className="p-3 bg-white border border-gray-100 rounded-xl flex items-center justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-black text-white ${
                          z.type === 'shelter' ? 'bg-emerald-600' : z.type === 'distribution' ? 'bg-blue-600' : 'bg-red-600'
                        }`}>
                          {z.type.toUpperCase()}
                        </span>
                        <h4 className="font-bold text-xs text-gray-800">{z.name}</h4>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {z.capacity ? `Lotação: ${z.capacity}` : `Risco: ${z.riskLevel || 'N/A'}`}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEditZone(z)}
                        className="p-1 bg-gray-50 text-gray-600 border border-gray-150 rounded-lg hover:bg-gray-100 cursor-pointer"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteZone(z.id)}
                        className="p-1 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 cursor-pointer"
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-xs">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD/EDIT PERSON */}
      {showPersonModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2.5">
              <h3 className="font-black text-slate-900 text-sm">
                {editingPerson ? 'Editar Pessoa Perdida' : 'Registar Pessoa Desaparecida'}
              </h3>
              <button onClick={() => setShowPersonModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSavePerson} className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={personForm.name}
                  onChange={e => setPersonForm({...personForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  placeholder="Ex: João Manuel Banze"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Idade</label>
                  <input
                    type="number"
                    value={personForm.age || ''}
                    onChange={e => setPersonForm({...personForm, age: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                    placeholder="Ex: 28"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Gênero</label>
                  <select
                    value={personForm.gender}
                    onChange={e => setPersonForm({...personForm, gender: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden bg-white"
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Estado de Segurança</label>
                <select
                  value={personForm.status}
                  onChange={e => setPersonForm({...personForm, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden bg-white"
                >
                  <option value="missing">Desaparecido / À Procura</option>
                  <option value="found_shelter">Encontrado (Num Abrigo)</option>
                  <option value="reunited">Reencontrado com Família</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Localização aproximada</label>
                <input
                  type="text"
                  required
                  value={personForm.location}
                  onChange={e => setPersonForm({...personForm, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  placeholder="Ex: Abrigo EPC / Bairro Munhava"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Data de Referência</label>
                <input
                  type="text"
                  value={personForm.lastSeenDate}
                  onChange={e => setPersonForm({...personForm, lastSeenDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  placeholder="Ex: 14 de Março"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">URL da Imagem de Rosto</label>
                <input
                  type="text"
                  value={personForm.imageUrl}
                  onChange={e => setPersonForm({...personForm, imageUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  placeholder="URL de foto fidedigna"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Contacto Telefónico</label>
                <input
                  type="text"
                  value={personForm.contactNumber}
                  onChange={e => setPersonForm({...personForm, contactNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  placeholder="+258 84 123 4567"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Informações Adicionais / Descrição</label>
                <textarea
                  rows={2}
                  value={personForm.description}
                  onChange={e => setPersonForm({...personForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  placeholder="Características físicas, roupas que vestia..."
                ></textarea>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPersonModal(false)}
                  className="flex-1 py-2 bg-gray-50 border border-gray-200 text-gray-600 font-bold rounded-xl text-xs hover:bg-gray-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-850 cursor-pointer"
                >
                  Gravar Dados
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD/EDIT ALERT */}
      {showAlertModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-2.5">
              <h3 className="font-black text-slate-900 text-sm">
                {editingAlert ? 'Editar Alerta Ativo' : 'Publicar Novo Alerta'}
              </h3>
              <button onClick={() => setShowAlertModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveAlert} className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Título do Alerta</label>
                <input
                  type="text"
                  required
                  value={alertForm.title}
                  onChange={e => setAlertForm({...alertForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  placeholder="Ex: Rio Búzi em Alerta Vermelho"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Tipo de Alerta</label>
                <select
                  value={alertForm.type}
                  onChange={e => setAlertForm({...alertForm, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden bg-white"
                >
                  <option value="info">Informação Geral</option>
                  <option value="flood">Inundação / Cheia</option>
                  <option value="critical">Crítico / Risco Elevado</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Mensagem / Conteúdo</label>
                <textarea
                  required
                  rows={3}
                  value={alertForm.description}
                  onChange={e => setAlertForm({...alertForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  placeholder="Escreva a instrução detalhada de segurança civil..."
                ></textarea>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAlertModal(false)}
                  className="flex-1 py-2 bg-gray-50 border border-gray-200 text-gray-600 font-bold rounded-xl text-xs hover:bg-gray-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-850 cursor-pointer"
                >
                  Publicar Alerta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD/EDIT SAFE ZONE */}
      {showZoneModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-2.5">
              <h3 className="font-black text-slate-900 text-sm">
                {editingZone ? 'Editar Localização' : 'Adicionar Ponto ao Mapa'}
              </h3>
              <button onClick={() => setShowZoneModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveZone} className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Nome do Local</label>
                <input
                  type="text"
                  required
                  value={zoneForm.name}
                  onChange={e => setZoneForm({...zoneForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  placeholder="Ex: EPC de Sofala"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Categoria</label>
                <select
                  value={zoneForm.type}
                  onChange={e => setZoneForm({...zoneForm, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden bg-white"
                >
                  <option value="shelter">Abrigo Seguro</option>
                  <option value="distribution">Distribuição de Alimentos/Água</option>
                  <option value="hazard">Zona de Alto Risco / Alagamento</option>
                </select>
              </div>

              {zoneForm.type === 'shelter' ? (
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Capacidade / Lotação</label>
                  <input
                    type="text"
                    value={zoneForm.capacity}
                    onChange={e => setZoneForm({...zoneForm, capacity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                    placeholder="Ex: 85%"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Grau de Risco</label>
                  <select
                    value={zoneForm.riskLevel}
                    onChange={e => setZoneForm({...zoneForm, riskLevel: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden bg-white"
                  >
                    <option value="low">Baixo (Seguro)</option>
                    <option value="medium">Médio (Atenção)</option>
                    <option value="high">Crítico (Perigo)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Detalhes e Notas de Acesso</label>
                <textarea
                  rows={2}
                  value={zoneForm.details}
                  onChange={e => setZoneForm({...zoneForm, details: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  placeholder="Água potável, tendas médicas ou área intransitável..."
                ></textarea>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowZoneModal(false)}
                  className="flex-1 py-2 bg-gray-50 border border-gray-200 text-gray-600 font-bold rounded-xl text-xs hover:bg-gray-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-850 cursor-pointer"
                >
                  Confirmar Ponto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
