import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProviderPreferences {
  modules: {
    agenda: boolean;
    inventory: boolean;
    services: boolean;
    species: boolean;
  };
  servicesOffered: string[];
  speciesAttended: string[];
}

const DEFAULT_PREFERENCES: ProviderPreferences = {
  modules: {
    agenda: false,
    inventory: false,
    services: false,
    species: false,
  },
  servicesOffered: [],
  speciesAttended: [],
};

@Injectable({
  providedIn: 'root',
})
export class ProviderPreferencesService {
  private readonly storageKey = 'provider-preferences';
  private readonly preferencesSubject = new BehaviorSubject<ProviderPreferences>(
    this.loadFromStorage(),
  );

  readonly preferences$ = this.preferencesSubject.asObservable();

  getPreferences(): ProviderPreferences {
    return this.preferencesSubject.value;
  }

  savePreferences(preferences: ProviderPreferences): void {
    this.preferencesSubject.next(preferences);
    this.persist(preferences);
  }

  private persist(preferences: ProviderPreferences): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(preferences));
  }

  private loadFromStorage(): ProviderPreferences {
    if (typeof localStorage === 'undefined') {
      return DEFAULT_PREFERENCES;
    }

    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      return DEFAULT_PREFERENCES;
    }

    try {
      const parsed = JSON.parse(raw) as ProviderPreferences;
      return {
        ...DEFAULT_PREFERENCES,
        ...parsed,
        modules: {
          ...DEFAULT_PREFERENCES.modules,
          ...(parsed.modules ?? {}),
        },
        servicesOffered: parsed.servicesOffered ?? [],
        speciesAttended: parsed.speciesAttended ?? [],
      };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }
}
