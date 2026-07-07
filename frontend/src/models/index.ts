export interface Person {
  id: string;
  name: string;
  status: 'missing' | 'found_shelter' | 'reunited';
  location: string;
  lastSeenDate: string;
  imageUrl: string;
  contactNumber?: string;
  description?: string;
  registeredBy?: string;
  age?: number;
  gender?: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  type: 'flood' | 'info' | 'critical';
}

export interface SafeZone {
  id: string;
  name: string;
  type: 'shelter' | 'distribution' | 'hazard';
  capacity?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  details?: string;
}

export interface HelpRequest {
  id: string;
  categories: string[];
  urgency: 'low' | 'med' | 'high';
  description?: string;
  contactNumber?: string;
  quantities?: {
    water?: number;
    shelter?: number;
    medicine?: string;
    food?: string;
  };
  timestamp: string;
  status: 'pending' | 'resolved';
}

export interface RescueReport {
  id: string;
  locationType: 'gps' | 'manual';
  referencePoint: string;
  peopleCount: number;
  healthCondition: 'stable' | 'injured' | 'critico';
  needs: string[];
  timestamp: string;
  status: 'pending' | 'dispatched' | 'completed';
}
