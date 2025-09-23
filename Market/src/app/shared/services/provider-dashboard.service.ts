import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProviderServiceOffering {
  id: string;
  name: string;
  modalidad: string;
  price: number;
  animals: string[];
  schedule: string;
}

export interface ProviderProfile {
  name: string;
  email: string;
  telefono: string;
  direccion: string;
  rut?: string | null;
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
export class ProviderDashboardService {
  private readonly profileSubject = new BehaviorSubject<ProviderProfile | null>(null);

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

  setProfile(profile: ProviderProfile): void {
    const normalized: ProviderProfile = {
      ...profile,
      services: profile.services.map(service => ({
        ...service,
        animals: [...service.animals],
        price: Number.isFinite(service.price) ? Number(service.price) : 0,
      })),
    };

    this.profileSubject.next(normalized);
  }

  clearProfile(): void {
    this.profileSubject.next(null);
  }

  get currentProfile(): ProviderProfile | null {
    return this.profileSubject.value;
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

