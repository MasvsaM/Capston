import { Component } from '@angular/core';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent,
  IonButton, IonIcon, IonBadge, IonList, IonItem, IonLabel, IonCheckbox
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline, starOutline } from 'ionicons/icons';

@Component({
  selector: 'app-subscription',
  template: `
    <ion-content>
      <!-- Header -->
      <ion-header class="marketpet-header">
        <ion-toolbar>
          <ion-title>Planes y Suscripciones</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="content-container">
        <!-- Current Plan -->
        <ion-card class="current-plan-card">
          <ion-card-content>
            <div class="current-plan-header">
              <h3>Plan Actual</h3>
              <ion-badge color="secondary">Básico</ion-badge>
            </div>
            <p>Tienes acceso a funciones básicas. Mejora tu plan para obtener más beneficios.</p>
            <ion-button expand="block" fill="outline" size="small">
              Ver Beneficios Premium
            </ion-button>
          </ion-card-content>
        </ion-card>

        <!-- Subscription Plans -->
        <div class="plans-section">
          <h3>Planes Disponibles</h3>
          
          <div class="plans-list">
            <!-- Basic Plan -->
            <ion-card class="plan-card current">
              <ion-card-content>
                <div class="plan-header">
                  <h4>Básico</h4>
                  <div class="plan-price">
                    <span class="price">Gratis</span>
                    <span class="period">/mes</span>
                  </div>
                </div>
                
                <ion-list class="features-list">
                  <ion-item *ngFor="let feature of basicFeatures">
                    <ion-icon name="checkmark-outline" slot="start" color="success"></ion-icon>
                    <ion-label>{{ feature }}</ion-label>
                  </ion-item>
                </ion-list>
                
                <ion-button expand="block" disabled>
                  Plan Actual
                </ion-button>
              </ion-card-content>
            </ion-card>

            <!-- Premium Plan -->
            <ion-card class="plan-card popular">
              <ion-card-content>
                <div class="plan-header">
                  <div class="plan-title">
                    <h4>Premium</h4>
                    <ion-badge color="warning">Popular</ion-badge>
                  </div>
                  <div class="plan-price">
                    <span class="price">$9.990</span>
                    <span class="period">/mes</span>
                  </div>
                </div>
                
                <ion-list class="features-list">
                  <ion-item *ngFor="let feature of premiumFeatures">
                    <ion-icon name="checkmark-outline" slot="start" color="success"></ion-icon>
                    <ion-label>{{ feature }}</ion-label>
                  </ion-item>
                </ion-list>
                
                <ion-button expand="block" color="warning">
                  Actualizar a Premium
                </ion-button>
              </ion-card-content>
            </ion-card>

            <!-- Family Plan -->
            <ion-card class="plan-card">
              <ion-card-content>
                <div class="plan-header">
                  <h4>Familiar</h4>
                  <div class="plan-price">
                    <span class="price">$15.990</span>
                    <span class="period">/mes</span>
                  </div>
                </div>
                
                <ion-list class="features-list">
                  <ion-item *ngFor="let feature of familyFeatures">
                    <ion-icon name="checkmark-outline" slot="start" color="success"></ion-icon>
                    <ion-label>{{ feature }}</ion-label>
                  </ion-item>
                </ion-list>
                
                <ion-button expand="block">
                  Elegir Plan Familiar
                </ion-button>
              </ion-card-content>
            </ion-card>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .content-container {
      padding: 1rem;
    }

    .current-plan-card {
      margin-bottom: 2rem;
    }

    .current-plan-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .current-plan-header h3 {
      margin: 0;
      font-weight: 600;
    }

    .plans-section h3 {
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .plans-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .plan-card {
      position: relative;
      border-radius: 16px;
    }

    .plan-card.current {
      border: 2px solid var(--ion-color-primary);
    }

    .plan-card.popular {
      border: 2px solid var(--ion-color-warning);
    }

    .plan-card.popular::before {
      content: '⭐ Más Popular';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--ion-color-warning);
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .plan-header {
      margin-bottom: 1.5rem;
    }

    .plan-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .plan-header h4 {
      font-size: 1.3rem;
      font-weight: 600;
      margin: 0;
      color: var(--ion-color-dark);
    }

    .plan-price {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
    }

    .price {
      font-size: 2rem;
      font-weight: 700;
      color: var(--ion-color-primary);
    }

    .period {
      font-size: 1rem;
      color: var(--ion-color-medium);
    }

    .features-list {
      margin: 1.5rem 0;
      padding: 0;
    }

    .features-list ion-item {
      --padding-start: 0;
      --padding-end: 0;
      --inner-padding-end: 0;
      --border-color: transparent;
      font-size: 0.9rem;
    }

    .features-list ion-icon {
      margin-right: 0.5rem;
    }
  `],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent,
    IonButton, IonIcon, IonBadge, IonList, IonItem, IonLabel, IonCheckbox
  ]
})
export class SubscriptionPage {
  basicFeatures = [
    'Crear hasta 2 perfiles de mascotas',
    'Búsqueda básica de proveedores',
    'Reservas estándar',
    'Recordatorios básicos'
  ];

  premiumFeatures = [
    'Perfiles ilimitados de mascotas',
    'Reservas prioritarias',
    'Descuentos del 15% en servicios',
    'Recordatorios inteligentes de salud',
    'Historial médico detallado',
    'Soporte 24/7'
  ];

  familyFeatures = [
    'Todo lo del plan Premium',
    'Hasta 10 perfiles de mascotas',
    'Descuentos del 25% en servicios',
    'Plan de salud personalizado',
    'Consultoría veterinaria mensual',
    'Aplicación para toda la familia'
  ];

  constructor() {
    addIcons({ checkmarkOutline, starOutline });
  }
}