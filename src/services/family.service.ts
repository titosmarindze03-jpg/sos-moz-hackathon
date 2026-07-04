import { Person } from '../models';

class FamilyService {
  private key = 'sos_mozambique_people';
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && !localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify(this.getInitialPeople()));
    }
  }

  private getInitialPeople(): Person[] {
    return [
      {
        id: '1',
        name: 'Amélio Mateus Vinte',
        status: 'missing',
        location: 'Beira, Sofala',
        lastSeenDate: '14 Março',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqU8hicpM13G_RC56bUf2JB0Y_Y1a6McGTu9vemVsRbnKZPgRQl2-0U48v9DQ3f5bJeBdtURKe95Kh39YVsUUjuxz50Naa3yq7KZfzGdRS16UQYp02auYua8u5bYpgYgCVBJoC7Tos_Bd4xdsTw2W_K3az0LRPtYftQiu4zkOkJv-qIMTMiw4U6NZaubhJDx4rC6ywZMRFShSyLSf36eok_2aV6p_0MprEzklJglk62f5oco0cAG2j',
        description: 'Visto pela última vez perto da zona portuária vestindo t-shirt branca. Qualquer informação por favor contactar.',
        age: 26,
        gender: 'Masculino'
      },
      {
        id: '2',
        name: 'Maria Esperança',
        status: 'found_shelter',
        location: 'Abrigo Samora Machel',
        lastSeenDate: '12 Março',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5hE8qJMTVdmjRCMnTI6QIqFP5WCKTTQuA04Uxs8g8uk8pf3J1TwNOeFzNLTxtz3IpnVGu7bx5dab1cYnvwQJc69eIy_1z-G8i4h-EkW3Ru5eDwLvCIctyp2ppj17pune6CeFw6_FjN6mp9mhwuAuMdaznOs--JC5juMnKh8F3BVxnyF99tFS9vV4sMUb7agm387IqJd8OVcdaoH9Ek_CofdwPTopfTBOSxzjs_7TeZX2-8BTX1un6',
        description: 'Está em segurança no abrigo. Procura por familiares de Sofala, em especial os seus filhos e netos.',
        age: 68,
        gender: 'Feminino'
      },
      {
        id: '3',
        name: 'Anifa João',
        status: 'missing',
        location: 'Búzi, Sofala',
        lastSeenDate: '15 Março',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDax6TR_-QJKG_fGdnJ4o9V4KpyPf-jlZo1UPLxAUNcyrBHbSrsLB57Dq1OILJmwwQXiblwYrqJzNBiraRdXiWKIw_fiCdmRNFkHvUFQ0CsGswrXq-25xcQdY2G3sOh7GwectrUD-KgaX965-EuLhpIWOBeKuwJX0z1-Ok9LhixcVY4r42IEdvB0aHreSt7E8lU-L5ZCqdytVRHvYqmjKd3MhjRj153A7-9eHwgzpo1iIQNU4lfHxHh',
        description: 'Criança de 8 anos separada da família durante a subida das águas no Búzi. Vestia camisola amarela.',
        age: 8,
        gender: 'Feminino'
      },
      {
        id: '4',
        name: 'Celso Mondlane',
        status: 'missing',
        location: 'Dondo, Sofala',
        lastSeenDate: '13 Março',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYK47R74GjC2xpjFcnyD9cDdMvjJWw2oykiQs6sBDons463ERj2mW3QfjdPnTiNqBYZnYEHEHcKEJN2Dj3V-zrluxvl93WUzAx4DWVYO1VBsADV5_ue2ypzxD-vznsAzSQT9z03rQQGWA2seDju2BrvNVP6U7FQsw5SX6JSSL5I-QMtY_T_UoLLVTLWcg3_9uOs2Sm3qpGBdDFtZPrPDHrwaWPOgtLiiW0MuUXSIYJXcwG04yOuFC2',
        description: 'Polo azul, barba curta. Foi visto a ajudar vizinhos na evacuação e não retornou ao ponto de encontro.',
        age: 45,
        gender: 'Masculino'
      }
    ];
  }

  getAll(): Person[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  save(person: Omit<Person, 'id'>): Person {
    const people = this.getAll();
    const newPerson: Person = {
      ...person,
      id: Math.random().toString(36).substring(2, 11)
    };
    people.unshift(newPerson);
    localStorage.setItem(this.key, JSON.stringify(people));
    this.notify();
    return newPerson;
  }

  update(person: Person): Person {
    const people = this.getAll();
    const idx = people.findIndex(p => p.id === person.id);
    if (idx !== -1) {
      people[idx] = person;
      localStorage.setItem(this.key, JSON.stringify(people));
      this.notify();
    }
    return person;
  }

  delete(id: string): void {
    let people = this.getAll();
    people = people.filter(p => p.id !== id);
    localStorage.setItem(this.key, JSON.stringify(people));
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

export const familyService = new FamilyService();
