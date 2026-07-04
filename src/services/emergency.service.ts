import { Alert, HelpRequest, RescueReport } from '../models';

class EmergencyService {
  private alertsKey = 'sos_mozambique_alerts';
  private helpRequestsKey = 'sos_mozambique_help_requests';
  private rescueReportsKey = 'sos_mozambique_rescue_reports';
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem(this.alertsKey)) {
        localStorage.setItem(this.alertsKey, JSON.stringify(this.getInitialAlerts()));
      }
      if (!localStorage.getItem(this.helpRequestsKey)) {
        localStorage.setItem(this.helpRequestsKey, JSON.stringify([]));
      }
      if (!localStorage.getItem(this.rescueReportsKey)) {
        localStorage.setItem(this.rescueReportsKey, JSON.stringify([]));
      }
    }
  }

  private getInitialAlerts(): Alert[] {
    return [
      {
        id: 'a1',
        title: 'Aviso de Cheias - Rio Púngue',
        description: 'Nível subindo rapidamente. Evacue para áreas altas imediatamente.',
        timeAgo: 'Há 15 minutos',
        type: 'critical'
      },
      {
        id: 'a2',
        title: 'Ponto de Distribuição: Beira',
        description: 'Distribuição de kits de higiene na Praça do Município até às 18h.',
        timeAgo: 'Há 1 hora',
        type: 'info'
      }
    ];
  }

  getAlerts(): Alert[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.alertsKey);
    return data ? JSON.parse(data) : [];
  }

  getHelpRequests(): HelpRequest[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.helpRequestsKey);
    return data ? JSON.parse(data) : [];
  }

  getRescueReports(): RescueReport[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.rescueReportsKey);
    return data ? JSON.parse(data) : [];
  }

  saveAlert(alert: Omit<Alert, 'id' | 'timeAgo'>): Alert {
    const alerts = this.getAlerts();
    const newAlert: Alert = {
      ...alert,
      id: Math.random().toString(36).substring(2, 11),
      timeAgo: 'Agora mesmo'
    };
    alerts.unshift(newAlert);
    localStorage.setItem(this.alertsKey, JSON.stringify(alerts));
    this.notify();
    return newAlert;
  }

  saveHelpRequest(request: Omit<HelpRequest, 'id' | 'timestamp' | 'status'>): HelpRequest {
    const requests = this.getHelpRequests();
    const newRequest: HelpRequest = {
      ...request,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };
    requests.unshift(newRequest);
    localStorage.setItem(this.helpRequestsKey, JSON.stringify(requests));
    this.notify();
    return newRequest;
  }

  saveRescueReport(report: Omit<RescueReport, 'id' | 'timestamp' | 'status'>): RescueReport {
    const reports = this.getRescueReports();
    const newReport: RescueReport = {
      ...report,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };
    reports.unshift(newReport);
    localStorage.setItem(this.rescueReportsKey, JSON.stringify(reports));
    this.notify();
    return newReport;
  }

  updateAlert(alert: Alert): Alert {
    const alerts = this.getAlerts();
    const idx = alerts.findIndex(a => a.id === alert.id);
    if (idx !== -1) {
      alerts[idx] = alert;
      localStorage.setItem(this.alertsKey, JSON.stringify(alerts));
      this.notify();
    }
    return alert;
  }

  deleteAlert(id: string): void {
    let alerts = this.getAlerts();
    alerts = alerts.filter(a => a.id !== id);
    localStorage.setItem(this.alertsKey, JSON.stringify(alerts));
    this.notify();
  }

  updateHelpRequestStatus(id: string, status: 'pending' | 'resolved'): void {
    const reqs = this.getHelpRequests();
    const idx = reqs.findIndex(r => r.id === id);
    if (idx !== -1) {
      reqs[idx].status = status;
      localStorage.setItem(this.helpRequestsKey, JSON.stringify(reqs));
      this.notify();
    }
  }

  deleteHelpRequest(id: string): void {
    let reqs = this.getHelpRequests();
    reqs = reqs.filter(r => r.id !== id);
    localStorage.setItem(this.helpRequestsKey, JSON.stringify(reqs));
    this.notify();
  }

  updateRescueReportStatus(id: string, status: 'pending' | 'dispatched' | 'completed'): void {
    const reports = this.getRescueReports();
    const idx = reports.findIndex(r => r.id === id);
    if (idx !== -1) {
      reports[idx].status = status;
      localStorage.setItem(this.rescueReportsKey, JSON.stringify(reports));
      this.notify();
    }
  }

  deleteRescueReport(id: string): void {
    let reports = this.getRescueReports();
    reports = reports.filter(r => r.id !== id);
    localStorage.setItem(this.rescueReportsKey, JSON.stringify(reports));
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

export const emergencyService = new EmergencyService();
