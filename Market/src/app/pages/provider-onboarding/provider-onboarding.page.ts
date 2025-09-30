import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  sparklesOutline,
  documentTextOutline,
  calendarOutline,
  peopleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-provider-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonButton
  ],
  template: `
    <ion-content class="provider-onboarding-content">
      <ion-header class="marketpet-header" collapse="condense">
        <ion-toolbar>
          <ion-title>¡Bienvenido a MarketPet Pro!</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="onboarding-wrapper ion-padding">
        <ion-card class="welcome-card marketpet-card">
          <ion-card-content>
            <div class="welcome-header">
              <ion-icon name="sparkles-outline"></ion-icon>
              <div>
                <h2>Configura tu perfil profesional</h2>
                <p>Sigue estos pasos para comenzar a recibir reservas de clientes.</p>
              </div>
            </div>

            <ion-list lines="none" class="steps-list">
              <ion-item>
                <ion-icon name="document-text-outline" slot="start"></ion-icon>
                <ion-label>
                  <h3>Completa tu perfil</h3>
                  <p>Agrega fotos, certificaciones y una descripción detallada de tus servicios.</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-icon name="calendar-outline" slot="start"></ion-icon>
                <ion-label>
                  <h3>Define tu disponibilidad</h3>
                  <p>Configura tus horarios para que los clientes reserven en los momentos adecuados.</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-icon name="people-outline" slot="start"></ion-icon>
                <ion-label>
                  <h3>Gestiona tus servicios</h3>
                  <p>Crea paquetes personalizados y establece tus precios con claridad.</p>
                </ion-label>
              </ion-item>
            </ion-list>

            <div class="action-buttons">
              <ion-button expand="block" (click)="goToDashboard()" color="primary">
                Ir al panel de proveedor
              </ion-button>
              <ion-button expand="block" fill="outline" (click)="goToProfile()">
                Completar mi perfil ahora
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .provider-onboarding-content {
      --background: var(--ion-color-light);
    }

    .onboarding-wrapper {
      max-width: 640px;
      margin: 0 auto;
    }

    .welcome-card {
      margin-top: 2rem;
      border-radius: 24px;
      box-shadow: var(--marketpet-shadow);
    }

    .welcome-header {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .welcome-header ion-icon {
      font-size: 2.5rem;
      color: var(--ion-color-primary);
    }

    .steps-list ion-item {
      --padding-start: 0;
      --padding-end: 0;
      margin-bottom: 1rem;
      align-items: flex-start;
    }

    .steps-list ion-icon {
      font-size: 1.5rem;
      margin-right: 1rem;
      margin-top: 0.25rem;
      color: var(--ion-color-primary);
    }

    .steps-list h3 {
      margin: 0 0 0.25rem 0;
      font-weight: 600;
      color: var(--ion-color-dark);
    }

    .steps-list p {
      margin: 0;
      color: var(--ion-color-medium);
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 2rem;
    }
  `]
})
export class ProviderOnboardingPage {
  private router = inject(Router);

  constructor() {
    addIcons({ sparklesOutline, documentTextOutline, calendarOutline, peopleOutline });
  }

  goToDashboard() {
    this.router.navigate(['/provider-dashboard'], { replaceUrl: true });
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
