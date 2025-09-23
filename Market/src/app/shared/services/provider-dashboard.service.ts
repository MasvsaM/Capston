import { Injectable, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FirebaseCrudService } from './firebase-crud.service';
import { emailToDocumentId } from '../utils/firestore-id.util';

export interface ProviderServiceOffering {
  id: string;
  name: string;
  modalidad: string;
  price: number;
  animals: string[];
  schedule: string;
}

export interface ProviderProfile extends Record<string, unknown> {
  name: string;
  email: string;
  telefono: string;
  direccion: string;
  rut?: string | null;
  id?: string;
  createdAt?: number;
  updatedAt?: number;
  services: ProviderServiceOffering[];
}

export interface DashboardMetric {
  label: string;
  value: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  icon: string;
  description: string;
  metrics: DashboardMetric[];
  highlight?: string;
  cta?: string;
}

@Injectable({ providedIn: 'root' })
export class ProviderDashboardService implements OnDestroy {
  private readonly profileSubject = new BehaviorSubject<ProviderProfile | null>(null);
  private readonly crud = inject(FirebaseCrudService);
  private readonly collectionPath = 'providers';
  private readonly storageKey = 'market:last-provider-id';
  private profileSubscription: Subscription | null = null;

  readonly profile$ = this.profileSubject.asObservable();

  private readonly currencyFormatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  });

  private readonly widgetBuilders: Record<
    string,
    (service: ProviderServiceOffering) => DashboardWidget
  > = {
    grooming: service => ({
      id: 'grooming',
      title: 'Agenda de peluquería',
      icon: 'cut-outline',
      description: 'Controla turnos, recordatorios y paquetes de baño y corte.',
      metrics: [
        { label: 'Modalidad principal', value: service.modalidad },
        { label: 'Precio base', value: this.formatCurrency(service.price) },
        { label: 'Mascotas atendidas', value: this.formatList(service.animals) },
      ],
      highlight: service.schedule,
      cta: 'Ver agenda diaria',
    }),
    walking: service => ({
      id: 'walking',
      title: 'Rutas de paseo',
      icon: 'walk-outline',
      description: 'Monitorea salidas, asigna paseadores y gestiona paquetes semanales.',
      metrics: [
        { label: 'Cobertura', value: service.modalidad },
        { label: 'Tarifa por paseo', value: this.formatCurrency(service.price) },
        { label: 'Mascotas por salida', value: `${Math.max(service.animals.length, 1)} simultáneas` },
      ],
      highlight: service.schedule,
      cta: 'Planificar rutas',
    }),
    training: service => ({
      id: 'training',
      title: 'Programas de adiestramiento',
      icon: 'school-outline',
      description: 'Configura módulos, da seguimiento a alumnos y comparte avances con tutores.',
      metrics: [
        { label: 'Modalidad', value: service.modalidad },
        { label: 'Valor del programa', value: this.formatCurrency(service.price) },
        { label: 'Especialidades', value: this.formatList(service.animals) },
      ],
      highlight: service.schedule,
      cta: 'Diseñar programa',
    }),
    veterinary: service => ({
      id: 'veterinary',
      title: 'Agenda de salud',
      icon: 'medkit-outline',
      description: 'Centraliza fichas médicas, recordatorios de vacunas y stock de farmacia.',
      metrics: [
        { label: 'Atención', value: service.modalidad },
        { label: 'Consulta base', value: this.formatCurrency(service.price) },
        { label: 'Especies atendidas', value: this.formatList(service.animals) },
      ],
      highlight: service.schedule,
      cta: 'Gestionar citas',
    }),
    daycare: service => ({
      id: 'daycare',
      title: 'Guardería & hotel',
      icon: 'home-outline',
      description: 'Administra reservas, control de aforo y seguimiento de estancias prolongadas.',
      metrics: [
        { label: 'Modalidad', value: service.modalidad },
        { label: 'Tarifa diaria', value: this.formatCurrency(service.price) },
        { label: 'Capacidad', value: `${Math.max(service.animals.length, 1)} cupos activos` },
      ],
      highlight: service.schedule,
      cta: 'Ver calendario de reservas',
    }),
  };

  private readonly emptyStateWidgets: DashboardWidget[] = [
    {
      id: 'empty-state',
      title: 'Configura tu panel',
      icon: 'clipboard-outline',
      description:
        'Completa la encuesta de servicios del registro de proveedor para desbloquear métricas personalizadas.',
      metrics: [],
      highlight: 'Sin servicios registrados',
      cta: 'Ir a registro',
    },
  ];

  constructor() {
    void this.restoreStoredProfile();
  }

  ngOnDestroy(): void {
    this.profileSubscription?.unsubscribe();
  }

  async saveProfile(profile: ProviderProfile): Promise<string> {
    if (!profile.email) {
      throw new Error('El perfil de proveedor requiere un correo electrónico válido.');
    }

    const documentId = emailToDocumentId(profile.email);
    const normalized = this.normalizeProfile({ ...profile, id: profile.id ?? documentId });

    await this.crud.setDocument<ProviderProfile>(this.collectionPath, documentId, normalized);

    this.listenToProfile(documentId);

    return documentId;
  }

  loadProfile(id: string): void {
    if (!id) {
      return;
    }

    this.listenToProfile(id);
  }

  clearProfile(): void {
    this.profileSubscription?.unsubscribe();
    this.profileSubscription = null;
    this.profileSubject.next(null);
    this.clearStoredProviderId();
  }

  async deleteProfile(id?: string): Promise<void> {
    const targetId = id ?? this.currentProfile?.id;

    if (!targetId) {
      return;
    }

    await this.crud.deleteDocument(this.collectionPath, targetId);
    this.clearProfile();
  }

  get currentProfile(): ProviderProfile | null {
    return this.profileSubject.value;
  }

  private async restoreStoredProfile(): Promise<void> {
    const storedId = this.getStoredProviderId();

    if (!storedId) {
      return;
    }

    this.listenToProfile(storedId);
  }

  private listenToProfile(id: string): void {
    this.profileSubscription?.unsubscribe();

    this.profileSubscription = this.crud
      .watchDocument<ProviderProfile>(this.collectionPath, id)
      .subscribe({
        next: profile => {
          if (profile) {
            this.profileSubject.next(this.normalizeProfile(profile));
            this.storeProviderId(id);
          } else {
            this.profileSubject.next(null);
            this.clearStoredProviderId();
          }
        },
        error: error => {
          console.error('Error al sincronizar el perfil de proveedor', error);
          this.profileSubject.next(null);
        },
      });
  }

  private normalizeProfile(profile: ProviderProfile): ProviderProfile {
    const services = Array.isArray(profile.services) ? profile.services : [];

    return {
      ...profile,
      services: services.map(service => ({
        ...service,
        animals: Array.isArray(service.animals) ? [...service.animals] : [],
        price: Number.isFinite(service.price) ? Number(service.price) : 0,
      })),
    };
  }

  private getStoredProviderId(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      return window.localStorage.getItem(this.storageKey);
    } catch (error) {
      console.warn('No fue posible leer el proveedor almacenado', error);
      return null;
    }
  }

  private storeProviderId(id: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(this.storageKey, id);
    } catch (error) {
      console.warn('No fue posible guardar el identificador del proveedor', error);
    }
  }

  private clearStoredProviderId(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('No fue posible limpiar el identificador del proveedor', error);
    }
  }

  getWidgets(profile: ProviderProfile | null): DashboardWidget[] {
    if (!profile) {
      return this.emptyStateWidgets;
    }

    const widgets: DashboardWidget[] = [this.buildOverviewWidget(profile)];

    for (const service of profile.services) {
      const builder = this.widgetBuilders[service.id];
      widgets.push(builder ? builder(service) : this.buildGenericWidget(service));
    }

    return widgets;
  }

  private buildOverviewWidget(profile: ProviderProfile): DashboardWidget {
    const totalServices = profile.services.length;
    const averagePrice =
      totalServices === 0
        ? 0
        : profile.services.reduce((sum, service) => sum + (service.price || 0), 0) / totalServices;

    return {
      id: 'overview',
      title: 'Resumen del negocio',
      icon: 'speedometer-outline',
      description: 'Visión general de tus servicios activos y tickets promedio.',
      metrics: [
        { label: 'Servicios activos', value: totalServices.toString() },
        {
          label: 'Ticket promedio',
          value: averagePrice > 0 ? this.formatCurrency(averagePrice) : 'Sin definir',
        },
        { label: 'Contacto', value: profile.telefono },
      ],
      highlight: profile.direccion,
      cta: 'Editar perfil',
    };
  }

  private buildGenericWidget(service: ProviderServiceOffering): DashboardWidget {
    return {
      id: `custom-${service.id}`,
      title: service.name,
      icon: 'apps-outline',
      description: 'Gestiona reservas, pagos y recordatorios para este servicio personalizado.',
      metrics: [
        { label: 'Modalidad', value: service.modalidad },
        { label: 'Precio base', value: this.formatCurrency(service.price) },
        { label: 'Mascotas atendidas', value: this.formatList(service.animals) },
      ],
      highlight: service.schedule,
      cta: 'Gestionar reservas',
    };
  }

  private formatCurrency(value: number): string {
    return this.currencyFormatter.format(Math.max(value, 0));
  }

  private formatList(values: string[]): string {
    return values.length > 0 ? values.join(', ') : 'Sin especificar';
  }
}

