import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

interface PetProfile {
  name: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  vaccinations: string[];
  location: string;
}

interface ProviderProfile {
  name: string;
  profession: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  location: string;
  availability: string;
  price: string;
  imageUrl: string;
}

interface SubscriptionPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  isCurrentPlan?: boolean;
  isPopular?: boolean;
}

interface Appointment {
  id: string;
  petName: string;
  providerName: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed';
}

interface QuickAction {
  icon: string;
  label: string;
  description: string;
  color: string;
  routerLink?: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  readonly user = {
    name: 'Valentina',
    planType: 'Básico',
    email: 'valentina.rios@email.com',
    phone: '+569 1234 5678',
    location: 'Santiago Centro',
  };

  readonly quickActions: QuickAction[] = [
    {
      icon: 'calendar-outline',
      label: 'Agendar cita',
      description: 'Coordina servicios y consultas',
      color: 'primary',
      routerLink: ['/feed'],
    },
    {
      icon: 'medkit-outline',
      label: 'Vacunas',
      description: 'Registra y programa vacunas',
      color: 'success',
    },
    {
      icon: 'sparkles-outline',
      label: 'Suscripción',
      description: 'Mejora tu plan',
      color: 'warning',
      routerLink: ['/perfil-cliente'],
    },
  ];

  readonly pets: PetProfile[] = [
    {
      name: 'Max',
      species: 'Perro',
      breed: 'Golden Retriever',
      age: '3 años',
      weight: '28 kg',
      vaccinations: ['Rabia', 'Parvovirus', 'Distemper'],
      location: 'Santiago Centro',
    },
    {
      name: 'Luna',
      species: 'Gato',
      breed: 'Persa',
      age: '2 años',
      weight: '4 kg',
      vaccinations: ['Triple Felina', 'Rabia'],
      location: 'Santiago Centro',
    },
    {
      name: 'Rocky',
      species: 'Perro',
      breed: 'Bulldog Francés',
      age: '5 años',
      weight: '12 kg',
      vaccinations: ['Rabia', 'Parvovirus'],
      location: 'Santiago Centro',
    },
  ];

  readonly providers: ProviderProfile[] = [
    {
      name: 'Dr. María González',
      profession: 'Veterinaria',
      specialties: ['Cirugía', 'Medicina Interna', 'Cardiología'],
      rating: 4.9,
      reviewCount: 127,
      location: 'Las Condes, Santiago',
      availability: 'Lun-Vie 9:00-18:00',
      price: '$35.000',
      imageUrl:
        'https://images.unsplash.com/photo-1593275497414-473e94a9152a?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Carlos Mendoza',
      profession: 'Paseador Profesional',
      specialties: ['Perros Grandes', 'Entrenamiento Básico', 'Ejercicio'],
      rating: 4.8,
      reviewCount: 89,
      location: 'Parque Forestal, Santiago',
      availability: 'Todos los días 7:00-19:00',
      price: '$8.000/paseo',
      imageUrl:
        'https://images.unsplash.com/photo-1596787693095-1731f91546f8?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Ana Silva',
      profession: 'Estilista Canina',
      specialties: ['Grooming', 'Corte de Uñas', 'Limpieza de Oídos'],
      rating: 4.7,
      reviewCount: 156,
      location: 'Providencia, Santiago',
      availability: 'Mar-Sáb 10:00-17:00',
      price: '$25.000',
      imageUrl:
        'https://images.unsplash.com/photo-1625279138836-e7311d5c863a?auto=format&fit=crop&w=600&q=80',
    },
  ];

  readonly subscriptionPlans: SubscriptionPlan[] = [
    {
      name: 'Básico',
      price: 'Gratis',
      period: 'mes',
      features: [
        'Hasta 2 perfiles de mascotas',
        'Búsqueda básica de proveedores',
        'Reservas estándar',
        'Recordatorios básicos',
      ],
      isCurrentPlan: true,
    },
    {
      name: 'Premium',
      price: '$9.990',
      period: 'mes',
      features: [
        'Perfiles ilimitados de mascotas',
        'Reservas prioritarias',
        'Descuentos del 15% en servicios',
        'Recordatorios inteligentes de salud',
        'Historial médico detallado',
        'Soporte 24/7',
      ],
      isPopular: true,
    },
    {
      name: 'Familiar',
      price: '$15.990',
      period: 'mes',
      features: [
        'Todo lo del plan Premium',
        'Hasta 10 perfiles de mascotas',
        'Descuentos del 25% en servicios',
        'Plan de salud personalizado',
        'Consultoría veterinaria mensual',
        'Aplicación para toda la familia',
      ],
    },
  ];

  readonly appointments: Appointment[] = [
    {
      id: '1',
      petName: 'Max',
      providerName: 'Dr. María González',
      service: 'Consulta General',
      date: '22 de octubre',
      time: '10:30',
      status: 'confirmed',
    },
    {
      id: '2',
      petName: 'Luna',
      providerName: 'Carlos Mendoza',
      service: 'Paseo Vespertino',
      date: '23 de octubre',
      time: '18:00',
      status: 'pending',
    },
  ];

  get statusBadgeColor(): Record<Appointment['status'], string> {
    return {
      confirmed: 'success',
      pending: 'warning',
      completed: 'medium',
    };
  }

  trackByIndex(index: number): number {
    return index;
  }
}
