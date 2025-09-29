import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface HeroHighlight {
  icon: string;
  title: string;
  description: string;
}

interface BenefitCard {
  icon: string;
  title: string;
  description: string;
}

interface WorkflowStep {
  number: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  searchQuery = '';

  heroHighlights: HeroHighlight[] = [
    {
      icon: 'shield-checkmark-outline',
      title: 'Profesionales verificados',
      description: 'Calificaciones transparentes y perfiles auditados para tu tranquilidad.',
    },
    {
      icon: 'time-outline',
      title: 'Reservas flexibles',
      description: 'Agenda en minutos y administra tus citas desde cualquier dispositivo.',
    },
    {
      icon: 'gift-outline',
      title: 'Beneficios exclusivos',
      description: 'Accede a promociones y recomendaciones personalizadas para cada mascota.',
    },
  ];

  stats = [
    { value: '1200+', label: 'Productos especializados' },
    { value: '450+', label: 'Servicios profesionales' },
    { value: '320+', label: 'Proveedores verificados' },
  ];

  trustedBrands: string[] = ['PetLife', 'Vet&Care', 'HappyTails', 'PawHub', 'Guardianes 24/7'];

  benefits: BenefitCard[] = [
    {
      icon: 'flash-outline',
      title: 'Búsqueda inteligente',
      description: 'Filtra por especie, necesidades y ubicación para encontrar la solución ideal.',
    },
    {
      icon: 'bar-chart-outline',
      title: 'Gestión centralizada',
      description: 'Controla pagos, citas y seguimiento desde un panel diseñado para proveedores.',
    },
    {
      icon: 'earth-outline',
      title: 'Cobertura nacional',
      description: 'Conecta con especialistas locales y servicios remotos en todo el país.',
    },
  ];

  workflowSteps: WorkflowStep[] = [
    {
      number: '01',
      title: 'Explora y compara',
      description: 'Descubre proveedores, productos y experiencias pensadas para cada tipo de mascota.',
    },
    {
      number: '02',
      title: 'Reserva en minutos',
      description: 'Agenda o compra de forma segura con disponibilidad en tiempo real y pagos protegidos.',
    },
    {
      number: '03',
      title: 'Recibe seguimiento',
      description: 'Evalúa tu experiencia, guarda favoritos y recibe recomendaciones personalizadas.',
    },
  ];

  quickActions = [
    { label: 'Veterinario', icon: 'medical-outline', color: 'primary' },
    { label: 'Baño y grooming', icon: 'cut-outline', color: 'tertiary' },
    { label: 'Entrenamiento', icon: 'ribbon-outline', color: 'success' },
    { label: 'Paseos', icon: 'walk-outline', color: 'warning' },
  ];

  categories = [
    {
      name: 'Alimentos premium',
      description: 'Nutrición especializada por etapa y especie.',
      icon: 'fast-food-outline',
      color: 'category-primary',
    },
    {
      name: 'Salud y bienestar',
      description: 'Atención veterinaria, vacunas y seguros.',
      icon: 'medkit-outline',
      color: 'category-secondary',
    },
    {
      name: 'Cuidado diario',
      description: 'Grooming, guarderías y paseadores certificados.',
      icon: 'paw-outline',
      color: 'category-tertiary',
    },
    {
      name: 'Accesorios',
      description: 'Juguetes, camas, ropa y más para consentirlos.',
      icon: 'gift-outline',
      color: 'category-quaternary',
    },
  ];

  trendingItems = [
    {
      name: 'Kit de bienvenida para cachorros',
      description: 'Incluye alimento balanceado, snacks y juguetes sensoriales.',
      price: '$49.900',
      type: 'Producto',
      image:
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Consulta veterinaria a domicilio',
      description: 'Profesionales certificados para evaluaciones integrales.',
      price: '$35.000',
      type: 'Servicio',
      image:
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Sesión de grooming premium',
      description: 'Spa completo con productos hipoalergénicos.',
      price: '$28.500',
      type: 'Servicio',
      image:
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    },
  ];

  providers = [
    {
      name: 'Clínica Huellitas',
      speciality: 'Veterinaria integral 24/7',
      rating: '4.9',
      avatar:
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Happy Groom',
      speciality: 'Estética y spa para mascotas',
      rating: '4.8',
      avatar:
        'https://images.unsplash.com/photo-1558944351-c0d21a5708f4?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Pet Trainers Co.',
      speciality: 'Entrenamiento positivo personalizado',
      rating: '4.7',
      avatar:
        'https://images.unsplash.com/photo-1563461660947-507ef49e9c1b?auto=format&fit=crop&w=300&q=80',
    },
  ];

  testimonials = [
    {
      name: 'Mariana & Nina',
      comment:
        'Encontré un veterinario de confianza para mi gata mayor y todo el proceso fue rápido y seguro.',
      petType: 'Gato adulto',
    },
    {
      name: 'Diego & Max',
      comment:
        'Las recomendaciones personalizadas hicieron que Max se adaptara perfecto a su nueva dieta.',
      petType: 'Perro mediano',
    },
    {
      name: 'Camila & Coco',
      comment:
        'Reservé grooming a domicilio en minutos y el servicio superó nuestras expectativas.',
      petType: 'Perro pequeño',
    },
  ];

  private readonly router = inject(Router);

  navigateToMarketplace(): void {
    this.router.navigate(['/feed'], {
      queryParams: this.searchQuery ? { q: this.searchQuery } : undefined,
    });
  }

  navigateToProviderRegistration(): void {
    this.router.navigate(['/registro'], {
      queryParams: { role: 'proveedor' },
    });
  }
}
