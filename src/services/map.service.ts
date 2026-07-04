import { SafeZone } from '../models';

class MapService {
  private key = 'sos_mozambique_safe_zones';
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && !localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify(this.getInitialSafeZones()));
    }
  }

  private getInitialSafeZones(): SafeZone[] {
    return [
      {
        id: 'sz1',
        name: 'Escola Primária EPC',
        type: 'shelter',
        capacity: '60%',
        riskLevel: 'low',
        details: 'Capacidade máxima: 500 pessoas. Fornecimento de água ativo e segurança permanente.'
      },
      {
        id: 'sz2',
        name: 'Abrigo Central Samora Machel',
        type: 'shelter',
        capacity: '85%',
        riskLevel: 'low',
        details: 'Localizado no Pavilhão de Desportos. Assistência médica no local.'
      },
      {
        id: 'sz3',
        name: 'Zona Ribeirinha (Beira)',
        type: 'hazard',
        riskLevel: 'high',
        details: 'Nível das águas crítico. Evacuação obrigatória concluída em 80%.'
      },
      {
        id: 'sz4',
        name: 'Praça do Município - Beira',
        type: 'distribution',
        details: 'Ponto ativo de distribuição de kits de higiene, água potável e rações de emergência.'
      },
      {
        id: 'sz5',
        name: 'Búzi - Zona Alta',
        type: 'shelter',
        capacity: '40%',
        riskLevel: 'low',
        details: 'Acesso via helicóptero e embarcações. Ponto de refúgio temporário seguro.'
      }
    ];
  }

  getSafeZones(): SafeZone[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  addZone(zone: Omit<SafeZone, 'id'>): SafeZone {
    const zones = this.getSafeZones();
    const newZone: SafeZone = {
      ...zone,
      id: Math.random().toString(36).substring(2, 11)
    };
    zones.push(newZone);
    localStorage.setItem(this.key, JSON.stringify(zones));
    this.notify();
    return newZone;
  }

  updateZone(zone: SafeZone): SafeZone {
    const zones = this.getSafeZones();
    const idx = zones.findIndex(z => z.id === zone.id);
    if (idx !== -1) {
      zones[idx] = zone;
      localStorage.setItem(this.key, JSON.stringify(zones));
      this.notify();
    }
    return zone;
  }

  deleteZone(id: string): void {
    let zones = this.getSafeZones();
    zones = zones.filter(z => z.id !== id);
    localStorage.setItem(this.key, JSON.stringify(zones));
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const mapService = new MapService();
